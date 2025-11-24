import React, { useEffect, useState } from 'react';

type Contributor = {
  login: string;
  avatar_url?: string;
  html_url?: string;
  contributions?: number;
};

const fallback: Contributor[] = [
  { login: 'aftab-s', avatar_url: 'https://avatars.githubusercontent.com/aftab-s', html_url: 'https://github.com/aftab-s' },
];

// Repository to query. Prefer Vite env var `VITE_GITHUB_REPOSITORY` (owner/repo),
// fallback to the current repo used in this codebase.
const _env = (import.meta as any).env || {};
const REPOSITORY = _env.VITE_GITHUB_REPOSITORY || 'aftab-s/gitwrap-2025';
const GITHUB_API = `https://api.github.com/repos/${REPOSITORY}/contributors?per_page=100`;

const CACHE_KEY = 'contributors-cache-v1';
const CACHE_TTL_MS = 1000 * 60 * 60; // 1 hour

const Contributors: React.FC = () => {
  const [contributors, setContributors] = useState<Contributor[] | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadFromPublicJson(): Promise<Contributor[] | null> {
      try {
        const res = await fetch('/contributors.json', { cache: 'no-store' });
        if (!res.ok) return null;
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      } catch (err) {
        // ignore
      }
      return null;
    }

    async function loadFromGitHubApi(): Promise<Contributor[] | null> {
      try {
        const token = _env.VITE_GITHUB_APP_TOKEN;
        const headers: Record<string, string> = { Accept: 'application/vnd.github+json' };
        if (token) headers.Authorization = `token ${token}`;
        const res = await fetch(GITHUB_API, { headers, cache: 'no-store' });
        if (!res.ok) return null;
        const data = await res.json();
        if (!Array.isArray(data) || data.length === 0) return null;
        // Map only required fields
        return data.map((d: any) => ({
          login: d.login,
          avatar_url: d.avatar_url,
          html_url: d.html_url,
          contributions: d.contributions,
        }));
      } catch (err) {
        return null;
      }
    }

    async function load() {
      // Try session cache first
      try {
        const raw = sessionStorage.getItem(CACHE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && parsed.ts && (Date.now() - parsed.ts) < CACHE_TTL_MS && Array.isArray(parsed.data)) {
            if (mounted) setContributors(parsed.data);
            return;
          }
        }
      } catch (err) {
        // ignore
      }

      // 1) public contributors.json (created at build/CI time)
      const publicData = await loadFromPublicJson();
      if (publicData && mounted) {
        setContributors(publicData);
        try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data: publicData })); } catch (e) {}
        return;
      }

      // 2) Try GitHub API (may be rate limited if unauthenticated).
      // Only attempt client-side GitHub API calls when explicitly allowed:
      // - running in development (`DEV`), or
      // - `VITE_GITHUB_APP_TOKEN` is present (explicit token), or
      // - `VITE_ALLOW_CLIENT_GITHUB` is set to 'true' (opt-in).
      const allowClientFetch = Boolean(_env.VITE_GITHUB_APP_TOKEN) || Boolean(_env.DEV) || _env.VITE_ALLOW_CLIENT_GITHUB === 'true';
      let ghData: Contributor[] | null = null;
      if (allowClientFetch) {
        ghData = await loadFromGitHubApi();
      } else {
        // In production without a public contributors.json and without client fetch permission,
        // we will not attempt an unauthenticated call to the GitHub API to avoid rate limits.
        // Instead, fall back to the static fallback list and let CI populate `public/contributors.json`.
        ghData = null;
      }
      if (ghData && mounted) {
        setContributors(ghData);
        try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data: ghData })); } catch (e) {}
        return;
      }

      // 3) Fallback
      if (mounted) setContributors(fallback);
    }

    load();
    return () => { mounted = false; };
  }, []);

  if (!contributors) {
    return (      <div className="flex items-center justify-center text-gray-400">Loading contributors…</div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto text-center">
      <h3 className="text-sm text-gray-300 font-semibold mb-3">Contributors</h3>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {contributors.map((c) => (
          <a
            key={c.login}
            href={c.html_url || `https://github.com/${c.login}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center text-xs text-gray-200 hover:opacity-90"
            title={c.login}
          >
            <img
              src={c.avatar_url || `https://avatars.githubusercontent.com/${c.login}`}
              alt={c.login}
              className="w-10 h-10 rounded-full ring-2 ring-white/10 shadow-sm"
              crossOrigin="anonymous"
            />
            <span className="mt-1">{c.login}</span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Contributors;
