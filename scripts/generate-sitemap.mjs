/**
 * Sinh public/sitemap.xml từ các route tĩnh và file writeup.
 *
 * Chạy trước `vite build` (xem script "build" trong package.json) để sitemap
 * luôn khớp với writeup thực có, thay vì phải nhớ sửa tay mỗi lần thêm bài.
 *
 * Bài `draft: true` bị loại — chúng cố ý không nằm trong danh sách công khai.
 */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const SITE = 'https://bioh3nr1d14z.pages.dev';
const WRITEUPS_DIR = path.resolve('src/content/writeups');
const OUT = path.resolve('public/sitemap.xml');

/** Đọc vài trường frontmatter cần cho sitemap. Không cần parser YAML đầy đủ. */
function readFrontmatter(source) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(source);
  if (!match) return {};

  const data = {};
  for (const line of match[1].split(/\r?\n/)) {
    const sep = line.indexOf(':');
    if (sep === -1) continue;
    const key = line.slice(0, sep).trim();
    // Cắt comment cuối dòng trước, giống parser trong src/lib/writeups.ts —
    // nếu không thì `draft: true  # ghi chú` không còn bằng 'true' và bài
    // draft vẫn lọt vào sitemap.
    const value = line
      .slice(sep + 1)
      .replace(/\s+#.*$/, '')
      .trim()
      .replace(/^["']|["']$/g, '');
    data[key] = value;
  }
  return data;
}

const today = new Date().toISOString().slice(0, 10);

const entries = [
  { loc: `${SITE}/`, changefreq: 'weekly', priority: '1.0', lastmod: today },
  { loc: `${SITE}/writeups`, changefreq: 'weekly', priority: '0.8', lastmod: today },
];

let files = [];
try {
  files = (await readdir(WRITEUPS_DIR)).filter(
    (f) => f.endsWith('.md') && !f.startsWith('_')
  );
} catch {
  // Chưa có thư mục writeup thì sitemap chỉ gồm route tĩnh.
}

for (const file of files) {
  const source = await readFile(path.join(WRITEUPS_DIR, file), 'utf8');
  const data = readFrontmatter(source);
  if (data.draft === 'true') continue;

  const slug = data.slug || file.replace(/\.md$/, '');
  entries.push({
    loc: `${SITE}/writeups/${slug}`,
    changefreq: 'monthly',
    priority: '0.7',
    lastmod: data.date || today,
  });
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (e) => `  <url>
    <loc>${e.loc}</loc>
    <lastmod>${e.lastmod}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

await writeFile(OUT, xml, 'utf8');
console.log(`sitemap.xml: ${entries.length} URL`);
