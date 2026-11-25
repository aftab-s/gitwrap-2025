import React, { useState, useMemo } from 'react';

interface HeroContributionGraphProps {
  year?: number;
}

const GLYPHS: Record<string, number[][]> = {
  Y: [
    [1, 0, 1],
    [1, 0, 1],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
  ],
  O: [
    [1, 1, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 1, 1],
  ],
  U: [
    [1, 0, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 1, 1],
  ],
  R: [
    [1, 1, 1, 0],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 0],
    [1, 1, 0, 0],
    [1, 0, 1, 0],
    [1, 0, 0, 1],
  ],
  '0': [
    [1, 1, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 1, 1],
  ],
  '1': [
    [0, 1, 0],
    [1, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
    [1, 1, 1],
  ],
  '2': [
    [1, 1, 1],
    [0, 0, 1],
    [0, 0, 1],
    [1, 1, 1],
    [1, 0, 0],
    [1, 0, 0],
    [1, 1, 1],
  ],
  '3': [
    [1, 1, 1],
    [0, 0, 1],
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 1],
    [0, 0, 1],
    [1, 1, 1],
  ],
  '4': [
    [1, 0, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 1, 1],
    [0, 0, 1],
    [0, 0, 1],
    [0, 0, 1],
  ],
  '5': [
    [1, 1, 1],
    [1, 0, 0],
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 1],
    [0, 0, 1],
    [1, 1, 1],
  ],
  '6': [
    [1, 1, 1],
    [1, 0, 0],
    [1, 0, 0],
    [1, 1, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 1, 1],
  ],
  '7': [
    [1, 1, 1],
    [0, 0, 1],
    [0, 0, 1],
    [0, 0, 1],
    [0, 0, 1],
    [0, 0, 1],
    [0, 0, 1],
  ],
  '8': [
    [1, 1, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 1, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 1, 1],
  ],
  '9': [
    [1, 1, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 1, 1],
    [0, 0, 1],
    [0, 0, 1],
    [1, 1, 1],
  ],
};

const MONTHS = [
  { name: 'Jan', col: 0 },
  { name: 'Feb', col: 4 },
  { name: 'Mar', col: 9 },
  { name: 'Apr', col: 13 },
  { name: 'May', col: 17 },
  { name: 'Jun', col: 22 },
  { name: 'Jul', col: 26 },
  { name: 'Aug', col: 31 },
  { name: 'Sep', col: 35 },
  { name: 'Oct', col: 39 },
  { name: 'Nov', col: 44 },
  { name: 'Dec', col: 48 },
];

const DAYS = [
  { name: 'Mon', row: 1 },
  { name: 'Wed', row: 3 },
  { name: 'Fri', row: 5 },
];

const LEVEL_COLORS = [
  '#161B22', // 0: empty
  '#0E4429', // 1: low
  '#006D32', // 2: medium
  '#26A641', // 3: high
  '#39D353', // 4: max / letter
];

export const HeroContributionGraph: React.FC<HeroContributionGraphProps> = ({ year = 2026 }) => {
  const [sealTheme, setSealTheme] = useState<'riso' | 'matrix'>('riso');
  const [stampKey, setStampKey] = useState<number>(0);
  const [activeTooltip, setActiveTooltip] = useState<{ x: number; y: number; text: string } | null>(null);

  // Generate 7 rows x 52 cols grid
  const { grid, totalContributions } = useMemo(() => {
    const rows = 7;
    const cols = 52;
    const g: { level: number; isLetter: boolean; commits: number; week: number; day: number }[][] = Array.from(
      { length: rows },
      () => Array.from({ length: cols }, () => ({ level: 0, isLetter: false, commits: 0, week: 0, day: 0 }))
    );

    const word1 = ['Y', 'O', 'U', 'R'];
    const word2 = String(year).split('');

    let colCursor = 9; // 9 columns left padding

    // Plot "YOUR"
    for (const ch of word1) {
      const glyph = GLYPHS[ch] || GLYPHS['0'];
      const w = glyph[0].length;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < w; c++) {
          if (glyph[r][c] && colCursor + c < cols) {
            g[r][colCursor + c].isLetter = true;
            // Alternating level 4 and level 3 for organic commit depth
            g[r][colCursor + c].level = (r + c) % 4 === 0 ? 3 : 4;
            g[r][colCursor + c].commits = (r + c) % 4 === 0 ? 8 : 14;
          }
        }
      }
      colCursor += w + 1; // 1 column letter spacing
    }

    // 2-column gap between words
    colCursor += 1;

    // Plot year (e.g. "2026")
    for (const ch of word2) {
      const glyph = GLYPHS[ch] || GLYPHS['0'];
      const w = glyph[0].length;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < w; c++) {
          if (glyph[r][c] && colCursor + c < cols) {
            g[r][colCursor + c].isLetter = true;
            g[r][colCursor + c].level = (r + c) % 3 === 0 ? 3 : 4;
            g[r][colCursor + c].commits = (r + c) % 3 === 0 ? 9 : 16;
          }
        }
      }
      colCursor += w + 1;
    }

    // Fill background cells with realistic GitHub activity noise
    let total = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        g[r][c].week = c + 1;
        g[r][c].day = r;
        if (!g[r][c].isLetter) {
          const seed = (r * 19 + c * 37 + (year % 100)) % 100;
          if (seed < 8) {
            g[r][c].level = 2;
            g[r][c].commits = 4 + (seed % 3);
          } else if (seed < 22) {
            g[r][c].level = 1;
            g[r][c].commits = 1 + (seed % 3);
          } else {
            g[r][c].level = 0;
            g[r][c].commits = 0;
          }
        }
        total += g[r][c].commits;
      }
    }

    return { grid: g, totalContributions: total };
  }, [year]);

  const toggleSeal = () => {
    setSealTheme((prev) => (prev === 'riso' ? 'matrix' : 'riso'));
    setStampKey((k) => k + 1);
  };

  // Dimensions
  const squareSize = 10;
  const gap = 3;
  const leftOffset = 32;
  const topOffset = 22;
  const svgWidth = leftOffset + 52 * (squareSize + gap);
  const svgHeight = topOffset + 7 * (squareSize + gap) + 10;

  return (
    <div className="hero-graph-shell" role="region" aria-label={`GitHub contribution graph spelling Your ${year}, Scored.`}>
      {/* Top telemetry sub-bar */}
      <div className="hero-graph-topbar">
        <div className="hero-graph-telemetry">
          <span className="hero-graph-live-indicator" />
          <span className="hero-graph-telemetry-text">{year} CONTRIBUTION MATRIX</span>
        </div>
        <div className="hero-graph-counter">
          <span className="hero-graph-counter-val">{totalContributions.toLocaleString()}</span>
          <span className="hero-graph-counter-lbl">COMMITS RECORDED</span>
        </div>
      </div>

      {/* SVG Contribution Canvas */}
      <div className="hero-graph-canvas-wrap">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="hero-graph-svg"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          {/* Month labels along the top */}
          {MONTHS.map((m) => (
            <text
              key={m.name}
              x={leftOffset + m.col * (squareSize + gap)}
              y={topOffset - 7}
              className="hero-graph-month-label"
            >
              {m.name}
            </text>
          ))}

          {/* Weekday labels along the left */}
          {DAYS.map((d) => (
            <text
              key={d.name}
              x={leftOffset - 8}
              y={topOffset + d.row * (squareSize + gap) + 8}
              className="hero-graph-day-label"
              textAnchor="end"
            >
              {d.name}
            </text>
          ))}

          {/* 7x52 Contribution Cells */}
          {grid.map((row, r) =>
            row.map((cell, c) => {
              const x = leftOffset + c * (squareSize + gap);
              const y = topOffset + r * (squareSize + gap);
              const isLit = cell.isLetter;
              const fill = LEVEL_COLORS[cell.level];

              return (
                <rect
                  key={`${r}-${c}`}
                  x={x}
                  y={y}
                  width={squareSize}
                  height={squareSize}
                  rx={2}
                  fill={fill}
                  className={`hero-graph-cell ${isLit ? 'cell-glyph' : 'cell-bg'}`}
                  style={{
                    animationDelay: `${150 + c * 20 + r * 12}ms`,
                  }}
                  onMouseEnter={() => {
                    setActiveTooltip({
                      x,
                      y,
                      text: cell.commits > 0
                        ? `${cell.commits} commits on Week ${cell.week}`
                        : `No activity on Week ${cell.week}`,
                    });
                  }}
                  onMouseLeave={() => setActiveTooltip(null)}
                />
              );
            })
          )}
        </svg>

        {/* Hover Tooltip */}
        {activeTooltip && (
          <div
            className="hero-graph-tooltip"
            style={{
              left: `${(activeTooltip.x / svgWidth) * 100}%`,
              top: `${(activeTooltip.y / svgHeight) * 100}%`,
            }}
          >
            {activeTooltip.text}
          </div>
        )}
      </div>

      {/* Stamped Seal Row ("SCORED.") - Dedicated layout to prevent covering grid */}
      <div className="hero-graph-seal-row">
        <button
          key={stampKey}
          type="button"
          onClick={toggleSeal}
          className={`hero-scored-seal seal-${sealTheme}`}
          title="Click to toggle seal style (Tokyo Riso / Volt Matrix)"
          aria-label={`Seal: Scored. Current theme: ${sealTheme === 'riso' ? 'Tokyo Riso' : 'Volt Matrix'}. Click to switch theme.`}
        >
          {sealTheme === 'riso' ? (
            /* Tokyo Riso Japanese Hanko Rubber Ink Stamp */
            <div className="seal-inner seal-riso-inner">
              <div className="seal-stamp-header">
                <span className="seal-kanji">検印</span>
                <span className="seal-tag">TOKYO RISO ARCHIVE</span>
              </div>
              <div className="seal-stamp-title">SCORED.</div>
              <div className="seal-stamp-footer">
                <div className="seal-barcode" aria-hidden="true">
                  <span style={{ width: 2 }} />
                  <span style={{ width: 4 }} />
                  <span style={{ width: 1.5 }} />
                  <span style={{ width: 3 }} />
                  <span style={{ width: 5 }} />
                  <span style={{ width: 2 }} />
                  <span style={{ width: 4 }} />
                  <span style={{ width: 2 }} />
                  <span style={{ width: 3 }} />
                  <span style={{ width: 5 }} />
                </div>
                <span className="seal-sub">ISBN 978-4-00-{year}</span>
              </div>
            </div>
          ) : (
            /* Volt Matrix Cyber Telemetry Stamp */
            <div className="seal-inner seal-matrix-inner">
              <div className="seal-stamp-header">
                <span className="seal-bracket">[ + ]</span>
                <span className="seal-tag">0x7E01 // TELEMETRY</span>
              </div>
              <div className="seal-stamp-title">SCORED.</div>
              <div className="seal-stamp-footer">
                <div className="seal-barcode" aria-hidden="true">
                  <span style={{ width: 3 }} />
                  <span style={{ width: 1.5 }} />
                  <span style={{ width: 4 }} />
                  <span style={{ width: 2 }} />
                  <span style={{ width: 6 }} />
                  <span style={{ width: 2 }} />
                  <span style={{ width: 3.5 }} />
                  <span style={{ width: 2 }} />
                  <span style={{ width: 5 }} />
                </div>
                <span className="seal-sub">0x{year}_RECORD_OK</span>
              </div>
            </div>
          )}
        </button>
      </div>

      {/* Bottom legend & status bar */}
      <div className="hero-graph-bottombar">
        <div className="hero-graph-legend-info">
          <span>52 WEEKS · 365 DAYS</span>
          <span className="hero-graph-legend-dot">·</span>
          <span className="hero-graph-interactive-hint">CELEBRATE YOUR OPEN SOURCE JOURNEY</span>
        </div>
        <div className="hero-graph-legend">
          <span className="hero-graph-legend-label">Less</span>
          {LEVEL_COLORS.map((color, i) => (
            <span
              key={i}
              className="hero-graph-legend-swatch"
              style={{ backgroundColor: color }}
            />
          ))}
          <span className="hero-graph-legend-label">More</span>
        </div>
      </div>
    </div>
  );
};

export default HeroContributionGraph;
