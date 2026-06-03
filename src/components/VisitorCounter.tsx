import { useEffect, useRef, useState } from 'react';
import { Activity } from 'lucide-react';

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
        const data = await res.json();
        setCount(data.count);
      } catch {
        setCount(null);
      }
    };

    ping();
    intervalRef.current = setInterval(ping, 30000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  if (count === null) return null;

  return (
    <div
      className="visitor-counter"
      style={{
        position: 'fixed',
        bottom: '32px',
        left: '32px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontFamily: "'Geist Mono', monospace",
        fontSize: '12px',
        color: '#777777',
        zIndex: 100,
        background: 'rgba(28, 28, 28, 0.8)',
        padding: '8px 16px',
        borderRadius: '20px',
        border: '1px solid rgba(212, 175, 55, 0.3)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <Activity size={14} color="#00ff88" />
      <span>
        <span style={{ color: '#00ff88' }}>{count}</span> online
      </span>
    </div>
  );
}
