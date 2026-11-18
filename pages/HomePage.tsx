import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Marquee from '../components/Marquee';
import GitHubSignIn from '../components/GitHubSignIn';
import GitWrapCard from '../components/GitWrapCard';
import Footer from '../components/Footer';
import { ArrowRight } from '../components/icons/Arcade';
import { useAuth } from '../services/auth';
import { EDITION } from '../config';
import { DEFAULT_THEME, themeVars } from '../constants';
import { demoStats, DEMO_MESSAGE } from '../demo';

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
  const demo = useMemo(() => demoStats(year), []);

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
    <div className="gw" style={themeVars(DEFAULT_THEME) as React.CSSProperties}>
      <Marquee year={year} />

      <main className="gw-wrap hero">
        <div className="hero-copy">
          <h1 className="display hero-title">
            Your {year},
            <br />
            <span className="hero-accent">scored.</span>
          </h1>

          <p className="lede" style={{ marginTop: 32 }}>
            A short recap of your year on GitHub, then one card to post: contributions, streaks, languages, and the player class you earned.
          </p>

          <form onSubmit={handleSubmit} className="controls" style={{ marginTop: 40 }} noValidate>
            <div className="control control-wide">
              <label className="slot">
                <span className="slot-at" aria-hidden>
                  @
                </span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="github-username"
                  aria-label="GitHub username"
                  aria-invalid={Boolean(error)}
                  aria-describedby="username-help"
                  autoComplete="off"
                  autoCapitalize="none"
                  spellCheck={false}
                />
              </label>
              <span id="username-help" className="silk" role={error ? 'alert' : undefined} style={error ? { color: 'var(--a1)' } : undefined}>
                {error || '1 · Enter any GitHub username'}
              </span>
            </div>

            <div className="control">
              <button type="submit" className="key key-lg">
                Start
                <ArrowRight size={20} />
              </button>
              <span className="silk">2 · Press start</span>
            </div>

            {auth.ready && (
              <div className="control">
                {auth.login ? (
                  <button type="button" className="key key-plain" onClick={() => navigate(`/u/${auth.login}`)}>
                    My full card
                  </button>
                ) : (
                  <GitHubSignIn />
                )}
                <span className="silk">{auth.login ? `Signed in as @${auth.login}` : 'Optional · adds private repos'}</span>
              </div>
            )}
          </form>

          {authError && authError !== 'denied' && (
            <p className="strip strip-warn" role="alert" style={{ maxWidth: 560, marginTop: 24 }}>
              GitHub sign-in did not finish. Press the sign-in key to try again.
            </p>
          )}
        </div>

        <section className="hero-card" aria-label="Sample card">
          <p className="silk" style={{ margin: '0 0 12px' }}>
            Card out · sample with invented numbers
          </p>
          <div className="dispenser">
            <div className="dispenser-mouth" aria-hidden />
            <GitWrapCard className="dispenser-card" userData={demo} funMessage={DEMO_MESSAGE} theme={DEFAULT_THEME} />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
