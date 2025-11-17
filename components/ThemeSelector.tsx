
import React from 'react';
import type { Theme } from '../types';

interface ThemeSelectorProps {
  themes: Theme[];
  activeTheme: Theme;
  onSelectTheme: (theme: Theme) => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ themes, activeTheme, onSelectTheme }) => {
  return (
    <div className="p-3 md:p-4 bg-gray-800/50 rounded-lg">
      <h4 className="text-sm font-medium mb-3 text-gray-200">Themes</h4>
      <div role="listbox" aria-label="Theme selector" className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-2 gap-3">
        {themes.map(theme => {
          const isActive = activeTheme.name === theme.name;
          const previewColors = Array.isArray(theme.classes.heatmapColors) ? theme.classes.heatmapColors.slice(0, 4) : [];
          return (
            <button
              key={theme.name}
              onClick={() => onSelectTheme(theme)}
              role="option"
              aria-selected={isActive}
              className={`relative flex flex-col items-stretch h-28 rounded-lg overflow-hidden border transition-shadow duration-150 focus:outline-none focus:ring-2 focus:ring-purple-400 ${
                isActive ? 'border-purple-500 ring-2 ring-purple-300 shadow-lg scale-105' : 'border-transparent hover:shadow-md bg-gray-700'
              }`}
            >
              {/* Color preview */}
              <div className={`h-16 w-full flex`}> 
                {previewColors.length === 0 ? (
                  <div className="flex-1 bg-gray-600" />
                ) : (
                  previewColors.map((c, idx) => (
                    <div key={idx} className={`${c} flex-1`} aria-hidden />
                  ))
                )}
              </div>
              {/* Name and optional indicator */}
              <div className="flex items-center justify-between px-3 py-2 bg-gray-800/40">
                <div className="text-sm font-semibold text-gray-100 truncate">{theme.name}</div>
                {isActive && (
                  <div className="ml-2 inline-flex items-center justify-center bg-white text-gray-900 rounded-full w-6 h-6 text-xs" aria-hidden>
                    ✓
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ThemeSelector;
