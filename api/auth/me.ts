import { authEnv, getSession, json } from '../_lib/session.js';

/** GET /api/auth/me → who is signed in (never returns the token). */
export function GET(request: Request): Response {
  return json({
    authEnabled: authEnv().enabled,
    login: getSession(request)?.login ?? null,
  });
}
