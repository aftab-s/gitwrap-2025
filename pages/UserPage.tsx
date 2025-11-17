import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { UserStats, Theme } from '../types';
import { AspectRatio, CardLayout } from '../types';
import { fetchGitHubStats } from '../services/github';
import { generateFunMessage } from '../services/geminiService';
import { THEMES } from '../constants';
import GitWrapCard from '../components/GitWrapCard';
import ThemeSelector from '../components/ThemeSelector';
import SocialShare from '../components/SocialShare';
import { LoadingSpinner } from '../components/LoadingSpinner';
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
    if (!cardRef.current) return;
    setIsDownloading(aspectRatio);

    const cardElement = cardRef.current;
    
    // Get the actual rendered size
    const rect = cardElement.getBoundingClientRect();
    
    // Define target dimensions based on aspect ratio
    const baseWidth = 1200;
    let targetWidth: number;
    let targetHeight: number;

    if (aspectRatio === AspectRatio.Social) { // "3:4"
      targetWidth = baseWidth;
      targetHeight = Math.round(targetWidth * 4 / 3);
    }

    // Calculate scale factor based on actual size vs target size
    const scale = targetWidth / rect.width;

    try {
      const dataUrl = await htmlToImage.toPng(cardElement, {
        width: targetWidth,
        height: targetHeight,
        style: {
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          width: `${rect.width}px`,
          height: `${rect.height}px`,
        },
        pixelRatio: 1,
        cacheBust: true,
      });

      const link = document.createElement('a');
      const safeAspectRatio = aspectRatio.replace(':', 'x');
      const safeUsername = username?.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      link.download = `gitwrap-2025-${safeUsername}-classic-${safeAspectRatio}.png`;
      link.href = dataUrl;
      link.click();
    } catch(err) {
      console.error('Failed to download image:', err);
      const message = err instanceof Error ? err.message : String(err);
      alert(`Sorry, there was an error creating the image. This can be caused by external resources (like avatars) failing to load. Please try again.\n\nError: ${message}`);
    } finally {
      setIsDownloading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <LoadingSpinner />
        <p className="mt-4 text-lg text-gray-300">Wrapping up {username}'s 2025...</p>
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
            <div className="w-full max-w-xl mx-auto lg:max-w-none">
              <div className="sm:aspect-[3/4]">
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
                  {isDownloading === ar ? <LoadingSpinner size="sm" /> : <DownloadIcon className="w-5 h-5" />}
                  <span>Social Post (3:4)</span>
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