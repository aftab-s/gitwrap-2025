import React from 'react';

/**
 * A minimalist, ultra-clean fusion backdrop incorporating subtle design signatures from all 6 themes:
 * - Lunar Orbit: Clean translunar trajectory arc & quiet pinpoint stars
 * - Vice Sunset: Soft atmospheric dusk horizon glow & refined perspective horizon line
 * - Latverian Steel: Subtle vertical mystic runes in far margin & corner titanium ticks
 * - Matchday '26: Faint pitch chalk arc in the lower margin
 * - Volt Matrix: Minimalist technical registration crosshairs (+) & micro telemetry
 * - Tokyo Riso: Fine print alignment crop ticks & circular registration target
 *
 * Kept restrained, dark, and spacious so the typography and cards breathe with calm confidence.
 */
export const HomeFusionBackdrop: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}
    >
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          minHeight: '100vh',
        }}
        viewBox="0 0 1440 960"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Subtle Ambient Dusk/Orbit Radial Atmosphere */}
          <radialGradient id="minimalSkyGlow" cx="50%" cy="46%" r="65%">
            <stop offset="0%" stopColor="#FF2A85" stopOpacity="0.08" />
            <stop offset="45%" stopColor="#00E5FF" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#090B12" stopOpacity="0" />
          </radialGradient>

          {/* Minimalist Grid Pattern */}
          <pattern id="minimalDotGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="#FFFFFF" opacity="0.035" />
          </pattern>
        </defs>

        {/* Ambient base layer */}
        <rect width="1440" height="960" fill="url(#minimalDotGrid)" />
        <rect width="1440" height="960" fill="url(#minimalSkyGlow)" />

        {/* 1. LUNAR ORBIT: Translunar orbit trajectory arc & quiet stars */}
        <path
          d="M 320 860 C 440 460, 840 220, 1340 200"
          stroke="#00E5FF"
          strokeWidth="1.8"
          strokeDasharray="10 8"
          fill="none"
          opacity="0.14"
        />
        {[
          [180, 90, 1.8, 0.5], [420, 60, 1.2, 0.4], [780, 110, 1.5, 0.45],
          [1160, 80, 1.8, 0.55], [1320, 130, 1.4, 0.4], [940, 260, 1.5, 0.35]
        ].map(([cx, cy, r, op], i) => (
          <circle key={`star-${i}`} cx={cx} cy={cy} r={r} fill="#FFFFFF" opacity={op} />
        ))}

        {/* 2. VICE SUNSET: Refined horizon baseline */}
        <g opacity="0.1" stroke="#FF2A85" strokeWidth="1.5">
          <line x1="60" y1="880" x2="1380" y2="880" />
          <line x1="200" y1="910" x2="1380" y2="910" />
          <line x1="980" y1="850" x2="700" y2="960" />
          <line x1="980" y1="850" x2="1180" y2="960" />
        </g>

        {/* 3. LATVERIAN STEEL: Faint mystic runes along far left margin */}
        <g fill="#00FF88" opacity="0.13" fontSize="17" fontFamily="'Martian Mono', monospace" textAnchor="middle">
          {['ᚲ', 'ᛟ', 'ᛞ', 'ᛗ', 'ᚱ', 'ᛋ'].map((rune, idx) => (
            <text key={`rune-${idx}`} x="36" y={220 + idx * 75}>{rune}</text>
          ))}
        </g>
        {/* Titanium corner rivets */}
        <circle cx="28" cy="28" r="3.5" fill="#00FF88" opacity="0.3" />
        <circle cx="1412" cy="28" r="3.5" fill="#00FF88" opacity="0.3" />
        <circle cx="28" cy="932" r="3.5" fill="#00FF88" opacity="0.3" />
        <circle cx="1412" cy="932" r="3.5" fill="#00FF88" opacity="0.3" />

        {/* 4. MATCHDAY '26: Faint pitch chalk arc in lower right */}
        <circle cx="1180" cy="880" r="140" stroke="#FFD21F" strokeWidth="1.5" strokeDasharray="6 6" fill="none" opacity="0.08" />

        {/* 5. VOLT MATRIX: Tech crosshairs (+) & micro telemetry */}
        <g stroke="#D4FF00" strokeWidth="1.8" opacity="0.35">
          <path d="M 20 40 L 36 40 M 28 32 L 28 48" />
          <path d="M 1404 40 L 1420 40 M 1412 32 L 1412 48" />
          <path d="M 20 920 L 36 920 M 28 912 L 28 928" />
          <path d="M 1404 920 L 1420 920 M 1412 912 L 1412 928" />
        </g>
        <text x="64" y="44" fill="#D4FF00" opacity="0.2" fontSize="9" fontFamily="'Martian Mono', monospace" letterSpacing="0.14em">
          SYS.FUSION // 2026.RAW
        </text>

        {/* 6. TOKYO RISO: Minimalist Swiss crop ticks & registration target */}
        <g stroke="#00D2FF" strokeWidth="1.5" opacity="0.35">
          <line x1="680" y1="18" x2="680" y2="34" />
          <line x1="720" y1="18" x2="720" y2="34" />
          <circle cx="700" cy="26" r="6" fill="none" />
          <line x1="692" y1="26" x2="708" y2="26" />
        </g>
      </svg>
    </div>
  );
};

export default HomeFusionBackdrop;
