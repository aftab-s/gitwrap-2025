import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Marquee from '../components/Marquee';
import GitHubSignIn from '../components/GitHubSignIn';
import Footer from '../components/Footer';
import HomeFusionBackdrop from '../components/HomeFusionBackdrop';
import HeroContributionGraph from '../components/HeroContributionGraph';
import { useAuth } from '../services/auth';
import { EDITION } from '../config';
import { HOME_FUSION_THEME, CHROME_ACCENTS, themeVars } from '../constants';

// GitHub logins: letters, digits and single hyphens, up to 39 characters.
const USERNAME_RE = /^[a-z\d](?:[a-z\d-]{0,38})$/i;
const year = EDITION.year;

const HomePage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const auth = useAuth();
  // Set by /api/auth/callback when sign-in didn't complete (e.g. ?auth_error=invalid_state)
  const authError = new URLSearchParams(window.location.search).get('auth_error');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = username.trim().replace(/^@/, '');
    if (!name) {
      setError('Type a GitHub username first.');
    } else if (!USERNAME_RE.test(name)) {
      setError('That is not a GitHub username. Use letters, digits and hyphens only.');
    } else {
      navigate(`/u/${name}`);
    }
  };

  return (
    <div
      className="gw circuit-shell landing-shell"
      style={
        {
          ...themeVars(HOME_FUSION_THEME),
          ...CHROME_ACCENTS,
          position: 'relative',
          overflowX: 'hidden',
        } as React.CSSProperties
      }
    >
      <HomeFusionBackdrop />
      <Marquee year={year} />

      <main className="gw-wrap hero" style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', minHeight: 'calc(100vh - 180px)', paddingTop: 'calc(var(--u) * 12)', paddingBottom: 'calc(var(--u) * 10)' }}>
        <div className="hero-copy" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: 760, width: '100%', margin: '0 auto' }}>
          <div className="landing-edition">
            <span className="landing-edition-led" aria-hidden="true" />
            GITWRAP // {year} EDITION
          </div>

          {/* Semantic title for screen readers & SEO */}
         
          {/* Animated 7x52 contribution graph spelling YOUR 2026 with Scored seal */}
          <HeroContributionGraph year={year} />

          <p className="lede" style={{ marginTop: 32, textAlign: 'center', maxWidth: 540, marginInline: 'auto' }}>Gitwrap 2026. A visual celebration of your commits, streaks, and late-night breakthroughs in 2026.</p>
          <form onSubmit={handleSubmit} className="controls" style={{ marginTop: 44, width: '100%', maxWidth: 540, marginInline: 'auto', textAlign: 'left' }} noValidate>
            <div className="control control-wide">
              <label className="slot"><span className="slot-at" aria-hidden>@</span>
                <input type="text" value={username} onChange={(e) => { setUsername(e.target.value); if (error) setError(''); }} placeholder="github-username" aria-label="GitHub username" aria-invalid={Boolean(error)} aria-describedby="username-help" autoComplete="off" autoCapitalize="none" spellCheck={false} />
              </label>
              <span id="username-help" className="silk" role={error ? 'alert' : undefined} style={error ? { color: 'var(--a1)' } : undefined}>{error || '1 · Enter any GitHub username'}</span>
            </div>
            <div className="control"><button type="submit" className="key key-lg">START</button><span className="silk">2 · Press start</span></div>
            {auth.ready && <div className="control">
              {auth.login ? <button type="button" className="key key-plain" onClick={() => navigate(`/u/${auth.login}`)}>MY FULL CARD</button> : <GitHubSignIn label="SIGN IN" />}
              <span className="silk">{auth.login ? `Signed in as @${auth.login}` : 'Optional · adds private contributions'}</span>
            </div>}
          </form>

          {authError && authError !== 'denied' && <p className="strip strip-warn" role="alert" style={{ maxWidth: 540, marginTop: 24, marginInline: 'auto' }}>GitHub sign-in did not finish. Press the sign-in key to try again.</p>}
        </div>
      </main>

      <Footer showThemeGuide />
    </div>
  );
};

export default HomePage;
