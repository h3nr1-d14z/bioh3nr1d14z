import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';

interface AnchorItem {
  id: string;
  label: string;
}

/** Mục trỏ tới section trên trang chủ. */
const ANCHOR_ITEMS: AnchorItem[] = [
  { id: 'projects', label: 'Systems' },
  { id: 'toolkit', label: 'Toolkit' },
  { id: 'contact', label: 'Contact' },
];

/**
 * Các section dùng nền sáng #f1f1f1. Nav nổi bên trên nên khi đi qua chúng,
 * chữ trắng chỉ còn 1.13:1 — phải lật sang tông tối.
 */
const LIGHT_SECTION_SELECTORS = ['.carousel__wrapper', '.carousel__mobile', '.github', '.contact'];

export default function Navigation() {
  const navRef = useRef<HTMLElement>(null);
  const [onLight, setOnLight] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  // Section đang hiển thị theo IntersectionObserver. Chỉ có nghĩa trên trang
  // chủ, nên `activeId` bên dưới suy ra từ đây thay vì reset bằng setState
  // trong effect (gây cascading render).
  const [observedId, setObservedId] = useState<string | null>(null);

  const location = useLocation();
  const navigate = useNavigate();
  const onHome = location.pathname === '/';

  const goToSection = useCallback(
    (id: string) => {
      setOpen(false);
      if (onHome) {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      } else {
        // Rời trang writeup thì phải về trang chủ trước; App xử lý cuộn tới
        // hash sau khi trang chủ đã mount.
        navigate(`/#${id}`);
      }
    },
    [onHome, navigate]
  );

  // Nền mờ khi cuộn + đổi tông khi nav nằm trên section sáng.
  // Hai việc gộp chung một listener; phần section sáng chỉ có trên trang chủ,
  // nhưng phần `scrolled` phải chạy ở mọi route.
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const lightSections = LIGHT_SECTION_SELECTORS.flatMap((sel) =>
      Array.from(document.querySelectorAll<HTMLElement>(sel))
    );
    const navHeight = nav.getBoundingClientRect().height || 72;

    const evaluate = () => {
      setScrolled(window.scrollY > 40);

      if (lightSections.length === 0) {
        setOnLight(false);
        return;
      }
      const probe = navHeight / 2;
      setOnLight(
        lightSections.some((el) => {
          const r = el.getBoundingClientRect();
          // Section ẩn (display:none) có chiều cao 0 — bỏ qua.
          return r.height > 0 && r.top <= probe && r.bottom >= probe;
        })
      );
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
  }, [location.pathname]);

  // Đánh dấu section đang xem (chỉ có nghĩa trên trang chủ).
  useEffect(() => {
    if (!onHome) return;

    const targets = ANCHOR_ITEMS.map((item) => document.getElementById(item.id)).filter(
      (el): el is HTMLElement => el !== null
    );
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setObservedId(visible.target.id);
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: [0, 0.25, 0.5, 1] }
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [onHome]);

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

  const activeId = onHome ? observedId : null;

  const className = [
    'nav',
    onLight && !open ? 'nav--on-light' : '',
    scrolled && !open ? 'nav--scrolled' : '',
    open ? 'nav--open' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const onWriteups = location.pathname.startsWith('/writeups');

  return (
    <nav ref={navRef} className={className}>
      <Link
        to="/"
        className="nav__brand"
        onClick={() => {
          setOpen(false);
          if (onHome) window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      >
        h3nr1.d14z
      </Link>

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
        {ANCHOR_ITEMS.map((item) => (
          <a
            key={item.id}
            href={`/#${item.id}`}
            className="nav__link"
            aria-current={activeId === item.id ? 'true' : undefined}
            onClick={(e) => {
              e.preventDefault();
              goToSection(item.id);
            }}
          >
            {item.label}
          </a>
        ))}

        <Link
          to="/writeups"
          className="nav__link"
          aria-current={onWriteups ? 'true' : undefined}
          onClick={() => setOpen(false)}
        >
          Writeups
        </Link>
      </div>
    </nav>
  );
}
