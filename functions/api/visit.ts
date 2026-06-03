export interface Env {
  VISITOR_KV: KVNamespace;
}

const SESSION_KEY = 'active_sessions';
const TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

interface Session {
  id: string;
  ts: number;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  if (context.request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  let sessions: Session[] = [];

  try {
    const stored = await context.env.VISITOR_KV.get(SESSION_KEY);
    if (stored) {
      sessions = JSON.parse(stored);
    }
  } catch {
    // ignore parse errors
  }

  const now = Date.now();

  // Remove expired sessions
  sessions = sessions.filter((s) => now - s.ts < TIMEOUT_MS);

  if (context.request.method === 'POST') {
    try {
      const body = (await context.request.json()) as { sessionId?: string };
      const sessionId = body.sessionId || crypto.randomUUID();

      const existingIndex = sessions.findIndex((s) => s.id === sessionId);
      if (existingIndex >= 0) {
        sessions[existingIndex].ts = now;
      } else {
        sessions.push({ id: sessionId, ts: now });
      }
    } catch {
      // ignore body parse errors
    }

    try {
      await context.env.VISITOR_KV.put(SESSION_KEY, JSON.stringify(sessions));
    } catch {
      // ignore write errors
    }
  }

  return new Response(
    JSON.stringify({ count: sessions.length }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    }
  );
};
