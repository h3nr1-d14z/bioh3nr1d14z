/**
 * Đếm số người đang xem.
 *
 * Trước đây endpoint này ghi cả danh sách session vào Workers KV ở MỖI lần
 * ping (30 giây/lần cho mỗi tab đang mở). Điều đó vượt cả hai giới hạn KV
 * cùng lúc: 1.000 ghi/ngày của gói free (mỗi tab tạo 120 ghi/giờ, nên chỉ
 * khoảng 8 giờ-khách là khoá namespace), và 1 ghi/giây trên cùng một key —
 * mọi khách đều ghi chung key `active_sessions`.
 *
 * Nay state nằm trong Durable Object `PresenceCounter`, hoàn toàn trong RAM.
 * Không còn thao tác ghi nào, và cũng không còn tranh chấp cùng key vì Durable
 * Object xử lý tuần tự theo từng object.
 *
 * DO được định nghĩa ở workers/presence và bind sang đây qua `script_name` —
 * Pages Functions không tự khai báo Durable Object được.
 */

// Import kiểu (type-only) từ chính class DO thay vì khai lại interface: khai
// lại thì thiếu brand DurableObjectBranded nên RPC không type được, và tệ hơn
// là chữ ký có thể lệch khỏi implementation mà không ai biết. `import type`
// bị xoá hoàn toàn lúc build nên không kéo code worker vào bundle Pages.
import type { PresenceCounter } from '../../workers/presence/src/index';

export interface Env {
  PRESENCE?: DurableObjectNamespace<PresenceCounter>;
}

/**
 * Toàn site dùng chung một object: "ai đang xem" là một con số duy nhất, nên
 * đây thật sự là một điểm phối hợp chứ không phải nút thắt cổ chai do thiết kế.
 */
const OBJECT_NAME = 'global';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function json(count: number | null): Response {
  return new Response(JSON.stringify({ count }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      ...CORS_HEADERS,
    },
  });
}

export const onRequestOptions: PagesFunction<Env> = async () =>
  new Response(null, { status: 204, headers: CORS_HEADERS });

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  // Chưa bind DO (ví dụ bản preview chưa cấu hình) thì trả count: null để
  // client tự ẩn widget, thay vì báo lỗi.
  if (!env.PRESENCE) return json(null);

  const stub = env.PRESENCE.getByName(OBJECT_NAME);

  try {
    if (request.method !== 'POST') {
      return json(await stub.count());
    }

    let sessionId: string | undefined;
    try {
      sessionId = ((await request.json()) as { sessionId?: string }).sessionId;
    } catch {
      // Body hỏng thì coi như chỉ hỏi số đếm.
    }

    if (!sessionId) return json(await stub.count());
    return json(await stub.touch(sessionId));
  } catch {
    return json(null);
  }
};
