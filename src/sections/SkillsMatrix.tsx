import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TiltCard from '../components/TiltCard';

gsap.registerPlugin(ScrollTrigger);

interface Skill {
  name: string;
  level: number;
  category: string;
}

const skills: Skill[] = [
  { name: 'Rust', level: 85, category: 'Systems' },
  { name: 'Python', level: 95, category: 'Backend' },
  { name: 'TypeScript', level: 90, category: 'Frontend' },
  { name: 'Go', level: 80, category: 'Systems' },
  { name: 'Java', level: 75, category: 'Game Dev' },
  { name: 'C++', level: 70, category: 'Systems' },
  { name: 'React', level: 92, category: 'Frontend' },
  { name: 'Three.js', level: 78, category: 'Frontend' },
  { name: 'Node.js', level: 88, category: 'Backend' },
  { name: 'Docker', level: 85, category: 'DevOps' },
  { name: 'Kubernetes', level: 75, category: 'DevOps' },
  { name: 'Tailwind CSS', level: 95, category: 'Frontend' },
  { name: 'PostgreSQL', level: 82, category: 'Backend' },
  { name: 'MongoDB', level: 80, category: 'Backend' },
  { name: 'AWS', level: 78, category: 'Cloud' },
  { name: 'Cloudflare', level: 85, category: 'Cloud' },
  { name: 'Linux', level: 90, category: 'Systems' },
  { name: 'Git', level: 95, category: 'Tools' },
  { name: 'Nginx', level: 80, category: 'DevOps' },
  { name: 'Redis', level: 75, category: 'Backend' },
];

const categories = Array.from(new Set(skills.map(s => s.category)));

export default function SkillsMatrix() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const gridRef = useRef<HTMLDivElement>(null);

  const filteredSkills = activeCategory === 'All'
    ? skills
    : skills.filter(s => s.category === activeCategory);

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
      section.querySelector('.skills__title'),
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
    );

    tl.fromTo(
      section.querySelectorAll('.skills__filter-btn'),
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, stagger: 0.05, duration: 0.5 },
      '-=0.5'
    );

    tl.fromTo(
      section.querySelectorAll('.skills__card'),
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, stagger: 0.03, duration: 0.5, ease: 'power2.out' },
      '-=0.3'
    );

    return () => { tl.kill(); };
  }, []);

  return (
    <section ref={sectionRef} className="skills" id="skills">
      <h2 className="skills__title">TECH ARSENAL</h2>

      <div className="skills__filters">
        <button
          className={`skills__filter-btn ${activeCategory === 'All' ? 'active' : ''}`}
          onClick={() => setActiveCategory('All')}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            className={`skills__filter-btn ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div ref={gridRef} className="skills__grid">
        {filteredSkills.map(skill => (
          <TiltCard key={skill.name} className="skills__card-wrap">
            <div className="skills__card">
              <div className="skills__card-header">
                <span className="skills__name">{skill.name}</span>
                <span className="skills__level">{skill.level}%</span>
              </div>
              <div className="skills__bar-bg">
                <div
                  className="skills__bar-fill"
                  style={{ width: `${skill.level}%` }}
                />
              </div>
            </div>
          </TiltCard>
        ))}
      </div>
    </section>
  );
}
