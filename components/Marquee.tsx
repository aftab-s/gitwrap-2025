import React from 'react';
import { Link } from 'react-router-dom';
import { signOut, useAuth } from '../services/auth';

interface Props {
  year: number;
  fusionStripe?: boolean;
}

const FUSION_STRIPE_BG =
  'repeating-linear-gradient(-45deg, #05070E 0 12px, #FF2A85 12px 24px, #05070E 24px 36px, #00E5FF 36px 48px, #05070E 48px 60px, #00FF88 60px 72px, #05070E 72px 84px, #FFD21F 84px 96px, #05070E 96px 108px, #D4FF00 108px 120px, #05070E 120px 132px, #FF3366 132px 144px)';

/** The strip across the top of the panel: wordmark, hazard stripe, who is signed in. */
const Marquee: React.FC<Props> = ({ year, fusionStripe }) => {
  const auth = useAuth();

  return (
    <header className="marquee">
      <div className="gw-wrap marquee-row">
        <Link to="/" className="wordmark" aria-label="GitWrap home">
          GitWrap
        </Link>
        <div
          className="stripe"
          aria-hidden
          style={
            fusionStripe
              ? {
                  backgroundImage: FUSION_STRIPE_BG,
                  boxShadow: '0 0 14px rgba(255, 42, 133, 0.25)',
                }
              : undefined
          }
        />
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
