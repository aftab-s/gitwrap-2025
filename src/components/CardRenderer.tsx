import React from 'react';
import type { UserStats, ThemeName } from '@/types';
import { THEME_COLORS } from '@/types/theme';

interface CardRendererProps {
  stats: UserStats;
  theme: ThemeName;
}

export const CardRenderer = React.forwardRef<SVGSVGElement, CardRendererProps>(
  ({ stats, theme }, ref) => {
    // Use modular theme colors system
    const colors = THEME_COLORS[theme];

    // Calculate stats - now showing 6 stats for all themes
    const statsArray = [
      { label: 'Contributions', value: stats.totalCommits, gradient: true },
      { label: 'Longest Streak', value: stats.longestStreakDays },
      { label: 'Pull Requests', value: stats.totalPRs },
      { label: 'Issues', value: stats.totalIssues },
      { label: 'Stars Given', value: stats.totalStarsGiven },
      { label: 'Repositories', value: stats.totalRepositories },
    ];

    return (
      <svg
        ref={ref}
        width="1080"
        height="1350"
        viewBox="0 0 1080 1350"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        style={{ fontFamily: 'Space Grotesk, sans-serif' }}
      >
        <defs>
          {/* Gradient for contributions number */}
          <linearGradient id="contributionsGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.accent} />
            <stop offset="100%" stopColor={colors.accentSecondary} />
          </linearGradient>

          {/* Gradient for top language bar */}
          <linearGradient id="lang1Gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.accent} />
            <stop offset="100%" stopColor={theme === 'minimal' ? '#f9a8d4' : theme === 'retro' ? '#f9a8d4' : theme === 'sunset' ? colors.accentSecondary : colors.accentSecondary} />
          </linearGradient>

          {/* Gradient for second language bar */}
          <linearGradient id="lang2Gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={theme === 'retro' ? '#06b6d4' : '#6366f1'} />
            <stop offset="100%" stopColor={theme === 'retro' ? '#38bdf8' : '#a78bfa'} />
          </linearGradient>

          {/* Gradient for third language bar */}
          <linearGradient id="lang3Gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#fbbf24" />
          </linearGradient>

          {/* Clip path for avatar */}
          <clipPath id="avatarClip">
            <circle cx="540" cy="190" r="40" />
          </clipPath>

          {/* Filter for retro glow */}
          {theme === 'retro' && (
            <filter id="neonGlow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          )}
        </defs>

        {/* Background - different for minimal and high-contrast themes */}
        <rect width="1080" height="1350" fill={theme === 'minimal' ? '#f8fafc' : theme === 'high-contrast' ? '#0D0208' : '#111827'} />

        {/* Radial gradient overlay - not for minimal or high-contrast themes */}
        {theme !== 'minimal' && theme !== 'high-contrast' && (
          <>
            <defs>
              <radialGradient id="bgGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#1e1b4b" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#0c0a1a" stopOpacity="0.4" />
              </radialGradient>
            </defs>
            <rect width="1080" height="1350" fill="url(#bgGrad)" />
          </>
        )}

        {/* Grid pattern for high-contrast/matrix theme */}
        {theme === 'high-contrast' && (
          <>
            <defs>
              <pattern id="gridPattern" patternUnits="userSpaceOnUse" width="32" height="32">
                <line x1="0" y1="0" x2="32" y2="0" stroke="rgba(128, 128, 128, 0.1)" strokeWidth="1" />
                <line x1="0" y1="0" x2="0" y2="32" stroke="rgba(128, 128, 128, 0.1)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="1080" height="1350" fill="url(#gridPattern)" />
          </>
        )}

        {/* Dot pattern background - different for minimal theme */}
        {theme !== 'high-contrast' && (
          <defs>
            <pattern id="dots" patternUnits="userSpaceOnUse" width="24" height="24">
              <circle cx="0" cy="0" r="1" fill={theme === 'minimal' ? 'rgba(226, 232, 240, 1)' : 'rgba(255, 255, 255, 0.08)'} />
            </pattern>
          </defs>
        )}
        {theme !== 'high-contrast' && (
          <rect width="1080" height="1350" fill="url(#dots)" />
        )}

        {/* Main card container */}
        <g transform="translate(100, 100)">
          {/* Card background */}
          <rect
            x="0"
            y="0"
            width="880"
            height="1100"
            rx="24"
            fill={colors.cardBg}
            stroke={colors.border}
            strokeWidth="2"
          />

          {/* Retro scanlines effect */}
          {theme === 'retro' && (
            <>
              {Array.from({ length: 275 }).map((_, i) => (
                <line
                  key={i}
                  x1="0"
                  y1={i * 4}
                  x2="880"
                  y2={i * 4}
                  stroke="rgba(255, 255, 255, 0.03)"
                  strokeWidth="2"
                />
              ))}
            </>
          )}

          {/* Avatar circle border */}
          <circle
            cx="440"
            cy="100"
            r="44"
            fill="none"
            stroke={colors.avatar}
            strokeWidth="4"
          />
          {theme === 'retro' && (
            <circle
              cx="440"
              cy="100"
              r="44"
              fill="none"
              stroke={colors.avatar}
              strokeWidth="4"
              filter="url(#neonGlow)"
            />
          )}

          {/* Avatar image - using base64 data URI or placeholder */}
          <g clipPath="url(#avatarClip)">
            {stats.avatarUrl ? (
              <image
                xlinkHref={stats.avatarUrl}
                x="400"
                y="60"
                width="80"
                height="80"
                preserveAspectRatio="xMidYMid slice"
              />
            ) : (
              <circle
                cx="440"
                cy="100"
                r="40"
                fill={colors.accent}
              />
            )}
          </g>

          {/* Name */}
          <text
            x="440"
            y="210"
            textAnchor="middle"
            fontSize="28"
            fontWeight="700"
            fill={colors.textPrimary}
            filter={theme === 'retro' ? 'url(#neonGlow)' : undefined}
          >
            {stats.name || stats.login}
          </text>

          {/* Username */}
          <text
            x="440"
            y="240"
            textAnchor="middle"
            fontSize="16"
            fill={colors.textSecondary}
          >
            @{stats.login}
          </text>

          {/* Stats Grid - 6 stats in 3x2 grid */}
          <g transform="translate(40, 280)">
            {statsArray.map((stat, index) => {
              const cols = 3; // Always 3 columns for 6 stats
              const col = index % cols;
              const row = Math.floor(index / cols);
              const boxWidth = 253;
              const boxHeight = 100;
              const gapX = 20;
              const gapY = 16;
              const x = col * (boxWidth + gapX);
              const y = row * (boxHeight + gapY);

              return (
                <g key={index} transform={`translate(${x}, ${y})`}>
                  <rect
                    width={boxWidth}
                    height={boxHeight}
                    rx="12"
                    fill={colors.statBg}
                    stroke={colors.statBorder}
                    strokeWidth="1"
                  />
                  <text
                    x={boxWidth / 2}
                    y="30"
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="400"
                    fill={colors.textSecondary}
                    style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}
                  >
                    {stat.label}
                  </text>
                  <text
                    x={boxWidth / 2}
                    y="70"
                    textAnchor="middle"
                    fontSize="32"
                    fontWeight="700"
                    fill={stat.gradient ? 'url(#contributionsGradient)' : colors.textPrimary}
                  >
                    {stat.value}
                  </text>
                </g>
              );
            })}
          </g>

          {/* Activity Insights - Show for all themes if data available */}
          {stats.bestDayOfWeek && (
            <g transform={`translate(40, ${theme === 'minimal' ? 520 : 520})`}>
              <rect
                width="800"
                height="110"
                rx="12"
                fill={colors.statBg}
                stroke={colors.statBorder}
                strokeWidth="1"
              />
              <text
                x="20"
                y="35"
                fontSize="16"
                fontWeight="700"
                fill={colors.textPrimary}
              >
                {theme === 'retro' ? '⚡' : '📊'} Activity Insights
              </text>
              <text
                x="20"
                y="65"
                fontSize="12"
                fill={colors.textSecondary}
              >
                Most Productive Day
              </text>
              <text
                x="20"
                y="90"
                fontSize="16"
                fontWeight="500"
                fill={colors.textPrimary}
              >
                {stats.bestDayOfWeek}
              </text>
              <text
                x="420"
                y="65"
                fontSize="12"
                fill={colors.textSecondary}
              >
                Most Productive Hour
              </text>
              <text
                x="420"
                y="90"
                fontSize="16"
                fontWeight="500"
                fill={colors.textPrimary}
              >
                {stats.bestHour}:00
              </text>
            </g>
          )}

          {/* Top Languages - up to top 5, using per-language color if provided */}
          {stats.topLanguages.length > 0 && (() => {
            const itemCount = Math.min(stats.topLanguages.length, 5);
            const rectHeight = 80 + itemCount * 35; // dynamic height based on items
            return (
              <g transform="translate(40, 650)">
                <rect
                  width="800"
                  height={rectHeight}
                  rx="12"
                  fill={colors.statBg}
                  stroke={colors.statBorder}
                  strokeWidth="1"
                />
                <text
                  x="20"
                  y="35"
                  fontSize="16"
                  fontWeight="700"
                  fill={colors.textPrimary}
                >
                  💻 Top Languages
                </text>
                {stats.topLanguages.slice(0, itemCount).map((lang, index) => {
                  const fallbackFill = index === 0
                    ? 'url(#lang1Gradient)'
                    : index === 1
                    ? 'url(#lang2Gradient)'
                    : 'url(#lang3Gradient)';
                  const barWidth = Math.max(10, Math.round(lang.percent * 520));
                  return (
                    <g key={index} transform={`translate(20, ${55 + index * 35})`}>
                      {/* Color dot */}
                      <circle cx="86" cy="11" r="4" fill={lang.color || colors.iconColor} stroke={colors.statBorder} strokeWidth="1" />
                      {/* Label */}
                      <text
                        x="0"
                        y="15"
                        fontSize="13"
                        fontFamily="monospace"
                        fill={colors.textSecondary}
                        textAnchor="end"
                        transform="translate(90, 0)"
                      >
                        {lang.name}
                      </text>
                      {/* Track */}
                      <rect
                        x="105"
                        y="5"
                        width="520"
                        height="12"
                        rx="6"
                        fill={theme === 'minimal' ? '#e2e8f0' : theme === 'retro' ? 'rgba(131, 24, 67, 0.5)' : theme === 'sunset' ? 'rgba(63, 63, 70, 0.5)' : 'rgba(55, 65, 81, 0.5)'}
                      />
                      {/* Fill */}
                      <rect
                        x="105"
                        y="5"
                        width={barWidth}
                        height="12"
                        rx="6"
                        fill={lang.color || fallbackFill}
                      />
                      {/* Percentage */}
                      <text
                        x="640"
                        y="15"
                        fontSize="13"
                        fontWeight="600"
                        fill={colors.textPrimary}
                      >
                        {(lang.percent * 100).toFixed(1)}%
                      </text>
                    </g>
                  );
                })}
              </g>
            );
          })()}

          {/* Top Repository */}
          {stats.topRepos.length > 0 && (
            <g transform="translate(40, 845)">
              <rect
                width="800"
                height="90"
                rx="12"
                fill={colors.statBg}
                stroke={colors.statBorder}
                strokeWidth="1"
              />
              <text
                x="20"
                y="35"
                fontSize="16"
                fontWeight="700"
                fill={colors.textPrimary}
              >
                ⭐ Top Repository
              </text>
              <circle
                cx="40"
                cy="65"
                r="16"
                fill="url(#contributionsGradient)"
              />
              <text
                x="40"
                y="72"
                textAnchor="middle"
                fontSize="16"
                fontWeight="700"
                fill="#ffffff"
              >
                {stats.topRepos[0].name.charAt(0).toUpperCase()}
              </text>
              <text
                x="70"
                y="65"
                fontSize="15"
                fontWeight="500"
                fill={colors.textPrimary}
              >
                {stats.topRepos[0].name}
              </text>
              <text
                x="70"
                y="82"
                fontSize="12"
                fill={colors.textSecondary}
              >
                {stats.topRepos[0].contributions} contributions
              </text>
            </g>
          )}

          {/* Footer */}
          <text
            x="440"
            y="1050"
            textAnchor="middle"
            fontSize="12"
            fill={colors.textSecondary}
          >
            githubunwrapped.com/u/{stats.login}
          </text>
        </g>
      </svg>
    );
  }
);

CardRenderer.displayName = 'CardRenderer';
