/**
 * Trước đây mỗi kỹ năng gắn một con số kiểu `level: 85`. Không có gì sinh ra
 * con số đó và cũng không ai kiểm chứng được — "Rust 85%" nghĩa là gì thì
 * chính người viết cũng không trả lời được. Bỏ hẳn phần trăm, chỉ giữ tên
 * và nhóm; phần "làm bao nhiêu" để dữ liệu thật từ GitHub và WakaTime nói.
 */

export interface SkillGroup {
  /** Nhãn hiện trên trang. */
  title: string;
  items: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    title: 'Languages',
    items: ['TypeScript', 'Python', 'Rust', 'C#', 'Java', 'Go', 'C++', 'Groovy'],
  },
  {
    title: 'Frontend',
    items: ['React', 'Three.js', 'GSAP', 'Tailwind CSS', 'Vite'],
  },
  {
    title: 'Backend & Data',
    items: ['Node.js', 'PostgreSQL', 'MongoDB', 'Redis', 'Qdrant', 'Memgraph'],
  },
  {
    title: 'Infra & DevOps',
    items: ['Docker', 'Kubernetes', 'Nginx', 'Linux', 'Git', 'Jenkins'],
  },
  {
    title: 'Cloud',
    items: ['Cloudflare Workers', 'Cloudflare Pages', 'AWS', 'Tailscale'],
  },
  {
    title: 'Security',
    items: ['Pentest', 'Red Team', 'Reverse Engineering', 'OSINT', 'Forensics', 'Game Hacking'],
  },
];
