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
      ground: '#040A17',
      line: '#020610',
      ink: '#040A17',
      panel: '#D8E7F6',
      a1: '#7CD6FF',
      a2: '#E59A1A',
      led: '#7CD6FF',
      onGround: '#D8E7F6',
      onGroundDim: '#C6E0FB',
      onPanelDim: '#162C4E',
    },
  },
  {
    id: 'fifa',
    name: "Matchday '26",
    tagline: 'Inspired by World Cup 2026',
    c: {
      ground: '#176840',
      line: '#16468F',
      ink: '#16468F',
      panel: '#EAECEF',
      a1: '#F7D154',
      a2: '#C42B30',
      led: '#F7D154',
      onGround: '#EAECEF',
      onGroundDim: '#F7D154',
      onPanelDim: '#8A5A10',
    },
  },
  {
    id: 'gtavi',
    name: 'Vice Sunset',
    tagline: 'Inspired by GTA VI',
    c: {
      ground: '#6B3B5E',
      line: '#421E38',
      ink: '#421E38',
      panel: '#FDE0C8',
      a1: '#F3937B',
      a2: '#5E8DA8',
      led: '#F3937B',
      onGround: '#FDE0C8',
      onGroundDim: '#F0D6EC',
      onPanelDim: '#6B3B5E',
    },
  },
  {
    id: 'doomsday',
    name: 'Latverian Steel',
    tagline: 'Inspired by Avengers Doomsday',
    c: {
      ground: '#121512',
      line: '#0A0D0A',
      ink: '#121512',
      panel: '#D5E3A3',
      a1: '#28D443',
      a2: '#D42329',
      led: '#28D443',
      onGround: '#D5E3A3',
      onGroundDim: '#8D9694',
      onPanelDim: '#506340',
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

/** Shared page accents sourced directly from the six card colourways. */
export const CHROME_ACCENTS = {
  '--chrome-lunar': THEMES[0].c.a2,
  '--chrome-matchday': THEMES[1].c.a1,
  '--chrome-vice': THEMES[2].c.a1,
  '--chrome-steel': THEMES[3].c.a1,
  '--chrome-volt': THEMES[4].c.a1,
  '--chrome-riso': THEMES[5].c.a1,
};

// Standard dimensions for the rendered export card
export const CARD_W = 1080;
export const CARD_H = 1440;

// Lamp brightness per activity level: unlit stays faint, every lit level clears the dark glass.
export const LED_STEPS = [0.09, 0.5, 0.7, 0.85, 1];

/** 0-4 intensity, same thresholds GitHub's own calendar reads as. */
function level(count: number): number {
  if (count <= 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 10) return 3;
  return 4;
}

/** Calendar days → week columns (Sunday on top), like GitHub's graph. */
export function toWeeks(calendar: Array<{ date?: string; count?: number }>): number[][] {
  const sorted = calendar
    .filter((d): d is { date: string; count: number } => typeof d.date === 'string')
    .sort((a, b) => a.date.localeCompare(b.date));
  const weeks: number[][] = [];
  let week: number[] = [];
  for (const day of sorted) {
    const dow = new Date(`${day.date}T00:00:00Z`).getUTCDay();
    if (dow === 0 && week.length > 0) {
      weeks.push(week);
      week = [];
    }
    while (week.length < dow) week.push(-1); // before the range starts
    week.push(level(day.count));
  }
  if (week.length) {
    while (week.length < 7) week.push(-1);
    weeks.push(week);
  }
  return weeks.slice(-53);
}
