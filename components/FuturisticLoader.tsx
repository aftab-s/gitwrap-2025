import React, { useEffect, useState } from 'react';

interface Props {
  username: string;
  year: number;
}

const STAGES = [
  'ESTABLISHING GITHUB GRAPHQL API UPLINK',
  'SCANNING 365-DAY COMMIT HISTOGRAM',
  'COMPILING PULL REQUESTS & CODE REVIEWS',
  'DECODING DEVELOPER ARCHETYPE & MOVE VERBS',
  'SYNTHESIZING ARCADE RECAP STORYLINE',
];

const TOTAL_SEGMENTS = 22;

export const FuturisticLoader: React.FC<Props> = ({ username, year }) => {
  const [stageIndex, setStageIndex] = useState(0);
  const [progress, setProgress] = useState(16);
  const [hexBuffer, setHexBuffer] = useState('0x7F4A');

  // Cycle through telemetry stages and smooth progress rollout
  useEffect(() => {
    const stageTimer = setInterval(() => {
      setStageIndex((prev) => (prev + 1) % STAGES.length);
    }, 1800);

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 94) return 94; // hold smoothly near completion until fetch ends
        const increment = Math.floor(Math.random() * 5) + 3;
        return Math.min(94, prev + increment);
      });

      // Subtle flickering memory address for authentic cyber telemetry
      const randHex = Math.floor(Math.random() * 0xffff)
        .toString(16)
        .toUpperCase()
        .padStart(4, '0');
      setHexBuffer(`0x${randHex}`);
    }, 400);

    return () => {
      clearInterval(stageTimer);
      clearInterval(progressTimer);
    };
  }, []);

  const activeSegments = Math.round((progress / 100) * TOTAL_SEGMENTS);

  return (
    <div className="cyber-loader-container">
      <div className="cyber-loader-hud">
        {/* Futuristic Corner Brackets */}
        <span className="cyber-bracket cyber-bracket-tl" aria-hidden="true" />
        <span className="cyber-bracket cyber-bracket-tr" aria-hidden="true" />
        <span className="cyber-bracket cyber-bracket-bl" aria-hidden="true" />
        <span className="cyber-bracket cyber-bracket-br" aria-hidden="true" />

        {/* Top Status Telemetry Header */}
        <div className="cyber-hud-top">
          <div className="cyber-hud-pill">
            <span className="cyber-dot-pulse" />
            <span>UPLINK ACTIVE</span>
          </div>
          <span className="cyber-hud-protocol">SYS.REPLAY // v2.6.0</span>
          <span className="cyber-hud-hex">BUFFER: {hexBuffer}</span>
        </div>

        {/* Centerpiece: Concentric Cybernetic Radar Scanner */}
        <div className="cyber-scanner-wrapper" role="status" aria-label="Counting contributions">
          <svg className="cyber-scanner-svg" viewBox="0 0 200 200" aria-hidden="true">
            {/* Outer static graduation ring */}
            <circle
              cx="100"
              cy="100"
              r="92"
              className="cyber-ring-outer-base"
              stroke="currentColor"
              strokeWidth="1"
              fill="none"
              opacity="0.2"
            />

            {/* Rotating dashed tachymeter ring */}
            <circle
              cx="100"
              cy="100"
              r="84"
              className="cyber-ring-rotate-cw"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="14 8 4 8"
              fill="none"
              opacity="0.65"
            />

            {/* Counter-rotating reticle ring */}
            <circle
              cx="100"
              cy="100"
              r="70"
              className="cyber-ring-rotate-ccw"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray="26 14 6 14"
              fill="none"
              opacity="0.5"
            />

            {/* Sonar ping waves expanding outward */}
            <circle cx="100" cy="100" r="28" className="cyber-sonar-wave wave-1" fill="none" stroke="currentColor" />
            <circle cx="100" cy="100" r="28" className="cyber-sonar-wave wave-2" fill="none" stroke="currentColor" />

            {/* 360-degree radar laser sweep beam */}
            <g className="cyber-radar-sweep">
              <defs>
                <linearGradient id="cyberRadarSweepGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="currentColor" stopOpacity="0.38" />
                  <stop offset="60%" stopColor="currentColor" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M 100 100 L 100 16 A 84 84 0 0 1 174 142 Z"
                fill="url(#cyberRadarSweepGrad)"
              />
              <line x1="100" y1="100" x2="100" y2="16" stroke="currentColor" strokeWidth="2" opacity="0.95" />
            </g>

            {/* Targeting crosshairs */}
            <line x1="100" y1="6" x2="100" y2="24" stroke="currentColor" strokeWidth="2" opacity="0.8" />
            <line x1="100" y1="176" x2="100" y2="194" stroke="currentColor" strokeWidth="2" opacity="0.8" />
            <line x1="6" y1="100" x2="24" y2="100" stroke="currentColor" strokeWidth="2" opacity="0.8" />
            <line x1="176" y1="100" x2="194" y2="100" stroke="currentColor" strokeWidth="2" opacity="0.8" />

            {/* Core glowing chip node */}
            <circle cx="100" cy="100" r="24" className="cyber-core-bg" fill="currentColor" opacity="0.12" />
            <circle cx="100" cy="100" r="24" stroke="currentColor" strokeWidth="2" fill="none" className="cyber-core-ring" />

            {/* Cyber Git commit branch glyph */}
            <circle cx="92" cy="100" r="5" fill="currentColor" />
            <line x1="92" y1="100" x2="108" y2="100" stroke="currentColor" strokeWidth="2.5" />
            <circle cx="108" cy="100" r="5" fill="currentColor" />
            <path d="M 92 100 C 92 88, 108 88, 108 92" stroke="currentColor" strokeWidth="2" fill="none" />
            <circle cx="108" cy="92" r="3" fill="currentColor" />

            {/* Satellite telemetry blips */}
            <circle cx="100" cy="28" r="3.5" className="cyber-satellite satellite-1" fill="currentColor" />
            <circle cx="160" cy="100" r="3" className="cyber-satellite satellite-2" fill="currentColor" />
          </svg>
        </div>

        {/* Title Block */}
        <div className="cyber-hud-title-box">
          <span className="cyber-hud-sub">DATA REPLAY PROTOCOL // {year}</span>
          <h1 className="display cyber-hud-title">
            Counting {username}&rsquo;s {year}
          </h1>
        </div>

        {/* High-Tech Progress Bar Header */}
        <div className="cyber-bar-header">
          <div className="cyber-bar-status">
            <span className="cyber-code-prefix">&gt;</span>
            <span key={stageIndex} className="cyber-stage-text">
              [{String(stageIndex + 1).padStart(2, '0')}/05] {STAGES[stageIndex]}
            </span>
            <span className="cyber-cursor">_</span>
          </div>
          <span className="cyber-pct-readout">[{progress}%]</span>
        </div>

        {/* Micro-Segmented Neon Energy Meter */}
        <div className="cyber-energy-meter" aria-hidden="true">
          {Array.from({ length: TOTAL_SEGMENTS }, (_, i) => {
            const isLit = i < activeSegments;
            const isLeading = i === activeSegments - 1;
            return (
              <span
                key={i}
                className={`cyber-seg${isLit ? ' is-lit' : ''}${isLeading ? ' is-leading' : ''}`}
              />
            );
          })}
        </div>

        {/* Bottom Hardware Telemetry Chips */}
        <div className="cyber-hud-chips">
          <div className="cyber-chip">
            <span className="cyber-chip-k">TARGET</span>
            <span className="cyber-chip-v">@{username}</span>
          </div>
          <div className="cyber-chip">
            <span className="cyber-chip-k">CYCLE</span>
            <span className="cyber-chip-v">{year}.ANNUAL</span>
          </div>
          <div className="cyber-chip">
            <span className="cyber-chip-k">MATRIX</span>
            <span className="cyber-chip-v">COMMITS · PRS · REVIEWS</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FuturisticLoader;

