export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  let password;
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    password = body.password;
  } catch (err) {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  if (password && process.env.ADMIN_PASSWORD && password === process.env.ADMIN_PASSWORD) {
    return res.status(200).json({ role: 'admin' });
  }

  if (password && process.env.USER_PASSWORD && password === process.env.USER_PASSWORD) {
    return res.status(200).json({ role: 'user' });
  }

  return res.status(401).json({ error: 'Incorrect password' });
}
