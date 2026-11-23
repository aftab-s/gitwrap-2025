import React from 'react';
import { signIn, useAuth } from '../services/auth';
import { GitHubMark } from './icons/Arcade';

interface Props {
  label?: string;
  className?: string;
}

/**
 * The "Sign in with GitHub" key. Signing out lives in the marquee.
 * When the server has no GitHub OAuth app configured the key is shown locked, so the feature is
 * discoverable instead of silently missing. Renders nothing once signed in.
 */
const GitHubSignIn: React.FC<Props> = ({ label = 'SIGN IN', className = '' }) => {
  const auth = useAuth();

  if (!auth.ready || auth.login) return null;

  if (!auth.authEnabled) {
    return (
      <button
        type="button"
        className={`key key-plain ${className}`}
        disabled
        title={
          (import.meta as any).env?.DEV
            ? 'Sign-in is not set up: set GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET and SESSION_SECRET, then restart.'
            : 'GitHub sign-in is unavailable right now.'
        }
      >
        <GitHubMark size={18} />
        {label}
      </button>
    );
  }

  return (
    <button type="button" className={`key key-plain ${className}`} onClick={() => signIn()}>
      <GitHubMark size={18} />
      {label}
    </button>
  );
};

export default GitHubSignIn;
