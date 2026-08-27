import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { skillGroups } from '../data/skills';
import { prefersReducedMotion, revealInstantly } from '../lib/motion';

gsap.registerPlugin(ScrollTrigger);

export default function SkillsMatrix() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (prefersReducedMotion()) {
      revealInstantly(section, ['.skills__title', '.skills__group']);
      return;
    }

    const tl = gsap.timeline({
      scrollTrigger: { trigger: section, start: 'top 80%' },
    });

    tl.fromTo(
      section.querySelector('.skills__title'),
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
    );

    tl.fromTo(
      section.querySelectorAll('.skills__group'),
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, stagger: 0.08, duration: 0.5, ease: 'power2.out' },
      '-=0.5'
    );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section ref={sectionRef} className="skills" id="skills">
      <h2 className="skills__title">Tech Arsenal</h2>

      <div className="skills__groups">
        {skillGroups.map((group) => (
          <div key={group.title} className="skills__group">
            <h3 className="skills__group-title">{group.title}</h3>
            <ul className="skills__chips">
              {group.items.map((item) => (
                <li key={item} className="skills__chip">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
