import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import DiscordPresence from '../components/DiscordPresence';
import ContributionHeatmap from '../components/ContributionHeatmap';
import { nowItems, nowUpdated } from '../data/now';
import { prefersReducedMotion, revealInstantly } from '../lib/motion';

gsap.registerPlugin(ScrollTrigger);

function formatUpdated(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function Now() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (prefersReducedMotion()) {
      revealInstantly(section, ['.now__title', '.now__panel']);
      return;
    }

    const tl = gsap.timeline({
      scrollTrigger: { trigger: section, start: 'top 80%' },
    });

    tl.fromTo(
      section.querySelector('.now__title'),
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
    );

    tl.fromTo(
      section.querySelectorAll('.now__panel'),
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease: 'power2.out' },
      '-=0.5'
    );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section ref={sectionRef} className="now" id="now">
      <h2 className="now__title">Currently</h2>

      <div className="now__layout">
        <div className="now__panel now__panel--list">
          <dl className="now__list">
            {nowItems.map((item) => (
              <div key={item.label} className="now__row">
                <dt className="now__label">{item.label}</dt>
                <dd className="now__value">{item.value}</dd>
              </div>
            ))}
          </dl>
          <p className="now__updated">Updated {formatUpdated(nowUpdated)}</p>
        </div>

        {/* Cả hai panel dưới đây tự ẩn khi không có dữ liệu, nên lưới phải
            chịu được việc thiếu một hoặc cả hai. */}
        <div className="now__panel now__panel--live">
          <DiscordPresence />
          <ContributionHeatmap />
        </div>
      </div>
    </section>
  );
}
