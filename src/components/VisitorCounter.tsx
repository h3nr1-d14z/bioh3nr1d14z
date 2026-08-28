import { useEffect, useRef, useState } from 'react';
import { Activity } from 'lucide-react';

/**
 * 45 giây, khớp với SESSION_TIMEOUT_MS 120 giây trong workers/presence —
 * mỗi cửa sổ timeout có hai nhịp ping dự phòng, nên mất một nhịp không làm
 * khách biến mất khỏi số đếm.
 *
 * Ở nhịp này mỗi tab tạo 80 request/giờ, tức khoảng 1.250 giờ-khách/ngày nằm
 * trong hạn 100.000 request/ngày của Durable Objects ở gói free.
 */
const PING_INTERVAL_MS = 45_000;

export default function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    let sessionId = sessionStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      sessionStorage.setItem('sessionId', sessionId);
    }

    const ping = async () => {
      try {
        const res = await fetch('/api/visit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        });
        if (!res.ok) throw new Error('Failed');
        const data = (await res.json()) as { count: number };
        setCount(data.count);
      } catch {
        setCount(null);
      }
    };

    ping();
    intervalRef.current = setInterval(ping, PING_INTERVAL_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  if (count === null) return null;

  return (
    <div className="visitor-counter">
      <Activity size={14} className="visitor-counter__icon" aria-hidden="true" />
      <span>
        <span className="visitor-counter__value">{count}</span> online
      </span>
    </div>
  );
}
