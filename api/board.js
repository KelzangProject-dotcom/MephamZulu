// TEMPORARY DIAGNOSTIC - restore real handler after debugging
export default async function handler(req, res) {
  const diag = {
    node: process.version,
    hasUrl: !!process.env.TURSO_DATABASE_URL,
    hasToken: !!process.env.TURSO_AUTH_TOKEN,
    urlScheme: (process.env.TURSO_DATABASE_URL || '').split(':')[0] || null
  };
  try {
    const mod = await import('@libsql/client/web');
    diag.imported = true;
    const client = mod.createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN
    });
    diag.clientCreated = true;
    const r = await client.execute('SELECT 1 AS one');
    diag.query = r.rows;
    diag.ok = true;
  } catch (e) {
    diag.ok = false;
    diag.error = String((e && e.message) || e);
    diag.name = e && e.name;
    diag.stack = e && e.stack;
  }
  res.status(200).json(diag);
}
