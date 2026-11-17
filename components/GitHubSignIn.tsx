import React from 'react';
import { useParams } from 'react-router-dom';
import { DEFAULT_YEAR, getEdition } from '../config';
import { signIn, signOut, useAuth } from '../services/auth';

const GitHubMark: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
  </svg>
);

interface Props {
  label?: string;
  className?: string;
}

/**
 * "Sign in with GitHub" button, or "Signed in as … / Sign out" once signed in.
 * When the server has no GitHub OAuth app configured, the button is shown disabled with a hint,
 * so the feature is discoverable instead of silently missing.
 */
const GitHubSignIn: React.FC<Props> = ({ label = 'Sign in with GitHub', className = '' }) => {
  const auth = useAuth();
  // Remember which edition the user is on so sign-in brings them back to it.
  const year = (getEdition(useParams().year) ?? getEdition(DEFAULT_YEAR)!).year;

  if (!auth.ready) return null;

  if (!auth.authEnabled) {
    return (
      <div className={`flex flex-col items-center gap-2 ${className}`}>
        <button
          type="button"
          disabled
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/20 text-gray-400 font-semibold text-sm cursor-not-allowed"
        >
          <GitHubMark className="w-4 h-4" />
          {label}
        </button>
        <p className="text-[0.7rem] text-amber-300/80 max-w-sm text-center leading-snug">
          {(import.meta as any).env?.DEV ? (
            <>
              Sign-in isn't set up on this server yet. Set <code>GITHUB_CLIENT_ID</code>, <code>GITHUB_CLIENT_SECRET</code>{' '}
              and <code>SESSION_SECRET</code>, then restart.
            </>
          ) : (
            'GitHub sign-in is temporarily unavailable.'
          )}
        </p>
      </div>
    );
  }

  if (auth.login) {
    return (
      <div className={`flex items-center justify-center gap-3 text-sm text-gray-300 ${className}`}>
        <span>
          Signed in as <strong className="text-white">@{auth.login}</strong>
        </span>
        <button
          type="button"
          onClick={() => signOut()}
          className="text-gray-400 underline underline-offset-2 hover:text-white"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <button
        type="button"
        onClick={() => signIn(year)}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-gray-900 font-semibold text-sm hover:bg-gray-200 transition-colors"
      >
        <GitHubMark className="w-4 h-4" />
        {label}
      </button>
      <p className="text-[0.7rem] text-gray-500 max-w-sm text-center leading-snug">
        Read-only use. Your GitHub token is kept in an encrypted, HttpOnly cookie and is never exposed to the page.
      </p>
    </div>
  );
};

export default GitHubSignIn;
