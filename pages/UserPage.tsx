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
import { DownloadIcon } from '../components/icons/DownloadIcon';

// This is a browser global from the html-to-image CDN script
declare const htmlToImage: any;

const UserPage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [userData, setUserData] = useState<UserStats | null>(null);
  const [funMessage, setFunMessage] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTheme, setActiveTheme] = useState<Theme>(THEMES[0]);
  const [isDownloading, setIsDownloading] = useState<AspectRatio | null>(null);
  

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

  const handleDownload = async (aspectRatio: AspectRatio) => {
    if (!userData) return;
    setIsDownloading(aspectRatio);

    const targetWidth = 1080;
    const targetHeight = 1440;

    const exportContainer = document.createElement('div');
  exportContainer.style.position = 'fixed';
  exportContainer.style.left = '0';
  exportContainer.style.top = '0';
  exportContainer.style.width = `${targetWidth}px`;
  exportContainer.style.height = `${targetHeight}px`;
  exportContainer.style.opacity = '0';
  exportContainer.style.pointerEvents = 'none';
  exportContainer.style.overflow = 'hidden';
  exportContainer.style.zIndex = '-1';
  exportContainer.setAttribute('aria-hidden', 'true');

    document.body.appendChild(exportContainer);

    const root = createRoot(exportContainer);
    root.render(
      <ExportCard
        userData={userData}
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
      const fontSet = (document as Document & { fonts?: FontFaceSet }).fonts;
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
      const computedStyles = getComputedStyle(captureTarget);
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
      link.download = `gitwrap-2025-${safeUsername}-classic-${safeAspectRatio}.png`;
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
      document.body.removeChild(exportContainer);
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
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-20 animate-ping"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-40 blur-xl"></div>
              <svg className="relative w-24 h-24 text-white opacity-90" fill="currentColor" viewBox="0 0 24 24">
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
            {/* Mobile: Remove aspect ratio constraint, Desktop: Keep 3:4 ratio */}
            <div className="w-full max-w-xl mx-auto lg:max-w-none overflow-hidden">
              <div className="sm:aspect-[3/4] w-full">
                <GitWrapCard ref={cardRef} userData={userData} funMessage={funMessage} theme={activeTheme} layout={CardLayout.Classic} />
              </div>
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
          {/* Mascot generation removed */}
        </div>
      </div>
    </div>
  );
};

export default UserPage;