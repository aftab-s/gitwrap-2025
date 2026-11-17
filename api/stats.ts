import { fetchGitHubStats, GitHubError } from './_lib/github.js';
import { generateFunMessage } from './_lib/funMessage.js';
import { getSession, clearCookie, json, SESSION_COOKIE } from './_lib/session.js';
import { getEdition, DEFAULT_YEAR } from '../config.js';

// GitHub logins: 1-39 chars, alphanumeric or single hyphens, no leading hyphen.
const USERNAME_RE = /^[a-z\d](?:[a-z\d-]{0,38})$/i;

/**
 * GET /api/stats?username=<login>[&year=2025|2026][&private=1]   (year defaults to the current edition)
 *
 * - Default: public stats, fetched with the server's shared token. Cached at the CDN so repeat
 *   views don't spend GitHub quota.
 * - private=1: only honoured when the caller's session cookie belongs to <login>. Uses that user's
 *   own token and is never cached. (The flag keeps private responses on a separate cache key.)
 */
export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url, 'http://localhost');
  const username = (url.searchParams.get('username') ?? '').trim();
  if (!USERNAME_RE.test(username)) {
    return json({ error: 'not_found', message: 'Invalid GitHub username' }, { status: 404 });
  }

  const edition = getEdition(url.searchParams.get('year') ?? DEFAULT_YEAR);
  if (!edition) {
    return json({ error: 'not_found', message: 'Unknown year' }, { status: 404 });
  }

  const wantsPrivate = url.searchParams.get('private') === '1';
  let userToken: string | undefined;
  if (wantsPrivate) {
    const session = getSession(request);
    if (!session || session.login.toLowerCase() !== username.toLowerCase()) {
      return json({ error: 'unauthorized', message: 'Sign in to view private contributions' }, { status: 401 });
    }
    userToken = session.token;
  }

  try {
    const stats = await fetchGitHubStats(username, { edition, userToken });
    const funMessage = await generateFunMessage(stats);
    return json(
      { stats, funMessage },
      {
        headers: {
          'cache-control': userToken
            ? 'private, no-store'
            : 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    );
  } catch (err) {
    if (err instanceof GitHubError) {
      if (err.code === 'unauthorized' && userToken) {
        // The user's token was revoked or expired: drop the session.
        return json(
          { error: 'session_expired', message: 'Your GitHub session has expired' },
          { status: 401, headers: { 'set-cookie': clearCookie(request, SESSION_COOKIE) } }
        );
      }
      const status = { not_found: 404, unauthorized: 500, rate_limited: 429, upstream: 502 }[err.code];
      return json({ error: err.code === 'unauthorized' ? 'misconfigured' : err.code, message: err.message }, { status });
    }
    console.error('stats failed:', err);
    return json({ error: 'upstream', message: 'Failed to fetch GitHub data' }, { status: 502 });
  }
}
