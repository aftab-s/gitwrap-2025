import { z } from 'zod';

// Read from the user's own commits: when they commit, and which verb opens their messages.
export const commitInsightsSchema = z.object({
  analyzedCommits: z.number(),
  hours: z.array(z.number()), // 24 buckets, the committer's local hour
  moves: z.array(z.object({ name: z.string(), commits: z.number() })), // top three, most used first
});

export type CommitInsights = z.infer<typeof commitInsightsSchema>;

export const userStatsSchema = z.object({
  /** Edition this wrap was generated for (2025, 2026, …). */
  year: z.number(),
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
      isPrivate: z.boolean().optional(),
    })
  ),
  // True when the stats were fetched with the user's own OAuth token (private repos included).
  includesPrivate: z.boolean().optional(),
  // Contributions made in private repos (authenticated mode) or the anonymized private count
  // GitHub exposes publicly when the user enabled "Include private contributions on my profile".
  privateContributions: z.number().optional(),
  commitInsights: commitInsightsSchema.optional(),
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

/** A card colourway. See constants.ts for what each role means. */
export interface Theme {
  id: string;
  name: string;
  tagline?: string;
  c: {
    ground: string;
    line: string;
    ink: string;
    panel: string;
    a1: string;
    a2: string;
    led?: string;
    onGround: string;
    onGroundDim: string;
    onPanelDim: string;
  };
}

export enum AspectRatio {
  Social = '3:4',
}
