import type { UserStats } from './types';

/** Facts read straight off the contribution calendar. */
export interface CalendarFacts {
  days: number;
  activeDays: number;
  peak?: { date: string; count: number };
  streak?: { days: number; from: string; to: string };
  /** Sunday first. */
  weekdayTotals: number[];
  weekendShare: number;
}

export function calendarFacts(calendar: Array<{ date: string; count: number }>): CalendarFacts {
  const sorted = [...calendar].sort((a, b) => a.date.localeCompare(b.date));
  const weekdayTotals = new Array(7).fill(0);
  let total = 0;
  let activeDays = 0;
  let peak: CalendarFacts['peak'];
  let streak: CalendarFacts['streak'];
  let runStart = -1;

  sorted.forEach((day, i) => {
    if (day.count > 0) {
      total += day.count;
      activeDays++;
      weekdayTotals[new Date(`${day.date}T00:00:00Z`).getUTCDay()] += day.count;
      if (!peak || day.count > peak.count) peak = day;
      if (runStart < 0) runStart = i;
      const run = i - runStart + 1;
      if (!streak || run > streak.days) streak = { days: run, from: sorted[runStart].date, to: day.date };
    } else {
      runStart = -1;
    }
  });

  return {
    days: sorted.length,
    activeDays,
    peak,
    streak,
    weekdayTotals,
    weekendShare: total > 0 ? (weekdayTotals[0] + weekdayTotals[6]) / total : 0,
  };
}

export function formatDay(date: string): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString('en', { day: 'numeric', month: 'short', timeZone: 'UTC' });
}

export interface PlayerClass {
  name: string;
  /** A few words for the card, e.g. "41-day streak". */
  short: string;
  /** A full sentence for the recap. */
  line: string;
}

const pct = (share: number) => `${Math.round(share * 100)}%`;

/**
 * The class a player earned this year. Every candidate is scored against its own threshold from
 * real numbers, and the one cleared by the widest margin wins; nothing here is random.
 */
export function playerClass(stats: UserStats): PlayerClass {
  const total = stats.totalContributions;
  if (total < 30) {
    return { name: 'New Challenger', short: 'First score', line: 'A first score is on the board. The next one is yours to beat.' };
  }

  const facts = calendarFacts(stats.contributionCalendar);
  const insights = stats.commitInsights;
  const candidates: Array<PlayerClass & { score: number }> = [];
  const add = (score: number, c: PlayerClass) => candidates.push({ ...c, score });

  if (insights && insights.analyzedCommits >= 20) {
    const share = (from: number, to: number) => {
      let n = 0;
      for (let h = 0; h < 24; h++) if (from <= to ? h >= from && h <= to : h >= from || h <= to) n += insights.hours[h] ?? 0;
      return n / insights.analyzedCommits;
    };
    const late = share(22, 4);
    add(late / 0.3, { name: 'Night Owl', short: `${pct(late)} after 22:00`, line: `${pct(late)} of your commits landed after 22:00.` });
    const early = share(5, 8);
    add(early / 0.25, { name: 'Early Riser', short: `${pct(early)} before 09:00`, line: `${pct(early)} of your commits landed before 09:00.` });

    const top = insights.moves[0];
    if (top?.name === 'Fix') {
      const fixes = top.commits / insights.analyzedCommits;
      add(fixes / 0.35, { name: 'Bug Hunter', short: `${pct(fixes)} fixes`, line: `${pct(fixes)} of your commits fixed something.` });
    }
  }

  add(facts.weekendShare / 0.38, {
    name: 'Weekend Warrior',
    short: `${pct(facts.weekendShare)} on weekends`,
    line: `${pct(facts.weekendShare)} of your year happened on Saturdays and Sundays.`,
  });

  const streak = facts.streak?.days ?? 0;
  add(streak / 30, { name: 'Streak Keeper', short: `${streak}-day streak`, line: `You went ${streak} days without missing one.` });
  add(facts.activeDays / 240, {
    name: 'Marathoner',
    short: `${facts.activeDays} active days`,
    line: `You showed up on ${facts.activeDays} of ${facts.days} days.`,
  });

  add(stats.totalPRReviews / total / 0.25, {
    name: 'Code Reviewer',
    short: `${stats.totalPRReviews.toLocaleString()} reviews`,
    line: `You reviewed ${stats.totalPRReviews.toLocaleString()} pull requests for other people.`,
  });
  add(stats.totalPRs / total / 0.2, {
    name: 'PR Shipper',
    short: `${stats.totalPRs.toLocaleString()} pull requests`,
    line: `You opened ${stats.totalPRs.toLocaleString()} pull requests.`,
  });

  const langs = stats.topLanguages;
  if (langs.length >= 3 && langs[0].percent < 50) {
    add(50 / langs[0].percent, { name: 'Polyglot', short: `${langs.length} languages`, line: `Three languages, and none of them took half your year.` });
  }
  if (langs[0] && langs[0].percent >= 85) {
    add(langs[0].percent / 85, {
      name: 'Specialist',
      short: `${Math.round(langs[0].percent)}% ${langs[0].name}`,
      line: `${Math.round(langs[0].percent)}% of your year was ${langs[0].name}.`,
    });
  }
  if (facts.peak && total >= 100) {
    add(facts.peak.count / total / 0.08, {
      name: 'Sprinter',
      short: `${facts.peak.count} in one day`,
      line: `${facts.peak.count} contributions in a single day, on ${formatDay(facts.peak.date)}.`,
    });
  }

  const best = candidates.filter((c) => c.score >= 1).sort((a, b) => b.score - a.score)[0];
  return best ?? { name: 'All-Rounder', short: 'Balanced year', line: 'Commits, reviews, pull requests: no single habit ran your year.' };
}
