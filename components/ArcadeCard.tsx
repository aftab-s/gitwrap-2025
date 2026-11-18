import React, { forwardRef, useMemo } from 'react';
import type { UserStats, Theme } from '../types';
import { Lock, PlayerArrow } from './icons/Arcade';
import { playerClass } from '../insights';
import { playerAvatar } from '../playerAvatars';

/**
 * The wrap card, drawn as an arcade machine's printed control panel.
 *
 * It is always laid out at CARD_W × CARD_H (the exported PNG's size) with inline styles only, so
 * the export iframe and the on-screen preview render the same pixels. On screen it is scaled to
 * fit by <GitWrapCard>; nothing here is responsive on purpose.
 */
export const CARD_W = 1080;
export const CARD_H = 1440;

const DISPLAY = "'Archivo', 'Arial Narrow', sans-serif";
const MONO = "'Martian Mono', ui-monospace, 'Cascadia Mono', monospace";
const DOT = "'Doto', 'Martian Mono', monospace";

const KEYLINE = 4;
// Lamp brightness per activity level: unlit stays faint, every lit level clears the dark glass.
export const LED_STEPS = [0.09, 0.5, 0.7, 0.85, 1];
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

interface Props {
  userData: UserStats;
  funMessage: string;
  theme: Theme;
}

// ---------- small typographic helpers ----------

const label = (color: string, size = 19): React.CSSProperties => ({
  fontFamily: MONO,
  fontSize: size,
  fontWeight: 600,
  fontStretch: '87.5%',
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  color,
  lineHeight: 1.2,
});

const condensed = (size: number, color: string, weight = 900): React.CSSProperties => ({
  fontFamily: DISPLAY,
  fontSize: size,
  fontWeight: weight,
  fontStretch: '68%',
  lineHeight: 0.9,
  letterSpacing: '-0.01em',
  color,
});

/** 0-4 intensity, same thresholds GitHub's own calendar reads as. */
function level(count: number): number {
  if (count <= 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 10) return 3;
  return 4;
}

/** Calendar days → week columns (Sunday on top), like GitHub's graph. */
export function toWeeks(calendar: Array<{ date: string; count: number }>): number[][] {
  const sorted = [...calendar].sort((a, b) => a.date.localeCompare(b.date));
  const weeks: number[][] = [];
  let week: number[] = [];
  for (const day of sorted) {
    const dow = new Date(`${day.date}T00:00:00Z`).getUTCDay();
    if (dow === 0 && week.length > 0) {
      weeks.push(week);
      week = [];
    }
    while (week.length < dow) week.push(-1); // before the range starts
    week.push(level(day.count));
  }
  if (week.length) {
    while (week.length < 7) week.push(-1);
    weeks.push(week);
  }
  return weeks.slice(-53);
}

function formatHour(h: number): string {
  return `${String(h).padStart(2, '0')}:00`;
}

const ArcadeCard = forwardRef<HTMLDivElement, Props>(({ userData, funMessage, theme }, ref) => {
  const { c } = theme;
  const led = c.led ?? c.a1; // lit colour inside the dark display windows
  const d = userData;
  const weeks = useMemo(() => toWeeks(d.contributionCalendar), [d.contributionCalendar]);

  const avatarSrc = d.avatarUrl || '';
  // Safari refuses to paint data/blob URLs when crossOrigin is set, so only set it for remote avatars.
  const avatarCrossOrigin = /^(data|blob|filesystem):/.test(avatarSrc) ? undefined : 'anonymous';

  const growth = d.yearOverYearGrowth?.overallGrowth;
  const peakDay = DAYS.includes(d.bestDayOfWeek) ? d.bestDayOfWeek.slice(0, 3) : '—';
  const privateCount = d.privateContributions ?? 0;
  const cls = useMemo(() => (d.totalContributions > 0 ? playerClass(d) : undefined), [d]);
  const topRepo = d.topRepos?.[0];
  const langs = d.topLanguages.slice(0, 3);
  const langInks = [c.a1, c.a2, c.panel];
  const displayName = d.name || d.login;

  const scoreRows: Array<[string, string]> = [
    // With nothing contributed there is no hour or streak to report; a dash is the honest reading.
    ['Best hour', d.totalContributions > 0 ? formatHour(d.bestHour) : '—'],
    ['Longest streak', d.longestStreakDays > 0 ? `${d.longestStreakDays} ${d.longestStreakDays === 1 ? 'day' : 'days'}` : '—'],
    ['Peak day', peakDay],
    ['Reviews', d.totalPRReviews.toLocaleString()],
    ['Stars earned', d.totalStarsGiven.toLocaleString()], // stargazers across the user's own repos (the field name is historical)
    ['Repositories', d.totalRepositories.toLocaleString()],
    [`vs ${d.year - 1}`, growth === undefined ? 'new' : `${growth >= 0 ? '+' : ''}${growth}%`],
  ];

  const breakdown: Array<[string, number]> = [
    ['commits', d.totalCommits],
    ['PRs', d.totalPRs],
    ['issues', d.totalIssues],
    ['reviews', d.totalPRReviews],
  ];

  const window_: React.CSSProperties = {
    background: c.panel,
    border: `${KEYLINE}px solid ${c.line}`,
    color: c.ink,
  };

  return (
    <div
      ref={ref}
      style={{
        width: CARD_W,
        height: CARD_H,
        boxSizing: 'border-box',
        background: c.ground,
        color: c.onGround,
        padding: 44,
        display: 'flex',
        flexDirection: 'column',
        gap: 22,
        fontFamily: DISPLAY,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* ---------- Marquee: player and year ---------- */}
      <header style={{ display: 'flex', alignItems: 'stretch', justifyContent: 'space-between', gap: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 22, minWidth: 0 }}>
          <img
            src={avatarSrc}
            alt=""
            crossOrigin={avatarCrossOrigin}
            style={{ width: 116, height: 116, objectFit: 'cover', border: `${KEYLINE}px solid ${c.line}`, background: c.panel, flexShrink: 0 }}
          />
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                ...condensed(60, c.onGround, 800),
                fontStretch: '75%',
                lineHeight: 1,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: 560,
              }}
            >
              {displayName}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 12, maxWidth: 560 }}>
              <span style={{ ...label(c.onGroundDim, 21), whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0 }}>@{d.login}</span>
              {d.githubAnniversary > 0 && (
                <span style={{ ...label(c.ink, 18), background: c.a1, padding: '5px 9px', border: `3px solid ${c.line}`, whiteSpace: 'nowrap', flexShrink: 0 }}>
                  Year {d.githubAnniversary} on GitHub
                </span>
              )}
            </div>
          </div>
        </div>

        <div
          style={{
            background: '#0B0D17',
            border: `${KEYLINE}px solid ${c.line}`,
            padding: '6px 22px 10px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <div style={{ fontFamily: DOT, fontWeight: 900, fontSize: 92, lineHeight: 0.95, color: led, letterSpacing: '0.02em' }}>{d.year}</div>
          <div style={label('#F6F4EC', 18)}>GitWrap</div>
        </div>
      </header>

      {/* ---------- Hazard stripe ---------- */}
      <div
        aria-hidden
        style={{
          height: 14,
          flexShrink: 0,
          backgroundImage: `repeating-linear-gradient(-45deg, ${c.line} 0 14px, ${c.a1} 14px 28px)`,
          border: `3px solid ${c.line}`,
        }}
      />

      {/* ---------- Score window + score table ---------- */}
      <section style={{ display: 'flex', gap: 22, alignItems: 'stretch' }}>
        <div style={{ ...window_, flex: '1 1 0', minWidth: 0, padding: '22px 26px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={label(c.onPanelDim, 20)}>Total contributions</div>
          <div style={{ ...condensed(d.totalContributions >= 100000 ? 170 : 212, c.ink), margin: '10px 0 16px', fontVariantNumeric: 'tabular-nums' }}>
            {d.totalContributions.toLocaleString()}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 18px' }}>
            {breakdown.map(([name, value], i) => (
              <span key={name} style={{ ...label(c.ink, 18), display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 14, height: 14, background: i % 2 ? c.a2 : c.a1, border: `3px solid ${c.line}`, boxSizing: 'border-box' }} />
                {value.toLocaleString()} {name}
              </span>
            ))}
            {privateCount > 0 && (
              <span style={{ ...label(c.ink, 18), display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <Lock size={16} color={c.ink} />
                {privateCount.toLocaleString()} private
              </span>
            )}
          </div>
        </div>

        <div style={{ width: 392, flexShrink: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          {scoreRows.map(([name, value]) => (
            <div
              key={name}
              style={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                gap: 12,
                padding: '7px 0 8px',
                borderBottom: `3px dotted ${c.onGroundDim}`,
              }}
            >
              <span style={label(c.onGroundDim, 18)}>{name}</span>
              <span style={{ ...condensed(40, c.onGround, 800), fontStretch: '75%', lineHeight: 1, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
                {value}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Languages: one ink meter ---------- */}
      <section>
        <div style={{ ...label(c.onGroundDim, 18), marginBottom: 10 }}>Top languages</div>
        {langs.length > 0 ? (
          <>
            <div style={{ display: 'flex', height: 46, border: `${KEYLINE}px solid ${c.line}`, background: c.line }}>
              {langs.map((lang, i) => (
                <div
                  key={lang.name}
                  style={{
                    width: `${lang.percent}%`,
                    background: langInks[i],
                    borderRight: i < langs.length - 1 ? `${KEYLINE}px solid ${c.line}` : undefined,
                    boxSizing: 'border-box',
                  }}
                />
              ))}
            </div>
            <div style={{ display: 'flex', gap: 28, marginTop: 12 }}>
              {langs.map((lang, i) => (
                <div key={lang.name} style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                  <span style={{ width: 18, height: 18, background: langInks[i], border: `3px solid ${c.line}`, boxSizing: 'border-box', flexShrink: 0 }} />
                  <span style={{ ...condensed(32, c.onGround, 800), fontStretch: '80%', lineHeight: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 230 }}>{lang.name}</span>
                  <span style={{ ...label(c.onGroundDim, 19), fontVariantNumeric: 'tabular-nums' }}>{lang.percent.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div style={{ ...window_, padding: '14px 20px', ...label(c.onPanelDim, 18) }}>No language data for public commits this year</div>
        )}
      </section>

      {/* ---------- Top repository + player class ---------- */}
      <section style={{ display: 'flex', gap: 22, alignItems: 'stretch' }}>
        <div style={{ ...window_, flex: '1 1 0', minWidth: 0, padding: '18px 24px 20px' }}>
          <div style={label(c.onPanelDim, 18)}>Top repository</div>
          <div
            style={{
              ...condensed(54, c.ink, 800),
              fontStretch: '75%',
              lineHeight: 1.05,
              margin: '8px 0 8px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            {topRepo?.isPrivate && <Lock size={34} color={c.ink} />}
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{topRepo ? topRepo.name : 'Nothing yet'}</span>
          </div>
          <div style={label(c.onPanelDim, 18)}>
            {topRepo
              ? `${topRepo.contributions.toLocaleString()} commits · ${topRepo.stargazers.toLocaleString()} stars`
              : 'Your first commit of the year goes here'}
          </div>
        </div>

        {cls && (
          <div
            style={{
              width: 408,
              flexShrink: 0,
              position: 'relative',
              background: c.a2,
              border: `${KEYLINE}px solid ${c.line}`,
              color: c.ink,
              padding: '16px 20px 18px',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 8,
              overflow: 'hidden',
            }}
          >
            <div style={label(c.ink, 18)}>Player class</div>
            <div style={{ ...condensed(46, c.ink), lineHeight: 0.92, textTransform: 'uppercase', maxWidth: 210 }}>{cls.name}</div>
            <div style={{ ...label(c.ink, 18), maxWidth: 210, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cls.short}</div>
            <img
              src={playerAvatar(cls.name)}
              alt=""
              style={{ position: 'absolute', right: 8, top: 8, width: 140, height: 'calc(100% - 16px)', objectFit: 'contain', imageRendering: 'pixelated' }}
            />
          </div>
        )}
      </section>

      {/* ---------- LED matrix: the year, day by day ---------- */}
      <section style={{ background: '#0B0D17', border: `${KEYLINE}px solid ${c.line}`, padding: '16px 20px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <span style={label('#F6F4EC', 18)}>{d.year} activity</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, ...label('#9AA0B4', 18) }}>
            less
            {[0, 1, 2, 3, 4].map((l) => (
              <span key={l} style={{ width: 16, height: 16, background: l === 0 ? '#F6F4EC' : led, opacity: LED_STEPS[l] }} />
            ))}
            more
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.max(weeks.length, 1)}, 1fr)`, gap: 4 }}>
          {weeks.map((week, wi) => (
            <div key={wi} style={{ display: 'grid', gridTemplateRows: 'repeat(7, 1fr)', gap: 4 }}>
              {week.map((l, di) => (
                <div
                  key={di}
                  style={{
                    aspectRatio: '1 / 1',
                    background: l <= 0 ? '#F6F4EC' : led,
                    opacity: l < 0 ? 0 : LED_STEPS[l],
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ---------- The one-liner ---------- */}
      <section style={{ ...window_, padding: '18px 24px', display: 'flex', alignItems: 'center', gap: 18, flex: '1 1 0', minHeight: 0 }}>
        <PlayerArrow size={30} color={c.ink} />
        <p
          style={{
            margin: 0,
            fontFamily: DISPLAY,
            fontSize: 29,
            fontWeight: 600,
            fontStretch: '92%',
            lineHeight: 1.22,
            color: c.ink,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {funMessage}
        </p>
      </section>

      {/* ---------- Footer: pixel band ---------- */}
      <footer style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexShrink: 0 }}>
        <div aria-hidden style={{ display: 'flex', gap: 6 }}>
          {[c.a1, c.line, c.a2, c.panel, c.a1, c.a2, c.line, c.panel, c.a1].map((ink, i) => (
            <span key={i} style={{ width: 22, height: 22, background: ink, border: `3px solid ${c.line}`, boxSizing: 'border-box' }} />
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {d.includesPrivate && (
            <span style={{ ...label(c.onGroundDim, 18), display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Lock size={14} color={c.onGroundDim} /> incl. private
            </span>
          )}
          <span style={label(c.onGround, 18)}>GitWrap {d.year}</span>
        </div>
      </footer>
    </div>
  );
});

export default ArcadeCard;
