import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { useParams, Link } from 'react-router-dom';
import type { UserStats, Theme } from '../types';
import { AspectRatio, CardLayout } from '../types';
import { fetchGitHubStats } from '../services/github';
import { generateFunMessage } from '../services/geminiService';
import { THEMES } from '../constants';
import GitWrapCard from '../components/GitWrapCard';
import ExportCard from '../components/ExportCard';
import ThemeSelector from '../components/ThemeSelector';
import SocialShare from '../components/SocialShare';
import Contributors from '../components/Contributors';
import { DownloadIcon } from '../components/icons/DownloadIcon';

// This is a browser global from the html-to-image CDN script
declare const htmlToImage: any;

const avatarDataUrlCache = new Map<string, string>();
const TAILWIND_CDN_URL = 'https://cdn.tailwindcss.com';

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
    <link rel="stylesheet" href="/index.css" />
    <script src="${TAILWIND_CDN_URL}"></script>
  </head>
  <body style="margin:0;padding:0;overflow:hidden;"></body>
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
  const { username } = useParams<{ username: string }>();
  const [userData, setUserData] = useState<UserStats | null>(null);
  const [funMessage, setFunMessage] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTheme, setActiveTheme] = useState<Theme>(THEMES[0]);
  const [isDownloading, setIsDownloading] = useState<AspectRatio | null>(null);
  const [embeddedAvatarUrl, setEmbeddedAvatarUrl] = useState<string | null>(null);
  

  const cardRef = useRef<HTMLDivElement>(null);

  const fetchData = useCallback(async () => {
    if (!username) return;
    try {
      setLoading(true);
      setError(null);
      const data = await fetchGitHubStats(username);
      setUserData(data);
      
      // Handle Gemini message generation separately to not block UI on failure
      try {
        const message = await generateFunMessage(data);
        setFunMessage(message);
      } catch (geminiError) {
        console.warn("Failed to generate fun message:", geminiError);
        setFunMessage("Your 2025 GitHub activity was truly impressive. Keep up the great work!");
      }

    } catch (err) {
      if (err instanceof Error) {
        console.error("Fetch data error:", err.message);
        if (err.message.toLowerCase().includes('user not found')) {
            setError(`Could not find a GitHub user with the name "${username}". Please check the spelling.`);
        } else if (err.message.includes('rate limit exceeded')) {
            setError('The GitHub API rate limit was exceeded. This can happen due to high traffic. Please try again in a little while.');
        } else if (err.message.includes('GITHUB_APP_TOKEN')) {
            setError('This application is not configured correctly. An API token is missing.');
        } else {
            setError('An error occurred while fetching GitHub data. The API might be temporarily down or the username may be incorrect.');
        }
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
    if (!userData) return;
    setIsDownloading(aspectRatio);

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
        layout={CardLayout.Classic}
      />
    );

    try {
      // Allow React to flush and layout to settle
      await new Promise((resolve) => requestAnimationFrame(() => resolve(undefined)));
      await new Promise((resolve) => setTimeout(resolve, 200));

      // Ensure fonts (if available) are loaded before capture
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
      const safeAspectRatio = aspectRatio.replace(':', 'x');
      const safeUsername = username?.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const safeTheme = activeTheme?.name?.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'theme';
      link.download = `gitwrap-2025-${safeUsername}-${safeTheme}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to download image:', err);
      const message = err instanceof Error ? err.message : String(err);
      alert(
        `Sorry, there was an error creating the image. This can be caused by external resources (like avatars) failing to load. Please try again.\n\nError: ${message}`
      );
    } finally {
      root.unmount();
      cleanup();
      setIsDownloading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen relative">
        <div className="text-center space-y-8">
          {/* Animated GitHub logo/icon */}
          <div className="relative inline-block">
            <div className="w-24 h-24 mx-auto mb-6 relative">
              <div
                className="absolute inset-0 rounded-full opacity-20 animate-ping"
                style={{
                  backgroundImage:
                    'linear-gradient(90deg, #06b6d4 0%, #34d399 20%, #fb923c 40%, #ec4899 60%, #38bdf8 80%, #64748b 100%)',
                }}
              ></div>
              <div
                className="absolute inset-0 rounded-full opacity-40 blur-xl"
                style={{
                  backgroundImage:
                    'linear-gradient(90deg, #06b6d4 0%, #34d399 20%, #fb923c 40%, #ec4899 60%, #38bdf8 80%, #64748b 100%)',
                }}
              ></div>
              <svg className="24 h-24 text-white opacity-90" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Wrapping up {username}'s 2025</h2>
            <p className="text-gray-400 text-sm">Analyzing contributions, calculating stats, and generating insights...</p>
          </div>

          {/* Progress dots */}
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
        <h2 className="text-3xl font-bold text-red-400">Oops! Something went wrong.</h2>
        <p className="mt-2 text-gray-300 max-w-lg">{error}</p>
        <Link to="/" className="mt-6 px-6 py-2 bg-purple-600 rounded-full hover:bg-purple-700 transition-colors">
          Try another username
        </Link>
      </div>
    );
  }

  if (!userData) return null;

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="flex justify-between items-center mb-8">
        <Link to="/" className="text-lg font-bold hover:text-purple-400 transition-colors">&larr; GitWrap 2025</Link>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        <div className="lg:col-span-2">
            {/* Let the card grow naturally so no content is clipped */}
            <div className="w-full max-w-3xl mx-auto lg:max-w-none">
              <GitWrapCard
                ref={cardRef}
                userData={userData}
                funMessage={funMessage}
                theme={activeTheme}
                layout={CardLayout.Classic}
              />
            </div>
        </div>
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Customize Your Card</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-400">Theme</label>
                <ThemeSelector themes={THEMES} activeTheme={activeTheme} onSelectTheme={setActiveTheme} />
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">Download</h2>
            <div className="flex flex-col sm:flex-row gap-4">
               {Object.values(AspectRatio).map(ar => (
                <button
                  key={ar}
                  onClick={() => handleDownload(ar)}
                  disabled={!!isDownloading}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 rounded-lg font-semibold hover:bg-purple-700 transition-all disabled:bg-purple-800 disabled:cursor-not-allowed"
                >
                  {isDownloading === ar ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Generating...</span>
                    </div>
                  ) : (
                    <>
                      <DownloadIcon className="w-5 h-5" />
                      <span>Social Post (3:4)</span>
                    </>
                  )}
                </button>
              ))}
            </div>
             {isDownloading && <p className="text-sm text-gray-400 mt-2">Generating high-quality PNG, please wait...</p>}
          </div>
          {username && <SocialShare username={username} />}
          <div>
            <Contributors />
          </div>
        </div>
      </div>
      <footer className="mt-12 md:mt-16 text-center px-4 pb-6">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2">
          <span className="text-gray-400 text-xs sm:text-sm">
            Made with 💜 for developers
          </span>
          <span className="hidden sm:inline text-gray-600">•</span>
          <span className="text-gray-500 text-[0.7rem] sm:text-xs">
            Powered by React, Tailwind & Gemini AI
          </span>
        </div>
        <div className="mt-1.5 text-gray-600 text-[0.7rem] sm:text-xs">
          Celebrating your open source journey 🚀
        </div>
      </footer>
    </div>
  );
};

export default UserPage;