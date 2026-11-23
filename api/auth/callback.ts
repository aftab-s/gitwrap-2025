import { authEnv, clearCookie, getOrigin, redirect, sessionCookie, stateMatches, STATE_COOKIE } from '../_lib/session.js';

/**
 * GET /api/auth/callback?code=...&state=...
 * Exchanges the code for a token server-side (the client secret never leaves the server) and stores
 * the token in an encrypted HttpOnly cookie.
 */
export async function GET(request: Request): Promise<Response> {
  const { clientId, clientSecret, enabled } = authEnv();
  const origin = getOrigin(request);
  const url = new URL(request.url, origin);
  const clearState = clearCookie(request, STATE_COOKIE);
  const fail = (reason: string) => redirect(`${origin}/?auth_error=${reason}`, [clearState]);

  if (!enabled) return fail('not_configured');
  if (url.searchParams.get('error')) return fail('denied'); // user clicked "Cancel" on GitHub
  const code = url.searchParams.get('code');
  if (!code || !stateMatches(request, url.searchParams.get('state'))) return fail('invalid_state');

  try {
    const tokenResp = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { accept: 'application/json', 'content-type': 'application/json' },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: `${origin}/api/auth/callback`,
      }),
    });
    const tokenBody = (await tokenResp.json()) as { access_token?: string };
    if (!tokenBody.access_token) return fail('exchange_failed');

    const userResp = await fetch('https://api.github.com/user', {
      headers: { authorization: `Bearer ${tokenBody.access_token}`, 'user-agent': 'gitwrap' },
    });
    const user = (await userResp.json()) as { login?: string };
    if (!userResp.ok || !user.login) return fail('exchange_failed');

    return redirect(`${origin}/u/${encodeURIComponent(user.login)}?auth=1`, [
      sessionCookie(request, user.login, tokenBody.access_token),
      clearState,
    ]);
  } catch (err) {
    console.error('OAuth callback failed:', err);
    return fail('exchange_failed');
  }
}
