import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import HeroScene from './HeroScene';
import { prefersReducedMotion } from '../lib/motion';

interface HeroProps {
  isReady: boolean;
}

export default function Hero({ isReady }: HeroProps) {
  const labelRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!isReady) return;

    if (prefersReducedMotion()) {
      [labelRef, brandRef, subtitleRef, ctaRef].forEach((r) => {
        if (r.current) gsap.set(r.current, { opacity: 1, y: 0, clearProps: 'transform' });
      });
      return;
    }

    const tl = gsap.timeline();

    tl.fromTo(
      brandRef.current,
      { y: '100%', opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power4.out' }
    );

    tl.fromTo(
      [labelRef.current, subtitleRef.current, ctaRef.current],
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, stagger: 0.1, duration: 0.5 },
      '-=0.5'
    );

    return () => {
      tl.kill();
    };
  }, [isReady]);

  return (
    <section className="hero" id="hero">
      <HeroScene />
      <div className="hero__content">
        <div ref={labelRef} className="hero__label">
          Game Dev · Full-Stack · DevOps · Security
        </div>
        <h1 ref={brandRef} className="hero__brand">
          h3nr1.d14z
        </h1>
        <p ref={subtitleRef} className="hero__subtitle">
          aka Le Duc Hieu — I build systems that shouldn&apos;t exist, secure what shouldn&apos;t be broken, and ship what others call impossible. Based in Hanoi, Vietnam.
        </p>
        <a
          ref={ctaRef}
          href="#projects"
          className="hero__cta"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          EXPLORE SYSTEMS
        </a>
      </div>
    </section>
  );
}
