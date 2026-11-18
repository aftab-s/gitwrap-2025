import React from 'react';
import { Link } from 'react-router-dom';
import { signOut, useAuth } from '../services/auth';

interface Props {
  year: number;
}

/** The strip across the top of the panel: wordmark, hazard stripe, who is signed in. */
const Marquee: React.FC<Props> = ({ year }) => {
  const auth = useAuth();

  return (
    <header className="marquee">
      <div className="gw-wrap marquee-row">
        <Link to="/" className="wordmark" aria-label="GitWrap home">
          GitWrap
        </Link>
        <div className="stripe" aria-hidden />
        {auth.login && (
          <span className="silk" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap' }}>
            <span className="hide-sm">@{auth.login}</span>
            <button type="button" className="link" onClick={() => signOut()}>
              Sign out
            </button>
          </span>
        )}
        <Link to="/" className="key key-sm key-plain" aria-label={`GitWrap ${year} home`}>
          {year}
        </Link>
      </div>
    </header>
  );
};

export default Marquee;
