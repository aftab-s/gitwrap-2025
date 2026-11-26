// GitWrap 2026. The 2025 edition (old design) lives on its own, in the separate gitwrap project.

export interface Edition {
  year: number;
  /** Window the wrap covers. GitHub's contributionsCollection accepts at most ~1 year. */
  range: { from: string; to: string };
  /** Previous window, used for the year-over-year growth stat. */
  prevRange: { from: string; to: string };
}

export const EDITION: Edition = {
  year: 2026,
  range: { from: '2025-12-01T00:00:00Z', to: '2026-11-30T23:59:59Z' },
  prevRange: { from: '2024-12-01T00:00:00Z', to: '2025-11-30T23:59:59Z' },
};

export const APP_REPO = 'aftab-s/gitwrap';
export const APP_REPO_URL = `https://github.com/${APP_REPO}`;
export const APP_URL = 'https://www.gitwrap.tech';
