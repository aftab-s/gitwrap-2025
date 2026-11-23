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

export function calendarFacts(calendar: Array<{ date?: string; count?: number }>): CalendarFacts {
  const sorted = calendar
    .filter((d): d is { date: string; count: number } => typeof d.date === 'string')
    .sort((a, b) => a.date.localeCompare(b.date));
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

export function formatHour(h?: number): string {
  if (h === undefined || h < 0) return '—';
  return `${String(h).padStart(2, '0')}:00`;
}

export interface ClassProofMetric {
  label: string;
  value: string;
  hint?: string;
}

export interface PlayerClass {
  name: string;
  badge: string;
  /** A few words for the card, e.g. "41-day streak". */
  short: string;
  /** A full sentence for the recap. */
  line: string;
  /** The specific metrics and formula proving why you earned this class. */
  proof: {
    headline: string;
    formula: string;
    metrics: ClassProofMetric[];
  };
}

const pct = (share: number) => `${Math.round(share * 100)}%`;

/**
 * The class a player earned this year. Every candidate is scored against its own threshold from
 * real numbers, and the one cleared by the widest margin wins; nothing here is random.
 */
export function playerClass(stats: UserStats): PlayerClass {
  const total = stats.totalContributions;
  const facts = calendarFacts(stats.contributionCalendar);
  const uptime = facts.days > 0 ? Math.round((facts.activeDays / facts.days) * 100) : 0;
  const insights = stats.commitInsights;
  const langs = stats.topLanguages;

  if (total < 30) {
    return {
      name: 'New Challenger',
      badge: 'LEVEL 1 ROOKIE',
      short: 'First score',
      line: 'A first score is on the board. The next one is yours to beat.',
      proof: {
        headline: `Put up your first ${total.toLocaleString()} contributions on the scoreboard`,
        formula: 'Unlocked at <30 contributions: The beginning of your quest',
        metrics: [
          { label: 'Debut Score', value: `${total.toLocaleString()} total`, hint: 'All-time contributions logged' },
          { label: 'Commits Logged', value: `${stats.totalCommits.toLocaleString()}`, hint: 'Code revisions pushed' },
          { label: 'Next Rank Goal', value: '30 contributions', hint: 'Threshold to unlock advanced classes' },
          { label: 'Arcade Status', value: 'Player 1 Ready', hint: 'Stage set for 2027' },
        ],
      },
    };
  }

  const candidates: Array<PlayerClass & { score: number }> = [];
  const add = (score: number, c: PlayerClass) => candidates.push({ ...c, score });

  // 1. Time-of-day candidates
  if (insights && insights.analyzedCommits >= 20) {
    const countHours = (from: number, to: number) => {
      let n = 0;
      for (let h = 0; h < 24; h++) if (from <= to ? h >= from && h <= to : h >= from || h <= to) n += insights.hours[h] ?? 0;
      return n;
    };

    const lateCount = countHours(22, 4);
    const late = lateCount / insights.analyzedCommits;
    add(late / 0.3, {
      name: 'Night Owl',
      badge: 'MIDNIGHT CODER',
      short: `${pct(late)} after 22:00`,
      line: `${pct(late)} of your commits landed after 22:00.`,
      proof: {
        headline: `${pct(late)} of your commits landed in the dead of night (22:00–04:00)`,
        formula: `Threshold: >30% late-night share (You achieved ${pct(late)})`,
        metrics: [
          { label: 'Night Shift Share', value: pct(late), hint: 'Commits pushed between 22:00 and 04:00' },
          { label: 'Midnight Volume', value: `${lateCount.toLocaleString()} commits`, hint: 'Total late-night commits recorded' },
          { label: 'Witching Hour', value: formatHour(stats.bestHour), hint: 'Your overall peak coding hour' },
          { label: 'Top Night Day', value: stats.bestDayOfWeek, hint: 'Most active day for late coding sessions' },
        ],
      },
    });

    const earlyCount = countHours(5, 8);
    const early = earlyCount / insights.analyzedCommits;
    add(early / 0.25, {
      name: 'Early Riser',
      badge: 'DAWN PATROL',
      short: `${pct(early)} before 09:00`,
      line: `${pct(early)} of your commits landed before 09:00.`,
      proof: {
        headline: `${pct(early)} of your commits shipped at dawn before 09:00 AM`,
        formula: `Threshold: >25% dawn share (You achieved ${pct(early)})`,
        metrics: [
          { label: 'Dawn Patrol Share', value: pct(early), hint: 'Commits pushed between 05:00 and 09:00' },
          { label: 'Morning Commits', value: `${earlyCount.toLocaleString()} commits`, hint: 'Commits shipped before breakfast' },
          { label: 'Sunrise Peak', value: formatHour(stats.bestHour), hint: 'Your most productive morning hour' },
          { label: 'Morning Cadence', value: stats.bestDayOfWeek, hint: 'Day with strongest morning rhythm' },
        ],
      },
    });

    const topMove = insights.moves[0];
    if (topMove?.name === 'Fix') {
      const fixCount = topMove.commits;
      const fixes = fixCount / insights.analyzedCommits;
      add(fixes / 0.35, {
        name: 'Bug Hunter',
        badge: 'PATCH MASTER',
        short: `${pct(fixes)} fixes`,
        line: `${pct(fixes)} of your commits fixed something.`,
        proof: {
          headline: `${pct(fixes)} of your commits were dedicated bug fixes and hotfixes`,
          formula: `Threshold: >35% fixes + top verb Fix (You achieved ${pct(fixes)})`,
          metrics: [
            { label: 'Fix Ratio', value: pct(fixes), hint: 'Commits squashing bugs or patching errors' },
            { label: 'Confirmed Fixes', value: `${fixCount.toLocaleString()} patches`, hint: 'Commits starting with fix / patch' },
            { label: 'Signature Verb', value: `"${topMove.name}"`, hint: 'Your #1 opening commit keyword' },
            { label: 'Total Commits', value: `${stats.totalCommits.toLocaleString()}`, hint: 'Total commits across all repos' },
          ],
        },
      });
    }
  }

  // 2. Weekend Warrior
  const weekendCount = facts.weekdayTotals[0] + facts.weekdayTotals[6];
  const peakWeekendDay = facts.weekdayTotals[6] >= facts.weekdayTotals[0] ? 'Saturdays' : 'Sundays';
  add(facts.weekendShare / 0.38, {
    name: 'Weekend Warrior',
    badge: 'OFF-HOURS HACKER',
    short: `${pct(facts.weekendShare)} on weekends`,
    line: `${pct(facts.weekendShare)} of your year happened on Saturdays and Sundays.`,
    proof: {
      headline: `${pct(facts.weekendShare)} of your coding year landed on Saturdays and Sundays`,
      formula: `Threshold: >38% weekend share (You achieved ${pct(facts.weekendShare)})`,
      metrics: [
        { label: 'Weekend Share', value: pct(facts.weekendShare), hint: 'Activity on Saturdays and Sundays' },
        { label: 'Weekend Volume', value: `${weekendCount.toLocaleString()}`, hint: 'Contributions made on weekends' },
        { label: 'Preferred Day', value: peakWeekendDay, hint: 'Stronger day between Saturday & Sunday' },
        { label: 'Weekday Share', value: pct(Math.max(0, 1 - facts.weekendShare)), hint: 'Monday through Friday activity' },
      ],
    },
  });

  // 3. Streak Keeper
  const streak = facts.streak?.days ?? 0;
  add(streak / 30, {
    name: 'Streak Keeper',
    badge: 'COMBO MASTER',
    short: `${streak}-day streak`,
    line: `You went ${streak} days without missing one.`,
    proof: {
      headline: `Maintained a continuous ${streak}-day combo without missing a single day`,
      formula: `Threshold: >30 consecutive days (You hit ${streak} days)`,
      metrics: [
        { label: 'Unbroken Combo', value: `${streak} days`, hint: 'Longest consecutive daily run' },
        {
          label: 'Streak Window',
          value: facts.streak ? `${formatDay(facts.streak.from)} → ${formatDay(facts.streak.to)}` : 'Active',
          hint: 'Exact dates of your combo streak',
        },
        { label: 'Year Consistency', value: `${uptime}% of year`, hint: `${facts.activeDays} active calendar days total` },
        { label: 'Combo Misses', value: '0', hint: 'Zero missed days during peak run' },
      ],
    },
  });

  // 4. Marathoner
  add(facts.activeDays / 240, {
    name: 'Marathoner',
    badge: 'ENDURANCE RUNNER',
    short: `${facts.activeDays} active days`,
    line: `You showed up on ${facts.activeDays} of ${facts.days} days.`,
    proof: {
      headline: `Showed up on ${facts.activeDays} of ${facts.days} calendar days (${uptime}% uptime)`,
      formula: `Threshold: >240 active days (You achieved ${facts.activeDays} days)`,
      metrics: [
        { label: 'Year Attendance', value: `${facts.activeDays} / ${facts.days} days`, hint: `${uptime}% of the entire year active` },
        { label: 'Rest Days Taken', value: `${Math.max(0, facts.days - facts.activeDays)} days`, hint: 'Off-grid days all year' },
        { label: 'Longest Run', value: `${facts.streak?.days ?? 0} days`, hint: 'Peak unbroken daily streak' },
        { label: 'Year Contributions', value: `${total.toLocaleString()}`, hint: 'Total volume logged this year' },
      ],
    },
  });

  // 5. Code Reviewer
  const reviewRatio = stats.totalPRs > 0 ? (stats.totalPRReviews / stats.totalPRs).toFixed(1) : `${stats.totalPRReviews}`;
  add(stats.totalPRReviews / total / 0.25, {
    name: 'Code Reviewer',
    badge: 'GUARDIAN OF THE REPO',
    short: `${stats.totalPRReviews.toLocaleString()} reviews`,
    line: `You reviewed ${stats.totalPRReviews.toLocaleString()} pull requests for other people.`,
    proof: {
      headline: `Reviewed ${stats.totalPRReviews.toLocaleString()} PRs, making reviews ${pct(stats.totalPRReviews / total)} of your activity`,
      formula: `Threshold: >25% review share (You achieved ${pct(stats.totalPRReviews / total)})`,
      metrics: [
        { label: 'PR Reviews Given', value: `${stats.totalPRReviews.toLocaleString()}`, hint: 'Pull requests reviewed and approved' },
        { label: 'Review Share', value: pct(stats.totalPRReviews / total), hint: 'Percentage of all your contributions' },
        { label: 'Review-to-PR Ratio', value: `${reviewRatio}x`, hint: 'Reviews completed per personal PR' },
        { label: 'Personal PRs', value: `${stats.totalPRs.toLocaleString()}`, hint: 'Pull requests authored by you' },
      ],
    },
  });

  // 6. PR Shipper
  const weeklyPrCadence = (stats.totalPRs / 52).toFixed(1);
  add(stats.totalPRs / total / 0.2, {
    name: 'PR Shipper',
    badge: 'FEATURE DISPATCHER',
    short: `${stats.totalPRs.toLocaleString()} pull requests`,
    line: `You opened ${stats.totalPRs.toLocaleString()} pull requests.`,
    proof: {
      headline: `Shipped ${stats.totalPRs.toLocaleString()} pull requests, averaging ${weeklyPrCadence} PRs every week`,
      formula: `Threshold: >20% PR share (You achieved ${pct(stats.totalPRs / total)})`,
      metrics: [
        { label: 'Pull Requests', value: `${stats.totalPRs.toLocaleString()}`, hint: 'Total PRs opened across all repos' },
        { label: 'PR Activity Share', value: pct(stats.totalPRs / total), hint: 'Share of your total contribution board' },
        { label: 'Shipping Cadence', value: `${weeklyPrCadence} PRs / week`, hint: 'Average delivery frequency' },
        { label: 'Total Commits', value: `${stats.totalCommits.toLocaleString()}`, hint: 'Commits backing your pull requests' },
      ],
    },
  });

  // 7. Polyglot
  if (langs.length >= 3 && langs[0].percent < 50) {
    add(50 / langs[0].percent, {
      name: 'Polyglot',
      badge: 'MULTI-STACK HACKER',
      short: `${langs.length} languages`,
      line: `Three languages, and none of them took half your year.`,
      proof: {
        headline: `Spread code across ${langs.length} languages with no single stack exceeding 50%`,
        formula: `Threshold: 3+ languages with <50% top stack (Top: ${Math.round(langs[0].percent)}%)`,
        metrics: [
          { label: 'Active Languages', value: `${langs.length} languages`, hint: 'Distinct primary repo languages' },
          { label: 'Primary Language', value: `${langs[0].name} (${Math.round(langs[0].percent)}%)`, hint: 'Largest single language share' },
          { label: 'Secondary Language', value: `${langs[1]?.name ?? '—'} (${Math.round(langs[1]?.percent ?? 0)}%)`, hint: 'Second largest language share' },
          { label: 'Dominance Cap', value: '< 50% max', hint: 'Versatile, multi-discipline loadout' },
        ],
      },
    });
  }

  // 8. Specialist
  if (langs[0] && langs[0].percent >= 85) {
    add(langs[0].percent / 85, {
      name: 'Specialist',
      badge: 'DOMAIN ARCHITECT',
      short: `${Math.round(langs[0].percent)}% ${langs[0].name}`,
      line: `${Math.round(langs[0].percent)}% of your year was ${langs[0].name}.`,
      proof: {
        headline: `${Math.round(langs[0].percent)}% of your entire coding year was focused on ${langs[0].name}`,
        formula: `Threshold: >85% dedication to one language (You achieved ${Math.round(langs[0].percent)}%)`,
        metrics: [
          { label: 'Specialty Stack', value: langs[0].name, hint: 'Your undisputed primary discipline' },
          { label: 'Dominance Ratio', value: `${Math.round(langs[0].percent)}%`, hint: 'Percentage of all repository activity' },
          { label: 'Total Commits', value: `${stats.totalCommits.toLocaleString()}`, hint: `Commits focused on ${langs[0].name}` },
          { label: 'All Other Stacks', value: `${Math.round(100 - langs[0].percent)}%`, hint: 'Remaining language footprint' },
        ],
      },
    });
  }

  // 9. Sprinter
  if (facts.peak && total >= 100) {
    add(facts.peak.count / total / 0.08, {
      name: 'Sprinter',
      badge: 'BURST OVERCLOCKER',
      short: `${facts.peak.count} in one day`,
      line: `${facts.peak.count} contributions in a single day, on ${formatDay(facts.peak.date)}.`,
      proof: {
        headline: `Ignited an all-time peak of ${facts.peak.count} contributions in a single 24-hour day`,
        formula: `Threshold: >8% of year's total in 1 day (You achieved ${pct(facts.peak.count / total)})`,
        metrics: [
          { label: 'Peak Burst Record', value: `${facts.peak.count} in 1 day`, hint: 'All-time single-day high score' },
          { label: 'The Sprint Date', value: formatDay(facts.peak.date), hint: 'Your most explosive day on GitHub' },
          { label: 'Share of Year', value: pct(facts.peak.count / total), hint: 'Percentage of entire year in 24h' },
          { label: 'Year Total', value: `${total.toLocaleString()}`, hint: 'Full annual volume logged' },
        ],
      },
    });
  }

  // 10. All-Rounder (Default / Balanced)
  const best = candidates.filter((c) => c.score >= 1).sort((a, b) => b.score - a.score)[0];
  if (best) return best;

  return {
    name: 'All-Rounder',
    badge: 'VERSATILE GENERALIST',
    short: 'Balanced year',
    line: 'Commits, reviews, pull requests: no single habit ran your year.',
    proof: {
      headline: `You balanced ${stats.totalCommits.toLocaleString()} commits, ${stats.totalPRs} pull requests, and ${stats.totalPRReviews} reviews in close equilibrium.`,
      formula: 'Equilibrium Tier: Commits, pull requests & reviews in steady harmony',
      metrics: [
        {
          label: 'Contribution Mix',
          value: `${stats.totalCommits}c · ${stats.totalPRs}pr · ${stats.totalPRReviews}r`,
          hint: 'Commits, pull requests & reviews',
        },
        { label: 'Active Stamina', value: `${facts.activeDays} / ${facts.days} days`, hint: `${uptime}% calendar attendance` },
        { label: 'Max Combo', value: `${facts.streak?.days ?? 0} days`, hint: 'Longest continuous daily streak' },
        {
          label: 'Core Stack',
          value: langs[0] ? `${langs[0].name} (${Math.round(langs[0].percent)}%)` : 'Balanced',
          hint: 'Primary programming language',
        },
      ],
    },
  };
}
