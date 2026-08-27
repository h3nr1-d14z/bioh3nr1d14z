/**
 * Ngôn ngữ cho syntax highlight, khai báo tường minh.
 *
 * Mặc định rehype-highlight bật `detect` và kéo theo toàn bộ ~190 grammar của
 * highlight.js — chunk trang writeup phình lên 107KB gzip. Danh sách này chỉ
 * gồm những gì thực sự xuất hiện trong writeup CTF.
 *
 * Thêm ngôn ngữ mới: import rồi thêm vào object bên dưới. Ngôn ngữ không có ở
 * đây vẫn hiện bình thường, chỉ là không được tô màu.
 */
import bash from 'highlight.js/lib/languages/bash';
import c from 'highlight.js/lib/languages/c';
import cpp from 'highlight.js/lib/languages/cpp';
import csharp from 'highlight.js/lib/languages/csharp';
import diff from 'highlight.js/lib/languages/diff';
import go from 'highlight.js/lib/languages/go';
import http from 'highlight.js/lib/languages/http';
import java from 'highlight.js/lib/languages/java';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import php from 'highlight.js/lib/languages/php';
import python from 'highlight.js/lib/languages/python';
import rust from 'highlight.js/lib/languages/rust';
import sql from 'highlight.js/lib/languages/sql';
import typescript from 'highlight.js/lib/languages/typescript';
import x86asm from 'highlight.js/lib/languages/x86asm';
import xml from 'highlight.js/lib/languages/xml';
import yaml from 'highlight.js/lib/languages/yaml';

export const highlightLanguages = {
  bash,
  c,
  cpp,
  csharp,
  diff,
  go,
  http,
  java,
  javascript,
  json,
  php,
  python,
  rust,
  sql,
  typescript,
  x86asm,
  xml,
  yaml,
};
