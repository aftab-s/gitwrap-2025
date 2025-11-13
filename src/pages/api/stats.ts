import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchGitHubStats } from '@/lib/github';
import { getCachedStats, setCachedStats } from '@/lib/cache';
import type { StatsAPIResponse } from '@/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<StatsAPIResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
      code: 'SERVER_ERROR',
    });
  }

  const { username, private: privateParam } = req.query;

  if (!username || typeof username !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Username is required',
      code: 'SERVER_ERROR',
    });
  }

  const usePrivateData = privateParam === 'true';

  try {
    // Check cache first
    const cached = await getCachedStats(username, usePrivateData);
    
    if (cached && !cached.stale) {
      return res.status(200).json({
        success: true,
        data: cached.data,
        cached: true,
      });
    }

    // If we have stale data and GitHub might be rate-limited, return stale data
    if (cached && cached.stale) {
  console.warn(`Using stale cache for ${username} as fallback`);
    }

    // Fetch fresh data from GitHub
    try {
      // TODO: If usePrivateData is true, get user token from session
      const userToken = usePrivateData ? undefined : undefined; // Placeholder for OAuth token
      
      const stats = await fetchGitHubStats(username, userToken);
      
      // Cache the results
      await setCachedStats(username, stats, usePrivateData);
      
      return res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (fetchError: any) {
      // If fetch fails but we have stale cache, return it with warning
      if (cached) {
        return res.status(200).json({
          success: true,
          data: cached.data,
          cached: true,
          stale: true,
        });
      }
      
      // Otherwise, re-throw the error
      throw fetchError;
    }
  } catch (error: any) {
    console.error('Error fetching GitHub stats:', error);

    // Handle specific error types
    if (error.message?.includes('not found')) {
      return res.status(404).json({
        success: false,
        error: 'GitHub user not found',
        code: 'NOT_FOUND',
      });
    }

    if (error.message?.includes('rate limit')) {
      return res.status(429).json({
        success: false,
        error: 'GitHub API rate limit exceeded. Please try again later.',
        code: 'RATE_LIMITED',
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      code: 'SERVER_ERROR',
    });
  }
}
