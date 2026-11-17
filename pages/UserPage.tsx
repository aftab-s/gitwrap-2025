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
import AIStatsPanel from '../components/AIStatsPanel';
import { APP_REPO_URL, DEFAULT_YEAR } from '../config';
import { THEMES, DEFAULT_THEME, themeVars } from '../constants';
import GitWrapCard from '../components/GitWrapCard';
import ExportCard from '../components/ExportCard';
import ThemeSelector from '../components/ThemeSelector';
import SocialShare from '../components/SocialShare';
import Contributors from '../components/Contributors';
import { Download, Lock } from '../components/icons/Arcade';

// This is a browser global from the html-to-image CDN script
declare const htmlToImage: any;

const avatarDataUrlCache = new Map<string, string>();

async function convertAvatarViaCanvas(url: string): Promise<string> {
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
      reject(event instanceof ErrorEvent ? event.error : new Error('Avatar image failed to load'));
    };

    img.src = url;
  });
}

async function convertAvatarViaFetch(url: string): Promise<string> {
  const resp = await fetch(url, { mode: 'cors', credentials: 'omit', cache: 'force-cache' });
  if (!resp.ok) {
    throw new Error(`Avatar fetch failed with status ${resp.status}`);
  }
  const blob = await resp.blob();
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(blob);
  });
}

async function embedAvatarAsDataUrl(url?: string) {
  if (!url) return undefined;
  if (url.startsWith('data:')) return url;
  if (avatarDataUrlCache.has(url)) {
    return avatarDataUrlCache.get(url);
  }

  const strategies = [convertAvatarViaCanvas, convertAvatarViaFetch];
  for (const strategy of strategies) {
    try {
      const dataUrl = await strategy(url);
      avatarDataUrlCache.set(url, dataUrl);
      return dataUrl;
    } catch (err) {
      console.warn('Avatar embed strategy failed', err);
    }
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

  iframe.srcdoc = `<!DOCTYPE html><html><head>
    <meta charset="utf-8" />
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

const UserPage: React.FC = () => {
  const { username, year: yearParam } = useParams<{ username: string; year: string }>();
  const year = Number(yearParam ?? DEFAULT_YEAR); // validated by <YearGate> in App
  const [userData, setUserData] = useState<UserStats | null>(null);
  const [funMessage, setFunMessage] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTheme, setActiveTheme] = useState<Theme>(DEFAULT_THEME);
  const [isDownloading, setIsDownloading] = useState<AspectRatio | null>(null);
  const [embeddedAvatarUrl, setEmbeddedAvatarUrl] = useState<string | null>(null);
  // Card display options
  const [showAIStat, setShowAIStat] = useState(true);
  const [showPrivateRepoNames, setShowPrivateRepoNames] = useState(false);
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
      aiStats: showAIStat ? userData.aiStats : undefined,
      topRepos: showPrivateRepoNames
        ? userData.topRepos
        : userData.topRepos.map((r) => (r.isPrivate ? { ...r, name: 'Private repository', url: '' } : r)),
    };
  }, [userData, showAIStat, showPrivateRepoNames]);

  const hasPrivateTopRepo = Boolean(userData?.topRepos.some((r) => r.isPrivate));

  useEffect(() => {
    if (!userData?.avatarUrl) {
      setEmbeddedAvatarUrl(null);
      return;
    }

    let cancelled = false;
    setEmbeddedAvatarUrl(null);

    embedAvatarAsDataUrl(userData.avatarUrl)
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

    const embeddedAvatar = embeddedAvatarUrl
      ? embeddedAvatarUrl
      : await embedAvatarAsDataUrl(userData.avatarUrl).catch(() => undefined);

    if (!embeddedAvatarUrl && embeddedAvatar) {
      setEmbeddedAvatarUrl(embeddedAvatar);
    }

    // Prepare a shallow copy of userData for export so we can replace the avatar URL safely
    const exportUserData = embeddedAvatar ? { ...userData, avatarUrl: embeddedAvatar } : userData;

    const { container: exportContainer, document: exportDocument, window: exportWindow, cleanup } =
      await createExportEnvironment(targetWidth, targetHeight);

    const root = createRoot(exportContainer);
    root.render(
      <ExportCard
        userData={exportUserData}
        funMessage={funMessage}
        theme={activeTheme}
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

      // Wait for images to load
      const images: HTMLImageElement[] = Array.from(exportContainer.querySelectorAll('img'));
      if (images.length > 0) {
        await Promise.race([
          Promise.all(
            images.map(
              (img) =>
                new Promise<void>((resolve) => {
                  if (img.complete) {
                    resolve();
                  } else {
                    img.addEventListener('load', () => resolve(), { once: true });
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

  const vars = themeVars(activeTheme) as React.CSSProperties;
  const yearHref = (y: number) => `/${y}/u/${username}`;

  if (loading) {
    return (
      <div className="gw" style={vars}>
        <Marquee year={year} yearHref={yearHref} />
        <main className="gw-wrap" style={{ flex: '1 0 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingTop: 64, paddingBottom: 96 }}>
          <h1 className="display" style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', overflowWrap: 'anywhere' }}>
            Counting {username}&rsquo;s {year}
          </h1>
          <div className="lamps" role="status" aria-label="Loading" style={{ marginTop: 32 }}>
            {Array.from({ length: 8 }, (_, i) => (
              <span key={i} />
            ))}
          </div>
          <p className="silk" style={{ marginTop: 24 }}>
            Reading contributions · scanning commits for AI co-authors · takes a few seconds
          </p>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="gw" style={vars}>
        <Marquee year={year} yearHref={yearHref} />
        <main className="gw-wrap" style={{ flex: '1 0 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', paddingTop: 64, paddingBottom: 96 }}>
          <h1 className="display" style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)' }}>No card this time</h1>
          <p className="strip strip-warn" role="alert" style={{ marginTop: 32, maxWidth: 560 }}>
            {error}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 32 }}>
            <button type="button" className="key" onClick={() => fetchData()}>
              Try again
            </button>
            <Link to={`/${year}`} className="key key-plain">
              Another username
            </Link>
            {rateLimited && <GitHubSignIn label="Sign in instead" />}
          </div>
        </main>
      </div>
    );
  }

  if (!userData || !cardData) return null;

  return (
    <div className="gw" style={vars}>
      <Marquee year={year} yearHref={yearHref} />

      <main className="gw-wrap" style={{ paddingTop: 40, paddingBottom: 72, flex: '1 0 auto' }}>
        <div className="wrap-grid">
          <GitWrapCard className="wrap-card" userData={cardData} funMessage={funMessage} theme={activeTheme} />

          <div className="stack">
            <section>
              <h1 className="display" style={{ fontSize: 'clamp(2.25rem, 5vw, 3.5rem)', overflowWrap: 'anywhere' }}>
                {userData.login}&rsquo;s {year}
              </h1>
              {userData.includesPrivate ? (
                <p className="strip" style={{ marginTop: 24, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <Lock size={18} style={{ marginTop: 2 }} />
                  <span>
                    Your private repositories are counted
                    {userData.privateContributions ? ` (${userData.privateContributions.toLocaleString()} commits)` : ''}. Only you see this
                    version; a shared link shows the public one.
                  </span>
                </p>
              ) : (
                <div style={{ marginTop: 24, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16 }}>
                  <p className="dim" style={{ margin: 0, maxWidth: '44ch', fontSize: '0.9375rem' }}>
                    Public activity only.{' '}
                    {auth.login
                      ? `You are signed in as @${auth.login}; private repositories count only on your own card.`
                      : 'Is this you? Sign in to count your private repositories too.'}
                  </p>
                  <GitHubSignIn label="Sign in" className="key-sm" />
                </div>
              )}
            </section>

            <section>
              <button
                type="button"
                className="key key-lg key-block"
                onClick={() => handleDownload(AspectRatio.Social)}
                disabled={!!isDownloading}
                aria-busy={!!isDownloading}
              >
                <Download size={22} />
                {isDownloading ? 'Printing the card' : 'Download card'}
              </button>
              <p className="silk" style={{ margin: '20px 0 16px' }}>
                PNG · 1080 × 1440 · sized for feeds
              </p>
              {downloadError && (
                <p className="strip strip-warn" role="alert" style={{ marginBottom: 16 }}>
                  {downloadError}
                </p>
              )}
              {username && <SocialShare username={username} year={year} />}
            </section>

            <section>
              <h2 className="heading">Colourway</h2>
              <ThemeSelector themes={THEMES} activeTheme={activeTheme} onSelectTheme={setActiveTheme} />
              {(userData.aiStats || hasPrivateTopRepo) && (
                <div style={{ display: 'grid', gap: 20, marginTop: 28 }}>
                  {userData.aiStats && (
                    <label className="switch">
                      <input type="checkbox" checked={showAIStat} onChange={(e) => setShowAIStat(e.target.checked)} />
                      Show the AI co-authored stat on the card
                    </label>
                  )}
                  {hasPrivateTopRepo && (
                    <label className="switch">
                      <input type="checkbox" checked={showPrivateRepoNames} onChange={(e) => setShowPrivateRepoNames(e.target.checked)} />
                      Show private repository names
                    </label>
                  )}
                </div>
              )}
            </section>

            {userData.aiStats && <AIStatsPanel stats={userData.aiStats} />}

            <section>
              <h2 className="heading">Built by</h2>
              <Contributors />
              <p style={{ margin: '20px 0 0' }}>
                <a className="link" href={APP_REPO_URL} target="_blank" rel="noopener noreferrer">
                  Contribute on GitHub
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UserPage;
