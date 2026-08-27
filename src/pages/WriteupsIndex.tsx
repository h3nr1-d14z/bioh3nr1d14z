import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { Search, Clock, Tag } from 'lucide-react';
import {
  writeups,
  activeCategories,
  CATEGORY_LABELS,
  formatDate,
  type Category,
} from '../lib/writeups';
import { usePageMeta } from '../lib/usePageMeta';

type Filter = Category | 'all';

export default function WriteupsIndex() {
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');

  usePageMeta({
    title: 'Writeups — h3nr1.d14z',
    description:
      'CTF writeups: pwn, web, crypto, reverse engineering, forensics. Notes on how each challenge was solved.',
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const categories = useMemo(() => activeCategories(), []);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return writeups.filter((w) => {
      if (filter !== 'all' && w.category !== filter) return false;
      if (!q) return true;
      return (
        w.title.toLowerCase().includes(q) ||
        w.ctf.toLowerCase().includes(q) ||
        w.summary.toLowerCase().includes(q) ||
        w.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [filter, query]);

  return (
    <main className="writeups">
      <header className="writeups__header">
        <h1 className="writeups__title">Writeups</h1>
        <p className="writeups__intro">
          Notes from CTF challenges — what the bug was, how it was reached, and what
          was worth remembering afterwards.
        </p>
      </header>

      {writeups.length > 0 && (
        <div className="writeups__controls">
          <div className="writeups__search">
            <Search size={16} aria-hidden="true" />
            <input
              type="search"
              className="writeups__search-input"
              placeholder="Search title, CTF, or tag…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search writeups"
            />
          </div>

          <div className="writeups__filters" role="group" aria-label="Filter by category">
            <button
              type="button"
              className={`writeups__filter${filter === 'all' ? ' is-active' : ''}`}
              onClick={() => setFilter('all')}
              aria-pressed={filter === 'all'}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`writeups__filter${filter === cat ? ' is-active' : ''}`}
                onClick={() => setFilter(cat)}
                aria-pressed={filter === cat}
              >
                {CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>
        </div>
      )}

      {visible.length === 0 ? (
        <p className="writeups__empty">
          {writeups.length === 0
            ? 'No writeups published yet.'
            : 'Nothing matches that search.'}
        </p>
      ) : (
        <ul className="writeups__grid">
          {visible.map((w) => (
            <li key={w.slug} className="writeups__item">
              <Link to={`/writeups/${w.slug}`} className="writeup-card">
                <div className="writeup-card__top">
                  <span className={`writeup-card__cat writeup-card__cat--${w.category}`}>
                    {CATEGORY_LABELS[w.category]}
                  </span>
                  <span className="writeup-card__ctf">{w.ctf}</span>
                </div>

                <h2 className="writeup-card__title">{w.title}</h2>
                <p className="writeup-card__summary">{w.summary}</p>

                {w.tags.length > 0 && (
                  <div className="writeup-card__tags">
                    <Tag size={12} aria-hidden="true" />
                    {w.tags.slice(0, 4).map((t) => (
                      <span key={t} className="writeup-card__tag">
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                <div className="writeup-card__meta">
                  <span>{formatDate(w.date)}</span>
                  <span className="writeup-card__reading">
                    <Clock size={12} aria-hidden="true" /> {w.readingMinutes} min
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
