import React, { forwardRef, useMemo } from 'react';
import type { UserStats, Theme } from '../../types';
import { CommitIcon } from '../icons/CommitIcon';
import { PRIcon } from '../icons/PRIcon';
import { IssueIcon } from '../icons/IssueIcon';
import { ReviewIcon } from '../icons/ReviewIcon';
import { SparklesIcon } from '../icons/SparklesIcon';

interface LayoutProps {
  userData: UserStats;
  funMessage: string;
  theme: Theme;
  isExport?: boolean;
}

// Helper to convert flat calendar to heatmap weeks structure
function buildHeatmapWeeks(calendar: Array<{ date: string; count: number }>) {
  if (calendar.length === 0) {
    return [];
  }

  // GitHub's heatmap is laid out in columns (weeks) where each column has 7 rows (days)
  // We need to convert the flat calendar array into this structure
  const weeks: { monthLabel: string; days: number[] }[] = [];
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  let currentWeek: number[] = [];
  let currentMonth = -1;

  // Sort calendar by date
  const sorted = [...calendar].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  sorted.forEach((day, idx) => {
    const date = new Date(day.date);
    const dayOfWeek = date.getDay();
    const month = date.getMonth();

    // If we've moved to a new week (Sunday), finalize the previous week
    if (dayOfWeek === 0 && currentWeek.length > 0) {
      weeks.push({
        monthLabel: currentMonth !== month ? dayNames[0] : '',
        days: currentWeek,
      });
      currentWeek = [];
    }

    // Fill in gaps if needed (if this isn't the first entry and we're not at the start of week)
    while (currentWeek.length < dayOfWeek) {
      currentWeek.push(0);
    }

    // Quantize contribution count to 0-4 scale (matching GitHub's algorithm)
    let level = 0;
    if (day.count > 0) {
      // Simple quantization - adjust thresholds as needed
      if (day.count <= 2) level = 1;
      else if (day.count <= 5) level = 2;
      else if (day.count <= 10) level = 3;
      else level = 4;
    }

    currentWeek.push(level);
    currentMonth = month;

    // If this is Saturday, finalize the week
    if (dayOfWeek === 6 || idx === sorted.length - 1) {
      // Pad week to 7 days if needed
      while (currentWeek.length < 7) {
        currentWeek.push(0);
      }
      weeks.push({
        monthLabel: currentMonth !== month ? dayNames[dayOfWeek] : '',
        days: currentWeek,
      });
      currentWeek = [];
    }
  });

  return weeks;
}

const ClassicLayout = forwardRef<HTMLDivElement, LayoutProps>(({ userData, funMessage, theme, isExport = false }, ref) => {
  const { classes } = theme;
  const isRetro = theme.name === 'Retro';
  const isSpace = theme.name === 'Space';
  const isSunset = theme.name === 'Sunset';
  
  // Build heatmap weeks from flat calendar
  const heatmapWeeks = useMemo(() => buildHeatmapWeeks(userData.contributionCalendar), [userData.contributionCalendar]);
  
  // Compute "other" contributions that GitHub counts but we don't list explicitly
  const otherCount = Math.max(
    0,
    userData.totalContributions - (
      userData.totalCommits + userData.totalPRs + userData.totalIssues + userData.totalPRReviews
    )
  );
  const topRepo = userData.topRepos?.[0];
  const hasTopRepo = Boolean(topRepo);

  const languageCardSizing = isExport
    ? {
        wrapper: 'p-3 py-4 sm:px-5 sm:py-6 rounded-2xl sm:rounded-[24px] min-h-[10.25rem] sm:min-h-[13rem]',
        contentGap: 'gap-2',
        headerSpacing: 'mb-3 sm:mb-3.5',
        labelGap: 'gap-3 sm:gap-4',
        dotSize: 'w-3.5 h-3.5 sm:w-4 sm:h-4',
        nameSize: 'text-xl sm:text-xl',
        badgePadding: 'px-2 sm:px-3 py-0.5 sm:py-0.75',
        badgeText: 'text-sm sm:text-base',
        percentSize: 'text-[2.5rem] sm:text-[3.5rem] md:text-[4.25rem] mb-2 sm:mb-2.5',
        percentContainerSpacing: 'space-y-3 sm:space-y-3.5',
        progressHeight: 'h-1.5 sm:h-2'
      }
    : {
        wrapper: 'p-2 py-3 sm:px-5 sm:py-5 rounded-xl sm:rounded-2xl min-h-[6.5rem] sm:min-h-[8rem]',
        contentGap: '',
        headerSpacing: 'mb-2 sm:mb-3',
        labelGap: 'gap-1.5 sm:gap-2',
        dotSize: 'w-2.5 h-2.5 sm:w-3 sm:h-3',
        nameSize: 'text-sm sm:text-sm',
        badgePadding: 'px-1.5 sm:px-2 py-0.5',
        badgeText: 'text-xs sm:text-sm',
        percentSize: 'text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3',
        percentContainerSpacing: '',
        progressHeight: 'h-1.5'
      };

  const Heatmap: React.FC<{ weeks: { monthLabel: string; days: number[] }[] }> = ({ weeks }) => {
    const normalizedWeeks = weeks.length > 0
      ? weeks
      : Array.from({ length: 52 }, () => ({ monthLabel: '', days: Array(7).fill(0) }));
    const totalWeeks = normalizedWeeks.length;
    const flattened = normalizedWeeks.flatMap(week => week.days);
    const weekdayLabels = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

    return (
      <div>
        {/* Month labels */}
        <div className="flex mb-1 pl-10">
          <div
            className="grid gap-[2px] w-full"
            style={{ gridTemplateColumns: `repeat(${totalWeeks}, minmax(0, 1fr))` }}
          >
            {normalizedWeeks.map((week, idx) => (
              <div key={`month-${idx}`} className={`text-[0.5625rem] ${classes.textSecondary}`}>
                {week.monthLabel}
              </div>
            ))}
          </div>
        </div>
        {/* Heatmap with weekday labels */}
        <div className="flex gap-2">
          {/* Weekday labels */}
          <div className="flex flex-col justify-between text-[0.5625rem] py-3 pr-1">
            {weekdayLabels.map((label, idx) => (
              <div key={`weekday-${idx}`} className={`${classes.textSecondary} h-3 flex items-center justify-end`}>
                {label}
              </div>
            ))}
          </div>
          {/* Grid */}
          <div
            className="grid grid-flow-col gap-[2px] flex-1 p-3 rounded-xl bg-white/5 border border-white/10"
            style={{
              gridTemplateColumns: `repeat(${totalWeeks}, minmax(0, 1fr))`,
              gridTemplateRows: 'repeat(7, minmax(0, 1fr))',
            }}
          >
            {flattened.map((level, i) => (
              <div
                key={`cell-${i}`}
                className={`rounded-[1px] w-full h-full ${level > 0 ? classes.heatmapColors[level] : classes.heatmapColors[0]} transition-colors`}
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      ref={ref}
  className={`relative w-full h-full flex flex-col font-sans ${classes.bg} ${classes.textPrimary} transition-all duration-500 overflow-y-visible ${
        isExport ? 'export-mode' : ''
      }`}
    >
      {/* Retro LCD scan lines overlay */}
      {isRetro && (
        <>
          {/* Horizontal scan lines */}
          <div 
            className="absolute inset-0 pointer-events-none z-50"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.15) 0px, transparent 1px, transparent 2px, rgba(0, 0, 0, 0.15) 3px)',
              backgroundSize: '100% 4px',
            }}
          />
          {/* Subtle CRT curvature vignette */}
          <div 
            className="absolute inset-0 pointer-events-none z-40"
            style={{
              background: 'radial-gradient(ellipse at center, transparent 0%, transparent 70%, rgba(0, 0, 0, 0.3) 100%)',
              boxShadow: 'inset 0 0 100px rgba(0, 0, 0, 0.5)'
            }}
          />
        </>
      )}
      
      {/* Space theme: Starfield particles */}
      {isSpace && (
        <>
          {/* Animated stars */}
          <div 
            className="absolute inset-0 pointer-events-none z-0"
            style={{
              backgroundImage: `
                radial-gradient(2px 2px at 20% 30%, white, transparent),
                radial-gradient(2px 2px at 60% 70%, white, transparent),
                radial-gradient(1px 1px at 50% 50%, white, transparent),
                radial-gradient(1px 1px at 80% 10%, white, transparent),
                radial-gradient(2px 2px at 90% 60%, white, transparent),
                radial-gradient(1px 1px at 33% 80%, white, transparent),
                radial-gradient(1px 1px at 15% 15%, white, transparent)
              `,
              backgroundSize: '200% 200%',
              backgroundPosition: '0% 0%',
              opacity: 0.4,
              animation: 'twinkle 20s ease-in-out infinite'
            }}
          />
          {/* Subtle blue glow effect */}
          <div 
            className="absolute inset-0 pointer-events-none z-0"
            style={{
              background: 'radial-gradient(ellipse at top, rgba(34, 211, 238, 0.15) 0%, transparent 50%)',
            }}
          />
        </>
      )}
      
      {/* Sunset theme: Warm gradient overlay */}
      {isSunset && (
        <>
          {/* Soft light rays */}
          <div 
            className="absolute inset-0 pointer-events-none z-0"
            style={{
              background: `
                radial-gradient(ellipse at 80% 20%, rgba(251, 146, 60, 0.15) 0%, transparent 50%),
                radial-gradient(ellipse at 20% 80%, rgba(251, 191, 36, 0.1) 0%, transparent 50%)
              `,
            }}
          />
          {/* Subtle warm glow */}
          <div 
            className="absolute inset-0 pointer-events-none z-0"
            style={{
              boxShadow: 'inset 0 0 150px rgba(251, 146, 60, 0.08)'
            }}
          />
        </>
      )}
      
      {/* Subtle theme background image (non-interactive) */}
      {classes.bgImage && theme.name !== 'Minimal' && (
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            backgroundImage: `url(${classes.bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.06,
            filter: 'brightness(0.9) saturate(0.9)'
          }}
        />
      )}
      {/* Mobile-first responsive padding */}
      <div className="p-4 sm:p-6 md:p-8 flex flex-col h-full w-full">
      {/* Decorative corner elements - hidden on mobile */}
  <div className={`${isExport ? 'block' : 'hidden sm:block'} absolute top-0 left-0 w-32 h-32 ${classes.accent} opacity-[0.05] rounded-br-full`}></div>
  <div className={`${isExport ? 'block' : 'hidden sm:block'} absolute bottom-0 right-0 w-32 h-32 ${classes.accent} opacity-[0.05] rounded-tl-full`}></div>
      
      <div className="relative z-10 flex flex-col h-full">
        {/* Header - Completely redesigned for mobile */}
        <header className="pb-3 sm:pb-6 border-b border-white/10">
          {/* Mobile: Centered avatar with name below */}
          <div className={`${isExport ? 'hidden' : 'flex'} sm:hidden flex-col items-center text-center gap-2 mb-3`}>
            <div className="relative">
              <img 
                src={userData.avatarUrl} 
                alt={userData.login} 
                crossOrigin="anonymous" 
                className="w-16 h-16 rounded-2xl shadow-xl ring-2 ring-white/10" 
              />
              <div className={`absolute -bottom-1 -right-1 px-1.5 py-0.5 ${classes.accent.replace('text-', 'bg-')} text-white text-[0.625rem] font-bold rounded-full`}>
                {userData.githubAnniversary}Y
              </div>
            </div>
            <div>
              <h1 className={`text-xl font-bold ${classes.highlight} tracking-tight`}>{userData.name}</h1>
              <p className={`text-sm ${classes.textSecondary} mt-0.5`}>@{userData.login}</p>
            </div>
          </div>
          
          {/* Mobile: Year badge below profile */}
          <div className={`${isExport ? 'hidden' : 'flex'} sm:hidden justify-center`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
              <div className={`text-3xl font-black ${classes.accent} leading-none`}>2025</div>
              <div className={`text-xs font-semibold ${classes.textSecondary} tracking-wider uppercase`}>GitWrap</div>
            </div>
          </div>

          {/* Desktop: Original horizontal layout */}
          <div className={`${isExport ? 'flex' : 'hidden sm:flex'} items-center justify-between`}>
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="relative">
                <img 
                  src={userData.avatarUrl} 
                  alt={userData.login} 
                  crossOrigin="anonymous" 
                  className="w-14 h-14 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl shadow-xl ring-2 sm:ring-4 ring-white/10" 
                />
                <div className={`absolute -bottom-1 sm:-bottom-2 -right-1 sm:-right-2 px-1.5 sm:px-2 py-0.5 ${classes.accent.replace('text-', 'bg-')} text-white text-[0.625rem] sm:text-xs font-bold rounded-full`}>
                  {userData.githubAnniversary}Y
                </div>
              </div>
              <div>
                <h1 className={`text-xl sm:text-2xl md:text-3xl font-bold ${classes.highlight} tracking-tight`}>{userData.name}</h1>
                <p className={`text-sm sm:text-base ${classes.textSecondary} mt-0.5 sm:mt-1`}>@{userData.login}</p>
              </div>
            </div>
            <div className="text-center px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl bg-white/5 border border-white/10">
              <div className={`text-3xl sm:text-4xl md:text-5xl font-black ${classes.accent} leading-none`}>2025</div>
              <div className={`text-[0.625rem] sm:text-xs font-semibold ${classes.textSecondary} tracking-widest uppercase mt-0.5 sm:mt-1`}>Year in Review</div>
            </div>
          </div>
        </header>

        {/* Main Content - Mobile-first redesign */}
        <main className="flex-grow mt-3 sm:mt-6 flex flex-col gap-2 sm:gap-4">
          
            {/* Mobile: Single column big number showcase */}
          <div className={`${isExport ? 'hidden' : ''} sm:hidden`}>
            {/* Hero Number - Total Contributions */}
            <div className={`relative p-4 rounded-2xl bg-gradient-to-br from-white/10 via-white/5 to-transparent overflow-hidden mb-2 ${
              isRetro ? 'border-2 border-cyan-400/50 shadow-[0_0_20px_rgba(34,211,238,0.3)]' :
              isSpace ? 'border border-cyan-400/30 shadow-[0_0_15px_rgba(34,211,238,0.2)]' :
              isSunset ? 'border border-orange-400/30 shadow-[0_0_15px_rgba(251,146,60,0.2)]' :
              'border border-white/10'
            }`}>
              <div className="text-center">
                <div className={`text-xs font-semibold ${classes.textSecondary} uppercase tracking-wider mb-2`}>Total Contributions</div>
                <div className={`text-5xl font-black ${classes.accent} mb-3`}>
                  {userData.totalContributions.toLocaleString()}
                </div>
                <div className="flex justify-center items-center gap-3 text-xs">
                  <span className={classes.textSecondary}>💜 {userData.totalCommits.toLocaleString()}</span>
                  <span className={classes.textSecondary}>•</span>
                  <span className={classes.textSecondary}>💙 {userData.totalPRs}</span>
                  <span className={classes.textSecondary}>•</span>
                  <span className={classes.textSecondary}>💚 {userData.totalIssues}</span>
                  <span className={classes.textSecondary}>•</span>
                  <span className={classes.textSecondary}>👀 {userData.totalPRReviews}</span>
                  {otherCount > 0 && (
                    <>
                      <span className={classes.textSecondary}>•</span>
                      <span className={classes.textSecondary}>✨ {otherCount}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile: 2x2 Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div className={`p-3 rounded-xl bg-gradient-to-br from-orange-500/15 to-pink-500/10 text-center ${
                isRetro ? 'border-2 border-pink-400/50 shadow-[0_0_15px_rgba(236,72,153,0.3)]' :
                isSpace ? 'border border-cyan-400/20 shadow-[0_0_10px_rgba(34,211,238,0.15)]' :
                isSunset ? 'border border-orange-400/30 shadow-[0_0_10px_rgba(251,146,60,0.2)]' :
                'border border-orange-400/20'
              }`}>
                <div className="text-2xl mb-1">⏰</div>
                <div className={`text-2xl font-black ${classes.highlight}`}>{userData.bestHour}:00</div>
                <div className={`text-[0.625rem] ${classes.textSecondary} uppercase mt-1`}>Best Hour</div>
              </div>
              
              <div className={`p-3 rounded-xl bg-gradient-to-br from-cyan-500/15 to-blue-500/10 text-center ${
                isRetro ? 'border-2 border-cyan-400/50 shadow-[0_0_15px_rgba(34,211,238,0.3)]' :
                isSpace ? 'border border-cyan-400/30 shadow-[0_0_10px_rgba(34,211,238,0.15)]' :
                isSunset ? 'border border-orange-400/30 shadow-[0_0_10px_rgba(251,146,60,0.2)]' :
                'border border-cyan-400/20'
              }`}>
                <div className="text-2xl mb-1">👀</div>
                <div className={`text-2xl font-black ${classes.highlight}`}>{userData.totalPRReviews}</div>
                <div className={`text-[0.625rem] ${classes.textSecondary} uppercase mt-1`}>Reviews</div>
              </div>
              
              <div className={`p-3 rounded-xl bg-gradient-to-br from-yellow-500/15 to-amber-500/10 text-center ${
                isRetro ? 'border-2 border-yellow-400/50 shadow-[0_0_15px_rgba(250,204,21,0.3)]' :
                isSpace ? 'border border-cyan-400/20 shadow-[0_0_10px_rgba(34,211,238,0.15)]' :
                isSunset ? 'border border-amber-400/30 shadow-[0_0_10px_rgba(251,191,36,0.2)]' :
                'border border-yellow-400/20'
              }`}>
                <div className="text-2xl mb-1">⭐</div>
                <div className={`text-2xl font-black ${classes.highlight}`}>{userData.totalStarsGiven}</div>
                <div className={`text-[0.625rem] ${classes.textSecondary} uppercase mt-1`}>Stars Given</div>
              </div>
              
              <div className={`p-3 rounded-xl bg-gradient-to-br from-purple-500/15 to-indigo-500/10 text-center ${
                isRetro ? 'border-2 border-fuchsia-400/50 shadow-[0_0_15px_rgba(232,121,249,0.3)]' :
                isSpace ? 'border border-cyan-400/20 shadow-[0_0_10px_rgba(34,211,238,0.15)]' :
                isSunset ? 'border border-orange-400/30 shadow-[0_0_10px_rgba(251,146,60,0.2)]' :
                'border border-purple-400/20'
              }`}>
                <div className="text-2xl mb-1">🔥</div>
                <div className={`text-2xl font-black ${classes.highlight}`}>{userData.longestStreakDays}</div>
                <div className={`text-[0.625rem] ${classes.textSecondary} uppercase mt-1`}>Day Streak</div>
              </div>
            </div>
          </div>

          {/* Desktop: Original layout */}
          <div className={`${isExport ? 'grid' : 'hidden sm:grid'} grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4`}>
            {/* Left: Main Contribution Metric */}
            <div className={`relative p-3 sm:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-white/10 via-white/5 to-transparent overflow-hidden ${
              isRetro ? 'border-2 border-cyan-400/50 shadow-[0_0_25px_rgba(34,211,238,0.4)]' :
              isSpace ? 'border border-cyan-400/30 shadow-[0_0_20px_rgba(34,211,238,0.25)]' :
              isSunset ? 'border border-orange-400/30 shadow-[0_0_20px_rgba(251,146,60,0.25)]' :
              'border border-white/10'
            }`}>
              <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-purple-500/20 to-transparent rounded-bl-full blur-2xl"></div>
              <div className="relative z-10">
                <div className={`text-xs sm:text-sm font-semibold ${classes.textSecondary} uppercase tracking-wider mb-1 sm:mb-3`}>Total Contributions</div>
                <div className={`${isExport ? 'text-6xl sm:text-7xl md:text-8xl' : 'text-5xl sm:text-6xl md:text-7xl'} font-black ${classes.accent} mb-1 sm:mb-2`}>
                  {userData.totalContributions.toLocaleString()}
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 sm:mt-4">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                    <span className={`text-sm sm:text-base ${classes.textSecondary}`}>{userData.totalCommits.toLocaleString()} commits</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                    <span className={`text-sm sm:text-base ${classes.textSecondary}`}>{userData.totalPRs} PRs</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                    <span className={`text-sm sm:text-base ${classes.textSecondary}`}>{userData.totalIssues} issues</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="w-2 h-2 rounded-full bg-pink-400"></div>
                    <span className={`text-sm sm:text-base ${classes.textSecondary}`}>{userData.totalPRReviews} reviews</span>
                  </div>
                  {otherCount > 0 && (
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                      <span className={`text-sm sm:text-base ${classes.textSecondary}`}>{otherCount} other</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Split Stats */}
            <div className="grid grid-rows-2 gap-2 sm:gap-4">
              <div className={`p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-orange-500/10 to-pink-500/10 ${
                isRetro ? 'border-2 border-pink-400/50 shadow-[0_0_20px_rgba(236,72,153,0.3)]' :
                isSpace ? 'border border-cyan-400/30 shadow-[0_0_15px_rgba(34,211,238,0.2)]' :
                isSunset ? 'border border-orange-400/30 shadow-[0_0_15px_rgba(251,146,60,0.25)]' :
                'border border-orange-400/20'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className={`text-[0.625rem] sm:text-xs font-semibold ${classes.textSecondary} uppercase tracking-wider mb-1`}>Best Hour</div>
                    <div className={`text-3xl sm:text-4xl font-black ${classes.highlight}`}>{userData.bestHour}:00</div>
                    <div className={`text-[0.625rem] sm:text-xs ${classes.textSecondary} mt-1`}>peak coding time</div>
                  </div>
                  <div className="text-3xl sm:text-4xl md:text-5xl">⏰</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:gap-4">
                <div className={`p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 ${
                  isRetro ? 'border-2 border-cyan-400/50 shadow-[0_0_20px_rgba(34,211,238,0.3)]' :
                  isSpace ? 'border border-cyan-400/30 shadow-[0_0_15px_rgba(34,211,238,0.2)]' :
                  isSunset ? 'border border-orange-400/30 shadow-[0_0_15px_rgba(251,146,60,0.2)]' :
                  'border border-cyan-400/20'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className={`text-[0.625rem] sm:text-xs font-semibold ${classes.textSecondary} uppercase tracking-wider mb-1`}>Reviews</div>
                      <div className={`text-2xl sm:text-4xl font-black ${classes.highlight}`}>{userData.totalPRReviews}</div>
                      <div className={`text-[0.625rem] sm:text-xs ${classes.textSecondary} mt-1`}>code reviews</div>
                    </div>
                    <div className="text-3xl sm:text-4xl md:text-5xl">👀</div>
                  </div>
                </div>
                <div className={`p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-yellow-500/10 to-amber-500/10 ${
                  isRetro ? 'border-2 border-yellow-400/50 shadow-[0_0_20px_rgba(250,204,21,0.3)]' :
                  isSpace ? 'border border-cyan-400/30 shadow-[0_0_15px_rgba(34,211,238,0.2)]' :
                  isSunset ? 'border border-amber-400/30 shadow-[0_0_15px_rgba(251,191,36,0.25)]' :
                  'border border-yellow-400/20'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className={`text-[0.625rem] sm:text-xs font-semibold ${classes.textSecondary} uppercase tracking-wider mb-1`}>Stars</div>
                      <div className={`text-2xl sm:text-4xl font-black ${classes.highlight}`}>{userData.totalStarsGiven}</div>
                      <div className={`text-[0.625rem] sm:text-xs ${classes.textSecondary} mt-1`}>given</div>
                    </div>
                    <div className="text-3xl sm:text-4xl md:text-5xl">⭐</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile: Top Language Pills */}
          <div className={`${isExport ? 'hidden' : ''} sm:hidden`}>
            <h3 className={`text-xs font-bold uppercase tracking-wider mb-2 ${classes.accent}`}>Top Languages</h3>
            <div className="flex flex-col gap-2">
              {userData.topLanguages.slice(0, 3).map((lang, idx) => (
                <div key={lang.name} className="flex items-center gap-3 p-2 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg" style={{ backgroundColor: `${lang.color}20` }}>
                    <span className="text-lg" style={{ filter: `drop-shadow(0 0 8px ${lang.color})` }}>#{idx + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm font-bold ${classes.textPrimary} truncate`}>{lang.name}</span>
                      <span className={`text-lg font-black ${classes.highlight} ml-2`}>{lang.percent.toFixed(1)}%</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${lang.percent}%`, backgroundColor: lang.color || '#cccccc' }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop: Original Language Cards */}
          <div className={`${isExport ? 'grid gap-3 sm:gap-4' : 'hidden sm:grid gap-2'} grid-cols-2 sm:grid-cols-3`}>
            {userData.topLanguages.map((lang, idx) => (
              <div
                key={lang.name}
                className={`relative group bg-white/5 transition-all duration-300 flex flex-col ${languageCardSizing.wrapper} ${
                  isRetro
                    ? 'border-2 border-purple-400/50 hover:border-fuchsia-400/70 shadow-[0_0_15px_rgba(192,132,252,0.3)] hover:shadow-[0_0_25px_rgba(232,121,249,0.5)]'
                    : isSpace
                    ? 'border border-cyan-400/20 hover:border-cyan-400/40 shadow-[0_0_12px_rgba(34,211,238,0.2)] hover:shadow-[0_0_20px_rgba(34,211,238,0.35)]'
                    : isSunset
                    ? 'border border-orange-400/20 hover:border-orange-400/40 shadow-[0_0_12px_rgba(251,146,60,0.2)] hover:shadow-[0_0_20px_rgba(251,146,60,0.35)]'
                    : 'border border-white/10 hover:border-white/20'
                }`}
              >
                <div className="absolute inset-0 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: `radial-gradient(circle at 50% 0%, ${lang.color}15, transparent 70%)` }}></div>
                    <div className={`relative z-10 flex-1 flex flex-col justify-between ${languageCardSizing.contentGap}`}>
                      <div className={`flex items-center justify-between ${languageCardSizing.headerSpacing}`}>
                        <div className={`flex items-center ${languageCardSizing.labelGap}`}>
                          <div className={`${languageCardSizing.dotSize} rounded-full`} style={{ backgroundColor: lang.color || '#cccccc', boxShadow: `0 0 10px ${lang.color}60` }}></div>
                          <span className={`${languageCardSizing.nameSize} font-bold ${classes.textPrimary}`}>{lang.name}</span>
                        </div>
                        <div className={`${languageCardSizing.badgePadding} rounded-full ${languageCardSizing.badgeText} font-black ${classes.highlight}`} style={{ backgroundColor: `${lang.color}20` }}>
                          #{idx + 1}
                        </div>
                      </div>
                      <div className={languageCardSizing.percentContainerSpacing}>
                        <div className={`${languageCardSizing.percentSize} font-black ${classes.accent}`}>{lang.percent.toFixed(1)}%</div>
                        <div className={`w-full ${languageCardSizing.progressHeight} bg-white/10 rounded-full overflow-hidden`}>
                          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${lang.percent}%`, backgroundColor: lang.color || '#cccccc' }}></div>
                        </div>
                      </div>
                    </div>
              </div>
            ))}
          </div>

          {/* Mobile: Compact Activity List */}
          <div className={`${isExport ? 'hidden' : ''} sm:hidden`}>
            <h3 className={`text-xs font-bold uppercase tracking-wider mb-2 ${classes.accent}`}>Activity Highlights</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center gap-2">
                  <div className="text-xl">📅</div>
                  <span className={`text-xs ${classes.textSecondary}`}>Most Active Day</span>
                </div>
                <span className={`text-sm font-bold ${classes.highlight}`}>{userData.bestDayOfWeek}</span>
              </div>
              
              <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center gap-2">
                  <div className="text-xl">📦</div>
                  <span className={`text-xs ${classes.textSecondary}`}>Total Repositories</span>
                </div>
                <span className={`text-sm font-bold ${classes.highlight}`}>{userData.totalRepositories}</span>
              </div>
              
              <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center gap-2">
                  <div className="text-xl">{userData.yearOverYearGrowth?.overallGrowth ?? 0 >= 0 ? '📈' : '📉'}</div>
                  <span className={`text-xs ${classes.textSecondary}`}>Year over Year</span>
                </div>
                <span className={`text-sm font-bold ${userData.yearOverYearGrowth?.overallGrowth ?? 0 >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {userData.yearOverYearGrowth?.overallGrowth ?? 0 >= 0 ? '+' : ''}{userData.yearOverYearGrowth?.overallGrowth ?? 0}%
                </span>
              </div>
            </div>
          </div>

          {/* Desktop: Original Activity Grid */}
          <div className={`${isExport ? 'grid' : 'hidden sm:grid'} grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3`}>
            <div className={`p-2 sm:p-4 rounded-lg sm:rounded-xl bg-gradient-to-br from-purple-500/15 via-purple-500/10 to-transparent ${
              isRetro ? 'border-2 border-purple-400/50 shadow-[0_0_15px_rgba(168,85,247,0.3)]' :
              isSpace ? 'border border-cyan-400/25 shadow-[0_0_12px_rgba(34,211,238,0.2)]' :
              isSunset ? 'border border-orange-400/25 shadow-[0_0_12px_rgba(251,146,60,0.2)]' :
              'border border-purple-400/30'
            }`}>
              <div className="flex items-center justify-between mb-1 sm:mb-3">
                <CommitIcon className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                <div className="text-xl sm:text-2xl md:text-3xl">🔥</div>
              </div>
              <div className={`text-[0.625rem] sm:text-xs font-semibold ${classes.textSecondary} uppercase tracking-wider mb-1`}>Streak</div>
              <div className={`text-2xl sm:text-3xl font-black ${classes.highlight}`}>{userData.longestStreakDays}</div>
              <div className={`text-[0.625rem] sm:text-xs ${classes.textSecondary} mt-1`}>days</div>
            </div>

            <div className={`p-2 sm:p-4 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-500/15 via-blue-500/10 to-transparent ${
              isRetro ? 'border-2 border-cyan-400/50 shadow-[0_0_15px_rgba(34,211,238,0.3)]' :
              isSpace ? 'border border-cyan-400/30 shadow-[0_0_12px_rgba(34,211,238,0.2)]' :
              isSunset ? 'border border-orange-400/25 shadow-[0_0_12px_rgba(251,146,60,0.2)]' :
              'border border-blue-400/30'
            }`}>
              <div className="flex items-center justify-between mb-1 sm:mb-3">
                <PRIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                <div className="text-xl sm:text-2xl md:text-3xl">📅</div>
              </div>
              <div className={`text-[0.625rem] sm:text-xs font-semibold ${classes.textSecondary} uppercase tracking-wider mb-1`}>Peak Day</div>
              <div className={`text-xl sm:text-2xl font-black ${classes.highlight}`}>{userData.bestDayOfWeek.slice(0, 3)}</div>
              <div className={`text-[0.625rem] sm:text-xs ${classes.textSecondary} mt-1`}>most active</div>
            </div>

            <div className={`p-2 sm:p-4 rounded-lg sm:rounded-xl bg-gradient-to-br from-green-500/15 via-green-500/10 to-transparent ${
              isRetro ? 'border-2 border-pink-400/50 shadow-[0_0_15px_rgba(236,72,153,0.3)]' :
              isSpace ? 'border border-cyan-400/25 shadow-[0_0_12px_rgba(34,211,238,0.2)]' :
              isSunset ? 'border border-orange-400/25 shadow-[0_0_12px_rgba(251,146,60,0.2)]' :
              'border border-green-400/30'
            }`}>
              <div className="flex items-center justify-between mb-1 sm:mb-3">
                <IssueIcon className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
                <div className="text-xl sm:text-2xl md:text-3xl">📦</div>
              </div>
              <div className={`text-[0.625rem] sm:text-xs font-semibold ${classes.textSecondary} uppercase tracking-wider mb-1`}>Repos</div>
              <div className={`text-2xl sm:text-3xl font-black ${classes.highlight}`}>{userData.totalRepositories}</div>
              <div className={`text-[0.625rem] sm:text-xs ${classes.textSecondary} mt-1`}>projects</div>
            </div>

            <div className={`p-2 sm:p-4 rounded-lg sm:rounded-xl bg-gradient-to-br from-pink-500/15 via-pink-500/10 to-transparent ${
              isRetro ? 'border-2 border-yellow-400/50 shadow-[0_0_15px_rgba(250,204,21,0.3)]' :
              isSpace ? 'border border-cyan-400/25 shadow-[0_0_12px_rgba(34,211,238,0.2)]' :
              isSunset ? 'border border-orange-400/25 shadow-[0_0_12px_rgba(251,146,60,0.2)]' :
              'border border-pink-400/30'
            }`}>
              <div className="flex items-center justify-between mb-1 sm:mb-3">
                <ReviewIcon className="w-5 h-5 sm:w-6 sm:h-6 text-pink-400" />
                <div className="text-xl sm:text-2xl md:text-3xl">{userData.yearOverYearGrowth?.overallGrowth ?? 0 >= 0 ? '📈' : '📉'}</div>
              </div>
              <div className={`text-[0.625rem] sm:text-xs font-semibold ${classes.textSecondary} uppercase tracking-wider mb-1`}>Growth</div>
              <div className={`text-2xl sm:text-3xl font-black ${userData.yearOverYearGrowth?.overallGrowth ?? 0 >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {userData.yearOverYearGrowth?.overallGrowth ?? 0 >= 0 ? '+' : ''}{userData.yearOverYearGrowth?.overallGrowth ?? 0}%
              </div>
              <div className={`text-[0.625rem] sm:text-xs ${classes.textSecondary} mt-1`}>vs 2024</div>
            </div>
          </div>

          {/* Top Repository Spotlight */}
          <div className={`relative p-3 sm:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-red-500/10 overflow-hidden ${
            isRetro ? 'border-2 border-yellow-400/50 shadow-[0_0_25px_rgba(250,204,21,0.4)]' :
            isSpace ? 'border border-cyan-400/30 shadow-[0_0_20px_rgba(34,211,238,0.25)]' :
            isSunset ? 'border border-orange-400/30 shadow-[0_0_20px_rgba(251,146,60,0.3)]' :
            'border border-yellow-400/30'
          }`}>
            <div className="absolute top-0 right-0 w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-br from-yellow-500/20 to-transparent rounded-bl-full blur-3xl"></div>
            <div className="relative z-10">
              {/* Mobile: Centered layout */}
              <div className={`${isExport ? 'hidden' : ''} sm:hidden text-center`}>
                <div className="text-4xl mb-2">{hasTopRepo ? '🏆' : '🚀'}</div>
                <div className={`text-[0.625rem] font-semibold ${classes.textSecondary} uppercase tracking-wider mb-1`}>
                  {hasTopRepo ? 'Top Repository' : 'Future Top Repository'}
                </div>
                {hasTopRepo ? (
                  <>
                    <div className={`text-lg font-black ${classes.highlight} mb-2 truncate`}>{topRepo!.name}</div>
                    <div className="flex justify-center items-center gap-3 text-xs">
                      <span className={classes.textSecondary}>{topRepo!.contributions} commits</span>
                      <span className={classes.textSecondary}>•</span>
                      <span className={classes.textSecondary}>{topRepo!.stargazers} stars</span>
                    </div>
                  </>
                ) : (
                  <p className={`text-xs ${classes.textSecondary} leading-relaxed`}>
                    Launch something bold, rack up a few commits, and we&apos;ll spotlight it here.
                  </p>
                )}
              </div>
              
              {/* Desktop / Export layout */}
              <div className={`${isExport ? 'flex' : 'hidden sm:flex'} items-center justify-between gap-3`}>
                <div className="flex-1 min-w-0">
                  <div className={`text-[0.625rem] sm:text-xs font-semibold ${classes.textSecondary} uppercase tracking-wider mb-1 sm:mb-2`}>
                    {hasTopRepo ? '⭐ Top Repository' : '⭐ Waiting for Your Top Repo' }
                  </div>
                  <div className={`text-lg sm:text-xl md:text-2xl font-black ${classes.highlight} mb-1 truncate`}>
                    {hasTopRepo ? topRepo!.name : 'Ship a repo worthy of the spotlight'}
                  </div>
                  {hasTopRepo ? (
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                      <span className={classes.textSecondary}>{topRepo!.contributions} commits</span>
                      <span className={classes.textSecondary}>•</span>
                      <span className={classes.textSecondary}>{topRepo!.stargazers} stars</span>
                    </div>
                  ) : (
                    <p className={`text-xs sm:text-sm ${classes.textSecondary} max-w-lg`}>
                      Kick off a fresh project or breathe life into an old one—once it gains momentum, it will take over this showcase automatically.
                    </p>
                  )}
                </div>
                <div className="text-3xl sm:text-5xl md:text-6xl opacity-50 flex-shrink-0">{hasTopRepo ? '🏆' : '🚀'}</div>
              </div>
            </div>
          </div>

          {/* Contribution Heatmap */}
          <div className={`p-3 sm:p-6 rounded-xl sm:rounded-2xl bg-white/5 ${
            isRetro ? 'border-2 border-fuchsia-400/50 shadow-[0_0_25px_rgba(232,121,249,0.4)]' :
            isSpace ? 'border border-cyan-400/30 shadow-[0_0_20px_rgba(34,211,238,0.25)]' :
            isSunset ? 'border border-orange-400/30 shadow-[0_0_20px_rgba(251,146,60,0.25)]' :
            'border border-white/10'
          }`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 sm:mb-4 gap-2">
              <h3 className={`text-xs sm:text-sm font-bold uppercase tracking-wider ${classes.accent}`}>2025 Activity</h3>
              <div className="flex items-center gap-1.5 sm:gap-2 text-[0.625rem] sm:text-xs">
                <span className={classes.textSecondary}>Less</span>
                <div className="flex items-center gap-0.5 sm:gap-1">
                  {[0, 1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-sm ${classes.heatmapColors[level]}`}
                      title={`Level ${level}`}
                    />
                  ))}
                </div>
                <span className={classes.textSecondary}>More</span>
              </div>
            </div>
            {/* Mobile: Show simplified heatmap or message */}
            <div className={`${isExport ? 'hidden' : ''} sm:hidden text-center py-4`}>
              <div className={`text-xs ${classes.textSecondary} italic`}>View on desktop for full contribution calendar</div>
            </div>
            {/* Desktop: Full heatmap */}
            <div className={`${isExport ? 'block' : 'hidden sm:block'}`}>
              <Heatmap weeks={heatmapWeeks} />
            </div>
          </div>

          {/* Fun Message - Redesigned */}
          <div className={`relative p-3 sm:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-white/10 to-white/5 overflow-hidden ${
            isRetro ? 'border-2 border-cyan-400/50 shadow-[0_0_20px_rgba(34,211,238,0.3)]' :
            isSpace ? 'border border-cyan-400/30 shadow-[0_0_15px_rgba(34,211,238,0.2)]' :
            isSunset ? 'border border-orange-400/30 shadow-[0_0_15px_rgba(251,146,60,0.2)]' :
            'border border-white/10'
          }`}>
            <div className="absolute top-0 left-0 w-full h-full opacity-5">
              <div className="absolute top-2 sm:top-4 left-2 sm:left-4">✨</div>
              <div className="absolute top-4 sm:top-8 right-6 sm:right-12">⭐</div>
              <div className="absolute bottom-3 sm:bottom-6 left-6 sm:left-12">💫</div>
              <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4">🌟</div>
            </div>
            <div className="relative z-10">
              {/* Mobile: Centered with icon above */}
              <div className={`${isExport ? 'hidden' : ''} sm:hidden text-center`}>
                <SparklesIcon className={`w-8 h-8 mx-auto mb-2 ${classes.accent}`} />
                <p className={`text-sm leading-relaxed font-medium ${classes.textPrimary}`}>{funMessage}</p>
              </div>
              {/* Desktop: Icon on left */}
              <div className={`${isExport ? 'flex' : 'hidden sm:flex'} gap-3 sm:gap-4`}>
                <SparklesIcon className={`w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0 ${classes.accent}`} />
                <p className={`text-sm sm:text-base md:text-lg leading-relaxed font-medium ${classes.textPrimary}`}>{funMessage}</p>
              </div>
            </div>
          </div>
        </main>
        
        {/* Footer */}
  <footer className={`mt-3 sm:mt-5 pt-2 sm:pt-4 text-center text-[0.625rem] sm:text-xs ${classes.textSecondary} tracking-wider border-t border-white/10`}>
          Powered by <span className={classes.accent}>GitWrap</span> • 2025
        </footer>
      </div>
      </div>
    </div>
  );
});

export default ClassicLayout;