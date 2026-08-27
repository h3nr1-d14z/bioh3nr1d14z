import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { prefersReducedMotion } from '../lib/motion';

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  // Đọc thiết lập một lần qua lazy initializer thay vì setState trong effect —
  // tránh cascading render và giữ trạng thái đầu tiên đã đúng ngay từ đầu.
  const [reducedMotion] = useState(prefersReducedMotion);
  const [count, setCount] = useState(reducedMotion ? 100 : 0);
  // Preloader là div fixed z-index 9999. Nếu không gỡ đi, nó che kín trang.
  const [done, setDone] = useState(reducedMotion);

  useEffect(() => {
    // Màn preloader trượt lên là chuyển động lớn choán toàn màn hình.
    // Khi giảm chuyển động thì vào thẳng nội dung.
    if (reducedMotion) {
      onComplete();
      return;
    }

    const counter = { val: 0 };

    const tl = gsap.timeline();

    tl.to(counter, {
      val: 100,
      duration: 1.2,
      ease: 'power2.in',
      onUpdate: () => {
        setCount(Math.round(counter.val));
      },
    });

    tl.to([counterRef.current, brandRef.current], {
      opacity: 0,
      duration: 0.35,
    });

    tl.to(containerRef.current, {
      y: '-100%',
      duration: 0.6,
      ease: 'power4.inOut',
      onComplete: () => {
        setDone(true);
        onComplete();
      },
    });

    return () => {
      tl.kill();
    };
  }, [onComplete, reducedMotion]);

  if (done) return null;

  return (
    <div ref={containerRef} className="preloader">
      <div ref={brandRef} className="preloader__brand">h3nr1.d14z</div>
      <div ref={counterRef} className="preloader__counter">{count}%</div>
    </div>
  );
}
