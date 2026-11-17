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
            style={{ background: theme.c.ground, ['--line' as any]: theme.c.line === '#F3F1E8' ? '#0B0D17' : theme.c.line }}
            onClick={() => onSelectTheme(theme)}
          >
            <span style={{ background: theme.c.a1 }} />
            <span style={{ background: theme.c.a2 }} />
          </button>
        );
      })}
    </div>
    <p className="silk" style={{ margin: '16px 0 0' }}>
      {activeTheme.name}
    </p>
  </div>
);

export default ThemeSelector;
