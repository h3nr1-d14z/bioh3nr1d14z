import { useEffect, useState } from 'react';
import { Users } from 'lucide-react';

export default function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const increment = async () => {
      try {
        const res = await fetch('/api/visit', { method: 'POST' });
        if (!res.ok) throw new Error('Failed');
        const data = await res.json();
        setCount(data.count);
      } catch {
        setCount(null);
      }
    };

    increment();
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
      <Users size={14} color="#D4AF37" />
      <span>
        <span style={{ color: '#D4AF37' }}>{count.toLocaleString()}</span> visitors
      </span>
    </div>
  );
}
