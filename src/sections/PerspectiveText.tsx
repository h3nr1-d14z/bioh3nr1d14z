import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function PerspectiveText() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const words = wordsRef.current.filter(Boolean);
    if (words.length === 0) return;

    // Set initial 3D rotation on words
    words.forEach((word) => {
      gsap.set(word, {
        transformOrigin: 'center center',
        rotateY: -50,
      });
    });

    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: wrapper,
        start: 'top top',
        end: '+=3000',
        scrub: 1.5,
        pin: true,
      },
    });

    // Phase 1: Rotate words from rotateY(-50deg) to rotateY(0) + rotateX 360
    tl.to(words, {
      rotateY: 0,
      rotateX: '-360deg',
      stagger: 0.05,
      duration: 1,
    }, 'phase1');

    tl.to(words[0], { color: '#ffffff', duration: 0.2 }, 'phase1+=0.1');
    tl.to(words[1], { color: '#ffffff', duration: 0.2 }, 'phase1+=0.2');
    tl.to(words[2], { color: '#ffffff', duration: 0.2 }, 'phase1+=0.3');
    tl.to(words[3], { color: '#ffffff', duration: 0.2 }, 'phase1+=0.4');

    // Phase 2: Continue rotation + return color
    tl.to(words, {
      rotateX: '-720deg',
      stagger: 0.05,
      duration: 1,
    }, 'phase2');

    tl.to(words[0], { color: '#D4AF37', duration: 0.2 }, 'phase2+=0.1');
    tl.to(words[1], { color: '#D4AF37', duration: 0.2 }, 'phase2+=0.2');
    tl.to(words[2], { color: '#D4AF37', duration: 0.2 }, 'phase2+=0.3');
    tl.to(words[3], { color: '#D4AF37', duration: 0.2 }, 'phase2+=0.4');

    return () => {
      tl.kill();
    };
  }, []);

  const setWordRef = (index: number) => (el: HTMLSpanElement | null) => {
    if (el) wordsRef.current[index] = el;
  };

  return (
    <div ref={wrapperRef} className="perspective__wrapper" id="toolkit">
      <p className="perspective__text">
        <span className="perspective__word-wrap">
          <span ref={setWordRef(0)} className="perspective__word">INFRASTRUCTURE</span>
        </span>{' '}
        <span>TOOLS,</span>{' '}
        <span>GAME</span>{' '}
        <span className="perspective__word-wrap">
          <span ref={setWordRef(1)} className="perspective__word">MODS,</span>
        </span>{' '}
        <span>AND THE</span>{' '}
        <span className="perspective__word-wrap">
          <span ref={setWordRef(2)} className="perspective__word">OCCASIONAL</span>
        </span>{' '}
        <span>THING THAT PROBABLY</span>{' '}
        <span className="perspective__word-wrap">
          <span ref={setWordRef(3)} className="perspective__word">SHOULDN&apos;T</span>
        </span>{' '}
        <span>EXIST.</span>
      </p>
    </div>
  );
}
