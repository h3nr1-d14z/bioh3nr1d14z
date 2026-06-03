export interface Env {
  VISITOR_KV: KVNamespace;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);

  if (context.request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  const key = 'visitor_count';
  let count = 0;

  try {
    const stored = await context.env.VISITOR_KV.get(key);
    if (stored) {
      count = parseInt(stored, 10);
    }
  } catch {
    // ignore
  }

  if (context.request.method === 'POST') {
    count += 1;
    try {
      await context.env.VISITOR_KV.put(key, count.toString());
    } catch {
      // ignore
    }
  }

  return new Response(
    JSON.stringify({ count }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    }
  );
};
