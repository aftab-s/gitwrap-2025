import type { Theme } from './types';

/**
 * Colourways. Each one is a printed control panel: one flat ground, a keyline, a light score
 * window, and two inks. Nothing else gets a colour, so every colourway stays a three-ink print.
 *
 *   ground      the silkscreened field
 *   line        keylines and the travel edge under keys
 *   ink         text on light surfaces (windows, keys)
 *   panel       score-window face
 *   a1          primary ink: the START key, lit LEDs, headline values
 *   a2          secondary ink: the second language, the AI block
 *   led         optional: lit colour inside the dark display windows, when a1 is too dark for them
 *   onGround    text printed straight on the ground
 *   onGroundDim secondary text on the ground, tinted from the ground's hue
 *   onPanelDim  secondary text inside a window
 *
 * a1 and a2 are always light enough to carry ink text, because keys and chips print on them.
 */
export const THEMES: Theme[] = [
  {
    id: 'p1',
    name: 'Player One',
    c: {
      ground: '#2438E8', line: '#0B0D17', ink: '#0B0D17', panel: '#F6F4EC',
      a1: '#FFD21F', a2: '#FF5C7A',
      onGround: '#FFFFFF', onGroundDim: '#C9D0FF', onPanelDim: '#545A70',
    },
  },
  {
    id: 'token',
    name: 'Token',
    c: {
      ground: '#FFC917', line: '#111111', ink: '#111111', panel: '#FFFFFF',
      a1: '#FF5A36', a2: '#8ADBFF', led: '#FFC917',
      onGround: '#111111', onGroundDim: '#5A4700', onPanelDim: '#5B5B5B',
    },
  },
  {
    id: 'mint',
    name: 'Mint Cab',
    c: {
      ground: '#1EDC86', line: '#062018', ink: '#062018', panel: '#F4FFF9',
      a1: '#FF63AB', a2: '#FFE14A',
      onGround: '#062018', onGroundDim: '#0B5236', onPanelDim: '#3F6654',
    },
  },
  {
    id: 'grape',
    name: 'Grape',
    c: {
      ground: '#5B2EE5', line: '#120A2A', ink: '#120A2A', panel: '#F4F0FF',
      a1: '#C8F53B', a2: '#FF6FB2',
      onGround: '#FFFFFF', onGroundDim: '#D8CCFF', onPanelDim: '#5C5378',
    },
  },
  {
    id: 'bone',
    name: 'Bone',
    c: {
      ground: '#E8E5DA', line: '#111111', ink: '#111111', panel: '#FFFFFF',
      a1: '#F0442F', a2: '#FFD21F',
      onGround: '#111111', onGroundDim: '#5C594F', onPanelDim: '#5E5E5E',
    },
  },
  {
    id: 'night',
    name: 'Night Shift',
    c: {
      ground: '#14161C', line: '#F3F1E8', ink: '#0A0B0F', panel: '#F3F1E8',
      a1: '#1EDC86', a2: '#FFD21F',
      onGround: '#F3F1E8', onGroundDim: '#A9AEBB', onPanelDim: '#555A66',
    },
  },
];

/** The site's own chrome is printed in this colourway until the visitor picks another. */
export const DEFAULT_THEME = THEMES[0];

/** CSS custom properties for a colourway, for a wrapper's `style`. */
export function themeVars(theme: Theme): Record<string, string> {
  const { c } = theme;
  return {
    '--ground': c.ground,
    '--line': c.line,
    '--ink': c.ink,
    '--panel': c.panel,
    '--a1': c.a1,
    '--a2': c.a2,
    '--on-ground': c.onGround,
    '--on-ground-dim': c.onGroundDim,
    '--on-panel-dim': c.onPanelDim,
  };
}
