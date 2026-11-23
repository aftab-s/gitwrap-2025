import React, { useEffect, useState } from 'react';

interface Props {
  username: string;
  year: number;
}

const PHASES = [
  'Fetching GitHub contributions...',
  'Analyzing languages & streaks...',
  'Building your wrap card...',
];

export const FuturisticLoader: React.FC<Props> = ({ username, year }) => {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [progress, setProgress] = useState(16);

  useEffect(() => {
    const phaseTimer = setInterval(() => {
      setPhaseIndex((prev) => (prev + 1) % PHASES.length);
    }, 1800);

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 94) return 94;
        const inc = Math.floor(Math.random() * 6) + 4;
        return Math.min(94, prev + inc);
      });
    }, 280);

    return () => {
      clearInterval(phaseTimer);
      clearInterval(progressTimer);
    };
  }, []);

  return (
    <div className="loader-container">
      <div className="loader-card" role="status" aria-label={`Loading ${username}'s ${year} statistics`}>
        {/* Sleek Git Branch Spinner */}
        <div className="loader-spin-wrap" aria-hidden="true">
          <svg className="loader-spin-svg" viewBox="0 0 64 64">
            {/* Ambient Background Track */}
            <circle cx="32" cy="32" r="27" className="loader-ring-track" />
            {/* Smooth Rotating Segment */}
            <circle cx="32" cy="32" r="27" className="loader-ring-active" />
            {/* Center Git Branch Icon */}
            <g className="loader-git-glyph">
              <circle cx="24" cy="20" r="3.5" fill="currentColor" />
              <circle cx="24" cy="44" r="3.5" fill="currentColor" />
              <circle cx="40" cy="32" r="3.5" fill="var(--a1, #00FF88)" />
              <line x1="24" y1="23.5" x2="24" y2="40.5" stroke="currentColor" strokeWidth="2.2" />
              <path d="M 24 23.5 C 24 32, 40 26, 40 32" stroke="var(--a1, #00FF88)" strokeWidth="2.2" fill="none" />
            </g>
          </svg>
        </div>

        {/* Headline */}
        <div className="loader-head">
          <span className="loader-eyebrow">GitWrap {year}</span>
          <h2 className="display loader-title">
            Counting {username}&rsquo;s {year}
          </h2>
        </div>

        {/* Phase Subtitle */}
        <p className="loader-phase">
          <span className="loader-dot" />
          <span key={phaseIndex} className="loader-phase-text">
            {PHASES[phaseIndex]}
          </span>
        </p>

        {/* Smooth Linear Progress Bar */}
        <div className="loader-bar-wrap" aria-hidden="true">
          <div className="loader-bar-fill" style={{ width: `${progress}%` }} />
        </div>

        {/* Readout */}
        <div className="loader-meta">
          <span>@{username}</span>
          <span className="loader-pct">{progress}%</span>
        </div>
      </div>
    </div>
  );
};

export default FuturisticLoader;
