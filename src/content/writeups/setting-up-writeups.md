---
title: "How this writeup section works"
ctf: "Meta"
category: misc
difficulty: easy
date: 2026-08-27
tags: [markdown, vite, cloudflare-pages]
draft: true              # ẩn khỏi danh sách cho tới khi có writeup thật
summary: "Ghi chú về cách phần writeup này được dựng: Markdown gom lúc build bằng import.meta.glob, không CMS, không database. Thêm bài = thêm một file .md rồi push."
---

## Vì sao là Markdown tĩnh

Writeup CTF hầu hết là văn xuôi, code block và ảnh. Đưa vào CMS hay database
đồng nghĩa với thêm một dịch vụ phải bảo trì, một chỗ nữa có thể sập, và một
tầng nữa giữa việc viết xong với việc bài lên mạng.

Ở đây thì mỗi bài là một file trong `src/content/writeups/`. Vite gom hết lúc
build:

```ts
const modules = import.meta.glob<string>('../content/writeups/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});
```

Không có lần gọi mạng nào lúc chạy. Bài nằm sẵn trong bundle, nên load tức thì
và hoạt động cả khi offline.

## Thêm một bài

1. Chép `_template.md` thành `<slug>.md` trong cùng thư mục.
2. Điền frontmatter — `title`, `ctf`, `category`, `date` là bắt buộc.
3. Viết bài.
4. Push. Cloudflare Pages tự build và deploy.

Tên file chính là URL: `baby-heap.md` thành `/writeups/baby-heap`.

## Draft

Đặt `draft: true` thì bài không lên danh sách và không vào sitemap, nhưng ai
biết URL vẫn mở được — tiện để gửi cho người khác đọc thử trước khi công bố.

Cần nói rõ: **đây không phải bảo mật.** Nội dung vẫn nằm trong bundle JavaScript
tải về máy khách. Đừng đặt vào đó thứ thật sự cần giữ kín.

## Frontmatter parser

Frontmatter được tự parse chứ không dùng `gray-matter`. Lý do đơn giản: thư
viện đó phụ thuộc `Buffer` của Node và vỡ khi bundle cho trình duyệt. Cái parser
ở `src/lib/writeups.ts` chỉ xử lý `key: value`, chuỗi có nháy, số, boolean và
mảng inline — vừa đủ cho frontmatter của writeup, và không kéo thêm ký tự nào
vào bundle ngoài mấy chục dòng đó.
