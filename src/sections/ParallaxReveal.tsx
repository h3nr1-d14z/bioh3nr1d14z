import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects } from '../data/projects';
import type { Project } from '../data/projects';

gsap.registerPlugin(ScrollTrigger);

const projectPairs: [Project, Project][] = [
  [projects[2], projects[1]],   // OmniGraph, ai-redteam-toolkit
  [projects[0], projects[3]],   // nat-gate, codeforces-minecraft
  [projects[4], projects[5]],   // memviz, messenger-desktop
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

interface ProjectItemProps {
  project: Project;
  reverse?: boolean;
  onProjectClick?: (project: Project) => void;
}

function ProjectItem({ project, reverse, onProjectClick }: ProjectItemProps) {
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
      <div
        className="reveal__image-block"
        onClick={() => onProjectClick?.(project)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onProjectClick?.(project);
          }
        }}
        style={{ cursor: onProjectClick ? 'pointer' : 'default' }}
      >
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

interface ParallaxRevealProps {
  onProjectClick?: (project: Project) => void;
}

export default function ParallaxReveal({ onProjectClick }: ParallaxRevealProps) {
  return (
    <section className="reveal__section">
      <div className="reveal__wrapper">
        {projectPairs.map((pair, pairIndex) => (
          <div key={pairIndex}>
            <ProjectItem project={pair[0]} reverse={pairIndex % 2 !== 0} onProjectClick={onProjectClick} />
            <ProjectItem project={pair[1]} reverse={pairIndex % 2 === 0} onProjectClick={onProjectClick} />
          </div>
        ))}
      </div>
    </section>
  );
}
