/**
 * Chuyển ảnh dự án sang WebP.
 *
 * Chạy một lần rồi commit kết quả, không phải bước trong build: ảnh dự án
 * hiếm khi đổi, nên thêm nó vào mỗi lần build chỉ làm CI chậm đi.
 *
 *   node scripts/optimize-images.mjs
 */
import { readdir, stat, unlink } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const DIR = path.resolve('public/images');
const QUALITY = 82;
/** Ảnh hiển thị rộng nhất khoảng 700px; 1400 đủ cho màn 2x. */
const MAX_WIDTH = 1400;

const files = (await readdir(DIR)).filter((f) => /\.(jpe?g|png)$/i.test(f));
if (files.length === 0) {
  console.log('Không có ảnh jpg/png nào để chuyển.');
  process.exit(0);
}

let before = 0;
let after = 0;

for (const file of files) {
  const src = path.join(DIR, file);
  const dest = path.join(DIR, file.replace(/\.(jpe?g|png)$/i, '.webp'));

  const originalSize = (await stat(src)).size;
  const image = sharp(src);
  const meta = await image.metadata();

  await image
    .resize({ width: Math.min(meta.width ?? MAX_WIDTH, MAX_WIDTH), withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toFile(dest);

  const newSize = (await stat(dest)).size;
  before += originalSize;
  after += newSize;

  const saved = (100 * (1 - newSize / originalSize)).toFixed(0);
  console.log(
    `${file.padEnd(14)} ${(originalSize / 1024).toFixed(0).padStart(4)} KB -> ` +
      `${(newSize / 1024).toFixed(0).padStart(4)} KB  (-${saved}%)  ${meta.width}x${meta.height}`
  );

  // Xoá bản gốc: không có gì tham chiếu tới nó nữa, mà để lại thì Pages vẫn
  // deploy cả file thừa. Bản gốc vẫn nằm trong lịch sử git.
  await unlink(src);
}

console.log(
  `\nTổng: ${(before / 1024).toFixed(0)} KB -> ${(after / 1024).toFixed(0)} KB ` +
    `(-${(100 * (1 - after / before)).toFixed(0)}%)`
);
