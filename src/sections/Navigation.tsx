import { useCallback, useEffect, useRef, useState } from 'react';

interface NavItem {
  id: string;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'projects', label: 'Systems' },
  { id: 'toolkit', label: 'Toolkit' },
  { id: 'contact', label: 'Contact' },
];

/**
 * Các section dùng nền sáng #f1f1f1. Nav nổi bên trên nên khi đi qua chúng,
 * chữ trắng chỉ còn 1.13:1 — phải lật sang tông tối.
 */
const LIGHT_SECTION_SELECTORS = ['.carousel__wrapper', '.github', '.contact'];

export default function Navigation() {
  const navRef = useRef<HTMLElement>(null);
  const [onLight, setOnLight] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  const scrollTo = useCallback((id: string) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Nav đổi tông theo section nằm ngay dưới nó.
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const lightSections = LIGHT_SECTION_SELECTORS.flatMap((sel) =>
      Array.from(document.querySelectorAll<HTMLElement>(sel))
    );
    if (lightSections.length === 0) return;

    // Chỉ quan tâm dải mỏng ngay dưới mép trên màn hình — đúng chỗ nav nằm.
    const navHeight = nav.getBoundingClientRect().height || 72;

    const evaluate = () => {
      const probe = navHeight / 2;
      const hit = lightSections.some((el) => {
        const r = el.getBoundingClientRect();
        return r.top <= probe && r.bottom >= probe;
      });
      setOnLight(hit);
      setScrolled(window.scrollY > 40);
    };

    evaluate();

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        evaluate();
        ticking = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  // Đánh dấu section đang xem.
  useEffect(() => {
    const targets = NAV_ITEMS.map((item) => document.getElementById(item.id)).filter(
      (el): el is HTMLElement => el !== null
    );
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: [0, 0.25, 0.5, 1] }
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Menu mobile mở: khoá cuộn nền và cho phép đóng bằng Escape.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const className = [
    'nav',
    onLight && !open ? 'nav--on-light' : '',
    scrolled && !open ? 'nav--scrolled' : '',
    open ? 'nav--open' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <nav ref={navRef} className={className}>
      <a
        href="#"
        className="nav__brand"
        onClick={(e) => {
          e.preventDefault();
          setOpen(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      >
        h3nr1.d14z
      </a>

      <button
        type="button"
        className="nav__toggle"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        aria-controls="nav-links"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="nav__toggle-bar" />
        <span className="nav__toggle-bar" />
        <span className="nav__toggle-bar" />
      </button>

      <div className="nav__links" id="nav-links">
        {NAV_ITEMS.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="nav__link"
            aria-current={activeId === item.id ? 'true' : undefined}
            onClick={(e) => {
              e.preventDefault();
              scrollTo(item.id);
            }}
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
