/**
 * Trang này dùng rất nhiều chuyển động: pin section, xoay 3D 720°, parallax
 * scrub, tilt theo chuột. Với người bị rối loạn tiền đình, những hiệu ứng đó
 * gây chóng mặt thật sự, nên toàn bộ phải tôn trọng `prefers-reduced-motion`.
 *
 * Quy ước: component gọi `prefersReducedMotion()` ở đầu effect animation.
 * Nếu true thì bỏ qua timeline và đặt thẳng trạng thái cuối bằng
 * `revealInstantly()`, để nội dung vẫn hiển thị đầy đủ — chỉ là không có
 * chuyển động.
 */

const QUERY = '(prefers-reduced-motion: reduce)';

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia(QUERY).matches;
}

/** Đăng ký lắng nghe khi người dùng đổi thiết lập giữa chừng. */
export function onReducedMotionChange(handler: (reduced: boolean) => void): () => void {
  if (typeof window === 'undefined' || !window.matchMedia) return () => {};
  const mql = window.matchMedia(QUERY);
  const listener = (e: MediaQueryListEvent) => handler(e.matches);
  mql.addEventListener('change', listener);
  return () => mql.removeEventListener('change', listener);
}

/**
 * Đưa các phần tử về trạng thái "đã hiện" mà không animate.
 * Dùng thay cho timeline khi người dùng yêu cầu giảm chuyển động.
 */
export function revealInstantly(
  root: ParentNode | null,
  selectors: string[]
): void {
  if (!root) return;
  selectors.forEach((sel) => {
    root.querySelectorAll<HTMLElement>(sel).forEach((el) => {
      el.style.opacity = '1';
      el.style.transform = 'none';
      el.style.clipPath = 'none';
    });
  });
}
