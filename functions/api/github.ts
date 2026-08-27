/**
 * Proxy GitHub repos cho section "GitHub Activity".
 *
 * Ba lý do phải đi qua đây thay vì gọi thẳng api.github.com từ trình duyệt:
 *
 * 1. Rate limit. Không token thì GitHub cho 60 request/giờ/IP. Mỗi khách vào
 *    trang là một request, nên đến lượt khách thứ 61 là section vỡ. Cache KV
 *    30 phút kéo xuống còn 2 request/giờ cho toàn bộ site.
 * 2. Lọc. `sort=updated` kéo lên đúng những repo tệ nhất — repo khách hàng,
 *    repo nháp không mô tả, và cả chính cái portfolio này.
 * 3. Token (tuỳ chọn) được giữ ở server, không lộ ra bundle.
 */

export interface Env {
  VISITOR_KV: KVNamespace;
  GITHUB_TOKEN?: string;
}

const LOGIN = 'h3nr1-d14z';
const CACHE_KEY = 'gh:activity:v1';
const CACHE_TTL_SECONDS = 1800; // 30 phút
const MAX_REPOS = 6;

/** Repo hợp lệ nhưng không nên đại diện cho profile. */
const DENYLIST = new Set([
  'bioh3nr1d14z', // chính trang này
  'h3nr1-d14z',   // profile README
  'app-ads.txt',
]);

interface GitHubRepo {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  pushed_at: string;
  fork: boolean;
  archived: boolean;
  private: boolean;
  topics?: string[];
}

export interface RepoSummary {
  name: string;
  description: string;
  url: string;
  language: string | null;
  stars: number;
  forks: number;
  pushedAt: string;
}

export interface LanguageSlice {
  name: string;
  repos: number;
  share: number; // phần trăm, đã làm tròn
}

export interface ActivityPayload {
  repos: RepoSummary[];
  languages: LanguageSlice[];
  totalPublicRepos: number;
  generatedAt: string;
}

/**
 * Repo đáng đưa lên trang: không phải fork, còn hoạt động, và có mô tả
 * (repo không mô tả trông như bị bỏ hoang, kể cả khi nó không phải vậy).
 */
function isPresentable(repo: GitHubRepo): boolean {
  if (repo.fork || repo.archived || repo.private) return false;
  if (DENYLIST.has(repo.name)) return false;
  // Mô tả là bắt buộc, kể cả khi repo có sao. Một repo 1 sao không mô tả vẫn
  // hiện ra thành thẻ "No description" — đúng thứ làm profile trông bỏ hoang.
  return Boolean(repo.description && repo.description.trim());
}

/** Sao trước, rồi đến độ mới. */
function rank(a: GitHubRepo, b: GitHubRepo): number {
  if (b.stargazers_count !== a.stargazers_count) {
    return b.stargazers_count - a.stargazers_count;
  }
  return Date.parse(b.pushed_at) - Date.parse(a.pushed_at);
}

function summarise(repo: GitHubRepo): RepoSummary {
  return {
    name: repo.name,
    description: (repo.description || '').trim(),
    url: repo.html_url,
    language: repo.language,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    pushedAt: repo.pushed_at,
  };
}

/**
 * Phân bổ ngôn ngữ tính theo số repo dùng ngôn ngữ đó làm ngôn ngữ chính.
 * Cố ý không gọi /languages cho từng repo: 44 repo là 44 subrequest, sát
 * trần subrequest của Workers mà đổi lại độ chính xác không đáng kể.
 */
function languageBreakdown(repos: GitHubRepo[]): LanguageSlice[] {
  const counts = new Map<string, number>();
  for (const repo of repos) {
    if (!repo.language) continue;
    counts.set(repo.language, (counts.get(repo.language) || 0) + 1);
  }

  const total = [...counts.values()].reduce((sum, n) => sum + n, 0);
  if (total === 0) return [];

  return [...counts.entries()]
    .map(([name, count]) => ({
      name,
      repos: count,
      share: Math.round((count / total) * 1000) / 10,
    }))
    .sort((a, b) => b.repos - a.repos)
    .slice(0, 8);
}

async function fetchActivity(env: Env): Promise<ActivityPayload> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'bioh3nr1d14z-portfolio',
  };
  if (env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${env.GITHUB_TOKEN}`;
  }

  const res = await fetch(
    `https://api.github.com/users/${LOGIN}/repos?per_page=100&sort=pushed`,
    { headers }
  );
  if (!res.ok) {
    throw new Error(`GitHub trả về ${res.status}`);
  }

  const all = (await res.json()) as GitHubRepo[];
  const owned = all.filter((r) => !r.fork && !r.archived && !r.private);

  return {
    repos: owned.filter(isPresentable).sort(rank).slice(0, MAX_REPOS).map(summarise),
    languages: languageBreakdown(owned),
    // Đếm trên `owned` chứ không phải `all`: phân bổ ngôn ngữ cũng tính trên
    // `owned`, nên nhãn "N public repos" phải cùng mẫu thì mới đúng.
    totalPublicRepos: owned.length,
    generatedAt: new Date().toISOString(),
  };
}

const JSON_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  // Cache cạnh của Cloudflare, tính bằng giây.
  'Cache-Control': 'public, max-age=300, stale-while-revalidate=1800',
};

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { env } = context;

  try {
    const cached = await env.VISITOR_KV.get(CACHE_KEY);
    if (cached) {
      return new Response(cached, { status: 200, headers: JSON_HEADERS });
    }
  } catch {
    // KV lỗi thì đi tiếp, gọi thẳng GitHub.
  }

  let payload: ActivityPayload;
  try {
    payload = await fetchActivity(env);
  } catch {
    // Không bịa dữ liệu. Trả mảng rỗng để client tự ẩn section — thà không
    // hiện gì còn hơn hiện số sao sai.
    return new Response(
      JSON.stringify({ repos: [], languages: [], totalPublicRepos: 0, generatedAt: null }),
      { status: 200, headers: { ...JSON_HEADERS, 'Cache-Control': 'no-store' } }
    );
  }

  const body = JSON.stringify(payload);
  try {
    await env.VISITOR_KV.put(CACHE_KEY, body, { expirationTtl: CACHE_TTL_SECONDS });
  } catch {
    // Ghi cache hỏng không phải lý do để hỏng response.
  }

  return new Response(body, { status: 200, headers: JSON_HEADERS });
};

export const onRequestOptions: PagesFunction<Env> = async () =>
  new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
