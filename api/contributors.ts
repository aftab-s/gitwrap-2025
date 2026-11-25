import { json } from './_lib/session.js';
import { APP_REPO } from '../config.js';

export interface Contributor {
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
}

async function fetchRepoContributors(
  repo: string,
  token: string
): Promise<{ status: number; data: Contributor[] }> {
  const contributors: Contributor[] = [];
  const perPage = 100;

  for (let page = 1; page <= 5; page++) {
    const headers: Record<string, string> = {
      accept: 'application/vnd.github+json',
      'user-agent': 'gitwrap',
    };
    if (token) {
      headers.authorization = `Bearer ${token}`;
    }

    const res = await fetch(
      `https://api.github.com/repos/${repo}/contributors?per_page=${perPage}&page=${page}`,
      { headers }
    );

    if (!res.ok) {
      return { status: res.status, data: contributors };
    }

    const batch = (await res.json()) as Array<{
      login?: string;
      avatar_url?: string;
      html_url?: string;
      contributions?: number;
      type?: string;
    }>;

    if (!Array.isArray(batch) || batch.length === 0) break;

    for (const entry of batch) {
      if (!entry.login || entry.type === 'Bot' || entry.login.endsWith('[bot]')) continue;
      contributors.push({
        login: entry.login,
        avatar_url: entry.avatar_url || `https://avatars.githubusercontent.com/${entry.login}`,
        html_url: entry.html_url || `https://github.com/${entry.login}`,
        contributions: entry.contributions ?? 0,
      });
    }

    if (batch.length < perPage) break;
  }

  return { status: 200, data: contributors };
}

/**
 * GET /api/contributors
 *
 * Fetches repository contributors on the server using GITHUB_APP_TOKEN so client browsers
 * receive up-to-date contributors without hitting anonymous GitHub rate limits.
 * Cached at the Vercel edge for 1 hour with 24h stale-while-revalidate.
 */
export async function GET(): Promise<Response> {
  const repo = process.env.GITHUB_REPOSITORY || process.env.VITE_GITHUB_REPOSITORY || APP_REPO;
  const token = process.env.GITHUB_APP_TOKEN || '';

  try {
    let result = await fetchRepoContributors(repo, token);

    // Fallback to previous slug while the GitHub repo rename to aftab-s/gitwrap is pending.
    if (result.status === 404 && repo === 'aftab-s/gitwrap') {
      result = await fetchRepoContributors('aftab-s/gitwrap-2025', token);
    }

    if (result.status !== 200 && result.data.length === 0) {
      return json(
        { error: 'upstream', message: `GitHub API responded with ${result.status}` },
        { status: 502 }
      );
    }

    return json(
      { contributors: result.data },
      {
        headers: {
          'cache-control': 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    );
  } catch (err) {
    console.error('contributors failed:', err);
    return json({ error: 'upstream', message: 'Failed to fetch contributors' }, { status: 502 });
  }
}
