import { useCallback } from 'react';

export default function Navigation() {
  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <nav className="nav">
      <a href="#" className="nav__brand" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
        h3nr1.d14z
      </a>
      <div className="nav__links">
        <a href="#projects" className="nav__link" onClick={(e) => { e.preventDefault(); scrollTo('projects'); }}>
          Systems
        </a>
        <a href="#toolkit" className="nav__link" onClick={(e) => { e.preventDefault(); scrollTo('toolkit'); }}>
          Toolkit
        </a>
        <a href="#contact" className="nav__link" onClick={(e) => { e.preventDefault(); scrollTo('contact'); }}>
          Contact
        </a>
      </div>
    </nav>
  );
}
