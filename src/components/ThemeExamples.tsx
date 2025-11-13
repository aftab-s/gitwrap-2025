/**
 * THEME SYSTEM USAGE EXAMPLES
 * 
 * This file demonstrates how to use the modular theme system
 * throughout your components. Delete this file when ready.
 */

import { THEME_COLORS, LAYOUT, THEME_METADATA } from '@/types/theme';
import { 
  getThemeConfig, 
  getThemeDisplay, 
  getLanguageGradientColors,
  getStatBoxColors,
  getThemeTextColor,
} from '@/utils/themeUtils';
import type { ThemeName } from '@/types';

// ============================================================
// EXAMPLE 1: Basic Theme Usage in a Component
// ============================================================

function BasicThemeExample({ theme }: { theme: ThemeName }) {
  const colors = THEME_COLORS[theme];
  
  return (
    <div style={{ backgroundColor: colors.bg }}>
      <div style={{ color: colors.textPrimary }}>
        Hello World
      </div>
    </div>
  );
}

// ============================================================
// EXAMPLE 2: Using Layout Classes
// ============================================================

function LayoutExample({ theme }: { theme: ThemeName }) {
  const colors = THEME_COLORS[theme];
  
  return (
    <div className={LAYOUT.page.display}>
      <header className={LAYOUT.header.textAlign}>
        <h1 className={LAYOUT.header.titleSize}>
          My GitHub Stats
        </h1>
      </header>
      
      <div className={LAYOUT.grid.mainGrid}>
        {/* Stats Grid */}
        <div className={LAYOUT.stats.container}>
          <div 
            className={LAYOUT.stats.box}
            style={{
              backgroundColor: colors.statBg,
              borderColor: colors.statBorder,
            }}
          >
            <p className={LAYOUT.stats.label} style={{ color: colors.textSecondary }}>
              Contributions
            </p>
            <p className={LAYOUT.stats.value} style={{ color: colors.textPrimary }}>
              1,234
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// EXAMPLE 3: Theme Utilities
// ============================================================

function ThemeUtilitiesExample({ theme }: { theme: ThemeName }) {
  // Get full theme config
  const themeConfig = getThemeConfig(theme);
  
  // Get display name
  const displayName = getThemeDisplay(theme);
  // Example only: Show display name in UI instead of logging to console
  
  // Get stat box colors
  const statColors = getStatBoxColors(theme);
  
  // Get text color
  const textColor = getThemeTextColor(theme, 'primary');
  
  // Get language gradients
  const gradients = getLanguageGradientColors(theme);
  
  return (
    <div style={{ color: statColors.text }}>
      <p>Theme: {displayName}</p>
      <p>Config: {themeConfig.name}</p>
    </div>
  );
}

// ============================================================
// EXAMPLE 4: Stats Component Pattern
// ============================================================

interface Stat {
  label: string;
  value: number | string;
}

function StatsGrid({ stats, theme }: { stats: Stat[]; theme: ThemeName }) {
  const colors = THEME_COLORS[theme];
  
  return (
    <div className={LAYOUT.stats.container}>
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={LAYOUT.stats.box}
          style={{
            backgroundColor: colors.statBg,
            borderColor: colors.statBorder,
          }}
        >
          <p 
            className={LAYOUT.stats.label}
            style={{ color: colors.textSecondary }}
          >
            {stat.label}
          </p>
          <p 
            className={LAYOUT.stats.value}
            style={{ color: colors.textPrimary }}
          >
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// EXAMPLE 5: Theme Selector Component
// ============================================================

function ThemeSelector({ 
  currentTheme, 
  onThemeChange 
}: { 
  currentTheme: ThemeName;
  onThemeChange: (theme: ThemeName) => void;
}) {
  const themes: ThemeName[] = ['space', 'sunset', 'retro', 'minimal', 'high-contrast'];
  
  return (
    <div className={LAYOUT.themeSelector.container}>
      <h3 className={LAYOUT.themeSelector.title}>Choose Theme</h3>
      
      <div className={LAYOUT.themeSelector.grid}>
        {themes.map((theme) => {
          const isActive = currentTheme === theme;
          const metadata = THEME_METADATA[theme];
          const colors = THEME_COLORS[theme];
          
          return (
            <button
              key={theme}
              onClick={() => onThemeChange(theme)}
              className={LAYOUT.themeSelector.button}
              style={{
                backgroundColor: isActive ? 'rgba(100, 100, 100, 0.5)' : 'transparent',
                borderColor: isActive ? colors.accent : 'transparent',
                borderWidth: isActive ? '2px' : '1px',
              }}
            >
              <div 
                className={LAYOUT.themeSelector.preview}
                style={{
                  background: colors.accent,
                }}
              />
              <span className={LAYOUT.themeSelector.label}>
                {metadata.icon} {metadata.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// EXAMPLE 6: Languages Component Pattern
// ============================================================

interface Language {
  name: string;
  percent: number;
}

function TopLanguages({ languages, theme }: { languages: Language[]; theme: ThemeName }) {
  const colors = THEME_COLORS[theme];
  const gradients = getLanguageGradientColors(theme);
  
  return (
    <div 
      className={LAYOUT.languages.container}
      style={{
        backgroundColor: colors.statBg,
        borderColor: colors.statBorder,
      }}
    >
      <h3 
        className={LAYOUT.languages.title}
        style={{ color: colors.textPrimary }}
      >
        💻 Top Languages
      </h3>
      
      <div className="space-y-2 sm:space-y-3">
        {languages.map((lang, index) => (
          <div key={lang.name} className={LAYOUT.languages.item}>
            <div 
              className={LAYOUT.languages.label}
              style={{ color: colors.textSecondary }}
            >
              {lang.name}
            </div>
            
            <div className={LAYOUT.languages.bar}>
              {/* Background bar */}
              <div
                style={{
                  backgroundColor: 'rgba(55, 65, 81, 0.5)',
                  width: '100%',
                  height: '100%',
                  borderRadius: '9999px',
                }}
              />
              
              {/* Filled bar */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  height: '100%',
                  width: `${lang.percent * 100}%`,
                  borderRadius: '9999px',
                  background: index === 0 
                    ? `linear-gradient(to right, ${gradients.lang1.start}, ${gradients.lang1.end})`
                    : index === 1
                    ? `linear-gradient(to right, ${gradients.lang2.start}, ${gradients.lang2.end})`
                    : `linear-gradient(to right, ${gradients.lang3.start}, ${gradients.lang3.end})`,
                }}
              />
            </div>
            
            <div 
              className={LAYOUT.languages.percentage}
              style={{ color: colors.textPrimary }}
            >
              {Math.round(lang.percent * 100)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// KEY PRINCIPLES
// ============================================================

/**
 * 1. LAYOUT is ALWAYS the same across all themes
 *    - Use LAYOUT for all className assignments
 *    - Use LAYOUT for all sizing and spacing
 * 
 * 2. COLORS change per theme
 *    - Use THEME_COLORS[theme] for style properties
 *    - Each theme has the same color properties
 *    - Only the values differ
 * 
 * 3. Combine both for complete styling
 *    className={LAYOUT.stats.box}
 *    style={{
 *      backgroundColor: colors.statBg,
 *      borderColor: colors.statBorder,
 *      color: colors.textPrimary,
 *    }}
 * 
 * 4. To add a new theme:
 *    - Add colors to THEME_COLORS
 *    - Add metadata to THEME_METADATA
 *    - Layout automatically applies!
 * 
 * 5. To modify layout:
 *    - Update LAYOUT in src/types/theme.ts
 *    - Changes apply to ALL themes
 */

export {
  BasicThemeExample,
  LayoutExample,
  ThemeUtilitiesExample,
  StatsGrid,
  ThemeSelector,
  TopLanguages,
};
