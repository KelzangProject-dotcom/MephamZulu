import { getClient, jsonResponse } from './_turso.js';

async function ensureTable(client) {
  await client.execute(`
    CREATE TABLE IF NOT EXISTS tracker_state (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      data TEXT NOT NULL
    )
  `);
}

export async function handler(event) {
  const client = getClient();
  await ensureTable(client);

  if (event.httpMethod === 'GET') {
    const result = await client.execute('SELECT data FROM tracker_state WHERE id = 1');
    const data = result.rows.length ? result.rows[0].data : '[]';
    return jsonResponse(200, JSON.parse(data));
  }

  if (event.httpMethod === 'POST') {
    const data = event.body || '[]';
    await client.execute({
      sql: 'INSERT INTO tracker_state (id, data) VALUES (1, ?) ON CONFLICT(id) DO UPDATE SET data = excluded.data',
      args: [data]
    });
    return jsonResponse(200, { ok: true });
  }

  return jsonResponse(405, { error: 'Method Not Allowed' });
}
