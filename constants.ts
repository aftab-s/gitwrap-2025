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
    id: 'artemis',
    name: 'Lunar Orbit',
    tagline: 'Inspired by Artemis II',
    c: {
      ground: '#070B16',
      line: '#02050A',
      ink: '#060B18',
      panel: '#EFF4F9',
      a1: '#FFA31A',
      a2: '#00E5FF',
      led: '#00F0FF',
      onGround: '#FFFFFF',
      onGroundDim: '#8CA0C0',
      onPanelDim: '#4B5C78',
    },
  },
  {
    id: 'fifa',
    name: "Matchday '26",
    tagline: 'Inspired by World Cup 2026',
    c: {
      ground: '#093D22',
      line: '#041E10',
      ink: '#052313',
      panel: '#F6FFF8',
      a1: '#FFD21F',
      a2: '#FF334B',
      led: '#FFD21F',
      onGround: '#FFFFFF',
      onGroundDim: '#96D4B0',
      onPanelDim: '#3D684E',
    },
  },
  {
    id: 'gtavi',
    name: 'Vice Sunset',
    tagline: 'Inspired by GTA VI',
    c: {
      ground: '#18072B',
      line: '#090014',
      ink: '#0E011C',
      panel: '#FFF6FA',
      a1: '#FF2A85',
      a2: '#00F5D4',
      led: '#FFB703',
      onGround: '#FFFFFF',
      onGroundDim: '#DCA8FF',
      onPanelDim: '#704688',
    },
  },
  {
    id: 'doomsday',
    name: 'Latverian Steel',
    tagline: 'Inspired by Avengers Doomsday',
    c: {
      ground: '#181B22',
      line: '#0A0C10',
      ink: '#0B0D12',
      panel: '#E2E8EE',
      a1: '#00FF88',
      a2: '#FFB800',
      led: '#00FF88',
      onGround: '#FFFFFF',
      onGroundDim: '#9AA7B8',
      onPanelDim: '#4B5668',
    },
  },
  {
    id: 'maxdark',
    name: 'Volt Matrix',
    tagline: 'Maximalist Dark',
    c: {
      ground: '#0A0B0E',
      line: '#000000',
      ink: '#050608',
      panel: '#EEEEEE',
      a1: '#D4FF00',
      a2: '#FF5500',
      led: '#D4FF00',
      onGround: '#FFFFFF',
      onGroundDim: '#9CA3AF',
      onPanelDim: '#4B5563',
    },
  },
  {
    id: 'maxlight',
    name: 'Tokyo Riso',
    tagline: 'Maximalist Light',
    c: {
      ground: '#F4EFE6',
      line: '#0B1B61',
      ink: '#0B1B61',
      panel: '#FFFFFF',
      a1: '#FF3366',
      a2: '#FFD600',
      led: '#FF3366',
      onGround: '#0B1B61',
      onGroundDim: '#586AA3',
      onPanelDim: '#586AA3',
    },
  },
];

/** The site's own chrome is printed in this colourway until the visitor picks another. */
export const DEFAULT_THEME = THEMES[0];

/**
 * The homepage fusion theme: a cosmic obsidian ground that harmonizes all 6 themes
 * (Matchday gold/green, Lunar cyan, Vice magenta/amber, Latverian emerald, Volt yellow, Tokyo coral).
 */
export const HOME_FUSION_THEME: Theme = {
  id: 'fusion',
  name: '2026 Fusion',
  tagline: 'Harmonized 6-Theme Atmospheric Canvas',
  c: {
    ground: '#090B13',
    line: '#040508',
    ink: '#05070D',
    panel: '#F0F4FA',
    a1: '#FFD21F',
    a2: '#FF2A85',
    led: '#00E5FF',
    onGround: '#FFFFFF',
    onGroundDim: '#9AA7B8',
    onPanelDim: '#4B5668',
  },
};

/**
 * The wrap studio page theme: an immersive dark control-room palette
 * similar to the homepage fusion, maintaining stable, cohesive page chrome
 * while the wrap card itself updates across user-selected themes.
 */
export const USER_STUDIO_THEME: Theme = {
  id: 'studio',
  name: 'Studio Control',
  tagline: 'Wrap Studio Chrome',
  c: {
    ground: '#0B0D17',
    line: '#05070D',
    ink: '#060810',
    panel: '#F0F4FA',
    a1: '#00E5FF',
    a2: '#FF2A85',
    led: '#00FF88',
    onGround: '#FFFFFF',
    onGroundDim: '#8E9CAE',
    onPanelDim: '#465263',
  },
};

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
    '--led': c.led ?? c.a1,
    '--on-ground': c.onGround,
    '--on-ground-dim': c.onGroundDim,
    '--on-panel-dim': c.onPanelDim,
  };
}
