import { createCipheriv, createDecipheriv, createHash, randomBytes, timingSafeEqual } from 'node:crypto';

/**
 * Server-side session helpers.
 *
 * The signed-in user's GitHub token is stored ONLY in an encrypted (AES-256-GCM), HttpOnly cookie.
 * Browser JavaScript can never read it, and even the raw cookie value is useless without SESSION_SECRET.
 */

export interface Session {
  login: string;
  token: string;
  exp: number; // epoch ms
}

export const SESSION_COOKIE = 'gw_session';
export const STATE_COOKIE = 'gw_oauth_state';
const SESSION_TTL_SECONDS = 8 * 60 * 60; // 8 hours

export function authEnv() {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  const sessionSecret = process.env.SESSION_SECRET;
  const enabled = Boolean(clientId && clientSecret && sessionSecret && sessionSecret.length >= 32);
  return { clientId, clientSecret, sessionSecret, enabled };
}

function key(): Buffer {
  const { sessionSecret } = authEnv();
  if (!sessionSecret) throw new Error('SESSION_SECRET is not set');
  return createHash('sha256').update(sessionSecret).digest();
}

function seal(payload: object): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key(), iv);
  const data = Buffer.concat([cipher.update(JSON.stringify(payload), 'utf8'), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), data]).toString('base64url');
}

function unseal<T>(value: string): T | null {
  try {
    const raw = Buffer.from(value, 'base64url');
    const decipher = createDecipheriv('aes-256-gcm', key(), raw.subarray(0, 12));
    decipher.setAuthTag(raw.subarray(12, 28));
    const data = Buffer.concat([decipher.update(raw.subarray(28)), decipher.final()]);
    return JSON.parse(data.toString('utf8')) as T;
  } catch {
    return null; // tampered, wrong key, or malformed
  }
}

// ---------------------------------------------------------------------------
// Cookies
// ---------------------------------------------------------------------------

export function readCookie(request: Request, name: string): string | undefined {
  const header = request.headers.get('cookie') ?? '';
  for (const part of header.split(';')) {
    const idx = part.indexOf('=');
    if (idx > -1 && part.slice(0, idx).trim() === name) {
      return decodeURIComponent(part.slice(idx + 1).trim());
    }
  }
  return undefined;
}

/** Public origin of this deployment, e.g. https://gitwrap-2026.vercel.app or http://localhost:3000 */
export function getOrigin(request: Request): string {
  if (process.env.APP_URL) return process.env.APP_URL.replace(/\/$/, '');
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host') ?? new URL(request.url).host;
  const isLocal = /^(localhost|127\.0\.0\.1)(:\d+)?$/.test(host);
  const proto = request.headers.get('x-forwarded-proto')?.split(',')[0] ?? (isLocal ? 'http' : 'https');
  return `${proto}://${host}`;
}

function cookie(request: Request, name: string, value: string, maxAge: number): string {
  const secure = getOrigin(request).startsWith('https://') ? '; Secure' : '';
  return `${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure}`;
}

export function sessionCookie(request: Request, login: string, token: string): string {
  const session: Session = { login, token, exp: Date.now() + SESSION_TTL_SECONDS * 1000 };
  return cookie(request, SESSION_COOKIE, seal(session), SESSION_TTL_SECONDS);
}

export function clearCookie(request: Request, name: string): string {
  return cookie(request, name, '', 0);
}

export function getSession(request: Request): Session | null {
  if (!authEnv().enabled) return null;
  const value = readCookie(request, SESSION_COOKIE);
  if (!value) return null;
  const session = unseal<Session>(value);
  if (!session || !session.login || !session.token || session.exp < Date.now()) return null;
  return session;
}

// ---------------------------------------------------------------------------
// OAuth state (CSRF protection for the login round-trip)
// ---------------------------------------------------------------------------

export function newState(request: Request): { state: string; cookie: string } {
  const state = randomBytes(24).toString('base64url');
  return { state, cookie: cookie(request, STATE_COOKIE, state, 600) };
}

export function stateMatches(request: Request, state: string | null): boolean {
  const expected = readCookie(request, STATE_COOKIE);
  if (!expected || !state) return false;
  const a = Buffer.from(expected);
  const b = Buffer.from(state);
  return a.length === b.length && timingSafeEqual(a, b);
}

// ---------------------------------------------------------------------------
// Responses
// ---------------------------------------------------------------------------

export function json(body: unknown, init: { status?: number; headers?: Record<string, string> } = {}): Response {
  return new Response(JSON.stringify(body), {
    status: init.status ?? 200,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...init.headers },
  });
}

export function redirect(location: string, setCookies: string[] = []): Response {
  const headers = new Headers({ location, 'cache-control': 'no-store' });
  setCookies.forEach((c) => headers.append('set-cookie', c));
  return new Response(null, { status: 302, headers });
}
