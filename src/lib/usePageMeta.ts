import { useEffect } from 'react';

interface PageMeta {
  title: string;
  description?: string;
}

function setMeta(selector: string, attr: string, value: string): HTMLMetaElement | null {
  const el = document.head.querySelector<HTMLMetaElement>(selector);
  if (el) el.setAttribute(attr, value);
  return el;
}

/**
 * Đặt <title> và description theo từng route.
 *
 * Đây là SPA nên crawler đọc HTML tĩnh sẽ chỉ thấy thẻ mặc định trong
 * index.html. Googlebot có chạy JS nên vẫn lấy được, còn các crawler chỉ đọc
 * HTML (preview link của Discord, Slack, Facebook) thì không — muốn OG đúng
 * cho từng writeup thì phải prerender hoặc sinh thẻ ở edge. Ghi lại ở đây để
 * không tưởng nhầm là đã xong.
 */
export function usePageMeta({ title, description }: PageMeta): void {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;

    const descEl = description
      ? setMeta('meta[name="description"]', 'content', description)
      : null;
    const prevDesc = descEl?.getAttribute('content') ?? null;
    if (descEl && description) descEl.setAttribute('content', description);

    setMeta('meta[property="og:title"]', 'content', title);
    if (description) setMeta('meta[property="og:description"]', 'content', description);

    return () => {
      document.title = prevTitle;
      if (descEl && prevDesc !== null) descEl.setAttribute('content', prevDesc);
    };
  }, [title, description]);
}
