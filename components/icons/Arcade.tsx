import React from 'react';

// One icon family: drawn on a 16-unit grid from squares and straight cuts, filled, no curves.
type IconProps = { size?: number; color?: string; style?: React.CSSProperties; className?: string };

const base = (size: number, style?: React.CSSProperties, className?: string) => ({
  width: size,
  height: size,
  viewBox: '0 0 16 16',
  style: { display: 'block', flexShrink: 0, ...style },
  className,
  'aria-hidden': true as const,
  shapeRendering: 'crispEdges' as const,
});

/** The player arrow printed beside an instruction on a control panel. */
export const PlayerArrow: React.FC<IconProps> = ({ size = 16, color = 'currentColor', style, className }) => (
  <svg {...base(size, style, className)} shapeRendering="geometricPrecision">
    <path d="M3 1 L14 8 L3 15 Z" fill={color} />
  </svg>
);

export const Lock: React.FC<IconProps> = ({ size = 16, color = 'currentColor', style, className }) => (
  <svg {...base(size, style, className)}>
    <path d="M4 7V3h8v4h2v8H2V7h2zm2 0h4V5H6v2zm1 3v3h2v-3H7z" fill={color} fillRule="evenodd" />
  </svg>
);

export const Pause: React.FC<IconProps> = ({ size = 16, color = 'currentColor', style, className }) => (
  <svg {...base(size, style, className)}>
    <path d="M3 2h4v12H3V2zm6 0h4v12H9V2z" fill={color} />
  </svg>
);

export const ArrowLeft: React.FC<IconProps> = ({ size = 16, color = 'currentColor', style, className }) => (
  <svg {...base(size, style, className)}>
    <path d="M15 7H6V3L1 8l5 5V9h9V7z" fill={color} />
  </svg>
);

export const Download: React.FC<IconProps> = ({ size = 16, color = 'currentColor', style, className }) => (
  <svg {...base(size, style, className)}>
    <path d="M6 1h4v6h3l-5 5-5-5h3V1zM1 13h14v2H1v-2z" fill={color} />
  </svg>
);

export const ArrowRight: React.FC<IconProps> = ({ size = 16, color = 'currentColor', style, className }) => (
  <svg {...base(size, style, className)}>
    <path d="M1 7h9V3l5 5-5 5V9H1V7z" fill={color} />
  </svg>
);

export const Check: React.FC<IconProps> = ({ size = 16, color = 'currentColor', style, className }) => (
  <svg {...base(size, style, className)}>
    <path d="M2 8l2-2 3 3 5-6 2 2-7 8-5-5z" fill={color} />
  </svg>
);

/** GitHub's mark is a third-party logo, so it keeps its own drawing. */
export const GitHubMark: React.FC<IconProps> = ({ size = 16, color = 'currentColor', style, className }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" style={{ display: 'block', flexShrink: 0, ...style }} className={className} aria-hidden>
    <path
      fill={color}
      d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
    />
  </svg>
);
