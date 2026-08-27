import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import { rehypeHighlightLite } from '../lib/rehypeHighlightLite';
import { ArrowLeft, Clock, Check, Copy } from 'lucide-react';
import GithubSlugger from 'github-slugger';
import { getWriteup, writeups, CATEGORY_LABELS, formatDate } from '../lib/writeups';
import { usePageMeta } from '../lib/usePageMeta';

interface Heading {
  id: string;
  text: string;
  level: number;
}

/**
 * Bọc <pre> để thêm nút copy. react-markdown truyền children đã render nên
 * không có sẵn text nguồn — đọc textContent từ DOM qua ref là cách gọn nhất
 * mà vẫn lấy đúng nội dung sau highlight.
 */
function CodeBlock({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    const text = preRef.current?.textContent ?? '';
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard API cần secure context (https hoặc localhost). Trên http
      // thì im lặng bỏ qua thay vì ném lỗi ra console.
    }
  };

  return (
    <div className="md-code">
      <button
        type="button"
        className="md-code__copy"
        onClick={copy}
        aria-label={copied ? 'Copied' : 'Copy code'}
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
      </button>
      <pre ref={preRef} {...props}>
        {children}
      </pre>
    </div>
  );
}

export default function WriteupDetail() {
  const { slug } = useParams<{ slug: string }>();
  const writeup = slug ? getWriteup(slug) : undefined;

  // Mục lục tính đồng bộ ngay lúc render, không chờ effect.
  //
  // Hai lần trước đều sai theo hướng khác nhau:
  //  1. Tự viết slugify — strip mọi ký tự ngoài [\w\s-] nên tiêu đề tiếng Việt
  //     "Vì sao là Markdown tĩnh" ra "v-sao-l-markdown-tnh", lệch hoàn toàn với
  //     rehype-slug và mọi anchor gãy.
  //  2. Đọc id từ DOM trong useEffect — id thì đúng, nhưng mục lục xuất hiện
  //     sau lần paint đầu. Trên mobile nó nằm trên nội dung (order: -1) nên
  //     đẩy cả bài xuống: CLS 0.39.
  //
  // Dùng thẳng github-slugger — đúng thư viện rehype-slug dùng bên trong — thì
  // slug chắc chắn khớp mà không phải chờ DOM. Slugger có trạng thái để xử lý
  // tiêu đề trùng tên, nên phải tạo instance mới cho mỗi bài.
  const headings = useMemo<Heading[]>(() => {
    if (!writeup) return [];

    const slugger = new GithubSlugger();
    const found: Heading[] = [];
    let inFence = false;

    for (const line of writeup.body.split('\n')) {
      // Bỏ qua phần trong code block, nếu không thì comment kiểu `## foo`
      // trong code sẽ lọt vào mục lục.
      if (/^\s*```/.test(line)) {
        inFence = !inFence;
        continue;
      }
      if (inFence) continue;

      const m = /^(#{2,3})\s+(.+?)\s*$/.exec(line);
      if (!m) continue;
      const text = m[2].replace(/`/g, '');
      found.push({ id: slugger.slug(text), text, level: m[1].length });
    }

    return found;
  }, [writeup]);

  const { prev, next } = useMemo(() => {
    const i = writeups.findIndex((w) => w.slug === slug);
    if (i === -1) return { prev: undefined, next: undefined };
    // Danh sách sắp xếp mới nhất trước, nên phần tử sau là bài cũ hơn.
    return { prev: writeups[i - 1], next: writeups[i + 1] };
  }, [slug]);

  usePageMeta({
    title: writeup ? `${writeup.title} — h3nr1.d14z` : 'Writeup not found — h3nr1.d14z',
    description: writeup?.summary,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!writeup) {
    return (
      <main className="writeup writeup--missing">
        <h1 className="writeup__title">Writeup not found</h1>
        <p className="writeup__lede">
          There is no writeup at <code>/writeups/{slug}</code>.
        </p>
        <Link to="/writeups" className="writeup__back">
          <ArrowLeft size={16} aria-hidden="true" /> All writeups
        </Link>
      </main>
    );
  }

  return (
    <main className="writeup">
      <Link to="/writeups" className="writeup__back">
        <ArrowLeft size={16} aria-hidden="true" /> All writeups
      </Link>

      <header className="writeup__header">
        <div className="writeup__badges">
          <span className={`writeup-card__cat writeup-card__cat--${writeup.category}`}>
            {CATEGORY_LABELS[writeup.category]}
          </span>
          <span className="writeup__badge">{writeup.ctf}</span>
          <span className="writeup__badge">{writeup.difficulty}</span>
          {writeup.points !== null && (
            <span className="writeup__badge">{writeup.points} pts</span>
          )}
          {writeup.draft && <span className="writeup__badge writeup__badge--draft">draft</span>}
        </div>

        <h1 className="writeup__title">{writeup.title}</h1>

        <div className="writeup__meta">
          <span>{formatDate(writeup.date)}</span>
          <span className="writeup__reading">
            <Clock size={13} aria-hidden="true" /> {writeup.readingMinutes} min read
          </span>
        </div>

        {writeup.tags.length > 0 && (
          <div className="writeup__tags">
            {writeup.tags.map((t) => (
              <span key={t} className="writeup-card__tag">
                {t}
              </span>
            ))}
          </div>
        )}
      </header>

      <div className="writeup__layout">
        <article className="writeup__body md">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeSlug, rehypeHighlightLite]}
            components={{ pre: CodeBlock }}
          >
            {writeup.body}
          </ReactMarkdown>
        </article>

        {headings.length > 2 && (
          <nav className="writeup__toc" aria-label="Table of contents">
            <p className="writeup__toc-title">On this page</p>
            <ul className="writeup__toc-list">
              {headings.map((h) => (
                <li key={h.id} className={`writeup__toc-item writeup__toc-item--h${h.level}`}>
                  <a href={`#${h.id}`}>{h.text}</a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>

      {(prev || next) && (
        <nav className="writeup__pager" aria-label="More writeups">
          {prev ? (
            <Link to={`/writeups/${prev.slug}`} className="writeup__pager-link">
              <span className="writeup__pager-label">Newer</span>
              <span className="writeup__pager-title">{prev.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link
              to={`/writeups/${next.slug}`}
              className="writeup__pager-link writeup__pager-link--next"
            >
              <span className="writeup__pager-label">Older</span>
              <span className="writeup__pager-title">{next.title}</span>
            </Link>
          )}
        </nav>
      )}
    </main>
  );
}
