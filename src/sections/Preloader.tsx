import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const counter = { val: 0 };

    const tl = gsap.timeline();

    tl.to(counter, {
      val: 100,
      duration: 2,
      ease: 'power4.in',
      onUpdate: () => {
        setCount(Math.round(counter.val));
      },
    });

    tl.to([counterRef.current, brandRef.current], {
      opacity: 0,
      duration: 0.5,
    });

    tl.to(containerRef.current, {
      y: '-100%',
      duration: 0.8,
      ease: 'power4.inOut',
      onComplete: () => {
        onComplete();
      },
    });

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div ref={containerRef} className="preloader">
      <div ref={brandRef} className="preloader__brand">h3nr1.d14z</div>
      <div ref={counterRef} className="preloader__counter">{count}%</div>
    </div>
  );
}
