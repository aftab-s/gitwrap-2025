import { Redis } from '@upstash/redis';
import type { UserStats } from '../types';

// Initialize Redis client (for server-side usage)
// Client-side will skip caching if Redis is not available
let redisClient: Redis | null = null;

try {
  const redisUrl = (import.meta as any).env?.VITE_UPSTASH_REDIS_REST_URL || process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = (import.meta as any).env?.VITE_UPSTASH_REDIS_REST_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  
  if (redisUrl && redisToken) {
    redisClient = new Redis({
      url: redisUrl,
      token: redisToken,
    });
  }
} catch (error) {
  console.warn('Redis client initialization failed - caching disabled:', error);
}

const CACHE_KEY_PREFIX = 'gitwrap-stats-';
const CACHE_TTL_SECONDS = 15 * 60; // 15 minutes
const STALE_THRESHOLD_HOURS = 24; // Consider cache stale after 24 hours

export interface CachedStats {
  data: UserStats;
  timestamp: number;
  stale: boolean;
}

/**
 * Get cached stats from Redis
 */
export async function getCachedStats(username: string): Promise<CachedStats | null> {
  if (!redisClient) {
    return null;
  }

  try {
    const cacheKey = `${CACHE_KEY_PREFIX}${username.toLowerCase()}`;
    const cached = await redisClient.get(cacheKey);

    if (!cached) {
      return null;
    }

    const data = cached as UserStats & { timestamp?: number };
    const timestamp = data.timestamp || 0;
    const now = Date.now();
    const ageHours = (now - timestamp) / (1000 * 60 * 60);
    const stale = ageHours > STALE_THRESHOLD_HOURS;

    return {
      data: data as UserStats,
      timestamp,
      stale,
    };
  } catch (error) {
    console.error('Error reading from cache:', error);
    return null;
  }
}

/**
 * Set stats in Redis cache
 */
export async function setCachedStats(username: string, stats: UserStats): Promise<void> {
  if (!redisClient) {
    return;
  }

  try {
    const cacheKey = `${CACHE_KEY_PREFIX}${username.toLowerCase()}`;
    const dataWithTimestamp = {
      ...stats,
      timestamp: Date.now(),
    };

    await redisClient.setex(cacheKey, CACHE_TTL_SECONDS, JSON.stringify(dataWithTimestamp));
    console.log(`Cached stats for ${username} (${CACHE_TTL_SECONDS}s TTL)`);
  } catch (error) {
    console.error('Error writing to cache:', error);
    // Continue without cache if write fails
  }
}

/**
 * Clear cached stats for a user
 */
export async function clearCachedStats(username: string): Promise<void> {
  if (!redisClient) {
    return;
  }

  try {
    const cacheKey = `${CACHE_KEY_PREFIX}${username.toLowerCase()}`;
    await redisClient.del(cacheKey);
    console.log(`Cleared cache for ${username}`);
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
}
