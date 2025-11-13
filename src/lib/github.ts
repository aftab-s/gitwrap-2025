import { GraphQLClient } from 'graphql-request';
import type { UserStats } from '@/types';

// 2025 date range constants
export const YEAR_2025_START = '2025-01-01T00:00:00Z';
export const YEAR_2025_END = '2025-12-31T23:59:59Z';

// 2024 date range constants for comparison
export const YEAR_2024_START = '2024-01-01T00:00:00Z';
export const YEAR_2024_END = '2024-12-31T23:59:59Z';

const GITHUB_GRAPHQL_API = 'https://api.github.com/graphql';

// Create GraphQL client
export function createGitHubClient(token?: string) {
  const authToken = token || process.env.GITHUB_APP_TOKEN;
  
  // Token is optional - if missing, GitHub API allows 60 requests/hour (unauthenticated)
  // With token: 5,000 requests/hour
  const headers: Record<string, string> = {};
  
  if (authToken) {
    headers.authorization = `Bearer ${authToken}`;
  }

  return new GraphQLClient(GITHUB_GRAPHQL_API, {
    headers,
  });
}

// Main GraphQL query for 2025 data with 2024 comparison and account info
const YEAR_SUMMARY_QUERY = `
  query YearSummary($login: String!, $from2025: DateTime!, $to2025: DateTime!, $from2024: DateTime!, $to2024: DateTime!) {
    user(login: $login) {
      login
      name
      avatarUrl
      createdAt
      contributionsCollection2025: contributionsCollection(from: $from2025, to: $to2025) {
        totalCommitContributions
        totalIssueContributions
        totalPullRequestContributions
        totalPullRequestReviewContributions
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
            url
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
      contributionsCollection2024: contributionsCollection(from: $from2024, to: $to2024) {
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

interface GitHubAPIResponse {
  user: {
    login: string;
    name?: string;
    avatarUrl: string;
    createdAt: string;
    contributionsCollection2025: {
      totalCommitContributions: number;
      totalIssueContributions: number;
      totalPullRequestContributions: number;
      totalPullRequestReviewContributions: number;
      contributionCalendar: {
        totalContributions: number;
        weeks: Array<{
          contributionDays: Array<{
            date: string;
            contributionCount: number;
          }>;
        }>;
      };
      commitContributionsByRepository: Array<{
        repository: {
          name: string;
          url: string;
          stargazerCount: number;
          primaryLanguage?: {
            name: string;
            color: string;
          };
        };
        contributions: {
          totalCount: number;
        };
      }>;
    };
    contributionsCollection2024: {
      totalCommitContributions: number;
      totalIssueContributions: number;
      totalPullRequestContributions: number;
      totalPullRequestReviewContributions: number;
    };
    repositories: {
      nodes: Array<{
        name: string;
        url: string;
        stargazerCount: number;
        primaryLanguage?: {
          name: string;
          color: string;
        };
      }>;
    };
  };
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
  const dayCounts = new Array(7).fill(0);

  for (const day of calendar) {
    if (day.count > 0) {
      const date = new Date(day.date);
      const dayOfWeek = date.getDay();
      dayTotals[dayOfWeek] += day.count;
      dayCounts[dayOfWeek]++;
    }
  }

  // Find day with highest total contributions (not average, to favor consistency)
  const maxIndex = dayTotals.indexOf(Math.max(...dayTotals));
  
  // Return "Not enough data" if no contributions
  if (dayTotals[maxIndex] === 0) {
    return 'Not enough data';
  }
  
  return dayNames[maxIndex];
}

// Calculate best hour (heuristic based on contribution patterns)
function calculateBestHour(calendar: Array<{ date: string; count: number }>): number {
  // GitHub API doesn't provide hour-level data in contributionCalendar
  // We use a reasonable heuristic based on contribution patterns
  
  const totalContributions = calendar.reduce((sum, day) => sum + day.count, 0);
  
  if (totalContributions === 0) {
    return 14; // Default to 2 PM
  }
  
  // Count contributions by day of week
  const weekdayContributions = calendar.reduce((sum, day) => {
    const date = new Date(day.date);
    const dayOfWeek = date.getDay();
    // Weekdays (Mon-Fri) = 1-5
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      return sum + day.count;
    }
    return sum;
  }, 0);
  
  const weekendContributions = totalContributions - weekdayContributions;
  const weekdayRatio = weekdayContributions / totalContributions;
  
  // Heuristic mapping based on work patterns:
  // High weekday ratio (>0.7) = likely working hours (10 AM - 4 PM)
  // Balanced ratio = flexible hours (11 AM - 3 PM)
  // High weekend ratio = night owl or flexible (2 PM - 6 PM)
  
  const avgDailyContributions = totalContributions / Math.max(calendar.filter(d => d.count > 0).length, 1);
  
  if (weekdayRatio > 0.75) {
    // Strong weekday pattern - likely 9-5 job
    if (avgDailyContributions > 10) {
      return 14; // 2 PM - peak afternoon productivity
    } else {
      return 11; // 11 AM - late morning
    }
  } else if (weekdayRatio > 0.6) {
    // Balanced weekday/weekend
    return 15; // 3 PM - afternoon
  } else {
    // More weekend activity - flexible schedule
    if (avgDailyContributions > 5) {
      return 22; // 10 PM - evening coding
    } else {
      return 16; // 4 PM - late afternoon
    }
  }
}

// Aggregate top languages
function aggregateLanguages(
  repos: Array<{
    repository: {
      primaryLanguage?: { name: string; color: string };
    };
    contributions: { totalCount: number };
  }>
): Array<{ name: string; percent: number; color?: string }> {
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

  const total = Array.from(languageContributions.values()).reduce(
    (sum, lang) => sum + lang.count,
    0
  );

  if (total === 0) return [];

  return Array.from(languageContributions.entries())
    .map(([name, data]) => ({
      name,
      percent: data.count / total,
      color: data.color,
    }))
    .sort((a, b) => b.percent - a.percent)
    .slice(0, 3);
}

// Get top repositories by contributions
function getTopRepos(
  repos: Array<{
    repository: {
      name: string;
      url: string;
      stargazerCount: number;
    };
    contributions: { totalCount: number };
  }>
): Array<{ name: string; url: string; contributions: number; stargazers: number }> {
  return repos
    .filter(r => r.contributions.totalCount > 0)
    .map((r) => ({
      name: r.repository.name,
      url: r.repository.url,
      contributions: r.contributions.totalCount,
      stargazers: r.repository.stargazerCount,
    }))
    .sort((a, b) => b.contributions - a.contributions)
    .slice(0, 5);
}

// Calculate year-over-year growth percentages
function calculateYearOverYearGrowth(
  collection2025: {
    totalCommitContributions: number;
    totalIssueContributions: number;
    totalPullRequestContributions: number;
    totalPullRequestReviewContributions: number;
  },
  collection2024: {
    totalCommitContributions: number;
    totalIssueContributions: number;
    totalPullRequestContributions: number;
    totalPullRequestReviewContributions: number;
  }
): {
  commitsGrowth: number;
  prsGrowth: number;
  issuesGrowth: number;
  overallGrowth: number;
} | undefined {
  // Only calculate growth if 2024 has meaningful data
  const total2024 = collection2024.totalCommitContributions + collection2024.totalIssueContributions + collection2024.totalPullRequestContributions;
  const total2025 = collection2025.totalCommitContributions + collection2025.totalIssueContributions + collection2025.totalPullRequestContributions;

  // If 2024 has less than 10 total contributions, don't show growth (likely new user)
  if (total2024 < 10) {
    return undefined;
  }

  const commitsGrowth = collection2024.totalCommitContributions > 0
    ? ((collection2025.totalCommitContributions - collection2024.totalCommitContributions) / collection2024.totalCommitContributions) * 100
    : collection2025.totalCommitContributions > 0 ? 100 : 0;

  const prsGrowth = collection2024.totalPullRequestContributions > 0
    ? ((collection2025.totalPullRequestContributions - collection2024.totalPullRequestContributions) / collection2024.totalPullRequestContributions) * 100
    : collection2025.totalPullRequestContributions > 0 ? 100 : 0;

  const issuesGrowth = collection2024.totalIssueContributions > 0
    ? ((collection2025.totalIssueContributions - collection2024.totalIssueContributions) / collection2024.totalIssueContributions) * 100
    : collection2025.totalIssueContributions > 0 ? 100 : 0;

  const overallGrowth = total2024 > 0
    ? ((total2025 - total2024) / total2024) * 100
    : total2025 > 0 ? 100 : 0;

  return {
    commitsGrowth: Math.round(commitsGrowth),
    prsGrowth: Math.round(prsGrowth),
    issuesGrowth: Math.round(issuesGrowth),
    overallGrowth: Math.round(overallGrowth),
  };
}

// Fetch and normalize GitHub stats for 2025
export async function fetchGitHubStats(
  username: string,
  token?: string
): Promise<UserStats> {
  const client = createGitHubClient(token);

  try {
    const data = await client.request<GitHubAPIResponse>(YEAR_SUMMARY_QUERY, {
      login: username,
      from2025: YEAR_2025_START,
      to2025: YEAR_2025_END,
      from2024: YEAR_2024_START,
      to2024: YEAR_2024_END,
    });

    if (!data.user) {
      throw new Error('User not found');
    }

    const { user } = data;
    const collection2025 = user.contributionsCollection2025;
    const collection2024 = user.contributionsCollection2024;

    // Flatten contribution calendar
    const calendar = collection2025.contributionCalendar.weeks.flatMap((week) =>
      week.contributionDays.map((day) => ({
        date: day.date,
        count: day.contributionCount,
      }))
    );

    // Calculate derived stats
    const longestStreakDays = calculateLongestStreak(calendar);
    const bestDayOfWeek = calculateBestDayOfWeek(calendar);
    const bestHour = calculateBestHour(calendar);
    const topLanguages = aggregateLanguages(collection2025.commitContributionsByRepository);
    const topRepos = getTopRepos(collection2025.commitContributionsByRepository);

    // Count total stars given (heuristic: starred repos they own or contributed to)
    const totalStarsGiven = user.repositories.nodes.reduce(
      (sum, repo) => sum + repo.stargazerCount,
      0
    );

    // Total repositories (up to 100 fetched)
    const totalRepositories = user.repositories.nodes.length;

    // Calculate GitHub anniversary (years since account creation)
    const accountCreated = new Date(user.createdAt);
    const now = new Date();
    const githubAnniversary = Math.floor((now.getTime() - accountCreated.getTime()) / (1000 * 60 * 60 * 24 * 365));

    // Calculate year-over-year growth
    const yearOverYearGrowth = calculateYearOverYearGrowth(collection2025, collection2024);

    return {
      login: user.login,
      name: user.name,
      avatarUrl: user.avatarUrl,
      totalCommits: collection2025.totalCommitContributions,
      totalPRs: collection2025.totalPullRequestContributions,
      totalIssues: collection2025.totalIssueContributions,
      totalPRReviews: collection2025.totalPullRequestReviewContributions,
      totalStarsGiven,
      totalRepositories,
      topLanguages,
      topRepos,
      longestStreakDays,
      bestDayOfWeek,
      bestHour,
      contributionCalendar: calendar,
      githubAnniversary,
      yearOverYearGrowth,
    };
  } catch (error: any) {
    if (error.response?.errors?.[0]?.type === 'NOT_FOUND') {
      throw new Error('GitHub user not found');
    }
    if (error.response?.status === 403 || error.message?.includes('rate limit')) {
      throw new Error('GitHub API rate limit exceeded');
    }
    throw error;
  }
}
