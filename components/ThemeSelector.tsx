import React from 'react';
import type { Theme } from '../types';

interface ThemeSelectorProps {
  themes: Theme[];
  activeTheme: Theme;
  onSelectTheme: (theme: Theme) => void;
}

/** Colourway keys: each one is a small proof of its own three inks. */
const ThemeSelector: React.FC<ThemeSelectorProps> = ({ themes, activeTheme, onSelectTheme }) => (
  <div>
    <div role="radiogroup" aria-label="Colourway" className="swatches">
      {themes.map((theme) => {
        const active = theme.id === activeTheme.id;
        return (
          <button
            key={theme.id}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={theme.name}
            title={theme.name}
            className="swatch"
            style={{
              background:
                theme.id === 'fifa'
                  ? 'linear-gradient(135deg, #C42B30 0%, #16468F 50%, #176840 100%)'
                  : theme.c.ground,
              ['--line' as any]: theme.c.line === '#F3F1E8' ? '#0B0D17' : theme.c.line,
            }}
            onClick={() => onSelectTheme(theme)}
          >
            <span style={{ background: theme.c.a1 }} />
            <span style={{ background: theme.c.a2 }} />
          </button>
        );
      })}
    </div>
    <div style={{ marginTop: 14 }}>
      <div style={{ fontWeight: 800, fontSize: '0.9375rem', letterSpacing: '0.01em' }}>
        {activeTheme.name}
      </div>
      {activeTheme.tagline && (
        <div className="silk" style={{ marginTop: 4, opacity: 0.85, fontSize: '0.78125rem' }}>
          {activeTheme.tagline}
        </div>
      )}
    </div>
  </div>
);

export default ThemeSelector;
