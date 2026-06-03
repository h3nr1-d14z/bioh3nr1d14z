import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects } from '../data/projects';
import type { Project } from '../data/projects';

gsap.registerPlugin(ScrollTrigger);

const allProjects = [...projects, ...projects];

interface CarouselProps {
  onProjectClick?: (project: Project) => void;
}

export default function Carousel({ onProjectClick }: CarouselProps) {
  const wrapperRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const trackRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const timer = setTimeout(() => {
      // Title entrance
      if (titleRef.current) {
        gsap.fromTo(titleRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: wrapper, start: 'top 80%' },
          }
        );
      }

      const directions = ['reverse', 'forward', 'reverse'];
      const timelines: gsap.core.Timeline[] = [];

      trackRefs.current.forEach((track, colIndex) => {
        if (!track) return;
        const cards = track.querySelectorAll<HTMLDivElement>('.carousel__card');
        if (!cards.length) return;

        const numCards = cards.length; // 4
        const isForward = directions[colIndex] === 'forward';
        const factor = isForward ? 1 : -1;

        // Arrange cards in a ring around X axis
        // 4 cards = 90° apart. Offset so card at index 1 faces viewer (0°)
        cards.forEach((card, i) => {
          const angle = (i * (360 / numCards)) * factor + (isForward ? -90 : 90);
          gsap.set(card, {
            rotateX: angle,
            z: 200,
            transformOrigin: '50% 50% -200px',
          });
        });

        // Scroll-driven infinite rotation
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: wrapper,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          },
        });

        tl.to(track, {
          rotateX: isForward ? '+=360' : '-=360',
          ease: 'none',
        }, 0);

        timelines.push(tl);
      });

      // Staggered fade-in for all cards
      const allCards = wrapper.querySelectorAll('.carousel__card');
      gsap.fromTo(allCards,
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1, scale: 1, stagger: 0.03, duration: 0.5,
          ease: 'power2.out',
          scrollTrigger: { trigger: wrapper, start: 'top 85%' },
        }
      );

      (wrapper as any).__tls = timelines;
    }, 200);

    return () => {
      clearTimeout(timer);
      const tls = (wrapper as any).__tls as gsap.core.Timeline[] | undefined;
      tls?.forEach(tl => tl.kill());
    };
  }, []);

  const setTrackRef = (index: number) => (el: HTMLDivElement | null) => {
    trackRefs.current[index] = el;
  };

  const cols = [
    allProjects.slice(0, 4),    // nat-gate, ai-redteam-toolkit, OmniGraph, codeforces-minecraft
    allProjects.slice(4, 8),    // memviz, messenger-desktop, nat-gate, ai-redteam-toolkit
    allProjects.slice(8, 12),   // OmniGraph, codeforces-minecraft, memviz, messenger-desktop
  ];

  return (
    <>
      <section ref={wrapperRef} className="carousel__wrapper" id="projects">
        <h2 ref={titleRef} className="carousel__title">FEATURED SYSTEMS</h2>
        <div className="carousel__scene">
          {cols.map((col, colIdx) => (
            <div key={colIdx} className="carousel__col">
              <div ref={setTrackRef(colIdx)} className="carousel__track">
                {col.map((p, i) => (
                  <div
                    key={i}
                    className="carousel__card"
                    onClick={() => onProjectClick?.(p)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onProjectClick?.(p);
                      }
                    }}
                  >
                    <div
                      className="carousel__image"
                      style={{ backgroundImage: `url(${p.image})` }}
                    />
                    <div className="carousel__card-overlay">{p.name}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mobile fallback */}
      <div className="carousel__mobile">
        <h2 style={{ fontFamily: "'Geist Mono', monospace", fontSize: '24px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#1c1c1c', marginBottom: '30px', textAlign: 'center' }}>
          FEATURED SYSTEMS
        </h2>
        {projects.map((p, i) => (
          <div
            key={`mobile-${i}`}
            className="carousel__mobile-card"
            onClick={() => onProjectClick?.(p)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onProjectClick?.(p);
              }
            }}
          >
            <img className="carousel__mobile-image" src={p.image} alt={p.name} />
            <div className="carousel__mobile-info">
              <div className="carousel__mobile-title">{p.name}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
