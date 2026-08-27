import { Link } from 'react-router';
import { usePageMeta } from '../lib/usePageMeta';

export default function NotFound() {
  usePageMeta({ title: '404 — h3nr1.d14z' });

  return (
    <main className="notfound">
      <p className="notfound__code">404</p>
      <h1 className="notfound__title">No route here</h1>
      <p className="notfound__body">
        That page does not exist. Try the writeups, or head back to the start.
      </p>
      <div className="notfound__actions">
        <Link to="/" className="notfound__link">
          Home
        </Link>
        <Link to="/writeups" className="notfound__link">
          Writeups
        </Link>
      </div>
    </main>
  );
}
