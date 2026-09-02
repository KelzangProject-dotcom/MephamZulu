// TEMPORARY DIAGNOSTIC - restore real handler after debugging
import { createClient } from '@libsql/client/web';

export default async function handler(req, res) {
  const out = { scheme: (process.env.TURSO_DATABASE_URL || '').split(':')[0] || null };
  try {
    const client = createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN
    });
    await client.execute(`
      CREATE TABLE IF NOT EXISTS board_state (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        data TEXT NOT NULL
      )
    `);
    const r = await client.execute('SELECT data FROM board_state WHERE id = 1');
    out.ok = true;
    out.rowCount = r.rows.length;
    out.data = r.rows.length ? r.rows[0].data : '{}';
  } catch (e) {
    out.ok = false;
    out.error = String((e && e.message) || e);
    out.name = e && e.name;
    out.code = e && e.code;
  }
  res.status(200).json(out);
}
