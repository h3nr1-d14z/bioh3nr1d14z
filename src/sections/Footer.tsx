export default function Footer() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="footer">
      <div className="footer__content">
        <div className="footer__brand">h3nr1.d14z</div>
        <div className="footer__tagline">Game Dev, Full-Stack &amp; DevOps Engineer</div>
        <div className="footer__location">Hanoi, Vietnam</div>
        <div className="footer__copyright">
          &copy; 2026 h3nr1.d14z. All systems nominal.
        </div>
        <div className="footer__links">
          <a href="#projects" className="footer__link" onClick={(e) => { e.preventDefault(); scrollTo('projects'); }}>
            Systems
          </a>
          <a href="#toolkit" className="footer__link" onClick={(e) => { e.preventDefault(); scrollTo('toolkit'); }}>
            Toolkit
          </a>
          <a href="#contact" className="footer__link" onClick={(e) => { e.preventDefault(); scrollTo('contact'); }}>
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
