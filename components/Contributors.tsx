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
        const headers: Record<string, string> = { Accept: 'application/vnd.github+json' };
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
      // 1) Prioritize bundled static /contributors.json (instant, no rate-limits, zero 404s)
      const publicData = await loadFromPublicJson();
      if (publicData && mounted) {
        setContributors(publicData);
        try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data: publicData })); } catch (e) {}
        return;
      }

      // 2) Try session cache
      try {
        const raw = sessionStorage.getItem(CACHE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && parsed.ts && (Date.now() - parsed.ts) < CACHE_TTL_MS && Array.isArray(parsed.data)) {
            if (mounted) setContributors(parsed.data);
            return;
          }
        }
      } catch (err) {}

      // 3) Try GitHub API if explicitly enabled or if local JSON was absent
      const allowClientFetch = _env.VITE_ALLOW_CLIENT_GITHUB === 'true';
      if (allowClientFetch) {
        const ghData = await loadFromGitHubApi();
        if (ghData && mounted) {
          setContributors(ghData);
          try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data: ghData })); } catch (e) {}
          return;
        }
      }

      // 4) Final fallback
      if (mounted) setContributors(fallback);
    }

    load();
    return () => { mounted = false; };
  }, []);

  if (!contributors) return null;

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {contributors.map((c) => (
        <a
          key={c.login}
          href={c.html_url || `https://github.com/${c.login}`}
          target="_blank"
          rel="noopener noreferrer"
          title={c.contributions ? `${c.login} · ${c.contributions} ${c.contributions === 1 ? 'commit' : 'commits'}` : c.login}
        >
          <img
            className="avatar-sq"
            src={c.avatar_url || `https://avatars.githubusercontent.com/${c.login}`}
            alt={c.login}
            loading="lazy"
          />
        </a>
      ))}
    </div>
  );
};

export default Contributors;
