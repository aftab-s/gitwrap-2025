import { z } from 'zod';

// User stats schema matching github-unwrapped-2025
export const userStatsSchema = z.object({
  login: z.string(),
  name: z.string().optional(),
  avatarUrl: z.string(),
  totalContributions: z.number(),
  totalCommits: z.number(),
  totalPRs: z.number(),
  totalIssues: z.number(),
  totalPRReviews: z.number(),
  totalStarsGiven: z.number(),
  totalRepositories: z.number(),
  topLanguages: z.array(
    z.object({
      name: z.string(),
      percent: z.number(),
      color: z.string().optional(),
    })
  ),
  topRepos: z.array(
    z.object({
      name: z.string(),
      url: z.string(),
      contributions: z.number(),
      stargazers: z.number(),
    })
  ),
  longestStreakDays: z.number(),
  bestDayOfWeek: z.string(),
  bestHour: z.number(),
  contributionCalendar: z.array(
    z.object({
      date: z.string(),
      count: z.number(),
    })
  ),
  githubAnniversary: z.number(),
  yearOverYearGrowth: z.object({
    commitsGrowth: z.number(),
    prsGrowth: z.number(),
    issuesGrowth: z.number(),
    overallGrowth: z.number(),
  }).optional(),
});

export type UserStats = z.infer<typeof userStatsSchema>;

// Keep GitHubUserData as alias for backwards compatibility during migration
export type GitHubUserData = UserStats;

export interface Theme {
  name: string;
  classes: {
    bg: string;
    textPrimary: string;
    textSecondary: string;
    accent: string;
    highlight: string;
    heatmapColors: string[];
    bgImage?: string;
  };
}

export enum AspectRatio {
  Social = '3:4',
}

export enum CardLayout {
  Classic = 'Classic',
  Modern = 'Modern',
  Compact = 'Compact',
}
