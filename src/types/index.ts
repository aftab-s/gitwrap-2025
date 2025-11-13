import { z } from 'zod';

// User stats schema for 2025 data
export const userStatsSchema = z.object({
  login: z.string(),
  name: z.string().optional(),
  avatarUrl: z.string(),
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
  // New fields for growth indicators and anniversary
  githubAnniversary: z.number(), // Years since account creation
  yearOverYearGrowth: z.object({
    commitsGrowth: z.number(),
    prsGrowth: z.number(),
    issuesGrowth: z.number(),
    overallGrowth: z.number(),
  }).optional(),
});

export type UserStats = z.infer<typeof userStatsSchema>;

// Theme types
export const themeNames = ['space', 'sunset', 'retro', 'minimal', 'high-contrast'] as const;
export type ThemeName = typeof themeNames[number];

export const themeSchema = z.enum(themeNames);

// API response types
export type StatsAPIResponse =
  | { success: true; data: UserStats; cached?: boolean; stale?: boolean }
  | { success: false; error: string; code: 'NOT_FOUND' | 'RATE_LIMITED' | 'SERVER_ERROR' };
