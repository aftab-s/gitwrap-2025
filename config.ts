// Editions of GitWrap. The URL picks one: /2025 → the 2025 wrap, /2026 → the 2026 wrap.
// To add the next edition, add an entry here (and bump DEFAULT_YEAR when it should become the landing page).

export interface Edition {
  year: number;
  /** Window the wrap covers. GitHub's contributionsCollection accepts at most ~1 year. */
  range: { from: string; to: string };
  /** Previous window, used for the year-over-year growth stat. */
  prevRange: { from: string; to: string };
}

export const EDITIONS: Record<number, Edition> = {
  // Identical to the original GitWrap 2025 windows so numbers match cards people already shared.
  2025: {
    year: 2025,
    range: { from: '2024-12-01T00:00:00Z', to: '2025-12-01T23:59:59Z' },
    prevRange: { from: '2023-12-01T00:00:00Z', to: '2024-12-01T23:59:59Z' },
  },
  2026: {
    year: 2026,
    range: { from: '2025-12-01T00:00:00Z', to: '2026-11-30T23:59:59Z' },
    prevRange: { from: '2024-12-01T00:00:00Z', to: '2025-11-30T23:59:59Z' },
  },
};

export const DEFAULT_YEAR = 2026;
export const AVAILABLE_YEARS = Object.keys(EDITIONS).map(Number).sort((a, b) => a - b);

/** Parses a route/query value like "2025" into an Edition, or undefined if there is no such edition. */
export function getEdition(value: string | number | null | undefined): Edition | undefined {
  const year = typeof value === 'number' ? value : /^\d{4}$/.test(value ?? '') ? Number(value) : NaN;
  return EDITIONS[year];
}

export const APP_REPO = 'aftab-s/gitwrap-2026';
export const APP_REPO_URL = `https://github.com/${APP_REPO}`;
