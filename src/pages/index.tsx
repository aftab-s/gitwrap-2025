import Head from 'next/head';
import Script from 'next/script';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

export default function Home() {
  const [username, setUsername] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = username.trim();
    if (!trimmed) return;
    router.push(`/u/${encodeURIComponent(trimmed)}`);
  };

  // Force dark mode by default
  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  return (
    <>
      <Head>
        <title>GitHub Unwrapped 2025</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {/* Fonts are loaded in _document.tsx to avoid per-page loading warnings */}
        <style>{`
    .text-gradient { background-image: linear-gradient(to right, #14b8a6, #6366f1); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; text-fill-color: transparent; }
  `}</style>
      </Head>

      {/* Tailwind is built via PostCSS (globals.css + tailwind.config.js).
          Removed the CDN script/config to avoid runtime conflicts between
          compiled Tailwind and the CDN-injected styles. */}

      <div className="bg-background-dark font-display text-gray-300 antialiased min-h-screen">
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-4 sm:p-6">
          <div className="absolute inset-0 z-0">
              <div
                className="absolute inset-0 bg-background-dark"
                style={{
                  // larger, slightly more opaque dots for better visibility on dark
                  backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)',
                  backgroundSize: '14px 14px',
                }}
              />
          </div>

          <main className="relative z-10 flex w-full max-w-xl flex-col items-center text-center">
            <div className="mb-8">
              <h1 className="text-4xl font-bold tracking-tighter text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                GitHub Unwrapped
              </h1>
              <p className="text-gradient mt-2 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">2025</p>
            </div>

            <h2 className="mb-10 text-lg text-gray-600 dark:text-gray-400 sm:text-xl">Your year in code, visualized</h2>

            <form className="flex w-full flex-col gap-3 sm:flex-row" onSubmit={handleSubmit}>
              <input
                className="w-full rounded-lg border-gray-300 bg-white/50 px-4 py-3 text-gray-900 placeholder-gray-500 shadow-sm transition-colors focus:border-primary focus:ring-primary dark:border-gray-700 dark:bg-gray-800/50 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary"
                placeholder="Enter GitHub username..."
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              <button className="flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-bold text-white shadow-lg shadow-primary/30 transition-all hover:bg-opacity-90 active:scale-95" type="submit">
                <span className="material-symbols-outlined !text-xl">auto_awesome</span>
                Generate
              </button>
            </form>

            <div className="mt-8 space-y-3 text-sm text-gray-500 dark:text-gray-400">
              <p className="flex items-center justify-center gap-2">
                <span className="material-symbols-outlined !text-base !text-amber-500">spark</span>
                No signup required - just enter any public GitHub username
              </p>
              <p className="flex items-center justify-center gap-2">
                <span className="material-symbols-outlined !text-base">calendar_month</span>
                Shows your 2025 activity only
              </p>
            </div>
          </main>

          <footer className="absolute bottom-6 z-10 text-center text-xs text-gray-500 dark:text-gray-500">
            <p className="mb-1">
              <a className="hover:text-gray-900 dark:hover:text-gray-300" href="#">Privacy Policy</a>
              <span className="mx-2">·</span>
              <a className="hover:text-gray-900 dark:hover:text-gray-300" href="#">GitHub</a>
            </p>
          </footer>
        </div>
      </div>
    </>
  );
}
