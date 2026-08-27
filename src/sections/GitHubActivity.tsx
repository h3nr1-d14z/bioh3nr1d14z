import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Github, Star, GitFork, ExternalLink } from 'lucide-react';
import TiltCard from '../components/TiltCard';
import { prefersReducedMotion, revealInstantly } from '../lib/motion';

gsap.registerPlugin(ScrollTrigger);

interface Repo {
  name: string;
  description: string;
  url: string;
  language: string | null;
  stars: number;
  forks: number;
  pushedAt: string;
}

interface LanguageSlice {
  name: string;
  repos: number;
  share: number;
}

interface ActivityPayload {
  repos: Repo[];
  languages: LanguageSlice[];
  totalPublicRepos: number;
}

const LANG_COLORS: Record<string, string> = {
  Python: '#3572A5',
  Rust: '#dea584',
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Java: '#b07219',
  Go: '#00ADD8',
  'C++': '#f34b7d',
  'C#': '#178600',
  PHP: '#4F5D95',
  Shell: '#89e051',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Dockerfile: '#384d54',
  Groovy: '#4298b8',
};

function langColor(name: string | null): string {
  return (name && LANG_COLORS[name]) || '#8b8b8b';
}

/** "3d ago" đọc nhanh hơn "2026-08-24" khi lướt qua. */
function relativeTime(iso: string): string {
  const days = Math.floor((Date.now() - Date.parse(iso)) / 86_400_000);
  if (days < 1) return 'today';
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

export default function GitHubActivity() {
  const sectionRef = useRef<HTMLElement>(null);
  const [data, setData] = useState<ActivityPayload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetch('/api/github')
      .then((res) => {
        if (!res.ok) throw new Error(String(res.status));
        return res.json() as Promise<ActivityPayload>;
      })
      .then((payload) => {
        if (!cancelled) setData(payload);
      })
      .catch(() => {
        // Cố ý không có dữ liệu dự phòng: trước đây fallback ghi 67 sao cho
        // repo thực tế có 1 sao, nên mỗi lần rate-limit là khách thấy số sai.
        if (!cancelled) setData(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const repos = data?.repos ?? [];

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || repos.length === 0) return;

    if (prefersReducedMotion()) {
      revealInstantly(section, ['.github__title', '.github__card', '.github__langs']);
      return;
    }

    const tl = gsap.timeline({
      scrollTrigger: { trigger: section, start: 'top 80%' },
    });

    tl.fromTo(
      section.querySelector('.github__title'),
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
    );

    tl.fromTo(
      section.querySelector('.github__langs'),
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
      '-=0.5'
    );

    tl.fromTo(
      section.querySelectorAll('.github__card'),
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, stagger: 0.08, duration: 0.6, ease: 'power2.out' },
      '-=0.35'
    );

    return () => {
      tl.kill();
    };
  }, [repos.length]);

  // Không có dữ liệu thì ẩn hẳn section thay vì để lại một khung rỗng.
  if (!loading && repos.length === 0) return null;

  return (
    <section ref={sectionRef} className="github" id="github">
      <h2 className="github__title">
        <Github size={28} aria-hidden="true" />
        <span>GitHub Activity</span>
      </h2>

      {loading && <div className="github__loading">Loading repositories…</div>}

      {data && data.languages.length > 0 && (
        <div className="github__langs">
          <div
            className="github__langs-bar"
            role="img"
            aria-label={`Language mix: ${data.languages
              .map((l) => `${l.name} ${l.share}%`)
              .join(', ')}`}
          >
            {data.languages.map((lang) => (
              <span
                key={lang.name}
                className="github__langs-seg"
                style={{ width: `${lang.share}%`, backgroundColor: langColor(lang.name) }}
              />
            ))}
          </div>
          <ul className="github__langs-legend">
            {data.languages.slice(0, 6).map((lang) => (
              <li key={lang.name} className="github__langs-item">
                <span
                  className="github__lang-dot"
                  style={{ backgroundColor: langColor(lang.name) }}
                />
                {lang.name}
                <span className="github__langs-share">{lang.share}%</span>
              </li>
            ))}
          </ul>
          <p className="github__langs-note">
            Across {data.totalPublicRepos} public repos, by each repo&apos;s primary language.
          </p>
        </div>
      )}

      <div className="github__grid">
        {repos.map((repo) => (
          <TiltCard key={repo.name} className="github__card-wrap">
            <a href={repo.url} target="_blank" rel="noopener noreferrer" className="github__card">
              <div className="github__card-header">
                <span className="github__repo-name">{repo.name}</span>
                <ExternalLink size={16} className="github__icon" aria-hidden="true" />
              </div>
              <p className="github__desc">{repo.description}</p>
              <div className="github__meta">
                {repo.language && (
                  <span className="github__lang">
                    <span
                      className="github__lang-dot"
                      style={{ backgroundColor: langColor(repo.language) }}
                    />
                    {repo.language}
                  </span>
                )}
                <span className="github__stat">
                  <Star size={14} aria-hidden="true" /> {repo.stars}
                </span>
                <span className="github__stat">
                  <GitFork size={14} aria-hidden="true" /> {repo.forks}
                </span>
                <span className="github__stat github__stat--pushed">
                  {relativeTime(repo.pushedAt)}
                </span>
              </div>
            </a>
          </TiltCard>
        ))}
      </div>
    </section>
  );
}
