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

    // Clear stale cache on mount to ensure fresh data
    try {
      sessionStorage.removeItem(CACHE_KEY);
    } catch (e) {}

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

      // 1) Prioritize GitHub API to get live, complete contributor list
      const allowClientFetch = Boolean(_env.VITE_GITHUB_APP_TOKEN) || Boolean(_env.DEV) || _env.VITE_ALLOW_CLIENT_GITHUB === 'true';
      let ghData: Contributor[] | null = null;
      if (allowClientFetch) {
        ghData = await loadFromGitHubApi();
      }
      if (ghData && mounted) {
        setContributors(ghData);
        try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data: ghData })); } catch (e) {}
        return;
      }

      // 2) Fallback to public contributors.json (static file, may be outdated)
      const publicData = await loadFromPublicJson();
      if (publicData && mounted) {
        setContributors(publicData);
        try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data: publicData })); } catch (e) {}
        return;
      }

      // 3) Final fallback
      if (mounted) setContributors(fallback);
    }

    load();
    return () => { mounted = false; };
  }, []);

  if (!contributors) {
    return (
      <div className="flex items-center justify-center text-gray-400">
        <div className="animate-pulse">Loading contributors…</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="text-center mb-6">
        <h3 className="text-xs uppercase tracking-widest text-gray-400 font-medium mb-1">
          Contributors
        </h3>
        <p className="text-sm text-gray-500">Amazing minds behind GitWrap</p>
      </div>
      
      <div className="flex items-center justify-center gap-4 flex-wrap">
        {contributors.map((c, idx) => (
          <a
            key={c.login}
            href={c.html_url || `https://github.com/${c.login}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative"
            title={`${c.login} • ${c.contributions || 0} contributions`}
          >
            <div className="relative">
              {/* Glow effect on hover */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300" />
              
              {/* Avatar with ring */}
              <div className="relative">
                <img
                  src={c.avatar_url || `https://avatars.githubusercontent.com/${c.login}`}
                  alt={c.login}
                  className="w-16 h-16 rounded-full ring-2 ring-white/20 group-hover:ring-4 group-hover:ring-purple-400/50 transition-all duration-300 group-hover:scale-105"
                  crossOrigin="anonymous"
                />
                
                {/* Contribution badge for top contributor - disabled for now */}
                {/* {idx === 0 && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg ring-2 ring-gray-900">
                    <span className="text-xs">⭐</span>
                  </div>
                )} */}
              </div>
            </div>
            
            {/* Username tooltip on hover */}
            <div className="absolute left-1/2 -translate-x-1/2 -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              <div className="bg-gray-900/95 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-lg shadow-xl border border-white/10 whitespace-nowrap">
                <div className="font-semibold">{c.login}</div>
                {c.contributions && (
                  <div className="text-gray-400 text-[10px]">{c.contributions} commits</div>
                )}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Contributors;
