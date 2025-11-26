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
      <div className="flex items-center justify-center py-4 text-gray-500">
        <div className="animate-pulse text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Contributors</h2>
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-purple-500/30 transition-all duration-500 group/container">
        <p className="text-sm text-gray-400 mb-5 text-center">
          Built with 💜
        </p>
        
        <div className="flex items-center justify-center gap-3 flex-wrap">
          {contributors.map((c, idx) => (
            <a
              key={c.login}
              href={c.html_url || `https://github.com/${c.login}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative"
            >
              {/* Avatar container */}
              <div className="relative w-14 h-14 rounded-full transition-all duration-300">
                {/* Gradient border ring on hover */}
                <div className="absolute -inset-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" style={{
                  backgroundImage: 'linear-gradient(90deg, #06b6d4 0%, #34d399 20%, #fb923c 40%, #ec4899 60%, #38bdf8 80%, #64748b 100%)'
                }} />
                
                <div className="absolute -inset-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{
                  backgroundImage: 'linear-gradient(90deg, #06b6d4 0%, #34d399 20%, #fb923c 40%, #ec4899 60%, #38bdf8 80%, #64748b 100%)'
                }} />
                
                {/* Inner container */}
                <div className="relative w-full h-full rounded-full overflow-hidden ring-2 ring-white/10 group-hover:ring-0 transition-all duration-300">
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-pink-500/0 to-blue-500/0 group-hover:from-purple-500/20 group-hover:via-pink-500/20 group-hover:to-blue-500/20 transition-all duration-500" />
                
                {/* Avatar image */}
                <img
                  src={c.avatar_url || `https://avatars.githubusercontent.com/${c.login}`}
                  alt={c.login}
                  className="relative w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"
                  crossOrigin="anonymous"
                />
                </div>
              </div>
              
              {/* Hover tooltip */}
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transition-all duration-200 pointer-events-none z-10">
                <div className="bg-gradient-to-br from-purple-900/95 to-gray-900/95 backdrop-blur-md text-white px-3 py-2 rounded-lg shadow-2xl border border-purple-500/30 whitespace-nowrap">
                  <div className="font-semibold text-sm">{c.login}</div>
                  {c.contributions && (
                    <div className="text-purple-300 text-xs mt-0.5 flex items-center gap-1">
                      <span className="opacity-60">✨</span>
                      {c.contributions} {c.contributions === 1 ? 'commit' : 'commits'}
                    </div>
                  )}
                </div>
                {/* Arrow pointer */}
                <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-2 h-2 bg-purple-900/95 rotate-45 border-l border-t border-purple-500/30" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Contributors;
