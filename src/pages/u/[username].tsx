import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useState, useRef, useEffect } from 'react';
import { ThemeSelector } from '@/components/ThemeSelector';
import { DownloadButton } from '@/components/DownloadButton';
import type { UserStats, ThemeName, StatsAPIResponse } from '@/types';
import { THEME_COLORS, LAYOUT } from '@/types/theme';

export default function UserPage() {
  const router = useRouter();
  const { username } = router.query;
  const themeParam = router.query.theme as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [theme, setTheme] = useState<ThemeName>('space');
  const [copied, setCopied] = useState(false);

  const htmlCardRef = useRef<HTMLDivElement>(null); // Reference to the visible HTML card

  useEffect(() => {
    if (!username || typeof username !== 'string') return;

    // Set theme from URL parameter
    if (themeParam && ['space', 'sunset', 'retro', 'minimal', 'high-contrast'].includes(themeParam)) {
      setTheme(themeParam as ThemeName);
    }

    // Fetch stats
    const fetchStats = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/stats?username=${encodeURIComponent(username)}`);
        const data: StatsAPIResponse = await response.json();

        if (!data.success) {
          setError(data.error);
          return;
        }

        setStats(data.data);
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to load card. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [username, themeParam]);

  // Update theme in URL when changed
  const handleThemeChange = (newTheme: ThemeName) => {
    setTheme(newTheme);
    router.push(`/u/${username}?theme=${newTheme}`, undefined, { shallow: true });
  };

  // Update document theme attribute
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme]);

  // Handlers and computed values
  const shareUrl = typeof window !== 'undefined' && stats 
    ? `${window.location.origin}/u/${stats.login}?theme=${theme}` 
    : '';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleTwitterShare = () => {
    const text = `Check out my GitHub Unwrapped 2025! 🚀`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=550,height=420');
  };

  const handleLinkedInShare = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=550,height=420');
  };

  // Theme colors configuration - imported from modular system
  const currentTheme = THEME_COLORS[theme];

  if (loading) {
    return (
      <>
        <Head>
          <title>GitHub Unwrapped 2025</title>
        </Head>
        <main className="min-h-screen flex items-center justify-center relative">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)',
              backgroundSize: '14px 14px',
            }}
          />
          <div className="text-center relative z-10">
            <div className="spinner mx-auto mb-4" />
            <p className="text-xl text-gray-300">Loading GitHub Unwrapped...</p>
          </div>
        </main>
      </>
    );
  }

  if (error || !stats) {
    return (
      <>
        <Head>
          <title>GitHub Unwrapped 2025</title>
        </Head>
        <main className="min-h-screen flex items-center justify-center px-4 relative">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)',
              backgroundSize: '14px 14px',
            }}
          />
          <div className="text-center max-w-md relative z-10">
            <h1 className="text-4xl font-bold mb-4 text-white">Oops!</h1>
            <p className="text-xl mb-6 text-gray-400">{error || 'Failed to load card'}</p>
            <a href="/" className="btn inline-block">
              Generate Your Own
            </a>
          </div>
        </main>
      </>
    );
  }

  const pageTitle = `@${stats.login}'s GitHub Unwrapped 2025`;
  const pageDescription = `${stats.totalCommits} commits, ${stats.longestStreakDays} day streak, ${stats.totalPRs} PRs in 2025!`;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
      </Head>

      <main 
        className="min-h-screen flex items-center justify-center overflow-hidden p-4 sm:p-8 relative"
        style={{
          background: theme === 'minimal' ? '#f8fafc' : theme === 'high-contrast' ? '#0D0208' : '#111827',
        }}
      >
        {/* Radial gradient overlay - for non-minimal/non-high-contrast themes */}
        {theme !== 'minimal' && theme !== 'high-contrast' && (
          <div
            className="absolute inset-0 z-0 opacity-40"
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100%25\' height=\'100%25\'%3E%3Cdefs%3E%3CradialGradient id=\'grad\' cx=\'50%25\' cy=\'50%25\' r=\'50%25\'%3E%3Cstop offset=\'0%25\' stop-color=\'%231e1b4b\' /%3E%3Cstop offset=\'100%25\' stop-color=\'%230c0a1a\' /%3E%3C/radialGradient%3E%3C/defs%3E%3Crect width=\'100%25\' height=\'100%25\' fill=\'url(%23grad)\' /%3E%3C/svg%3E")',
            }}
          />
        )}
        
        {/* Grid background for high-contrast/matrix theme */}
        {theme === 'high-contrast' && (
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: 'linear-gradient(rgba(128, 128, 128, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(128, 128, 128, 0.1) 1px, transparent 1px)',
              backgroundSize: '2rem 2rem',
              backgroundPosition: 'center',
            }}
          />
        )}
        
        {/* Dot pattern background - different for minimal theme */}
        {theme !== 'high-contrast' && (
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: theme === 'minimal'
                ? 'radial-gradient(circle, rgba(226, 232, 240, 1) 1px, transparent 1px)'
                : 'radial-gradient(circle, rgba(255, 255, 255, 0.08) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
              backgroundColor: theme === 'minimal' ? '#f8fafc' : undefined,
            }}
          />
        )}
        <div className="relative z-10 w-full max-w-7xl">
          <header className="mb-8 text-center">
            <a 
              href="/" 
              className="inline-flex items-center gap-2 text-sm transition-colors mb-4"
              style={{ 
                color: theme === 'minimal' ? '#94a3b8' : '#9ca3af',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = theme === 'minimal' ? '#475569' : '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = theme === 'minimal' ? '#94a3b8' : '#9ca3af';
              }}
            >
              <span className="material-symbols-outlined">arrow_back</span>
              Create Your Own
            </a>
            <h1 
              className="text-3xl font-bold sm:text-4xl"
              style={{ 
                color: theme === 'minimal' ? '#1e293b' : '#ffffff',
                textShadow: theme === 'retro' ? `0 0 5px ${currentTheme.accent}, 0 0 10px ${currentTheme.accent}` : 'none',
              }}
            >
              @{stats.login}'s GitHub Unwrapped
            </h1>
            <p 
              className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl"
              style={{
                background: `linear-gradient(to right, ${currentTheme.accent}, ${currentTheme.accentSecondary})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              2025
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 xl:gap-12 items-start">
            {/* Left Column - Stats Card */}
            <div className="lg:col-span-3">
              <div className={`relative ${theme === 'space' ? 'rounded-3xl' : ''}`}>
                {/* Retro-specific outer glow */}
                {theme === 'retro' && (
                  <div 
                    className="absolute inset-[-1px] rounded-3xl blur-lg -z-10"
                    style={{
                      background: `linear-gradient(145deg, rgba(236, 72, 153, 0.8), rgba(6, 182, 212, 0.8))`,
                    }}
                  />
                )}
                
                {/* Space theme border glow */}
                {theme === 'space' && (
                  <div 
                    className="absolute inset-0 rounded-3xl pointer-events-none"
                    style={{
                      background: 'conic-gradient(from 180deg at 50% 50%, #6366f1, #14b8a6, #a855f7, #6366f1)',
                      padding: '2px',
                      borderRadius: '1.5rem',
                      zIndex: 0,
                    }}
                  />
                )}
                
                <div 
                  ref={htmlCardRef}
                  className={`relative backdrop-blur-lg rounded-3xl p-8 border overflow-hidden ${theme === 'space' ? 'z-10' : ''}`}
                  style={{
                    backgroundColor: theme === 'space' ? 'rgba(31, 41, 55, 0.9)' : currentTheme.cardBg,
                    borderColor: theme === 'space' ? 'rgba(255, 255, 255, 0.1)' : currentTheme.border,
                    boxShadow: theme === 'minimal' ? '0 25px 50px -12px rgba(0, 0, 0, 0.15)' : 'none',
                    maxWidth: '1080px',
                    margin: '0 auto',
                  }}
                >
                  {/* Space theme background with nebula and stars */}
                  {theme === 'space' && (
                    <>
                      <div 
                        className="absolute inset-0 z-0 opacity-30 rounded-[22px]"
                        style={{
                          backgroundImage: 'radial-gradient(ellipse 100% 70% at 20% 0%, #6366f1, transparent), radial-gradient(ellipse 100% 70% at 80% 100%, #14b8a6, transparent)',
                          animation: 'nebula-pan 45s ease-in-out infinite alternate',
                        }}
                      />
                      <div className="absolute inset-0 z-0">
                        {/* Twinkling stars */}
                        {[0, 0.5, 1.5, 1, 2.5, 2, 3, 3.5, 4, 4.5].map((delay, index) => (
                          <div
                            key={index}
                            className="absolute rounded-full bg-white/80 animate-twinkle"
                            style={{
                              width: index % 3 === 0 ? '4px' : '2px',
                              height: index % 3 === 0 ? '4px' : '2px',
                              top: `${(20 + index * 10) % 90}%`,
                              left: `${(20 + index * 13) % 90}%`,
                              opacity: index % 2 === 0 ? 0.8 : 0.6,
                              animationDelay: `${delay}s`,
                            }}
                          />
                        ))}
                      </div>
                      {/* Meteor shower effect */}
                      <div className="absolute -top-1/4 -right-1/4 w-1/2 h-[200%] z-0">
                        {[0, 2, 5].map((delay, i) => (
                          <div
                            key={i}
                            className="absolute top-0 right-0 rounded-full bg-gradient-to-b from-white/30 to-transparent animate-meteor-shower"
                            style={{
                              width: i === 1 ? '2px' : '4px',
                              height: i === 0 ? '384px' : i === 1 ? '320px' : '384px',
                              opacity: 0.3,
                              animationDelay: `${delay}s`,
                              animationDuration: i === 1 ? '7s' : i === 2 ? '6s' : '8s',
                            }}
                          />
                        ))}
                      </div>
                    </>
                  )}
                  
                  {/* Scanlines effect for retro theme */}
                  {theme === 'retro' && (
                    <div 
                      className="absolute inset-0 pointer-events-none z-10"
                      style={{
                        backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 50%, transparent 50%)',
                        backgroundSize: '100% 4px',
                        opacity: 0.5,
                      }}
                    />
                  )}

                  {/* Matrix stream effect for high-contrast/matrix theme */}
                  {theme === 'high-contrast' && (
                    <>
                      <div 
                        className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
                        style={{
                          fontFamily: 'VT323, monospace',
                          fontSize: '10px',
                          color: 'rgba(57, 255, 20, 0.1)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        <div
                          style={{
                            position: 'absolute',
                            top: '-100%',
                            left: '20%',
                            writingMode: 'vertical-rl',
                            textOrientation: 'upright',
                            animation: 'matrix-fall 15s linear infinite',
                          }}
                        >
                          01101001 01101110 01101001 01110100 01101001 01100001 01101100
                        </div>
                        <div
                          style={{
                            position: 'absolute',
                            top: '-150%',
                            left: '75%',
                            writingMode: 'vertical-rl',
                            textOrientation: 'upright',
                            animation: 'matrix-fall 20s linear infinite',
                            animationDelay: '-5s',
                          }}
                        >
                          10110100 10110100 10110100 10110100 10110100
                        </div>
                      </div>
                    </>
                  )}
                  
                  {/* Glow effect for non-retro themes */}
                  {theme !== 'retro' && theme !== 'minimal' && theme !== 'space' && (
                    <div 
                      className="absolute inset-0 rounded-3xl p-[2px] -z-10" 
                      style={{ 
                        background: `linear-gradient(145deg, ${currentTheme.glow}, ${currentTheme.glow}, ${currentTheme.glow})`,
                        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', 
                        WebkitMaskComposite: 'xor', 
                        maskComposite: 'exclude',
                        opacity: 0.6,
                      }} 
                    />
                  )}
                  
                  <div className={`relative z-10 ${theme === 'space' ? '' : ''}`}>
                {/* Avatar and Name */}
                <div className={`flex flex-col sm:flex-row items-center gap-4 sm:gap-5 mb-6 sm:mb-8`}>
                  <img 
                    alt={`${stats.login} avatar`}
                    className="w-20 h-20 rounded-full border-4 shadow-lg"
                    style={{
                      borderColor: currentTheme.avatar,
                      boxShadow: theme === 'retro' 
                        ? `0 0 20px ${currentTheme.avatar}` 
                        : `0 10px 15px -3px ${currentTheme.glow}, 0 4px 6px -2px ${currentTheme.glow}`,
                    }}
                    src={stats.avatarUrl}
                  />
                  <div className={`text-center sm:text-left`}>
                    <h2 
                      className="text-xl sm:text-2xl font-bold"
                      style={{ 
                        color: currentTheme.textPrimary,
                        textShadow: theme === 'retro' ? `0 0 5px ${currentTheme.accent}, 0 0 10px ${currentTheme.accent}` : 'none'
                      }}
                    >
                      {stats.name || stats.login}
                    </h2>
                    <p className="text-sm sm:text-base" style={{ color: currentTheme.textSecondary }}>
                      @{stats.login}
                    </p>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-5 sm:mb-6">
                  <div 
                    className="border p-2.5 sm:p-3 rounded-xl text-center flex flex-col items-center justify-center"
                    style={{
                      backgroundColor: currentTheme.statBg,
                      borderColor: currentTheme.statBorder,
                    }}
                  >
                    <p 
                      className="text-[10px] sm:text-xs uppercase tracking-wider mb-0.5"
                      style={{ color: currentTheme.textSecondary }}
                    >
                      Contributions
                    </p>
                    <p 
                      className="text-2xl sm:text-3xl font-bold"
                      style={{ 
                        background: `linear-gradient(to right, ${currentTheme.accent}, ${currentTheme.accentSecondary})`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}
                    >
                      {stats.totalCommits}
                    </p>
                  </div>
                  
                  {[
                    { label: 'Longest Streak', value: stats.longestStreakDays },
                    { label: 'Pull Requests', value: stats.totalPRs },
                    { label: 'Issues', value: stats.totalIssues },
                    { label: 'Stars Given', value: stats.totalStarsGiven },
                    { label: 'Repositories', value: stats.totalRepositories },
                  ].map((stat, index) => (
                    <div 
                      key={index}
                      className="border p-2.5 sm:p-3 rounded-xl text-center flex flex-col items-center justify-center"
                      style={{
                        backgroundColor: currentTheme.statBg,
                        borderColor: currentTheme.statBorder,
                      }}
                    >
                      <p 
                        className="text-[10px] sm:text-xs uppercase tracking-wider mb-0.5"
                        style={{ color: currentTheme.textSecondary }}
                      >
                        {stat.label}
                      </p>
                      <p 
                        className="text-2xl sm:text-3xl font-bold"
                        style={{ color: currentTheme.textPrimary }}
                      >
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Activity Insights */}
                <div className="space-y-4 sm:space-y-5">
                  {stats.bestDayOfWeek && (
                    <div 
                      className="border p-3 sm:p-4 rounded-xl"
                      style={{
                        backgroundColor: currentTheme.statBg,
                        borderColor: currentTheme.statBorder,
                      }}
                    >
                      <h3 
                        className="text-sm sm:text-base font-bold mb-2 sm:mb-3 flex items-center gap-2"
                        style={{ color: currentTheme.textPrimary }}
                      >
                        <span className="material-symbols-outlined !text-lg sm:!text-xl" style={{ color: currentTheme.iconColor }}>
                          monitoring
                        </span>
                        Activity Insights
                      </h3>
                      <div className="grid grid-cols-2 gap-3 text-left">
                        <div>
                          <p className="text-xs sm:text-sm" style={{ color: currentTheme.textSecondary }}>
                            Most Productive Day
                          </p>
                          <p className="text-sm sm:text-base font-medium" style={{ color: currentTheme.textPrimary }}>
                            {stats.bestDayOfWeek}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm" style={{ color: currentTheme.textSecondary }}>
                            Most Productive Hour
                          </p>
                          <p className="text-sm sm:text-base font-medium" style={{ color: currentTheme.textPrimary }}>
                            {stats.bestHour}:00
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Top Languages */}
                  {stats.topLanguages.length > 0 && (
                    <div 
                      className="border p-3 sm:p-4 rounded-xl"
                      style={{
                        backgroundColor: currentTheme.statBg,
                        borderColor: currentTheme.statBorder,
                      }}
                    >
                      <h3 
                        className="text-sm sm:text-base font-bold mb-2 sm:mb-3 flex items-center gap-2"
                        style={{ color: currentTheme.textPrimary }}
                      >
                        <span className="material-symbols-outlined !text-lg sm:!text-xl" style={{ color: currentTheme.iconColor }}>
                          code
                        </span>
                        Top Languages
                      </h3>
                      <div className="space-y-2 sm:space-y-3">
                        {stats.topLanguages.slice(0, 3).map((lang, index) => (
                          <div key={lang.name} className="flex items-center gap-2 sm:gap-3">
                            <div 
                              className="text-xs sm:text-sm font-mono w-16 sm:w-20 text-right"
                              style={{ color: currentTheme.textSecondary }}
                            >
                              {lang.name}
                            </div>
                            <div 
                              className="relative flex-1 h-2 sm:h-3 rounded-full overflow-hidden"
                              style={{ 
                                backgroundColor: theme === 'minimal' 
                                  ? 'rgba(226, 232, 240, 1)' 
                                  : theme === 'retro'
                                  ? 'rgba(131, 24, 67, 0.5)'
                                  : theme === 'sunset'
                                  ? 'rgba(63, 63, 70, 0.5)'
                                  : 'rgba(55, 65, 81, 0.5)'
                              }}
                            >
                              <div 
                                className="absolute top-0 left-0 h-full rounded-full"
                                style={{ 
                                  width: `${lang.percent * 100}%`,
                                  background: index === 0 
                                    ? `linear-gradient(to right, ${currentTheme.accent}, ${theme === 'minimal' ? '#f9a8d4' : theme === 'retro' ? '#f9a8d4' : theme === 'sunset' ? '#ec4899' : currentTheme.accentSecondary})` 
                                    : index === 1
                                    ? (theme === 'retro' ? 'linear-gradient(to right, #06b6d4, #38bdf8)' : 'linear-gradient(to right, #6366f1, #a78bfa)')
                                    : 'linear-gradient(to right, #f59e0b, #fbbf24)'
                                }}
                              />
                            </div>
                            <div 
                              className="text-xs sm:text-sm w-8 sm:w-10 text-right font-semibold"
                              style={{ color: currentTheme.textPrimary }}
                            >
                              {Math.round(lang.percent * 100)}%
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Top Repository */}
                  {stats.topRepos.length > 0 && (
                    <div 
                      className="border p-3 sm:p-4 rounded-xl"
                      style={{
                        backgroundColor: currentTheme.statBg,
                        borderColor: currentTheme.statBorder,
                      }}
                    >
                      <h3 
                        className="text-sm sm:text-base font-bold mb-2 sm:mb-3 flex items-center gap-2"
                        style={{ color: currentTheme.textPrimary }}
                      >
                        <span className="material-symbols-outlined !text-lg sm:!text-xl" style={{ color: currentTheme.iconColor }}>
                          star
                        </span>
                        Top Repository
                      </h3>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shadow-lg text-sm"
                          style={{
                            background: `linear-gradient(to bottom right, ${currentTheme.accent}, ${currentTheme.accentSecondary})`,
                            boxShadow: `0 4px 6px -1px ${currentTheme.glow}`,
                          }}
                        >
                          {stats.topRepos[0].name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-sm sm:text-base" style={{ color: currentTheme.textPrimary }}>
                            {stats.topRepos[0].name}
                          </p>
                          <p className="text-xs sm:text-sm" style={{ color: currentTheme.textSecondary }}>
                            {stats.topRepos[0].contributions} contributions
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  </div>
                </div>
              </div>
            </div>
          </div>

            {/* Right Column - Controls */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                {/* Theme Selector */}
                <div 
                  className="border backdrop-blur-lg rounded-2xl p-6"
                  style={{
                    backgroundColor: theme === 'minimal' ? 'rgba(255, 255, 255, 1)' : 'rgba(31, 41, 55, 0.6)',
                    borderColor: theme === 'minimal' ? '#e2e8f0' : '#374151',
                    boxShadow: theme === 'minimal' ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' : 'none',
                  }}
                >
                  <h3 
                    className="text-lg font-bold mb-4 flex items-center gap-2"
                    style={{ color: theme === 'minimal' ? '#1e293b' : '#ffffff' }}
                  >
                    <span className="material-symbols-outlined" style={{ color: currentTheme.iconColor }}>palette</span>
                    Choose Theme
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-4">
                    <button 
                      onClick={() => handleThemeChange('space')}
                      className="group flex flex-col items-center gap-2 p-2 rounded-lg transition-colors"
                      style={{
                        backgroundColor: theme === 'space' 
                          ? 'rgba(55, 65, 81, 1)' 
                          : 'transparent',
                        outline: theme === 'space' ? `2px solid ${currentTheme.accent}` : 'none',
                      }}
                    >
                      <div className="w-full h-10 rounded-md bg-gradient-to-br from-blue-400 to-purple-600" />
                      <span 
                        className={`text-sm ${theme === 'space' ? 'font-medium' : ''}`}
                        style={{ color: theme === 'space' ? '#ffffff' : (theme === 'minimal' ? '#475569' : '#d1d5db') }}
                      >
                        Space
                      </span>
                    </button>
                    
                    <button 
                      onClick={() => handleThemeChange('sunset')}
                      className="group flex flex-col items-center gap-2 p-2 rounded-lg transition-colors"
                      style={{
                        backgroundColor: theme === 'sunset' 
                          ? 'rgba(63, 63, 70, 1)' 
                          : 'transparent',
                        outline: theme === 'sunset' ? '2px solid #f97316' : 'none',
                      }}
                    >
                      <div className="w-full h-10 rounded-md bg-gradient-to-br from-orange-400 to-red-600" />
                      <span 
                        className={`text-sm ${theme === 'sunset' ? 'font-medium' : ''}`}
                        style={{ color: theme === 'sunset' ? '#ffffff' : (theme === 'minimal' ? '#475569' : '#d1d5db') }}
                      >
                        Sunset
                      </span>
                    </button>
                    
                    <button 
                      onClick={() => handleThemeChange('retro')}
                      className="group flex flex-col items-center gap-2 p-2 rounded-lg transition-colors"
                      style={{
                        backgroundColor: theme === 'retro' 
                          ? 'rgba(55, 65, 81, 0.8)' 
                          : 'transparent',
                        outline: theme === 'retro' ? '2px solid #ec4899' : 'none',
                      }}
                    >
                      <div className="w-full h-10 rounded-md bg-gradient-to-br from-pink-400 to-cyan-400" />
                      <span 
                        className={`text-sm ${theme === 'retro' ? 'font-medium' : ''}`}
                        style={{ color: theme === 'retro' ? '#ffffff' : (theme === 'minimal' ? '#475569' : '#d1d5db') }}
                      >
                        Retro
                      </span>
                    </button>
                    
                    <button 
                      onClick={() => handleThemeChange('minimal')}
                      className="group flex flex-col items-center gap-2 p-2 rounded-lg transition-colors"
                      style={{
                        backgroundColor: theme === 'minimal' 
                          ? 'rgba(241, 245, 249, 1)' 
                          : 'transparent',
                        outline: theme === 'minimal' ? '2px solid #f472b6' : 'none',
                      }}
                    >
                      <div className="w-full h-10 rounded-md bg-gradient-to-br from-pink-300 to-violet-300" />
                      <span 
                        className={`text-sm ${theme === 'minimal' ? 'font-medium' : ''}`}
                        style={{ color: theme === 'minimal' ? '#ec4899' : '#d1d5db' }}
                      >
                        Aesthetic
                      </span>
                    </button>
                    
                    <button 
                      onClick={() => handleThemeChange('high-contrast')}
                      className="group flex flex-col items-center gap-2 p-2 rounded-lg transition-colors"
                      style={{
                        backgroundColor: theme === 'high-contrast' 
                          ? 'rgba(55, 65, 81, 1)' 
                          : 'transparent',
                        outline: theme === 'high-contrast' ? '2px solid #14b8a6' : 'none',
                      }}
                    >
                      <div className="w-full h-10 rounded-md bg-gray-800 border border-gray-600 relative flex items-center justify-center">
                        <div className="w-4 h-4 rounded-full bg-gradient-to-br from-teal-400 to-indigo-400" />
                      </div>
                      <span 
                        className={`text-sm ${theme === 'high-contrast' ? 'font-medium' : ''}`}
                        style={{ color: theme === 'high-contrast' ? '#ffffff' : (theme === 'minimal' ? '#475569' : '#d1d5db') }}
                      >
                        Dark
                      </span>
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                  <div 
                    className="relative"
                    style={{
                      background: theme === 'minimal' ? 'transparent' : undefined,
                    }}
                  >
                    <DownloadButton 
                      cardRef={htmlCardRef}
                      username={stats.login} 
                      theme={theme} 
                      themeColors={currentTheme} 
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <button 
                      onClick={handleCopyLink}
                      className="group col-span-1 sm:col-span-3 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 font-semibold transition-all active:scale-[0.98]"
                      style={{
                        backgroundColor: theme === 'minimal' ? '#ffffff' : 'rgba(55, 65, 81, 0.8)',
                        color: theme === 'minimal' ? currentTheme.textPrimary : '#ffffff',
                        border: theme === 'minimal' ? `1px solid ${currentTheme.border}` : 'none',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = theme === 'minimal' ? '#f1f5f9' : 'rgba(55, 65, 81, 1)';
                        if (theme === 'minimal') {
                          e.currentTarget.style.borderColor = '#cbd5e1';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = theme === 'minimal' ? '#ffffff' : 'rgba(55, 65, 81, 0.8)';
                        if (theme === 'minimal') {
                          e.currentTarget.style.borderColor = currentTheme.border;
                        }
                      }}
                    >
                      <span className="material-symbols-outlined transition-transform group-hover:-rotate-12">
                        {copied ? 'check' : 'link'}
                      </span>
                      <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
                    </button>

                    <button 
                      onClick={handleTwitterShare}
                      className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#1DA1F2]/90 px-4 py-3 font-semibold text-white transition-all hover:bg-[#1DA1F2] active:scale-[0.98]"
                    >
                      <svg aria-hidden="true" className="w-5 h-5 transition-transform group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                      <span className="hidden sm:inline">Share</span>
                    </button>

                    <button 
                      onClick={handleLinkedInShare}
                      className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#0077B5]/90 px-4 py-3 font-semibold text-white transition-all hover:bg-[#0077B5] active:scale-[0.98]"
                    >
                      <svg aria-hidden="true" className="w-5 h-5 transition-transform group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
                      </svg>
                      <span className="hidden sm:inline">Share</span>
                    </button>
                  </div>

                  <p 
                    className="text-center text-xs truncate px-4"
                    style={{ color: theme === 'minimal' ? currentTheme.textSecondary : '#6b7280' }}
                  >
                    {shareUrl.replace('http://localhost:3000', 'githubunwrapped.com')}
                  </p>
                </div>

                {/* Generate Your Own */}
                <a 
                  href="/"
                  className="group flex w-full items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-4 font-bold transition-all"
                  style={{
                    borderColor: theme === 'minimal' ? '#cbd5e1' : '#4b5563',
                    color: theme === 'minimal' ? '#64748b' : '#d1d5db',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = `${currentTheme.accent}80`;
                    e.currentTarget.style.color = theme === 'minimal' ? currentTheme.accent : '#ffffff';
                    e.currentTarget.style.backgroundColor = `${currentTheme.accent}10`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = theme === 'minimal' ? '#cbd5e1' : '#4b5563';
                    e.currentTarget.style.color = theme === 'minimal' ? '#64748b' : '#d1d5db';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <span className="material-symbols-outlined transition-transform group-hover:rotate-90">add_circle</span>
                  Generate Your Own
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
