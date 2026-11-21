import type { UserStats } from './types';
import { EDITION } from './config';
import { calendarFacts } from './insights';

/**
 * Sample data for the demo card on the landing page. Every number here is invented and the page
 * labels the card as a sample; nothing in this file describes a real person or real usage.
 */

// An 8×8 pixel face as an inline SVG, so the demo needs no network request and no real avatar.
const PIXELS = ['..####..', '.######.', '##.##.##', '########', '##....##', '###..###', '.######.', '..#..#..'];
const rects = PIXELS.flatMap((row, y) =>
  [...row].map((ch, x) => (ch === '#' ? `<rect x='${x}' y='${y}' width='1' height='1'/>` : ''))
).join('');
const DEMO_AVATAR = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='-2 -2 12 12' shape-rendering='crispEdges'><rect x='-2' y='-2' width='12' height='12' fill='#FFD21F'/><g fill='#0B0D17'>${rects}</g></svg>`
)}`;

// Small deterministic generator so the sample calendar is the same on every load.
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

function demoCalendar(year: number) {
  const start = new Date(year === EDITION.year ? EDITION.range.from : `${year - 1}-12-01T00:00:00Z`);
  const rand = seeded(year);
  const days: Array<{ date: string; count: number }> = [];
  for (let i = 0; i < 364; i++) {
    const d = new Date(start.getTime() + i * 86400000);
    const weekend = d.getUTCDay() === 0 || d.getUTCDay() === 6;
    const r = rand();
    const busy = Math.sin(i / 23) > -0.2; // a few quiet stretches
    const count = !busy || r < (weekend ? 0.7 : 0.22) ? 0 : Math.round(r * r * (weekend ? 6 : 16));
    days.push({ date: d.toISOString().slice(0, 10), count });
  }
  return days;
}

export function demoStats(year: number): UserStats {
  const contributionCalendar = demoCalendar(year);
  // Everything below is derived from the calendar so the sample card's numbers agree with each other.
  const total = contributionCalendar.reduce((sum, d) => sum + d.count, 0);
  const prs = 96, issues = 41, reviews = 173;
  const commits = Math.max(total - prs - issues - reviews, 0);
  return {
    year,
    login: 'player-one',
    name: 'Sample Player',
    avatarUrl: DEMO_AVATAR,
    totalContributions: total,
    totalCommits: commits,
    totalPRs: prs,
    totalIssues: issues,
    totalPRReviews: reviews,
    totalStarsGiven: 212,
    totalRepositories: 27,
    topLanguages: [
      { name: 'TypeScript', percent: 52.4 },
      { name: 'Go', percent: 24.1 },
      { name: 'Python', percent: 14.5 },
      { name: 'Rust', percent: 9.0 },
    ],
    topRepos: [
      { name: 'coin-op', url: '', contributions: Math.round(commits * 0.6), stargazers: 88 },
      { name: 'high-score-api', url: '', contributions: Math.round(commits * 0.25), stargazers: 31 },
      { name: 'dotfiles', url: '', contributions: Math.round(commits * 0.1), stargazers: 4 },
    ],
    longestStreakDays: calendarFacts(contributionCalendar).streak?.days ?? 0,
    bestDayOfWeek: 'Wednesday',
    bestHour: 16,
    contributionCalendar,
    githubAnniversary: 6,
    yearOverYearGrowth: { commitsGrowth: 18, prsGrowth: 9, issuesGrowth: -4, overallGrowth: 14 },
    includesPrivate: false,
    commitInsights: {
      analyzedCommits: commits,
      hours: [2, 0, 0, 0, 0, 0, 3, 9, 22, 41, 58, 63, 37, 49, 70, 81, 96, 74, 40, 28, 33, 26, 14, 6].map((h) => Math.round((h * commits) / 752)),
      moves: [
        { name: 'Fix', commits: Math.round(commits * 0.31) },
        { name: 'Add', commits: Math.round(commits * 0.27) },
        { name: 'Refactor', commits: Math.round(commits * 0.12) },
      ],
    },
  };
}

export const DEMO_MESSAGE = 'player-one reviewed 173 pull requests and still shipped 96 of their own.';
