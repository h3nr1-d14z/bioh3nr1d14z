import { useEffect, useState } from 'react';
import { Music } from 'lucide-react';
import { useLanyard, type DiscordStatus, type LanyardActivity } from '../lib/useLanyard';
import { profile } from '../data/profile';

const STATUS_LABEL: Record<DiscordStatus, string> = {
  online: 'Online',
  idle: 'Idle',
  dnd: 'Do not disturb',
  offline: 'Offline',
};

/** Custom status (type 4) là dòng chữ tự đặt, không phải hoạt động thật. */
const CUSTOM_STATUS_TYPE = 4;
const SPOTIFY_ACTIVITY_TYPE = 2;

const VERB: Record<number, string> = {
  0: 'Playing',
  1: 'Streaming',
  2: 'Listening to',
  3: 'Watching',
  5: 'Competing in',
};

/**
 * Mọi ảnh từ CDN Discord đi qua /api/avatar. Nạp trực tiếp thì Cloudflare của
 * Discord đặt cookie `__cf_bm` lên trình duyệt khách — cookie bên thứ ba mà
 * khách không hề chọn.
 */
function proxied(url: string): string {
  return `/api/avatar?url=${encodeURIComponent(url)}`;
}

/**
 * Ảnh asset của Rich Presence có hai dạng: id asset của ứng dụng, hoặc ảnh
 * ngoài đã được Discord proxy với tiền tố `mp:`.
 */
function assetUrl(activity: LanyardActivity): string | null {
  const image = activity.assets?.large_image;
  if (!image) return null;
  if (image.startsWith('mp:')) {
    return proxied(`https://media.discordapp.net/${image.slice(3)}`);
  }
  if (!activity.application_id) return null;
  return proxied(
    `https://cdn.discordapp.com/app-assets/${activity.application_id}/${image}.png`
  );
}

function formatElapsed(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}

/** Đồng hồ dùng chung, chỉ chạy khi có thứ cần đếm. */
function useTicker(active: boolean): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [active]);
  return now;
}

export default function DiscordPresence() {
  const state = useLanyard(profile.discordUserId);
  const data = state.status === 'ready' ? state.data : null;

  const spotify = data?.listening_to_spotify ? data.spotify : null;
  const activities = (data?.activities ?? []).filter(
    (a) => a.type !== CUSTOM_STATUS_TYPE && a.type !== SPOTIFY_ACTIVITY_TYPE
  );
  const customStatus = (data?.activities ?? []).find((a) => a.type === CUSTOM_STATUS_TYPE);

  const needsTicker = Boolean(spotify) || activities.some((a) => a.timestamps?.start);
  const now = useTicker(needsTicker);

  // Lanyard chỉ theo dõi người đã vào discord.gg/lanyard. Chưa vào thì ẩn hẳn
  // — thà không có widget còn hơn một khung "đang tải" đứng vĩnh viễn.
  if (state.status !== 'ready' || !data) return null;

  const user = data.discord_user;
  const name = user.global_name || user.display_name || user.username;
  const avatar = proxied(
    user.avatar
      ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${
          user.avatar.startsWith('a_') ? 'gif' : 'png'
        }?size=128`
      : 'https://cdn.discordapp.com/embed/avatars/0.png'
  );

  const spotifyProgress = spotify
    ? Math.min(
        100,
        Math.max(
          0,
          ((now - spotify.timestamps.start) /
            (spotify.timestamps.end - spotify.timestamps.start)) *
            100
        )
      )
    : 0;

  return (
    <div className="presence">
      <div className="presence__head">
        <div className="presence__avatar-wrap">
          <img className="presence__avatar" src={avatar} alt="" width={56} height={56} />
          <span
            className={`presence__dot presence__dot--${data.discord_status}`}
            title={STATUS_LABEL[data.discord_status]}
          />
        </div>

        <div className="presence__identity">
          <p className="presence__name">{name}</p>
          <p className="presence__status">
            {STATUS_LABEL[data.discord_status]}
            {customStatus?.state ? ` · ${customStatus.state}` : ''}
          </p>
        </div>
      </div>

      {activities.length === 0 && !spotify && (
        <p className="presence__idle">Not doing anything right now.</p>
      )}

      {activities.map((activity) => {
        const image = assetUrl(activity);
        const started = activity.timestamps?.start;

        return (
          <div key={activity.id ?? activity.name} className="presence__activity">
            {image ? (
              <img className="presence__art" src={image} alt="" width={54} height={54} />
            ) : (
              <div className="presence__art presence__art--blank" aria-hidden="true" />
            )}
            <div className="presence__activity-text">
              <p className="presence__verb">{VERB[activity.type] ?? 'Playing'}</p>
              <p className="presence__activity-name">{activity.name}</p>
              {activity.details && <p className="presence__line">{activity.details}</p>}
              {activity.state && <p className="presence__line">{activity.state}</p>}
              {started && (
                <p className="presence__elapsed">{formatElapsed(now - started)} elapsed</p>
              )}
            </div>
          </div>
        );
      })}

      {spotify && (
        <div className="presence__activity presence__activity--spotify">
          <img
            className="presence__art"
            src={proxied(spotify.album_art_url)}
            alt={`Album art for ${spotify.album}`}
            width={54}
            height={54}
          />
          <div className="presence__activity-text">
            <p className="presence__verb">
              <Music size={11} aria-hidden="true" /> Spotify
            </p>
            <p className="presence__activity-name">{spotify.song}</p>
            <p className="presence__line">by {spotify.artist}</p>
            <div
              className="presence__progress"
              role="progressbar"
              aria-valuenow={Math.round(spotifyProgress)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Track progress"
            >
              <span
                className="presence__progress-fill"
                style={{ width: `${spotifyProgress}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
