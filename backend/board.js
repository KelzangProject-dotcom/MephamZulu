import { getClient } from './_shared.js';

async function ensureTable(client) {
  await client.execute(`
    CREATE TABLE IF NOT EXISTS board_state (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      data TEXT NOT NULL
    )
  `);
}

export default async function handler(req, res) {
  const client = getClient();
  await ensureTable(client);

  if (req.method === 'GET') {
    const result = await client.execute('SELECT data FROM board_state WHERE id = 1');
    const data = result.rows.length ? result.rows[0].data : '{}';
    return res.status(200).json(JSON.parse(data));
  }

  if (req.method === 'POST') {
    const data = req.body == null
      ? '{}'
      : (typeof req.body === 'string' ? req.body : JSON.stringify(req.body));
    await client.execute({
      sql: 'INSERT INTO board_state (id, data) VALUES (1, ?) ON CONFLICT(id) DO UPDATE SET data = excluded.data',
      args: [data]
    });
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
