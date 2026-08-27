/**
 * Plugin rehype tô màu code, viết tay thay vì dùng `rehype-highlight`.
 *
 * Lý do: rehype-highlight có `import {common, createLowlight} from 'lowlight'`
 * ở đầu module và dùng `settings.languages || common`. `common` là import
 * tĩnh gom sẵn ~37 grammar, nên Rollup không loại bỏ được kể cả khi truyền
 * `languages` riêng — danh sách tự chọn bị cộng thêm vào chứ không thay thế.
 * Gọi thẳng `createLowlight` với đúng những ngôn ngữ cần thì chỉ những grammar
 * đó lọt vào bundle.
 */
import { createLowlight } from 'lowlight';
import { toString } from 'hast-util-to-string';
import { visit } from 'unist-util-visit';
import type { Element, Root } from 'hast';
import { highlightLanguages } from './highlightLanguages';

const lowlight = createLowlight(highlightLanguages);

/** Lấy tên ngôn ngữ từ class `language-python` mà markdown sinh ra. */
function languageOf(node: Element): string | null {
  const classes = node.properties?.className;
  if (!Array.isArray(classes)) return null;
  for (const cls of classes) {
    const name = String(cls);
    if (name.startsWith('language-')) return name.slice('language-'.length);
  }
  return null;
}

function addClass(node: Element, ...names: string[]): void {
  const existing = node.properties?.className;
  const list = Array.isArray(existing) ? existing.map(String) : [];
  node.properties = { ...node.properties, className: [...new Set([...list, ...names])] };
}

export function rehypeHighlightLite() {
  return (tree: Root): void => {
    visit(tree, 'element', (node: Element, _index, parent) => {
      if (node.tagName !== 'code') return;
      if (!parent || parent.type !== 'element' || parent.tagName !== 'pre') return;

      const language = languageOf(node);
      // Không khai báo ngôn ngữ, hoặc ngôn ngữ không nằm trong danh sách:
      // để nguyên chữ trắng thay vì đoán sai rồi tô màu lung tung.
      if (!language || !lowlight.registered(language)) {
        addClass(node, 'hljs');
        return;
      }

      try {
        const result = lowlight.highlight(language, toString(node));
        node.children = result.children as Element['children'];
        addClass(node, 'hljs', `language-${language}`);
      } catch {
        addClass(node, 'hljs');
      }
    });
  };
}
