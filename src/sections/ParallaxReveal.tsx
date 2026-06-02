import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Project {
  name: string;
  description: string;
  tags: string[];
  image: string;
  repo: string;
}

const projectPairs: [Project, Project][] = [
  [
    {
      name: 'OmniGraph',
      description: 'Distributed RAG-MCP server for AI code assistance: local-first, read-only, hybrid semantic + lexical search over Qdrant + Memgraph + Tree-sitter, with a Go file watcher and 4-tool MCP bridge to Claude Code.',
      tags: ['Python', 'Go', 'Qdrant', 'Memgraph'],
      image: '/images/img-2.jpg',
      repo: 'https://github.com/h3nr1-d14z/OmniGraph',
    },
    {
      name: 'ai-redteam-toolkit',
      description: 'AI-powered offensive security framework. 78 slash commands for pentest, red team, RE, game hacking, OSINT, forensics. Works with Claude Code & OpenCode.',
      tags: ['Python', 'Security', 'AI', 'Offensive'],
      image: '/images/img-1.jpg',
      repo: 'https://github.com/h3nr1-d14z/ai-redteam-toolkit',
    },
  ],
  [
    {
      name: 'nat-gate',
      description: 'CLI tool for iptables port forwarding through Tailscale tunnels. Interactive TUI, multiple install methods, IPv4/IPv6, rate limiting.',
      tags: ['Rust', 'CLI', 'Networking', 'Tailscale'],
      image: '/images/img-3.jpg',
      repo: 'https://github.com/h3nr1-d14z/nat-gate',
    },
    {
      name: 'codeforces-minecraft',
      description: 'Minecraft mod where players solve competitive programming problems for in-game rewards. ICPC-style scoring, because why not.',
      tags: ['Java', 'Fabric', 'Minecraft', 'Gaming'],
      image: '/images/img-4.jpg',
      repo: 'https://github.com/h3nr1-d14z/codeforces-minecraft',
    },
  ],
  [
    {
      name: 'memviz',
      description: 'C++ memory & algorithm visualizer built for students who learn by seeing.',
      tags: ['TypeScript', 'React', 'Education', 'C++'],
      image: '/images/img-5.jpg',
      repo: 'https://github.com/h3nr1-d14z/memviz',
    },
    {
      name: 'messenger-desktop',
      description: 'Unofficial Messenger desktop app with native features.',
      tags: ['TypeScript', 'Electron', 'Desktop'],
      image: '/images/img-6.jpg',
      repo: 'https://github.com/h3nr1-d14z/messenger-desktop',
    },
  ],
];

function createParallaxReveal(el: HTMLImageElement) {
  const wrapper = el.closest('.reveal__image-wrapper') as HTMLElement;
  const item = el.closest('.reveal__item') as HTMLElement;
  if (!wrapper || !item) return null;

  const tl = gsap.timeline({
    defaults: { ease: 'power2.out' },
    scrollTrigger: {
      trigger: item,
      start: 'top 80%',
      end: 'top 20%',
      scrub: true,
    },
  });

  tl.fromTo(el, { scale: 1.3 }, { scale: 1 }, 0);
  tl.fromTo(wrapper, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)' }, 0);

  return tl;
}

function ProjectItem({ project, reverse }: { project: Project; reverse?: boolean }) {
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imageRef.current;
    if (!img) return;

    const tl = createParallaxReveal(img);

    return () => {
      if (tl) tl.kill();
    };
  }, []);

  return (
    <div className={`reveal__item${reverse ? ' reveal__item--reverse' : ''}`}>
      <div className="reveal__image-block">
        <div className="reveal__image-wrapper">
          <img
            ref={imageRef}
            className="reveal__image"
            src={project.image}
            alt={project.name}
          />
        </div>
      </div>
      <div className="reveal__text-block">
        <h3 className="reveal__title">{project.name}</h3>
        <p className="reveal__desc">{project.description}</p>
        <div className="reveal__tags">
          {project.tags.map((tag) => (
            <span key={tag} className="reveal__tag">{tag}</span>
          ))}
        </div>
        <a
          href={project.repo}
          target="_blank"
          rel="noopener noreferrer"
          className="reveal__cta"
        >
          VIEW SOURCE &rarr;
        </a>
      </div>
    </div>
  );
}

export default function ParallaxReveal() {
  return (
    <section className="reveal__section">
      <div className="reveal__wrapper">
        {projectPairs.map((pair, pairIndex) => (
          <div key={pairIndex}>
            <ProjectItem project={pair[0]} reverse={pairIndex % 2 !== 0} />
            <ProjectItem project={pair[1]} reverse={pairIndex % 2 === 0} />
          </div>
        ))}
      </div>
    </section>
  );
}
