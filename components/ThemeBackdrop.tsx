import React from 'react';
import type { Theme } from '../types';

interface Props {
  themeId: string;
  c: Theme['c'];
}

/**
 * Bespoke thematic vector backdrops, ambient watermarks, and subtle atmospheric textures
 * for Volt Matrix (maxdark) and Tokyo Riso (maxlight).
 */
export const ThemeBackdrop: React.FC<Props> = ({ themeId }) => {
  if (themeId !== 'maxdark' && themeId !== 'maxlight') {
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
    </div>
  );
};

export default ThemeBackdrop;
