import React from 'react';
import type { Theme } from '../types';

interface Props {
  themeId: string;
  c: Theme['c'];
}

/**
 * Bespoke thematic vector backdrops, ambient watermarks, and subtle atmospheric textures
 * for Volt Matrix (maxdark), Tokyo Riso (maxlight), Latverian Steel (doomsday),
 * Lunar Orbit (artemis), Vice Sunset (gtavi), and Match Day (fifa).
 */
export const ThemeBackdrop: React.FC<Props> = ({ themeId }) => {
  if (
    themeId !== 'maxdark' &&
    themeId !== 'maxlight' &&
    themeId !== 'doomsday' &&
    themeId !== 'artemis' &&
    themeId !== 'gtavi' &&
    themeId !== 'fifa'
  ) {
    return null;
  }

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
          VOLT MATRIX (Maximalist Dark)
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

          {/* Oscilloscope Frequency Waveform Vector at (120, 1120) */}
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
          TOKYO RISO (Maximalist Light)
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

      {/* =========================================================================
          LATVERIAN STEEL (Doomsday)
          Gothic-meets-Art Deco Latticework, Cathedral Stained Glass, Distressed Grungy Texture
         ========================================================================= */}
      {themeId === 'doomsday' && (
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 1080 1440">
          <defs>
            {/* Diffuse pale yellow-green backlight radiating behind heavy obsidian & cloak pine */}
            <radialGradient id="doomCathedralGlow" cx="50%" cy="36%" r="65%">
              <stop offset="0%" stopColor="#D5E3A3" stopOpacity="0.28" />
              <stop offset="28%" stopColor="#28D443" stopOpacity="0.14" />
              <stop offset="55%" stopColor="#506340" stopOpacity="0.22" />
              <stop offset="82%" stopColor="#243326" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#121512" stopOpacity="0.95" />
            </radialGradient>

            {/* Distressed, slightly grungy glass texture filter */}
            <filter id="doomGrungeGlass" x="0%" y="0%" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="4" result="grungeNoise" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0.835  0 0 0 0 0.89  0 0 0 0 0.64  0 0 0 0.08 0"
                result="grungeTint"
              />
              <feBlend in="SourceGraphic" in2="grungeTint" mode="multiply" />
            </filter>

            {/* Cathedral stained glass diamond / Art Deco chevron lead came pattern */}
            <pattern id="doomLatticePattern" width="40" height="80" patternUnits="userSpaceOnUse">
              <path d="M 0 40 L 20 0 L 40 40 L 20 80 Z" fill="none" stroke="#506340" strokeWidth="1.2" opacity="0.22" />
              <path d="M 20 0 L 20 80" fill="none" stroke="#8D9694" strokeWidth="0.8" opacity="0.15" />
              <path d="M 0 40 L 40 40" fill="none" stroke="#28D443" strokeWidth="0.75" opacity="0.1" />
            </pattern>
          </defs>

          {/* Atmospheric Backlight Canvas */}
          <rect width="1080" height="1440" fill="url(#doomCathedralGlow)" />

          {/* Distressed Grungy Stained Glass Diffuser */}
          <rect width="1080" height="1440" fill="#121512" filter="url(#doomGrungeGlass)" opacity="0.55" />

          {/* Ornate Diamond Lead Came / Wrought Iron Latticework */}
          <rect width="1080" height="1440" fill="url(#doomLatticePattern)" />

          {/* Structural Wrought Iron Gothic Lancet Arches & Art Deco Mullions */}
          <g stroke="#0A0D0A" strokeWidth="3.5" fill="none" opacity="0.75">
            {/* Center Master Lancet Arch */}
            <path d="M 280 1440 L 280 440 Q 280 120 540 32 Q 800 120 800 440 L 800 1440" />
            <path d="M 330 1440 L 330 460 Q 330 160 540 76 Q 750 160 750 460 L 750 1440" strokeWidth="2" stroke="#506340" opacity="0.6" />

            {/* Flanking Side Lancet Arches */}
            <path d="M 80 1440 L 80 540 Q 80 240 240 160 Q 400 240 400 540 L 400 1440" />
            <path d="M 680 1440 L 680 540 Q 680 240 840 160 Q 1000 240 1000 540 L 1000 1440" />

            {/* Vertical Mullion Pilasters */}
            <line x1="140" y1="0" x2="140" y2="1440" strokeWidth="2.5" />
            <line x1="280" y1="0" x2="280" y2="1440" strokeWidth="3" />
            <line x1="420" y1="0" x2="420" y2="1440" strokeWidth="2" stroke="#243326" />
            <line x1="540" y1="0" x2="540" y2="1440" strokeWidth="3.5" stroke="#0A0D0A" />
            <line x1="660" y1="0" x2="660" y2="1440" strokeWidth="2" stroke="#243326" />
            <line x1="800" y1="0" x2="800" y2="1440" strokeWidth="3" />
            <line x1="940" y1="0" x2="940" y2="1440" strokeWidth="2.5" />
          </g>

          {/* Highlight Tracery in Gunmetal and Emerald Accent */}
          <g stroke="#8D9694" strokeWidth="1.2" fill="none" opacity="0.35">
            <path d="M 280 440 Q 280 120 540 32 Q 800 120 800 440" stroke="#D5E3A3" opacity="0.2" />
            <line x1="540" y1="32" x2="540" y2="520" stroke="#28D443" opacity="0.4" />
          </g>

          {/* Gothic Rosette / Art Deco Radiating Medallion at Upper Center (540, 240) */}
          <g transform="translate(540, 240)" opacity="0.65">
            <circle cx="0" cy="0" r="140" fill="none" stroke="#0A0D0A" strokeWidth="4" />
            <circle cx="0" cy="0" r="130" fill="none" stroke="#506340" strokeWidth="2" />
            <circle cx="0" cy="0" r="95" fill="none" stroke="#28D443" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.5" />
            <circle cx="0" cy="0" r="60" fill="none" stroke="#8D9694" strokeWidth="2.5" />
            <circle cx="0" cy="0" r="28" fill="none" stroke="#D42329" strokeWidth="2" opacity="0.75" />
            <circle cx="0" cy="0" r="10" fill="#28D443" opacity="0.8" />

            {/* Radiating Wrought Iron Spokes */}
            {[0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330].map((deg) => (
              <line
                key={deg}
                x1="0"
                y1="0"
                x2={Math.cos((deg * Math.PI) / 180) * 140}
                y2={Math.sin((deg * Math.PI) / 180) * 140}
                stroke="#0A0D0A"
                strokeWidth={deg % 90 === 0 ? 3 : 1.5}
              />
            ))}
          </g>

          {/* Art Deco Stepped Iron Brackets in Four Corners */}
          <g stroke="#506340" strokeWidth="2" fill="none" opacity="0.5">
            {/* Top-Left */}
            <path d="M 24 24 L 80 24 L 80 44 L 120 44 L 120 80 L 44 80 L 44 44 L 24 44 Z" />
            <line x1="24" y1="24" x2="80" y2="80" stroke="#28D443" strokeWidth="1.2" opacity="0.6" />

            {/* Top-Right */}
            <path d="M 1056 24 L 1000 24 L 1000 44 L 960 44 L 960 80 L 1036 80 L 1036 44 L 1056 44 Z" />
            <line x1="1056" y1="24" x2="1000" y2="80" stroke="#28D443" strokeWidth="1.2" opacity="0.6" />

            {/* Bottom-Left */}
            <path d="M 24 1416 L 80 1416 L 80 1396 L 120 1396 L 120 1360 L 44 1360 L 44 1396 L 24 1396 Z" />

            {/* Bottom-Right */}
            <path d="M 1056 1416 L 1000 1416 L 1000 1396 L 960 1396 L 960 1360 L 1036 1360 L 1036 1396 L 1056 1396 Z" />
          </g>

          {/* Sovereign Crimson Accent Insignia Dots at Arch Apexes */}
          <circle cx="540" cy="32" r="4.5" fill="#D42329" />
          <circle cx="240" cy="160" r="3.5" fill="#D42329" opacity="0.75" />
          <circle cx="840" cy="160" r="3.5" fill="#D42329" opacity="0.75" />
        </svg>
      )}

      {/* =========================================================================
          LUNAR ORBIT (Artemis II)
          Feathered Deep Space Luminance Gradients, High-Contrast Particulate Stardust,
          Translunar Injection Free-Return Orbital Trajectory, Astronaut Visor Gold Accent
         ========================================================================= */}
      {themeId === 'artemis' && (
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 1080 1440">
          <defs>
            {/* Smooth feathered gradient from solid deep-space dark to diffused lunar luminance */}
            <radialGradient id="artemisLuminanceGlow" cx="44%" cy="30%" r="72%">
              <stop offset="0%" stopColor="#7CD6FF" stopOpacity="0.32" />
              <stop offset="20%" stopColor="#5078A8" stopOpacity="0.25" />
              <stop offset="46%" stopColor="#162C4E" stopOpacity="0.42" />
              <stop offset="78%" stopColor="#040A17" stopOpacity="0.88" />
              <stop offset="100%" stopColor="#040A17" stopOpacity="0.98" />
            </radialGradient>

            {/* Feathered vertical horizon transition */}
            <linearGradient id="artemisFeatheredHorizon" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#040A17" stopOpacity="0.96" />
              <stop offset="28%" stopColor="#162C4E" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#7CD6FF" stopOpacity="0.16" />
              <stop offset="76%" stopColor="#040A17" stopOpacity="0.82" />
              <stop offset="100%" stopColor="#040A17" stopOpacity="1" />
            </linearGradient>

            {/* Astronaut helmet visor gold warm complementary reflection */}
            <radialGradient id="artemisVisorGoldReflect" cx="84%" cy="40%" r="48%">
              <stop offset="0%" stopColor="#E59A1A" stopOpacity="0.22" />
              <stop offset="30%" stopColor="#7A460A" stopOpacity="0.12" />
              <stop offset="68%" stopColor="#040A17" stopOpacity="0" />
            </radialGradient>

            {/* Fine, high-contrast particulate noise filter dusting upper and middle regions */}
            <filter id="artemisParticulateNoise" x="0%" y="0%" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.68" numOctaves="3" result="fineNoise" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0.85  0 0 0 0 0.92  0 0 0 0 1.0  0 0 0 1 0"
                in="fineNoise"
                result="coloredDust"
              />
              <feComponentTransfer in="coloredDust" result="thresholdDust">
                <feFuncR type="linear" slope="3" intercept="-1.5" />
                <feFuncG type="linear" slope="3" intercept="-1.5" />
                <feFuncB type="linear" slope="3" intercept="-1.5" />
                <feFuncA type="linear" slope="3.2" intercept="-1.7" />
              </feComponentTransfer>
            </filter>

            {/* Feathering mask that confines particulate dusting to upper and middle regions */}
            <linearGradient id="artemisDustFeatherMask" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
              <stop offset="22%" stopColor="#ffffff" stopOpacity="0.85" />
              <stop offset="58%" stopColor="#ffffff" stopOpacity="0.75" />
              <stop offset="82%" stopColor="#ffffff" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </linearGradient>
            <mask id="artemisDustMask">
              <rect width="1080" height="1440" fill="url(#artemisDustFeatherMask)" />
            </mask>
          </defs>

          {/* Solid Deep Space Void Canvas */}
          <rect width="1080" height="1440" fill="#040A17" />

          {/* Smooth Feathered Luminance Gradients */}
          <rect width="1080" height="1440" fill="url(#artemisLuminanceGlow)" />
          <rect width="1080" height="1440" fill="url(#artemisFeatheredHorizon)" />
          <rect width="1080" height="1440" fill="url(#artemisVisorGoldReflect)" />

          {/* High-Contrast Particulate Regolith Dust and Stellar Noise */}
          <rect width="1080" height="1440" filter="url(#artemisParticulateNoise)" mask="url(#artemisDustMask)" opacity="0.45" />
        </svg>
      )}

      {/* =========================================================================
          VICE SUNSET (GTA VI / Leonida)
          Cinematic Florida Dusk Sky Gradients, Humid Optical Heat Haze Diffuser,
          Soft Crepuscular Sunburst Radiating from Horizon, 35mm Photographic Film Grain
         ========================================================================= */}
      {themeId === 'gtavi' && (
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 1080 1440">
          <defs>
            {/* Cinematic Florida dusk vertical sky gradient */}
            <linearGradient id="viceDuskSky" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3C1A32" stopOpacity="0.95" />
              <stop offset="22%" stopColor="#6B3B5E" stopOpacity="0.85" />
              <stop offset="42%" stopColor="#5E8DA8" stopOpacity="0.3" />
              <stop offset="60%" stopColor="#A5769B" stopOpacity="0.45" />
              <stop offset="78%" stopColor="#F3937B" stopOpacity="0.55" />
              <stop offset="92%" stopColor="#FDE0C8" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#421E38" stopOpacity="0.9" />
            </linearGradient>

            {/* Expansive horizon sunset glow */}
            <radialGradient id="viceHorizonSunGlow" cx="50%" cy="73%" r="68%">
              <stop offset="0%" stopColor="#FDE0C8" stopOpacity="0.65" />
              <stop offset="18%" stopColor="#F3937B" stopOpacity="0.5" />
              <stop offset="38%" stopColor="#A480D4" stopOpacity="0.35" />
              <stop offset="62%" stopColor="#6B3B5E" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#6B3B5E" stopOpacity="0" />
            </radialGradient>

            {/* Upper sky cool teal-mauve atmospheric haze */}
            <radialGradient id="viceSkyAtmosphere" cx="50%" cy="18%" r="60%">
              <stop offset="0%" stopColor="#5E8DA8" stopOpacity="0.28" />
              <stop offset="45%" stopColor="#8EA2E5" stopOpacity="0.16" />
              <stop offset="85%" stopColor="#6B3B5E" stopOpacity="0" />
            </radialGradient>

            {/* Crepuscular sunburst ray gradients */}
            <linearGradient id="viceRayCoral" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#FDE0C8" stopOpacity="0.75" />
              <stop offset="30%" stopColor="#F3937B" stopOpacity="0.55" />
              <stop offset="75%" stopColor="#F3937B" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#F3937B" stopOpacity="0" />
            </linearGradient>

            <linearGradient id="viceRayLavender" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#FDE0C8" stopOpacity="0.6" />
              <stop offset="35%" stopColor="#A480D4" stopOpacity="0.5" />
              <stop offset="75%" stopColor="#8EA2E5" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#6B3B5E" stopOpacity="0" />
            </linearGradient>

            <linearGradient id="viceRayMauve" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#F3937B" stopOpacity="0.65" />
              <stop offset="40%" stopColor="#A5769B" stopOpacity="0.45" />
              <stop offset="80%" stopColor="#6B3B5E" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#6B3B5E" stopOpacity="0" />
            </linearGradient>

            {/* Sunburst vertical feathering mask */}
            <linearGradient id="viceSunburstMaskGrad" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#000000" stopOpacity="0" />
              <stop offset="18%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="55%" stopColor="#ffffff" stopOpacity="0.8" />
              <stop offset="82%" stopColor="#ffffff" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </linearGradient>
            <mask id="viceSunburstMask">
              <rect width="1080" height="1440" fill="url(#viceSunburstMaskGrad)" />
            </mask>

            {/* Humid optical heat haze diffuser filter */}
            <filter id="viceHeatHaze" x="-10%" y="-10%" width="120%" height="120%">
              <feTurbulence type="fractalNoise" baseFrequency="0.008 0.038" numOctaves="3" result="hazeNoise" />
              <feDisplacementMap in="SourceGraphic" in2="hazeNoise" scale="12" xChannelSelector="R" yChannelSelector="G" result="hazedDisplaced" />
              <feGaussianBlur in="hazedDisplaced" stdDeviation="16" result="hazeDiffused" />
            </filter>

            {/* Photographic film grain filter */}
            <filter id="viceFilmGrain" x="0%" y="0%" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" result="grainNoise" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0.98  0 0 0 0 0.88  0 0 0 0 0.82  0 0 0 0.12 0"
                in="grainNoise"
                result="tintedGrain"
              />
            </filter>

            {/* Film grain feathering mask (subtle all around, slightly richer in sky) */}
            <linearGradient id="viceGrainMaskGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
              <stop offset="35%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="75%" stopColor="#ffffff" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.6" />
            </linearGradient>
            <mask id="viceGrainMask">
              <rect width="1080" height="1440" fill="url(#viceGrainMaskGrad)" />
            </mask>
          </defs>

          {/* Deep dusk sky gradient */}
          <rect width="1080" height="1440" fill="url(#viceDuskSky)" />

          {/* Upper sky cool teal-mauve atmosphere */}
          <rect width="1080" height="1440" fill="url(#viceSkyAtmosphere)" />

          {/* Sunburst radiating upward from the horizon through heat haze diffuser */}
          <g filter="url(#viceHeatHaze)" mask="url(#viceSunburstMask)">
            {/* Horizon Origin: (540, 1050) */}
            {/* Soft Coral & Lavender Radiating Shafts */}
            <path d="M 540 1050 L -120 400 L -120 180 Z" fill="url(#viceRayLavender)" />
            <path d="M 540 1050 L -80 120 L 20 -40 Z" fill="url(#viceRayCoral)" />
            <path d="M 540 1050 L 60 -40 L 180 -40 Z" fill="url(#viceRayMauve)" />
            <path d="M 540 1050 L 220 -40 L 350 -40 Z" fill="url(#viceRayLavender)" />
            <path d="M 540 1050 L 390 -40 L 490 -40 Z" fill="url(#viceRayCoral)" />
            <path d="M 540 1050 L 515 -40 L 565 -40 Z" fill="url(#viceRayCoral)" />
            <path d="M 540 1050 L 590 -40 L 690 -40 Z" fill="url(#viceRayLavender)" />
            <path d="M 540 1050 L 730 -40 L 860 -40 Z" fill="url(#viceRayCoral)" />
            <path d="M 540 1050 L 900 -40 L 1020 -40 Z" fill="url(#viceRayMauve)" />
            <path d="M 540 1050 L 1060 -40 L 1160 120 Z" fill="url(#viceRayLavender)" />
            <path d="M 540 1050 L 1200 180 L 1200 400 Z" fill="url(#viceRayCoral)" />
          </g>

          {/* Expansive horizon sunset glow with heat haze optical diffusion */}
          <rect width="1080" height="1440" fill="url(#viceHorizonSunGlow)" />

          {/* Photographic 35mm film grain overlay */}
          <rect width="1080" height="1440" filter="url(#viceFilmGrain)" mask="url(#viceGrainMask)" opacity="0.36" />
        </svg>
      )}

      {/* =========================================================================
          MATCH DAY (FIFA World Cup 2026)
          Procedural Generative Athletic Flow Field:
          - Dynamic diagonal fluid base (Crimson Red #C42B30 -> Cobalt Blue #16468F -> Forest Green #176840)
          - Procedural wave ribbons warped via fractal turbulence displacement & fluid diffusion
          - Kinetic spline streamlines, warm ambient gold core, easy on the eyes
         ========================================================================= */}
      {themeId === 'fifa' && (
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 1080 1440">
          <defs>
            {/* Dynamic Angled Flow Field Base */}
            <linearGradient id="fifaProceduralBase" x1="15%" y1="0%" x2="85%" y2="100%">
              <stop offset="0%" stopColor="#C42B30" />
              <stop offset="26%" stopColor="#A82227" />
              <stop offset="42%" stopColor="#482E6E" />
              <stop offset="58%" stopColor="#16468F" />
              <stop offset="74%" stopColor="#155B68" />
              <stop offset="88%" stopColor="#176840" />
              <stop offset="100%" stopColor="#125232" />
            </linearGradient>

            {/* Wave Ribbon Gradients */}
            <linearGradient id="fifaCrimsonRibbon" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D93339" />
              <stop offset="75%" stopColor="#C42B30" />
              <stop offset="100%" stopColor="#8A1B20" />
            </linearGradient>

            <linearGradient id="fifaCobaltRibbon" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E57AD" />
              <stop offset="60%" stopColor="#16468F" />
              <stop offset="100%" stopColor="#0F3266" />
            </linearGradient>

            <linearGradient id="fifaForestRibbon" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1A7A4A" />
              <stop offset="60%" stopColor="#176840" />
              <stop offset="100%" stopColor="#104A2C" />
            </linearGradient>

            {/* Procedural Fluid Distortion Filter */}
            <filter id="fifaProceduralWarp" x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence type="fractalNoise" baseFrequency="0.0028 0.0052" numOctaves="3" seed="26" result="proceduralNoise" />
              <feDisplacementMap in="SourceGraphic" in2="proceduralNoise" scale="58" xChannelSelector="R" yChannelSelector="G" result="warpedRibbons" />
              <feGaussianBlur in="warpedRibbons" stdDeviation="40" result="diffusedProcedural" />
            </filter>

            {/* Soft Ambient Core Glow */}
            <radialGradient id="fifaCoreGoldGlow" cx="50%" cy="46%" r="62%">
              <stop offset="0%" stopColor="#F7D154" stopOpacity="0.14" />
              <stop offset="40%" stopColor="#F7D154" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#16468F" stopOpacity="0" />
            </radialGradient>

            {/* Diffused edge vignette for visual comfort */}
            <radialGradient id="fifaComfortVignette" cx="50%" cy="50%" r="72%">
              <stop offset="0%" stopColor="#000000" stopOpacity="0" />
              <stop offset="72%" stopColor="#000000" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.25" />
            </radialGradient>

            {/* Soft Photographic Texture */}
            <filter id="fifaPhotoGrain" x="0%" y="0%" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" result="fineGrain" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0.95  0 0 0 0 0.95  0 0 0 0 1.0  0 0 0 0.04 0"
                in="fineGrain"
                result="softGrain"
              />
            </filter>
          </defs>

          {/* Master angled fluid field base */}
          <rect width="1080" height="1440" fill="url(#fifaProceduralBase)" />

          {/* Procedural wave ribbons passed through organic fluid warp filter */}
          <g filter="url(#fifaProceduralWarp)">
            {/* Crimson Organic Wave Plume */}
            <path d="M -120 -80 L 1200 -80 L 1200 520 C 860 380, 680 640, 360 460 C 140 340, 40 500, -120 440 Z" fill="url(#fifaCrimsonRibbon)" opacity="0.9" />

            {/* Cobalt Kinetic Diagonal Ribbon */}
            <path d="M -120 380 C 180 540, 400 280, 740 540 C 960 700, 1100 580, 1200 660 L 1200 1060 C 860 920, 640 1180, 260 940 C 80 820, -20 940, -120 880 Z" fill="url(#fifaCobaltRibbon)" opacity="0.85" />

            {/* Forest Green Surge */}
            <path d="M -120 820 C 260 700, 480 1080, 840 880 C 1040 760, 1160 920, 1200 980 L 1200 1560 L -120 1560 Z" fill="url(#fifaForestRibbon)" opacity="0.92" />

            {/* Accent Leaf Green Harmonic Flow */}
            <path d="M 1200 1560 L 360 1560 C 600 1340, 840 1440, 1200 1180 Z" fill="#60B552" opacity="0.55" />

            {/* Specular Gold Kinetic Thread */}
            <path d="M -120 540 C 260 400, 520 740, 880 560 C 1080 480, 1160 580, 1200 620" stroke="#F7D154" strokeWidth="54" fill="none" opacity="0.4" />
          </g>

          {/* Generative Kinetic Streamlines tracing the procedural flow */}
          <g fill="none" opacity="0.12">
            <path d="M -80 340 C 220 220, 460 580, 820 420 C 1020 340, 1120 460, 1180 500" stroke="#EAECEF" strokeWidth="2.5" />
            <path d="M -80 620 C 240 480, 500 820, 860 660 C 1040 580, 1140 680, 1180 720" stroke="#F7D154" strokeWidth="1.8" strokeDasharray="16 8" />
            <path d="M -80 940 C 260 820, 520 1180, 880 1020 C 1040 940, 1140 1040, 1180 1080" stroke="#EAECEF" strokeWidth="2" strokeDasharray="24 12" />
          </g>

          {/* Warm polished gold ambient center aura */}
          <rect width="1080" height="1440" fill="url(#fifaCoreGoldGlow)" />

          {/* Gentle edge vignette for visual relaxation and contrast control */}
          <rect width="1080" height="1440" fill="url(#fifaComfortVignette)" />

          {/* Ultra-soft subtle photographic texture */}
          <rect width="1080" height="1440" filter="url(#fifaPhotoGrain)" opacity="0.38" />
        </svg>
      )}
    </div>
  );
};

export default ThemeBackdrop;
