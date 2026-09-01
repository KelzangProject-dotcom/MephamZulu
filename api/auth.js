import { jsonResponse } from './_shared.js';

export async function POST(request) {
  let password;
  try {
    password = (await request.json()).password;
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
