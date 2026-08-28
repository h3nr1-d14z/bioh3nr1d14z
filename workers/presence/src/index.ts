import { DurableObject } from 'cloudflare:workers';

/**
 * Đếm số người đang xem, giữ hoàn toàn trong RAM.
 *
 * Bản trước dùng Workers KV: mỗi ping ghi lại cả danh sách session vào cùng
 * một key. Hai giới hạn của KV đều bị vi phạm cùng lúc —
 *   - 1.000 ghi/ngày (gói free): mỗi tab mở tạo 120 ghi/giờ, nên chỉ ~8
 *     giờ-khách là khoá cả namespace;
 *   - 1 ghi/giây trên cùng một key: mọi khách đều ghi chung key
 *     `active_sessions`, nên chỉ cần hai người ping trùng giây là vượt.
 *
 * Durable Object hợp với bài toán này vì nó là một điểm phối hợp duy nhất có
 * bộ nhớ riêng: không cần ghi xuống đâu cả. Bản đồ session chỉ nằm trong RAM.
 *
 * Mất state khi object bị evict là chấp nhận được, và thật ra là đúng ngữ
 * nghĩa: object chỉ bị evict sau một khoảng không có request nào, mà không có
 * request nghĩa là không có ai đang xem. Đếm lại từ 0 là kết quả đúng.
 *
 * Vì không đụng tới storage nên class này không phát sinh thao tác đọc/ghi
 * nào — chỉ tính vào hạn request của Durable Objects (100.000/ngày ở gói free).
 */

/** Quá hạn này mà không ping lại thì coi như đã rời đi. */
const SESSION_TIMEOUT_MS = 120_000;

/** Chặn dữ liệu rác: một object không giữ quá số session này. */
const MAX_SESSIONS = 10_000;

export class PresenceCounter extends DurableObject {
  /** sessionId -> mốc thời gian ping gần nhất. Chỉ trong RAM, không ghi đĩa. */
  private sessions = new Map<string, number>();

  /** Xoá session hết hạn. Gọi trước mỗi lần đọc để số đếm luôn đúng. */
  private prune(now: number): void {
    for (const [id, seen] of this.sessions) {
      if (now - seen >= SESSION_TIMEOUT_MS) this.sessions.delete(id);
    }
  }

  /** Ghi nhận một session còn sống và trả về số người đang xem. */
  touch(sessionId: string): number {
    const now = Date.now();
    this.prune(now);

    if (this.sessions.has(sessionId) || this.sessions.size < MAX_SESSIONS) {
      this.sessions.set(sessionId, now);
    }

    return this.sessions.size;
  }

  /** Đọc số người đang xem mà không ghi nhận session nào. */
  count(): number {
    this.prune(Date.now());
    return this.sessions.size;
  }
}

/**
 * Worker này tồn tại chỉ để chứa class Durable Object — Pages Functions không
 * tự khai báo Durable Object được, phải bind sang một Worker riêng.
 * Truy cập trực tiếp không có tác dụng gì.
 */
export default {
  fetch(): Response {
    return new Response('Worker này chỉ chứa Durable Object PresenceCounter.', {
      status: 404,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  },
};
