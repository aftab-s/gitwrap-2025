import { clearCookie, json, SESSION_COOKIE } from '../_lib/session.js';

/** POST /api/auth/logout → clears the session cookie. */
export function POST(request: Request): Response {
  return json({ ok: true }, { headers: { 'set-cookie': clearCookie(request, SESSION_COOKIE) } });
}
