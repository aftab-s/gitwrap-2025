import PlayerAvatar from '../components/PlayerAvatar';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { useParams, Link } from 'react-router-dom';
import type { UserStats, Theme } from '../types';
import { AspectRatio } from '../types';
import { fetchWrap, WrapError } from '../services/api';
import { useAuth, isOwnProfile, markSignedOut } from '../services/auth';
import Marquee from '../components/Marquee';
import Footer from '../components/Footer';
import GitHubSignIn from '../components/GitHubSignIn';
import Stories from '../components/Stories';
import { playerClass } from '../insights';
import { playerAvatar } from '../playerAvatars';
import { APP_REPO_URL, EDITION } from '../config';
import { THEMES, DEFAULT_THEME, USER_STUDIO_THEME, themeVars } from '../constants';
import GitWrapCard from '../components/GitWrapCard';
import ExportCard from '../components/ExportCard';
import ThemeSelector from '../components/ThemeSelector';
import SocialShare from '../components/SocialShare';
import Contributors from '../components/Contributors';
import FuturisticLoader from '../components/FuturisticLoader';
import { Download, Lock, PlayerArrow } from '../components/icons/Arcade';

// This is a browser global from the html-to-image CDN script
declare const htmlToImage: any;

const dataUrlCache = new Map<string, string>();

async function convertViaFetch(url: string): Promise<string> {
  const isRemote = /^https?:\/\//i.test(url);
  // Bust cache for remote avatars (e.g. GitHub CDN) so Safari sends Origin header and doesn't serve non-CORS cached image
  const fetchUrl = isRemote
    ? (url.includes('?') ? `${url}&_gwcb=${Date.now()}` : `${url}?_gwcb=${Date.now()}`)
    : url;

  const resp = await fetch(fetchUrl, { mode: 'cors', credentials: 'omit' });
  if (!resp.ok) {
    throw new Error(`Fetch failed with status ${resp.status}`);
  }
  const blob = await resp.blob();
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(blob);
  });
}

async function convertViaCanvas(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.decoding = 'async';
    img.referrerPolicy = 'no-referrer';

    img.onload = () => {
      try {
        const maxDimension = 512;
        const largestSide = Math.max(img.naturalWidth || 0, img.naturalHeight || 0) || 1;
        const scale = Math.min(1, maxDimension / largestSide);
        const width = Math.max(1, Math.round((img.naturalWidth || 1) * scale));
        const height = Math.max(1, Math.round((img.naturalHeight || 1) * scale));
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/png');
        resolve(dataUrl);
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = (event) => {
      reject(event instanceof ErrorEvent ? event.error : new Error('Image failed to load via canvas'));
    };

    img.src = url;
  });
}

async function toDataUrl(url?: string): Promise<string | undefined> {
  if (!url) return undefined;
  if (url.startsWith('data:')) return url;
  if (dataUrlCache.has(url)) {
    return dataUrlCache.get(url);
  }

  // 1. Try fetch with CORS & cache-busting first (fastest, cannot taint canvas)
  try {
    const dataUrl = await convertViaFetch(url);
    if (dataUrl && dataUrl.startsWith('data:')) {
      dataUrlCache.set(url, dataUrl);
      return dataUrl;
    }
  } catch (err) {
    // fallback to canvas
  }

  // 2. Fallback to canvas
  try {
    const dataUrl = await convertViaCanvas(url);
    if (dataUrl && dataUrl.startsWith('data:')) {
      dataUrlCache.set(url, dataUrl);
      return dataUrl;
    }
  } catch (err) {
    console.warn('Image to data URL failed', err);
  }

  return undefined;
}

async function createExportEnvironment(width: number, height: number) {
  const iframe = document.createElement('iframe');
  iframe.setAttribute('aria-hidden', 'true');
  iframe.setAttribute('tabindex', '-1');
  Object.assign(iframe.style, {
    position: 'fixed',
    left: '0',
    top: '0',
    width: `${width}px`,
    height: `${height}px`,
    opacity: '0',
    pointerEvents: 'none',
    border: '0',
    zIndex: '-1',
  });

  const baseHref = typeof window !== 'undefined' ? `${window.location.origin}/` : '/';

  iframe.srcdoc = `<!DOCTYPE html><html><head>
    <meta charset="utf-8" />
    <base href="${baseHref}" />
    <meta name="viewport" content="width=${width}, initial-scale=1.0" />
    <style>
      @font-face { font-family: 'Archivo'; font-style: normal; font-weight: 100 900; font-stretch: 62% 125%; src: url('/fonts/Archivo-latin.woff2') format('woff2'); }
      @font-face { font-family: 'Martian Mono'; font-style: normal; font-weight: 100 800; font-stretch: 75% 112.5%; src: url('/fonts/MartianMono-latin.woff2') format('woff2'); }
      @font-face { font-family: 'Doto'; font-style: normal; font-weight: 100 900; src: url('/fonts/Doto-latin.woff2') format('woff2'); }
      body { margin: 0; padding: 0; overflow: hidden; }
    </style>
  </head>
  <body></body>
  </html>`;

  document.body.appendChild(iframe);

  await new Promise<void>((resolve, reject) => {
    iframe.onload = () => resolve();
    iframe.onerror = () => reject(new Error('Failed to load export iframe'));
  });

  const doc = iframe.contentDocument;
  if (!doc || !iframe.contentWindow) {
    iframe.remove();
    throw new Error('Export iframe not ready');
  }

  const container = doc.createElement('div');
  container.style.width = `${width}px`;
  container.style.height = `${height}px`;
  doc.body.appendChild(container);

  return {
    container,
    document: doc,
    window: iframe.contentWindow,
    cleanup: () => iframe.remove(),
  };
}

const year = EDITION.year;

const UserPage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [userData, setUserData] = useState<UserStats | null>(null);
  const [funMessage, setFunMessage] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTheme, setActiveTheme] = useState<Theme>(DEFAULT_THEME);
  const [isDownloading, setIsDownloading] = useState<AspectRatio | null>(null);
  const [embeddedAvatarUrl, setEmbeddedAvatarUrl] = useState<string | null>(null);
  // The recap plays first; the card page follows. Once seen, a reload goes straight to the card.
  const seenKey = `gw-recap-${(username ?? '').toLowerCase()}`;
  const [phase, setPhase] = useState<'recap' | 'card'>(() => {
    try {
      return sessionStorage.getItem(seenKey) ? 'card' : 'recap';
    } catch {
      return 'recap';
    }
  });
  const finishRecap = useCallback(() => {
    try {
      sessionStorage.setItem(seenKey, '1');
    } catch {
      /* storage unavailable: the recap simply plays again next time */
    }
    setPhase('card');
    window.scrollTo(0, 0);
  }, [seenKey]);
  // Card display options - defaults to true so authenticated users see their real repository names immediately
  const [showPrivateRepoNames, setShowPrivateRepoNames] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('gw-show-private-repos');
      return stored !== null ? stored === 'true' : true;
    } catch {
      return true;
    }
  });
  const handleTogglePrivateRepos = (checked: boolean) => {
    setShowPrivateRepoNames(checked);
    try {
      localStorage.setItem('gw-show-private-repos', String(checked));
    } catch {
      /* ignore */
    }
  };
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [rateLimited, setRateLimited] = useState(false);

  const auth = useAuth();
  // The private view is only requested for the signed-in user's own profile (the server re-checks this).
  const includePrivate = isOwnProfile(auth, username);


  const fetchData = useCallback(async () => {
    if (!username) return;
    try {
      setLoading(true);
      setError(null);
      setRateLimited(false);
      const { stats, funMessage: message } = await fetchWrap(username, year, includePrivate);
      setUserData(stats);
      setFunMessage(message);
    } catch (err) {
      const code = err instanceof WrapError ? err.code : 'upstream';
      console.error('Fetch data error:', err);
      if ((code === 'session_expired' || code === 'unauthorized') && includePrivate) {
        // Session gone: mark signed out, which re-runs this fetch in public mode.
        markSignedOut();
        return;
      }
      if (code === 'not_found') {
        setError(`Could not find a GitHub user with the name "${username}". Please check the spelling.`);
      } else if (code === 'rate_limited') {
        setRateLimited(true);
        setError(
          auth.authEnabled && !includePrivate
            ? 'The shared GitHub API quota is exhausted right now. Sign in with GitHub to use your own quota, or try again later.'
            : 'The GitHub API rate limit was exceeded. Please try again in a little while.'
        );
      } else if (code === 'misconfigured') {
        setError('This application is not configured correctly: the server is missing its GitHub API token.');
      } else {
        setError('An error occurred while fetching GitHub data. GitHub might be temporarily unavailable; please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [username, year, includePrivate, auth.authEnabled]);

  useEffect(() => {
    // Wait until we know who is signed in, so we don't fetch the public view and then refetch.
    if (auth.ready) fetchData();
  }, [auth.ready, fetchData]);

  // What actually goes on the card, after applying the display options.
  const cardData = useMemo<UserStats | null>(() => {
    if (!userData) return null;
    return {
      ...userData,
      topRepos: showPrivateRepoNames
        ? userData.topRepos
        : userData.topRepos.map((r) => (r.isPrivate ? { ...r, name: 'Private repository', url: '' } : r)),
    };
  }, [userData, showPrivateRepoNames]);

  const hasPrivateTopRepo = Boolean(userData?.topRepos.some((r) => r.isPrivate));

  useEffect(() => {
    if (!userData?.avatarUrl) {
      setEmbeddedAvatarUrl(null);
      return;
    }

    let cancelled = false;
    setEmbeddedAvatarUrl(null);

    toDataUrl(userData.avatarUrl)
      .then((dataUrl) => {
        if (!cancelled && dataUrl) {
          setEmbeddedAvatarUrl(dataUrl);
        }
      })
      .catch((err) => {
        console.warn('Prefetch avatar embed failed', err);
      });

    return () => {
      cancelled = true;
    };
  }, [userData?.avatarUrl]);

  const handleDownload = async (aspectRatio: AspectRatio) => {
    if (!cardData) return;
    const userData = cardData;
    setIsDownloading(aspectRatio);
    setDownloadError(null);

    const targetWidth = 1080;
    const targetHeight = 1440;

    const cls = userData.totalContributions > 0 ? playerClass(userData) : undefined;
    const petPath = cls ? playerAvatar(cls.name) : undefined;
    const backdropPath = activeTheme.id === 'doomsday' ? '/themes/latverian-minimal.jpg' : undefined;

    // Convert all images to Base64 data URLs in parallel so Safari never needs network/CORS in iframe
    const [embeddedAvatar, embeddedPet, embeddedBackdrop] = await Promise.all([
      embeddedAvatarUrl ? Promise.resolve(embeddedAvatarUrl) : toDataUrl(userData.avatarUrl).catch(() => undefined),
      petPath ? toDataUrl(petPath).catch(() => undefined) : Promise.resolve(undefined),
      backdropPath ? toDataUrl(backdropPath).catch(() => undefined) : Promise.resolve(undefined),
    ]);

    if (!embeddedAvatarUrl && embeddedAvatar) {
      setEmbeddedAvatarUrl(embeddedAvatar);
    }

    // Prepare shallow copy of userData for export with embedded avatar
    const exportUserData = embeddedAvatar ? { ...userData, avatarUrl: embeddedAvatar } : userData;

    const { container: exportContainer, document: exportDocument, window: exportWindow, cleanup } =
      await createExportEnvironment(targetWidth, targetHeight);

    const root = createRoot(exportContainer);
    root.render(
      <ExportCard
        userData={exportUserData}
        funMessage={funMessage}
        theme={activeTheme}
        playerAvatarUrl={embeddedPet}
        themeBackdropUrl={embeddedBackdrop}
      />
    );

    try {
      // Allow React to flush and layout to settle
      await new Promise((resolve) => requestAnimationFrame(() => resolve(undefined)));
      await new Promise((resolve) => setTimeout(resolve, 200));

      // Ask for each face the card uses, then wait: fonts.ready alone can resolve before they are requested
      await Promise.all(["900 40px Archivo", "600 20px 'Martian Mono'", "900 40px Doto"].map((f) => (exportDocument as any).fonts?.load(f).catch(() => undefined)));
      const fontSet = (exportDocument as Document & { fonts?: FontFaceSet }).fonts;
      if (fontSet?.ready) {
        await fontSet.ready.catch(() => undefined);
      }

      // Wait for all images to fully load and decode (critical for Apple WebKit/Safari)
      const images: HTMLImageElement[] = Array.from(exportContainer.querySelectorAll('img'));
      if (images.length > 0) {
        await Promise.race([
          Promise.all(
            images.map(
              (img) =>
                new Promise<void>((resolve) => {
                  const onComplete = () => {
                    if (typeof img.decode === 'function') {
                      img.decode().then(() => resolve()).catch(() => resolve());
                    } else {
                      resolve();
                    }
                  };
                  if (img.complete && img.naturalWidth > 0) {
                    onComplete();
                  } else {
                    img.addEventListener('load', onComplete, { once: true });
                    img.addEventListener('error', () => resolve(), { once: true });
                  }
                })
            )
          ),
          new Promise<void>((resolve) => setTimeout(resolve, 3000)),
        ]);
      }

      const cardElement = exportContainer.firstElementChild as HTMLElement | null;
      const captureTarget = cardElement ?? exportContainer;
      const computedStyles = (exportWindow || window).getComputedStyle(captureTarget);
      const backgroundColor = computedStyles.backgroundColor;

      // Safari warm-up pass: forces WebKit to decode images into the canvas rasterizer
      await htmlToImage.toPng(captureTarget, {
        pixelRatio: 1,
        width: targetWidth,
        height: targetHeight,
      }).catch(() => undefined);

      await new Promise((resolve) => setTimeout(resolve, 80));

      const dataUrl = await htmlToImage.toPng(captureTarget, {
        pixelRatio: 1, // Force exact 1080x1440 output
        cacheBust: true,
        width: targetWidth,
        height: targetHeight,
        style: {
          opacity: '1',
          visibility: 'visible',
          transform: 'none',
          filter: 'none',
        },
        backgroundColor:
          backgroundColor && backgroundColor !== 'rgba(0, 0, 0, 0)'
            ? backgroundColor
            : undefined,
      });

      const link = document.createElement('a');
      const safeUsername = username?.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const safeTheme = activeTheme?.name?.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'theme';
      link.download = `gitwrap-${year}-${safeUsername}-${safeTheme}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to download image:', err);
      setDownloadError('The image could not be created. Check your connection and press Download again.');
    } finally {
      root.unmount();
      cleanup();
      setIsDownloading(null);
    }
  };

  const vars = themeVars(USER_STUDIO_THEME) as React.CSSProperties;

  if (loading) {
    return (
      <div className="gw" style={vars}>
        <Marquee year={year} />
        <main
          className="gw-wrap"
          style={{
            flex: '1 0 auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: 32,
            paddingBottom: 64,
          }}
        >
          <FuturisticLoader username={username || 'Player'} year={year} />
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="gw" style={vars}>
        <Marquee year={year} />
        <main className="gw-wrap" style={{ flex: '1 0 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', paddingTop: 64, paddingBottom: 96 }}>
          <h1 className="display" style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)' }}>No card this time</h1>
          <p className="strip strip-warn" role="alert" style={{ marginTop: 32, maxWidth: 560 }}>
            {error}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 32 }}>
            <button type="button" className="key" onClick={() => fetchData()}>
              Try again
            </button>
            <Link to="/" className="key key-plain">
              Another username
            </Link>
            {rateLimited && <GitHubSignIn label="Sign in instead" />}
          </div>
        </main>
      </div>
    );
  }

  if (!userData || !cardData) return null;

  if (phase === 'recap') {
    return (
      <div className="gw" style={vars}>
        <h1 style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clipPath: 'inset(50%)' }}>
          {userData.login}&rsquo;s {year} recap
        </h1>
        <Stories stats={cardData} funMessage={funMessage} theme={activeTheme} onDone={finishRecap} />
      </div>
    );
  }

  const cls = userData.totalContributions > 0 ? playerClass(userData) : undefined;

  return (
    <div className="gw" style={vars}>
      <Marquee year={year} />

      <main className="gw-wrap" style={{ paddingTop: 36, paddingBottom: 80, flex: '1 0 auto' }}>
        {/* Profile Command Header */}
        <header className="user-profile-header">
          <div className="user-profile-identity">
            {userData.avatarUrl && (
              <img src={userData.avatarUrl} alt="" className="user-profile-avatar" />
            )}
            <div>
              <div className="user-profile-meta">
                <span className="user-profile-tag">GitWrap // {year} Recap</span>
                {userData.includesPrivate && (
                  <span className="user-profile-tag user-profile-tag-private">
                    <Lock size={12} /> Includes Private
                  </span>
                )}
              </div>
              <h1 className="display user-profile-title">
                {userData.name || userData.login}
                <span className="user-profile-handle">@{userData.login}</span>
              </h1>
            </div>
          </div>

          <div className="user-profile-actions">
            <button
              type="button"
              className="key key-plain user-replay-btn"
              onClick={() => setPhase('recap')}
              title="Replay recap stories"
            >
              <PlayerArrow size={18} />
              Replay Recap
            </button>
          </div>
        </header>

        {/* Main Studio Grid: Sticky Card Preview on Left, Command Deck on Right */}
        <div className="user-studio-grid">
          {/* Left Column: Sticky Card Showcase */}
          <div className="user-card-stage">
            <div className="user-card-anchor">
              <GitWrapCard
                className="user-card-display"
                userData={cardData}
                funMessage={funMessage}
                theme={activeTheme}
              />
            </div>
          </div>

          {/* Right Column: Studio Control Deck */}
          <div className="user-control-deck">
            {/* Section A: Theme Selector (Top priority for immediate live feedback!) */}
            <section className="window user-deck-window">
              <div className="user-deck-window-head">
                <h2 className="heading" style={{ margin: 0 }}>Card Colourway</h2>
                <span className="silk" style={{ opacity: 0.85 }}>Live Preview</span>
              </div>
              <ThemeSelector themes={THEMES} activeTheme={activeTheme} onSelectTheme={setActiveTheme} />
            </section>

            {/* Section B: Action Hub (Download, Share, Privacy) */}
            <section className="window user-deck-window">
              <div className="user-deck-window-head">
                <h2 className="heading" style={{ margin: 0 }}>Export &amp; Share</h2>
                <span className="silk" style={{ opacity: 0.85 }}>PNG Export</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <button
                  type="button"
                  className="key key-lg key-block"
                  onClick={() => handleDownload(AspectRatio.Social)}
                  disabled={!!isDownloading}
                  aria-busy={!!isDownloading}
                  style={{ justifyContent: 'center' }}
                >
                  <Download size={22} />
                  {isDownloading ? 'Printing the card...' : 'Download Card (PNG)'}
                </button>
                <p className="silk" style={{ margin: '-4px 0 0', textAlign: 'center', opacity: 0.75, fontSize: '0.75rem' }}>
                  PNG · 1080 × 1440 · 300 DPI
                </p>

                {downloadError && (
                  <p className="strip strip-warn" role="alert" style={{ margin: 0 }}>
                    {downloadError}
                  </p>
                )}

                {username && <SocialShare username={username} year={year} />}

                {/* Privacy controls & toggles */}
                {userData.includesPrivate ? (
                  <div className="user-privacy-box">
                    <p className="strip" style={{ margin: 0, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <Lock size={16} style={{ marginTop: 2, flexShrink: 0 }} />
                      <span>
                        Your private repositories are included
                        {userData.privateContributions ? ` (${userData.privateContributions.toLocaleString()} commits)` : ''}.
                        Shared links display public view only.
                      </span>
                    </p>
                    {hasPrivateTopRepo && (
                      <label className="switch" style={{ alignSelf: 'flex-start', marginTop: 4 }}>
                        <input
                          type="checkbox"
                          checked={showPrivateRepoNames}
                          onChange={(e) => handleTogglePrivateRepos(e.target.checked)}
                        />
                        Show private repository names on card
                      </label>
                    )}
                  </div>
                ) : (
                  <div className="user-privacy-box">
                    <p className="dim" style={{ margin: 0, fontSize: '0.875rem', lineHeight: 1.4 }}>
                      Public activity only.{' '}
                      {auth.login
                        ? `Signed in as @${auth.login}; private repositories count only on your own card.`
                        : 'Sign in with GitHub to count your private contributions on your card.'}
                    </p>
                    {!auth.login && (
                      <GitHubSignIn label="Sign in for private repos" className="key-sm" style={{ alignSelf: 'flex-start', marginTop: 4 }} />
                    )}
                  </div>
                )}
              </div>
            </section>

            {/* Section C: Player Class Archetype Dossier */}
            {cls && (
              <section className="window user-deck-window">
                <div className="user-deck-window-head">
                  <h2 className="heading" style={{ margin: 0 }}>Player Class Dossier</h2>
                  <span className="silk" style={{ color: 'var(--a1)', fontWeight: 800 }}>{cls.badge}</span>
                </div>

                <div className="user-dossier-hero">
                  <div className="user-dossier-avatar-frame">
                    <PlayerAvatar name={cls.name} />
                  </div>
                  <div style={{ minWidth: 0, flex: '1 1 auto' }}>
                    <div className="silk" style={{ textTransform: 'uppercase', letterSpacing: '0.06em', opacity: 0.8 }}>
                      Archetype Identified
                    </div>
                    <h3 className="display" style={{ margin: '2px 0 0', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', lineHeight: 1 }}>
                      {cls.name}
                    </h3>
                    <p style={{ margin: '6px 0 0', fontWeight: 600, fontSize: '0.95rem', lineHeight: 1.35, opacity: 0.9 }}>
                      {cls.line}
                    </p>
                  </div>
                </div>

                {/* Verdict Quote Box */}
                <div className="user-dossier-verdict">
                  <div className="silk" style={{ textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 800 }}>
                    System Verdict // {cls.proof.formula}
                  </div>
                  <p style={{ margin: '4px 0 0', fontSize: '0.9375rem', fontWeight: 600, lineHeight: 1.4 }}>
                    &ldquo;{cls.proof.headline}&rdquo;
                  </p>
                </div>

                {/* Metrics Grid */}
                <div className="user-dossier-metrics">
                  {cls.proof.metrics.map((m) => (
                    <div key={m.label} className="user-dossier-metric-card">
                      <span className="user-dossier-metric-label">{m.label}</span>
                      <span className="user-dossier-metric-val">{m.value}</span>
                      {m.hint && <span className="user-dossier-metric-hint">{m.hint}</span>}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>

        {/* Community & Contributors Shelf */}
        <section className="user-community-shelf window" style={{ marginTop: 48 }}>
          <div className="user-community-head">
            <div className="user-community-info">
              <h2 className="heading" style={{ margin: 0 }}>Built Open Source</h2>
              <p className="dim" style={{ margin: '6px 0 0', fontSize: '0.875rem', lineHeight: 1.4 }}>
                Built for developers by the community. Completely free and open-source.
              </p>
            </div>
            <a
              className="key key-sm key-plain user-community-btn"
              href={APP_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub Repository
            </a>
          </div>
          <div style={{ marginTop: 20 }}>
            <Contributors />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default UserPage;
