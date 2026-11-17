import React from 'react';
import { Link } from 'react-router-dom';
import { AVAILABLE_YEARS } from '../config';
import { signOut, useAuth } from '../services/auth';

interface Props {
  year: number;
  /** Where a year key goes. Defaults to that year's landing page. */
  yearHref?: (year: number) => string;
}

/** The strip across the top of the panel: wordmark, hazard stripe, year keys, who is signed in. */
const Marquee: React.FC<Props> = ({ year, yearHref = (y) => `/${y}` }) => {
  const auth = useAuth();

  return (
    <header className="marquee">
      <div className="gw-wrap marquee-row">
        <Link to={`/${year}`} className="wordmark" aria-label={`GitWrap ${year} home`}>
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
        <nav aria-label="Edition" style={{ display: 'flex', gap: 8 }}>
          {AVAILABLE_YEARS.map((y) => (
            <Link key={y} to={yearHref(y)} className="key key-sm key-plain" aria-current={y === year ? 'page' : undefined}>
              {y}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Marquee;
