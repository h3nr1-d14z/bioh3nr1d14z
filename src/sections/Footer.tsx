import { Link, useLocation, useNavigate } from 'react-router';

const SECTIONS = [
  { id: 'projects', label: 'Systems' },
  { id: 'toolkit', label: 'Toolkit' },
  { id: 'contact', label: 'Contact' },
];

export default function Footer() {
  const location = useLocation();
  const navigate = useNavigate();
  const onHome = location.pathname === '/';

  // Footer hiện ở mọi route. Trên /writeups thì các section này không tồn tại,
  // nên scrollIntoView sẽ im lặng không làm gì — phải điều hướng về trang chủ.
  const goToSection = (id: string) => {
    if (onHome) {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(`/#${id}`);
    }
  };

  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__content">
        <div className="footer__brand">h3nr1.d14z</div>
        <div className="footer__tagline">Game Dev, Full-Stack &amp; DevOps Engineer</div>
        <div className="footer__location">Hanoi, Vietnam</div>
        <div className="footer__copyright">
          &copy; {year} h3nr1.d14z. All systems nominal.
        </div>
        <div className="footer__links">
          {SECTIONS.map((section) => (
            <a
              key={section.id}
              href={`/#${section.id}`}
              className="footer__link"
              onClick={(e) => {
                e.preventDefault();
                goToSection(section.id);
              }}
            >
              {section.label}
            </a>
          ))}
          <Link to="/writeups" className="footer__link">
            Writeups
          </Link>
        </div>
      </div>
    </footer>
  );
}
