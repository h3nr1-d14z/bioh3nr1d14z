import { useEffect, useRef, useState } from 'react';

/**
 * Kết nối Lanyard qua WebSocket để lấy trạng thái Discord thời gian thực.
 *
 * Dùng WebSocket chứ không poll REST: presence đổi liên tục (đổi bài Spotify,
 * đổi file đang mở trong VS Code) và poll thì hoặc trễ hoặc tốn request vô ích.
 *
 * Lanyard chỉ theo dõi người đã vào server discord.gg/lanyard. Chưa vào thì
 * kết nối vẫn mở nhưng không bao giờ có INIT_STATE — hook trả `notMonitored`
 * để component tự ẩn thay vì hiện khung rỗng.
 */

const SOCKET_URL = 'wss://api.lanyard.rest/socket';

/** Op code của giao thức Lanyard. */
const OP_EVENT = 0;
const OP_HELLO = 1;
const OP_INITIALIZE = 2;
const OP_HEARTBEAT = 3;

export interface LanyardActivity {
  id?: string;
  name: string;
  /** 0 Playing · 1 Streaming · 2 Listening · 3 Watching · 4 Custom · 5 Competing */
  type: number;
  state?: string;
  details?: string;
  application_id?: string;
  timestamps?: { start?: number; end?: number };
  assets?: {
    large_image?: string;
    large_text?: string;
    small_image?: string;
    small_text?: string;
  };
  emoji?: { name?: string; id?: string; animated?: boolean };
}

export interface LanyardSpotify {
  track_id: string;
  timestamps: { start: number; end: number };
  song: string;
  artist: string;
  album: string;
  album_art_url: string;
}

export type DiscordStatus = 'online' | 'idle' | 'dnd' | 'offline';

export interface LanyardData {
  discord_user: {
    id: string;
    username: string;
    global_name?: string | null;
    display_name?: string | null;
    avatar: string | null;
    discriminator: string;
  };
  discord_status: DiscordStatus;
  activities: LanyardActivity[];
  listening_to_spotify: boolean;
  spotify: LanyardSpotify | null;
  active_on_discord_desktop: boolean;
  active_on_discord_mobile: boolean;
  active_on_discord_web: boolean;
}

export type LanyardState =
  | { status: 'connecting'; data: null }
  | { status: 'ready'; data: LanyardData }
  | { status: 'unavailable'; data: null };

/** Chờ bao lâu trước khi coi như Lanyard không theo dõi user này. */
const INIT_TIMEOUT_MS = 8000;
/** Backoff kết nối lại: 2s, 4s, 8s… tối đa 60s. */
const MAX_RECONNECT_MS = 60_000;

export function useLanyard(userId: string): LanyardState {
  // Trạng thái đầu suy từ userId qua lazy initializer thay vì setState trong
  // effect — chưa cấu hình ID thì không có gì để "đang kết nối" cả.
  const [state, setState] = useState<LanyardState>(() =>
    userId ? { status: 'connecting', data: null } : { status: 'unavailable', data: null }
  );

  // Giữ ngoài state để reconnect không kích hoạt render.
  const attemptRef = useRef(0);
  const closedRef = useRef(false);

  useEffect(() => {
    if (!userId) return;

    closedRef.current = false;
    let socket: WebSocket | null = null;
    let heartbeat: ReturnType<typeof setInterval> | null = null;
    let initTimer: ReturnType<typeof setTimeout> | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

    const cleanupSocket = () => {
      if (heartbeat) clearInterval(heartbeat);
      if (initTimer) clearTimeout(initTimer);
      heartbeat = null;
      initTimer = null;
      if (socket) {
        socket.onopen = socket.onmessage = socket.onerror = socket.onclose = null;
        if (socket.readyState <= WebSocket.OPEN) socket.close();
        socket = null;
      }
    };

    const scheduleReconnect = () => {
      if (closedRef.current) return;
      attemptRef.current += 1;
      const delay = Math.min(2000 * 2 ** (attemptRef.current - 1), MAX_RECONNECT_MS);
      reconnectTimer = setTimeout(connect, delay);
    };

    const connect = () => {
      if (closedRef.current) return;
      cleanupSocket();

      try {
        socket = new WebSocket(SOCKET_URL);
      } catch {
        scheduleReconnect();
        return;
      }

      // Không nhận INIT_STATE trong ngần này thì gần như chắc chắn là user
      // chưa vào server Lanyard.
      initTimer = setTimeout(() => {
        setState((prev) => (prev.status === 'ready' ? prev : { status: 'unavailable', data: null }));
      }, INIT_TIMEOUT_MS);

      socket.onmessage = (event) => {
        let payload: { op: number; t?: string; d?: unknown };
        try {
          payload = JSON.parse(event.data as string);
        } catch {
          return;
        }

        if (payload.op === OP_HELLO) {
          const interval = (payload.d as { heartbeat_interval?: number })?.heartbeat_interval;
          if (interval) {
            heartbeat = setInterval(() => {
              if (socket?.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({ op: OP_HEARTBEAT }));
              }
            }, interval);
          }
          socket?.send(
            JSON.stringify({ op: OP_INITIALIZE, d: { subscribe_to_id: userId } })
          );
          return;
        }

        if (payload.op === OP_EVENT && (payload.t === 'INIT_STATE' || payload.t === 'PRESENCE_UPDATE')) {
          // INIT_STATE khi subscribe một user trả thẳng object presence.
          const data = payload.d as LanyardData | Record<string, LanyardData> | null;
          if (!data) {
            setState({ status: 'unavailable', data: null });
            return;
          }
          const presence = ('discord_user' in data
            ? data
            : (data as Record<string, LanyardData>)[userId]) as LanyardData | undefined;

          if (!presence?.discord_user) {
            setState({ status: 'unavailable', data: null });
            return;
          }

          if (initTimer) clearTimeout(initTimer);
          attemptRef.current = 0;
          setState({ status: 'ready', data: presence });
        }
      };

      socket.onclose = () => {
        if (closedRef.current) return;
        scheduleReconnect();
      };

      socket.onerror = () => {
        setState((prev) => (prev.status === 'ready' ? prev : { status: 'unavailable', data: null }));
      };
    };

    connect();

    return () => {
      closedRef.current = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      cleanupSocket();
    };
  }, [userId]);

  return state;
}
