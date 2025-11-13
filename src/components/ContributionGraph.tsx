import React from 'react';

interface ContributionDay {
  date: string;
  count: number;
}

interface ContributionGraphProps {
  data: ContributionDay[];
  theme?: string;
  themeColors?: any;
}

export function ContributionGraph({ data, theme = 'space', themeColors }: ContributionGraphProps) {
  // Filter for 2025 data only
  const contributionsData = data.filter(day => {
    const year = new Date(day.date).getFullYear();
    return year === 2025;
  });

  // Group contributions by week
  const weeks: ContributionDay[][] = [];
  let currentWeek: ContributionDay[] = [];
  
  contributionsData.forEach((day, index) => {
    const dayOfWeek = new Date(day.date).getDay();
    
    if (dayOfWeek === 0 && currentWeek.length > 0) {
      weeks.push([...currentWeek]);
      currentWeek = [];
    }
    
    currentWeek.push(day);
    
    // Push the last week if it's the last day
    if (index === contributionsData.length - 1 && currentWeek.length > 0) {
      weeks.push(currentWeek);
    }
  });

  // Calculate max contributions for color scaling
  const maxContributions = Math.max(...contributionsData.map(d => d.count), 1);

  // Get color intensity based on contribution count
  const getColor = (count: number): string => {
    if (count === 0) {
      return theme === 'minimal' ? '#f1f5f9' : 'rgba(255, 255, 255, 0.05)';
    }

    const intensity = count / maxContributions;
    
    if (theme === 'minimal') {
      // Pink gradient for minimal theme
      if (intensity < 0.25) return '#fce7f3';
      if (intensity < 0.5) return '#fbcfe8';
      if (intensity < 0.75) return '#f9a8d4';
      return '#ec4899';
    } else if (theme === 'retro') {
      // Neon gradient for retro theme
      if (intensity < 0.25) return 'rgba(236, 72, 153, 0.3)';
      if (intensity < 0.5) return 'rgba(236, 72, 153, 0.5)';
      if (intensity < 0.75) return 'rgba(236, 72, 153, 0.75)';
      return '#ec4899';
    } else if (theme === 'sunset') {
      // Orange gradient for sunset theme
      if (intensity < 0.25) return 'rgba(249, 115, 22, 0.3)';
      if (intensity < 0.5) return 'rgba(249, 115, 22, 0.5)';
      if (intensity < 0.75) return 'rgba(249, 115, 22, 0.75)';
      return '#f97316';
    } else if (theme === 'high-contrast') {
      // Teal gradient for high-contrast theme
      if (intensity < 0.25) return 'rgba(20, 184, 166, 0.3)';
      if (intensity < 0.5) return 'rgba(20, 184, 166, 0.5)';
      if (intensity < 0.75) return 'rgba(20, 184, 166, 0.75)';
      return '#14b8a6';
    } else {
      // Blue gradient for space theme
      if (intensity < 0.25) return 'rgba(99, 102, 241, 0.3)';
      if (intensity < 0.5) return 'rgba(99, 102, 241, 0.5)';
      if (intensity < 0.75) return 'rgba(99, 102, 241, 0.75)';
      return '#6366f1';
    }
  };

  // Visual sizing is controlled via CSS variables for export overrides.
  // Defaults are defined in globals.css (:root). We keep JS widths for layout calc.
  const cellSize = 10; // used only for width calc (minWidth)
  const cellGap = 2;
  const totalWidth = weeks.length * (cellSize + cellGap);

  return (
    <div 
      className="border rounded-xl p-3 sm:p-4 contrib-graph"
      style={{
        backgroundColor: themeColors?.statBg || (theme === 'minimal' ? '#ffffff' : 'rgba(31, 41, 55, 0.5)'),
        borderColor: themeColors?.statBorder || (theme === 'minimal' ? '#e2e8f0' : '#374151'),
      }}
    >
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <h3 
          className="text-sm sm:text-base font-bold flex items-center gap-2"
          style={{ color: themeColors?.textPrimary || (theme === 'minimal' ? '#1e293b' : '#ffffff') }}
        >
          <span className="material-symbols-outlined !text-lg sm:!text-xl" style={{ color: themeColors?.iconColor }}>analytics</span>
          2025 Contribution Activity
        </h3>
        <div className="hidden sm:flex items-center gap-2 text-xs" style={{ color: themeColors?.textSecondary || '#9ca3af' }}>
          <span>Less</span>
          <div className="flex gap-1">
            {[0, 0.25, 0.5, 0.75, 1].map((intensity, i) => (
              <div
                key={i}
                className="w-2.5 h-2.5 rounded-sm"
                style={{ backgroundColor: getColor(intensity * maxContributions) }}
              />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>
      
      <div 
        className="overflow-x-auto pb-1 scrollbar-hide"
        style={{
          scrollbarWidth: 'none', /* Firefox */
          msOverflowStyle: 'none', /* IE and Edge */
        }}
      >
  <div style={{ minWidth: `calc(${weeks.length} * (var(--cg-cell-w) + ${cellGap}px))` }}>
          <div className="flex gap-[2px]">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-[2px]">
                {[0, 1, 2, 3, 4, 5, 6].map(dayIndex => {
                  const day = week.find(d => new Date(d.date).getDay() === dayIndex);
                  
                  return (
                    <div
                      key={dayIndex}
                      className="rounded-sm transition-all hover:ring-1 cursor-pointer"
                      style={{
                        width: 'var(--cg-cell-w)',
                        height: 'var(--cg-cell-h)',
                        backgroundColor: day ? getColor(day.count) : 'transparent',
                        boxShadow: day && day.count > 0 && theme === 'retro' ? `0 0 3px ${getColor(day.count)}` : 'none',
                      }}
                      title={day ? `${day.date}: ${day.count} contribution${day.count !== 1 ? 's' : ''}` : ''}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
