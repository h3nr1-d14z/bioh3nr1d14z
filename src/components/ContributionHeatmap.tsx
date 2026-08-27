import { useEffect, useMemo, useState } from 'react';
import { profile } from '../data/profile';

/**
 * Heatmap đóng góp GitHub 12 tháng.
 *
 * GitHub không có REST endpoint cho contribution graph — dữ liệu đó chỉ có
 * qua GraphQL (cần token) hoặc scrape trang profile. jogruber/github-contributions-api
 * làm sẵn việc đó, miễn phí và có CORS mở, nên gọi thẳng từ client.
 * Không có dữ liệu thì component tự ẩn.
 */

interface Day {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

interface ApiResponse {
  total: Record<string, number> | { lastYear: number };
  contributions: Day[];
}

const WEEKS_SHOWN = 53;
const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Gom các ngày thành cột tuần, mỗi cột bắt đầu từ Chủ nhật như GitHub. */
function toWeeks(days: Day[]): (Day | null)[][] {
  if (days.length === 0) return [];

  const weeks: (Day | null)[][] = [];
  let current: (Day | null)[] = [];

  // Ngày đầu tiên có thể rơi vào giữa tuần — chèn ô trống cho khớp lưới.
  const firstDow = new Date(days[0].date).getDay();
  for (let i = 0; i < firstDow; i += 1) current.push(null);

  for (const day of days) {
    current.push(day);
    if (current.length === 7) {
      weeks.push(current);
      current = [];
    }
  }
  if (current.length > 0) {
    while (current.length < 7) current.push(null);
    weeks.push(current);
  }

  return weeks.slice(-WEEKS_SHOWN);
}

/** Chuỗi ngày liên tiếp có đóng góp, tính ngược từ ngày gần nhất. */
function currentStreak(days: Day[]): number {
  let streak = 0;
  for (let i = days.length - 1; i >= 0; i -= 1) {
    if (days[i].count > 0) streak += 1;
    // Hôm nay chưa commit thì chưa tính là đứt chuỗi — ngày vẫn đang diễn ra.
    else if (i === days.length - 1) continue;
    else break;
  }
  return streak;
}

function longestStreak(days: Day[]): number {
  let best = 0;
  let run = 0;
  for (const day of days) {
    run = day.count > 0 ? run + 1 : 0;
    if (run > best) best = run;
  }
  return best;
}

export default function ContributionHeatmap() {
  const [days, setDays] = useState<Day[] | null>(null);
  const [total, setTotal] = useState<number | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch(`https://github-contributions-api.jogruber.de/v4/${profile.githubLogin}?y=last`)
      .then((res) => {
        if (!res.ok) throw new Error(String(res.status));
        return res.json() as Promise<ApiResponse>;
      })
      .then((payload) => {
        if (cancelled) return;
        const lastYear =
          typeof payload.total === 'object' && 'lastYear' in payload.total
            ? payload.total.lastYear
            : Object.values(payload.total)[0];
        setDays(payload.contributions);
        setTotal(typeof lastYear === 'number' ? lastYear : null);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const weeks = useMemo(() => (days ? toWeeks(days) : []), [days]);

  const monthColumns = useMemo(() => {
    const marks: { label: string; column: number }[] = [];
    let lastMonth = -1;
    let lastColumn = -Infinity;

    weeks.forEach((week, index) => {
      const firstReal = week.find((d): d is Day => d !== null);
      if (!firstReal) return;
      const month = new Date(firstReal.date).getMonth();
      if (month === lastMonth) return;
      lastMonth = month;
      // Nhãn rộng ~24px còn mỗi cột 11px, nên hai mốc cách nhau dưới 3 cột sẽ
      // đè lên nhau ("Aug" chồng "Sep"). Bỏ nhãn quá sát thay vì để chồng chữ.
      if (index - lastColumn < 3) return;
      lastColumn = index;
      marks.push({ label: MONTH_LABELS[month], column: index });
    });

    return marks;
  }, [weeks]);

  if (failed || !days || weeks.length === 0) return null;

  return (
    <div className="heatmap">
      <div className="heatmap__head">
        <p className="heatmap__total">
          <strong>{total?.toLocaleString('en-US')}</strong> contributions in the last year
        </p>
        <p className="heatmap__streaks">
          {currentStreak(days)}d current · {longestStreak(days)}d longest
        </p>
      </div>

      <div className="heatmap__scroll">
        <div className="heatmap__inner">
          <div className="heatmap__months" aria-hidden="true">
            {monthColumns.map((mark) => (
              <span
                key={`${mark.label}-${mark.column}`}
                className="heatmap__month"
                style={{ gridColumnStart: mark.column + 1 }}
              >
                {mark.label}
              </span>
            ))}
          </div>

          <div
            className="heatmap__grid"
            role="img"
            aria-label={`GitHub contribution graph: ${total} contributions in the last year`}
          >
            {weeks.map((week, wi) => (
              <div key={wi} className="heatmap__week">
                {week.map((day, di) =>
                  day ? (
                    <span
                      key={day.date}
                      className={`heatmap__day heatmap__day--l${day.level}`}
                      title={`${day.count} contribution${day.count === 1 ? '' : 's'} on ${day.date}`}
                    />
                  ) : (
                    <span key={`empty-${wi}-${di}`} className="heatmap__day heatmap__day--empty" />
                  )
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="heatmap__legend">
        <span>Less</span>
        {[0, 1, 2, 3, 4].map((level) => (
          <span key={level} className={`heatmap__day heatmap__day--l${level}`} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
