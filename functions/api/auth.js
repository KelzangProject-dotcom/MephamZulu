import { jsonResponse } from '../_shared.js';

export async function onRequestPost({ request, env }) {
  let password;
  try {
    password = (await request.json()).password;
  } catch (err) {
    return jsonResponse(400, { error: 'Invalid request body' });
  }

  if (password && env.ADMIN_PASSWORD && password === env.ADMIN_PASSWORD) {
    return jsonResponse(200, { role: 'admin' });
  }

  if (password && env.USER_PASSWORD && password === env.USER_PASSWORD) {
    return jsonResponse(200, { role: 'user' });
  }

  return jsonResponse(401, { error: 'Incorrect password' });
}

export async function onRequest({ request }) {
  if (request.method !== 'POST') {
    return jsonResponse(405, { error: 'Method Not Allowed' });
  }
}
