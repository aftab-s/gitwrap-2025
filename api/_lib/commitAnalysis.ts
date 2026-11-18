import type { CommitInsights } from '../../types.js';

/** Minimal GraphQL caller (see github.ts). */
export type Gql = <T>(query: string, variables: Record<string, unknown>) => Promise<T>;

/**
 * Walks the user's own commits (default branch of the repos they committed to in the wrap window)
 * and derives two things from them:
 *   1. commit hours    -> "best hour" stat and the hour histogram
 *   2. signature moves -> which verb opens their commit messages most often
 *
 * Only a closed list of verbs is ever reported, so nothing from a commit message itself (which may
 * come from a private repository) can end up on a card.
 */

const MOVES: Array<{ name: string; match: RegExp }> = [
  { name: 'Fix', match: /^(fix|fixes|fixed|fixing|bugfix|hotfix|patch)$/ },
  { name: 'Add', match: /^(add|adds|added|adding|feat|feature|implement|implements|implemented|create|creates|created|introduce|new)$/ },
  { name: 'Update', match: /^(update|updates|updated|updating|bump|bumps|upgrade|upgrades|chore|improve|improves|tweak|tweaks|change|changes)$/ },
  { name: 'Remove', match: /^(remove|removes|removed|delete|deletes|deleted|drop|drops|cleanup|clean)$/ },
  { name: 'Refactor', match: /^(refactor|refactors|refactored|rename|renames|move|moves|simplify|rework|restructure)$/ },
  { name: 'Test', match: /^(test|tests|testing)$/ },
  { name: 'Docs', match: /^(docs|doc|document|documents|readme)$/ },
  { name: 'Revert', match: /^(revert|reverts|reverted)$/ },
  { name: 'WIP', match: /^(wip)$/ },
];

/** The move a commit message opens with ("fix(api): …" → Fix), or undefined when it is none of them. */
export function detectMove(message: string): string | undefined {
  const first = message.trimStart().match(/^[a-z]+/i)?.[0].toLowerCase();
  if (!first) return undefined;
  return MOVES.find((m) => m.match.test(first))?.name;
}

// ---------------------------------------------------------------------------
// Fetching
// ---------------------------------------------------------------------------

const REPO_HISTORY_QUERY = `
  query RepoHistory($owner: String!, $name: String!, $since: GitTimestamp!, $until: GitTimestamp!, $authorId: ID!, $after: String) {
    repository(owner: $owner, name: $name) {
      defaultBranchRef {
        target {
          ... on Commit {
            history(first: 100, after: $after, since: $since, until: $until, author: { id: $authorId }) {
              pageInfo { hasNextPage endCursor }
              nodes {
                message
                authoredDate
                parents { totalCount }
              }
            }
          }
        }
      }
    }
  }
`;

interface HistoryNode {
  message: string;
  authoredDate: string;
  parents: { totalCount: number };
}

interface RepoHistoryResponse {
  repository: {
    defaultBranchRef: {
      target: {
        history?: {
          pageInfo: { hasNextPage: boolean; endCursor: string | null };
          nodes: HistoryNode[];
        };
      };
    } | null;
  } | null;
}

export interface CommitAnalysisOptions {
  /** Max repositories to scan (most-contributed first). */
  maxRepos: number;
  /** Max 100-commit pages per repository. */
  maxPagesPerRepo: number;
  concurrency?: number;
}

export interface CommitAnalysis {
  commitHours: number[];
  commitInsights?: CommitInsights;
}

async function fetchRepoCommits(
  gql: Gql,
  nameWithOwner: string,
  authorId: string,
  range: { from: string; to: string },
  maxPages: number
): Promise<HistoryNode[]> {
  const [owner, name] = nameWithOwner.split('/');
  const commits: HistoryNode[] = [];
  let after: string | null = null;

  for (let page = 0; page < maxPages; page++) {
    const data: RepoHistoryResponse = await gql<RepoHistoryResponse>(REPO_HISTORY_QUERY, {
      owner,
      name,
      since: range.from,
      until: range.to,
      authorId,
      after,
    });
    const history = data.repository?.defaultBranchRef?.target?.history;
    if (!history) break;

    commits.push(...history.nodes);
    if (!history.pageInfo.hasNextPage) break;
    after = history.pageInfo.endCursor;
  }

  return commits;
}

/** Runs `worker` over `items` with at most `limit` in flight. Failures are swallowed per item. */
async function pool<T, R>(items: T[], limit: number, worker: (item: T) => Promise<R>): Promise<R[]> {
  const results: R[] = [];
  let next = 0;
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const item = items[next++];
      try {
        results.push(await worker(item));
      } catch (err) {
        console.warn('Commit history fetch failed for a repository:', err);
      }
    }
  });
  await Promise.all(runners);
  return results;
}

export async function analyzeCommits(
  gql: Gql,
  authorId: string,
  repos: string[], // nameWithOwner, ordered by contribution count desc
  range: { from: string; to: string },
  options: CommitAnalysisOptions
): Promise<CommitAnalysis> {
  const targets = repos.slice(0, options.maxRepos);
  const perRepo = await pool(targets, options.concurrency ?? 4, (repo) =>
    fetchRepoCommits(gql, repo, authorId, range, options.maxPagesPerRepo)
  );

  const commitHours: number[] = [];
  const moveCounts = new Map<string, number>();
  let analyzedCommits = 0;

  for (const commits of perRepo) {
    for (const commit of commits) {
      if (commit.parents.totalCount > 1) continue; // skip merge commits
      analyzedCommits++;

      // authoredDate keeps the committer's UTC offset (e.g. 2026-03-15T23:10:00+05:30),
      // so reading the hour straight from the string gives their local hour.
      const hourMatch = commit.authoredDate?.match(/T(\d{2}):/);
      if (hourMatch) commitHours.push(parseInt(hourMatch[1], 10));

      const move = detectMove(commit.message ?? '');
      if (move) moveCounts.set(move, (moveCounts.get(move) ?? 0) + 1);
    }
  }

  if (analyzedCommits === 0) {
    return { commitHours };
  }

  const hours = new Array(24).fill(0);
  for (const h of commitHours) hours[h]++;

  return {
    commitHours,
    commitInsights: {
      analyzedCommits,
      hours,
      moves: [...moveCounts.entries()]
        .map(([name, commits]) => ({ name, commits }))
        .sort((a, b) => b.commits - a.commits)
        .slice(0, 3),
    },
  };
}
