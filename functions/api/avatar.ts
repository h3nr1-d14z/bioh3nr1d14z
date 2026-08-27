/**
 * Proxy avatar Discord.
 *
 * Nạp thẳng từ cdn.discordapp.com khiến Cloudflare của Discord đặt cookie
 * `__cf_bm` lên trình duyệt khách — cookie bên thứ ba mà khách không hề chọn,
 * và Lighthouse tính là lỗi Best Practices. Proxy qua đây thì phản hồi chỉ
 * còn ảnh, không có Set-Cookie, và cache được ở edge.
 *
 * Chỉ cho phép đúng vài host CDN đã biết để endpoint này không thành open
 * proxy cho người khác dùng nhờ băng thông.
 */

const ALLOWED_HOSTS = new Set([
  'cdn.discordapp.com',
  'media.discordapp.net',
  // Album art Spotify do Lanyard trả về.
  'i.scdn.co',
]);
const CACHE_SECONDS = 3600;

export const onRequestGet: PagesFunction = async (context) => {
  const target = new URL(context.request.url).searchParams.get('url');
  if (!target) {
    return new Response('Thiếu tham số url', { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(target);
  } catch {
    return new Response('URL không hợp lệ', { status: 400 });
  }

  if (parsed.protocol !== 'https:' || !ALLOWED_HOSTS.has(parsed.hostname)) {
    return new Response('Host không được phép', { status: 403 });
  }

  const upstream = await fetch(parsed.toString(), {
    cf: { cacheTtl: CACHE_SECONDS, cacheEverything: true },
  });

  if (!upstream.ok) {
    return new Response('Không tải được ảnh', { status: 502 });
  }

  const contentType = upstream.headers.get('Content-Type') ?? 'image/png';
  if (!contentType.startsWith('image/')) {
    return new Response('Không phải ảnh', { status: 415 });
  }

  // Dựng response mới thay vì chuyển tiếp: bỏ toàn bộ header của upstream,
  // đặc biệt là Set-Cookie.
  return new Response(upstream.body, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'Cache-Control': `public, max-age=${CACHE_SECONDS}, immutable`,
      'Access-Control-Allow-Origin': '*',
    },
  });
};
