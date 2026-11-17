import type { UserStats } from '../types';

export type WrapErrorCode = 'not_found' | 'rate_limited' | 'session_expired' | 'unauthorized' | 'misconfigured' | 'upstream';

export class WrapError extends Error {
  constructor(public code: WrapErrorCode, message: string) {
    super(message);
  }
}

export interface WrapResponse {
  stats: UserStats;
  funMessage: string;
}

/**
 * Fetches a user's wrap from our own backend. GitHub and Gemini are only ever called server-side,
 * so no API token exists in the browser.
 *
 * `includePrivate` asks for the signed-in owner's private view (the server verifies the session).
 */
export async function fetchWrap(username: string, year: number, includePrivate: boolean): Promise<WrapResponse> {
  const params = new URLSearchParams({ username, year: String(year) });
  if (includePrivate) params.set('private', '1');

  let resp: Response;
  try {
    resp = await fetch(`/api/stats?${params}`, { credentials: 'same-origin' });
  } catch {
    throw new WrapError('upstream', 'Network error');
  }

  const body = await resp.json().catch(() => null);
  if (!resp.ok || !body?.stats) {
    throw new WrapError(body?.error ?? 'upstream', body?.message ?? `Request failed (${resp.status})`);
  }
  return body as WrapResponse;
}
