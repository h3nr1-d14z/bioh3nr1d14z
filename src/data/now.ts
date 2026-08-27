/**
 * Section "Now": đang làm gì ngay lúc này.
 *
 * Đây là phần duy nhất trên trang phải cập nhật thủ công — mọi thứ khác kéo
 * từ API. `updated` hiện thẳng lên trang, nên một mục Now cũ sẽ tự tố cáo nó
 * cũ, thay vì âm thầm làm cả site trông chết.
 */

export interface NowItem {
  label: string;
  value: string;
}

/** YYYY-MM-DD — sửa mỗi lần đổi nội dung bên dưới. */
export const nowUpdated = '2026-08-27';

export const nowItems: NowItem[] = [
  {
    label: 'Working on',
    value: 'Game and platform engineering at The1Studio — Unity, C#, and the CI that ships it.',
  },
  {
    label: 'Building',
    value: 'OmniGraph, a local-first RAG-MCP server, and ai-redteam-toolkit.',
  },
  {
    label: 'Learning',
    value: 'CTF — pwn and reverse engineering. Writeups land in the Writeups tab.',
  },
  {
    label: 'Based in',
    value: 'Hanoi, Vietnam (UTC+7).',
  },
];
