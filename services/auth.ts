import { useEffect, useSyncExternalStore } from 'react';

/**
 * Browser-side view of the GitHub session.
 *
 * The browser never holds a GitHub token: sign-in is a redirect through /api/auth/login, and the
 * token lives in an encrypted HttpOnly cookie that only the /api functions can read. All this module
 * knows is *who* is signed in (from /api/auth/me).
 */

export interface AuthState {
  /** false until /api/auth/me has answered */
  ready: boolean;
  /** false when the server has no GitHub OAuth app configured → hide sign-in UI */
  authEnabled: boolean;
  login: string | null;
}

let state: AuthState = { ready: false, authEnabled: false, login: null };
let loading: Promise<void> | null = null;
const listeners = new Set<() => void>();

function setState(next: AuthState) {
  state = next;
  listeners.forEach((l) => l());
}

function load(): Promise<void> {
  loading ??= fetch('/api/auth/me', { credentials: 'same-origin' })
    .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`auth/me ${r.status}`))))
    .then((body) => setState({ ready: true, authEnabled: Boolean(body.authEnabled), login: body.login ?? null }))
    .catch((err) => {
      console.warn('Could not load session:', err);
      setState({ ready: true, authEnabled: false, login: null });
    });
  return loading;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useAuth(): AuthState {
  useEffect(() => {
    load();
  }, []);
  return useSyncExternalStore(subscribe, () => state, () => state);
}

/** True when the signed-in user is `username` (case-insensitive). */
export function isOwnProfile(auth: AuthState, username?: string): boolean {
  return Boolean(auth.login && username && auth.login.toLowerCase() === username.toLowerCase());
}

/** Full-page redirect to GitHub; comes back to /u/<login>. */
export function signIn(year: number) {
  window.location.assign(`/api/auth/login?year=${year}`);
}

export async function signOut(): Promise<void> {
  try {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' });
  } finally {
    setState({ ...state, login: null });
  }
}

/** Called when the server reports the session is gone (expired / revoked token). */
export function markSignedOut() {
  if (state.login) setState({ ...state, login: null });
}
