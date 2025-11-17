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

const ClassicLayout = forwardRef<HTMLDivElement, LayoutProps>(({ userData, funMessage, theme }, ref) => {
  const { classes } = theme;
  
  // Build heatmap weeks from flat calendar
  const heatmapWeeks = useMemo(() => buildHeatmapWeeks(userData.contributionCalendar), [userData.contributionCalendar]);

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
              <div key={`month-${idx}`} className={`text-[9px] ${classes.textSecondary}`}>
                {week.monthLabel}
              </div>
            ))}
          </div>
        </div>
        {/* Heatmap with weekday labels */}
        <div className="flex gap-2">
          {/* Weekday labels */}
          <div className="flex flex-col justify-between text-[9px] py-3 pr-1">
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
    <div ref={ref} className={`relative w-full h-full p-8 flex flex-col font-sans ${classes.bg} ${classes.textPrimary} transition-all duration-500 overflow-hidden`}>
      {/* Decorative corner elements */}
      <div className={`absolute top-0 left-0 w-32 h-32 ${classes.accent} opacity-[0.05] rounded-br-full`}></div>
      <div className={`absolute bottom-0 right-0 w-32 h-32 ${classes.accent} opacity-[0.05] rounded-tl-full`}></div>
      
      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <header className="flex items-center justify-between pb-6 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img 
                src={userData.avatarUrl} 
                alt={userData.login} 
                crossOrigin="anonymous" 
                className="w-20 h-20 rounded-2xl shadow-xl ring-4 ring-white/10" 
              />
              <div className={`absolute -bottom-2 -right-2 px-2 py-0.5 ${classes.accent.replace('text-', 'bg-')} text-white text-xs font-bold rounded-full`}>
                {userData.githubAnniversary}Y
              </div>
            </div>
            <div>
              <h1 className={`text-3xl font-bold ${classes.highlight} tracking-tight`}>{userData.name}</h1>
              <p className={`text-base ${classes.textSecondary} mt-1`}>@{userData.login}</p>
            </div>
          </div>
          <div className="text-center px-6 py-3 rounded-xl bg-white/5 border border-white/10">
            <div className={`text-5xl font-black ${classes.accent} leading-none`}>2025</div>
            <div className={`text-xs font-semibold ${classes.textSecondary} tracking-widest uppercase mt-1`}>Year in Review</div>
          </div>
        </header>

        {/* Main Content - Completely Redesigned */}
        <main className="flex-grow mt-6 flex flex-col gap-4">
          {/* Hero Stats with Circular Progress */}
          <div className="grid grid-cols-2 gap-4">
            {/* Left: Main Contribution Metric */}
            <div className="relative p-6 rounded-2xl bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/10 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-transparent rounded-bl-full blur-2xl"></div>
              <div className="relative z-10">
                <div className={`text-sm font-semibold ${classes.textSecondary} uppercase tracking-wider mb-3`}>Total Contributions</div>
                <div className={`text-6xl font-black ${classes.accent} mb-2`}>
                  {(userData.totalCommits + userData.totalPRs + userData.totalIssues).toLocaleString()}
                </div>
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                    <span className={`text-sm ${classes.textSecondary}`}>{userData.totalCommits.toLocaleString()} commits</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                    <span className={`text-sm ${classes.textSecondary}`}>{userData.totalPRs} PRs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                    <span className={`text-sm ${classes.textSecondary}`}>{userData.totalIssues} issues</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Split Stats */}
            <div className="grid grid-rows-2 gap-4">
              <div className="p-5 rounded-2xl bg-gradient-to-r from-orange-500/10 to-pink-500/10 border border-orange-400/20">
                <div className="flex items-center justify-between">
                  <div>
                    <div className={`text-xs font-semibold ${classes.textSecondary} uppercase tracking-wider mb-1`}>Best Hour</div>
                    <div className={`text-4xl font-black ${classes.highlight}`}>{userData.bestHour}:00</div>
                    <div className={`text-xs ${classes.textSecondary} mt-1`}>peak coding time</div>
                  </div>
                  <div className="text-5xl">⏰</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-400/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className={`text-xs font-semibold ${classes.textSecondary} uppercase tracking-wider mb-1`}>Reviews</div>
                      <div className={`text-4xl font-black ${classes.highlight}`}>{userData.totalPRReviews}</div>
                      <div className={`text-xs ${classes.textSecondary} mt-1`}>code reviews</div>
                    </div>
                    <div className="text-5xl">👀</div>
                  </div>
                </div>
                <div className="p-5 rounded-2xl bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-400/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className={`text-xs font-semibold ${classes.textSecondary} uppercase tracking-wider mb-1`}>Stars</div>
                      <div className={`text-4xl font-black ${classes.highlight}`}>{userData.totalStarsGiven}</div>
                      <div className={`text-xs ${classes.textSecondary} mt-1`}>given</div>
                    </div>
                    <div className="text-5xl">⭐</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Language Distribution - Modern Cards */}
          <div className="grid grid-cols-3 gap-3">
            {userData.topLanguages.map((lang, idx) => (
              <div key={lang.name} className="relative group p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300">
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: `radial-gradient(circle at 50% 0%, ${lang.color}15, transparent 70%)` }}></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: lang.color || '#cccccc', boxShadow: `0 0 10px ${lang.color}60` }}></div>
                      <span className={`text-sm font-bold ${classes.textPrimary}`}>{lang.name}</span>
                    </div>
                    <div className={`px-2 py-0.5 rounded-full text-xs font-black ${classes.highlight}`} style={{ backgroundColor: `${lang.color}20` }}>
                      #{idx + 1}
                    </div>
                  </div>
                  <div className={`text-5xl font-black ${classes.accent} mb-2`}>{lang.percent.toFixed(1)}%</div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${lang.percent}%`, backgroundColor: lang.color || '#cccccc' }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Activity Grid */}
          <div className="grid grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/15 via-purple-500/10 to-transparent border border-purple-400/30">
              <div className="flex items-center justify-between mb-3">
                <CommitIcon className="w-6 h-6 text-purple-400" />
                <div className="text-3xl">🔥</div>
              </div>
              <div className={`text-xs font-semibold ${classes.textSecondary} uppercase tracking-wider mb-1`}>Streak</div>
              <div className={`text-3xl font-black ${classes.highlight}`}>{userData.longestStreakDays}</div>
              <div className={`text-xs ${classes.textSecondary} mt-1`}>days</div>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/15 via-blue-500/10 to-transparent border border-blue-400/30">
              <div className="flex items-center justify-between mb-3">
                <PRIcon className="w-6 h-6 text-blue-400" />
                <div className="text-3xl">📅</div>
              </div>
              <div className={`text-xs font-semibold ${classes.textSecondary} uppercase tracking-wider mb-1`}>Peak Day</div>
              <div className={`text-2xl font-black ${classes.highlight}`}>{userData.bestDayOfWeek.slice(0, 3)}</div>
              <div className={`text-xs ${classes.textSecondary} mt-1`}>most active</div>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/15 via-green-500/10 to-transparent border border-green-400/30">
              <div className="flex items-center justify-between mb-3">
                <IssueIcon className="w-6 h-6 text-green-400" />
                <div className="text-3xl">📦</div>
              </div>
              <div className={`text-xs font-semibold ${classes.textSecondary} uppercase tracking-wider mb-1`}>Repos</div>
              <div className={`text-3xl font-black ${classes.highlight}`}>{userData.totalRepositories}</div>
              <div className={`text-xs ${classes.textSecondary} mt-1`}>projects</div>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-pink-500/15 via-pink-500/10 to-transparent border border-pink-400/30">
              <div className="flex items-center justify-between mb-3">
                <ReviewIcon className="w-6 h-6 text-pink-400" />
                <div className="text-3xl">{userData.yearOverYearGrowth?.overallGrowth ?? 0 >= 0 ? '📈' : '📉'}</div>
              </div>
              <div className={`text-xs font-semibold ${classes.textSecondary} uppercase tracking-wider mb-1`}>Growth</div>
              <div className={`text-3xl font-black ${userData.yearOverYearGrowth?.overallGrowth ?? 0 >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {userData.yearOverYearGrowth?.overallGrowth ?? 0 >= 0 ? '+' : ''}{userData.yearOverYearGrowth?.overallGrowth ?? 0}%
              </div>
              <div className={`text-xs ${classes.textSecondary} mt-1`}>vs 2024</div>
            </div>
          </div>

          {/* Top Repository Spotlight */}
          {userData.topRepos[0] && (
            <div className="relative p-6 rounded-2xl bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-red-500/10 border border-yellow-400/30 overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-yellow-500/20 to-transparent rounded-bl-full blur-3xl"></div>
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <div className={`text-xs font-semibold ${classes.textSecondary} uppercase tracking-wider mb-2`}>⭐ Top Repository</div>
                  <div className={`text-2xl font-black ${classes.highlight} mb-1`}>{userData.topRepos[0].name}</div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className={classes.textSecondary}>{userData.topRepos[0].contributions} commits</span>
                    <span className={classes.textSecondary}>•</span>
                    <span className={classes.textSecondary}>{userData.topRepos[0].stargazers} stars</span>
                  </div>
                </div>
                <div className="text-6xl opacity-50">🏆</div>
              </div>
            </div>
          )}

          {/* Contribution Heatmap */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-sm font-bold uppercase tracking-wider ${classes.accent}`}>2025 Contribution Activity</h3>
              <div className="flex items-center gap-2 text-xs">
                <span className={classes.textSecondary}>Less</span>
                <div className="flex items-center gap-1">
                  {[0, 1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`w-3 h-3 rounded-sm ${classes.heatmapColors[level]}`}
                      title={`Level ${level}`}
                    />
                  ))}
                </div>
                <span className={classes.textSecondary}>More</span>
              </div>
            </div>
            <Heatmap weeks={heatmapWeeks} />
          </div>

          {/* Fun Message - Redesigned */}
          <div className="relative p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-5">
              <div className="absolute top-4 left-4">✨</div>
              <div className="absolute top-8 right-12">⭐</div>
              <div className="absolute bottom-6 left-12">💫</div>
              <div className="absolute bottom-4 right-4">🌟</div>
            </div>
            <div className="relative z-10 flex gap-4">
              <SparklesIcon className={`w-8 h-8 flex-shrink-0 ${classes.accent}`} />
              <p className={`text-lg leading-relaxed font-medium ${classes.textPrimary}`}>{funMessage}</p>
            </div>
          </div>
        </main>
        
        {/* Footer */}
        <footer className={`mt-5 pt-4 text-center text-xs ${classes.textSecondary} tracking-wider border-t border-white/10`}>
          Powered by <span className={classes.accent}>GitWrap</span> • gitwrap.app
        </footer>
      </div>
    </div>
  );
});

export default ClassicLayout;