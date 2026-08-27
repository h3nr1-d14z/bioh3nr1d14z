/**
 * Writeup được viết bằng Markdown trong src/content/writeups/ và gom lại lúc
 * build bằng import.meta.glob. Không CMS, không database: thêm một bài =
 * thêm một file .md rồi push.
 *
 * Frontmatter cố ý tự parse thay vì dùng gray-matter — thư viện đó phụ thuộc
 * Buffer của Node nên vỡ trong bundle trình duyệt.
 */

export type Category = 'pwn' | 'web' | 'crypto' | 'rev' | 'forensics' | 'misc';

export const CATEGORIES: Category[] = ['pwn', 'web', 'crypto', 'rev', 'forensics', 'misc'];

export const CATEGORY_LABELS: Record<Category, string> = {
  pwn: 'Pwn',
  web: 'Web',
  crypto: 'Crypto',
  rev: 'Reverse',
  forensics: 'Forensics',
  misc: 'Misc',
};

export interface WriteupMeta {
  slug: string;
  title: string;
  ctf: string;
  category: Category;
  difficulty: 'easy' | 'medium' | 'hard' | 'insane';
  points: number | null;
  date: string;
  tags: string[];
  summary: string;
  draft: boolean;
  readingMinutes: number;
}

export interface Writeup extends WriteupMeta {
  body: string;
}

type Scalar = string | number | boolean | string[];

/**
 * Parse YAML tối giản: đủ cho `key: value`, chuỗi có nháy, số, boolean và
 * mảng inline `[a, b, c]`. Không hỗ trợ lồng nhau — frontmatter writeup
 * không cần, và giữ nó nhỏ thì không phải kéo cả parser YAML vào bundle.
 */
function parseScalar(raw: string): Scalar {
  // Cắt comment cuối dòng: `draft: true  # ghi chú`. Chỉ cắt khi trước dấu #
  // có khoảng trắng, để không phá giá trị chứa # (mã màu, hashtag).
  const value = raw.replace(/\s+#.*$/, '').trim();

  if (value.startsWith('[') && value.endsWith(']')) {
    return value
      .slice(1, -1)
      .split(',')
      .map((item) => item.trim().replace(/^["']|["']$/g, ''))
      .filter(Boolean);
  }

  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  if (value === 'true') return true;
  if (value === 'false') return false;
  if (value !== '' && !Number.isNaN(Number(value))) return Number(value);

  return value;
}

function parseFrontmatter(source: string): { data: Record<string, Scalar>; body: string } {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(source);
  if (!match) return { data: {}, body: source };

  const data: Record<string, Scalar> = {};
  for (const line of match[1].split(/\r?\n/)) {
    if (!line.trim() || line.trimStart().startsWith('#')) continue;
    const sep = line.indexOf(':');
    if (sep === -1) continue;
    data[line.slice(0, sep).trim()] = parseScalar(line.slice(sep + 1));
  }

  return { data, body: source.slice(match[0].length) };
}

function asString(value: Scalar | undefined, fallback = ''): string {
  return typeof value === 'string' ? value : value === undefined ? fallback : String(value);
}

function asStringArray(value: Scalar | undefined): string[] {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string' && value.trim()) return [value.trim()];
  return [];
}

/** ~200 từ/phút, trừ đi code block vì người đọc lướt code nhanh hơn văn xuôi. */
function readingMinutes(body: string): number {
  const prose = body.replace(/```[\s\S]*?```/g, ' ');
  const words = prose.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function isCategory(value: string): value is Category {
  return (CATEGORIES as string[]).includes(value);
}

const modules = import.meta.glob<string>('../content/writeups/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});

function build(): Writeup[] {
  return Object.entries(modules)
    // File bắt đầu bằng "_" là template/ghi chú, không phải bài viết.
    .filter(([path]) => !path.split('/').pop()!.startsWith('_'))
    .map(([path, source]) => {
      const { data, body } = parseFrontmatter(source);
      const fileSlug = path.split('/').pop()!.replace(/\.md$/, '');
      const category = asString(data.category, 'misc');

      return {
        slug: asString(data.slug, fileSlug),
        title: asString(data.title, fileSlug),
        ctf: asString(data.ctf, 'Unknown CTF'),
        category: isCategory(category) ? category : 'misc',
        difficulty: (['easy', 'medium', 'hard', 'insane'] as const).find(
          (d) => d === asString(data.difficulty)
        ) ?? 'medium',
        points: typeof data.points === 'number' ? data.points : null,
        date: asString(data.date),
        tags: asStringArray(data.tags),
        summary: asString(data.summary),
        draft: data.draft === true,
        readingMinutes: readingMinutes(body),
        body,
      } satisfies Writeup;
    })
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

const all = build();

/** Bài draft không lên danh sách và không vào sitemap, nhưng mở thẳng URL vẫn xem được. */
export const writeups: Writeup[] = all.filter((w) => !w.draft);

export function getWriteup(slug: string): Writeup | undefined {
  return all.find((w) => w.slug === slug);
}

/** Chỉ những category thật sự có bài, để không hiện bộ lọc rỗng. */
export function activeCategories(): Category[] {
  const used = new Set(writeups.map((w) => w.category));
  return CATEGORIES.filter((c) => used.has(c));
}

export function formatDate(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}
