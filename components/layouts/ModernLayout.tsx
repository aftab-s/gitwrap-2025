import React, { forwardRef } from 'react';
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

const ModernLayout = forwardRef<HTMLDivElement, LayoutProps>(({ userData, funMessage, theme }, ref) => {
  const { classes } = theme;

  return (
    <div ref={ref} className={`relative w-full h-full p-10 flex flex-col font-sans ${classes.bg} ${classes.textPrimary} transition-all duration-500 overflow-hidden`}>
      {/* Decorative gradient orbs */}
      <div className={`absolute -top-32 -right-32 w-96 h-96 ${classes.accent} opacity-[0.08] rounded-full blur-3xl`}></div>
      <div className={`absolute -bottom-32 -left-32 w-96 h-96 ${classes.accent} opacity-[0.06] rounded-full blur-3xl`}></div>
      
      <div className="relative z-10 flex flex-col h-full">
        {/* Header with split layout */}
        <header className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img 
                src={userData.avatarUrl} 
                alt={userData.login} 
                crossOrigin="anonymous" 
                className="w-20 h-20 rounded-2xl shadow-2xl ring-4 ring-white/10" 
              />
              <div className={`absolute -bottom-1 -right-1 w-6 h-6 ${classes.accent.replace('text-', 'bg-')} rounded-full border-4 ${classes.bg.replace('bg-', 'border-')}`}></div>
            </div>
            <div>
              <h1 className={`text-3xl font-bold ${classes.highlight} tracking-tight`}>{userData.name}</h1>
              <p className={`text-lg ${classes.textSecondary} mt-0.5`}>@{userData.login}</p>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-6xl font-black ${classes.accent} leading-none`}>2025</div>
            <div className={`text-sm font-semibold ${classes.textSecondary} tracking-widest uppercase mt-1`}>GitWrap</div>
          </div>
        </header>

        {/* Fun Message Card */}
        <div className={`relative p-5 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 mb-6`}>
          <SparklesIcon className={`absolute top-4 right-4 w-7 h-7 ${classes.accent} opacity-40`} />
          <p className={`text-base leading-relaxed italic ${classes.textPrimary}`}>{funMessage}</p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <div className={`p-4 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-400/20`}>
            <CommitIcon className="w-6 h-6 text-purple-400 mb-2" />
            <div className={`text-3xl font-bold ${classes.highlight}`}>{userData.totalCommits.toLocaleString()}</div>
            <div className={`text-xs uppercase tracking-wider ${classes.textSecondary} mt-1`}>Commits</div>
          </div>
          <div className={`p-4 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-400/20`}>
            <PRIcon className="w-6 h-6 text-blue-400 mb-2" />
            <div className={`text-3xl font-bold ${classes.highlight}`}>{userData.totalPRs.toLocaleString()}</div>
            <div className={`text-xs uppercase tracking-wider ${classes.textSecondary} mt-1`}>PRs</div>
          </div>
          <div className={`p-4 rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-400/20`}>
            <IssueIcon className="w-6 h-6 text-green-400 mb-2" />
            <div className={`text-3xl font-bold ${classes.highlight}`}>{userData.totalIssues.toLocaleString()}</div>
            <div className={`text-xs uppercase tracking-wider ${classes.textSecondary} mt-1`}>Issues</div>
          </div>
          <div className={`p-4 rounded-xl bg-gradient-to-br from-pink-500/20 to-pink-600/10 border border-pink-400/20`}>
            <ReviewIcon className="w-6 h-6 text-pink-400 mb-2" />
            <div className={`text-3xl font-bold ${classes.highlight}`}>{userData.totalPRReviews.toLocaleString()}</div>
            <div className={`text-xs uppercase tracking-wider ${classes.textSecondary} mt-1`}>Reviews</div>
          </div>
        </div>

        {/* Languages & Highlights Section */}
        <div className="grid grid-cols-3 gap-4 flex-grow">
          {/* Top Languages */}
          <div className="col-span-2 p-5 rounded-2xl bg-white/5 border border-white/10">
            <h3 className={`text-sm font-bold uppercase tracking-wider mb-4 ${classes.accent}`}>Top Languages</h3>
            <div className="space-y-3">
              {userData.topLanguages.map((lang, idx) => (
                <div key={lang.name} className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 text-xs font-bold" style={{ color: lang.color }}>
                    {idx + 1}
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-center mb-1">
                      <span className={`text-sm font-semibold ${classes.textPrimary}`}>{lang.name}</span>
                      <span className={`text-sm font-bold ${classes.highlight}`}>{lang.percent.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500" 
                        style={{ 
                          width: `${lang.percent}%`, 
                          backgroundColor: lang.color || '#cccccc',
                          boxShadow: `0 0 10px ${lang.color}40`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Highlights */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between">
            <h3 className={`text-sm font-bold uppercase tracking-wider mb-4 ${classes.accent}`}>Year Highlights</h3>
            <div className="space-y-6">
              <div className="text-center">
                <div className={`text-5xl font-black ${classes.highlight} mb-1`}>{userData.longestStreakDays}</div>
                <div className={`text-xs uppercase tracking-wider ${classes.textSecondary}`}>Day Streak 🔥</div>
              </div>
              <div className="h-px bg-white/10"></div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${classes.highlight} mb-1`}>{userData.bestDayOfWeek.slice(0, 3)}</div>
                <div className={`text-xs uppercase tracking-wider ${classes.textSecondary}`}>Peak Day 📈</div>
              </div>
              <div className="h-px bg-white/10"></div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${classes.highlight} mb-1`}>{userData.githubAnniversary}Y</div>
                <div className={`text-xs uppercase tracking-wider ${classes.textSecondary}`}>On GitHub 🎂</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className={`mt-6 text-center text-xs ${classes.textSecondary} tracking-wider`}>
          Made with 💜 by <span className={classes.accent}>GitWrap</span>
        </footer>
      </div>
    </div>
  );
});

export default ModernLayout;