import { authEnv, getOrigin, newState, redirect, returnYearCookie } from '../_lib/session.js';
import { getEdition, DEFAULT_YEAR } from '../../config.js';

// GitHub OAuth Apps have no read-only scope for private repositories, so `repo` is required to
// read private contributions. This app only ever sends read (GraphQL query) requests with it.
const SCOPES = 'read:user repo';

/** GET /api/auth/login[?year=2025] → redirects to GitHub's consent screen. */
export function GET(request: Request): Response {
  const { clientId, enabled } = authEnv();
  const origin = getOrigin(request);
  const edition = getEdition(new URL(request.url, origin).searchParams.get('year') ?? DEFAULT_YEAR) ?? getEdition(DEFAULT_YEAR)!;
  if (!enabled) return redirect(`${origin}/${edition.year}?auth_error=not_configured`);

  const { state, cookie } = newState(request);
  const authorize = new URL('https://github.com/login/oauth/authorize');
  authorize.searchParams.set('client_id', clientId!);
  authorize.searchParams.set('redirect_uri', `${origin}/api/auth/callback`);
  authorize.searchParams.set('scope', SCOPES);
  authorize.searchParams.set('state', state);
  authorize.searchParams.set('allow_signup', 'false');

  return redirect(authorize.toString(), [cookie, returnYearCookie(request, edition.year)]);
}
