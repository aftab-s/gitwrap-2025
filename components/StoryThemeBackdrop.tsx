import React from 'react';
import type { Theme } from '../types';

interface Props {
  themeId: string;
  c: Theme['c'];
}

/**
 * Atmospheric background vector layer for the full-screen story slides.
 * Mirrors the theme character (runes, retro sun, orbital charts, barcodes, turf, riso)
 * in a responsive aspect ratio tailored for story mobile/desktop frames.
 */
export const StoryThemeBackdrop: React.FC<Props> = ({ themeId, c }) => {
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
      {/* 1. MATCHDAY '26 (Pitch lawn, tactical field markings & stars) */}
      {themeId === 'fifa' && (
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 460 820" preserveAspectRatio="none">
          <defs>
            <pattern id="storyTurf" width="40" height="820" patternUnits="userSpaceOnUse">
              <rect width="20" height="820" fill="rgba(255, 255, 255, 0.02)" />
            </pattern>
          </defs>
          <rect width="460" height="820" fill="url(#storyTurf)" />

          {/* Pitch center circle & midfield divider */}
          <circle cx="230" cy="410" r="110" stroke="#FFD21F" strokeWidth="2" fill="none" opacity="0.08" />
          <line x1="10" y1="410" x2="450" y2="410" stroke="#FFD21F" strokeWidth="1.5" opacity="0.07" strokeDasharray="8 6" />

          {/* Championship stars watermark in upper right */}
          <g transform="translate(380, 56)" opacity="0.14" fill="#FFD21F">
            <polygon points="12,0 15,8 24,9 18,15 20,24 12,19 4,24 6,15 0,9 9,8" />
            <polygon transform="translate(24, 4) scale(0.7)" points="12,0 15,8 24,9 18,15 20,24 12,19 4,24 6,15 0,9 9,8" />
          </g>

          {/* Corner brackets */}
          <path d="M 14 34 L 14 14 L 34 14" stroke="#FFD21F" strokeWidth="2.5" fill="none" opacity="0.35" />
          <path d="M 446 34 L 446 14 L 426 14" stroke="#FFD21F" strokeWidth="2.5" fill="none" opacity="0.35" />
          <path d="M 14 786 L 14 806 L 34 806" stroke="#FFD21F" strokeWidth="2.5" fill="none" opacity="0.35" />
          <path d="M 446 786 L 446 806 L 426 806" stroke="#FFD21F" strokeWidth="2.5" fill="none" opacity="0.35" />
        </svg>
      )}

      {/* 2. LUNAR ORBIT (Deep cosmic space, starfield, translunar trajectory & moon) */}
      {themeId === 'artemis' && (
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 460 820" preserveAspectRatio="none">
          {/* Constellation Starfield */}
          {[
            [50, 70, 1.8, 0.6], [160, 110, 1.2, 0.45], [380, 90, 2, 0.65], [420, 180, 1.4, 0.4],
            [90, 310, 1.5, 0.5], [400, 390, 1.8, 0.6], [60, 580, 1.3, 0.45], [390, 640, 2, 0.55],
            [120, 740, 1.5, 0.4], [340, 770, 1.8, 0.6], [230, 200, 1.3, 0.35]
          ].map(([cx, cy, r, op], i) => (
            <circle key={i} cx={cx} cy={cy} r={r} fill="#FFFFFF" opacity={op} />
          ))}

          {/* Translunar orbit arc */}
          <ellipse cx="230" cy="460" rx="200" ry="320" stroke="#00E5FF" strokeWidth="1.8" strokeDasharray="8 6" fill="none" opacity="0.14" transform="rotate(-12 230 460)" />

          {/* Moon crescent watermark in top right */}
          <g transform="translate(390, 80)">
            <path d="M -10 -16 A 18 18 0 1 0 10 16 A 13 13 0 1 1 -10 -16" fill="#FFA31A" opacity="0.18" />
          </g>

          {/* Spacecraft reticle corner marks */}
          <path d="M 14 34 L 14 14 L 34 14" stroke="#00E5FF" strokeWidth="2.5" fill="none" opacity="0.4" />
          <path d="M 446 34 L 446 14 L 426 14" stroke="#00E5FF" strokeWidth="2.5" fill="none" opacity="0.4" />
          <path d="M 14 786 L 14 806 L 34 806" stroke="#00E5FF" strokeWidth="2.5" fill="none" opacity="0.4" />
          <path d="M 446 786 L 446 806 L 426 806" stroke="#00E5FF" strokeWidth="2.5" fill="none" opacity="0.4" />
        </svg>
      )}

      {/* 3. VICE SUNSET (Retro synthwave sliced sunset sun, perspective grid & palm) */}
      {themeId === 'gtavi' && (
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 460 820" preserveAspectRatio="none">
          <defs>
            <linearGradient id="storySunGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFD13B" />
              <stop offset="60%" stopColor="#FF2A85" />
              <stop offset="100%" stopColor="#7900FF" />
            </linearGradient>
            <linearGradient id="storySkyGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF2A85" stopOpacity="0.24" />
              <stop offset="50%" stopColor="#FFB703" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#00F5D4" stopOpacity="0" />
            </linearGradient>
            <mask id="storySunMask">
              <rect width="460" height="820" fill="#FFFFFF" />
              <rect x="0" y="270" width="460" height="3" fill="#000000" />
              <rect x="0" y="284" width="460" height="5" fill="#000000" />
              <rect x="0" y="302" width="460" height="8" fill="#000000" />
              <rect x="0" y="324" width="460" height="11" fill="#000000" />
              <rect x="0" y="350" width="460" height="15" fill="#000000" />
            </mask>
          </defs>

          {/* Ambient sunset glow */}
          <rect width="460" height="500" fill="url(#storySkyGlow)" />

          {/* RETRO SYNTHWAVE SUN */}
          <circle cx="230" cy="280" r="95" fill="url(#storySunGrad)" mask="url(#storySunMask)" opacity="0.25" />

          {/* Perspective grid at bottom */}
          <g opacity="0.12" stroke="#FF2A85" strokeWidth="1.5">
            <line x1="10" y1="720" x2="450" y2="720" />
            <line x1="10" y1="750" x2="450" y2="750" />
            <line x1="10" y1="775" x2="450" y2="775" />
            <line x1="10" y1="795" x2="450" y2="795" />
            <line x1="230" y1="690" x2="30" y2="820" />
            <line x1="230" y1="690" x2="130" y2="820" />
            <line x1="230" y1="690" x2="230" y2="820" />
            <line x1="230" y1="690" x2="330" y2="820" />
            <line x1="230" y1="690" x2="430" y2="820" />
          </g>

          {/* Palm silhouette watermark */}
          <g transform="translate(370, 640) scale(0.9)" opacity="0.16" fill="#FF2A85">
            <path d="M 50 160 Q 65 90 40 20 Q 45 90 55 160 Z" />
            <path d="M 40 20 Q 10 5 -10 25 Q 15 5 40 20" />
            <path d="M 40 20 Q 20 -15 0 -25 Q 25 -5 40 20" />
            <path d="M 40 20 Q 60 -20 85 -15 Q 65 0 40 20" />
            <path d="M 40 20 Q 80 10 100 35 Q 70 20 40 20" />
          </g>

          {/* Neon Corner Accents */}
          <path d="M 14 34 L 14 14 L 34 14" stroke="#FF2A85" strokeWidth="2.5" fill="none" opacity="0.55" />
          <path d="M 446 34 L 446 14 L 426 14" stroke="#00F5D4" strokeWidth="2.5" fill="none" opacity="0.55" />
          <path d="M 14 786 L 14 806 L 34 806" stroke="#00F5D4" strokeWidth="2.5" fill="none" opacity="0.55" />
          <path d="M 446 786 L 446 806 L 426 806" stroke="#FF2A85" strokeWidth="2.5" fill="none" opacity="0.55" />
        </svg>
      )}

      {/* 4. LATVERIAN STEEL (Tactical titanium runes, occult alchemy circle & armor rivets) */}
      {themeId === 'doomsday' && (
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 460 820" preserveAspectRatio="none">
          {/* MYSTIC LATVERIAN RUNES (Borders) */}
            <g fill="#00FF88" opacity="0.18" fontSize="16" fontFamily="'Martian Mono', monospace" textAnchor="middle">
              {['ᚲ', 'ᛟ', 'ᛞ', 'ᛗ', 'ᚱ', 'ᚦ', 'ᚨ', 'ᛏ', 'ᛋ', 'ᛉ', 'ᚷ', 'ᛒ', 'ᛚ'].map((rune, idx) => (
                <text key={`sl-${idx}`} x="16" y={120 + idx * 52}>{rune}</text>
              ))}
              {['ᛚ', 'ᛒ', 'ᚷ', 'ᛉ', 'ᛋ', 'ᛏ', 'ᚨ', 'ᚦ', 'ᚱ', 'ᛗ', 'ᛞ', 'ᛟ', 'ᚲ'].map((rune, idx) => (
                <text key={`sr-${idx}`} x="444" y={120 + idx * 52}>{rune}</text>
              ))}
            </g>

            {/* OCCULT LATVERIAN ALCHEMY CIRCLE at center */}
            <g transform="translate(230, 410)" opacity="0.09" stroke="#00FF88" strokeWidth="1.8" fill="none">
              <circle cx="0" cy="0" r="150" />
              <circle cx="0" cy="0" r="130" strokeDasharray="5 5" />
              <circle cx="0" cy="0" r="80" />
              <polygon points="0,-140 120,70 -120,70" />
              <polygon points="0,140 120,-70 -120,-70" />
            </g>

            {/* Titanium rivets */}
            {[
              [14, 14], [26, 14], [14, 26],
              [446, 14], [434, 14], [446, 26],
              [14, 806], [26, 806], [14, 794],
              [446, 806], [434, 806], [446, 794]
            ].map(([cx, cy], i) => (
              <circle key={i} cx={cx} cy={cy} r="3" fill="#00FF88" opacity="0.45" />
            ))}
          </svg>
      )}

      {/* 5. VOLT MATRIX (Cyber grid, technical barcode & binary streams) */}
      {themeId === 'maxdark' && (
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 460 820" preserveAspectRatio="none">
          <defs>
            <pattern id="storyVoltGrid" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.2" fill="#D4FF00" opacity="0.07" />
            </pattern>
          </defs>
          <rect width="460" height="820" fill="url(#storyVoltGrid)" />

          {/* VECTOR BARCODE in bottom right */}
          <g transform="translate(320, 755)" opacity="0.45" fill="#D4FF00">
            <rect x="0" y="0" width="2.5" height="26" />
            <rect x="5" y="0" width="1.5" height="26" />
            <rect x="9" y="0" width="3.5" height="26" />
            <rect x="15" y="0" width="1.5" height="26" />
            <rect x="19" y="0" width="4" height="26" />
            <rect x="25" y="0" width="2" height="26" />
            <rect x="30" y="0" width="4.5" height="26" />
            <rect x="38" y="0" width="1.5" height="26" />
            <rect x="42" y="0" width="3" height="26" />
            <rect x="48" y="0" width="1.5" height="26" />
            <rect x="52" y="0" width="3.5" height="26" />
            <rect x="58" y="0" width="2" height="26" />
            <rect x="63" y="0" width="4" height="26" />
            <rect x="70" y="0" width="2" height="26" />
            <text x="36" y="34" fill="#D4FF00" fontSize="7" fontFamily="'Martian Mono', monospace" textAnchor="middle" letterSpacing="0.08em">
              2026.RAW
            </text>
          </g>

          {/* Corner crosshairs */}
          <g stroke="#D4FF00" strokeWidth="2" opacity="0.5">
            <path d="M 8 16 L 24 16 M 16 8 L 16 24" />
            <path d="M 436 16 L 452 16 M 444 8 L 444 24" />
            <path d="M 8 804 L 24 804 M 16 796 L 16 812" />
            <path d="M 436 804 L 452 804 M 444 796 L 444 812" />
          </g>
        </svg>
      )}

      {/* 6. TOKYO RISO (Japanese ISBN barcode, red Hanko seal, Swiss crop ticks) */}
      {themeId === 'maxlight' && (
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 460 820" preserveAspectRatio="none">
          <defs>
            <pattern id="storyRisoHalftone" width="12" height="12" patternUnits="userSpaceOnUse">
              <circle cx="6" cy="6" r="1" fill="#0B1B61" opacity="0.04" />
            </pattern>
          </defs>
          <rect width="460" height="820" fill="url(#storyRisoHalftone)" />

          {/* JAPANESE ISBN BARCODE in upper right */}
          <g transform="translate(330, 48)" opacity="0.45" fill="#0B1B61">
            <rect x="0" y="0" width="2.5" height="24" />
            <rect x="4" y="0" width="1.5" height="24" />
            <rect x="7" y="0" width="3" height="24" />
            <rect x="12" y="0" width="1.5" height="24" />
            <rect x="15" y="0" width="3.5" height="24" />
            <rect x="21" y="0" width="1.5" height="24" />
            <rect x="25" y="0" width="2.5" height="24" />
            <rect x="30" y="0" width="4" height="24" />
            <rect x="36" y="0" width="1.5" height="24" />
            <rect x="40" y="0" width="3" height="24" />
            <rect x="45" y="0" width="1.5" height="24" />
            <rect x="49" y="0" width="4" height="24" />
            <rect x="56" y="0" width="2" height="24" />
            <rect x="60" y="0" width="3" height="24" />
            <text x="32" y="32" fill="#0B1B61" fontSize="6.5" fontFamily="'Martian Mono', monospace" textAnchor="middle" letterSpacing="0.05em">
              ISBN-2026-RISO
            </text>
          </g>

          {/* SLANTED RED HANKO SEAL STAMP in bottom left */}
          <g transform="translate(36, 755) rotate(-6)" opacity="0.55">
            <rect x="-4" y="-4" width="100" height="28" fill="none" stroke="#FF3366" strokeWidth="2" strokeDasharray="5 2.5" />
            <text x="46" y="10" fill="#FF3366" fontSize="8.5" fontFamily="'Martian Mono', monospace" fontWeight="900" textAnchor="middle" letterSpacing="0.08em">
              初版限定 2026
            </text>
            <text x="46" y="19" fill="#FF3366" fontSize="6" fontFamily="'Martian Mono', monospace" textAnchor="middle" letterSpacing="0.04em">
              TOKYO RISO SPEC
            </text>
          </g>

          {/* Swiss crop ticks */}
          <g stroke="#0B1B61" strokeWidth="1.5" opacity="0.45">
            <line x1="10" y1="20" x2="24" y2="20" />
            <line x1="20" y1="10" x2="20" y2="24" />
            <line x1="436" y1="20" x2="450" y2="20" />
            <line x1="440" y1="10" x2="440" y2="24" />
            <line x1="10" y1="800" x2="24" y2="800" />
            <line x1="20" y1="790" x2="20" y2="804" />
            <line x1="436" y1="800" x2="450" y2="800" />
            <line x1="440" y1="790" x2="440" y2="804" />
          </g>
        </svg>
      )}
    </div>
  );
};

export default StoryThemeBackdrop;
