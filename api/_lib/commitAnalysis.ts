import type { AIStats } from '../../types.js';

/** Minimal GraphQL caller (see github.ts). */
export type Gql = <T>(query: string, variables: Record<string, unknown>) => Promise<T>;

/**
 * Walks the user's own commits (default branch of the repos they committed to in the wrap window)
 * and derives two things from them:
 *   1. commit hours  -> "best hour" stat
 *   2. AI signals    -> "AI co-authored" stat
 *
 * AI detection relies on the signatures that AI coding tools leave in commit messages, mostly
 * `Co-authored-by:` trailers (Claude Code, Copilot agent, Cursor agent, Codex, Aider, Jules, Devin...).
 * Inline autocomplete and copy/paste from a chat window leave no trace, so the result is a LOWER BOUND.
 */

// ---------------------------------------------------------------------------
// Detection rules
// ---------------------------------------------------------------------------

// Matched against the value of each `Co-authored-by:` trailer ("Name <email>").
// Patterns are deliberately specific so that a human co-author called e.g. "Claude Martin" is not flagged.
const CO_AUTHOR_RULES: Array<{ tool: string; match: RegExp }> = [
  { tool: 'Claude', match: /@anthropic\.com|claude\[bot\]|\bclaude[ -](code|opus|sonnet|haiku|fable|mythos|agent)\b/i },
  { tool: 'Copilot', match: /copilot/i },
  { tool: 'Cursor', match: /@cursor\.(com|sh)|cursor ?agent|cursor\[bot\]/i },
  { tool: 'Codex', match: /\bcodex\b|chatgpt|@openai\.com/i },
  { tool: 'Gemini', match: /gemini|google-labs-jules|jules\[bot\]/i },
  { tool: 'Aider', match: /\baider\b|aider\.chat/i },
  { tool: 'Devin', match: /devin-ai-integration|devin ai|@cognition/i },
  { tool: 'Windsurf', match: /windsurf|codeium/i },
  { tool: 'Amazon Q', match: /amazon ?q\b/i },
  { tool: 'Junie', match: /\bjunie\b/i },
];

// Matched against the whole commit message.
const MESSAGE_RULES: Array<{ tool: string; match: RegExp }> = [
  { tool: 'Claude', match: /generated with \[?claude code/i },
  { tool: 'Copilot', match: /generated (with|by) (github )?copilot/i },
  { tool: 'Aider', match: /^aider: /m },
];

const CO_AUTHOR_RE = /^co-authored-by:\s*(.+)$/gim;

/** Returns the AI tools detected in a commit message (empty array when none). */
export function detectAITools(message: string): string[] {
  const tools = new Set<string>();

  for (const m of message.matchAll(CO_AUTHOR_RE)) {
    const coAuthor = m[1];
    for (const rule of CO_AUTHOR_RULES) {
      if (rule.match.test(coAuthor)) tools.add(rule.tool);
    }
  }
  for (const rule of MESSAGE_RULES) {
    if (rule.match.test(message)) tools.add(rule.tool);
  }

  return [...tools];
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
                additions
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
  additions: number;
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
  aiStats?: AIStats;
}

// One huge commit (lockfile, vendored code, generated assets) should not dominate the line share.
const MAX_ADDITIONS_PER_COMMIT = 2000;

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
  const toolCounts = new Map<string, number>();
  let analyzedCommits = 0;
  let aiCommits = 0;
  let totalAdditions = 0;
  let aiAdditions = 0;

  for (const commits of perRepo) {
    for (const commit of commits) {
      if (commit.parents.totalCount > 1) continue; // skip merge commits

      analyzedCommits++;
      const additions = Math.min(commit.additions ?? 0, MAX_ADDITIONS_PER_COMMIT);
      totalAdditions += additions;

      // authoredDate keeps the committer's UTC offset (e.g. 2026-03-15T23:10:00+05:30),
      // so reading the hour straight from the string gives their local hour.
      const hourMatch = commit.authoredDate?.match(/T(\d{2}):/);
      if (hourMatch) commitHours.push(parseInt(hourMatch[1], 10));

      const tools = detectAITools(commit.message ?? '');
      if (tools.length > 0) {
        aiCommits++;
        aiAdditions += additions;
        for (const tool of tools) toolCounts.set(tool, (toolCounts.get(tool) ?? 0) + 1);
      }
    }
  }

  if (analyzedCommits === 0) {
    return { commitHours };
  }

  return {
    commitHours,
    aiStats: {
      analyzedCommits,
      aiCommits,
      commitShare: Math.round((aiCommits / analyzedCommits) * 100),
      totalAdditions,
      aiAdditions,
      lineShare: totalAdditions > 0 ? Math.round((aiAdditions / totalAdditions) * 100) : 0,
      tools: [...toolCounts.entries()]
        .map(([name, commits]) => ({ name, commits }))
        .sort((a, b) => b.commits - a.commits),
      reposScanned: targets.length,
    },
  };
}
