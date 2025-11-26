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

  const weeks: { monthLabel: string; days: number[] }[] = [];
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
        monthLabel: currentMonth !== month ? 'Mon' : '',
        days: currentWeek,
      });
      currentWeek = [];
    }

    // Fill in gaps if needed
    while (currentWeek.length < dayOfWeek) {
      currentWeek.push(0);
    }

    // Quantize contribution count to 0-4 scale
    let level = 0;
    if (day.count > 0) {
      if (day.count <= 2) level = 1;
      else if (day.count <= 5) level = 2;
      else if (day.count <= 10) level = 3;
      else level = 4;
    }

    currentWeek.push(level);
    currentMonth = month;

    // If this is Saturday or last day, finalize the week
    if (dayOfWeek === 6 || idx === sorted.length - 1) {
      while (currentWeek.length < 7) {
        currentWeek.push(0);
      }
      weeks.push({
        monthLabel: currentMonth !== month ? 'Mon' : '',
        days: currentWeek,
      });
      currentWeek = [];
    }
  });

  return weeks;
}

const CompactLayout = forwardRef<HTMLDivElement, LayoutProps>(({ userData, funMessage, theme }, ref) => {
  const { classes } = theme;
  const avatarSrc = userData.avatarUrl || '';
  // Safari/iOS bugs keep base64/blob avatars from rendering when crossOrigin is present
  const avatarCrossOrigin =
    avatarSrc.startsWith('data:') || avatarSrc.startsWith('blob:') || avatarSrc.startsWith('filesystem:')
      ? undefined
      : 'anonymous';
  
  // Build heatmap weeks from flat calendar
  const heatmapWeeks = useMemo(() => buildHeatmapWeeks(userData.contributionCalendar), [userData.contributionCalendar]);

  const MiniHeatmap: React.FC<{ weeks: { days: number[] }[] }> = ({ weeks }) => {
    const normalizedWeeks = weeks.length > 0
      ? weeks
      : Array.from({ length: 52 }, () => ({ days: Array(7).fill(0) }));
    const previewWeeks = normalizedWeeks.slice(-26);
    const flattened = previewWeeks.flatMap(week => week.days);

    return (
      <div
        className="grid grid-flow-col gap-[1px]"
        style={{
          gridTemplateColumns: `repeat(${previewWeeks.length || 26}, minmax(0, 1fr))`,
          gridTemplateRows: 'repeat(7, minmax(0, 1fr))',
        }}
      >
        {flattened.map((level, i) => (
          <div
            key={`mini-cell-${i}`}
            className={`rounded-[1px] w-full h-full ${level > 0 ? classes.heatmapColors[level] : classes.heatmapColors[0]}`}
          ></div>
        ))}
      </div>
    );
  };

  return (
    <div ref={ref} className={`relative w-full h-full p-6 flex flex-col font-sans ${classes.bg} ${classes.textPrimary} transition-all duration-500 overflow-hidden`}>
      {/* Subtle gradient background */}
      <div className={`absolute top-0 right-0 w-96 h-96 ${classes.accent} opacity-[0.03] rounded-full blur-3xl`}></div>
      
      <div className="relative z-10 flex flex-col h-full">
        {/* Compact Header */}
        <header className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <img 
              src={userData.avatarUrl} 
              alt={userData.login} 
              crossOrigin={avatarCrossOrigin}
              className="w-14 h-14 rounded-xl ring-2 ring-white/20 shadow-lg" 
            />
            <div>
              <h1 className={`text-xl font-bold ${classes.highlight} leading-tight`}>{userData.name}</h1>
              <p className={`text-sm ${classes.textSecondary}`}>@{userData.login}</p>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-3xl font-black ${classes.accent} leading-none`}>2025</div>
            <div className={`text-[0.625rem] font-semibold ${classes.textSecondary} tracking-widest uppercase`}>GitWrap</div>
          </div>
        </header>

        {/* Main Content Grid */}
        <div className="flex-grow flex flex-col gap-4">
          {/* Stats Row */}
          <div className="grid grid-cols-4 gap-2">
            <div className={`p-3 rounded-lg bg-gradient-to-br from-purple-500/15 to-purple-600/5 border border-purple-400/20 text-center`}>
              <CommitIcon className="w-4 h-4 mx-auto mb-1 text-purple-400" />
              <div className={`text-lg font-bold ${classes.highlight} leading-none`}>{userData.totalCommits > 999 ? `${(userData.totalCommits / 1000).toFixed(1)}k` : userData.totalCommits}</div>
              <div className={`text-[0.5625rem] uppercase tracking-wider ${classes.textSecondary} mt-0.5`}>Commits</div>
            </div>
            <div className={`p-3 rounded-lg bg-gradient-to-br from-blue-500/15 to-blue-600/5 border border-blue-400/20 text-center`}>
              <PRIcon className="w-4 h-4 mx-auto mb-1 text-blue-400" />
              <div className={`text-lg font-bold ${classes.highlight} leading-none`}>{userData.totalPRs}</div>
              <div className={`text-[0.5625rem] uppercase tracking-wider ${classes.textSecondary} mt-0.5`}>PRs</div>
            </div>
            <div className={`p-3 rounded-lg bg-gradient-to-br from-green-500/15 to-green-600/5 border border-green-400/20 text-center`}>
              <IssueIcon className="w-4 h-4 mx-auto mb-1 text-green-400" />
              <div className={`text-lg font-bold ${classes.highlight} leading-none`}>{userData.totalIssues}</div>
              <div className={`text-[0.5625rem] uppercase tracking-wider ${classes.textSecondary} mt-0.5`}>Issues</div>
            </div>
            <div className={`p-3 rounded-lg bg-gradient-to-br from-pink-500/15 to-pink-600/5 border border-pink-400/20 text-center`}>
              <ReviewIcon className="w-4 h-4 mx-auto mb-1 text-pink-400" />
              <div className={`text-lg font-bold ${classes.highlight} leading-none`}>{userData.totalPRReviews}</div>
              <div className={`text-[0.5625rem] uppercase tracking-wider ${classes.textSecondary} mt-0.5`}>Reviews</div>
            </div>
          </div>

          {/* Activity Heatmap */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <h3 className={`text-xs font-bold uppercase tracking-wider mb-2 ${classes.accent}`}>2025 Activity</h3>
            <MiniHeatmap weeks={heatmapWeeks} />
            <div className="flex items-center justify-end gap-1.5 mt-2 text-[0.625rem]">
              <span className={classes.textSecondary}>Less</span>
              <div className="flex items-center gap-0.5">
                {[0, 1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className={`w-2.5 h-2.5 rounded-sm ${classes.heatmapColors[level]}`}
                    title={`Level ${level}`}
                  />
                ))}
              </div>
              <span className={classes.textSecondary}>More</span>
            </div>
          </div>

          {/* Languages & Highlights Split */}
          <div className="grid grid-cols-2 gap-3 flex-grow">
            {/* Languages */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <h3 className={`text-xs font-bold uppercase tracking-wider mb-3 ${classes.accent}`}>Top Languages</h3>
              <div className="space-y-2">
                {userData.topLanguages.slice(0, 3).map((lang) => (
                  <div key={lang.name}>
                    <div className="flex justify-between items-center text-xs mb-1">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: lang.color || '#cccccc' }}></div>
                        <span className={classes.textPrimary}>{lang.name}</span>
                      </div>
                      <span className={`font-bold ${classes.highlight}`}>{lang.percent.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-1.5">
                      <div 
                        className="h-full rounded-full" 
                        style={{ 
                          width: `${lang.percent}%`, 
                          backgroundColor: lang.color || '#cccccc' 
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Highlights */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between">
              <h3 className={`text-xs font-bold uppercase tracking-wider mb-2 ${classes.accent}`}>Highlights</h3>
              <div className="space-y-3">
                <div>
                  <div className={`text-2xl font-black ${classes.highlight} leading-none`}>{userData.longestStreakDays}</div>
                  <div className={`text-[0.625rem] uppercase tracking-wider ${classes.textSecondary} mt-0.5`}>Day Streak 🔥</div>
                </div>
                <div className="h-px bg-white/10"></div>
                <div className="flex justify-between items-center">
                  <div>
                    <div className={`text-sm font-bold ${classes.highlight}`}>{userData.bestDayOfWeek.slice(0, 3)}</div>
                    <div className={`text-[0.5625rem] ${classes.textSecondary}`}>Peak Day</div>
                  </div>
                  <div>
                    <div className={`text-sm font-bold ${classes.highlight}`}>{userData.githubAnniversary}Y</div>
                    <div className={`text-[0.5625rem] ${classes.textSecondary}`}>On GitHub</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Fun Message */}
          <div className={`p-3 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10`}>
            <div className="flex items-start gap-2">
              <SparklesIcon className={`w-4 h-4 flex-shrink-0 mt-0.5 ${classes.accent}`} />
              <p className={`text-xs leading-relaxed italic ${classes.textPrimary}`}>{funMessage}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
  <footer className={`mt-4 text-center text-[0.625rem] ${classes.textSecondary} tracking-wider`}>
          <span className={classes.accent}>GitWrap</span> • Year in Review
        </footer>
      </div>
    </div>
  );
});

export default CompactLayout;