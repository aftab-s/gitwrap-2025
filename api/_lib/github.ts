// SERVER-ONLY. Runs inside the /api functions; never imported by browser code.
import type { UserStats } from '../../types.js';
import { type Edition } from '../../config.js';
import { analyzeCommits, type Gql } from './commitAnalysis.js';

const GITHUB_GRAPHQL_API = 'https://api.github.com/graphql';

export class GitHubError extends Error {
  constructor(public code: 'not_found' | 'unauthorized' | 'rate_limited' | 'upstream', message: string) {
    super(message);
  }
}

// `token` is either the signed-in user's OAuth token or the app's shared token (GITHUB_APP_TOKEN).
function createGql(token: string): Gql {
  return async <T,>(query: string, variables: Record<string, unknown>): Promise<T> => {
    const resp = await fetch(GITHUB_GRAPHQL_API, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`,
        'content-type': 'application/json',
        'user-agent': 'gitwrap',
      },
      body: JSON.stringify({ query, variables }),
    });

    if (resp.status === 401) throw new GitHubError('unauthorized', 'GitHub rejected the token');
    if (resp.status === 403 || resp.status === 429) throw new GitHubError('rate_limited', 'GitHub API rate limit exceeded');
    if (!resp.ok) throw new GitHubError('upstream', `GitHub API responded with ${resp.status}`);

    const body = (await resp.json()) as { data?: T; errors?: Array<{ type?: string; message: string }> };
    const firstError = body.errors?.[0];
    if (firstError) {
      if (firstError.type === 'NOT_FOUND') throw new GitHubError('not_found', 'GitHub user not found');
      if (firstError.type === 'RATE_LIMITED') throw new GitHubError('rate_limited', 'GitHub API rate limit exceeded');
      // Partial data (e.g. one inaccessible repo) is still usable.
      if (!body.data) throw new GitHubError('upstream', firstError.message);
    }
    return body.data as T;
  };
}

const YEAR_SUMMARY_QUERY = `
  query YearSummary($login: String!, $from: DateTime!, $to: DateTime!, $prevFrom: DateTime!, $prevTo: DateTime!) {
    user(login: $login) {
      id
      login
      name
      avatarUrl
      createdAt
      current: contributionsCollection(from: $from, to: $to) {
        totalCommitContributions
        totalIssueContributions
        totalPullRequestContributions
        totalPullRequestReviewContributions
        restrictedContributionsCount
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
            }
          }
        }
        commitContributionsByRepository(maxRepositories: 100) {
          repository {
            name
            nameWithOwner
            url
            isPrivate
            stargazerCount
            primaryLanguage {
              name
              color
            }
          }
          contributions {
            totalCount
          }
        }
      }
      previous: contributionsCollection(from: $prevFrom, to: $prevTo) {
        totalCommitContributions
        totalIssueContributions
        totalPullRequestContributions
        totalPullRequestReviewContributions
      }
      repositories(first: 100, ownerAffiliations: OWNER, orderBy: {field: STARGAZERS, direction: DESC}) {
        nodes {
          name
          url
          stargazerCount
          primaryLanguage {
            name
            color
          }
        }
      }
    }
  }
`;

interface ContributionTotals {
  totalCommitContributions: number;
  totalIssueContributions: number;
  totalPullRequestContributions: number;
  totalPullRequestReviewContributions: number;
}

interface RepoContribution {
  repository: {
    name: string;
    nameWithOwner: string;
    url: string;
    isPrivate: boolean;
    stargazerCount: number;
    primaryLanguage?: { name: string; color: string };
  };
  contributions: { totalCount: number };
}

interface GitHubAPIResponse {
  user: {
    id: string;
    login: string;
    name?: string;
    avatarUrl: string;
    createdAt: string;
    current: ContributionTotals & {
      restrictedContributionsCount: number;
      contributionCalendar: {
        totalContributions: number;
        weeks: Array<{
          contributionDays: Array<{ date: string; contributionCount: number }>;
        }>;
      };
      commitContributionsByRepository: RepoContribution[];
    };
    previous: ContributionTotals;
    repositories: {
      nodes: Array<{
        name: string;
        url: string;
        stargazerCount: number;
        primaryLanguage?: { name: string; color: string };
      }>;
    };
  } | null;
}

// Calculate longest streak from contribution calendar
function calculateLongestStreak(calendar: Array<{ date: string; count: number }>): number {
  let maxStreak = 0;
  let currentStreak = 0;

  for (const day of calendar) {
    if (day.count > 0) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  }

  return maxStreak;
}

// Calculate best day of week
function calculateBestDayOfWeek(calendar: Array<{ date: string; count: number }>): string {
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayTotals = new Array(7).fill(0);

  for (const day of calendar) {
    if (day.count > 0) {
      // Calendar dates are plain YYYY-MM-DD; parse as UTC so the weekday doesn't shift with the viewer's timezone.
      const dayOfWeek = new Date(`${day.date}T00:00:00Z`).getUTCDay();
      dayTotals[dayOfWeek] += day.count;
    }
  }

  const maxIndex = dayTotals.indexOf(Math.max(...dayTotals));
  if (dayTotals[maxIndex] === 0) {
    return 'Not enough data';
  }
  return dayNames[maxIndex];
}

// Best hour from real commit timestamps, with a heuristic fallback when no commits could be read.
function calculateBestHour(calendar: Array<{ date: string; count: number }>, commitHours: number[]): number {
  if (commitHours.length > 0) {
    const hourCounts = new Array(24).fill(0);
    for (const hour of commitHours) hourCounts[hour]++;
    return hourCounts.indexOf(Math.max(...hourCounts));
  }

  const totalContributions = calendar.reduce((sum, day) => sum + day.count, 0);
  if (totalContributions === 0) {
    return 14; // Default to 2 PM
  }

  const weekdayContributions = calendar.reduce((sum, day) => {
    const dayOfWeek = new Date(`${day.date}T00:00:00Z`).getUTCDay();
    return dayOfWeek >= 1 && dayOfWeek <= 5 ? sum + day.count : sum;
  }, 0);

  const weekdayRatio = weekdayContributions / totalContributions;
  const avgDailyContributions = totalContributions / Math.max(calendar.filter(d => d.count > 0).length, 1);

  if (weekdayRatio > 0.75) return avgDailyContributions > 10 ? 14 : 11;
  if (weekdayRatio > 0.6) return 15;
  return avgDailyContributions > 5 ? 22 : 16;
}

// Aggregate top languages
function aggregateLanguages(repos: RepoContribution[]): Array<{ name: string; percent: number; color?: string }> {
  const languageContributions = new Map<string, { count: number; color?: string }>();

  for (const repo of repos) {
    if (repo.repository.primaryLanguage) {
      const { name, color } = repo.repository.primaryLanguage;
      const existing = languageContributions.get(name) || { count: 0, color };
      languageContributions.set(name, {
        count: existing.count + repo.contributions.totalCount,
        color,
      });
    }
  }

  const total = Array.from(languageContributions.values()).reduce((sum, lang) => sum + lang.count, 0);
  if (total === 0) return [];

  return Array.from(languageContributions.entries())
    .map(([name, data]) => ({
      name,
      percent: (data.count / total) * 100,
      color: data.color,
    }))
    .sort((a, b) => b.percent - a.percent)
    .slice(0, 3);
}

// Get top repositories by contributions
function getTopRepos(repos: RepoContribution[]) {
  return repos
    .filter(r => r.contributions.totalCount > 0)
    .map((r) => ({
      name: r.repository.name,
      url: r.repository.url,
      contributions: r.contributions.totalCount,
      stargazers: r.repository.stargazerCount,
      isPrivate: r.repository.isPrivate,
    }))
    .sort((a, b) => b.contributions - a.contributions)
    .slice(0, 5);
}

// Calculate year-over-year growth percentages
function calculateYearOverYearGrowth(current: ContributionTotals, previous: ContributionTotals) {
  const sum = (c: ContributionTotals) =>
    c.totalCommitContributions + c.totalIssueContributions + c.totalPullRequestContributions;
  const totalPrev = sum(previous);
  const totalCurr = sum(current);

  // Fewer than 10 contributions last year → likely a new user, growth would be meaningless
  if (totalPrev < 10) {
    return undefined;
  }

  const growth = (curr: number, prev: number) =>
    prev > 0 ? ((curr - prev) / prev) * 100 : curr > 0 ? 100 : 0;

  return {
    commitsGrowth: Math.round(growth(current.totalCommitContributions, previous.totalCommitContributions)),
    prsGrowth: Math.round(growth(current.totalPullRequestContributions, previous.totalPullRequestContributions)),
    issuesGrowth: Math.round(growth(current.totalIssueContributions, previous.totalIssueContributions)),
    overallGrowth: Math.round(growth(totalCurr, totalPrev)),
  };
}

export interface FetchStatsOptions {
  edition: Edition;
  /** The signed-in user's own OAuth token. When set, private repositories are included. */
  userToken?: string;
}

// Fetch and normalize GitHub stats for one edition (year)
export async function fetchGitHubStats(username: string, options: FetchStatsOptions): Promise<UserStats> {
  const { edition } = options;
  const RANGE = edition.range;
  const PREV_RANGE = edition.prevRange;
  const authenticated = Boolean(options.userToken);
  const token = options.userToken || process.env.GITHUB_APP_TOKEN;
  if (!token) {
    throw new GitHubError('unauthorized', 'GITHUB_APP_TOKEN is not configured on the server');
  }
  const client = createGql(token);

  {
    const data = await client<GitHubAPIResponse>(YEAR_SUMMARY_QUERY, {
      login: username,
      from: RANGE.from,
      to: RANGE.to,
      prevFrom: PREV_RANGE.from,
      prevTo: PREV_RANGE.to,
    });

    if (!data?.user) {
      throw new GitHubError('not_found', 'GitHub user not found');
    }

    const { user } = data;
    const { current, previous } = user;
    const repoContributions = current.commitContributionsByRepository;

    const calendar = current.contributionCalendar.weeks.flatMap((week) =>
      week.contributionDays.map((day) => ({ date: day.date, count: day.contributionCount }))
    );

    // Signed-in users get a deeper scan (their own rate limit budget); public lookups share the app
    // token, so keep them light.
    const analysis = await analyzeCommits(
      client,
      user.id,
      repoContributions
        .slice()
        .sort((a, b) => b.contributions.totalCount - a.contributions.totalCount)
        .map((r) => r.repository.nameWithOwner),
      RANGE,
      authenticated ? { maxRepos: 30, maxPagesPerRepo: 5 } : { maxRepos: 8, maxPagesPerRepo: 1 }
    ).catch((err) => {
      console.warn('Commit analysis failed, falling back to heuristics:', err);
      return { commitHours: [] as number[], commitInsights: undefined };
    });

    // Private contributions are calculated ONLY for an authenticated owner (their own OAuth token).
    // In the public view they are neither shown nor counted: GitHub folds an anonymous "private
    // contributions" number into the calendar when a user opted in on their profile, so we
    // subtract it from the headline total.
    const privateContributions = authenticated
      ? repoContributions
          .filter((r) => r.repository.isPrivate)
          .reduce((sum, r) => sum + r.contributions.totalCount, 0)
      : undefined;
    const totalContributions = authenticated
      ? current.contributionCalendar.totalContributions
      : Math.max(0, current.contributionCalendar.totalContributions - current.restrictedContributionsCount);

    // Sum of stargazers across the user's own repositories
    const totalStarsGiven = user.repositories.nodes.reduce((sum, repo) => sum + repo.stargazerCount, 0);

    const accountCreated = new Date(user.createdAt);
    const githubAnniversary = Math.floor((Date.now() - accountCreated.getTime()) / (1000 * 60 * 60 * 24 * 365));

    return {
      year: edition.year,
      login: user.login,
      name: user.name || user.login,
      avatarUrl: user.avatarUrl,
      totalContributions,
      totalCommits: current.totalCommitContributions,
      totalPRs: current.totalPullRequestContributions,
      totalIssues: current.totalIssueContributions,
      totalPRReviews: current.totalPullRequestReviewContributions,
      totalStarsGiven,
      totalRepositories: user.repositories.nodes.length,
      topLanguages: aggregateLanguages(repoContributions),
      topRepos: getTopRepos(repoContributions),
      longestStreakDays: calculateLongestStreak(calendar),
      bestDayOfWeek: calculateBestDayOfWeek(calendar),
      bestHour: calculateBestHour(calendar, analysis.commitHours),
      contributionCalendar: calendar,
      githubAnniversary,
      yearOverYearGrowth: calculateYearOverYearGrowth(current, previous),
      includesPrivate: authenticated,
      privateContributions,
      commitInsights: analysis.commitInsights,
    };
  }
}
