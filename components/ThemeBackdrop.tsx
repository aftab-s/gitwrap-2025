import React from 'react';
import type { Theme } from '../types';

interface Props {
  themeId: string;
  c: Theme['c'];
  overrideImgUrl?: string;
}

/**
 * Bespoke thematic vector backdrops, ambient watermarks, and subtle atmospheric textures.
 * 
 * IMPORTANT LAYOUT CONTRACT:
 * - Rendered strictly behind card content (z-index: 0, pointer-events: none).
 * - All structural registration marks, corner ticks, and rivets are placed in the outer margin
 *   (coordinates <= 26 or >= 1054) so they NEVER collide with the card's 44px inner content padding.
 * - Backdrop opacity is carefully balanced (0.05 - 0.25) for rich character without sacrificing readability.
 */
export const ThemeBackdrop: React.FC<Props> = ({ themeId, c, overrideImgUrl }) => {
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
      {/* =========================================================================
          1. MATCHDAY '26 (Inspired by World Cup 2026)
          Tactical match formation (4-3-3), turf lawn stripes, penalty box & golden stars
         ========================================================================= */}
      {themeId === 'fifa' && (
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 1080 1440">
          <defs>
            <pattern id="fifaTurf" width="80" height="1440" patternUnits="userSpaceOnUse">
              <rect width="40" height="1440" fill="rgba(255, 255, 255, 0.016)" />
            </pattern>
            {/* Tactical arrow marker */}
            <marker id="tacticArrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 8 5 L 0 9 z" fill="#FFD21F" opacity="0.4" />
            </marker>
          </defs>
          <rect width="1080" height="1440" fill="url(#fifaTurf)" />

          {/* Pitch center circle & midfield line */}
          <circle cx="540" cy="720" r="180" stroke="#FFD21F" strokeWidth="2.5" fill="none" opacity="0.08" />
          <circle cx="540" cy="720" r="6" fill="#FFD21F" opacity="0.14" />
          <line x1="20" y1="720" x2="1060" y2="720" stroke="#FFD21F" strokeWidth="2" opacity="0.07" strokeDasharray="14 10" />

          {/* Penalty box arc at top & bottom */}
          <path d="M 380 0 A 160 160 0 0 0 700 0" stroke="#FFD21F" strokeWidth="2" fill="none" opacity="0.06" />
          <path d="M 380 1440 A 160 160 0 0 1 700 1440" stroke="#FFD21F" strokeWidth="2" fill="none" opacity="0.06" />

          {/* Tactical 4-3-3 Formation Board (subtle coaching chalk marks) */}
          <g opacity="0.12" stroke="#FFD21F" strokeWidth="2" fill="none">
            {/* Forward attack run arrows */}
            <path d="M 320 620 Q 340 520 400 460" markerEnd="url(#tacticArrow)" strokeDasharray="6 6" />
            <path d="M 540 600 L 540 430" markerEnd="url(#tacticArrow)" strokeDasharray="6 6" />
            <path d="M 760 620 Q 740 520 680 460" markerEnd="url(#tacticArrow)" strokeDasharray="6 6" />

            {/* Tactical player chalk position dots */}
            {[
              [540, 1340], // GK
              [240, 1150], [420, 1180], [660, 1180], [840, 1150], // DEF
              [330, 920], [540, 960], [750, 920], // MID
              [260, 680], [540, 660], [820, 680]  // FWD
            ].map(([px, py], idx) => (
              <g key={idx} transform={`translate(${px}, ${py})`}>
                <circle cx="0" cy="0" r="14" fill="#093D22" stroke="#FFD21F" strokeWidth="2" />
                <circle cx="0" cy="0" r="4" fill="#FFD21F" />
              </g>
            ))}
          </g>

          {/* Golden Championship Stars Watermark in top right */}
          <g transform="translate(900, 52)" opacity="0.16" fill="#FFD21F">
            <polygon points="20,0 26,12 39,14 30,24 32,37 20,30 8,37 10,24 1,14 14,12" />
            <polygon transform="translate(42, 6) scale(0.75)" points="20,0 26,12 39,14 30,24 32,37 20,30 8,37 10,24 1,14 14,12" />
            <polygon transform="translate(80, 14) scale(0.55)" points="20,0 26,12 39,14 30,24 32,37 20,30 8,37 10,24 1,14 14,12" />
          </g>

          {/* Corner brackets */}
          <path d="M 18 42 L 18 18 L 42 18" stroke="#FFD21F" strokeWidth="3" fill="none" opacity="0.4" />
          <path d="M 1062 42 L 1062 18 L 1038 18" stroke="#FFD21F" strokeWidth="3" fill="none" opacity="0.4" />
          <path d="M 18 1398 L 18 1422 L 42 1422" stroke="#FFD21F" strokeWidth="3" fill="none" opacity="0.4" />
          <path d="M 1062 1398 L 1062 1422 L 1038 1422" stroke="#FFD21F" strokeWidth="3" fill="none" opacity="0.4" />
        </svg>
      )}

      {/* =========================================================================
          2. LUNAR ORBIT (Inspired by NASA Artemis II)
          Translunar Injection trajectory vector, Earth-to-Moon loop, Constellations
         ========================================================================= */}
      {themeId === 'artemis' && (
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 1080 1440">
          <defs>
            <radialGradient id="earthGlow" cx="50%" cy="50%" r="50%">
              <stop offset="60%" stopColor="#00E5FF" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#00E5FF" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Deep Starfield */}
          {[
            [100, 90, 2, 0.6], [320, 60, 1.5, 0.45], [780, 80, 2, 0.6], [980, 140, 1.5, 0.4],
            [160, 420, 1.5, 0.5], [940, 460, 2, 0.65], [120, 880, 1.5, 0.45], [960, 980, 2, 0.55],
            [220, 1260, 1.5, 0.4], [890, 1360, 2, 0.6], [540, 180, 1.5, 0.35], [680, 740, 1.5, 0.4],
            [440, 310, 2.2, 0.7], [850, 280, 1.8, 0.5], [60, 620, 1.4, 0.4], [1020, 760, 1.8, 0.5]
          ].map(([cx, cy, r, op], i) => (
            <circle key={i} cx={cx} cy={cy} r={r} fill="#FFFFFF" opacity={op} />
          ))}

          {/* Constellation lines (Ursa Major / Great Bear astrometric map) */}
          <g stroke="#00E5FF" strokeWidth="1" strokeDasharray="4 4" opacity="0.18">
            <line x1="140" y1="180" x2="200" y2="195" />
            <line x1="200" y1="195" x2="270" y2="240" />
            <line x1="270" y1="240" x2="330" y2="270" />
            <line x1="330" y1="270" x2="330" y2="350" />
            <line x1="330" y1="350" x2="420" y2="370" />
            <line x1="420" y1="370" x2="430" y2="290" />
            <line x1="430" y1="290" x2="330" y2="270" />
          </g>

          {/* Translunar Orbit Trajectory (Figure-8 Free Return Vector) */}
          <g stroke="#00E5FF" strokeWidth="2.2" fill="none" opacity="0.18">
            {/* Outbound TLI injection arc */}
            <path d="M 220 980 C 180 680, 360 420, 740 380 C 860 360, 950 440, 930 520 C 910 600, 800 620, 710 680 C 580 770, 320 860, 220 980 Z" strokeDasharray="10 8" />
          </g>

          {/* Earth Departure Sphere Watermark at (220, 980) */}
          <circle cx="220" cy="980" r="54" fill="url(#earthGlow)" />
          <circle cx="220" cy="980" r="44" stroke="#00E5FF" strokeWidth="1.5" fill="none" opacity="0.16" />
          <ellipse cx="220" cy="980" rx="44" ry="16" stroke="#00E5FF" strokeWidth="1" fill="none" opacity="0.14" />

          {/* Target Moon Crescent Watermark at (880, 460) */}
          <g transform="translate(880, 460)">
            <circle cx="0" cy="0" r="32" stroke="#FFA31A" strokeWidth="1.5" strokeDasharray="3 3" fill="none" opacity="0.15" />
            <path d="M -16 -26 A 30 30 0 1 0 14 26 A 22 22 0 1 1 -16 -26" fill="#FFA31A" opacity="0.18" />
          </g>

          {/* Telemetry vector marks */}
          <g opacity="0.22" stroke="#00E5FF" strokeWidth="1.5">
            <path d="M 520 700 L 560 700 M 540 680 L 540 720" />
            <circle cx="540" cy="700" r="18" fill="none" />
          </g>

          {/* Outer Flight Reticle Brackets */}
          <path d="M 18 42 L 18 18 L 42 18" stroke="#00E5FF" strokeWidth="3" fill="none" opacity="0.45" />
          <path d="M 1062 42 L 1062 18 L 1038 18" stroke="#00E5FF" strokeWidth="3" fill="none" opacity="0.45" />
          <path d="M 18 1398 L 18 1422 L 42 1422" stroke="#00E5FF" strokeWidth="3" fill="none" opacity="0.45" />
          <path d="M 1062 1398 L 1062 1422 L 1038 1422" stroke="#00E5FF" strokeWidth="3" fill="none" opacity="0.45" />
        </svg>
      )}

      {/* =========================================================================
          3. VICE SUNSET (Inspired by GTA VI)
          Iconic 80s synthwave segmented retro sun, perspective horizon grid, palm trees
         ========================================================================= */}
      {themeId === 'gtavi' && (
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 1080 1440">
          <defs>
            {/* Retro Sunset Sun Gradient */}
            <linearGradient id="retroSunGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFD13B" />
              <stop offset="50%" stopColor="#FF2A85" />
              <stop offset="100%" stopColor="#7900FF" />
            </linearGradient>

            {/* Sunset Sky Glow */}
            <linearGradient id="viceSkyGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF2A85" stopOpacity="0.22" />
              <stop offset="40%" stopColor="#FFB703" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#00F5D4" stopOpacity="0" />
            </linearGradient>

            {/* Segmented Sun Mask (classic 80s horizontal blind cutouts) */}
            <mask id="retroSunMask">
              <rect width="1080" height="1440" fill="#FFFFFF" />
              {/* Horizontal slices cutting through the bottom half */}
              <rect x="0" y="470" width="1080" height="4" fill="#000000" />
              <rect x="0" y="490" width="1080" height="7" fill="#000000" />
              <rect x="0" y="514" width="1080" height="10" fill="#000000" />
              <rect x="0" y="542" width="1080" height="14" fill="#000000" />
              <rect x="0" y="574" width="1080" height="18" fill="#000000" />
              <rect x="0" y="610" width="1080" height="24" fill="#000000" />
              <rect x="0" y="650" width="1080" height="30" fill="#000000" />
            </mask>
          </defs>

          {/* Ambient sunset sky glow */}
          <rect width="1080" height="700" fill="url(#viceSkyGlow)" />

          {/* ICONIC RETRO SYNTHWAVE SUN (Sliced vector sun) */}
          <circle cx="540" cy="500" r="160" fill="url(#retroSunGrad)" mask="url(#retroSunMask)" opacity="0.28" />

          {/* Neon sunset rays radiating outwards */}
          <g stroke="#FF2A85" strokeWidth="1.5" opacity="0.1">
            <line x1="540" y1="500" x2="180" y2="280" />
            <line x1="540" y1="500" x2="320" y2="200" />
            <line x1="540" y1="500" x2="540" y2="160" />
            <line x1="540" y1="500" x2="760" y2="200" />
            <line x1="540" y1="500" x2="900" y2="280" />
          </g>

          {/* Coastal seagulls in flight */}
          <g opacity="0.2" stroke="#FFD13B" strokeWidth="2.5" fill="none">
            <path d="M 280 320 Q 295 308 310 320 Q 325 308 340 320" />
            <path d="M 720 280 Q 732 270 744 280 Q 756 270 768 280" />
            <path d="M 770 340 Q 780 332 790 340 Q 800 332 810 340" />
          </g>

          {/* Synthwave horizon perspective lines */}
          <g opacity="0.12" stroke="#FF2A85" strokeWidth="2">
            <line x1="20" y1="1260" x2="1060" y2="1260" />
            <line x1="20" y1="1305" x2="1060" y2="1305" />
            <line x1="20" y1="1345" x2="1060" y2="1345" />
            <line x1="20" y1="1380" x2="1060" y2="1380" />
            <line x1="20" y1="1410" x2="1060" y2="1410" />
            <line x1="540" y1="1200" x2="60" y2="1440" />
            <line x1="540" y1="1200" x2="260" y2="1440" />
            <line x1="540" y1="1200" x2="440" y2="1440" />
            <line x1="540" y1="1200" x2="540" y2="1440" />
            <line x1="540" y1="1200" x2="640" y2="1440" />
            <line x1="540" y1="1200" x2="820" y2="1440" />
            <line x1="540" y1="1200" x2="1020" y2="1440" />
          </g>

          {/* Palm trees silhouettes on bottom right & left */}
          <g transform="translate(870, 1100) scale(1.4)" opacity="0.14" fill="#FF2A85">
            <path d="M 50 160 Q 65 90 40 20 Q 45 90 55 160 Z" />
            <path d="M 40 20 Q 10 5 -10 25 Q 15 5 40 20" />
            <path d="M 40 20 Q 20 -15 0 -25 Q 25 -5 40 20" />
            <path d="M 40 20 Q 60 -20 85 -15 Q 65 0 40 20" />
            <path d="M 40 20 Q 80 10 100 35 Q 70 20 40 20" />
          </g>

          {/* Neon Corner Accents */}
          <path d="M 18 42 L 18 18 L 42 18" stroke="#FF2A85" strokeWidth="3" fill="none" opacity="0.65" />
          <path d="M 1062 42 L 1062 18 L 1038 18" stroke="#00F5D4" strokeWidth="3" fill="none" opacity="0.65" />
          <path d="M 18 1398 L 18 1422 L 42 1422" stroke="#00F5D4" strokeWidth="3" fill="none" opacity="0.65" />
          <path d="M 1062 1398 L 1062 1422 L 1038 1422" stroke="#FF2A85" strokeWidth="3" fill="none" opacity="0.65" />
        </svg>
      )}

      {/* =========================================================================
          4. LATVERIAN STEEL (Inspired by Avengers Doomsday)
          Minimalist Titanium Emblem Graphic, Mystic Latverian Runes & Armor Rivets
         ========================================================================= */}
      {themeId === 'doomsday' && (
        <>
          {/* Minimalist Latverian Titanium Emblem Graphic */}
          <img
            src={overrideImgUrl || "/themes/latverian-minimal.jpg"}
            alt=""
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              objectPosition: 'center 46%',
              opacity: 0.16,
              mixBlendMode: 'screen',
              filter: 'contrast(1.15) brightness(1.05)',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1 }} viewBox="0 0 1080 1440">
            <defs>
              <pattern id="armorFacets" width="120" height="120" patternUnits="userSpaceOnUse">
                <path d="M 0 60 L 60 0 L 120 60 L 60 120 Z" stroke="#00FF88" strokeWidth="1" fill="none" opacity="0.02" />
              </pattern>
            </defs>
            <rect width="1080" height="1440" fill="url(#armorFacets)" />

            {/* MYSTIC LATVERIAN ARCANE RUNES (Flanking the left & right borders) */}
            <g fill="#00FF88" opacity="0.16" fontSize="22" fontFamily="'Martian Mono', monospace" textAnchor="middle">
              {/* Left runic column */}
              {['ᚲ', 'ᛟ', 'ᛞ', 'ᛗ', 'ᚱ', 'ᚦ', 'ᚨ', 'ᛏ', 'ᛋ', 'ᛉ', 'ᚷ', 'ᛒ', 'ᛚ', 'ᛦ', 'ᛡ', 'ᚲ', 'ᛟ', 'ᛞ'].map((rune, idx) => (
                <text key={`l-${idx}`} x="32" y={180 + idx * 62}>{rune}</text>
              ))}
              {/* Right runic column */}
              {['ᛡ', 'ᛦ', 'ᛚ', 'ᛒ', 'ᚷ', 'ᛉ', 'ᛋ', 'ᛏ', 'ᚨ', 'ᚦ', 'ᚱ', 'ᛗ', 'ᛞ', 'ᛟ', 'ᚲ', 'ᛡ', 'ᛦ', 'ᛚ'].map((rune, idx) => (
                <text key={`r-${idx}`} x="1048" y={180 + idx * 62}>{rune}</text>
              ))}
            </g>

            {/* OCCULT LATVERIAN ALCHEMY SUMMONING CIRCLE at (540, 720) */}
            <g transform="translate(540, 720)" opacity="0.08" stroke="#00FF88" strokeWidth="2" fill="none">
              {/* Concentric mystical rings */}
              <circle cx="0" cy="0" r="280" strokeWidth="2.5" />
              <circle cx="0" cy="0" r="260" strokeDasharray="6 6" />
              <circle cx="0" cy="0" r="200" />
              <circle cx="0" cy="0" r="120" strokeDasharray="12 8" />

              {/* Sacred geometry hexagram / intersecting arcane triangles */}
              <polygon points="0,-260 225,130 -225,130" strokeWidth="1.8" />
              <polygon points="0,260 225,-130 -225,-130" strokeWidth="1.8" />

              {/* Micro cardinal runes inside the circle */}
              <text x="0" y="-220" fill="#00FF88" stroke="none" fontSize="24" textAnchor="middle">ᛞ</text>
              <text x="220" y="0" fill="#00FF88" stroke="none" fontSize="24" textAnchor="middle">ᛟ</text>
              <text x="0" y="240" fill="#00FF88" stroke="none" fontSize="24" textAnchor="middle">ᚱ</text>
              <text x="-220" y="0" fill="#00FF88" stroke="none" fontSize="24" textAnchor="middle">ᛗ</text>
            </g>

            {/* Forged Titanium Heavy Corner Rivets */}
            {[
              [18, 18], [28, 18], [18, 28],
              [1062, 18], [1052, 18], [1062, 28],
              [18, 1422], [28, 1422], [18, 1412],
              [1062, 1422], [1052, 1422], [1062, 1412]
            ].map(([cx, cy], i) => (
              <circle key={i} cx={cx} cy={cy} r="3.5" fill="#00FF88" opacity="0.45" />
            ))}

            {/* Latverian Steel outer angle notches */}
            <path d="M 14 38 L 14 14 L 38 14" stroke="#00FF88" strokeWidth="3" fill="none" opacity="0.4" />
            <path d="M 1066 38 L 1066 14 L 1042 14" stroke="#00FF88" strokeWidth="3" fill="none" opacity="0.4" />
            <path d="M 14 1402 L 14 1426 L 38 1426" stroke="#00FF88" strokeWidth="3" fill="none" opacity="0.4" />
            <path d="M 1066 1402 L 1066 1426 L 1042 1426" stroke="#00FF88" strokeWidth="3" fill="none" opacity="0.4" />
          </svg>
        </>
      )}

      {/* =========================================================================
          5. VOLT MATRIX (Maximalist Dark)
          High-density Vector Barcode, Binary Cascades, Oscillogram, Hex RAM dump
         ========================================================================= */}
      {themeId === 'maxdark' && (
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 1080 1440">
          <defs>
            <pattern id="voltMatrixGrid" width="28" height="28" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="#D4FF00" opacity="0.08" />
            </pattern>
          </defs>
          <rect width="1080" height="1440" fill="url(#voltMatrixGrid)" />

          {/* AUTHENTIC VECTOR BARCODE STAMP at top right */}
          <g transform="translate(860, 50)" opacity="0.55" fill="#D4FF00">
            <rect x="0" y="0" width="3" height="32" />
            <rect x="5" y="0" width="2" height="32" />
            <rect x="9" y="0" width="5" height="32" />
            <rect x="16" y="0" width="1.5" height="32" />
            <rect x="20" y="0" width="4" height="32" />
            <rect x="26" y="0" width="2.5" height="32" />
            <rect x="31" y="0" width="6" height="32" />
            <rect x="40" y="0" width="2" height="32" />
            <rect x="44" y="0" width="4.5" height="32" />
            <rect x="51" y="0" width="2" height="32" />
            <rect x="55" y="0" width="5" height="32" />
            <rect x="63" y="0" width="3" height="32" />
            <rect x="68" y="0" width="2" height="32" />
            <rect x="72" y="0" width="4" height="32" />
            <rect x="78" y="0" width="2" height="32" />
            <rect x="82" y="0" width="6" height="32" />
            <rect x="90" y="0" width="3" height="32" />
            <rect x="95" y="0" width="2" height="32" />
            <rect x="100" y="0" width="4" height="32" />
            <text x="52" y="44" fill="#D4FF00" fontSize="9" fontFamily="'Martian Mono', monospace" textAnchor="middle" letterSpacing="0.1em">
              2026-RAW-OVERCLOCK
            </text>
          </g>

          {/* Hex Memory Stream Ticker on Left Border */}
          <g opacity="0.15" fill="#D4FF00" fontSize="11" fontFamily="'Martian Mono', monospace">
            {[
              '0x7E01_SYS_BOOT',
              '0xB420_CONTRIB_OK',
              '0xCAFE_VMM_READY',
              '0xDEAD_NULL_CATCH',
              '0xBEEF_STACK_SAFE',
              '0x2026_MATRIX_RAW',
              '0x00FF_OVERCLOCK'
            ].map((hex, i) => (
              <text key={i} x="34" y={320 + i * 110} transform={`rotate(-90 34 ${320 + i * 110})`}>
                {hex}
              </text>
            ))}
          </g>

          {/* Oscilloscope Frequency Waveform Vector at (180, 1100) */}
          <path
            d="M 120 1120 L 220 1120 L 240 1080 L 260 1160 L 280 1100 L 300 1140 L 320 1120 L 480 1120 L 500 1070 L 520 1170 L 540 1120 L 700 1120 L 720 1090 L 740 1150 L 760 1120 L 960 1120"
            stroke="#D4FF00"
            strokeWidth="1.8"
            fill="none"
            opacity="0.12"
          />

          {/* High-density tech crosshairs */}
          <g stroke="#D4FF00" strokeWidth="2.5" opacity="0.55">
            <path d="M 10 20 L 30 20 M 20 10 L 20 30" />
            <path d="M 1050 20 L 1070 20 M 1060 10 L 1060 30" />
            <path d="M 10 1420 L 30 1420 M 20 1410 L 20 1430" />
            <path d="M 1050 1420 L 1070 1420 M 1060 1410 L 1060 1430" />
          </g>

          {/* Technical edge ticks */}
          {[180, 360, 540, 720, 900, 1080, 1260].map((y) => (
            <React.Fragment key={y}>
              <line x1="8" y1={y} x2="18" y2={y} stroke="#D4FF00" strokeWidth="2" opacity="0.4" />
              <line x1="1062" y1={y} x2="1072" y2={y} stroke="#D4FF00" strokeWidth="2" opacity="0.4" />
            </React.Fragment>
          ))}
        </svg>
      )}

      {/* =========================================================================
          6. TOKYO RISO (Maximalist Light)
          Japanese Book ISBN Barcode, Hanko Red Rubber Stamp, Halftone Grain, CMYK Bars
         ========================================================================= */}
      {themeId === 'maxlight' && (
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 1080 1440">
          <defs>
            <pattern id="risoHalftoneScreen" width="14" height="14" patternUnits="userSpaceOnUse">
              <circle cx="7" cy="7" r="1.2" fill="#0B1B61" opacity="0.04" />
            </pattern>
          </defs>
          <rect width="1080" height="1440" fill="url(#risoHalftoneScreen)" />

          {/* JAPANESE EDITORIAL ISBN BARCODE at top right */}
          <g transform="translate(860, 48)" opacity="0.5" fill="#0B1B61">
            <rect x="0" y="0" width="3" height="34" />
            <rect x="5" y="0" width="2" height="34" />
            <rect x="9" y="0" width="4" height="34" />
            <rect x="15" y="0" width="2" height="34" />
            <rect x="19" y="0" width="5" height="34" />
            <rect x="26" y="0" width="2" height="34" />
            <rect x="30" y="0" width="3" height="34" />
            <rect x="36" y="0" width="5.5" height="34" />
            <rect x="44" y="0" width="2" height="34" />
            <rect x="48" y="0" width="4" height="34" />
            <rect x="54" y="0" width="2" height="34" />
            <rect x="58" y="0" width="4" height="34" />
            <rect x="64" y="0" width="6" height="34" />
            <rect x="72" y="0" width="2" height="34" />
            <rect x="76" y="0" width="3" height="34" />
            <rect x="81" y="0" width="5" height="34" />
            <rect x="88" y="0" width="2" height="34" />
            <rect x="92" y="0" width="4" height="34" />
            <rect x="98" y="0" width="3" height="34" />
            <text x="50" y="45" fill="#0B1B61" fontSize="8.5" fontFamily="'Martian Mono', monospace" textAnchor="middle" letterSpacing="0.06em">
              ISBN 978-4-00-2026-1
            </text>
            <text x="50" y="55" fill="#0B1B61" fontSize="7" fontFamily="'Martian Mono', monospace" textAnchor="middle" letterSpacing="0.04em">
              雑誌 082026-12 定価 2026円
            </text>
          </g>

          {/* SLANTED JAPANESE RED RUBBER INK STAMP (Hanko/Seal) */}
          <g transform="translate(180, 1370) rotate(-6)" opacity="0.6">
            <rect x="-8" y="-6" width="168" height="42" fill="none" stroke="#FF3366" strokeWidth="2.5" strokeDasharray="6 3" />
            <text x="76" y="14" fill="#FF3366" fontSize="12" fontFamily="'Martian Mono', monospace" fontWeight="900" textAnchor="middle" letterSpacing="0.1em">
              初版限定 · 2026
            </text>
            <text x="76" y="27" fill="#FF3366" fontSize="8" fontFamily="'Martian Mono', monospace" textAnchor="middle" letterSpacing="0.06em">
              検印 / TOKYO RISO ARCHIVE
            </text>
          </g>

          {/* CMYK Risograph 4-Color Separation Density Patches */}
          <g transform="translate(490, 18)" opacity="0.6">
            <rect x="0" y="0" width="18" height="10" fill="#00D2FF" stroke="#0B1B61" strokeWidth="1" />
            <rect x="22" y="0" width="18" height="10" fill="#FF3366" stroke="#0B1B61" strokeWidth="1" />
            <rect x="44" y="0" width="18" height="10" fill="#FFD600" stroke="#0B1B61" strokeWidth="1" />
            <rect x="66" y="0" width="18" height="10" fill="#0B1B61" stroke="#0B1B61" strokeWidth="1" />
          </g>

          {/* Swiss printer crop marks */}
          <g stroke="#0B1B61" strokeWidth="2" opacity="0.5">
            <line x1="10" y1="20" x2="30" y2="20" />
            <line x1="20" y1="10" x2="20" y2="30" />
            <line x1="1050" y1="20" x2="1070" y2="20" />
            <line x1="1060" y1="10" x2="1060" y2="30" />
            <line x1="10" y1="1420" x2="30" y2="1420" />
            <line x1="20" y1="1410" x2="20" y2="1430" />
            <line x1="1050" y1="1420" x2="1070" y2="1420" />
            <line x1="1060" y1="1410" x2="1060" y2="1430" />
          </g>

          {/* Registration target circle at center top */}
          <g transform="translate(540, 38)" opacity="0.4" stroke="#0B1B61" strokeWidth="1.5" fill="none">
            <circle cx="0" cy="0" r="7" />
            <line x1="-10" y1="0" x2="10" y2="0" />
            <line x1="0" y1="-10" x2="0" y2="10" />
          </g>
        </svg>
      )}
    </div>
  );
};

export default ThemeBackdrop;
