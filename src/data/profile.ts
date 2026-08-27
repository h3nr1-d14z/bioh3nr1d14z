/**
 * Mọi handle / ID ngoài site gom về một chỗ.
 *
 * Quy ước: để chuỗi rỗng nghĩa là "chưa cấu hình" — component tương ứng tự
 * ẩn thay vì hiện khung rỗng hay dữ liệu giả. Điền vào là section tự hiện,
 * không phải sửa code.
 */

export const profile = {
  githubLogin: 'h3nr1-d14z',

  /**
   * Lanyard chỉ theo dõi được người đã vào server discord.gg/lanyard.
   * Chưa vào thì API trả `user_not_monitored` và widget tự ẩn.
   */
  discordUserId: '416498992700981250',

  /** Handle Codeforces. Để rỗng cho tới khi tài khoản sẵn sàng. */
  codeforcesHandle: '',

  /**
   * WakaTime: cần bật chia sẻ công khai hoặc đặt secret WAKATIME_API_KEY
   * trên Cloudflare. Để rỗng thì section không hiện.
   */
  wakatimeUsername: '',
} as const;

export type Profile = typeof profile;
