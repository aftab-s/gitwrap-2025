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

const CACHE_KEY = 'contributors-cache-v2';
const CACHE_TTL_MS = 1000 * 60 * 30; // 30 minutes

const Contributors: React.FC = () => {
  const [contributors, setContributors] = useState<Contributor[] | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadFromPublicJson(): Promise<Contributor[] | null> {
      try {
        const res = await fetch('/contributors.json');
        if (!res.ok) return null;
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      } catch {
        // ignore
      }
      return null;
    }

    async function loadFromServerApi(): Promise<Contributor[] | null> {
      try {
        const res = await fetch('/api/contributors');
        if (!res.ok) return null;
        const payload = await res.json();
        if (Array.isArray(payload?.contributors) && payload.contributors.length > 0) {
          return payload.contributors;
        }
      } catch {
        // ignore
      }
      return null;
    }

    async function load() {
      // 1) Check fresh session cache first for instant paint.
      let hasFreshCache = false;
      try {
        const raw = sessionStorage.getItem(CACHE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed?.ts && Date.now() - parsed.ts < CACHE_TTL_MS && Array.isArray(parsed.data) && parsed.data.length > 0) {
            if (mounted) setContributors(parsed.data);
            hasFreshCache = true;
          }
        }
      } catch {
        // ignore storage errors
      }

      if (hasFreshCache) return;

      // 2) Seed immediately from bundled /contributors.json while fetching live list.
      const seedData = await loadFromPublicJson();
      if (seedData && mounted) {
        setContributors(seedData);
      }

      // 3) Fetch live up-to-date contributors from /api/contributors.
      const liveData = await loadFromServerApi();
      if (liveData && mounted) {
        setContributors(liveData);
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data: liveData }));
        } catch {
          // ignore
        }
        return;
      }

      // 4) Fallback only if neither static seed nor live API returned results.
      if (!seedData && mounted) {
        setContributors(fallback);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  if (!contributors) return null;

  return (
    <div className="contributors-grid">
      {contributors.map((c) => (
        <a
          key={c.login}
          href={c.html_url || `https://github.com/${c.login}`}
          target="_blank"
          rel="noopener noreferrer"
          className="contributor-item"
          aria-label={`${c.login}${c.contributions ? ` · ${c.contributions} ${c.contributions === 1 ? 'commit' : 'commits'}` : ''}`}
        >
          <img
            className="avatar-sq contributor-avatar"
            src={c.avatar_url || `https://avatars.githubusercontent.com/${c.login}`}
            alt={c.login}
            loading="lazy"
          />
          <div className="contributor-tooltip" role="tooltip">
            <span className="contributor-login">@{c.login}</span>
            {typeof c.contributions === 'number' && c.contributions > 0 && (
              <span className="contributor-count">
                {c.contributions} {c.contributions === 1 ? 'commit' : 'commits'}
              </span>
            )}
          </div>
        </a>
      ))}
    </div>
  );
};

export default Contributors;
