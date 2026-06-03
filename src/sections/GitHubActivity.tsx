import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Github, Star, GitFork, ExternalLink } from 'lucide-react';
import TiltCard from '../components/TiltCard';

gsap.registerPlugin(ScrollTrigger);

interface Repo {
  name: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  url: string;
}

const fallbackRepos: Repo[] = [
  {
    name: 'OmniGraph',
    description: 'Distributed RAG-MCP server for AI code assistance',
    stars: 12,
    forks: 2,
    language: 'Python',
    url: 'https://github.com/h3nr1-d14z/OmniGraph',
  },
  {
    name: 'ai-redteam-toolkit',
    description: 'AI-powered offensive security framework',
    stars: 45,
    forks: 8,
    language: 'Python',
    url: 'https://github.com/h3nr1-d14z/ai-redteam-toolkit',
  },
  {
    name: 'nat-gate',
    description: 'CLI tool for iptables port forwarding through Tailscale',
    stars: 28,
    forks: 3,
    language: 'Rust',
    url: 'https://github.com/h3nr1-d14z/nat-gate',
  },
  {
    name: 'codeforces-minecraft',
    description: 'Minecraft mod for competitive programming problems',
    stars: 67,
    forks: 5,
    language: 'Java',
    url: 'https://github.com/h3nr1-d14z/codeforces-minecraft',
  },
];

export default function GitHubActivity() {
  const sectionRef = useRef<HTMLElement>(null);
  const [repos, setRepos] = useState<Repo[]>(fallbackRepos);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const res = await fetch('https://api.github.com/users/h3nr1-d14z/repos?sort=updated&per_page=6');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        const mapped: Repo[] = data.map((r: any) => ({
          name: r.name,
          description: r.description || 'No description',
          stars: r.stargazers_count,
          forks: r.forks_count,
          language: r.language || 'Unknown',
          url: r.html_url,
        }));
        setRepos(mapped);
      } catch {
        // fallback already set
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
      },
    });

    tl.fromTo(
      section.querySelector('.github__title'),
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
    );

    tl.fromTo(
      section.querySelectorAll('.github__card'),
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease: 'power2.out' },
      '-=0.4'
    );

    return () => { tl.kill(); };
  }, []);

  const langColors: Record<string, string> = {
    Python: '#3572A5',
    Rust: '#dea584',
    TypeScript: '#3178c6',
    JavaScript: '#f1e05a',
    Java: '#b07219',
    Go: '#00ADD8',
    'C++': '#f34b7d',
  };

  return (
    <section ref={sectionRef} className="github" id="github">
      <h2 className="github__title">
        <Github size={28} style={{ marginRight: '12px', verticalAlign: 'middle' }} />
        GITHUB ACTIVITY
      </h2>

      {loading && <div className="github__loading">Loading repositories...</div>}

      <div className="github__grid">
        {repos.map(repo => (
          <TiltCard key={repo.name} className="github__card-wrap">
            <a
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="github__card"
            >
              <div className="github__card-header">
                <span className="github__repo-name">{repo.name}</span>
                <ExternalLink size={16} className="github__icon" />
              </div>
              <p className="github__desc">{repo.description}</p>
              <div className="github__meta">
                <span className="github__lang">
                  <span
                    className="github__lang-dot"
                    style={{ backgroundColor: langColors[repo.language] || '#888' }}
                  />
                  {repo.language}
                </span>
                <span className="github__stat">
                  <Star size={14} /> {repo.stars}
                </span>
                <span className="github__stat">
                  <GitFork size={14} /> {repo.forks}
                </span>
              </div>
            </a>
          </TiltCard>
        ))}
      </div>
    </section>
  );
}
