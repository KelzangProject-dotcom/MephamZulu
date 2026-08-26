import { jsonResponse } from './_turso.js';

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Method Not Allowed' });
  }

  let password;
  try {
    password = JSON.parse(event.body || '{}').password;
  } catch (err) {
    return jsonResponse(400, { error: 'Invalid request body' });
  }

  if (password && process.env.ADMIN_PASSWORD && password === process.env.ADMIN_PASSWORD) {
    return jsonResponse(200, { role: 'admin' });
  }

  if (password && process.env.USER_PASSWORD && password === process.env.USER_PASSWORD) {
    return jsonResponse(200, { role: 'user' });
  }

  return jsonResponse(401, { error: 'Incorrect password' });
}
