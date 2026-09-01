import { getClient, jsonResponse } from './_shared.js';

async function ensureTable(client) {
  await client.execute(`
    CREATE TABLE IF NOT EXISTS board_state (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      data TEXT NOT NULL
    )
  `);
}

export async function GET() {
  const client = getClient();
  await ensureTable(client);
  const result = await client.execute('SELECT data FROM board_state WHERE id = 1');
  const data = result.rows.length ? result.rows[0].data : '{}';
  return jsonResponse(200, JSON.parse(data));
}

export async function POST(request) {
  const client = getClient();
  await ensureTable(client);
  const data = (await request.text()) || '{}';
  await client.execute({
    sql: 'INSERT INTO board_state (id, data) VALUES (1, ?) ON CONFLICT(id) DO UPDATE SET data = excluded.data',
    args: [data]
  });
  return jsonResponse(200, { ok: true });
}
