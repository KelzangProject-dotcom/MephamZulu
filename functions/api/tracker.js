import { getClient, jsonResponse } from '../_shared.js';

async function ensureTable(client) {
  await client.execute(`
    CREATE TABLE IF NOT EXISTS tracker_state (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      data TEXT NOT NULL
    )
  `);
}

export async function onRequestGet({ env }) {
  const client = getClient(env);
  await ensureTable(client);
  const result = await client.execute('SELECT data FROM tracker_state WHERE id = 1');
  const data = result.rows.length ? result.rows[0].data : '[]';
  return jsonResponse(200, JSON.parse(data));
}

export async function onRequestPost({ request, env }) {
  const client = getClient(env);
  await ensureTable(client);
  const data = (await request.text()) || '[]';
  await client.execute({
    sql: 'INSERT INTO tracker_state (id, data) VALUES (1, ?) ON CONFLICT(id) DO UPDATE SET data = excluded.data',
    args: [data]
  });
  return jsonResponse(200, { ok: true });
}

export async function onRequest({ request }) {
  if (request.method !== 'GET' && request.method !== 'POST') {
    return jsonResponse(405, { error: 'Method Not Allowed' });
  }
}
