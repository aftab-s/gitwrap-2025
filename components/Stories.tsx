import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { UserStats, Theme } from '../types';
import { calendarFacts, formatDay, playerClass } from '../insights';
import { toWeeks, LED_STEPS } from './ArcadeCard';
import GitWrapCard from './GitWrapCard';
import PlayerAvatar from './PlayerAvatar';
import { ArrowLeft, ArrowRight, Pause, PlayerArrow } from './icons/Arcade';
import StoryThemeBackdrop from './StoryThemeBackdrop';
import { THEMES, themeVars } from '../constants';

const THEME_MAP: Record<string, Theme> = THEMES.reduce((acc, t) => {
  acc[t.id] = t;
  return acc;
}, {} as Record<string, Theme>);

/**
 * Progression story design: each slide is crafted around a specific 2026 theme world,
 * taking the user through Maximalist Dark, Vice Sunset, Lunar Orbit, Latverian Steel,
 * Matchday '26, and Tokyo Riso, before culminating in the user's selected card.
 */
function getSlideTheme(slideId: string, slideIndex: number, totalSlides: number, userTheme: Theme): Theme {
  if (slideIndex === totalSlides - 1 || slideId === 'card') {
    return userTheme;
  }
  switch (slideId) {
    case 'intro':
      return THEME_MAP['artemis'] || userTheme;
    case 'score':
      return THEME_MAP['fifa'] || userTheme;
    case 'calendar':
      return THEME_MAP['gtavi'] || userTheme;
    case 'rhythm':
      return THEME_MAP['doomsday'] || userTheme;
    case 'streak':
      return THEME_MAP['maxdark'] || userTheme;
    case 'languages':
    case 'repos':
      return THEME_MAP['maxlight'] || userTheme;
    case 'class':
    case 'proof':
      return userTheme;
    default: {
      const sequence = ['artemis', 'fifa', 'gtavi', 'doomsday', 'maxdark', 'maxlight'];
      const themeId = sequence[slideIndex % sequence.length];
      return THEME_MAP[themeId] || userTheme;
    }
  }
}

interface Props {
  stats: UserStats;
  funMessage: string;
  theme: Theme;
  /** Called when the visitor finishes or skips the recap. */
  onDone: () => void;
}

type Tone = 'ground' | 'dark' | 'panel' | 'a1' | 'a2';

interface Slide {
  id: string;
  tone: Tone;
  /** Seconds on screen before it advances by itself. */
  seconds?: number;
  body: React.ReactNode;
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const RANKS = ['1st', '2nd', '3rd'];
const STORY_DURATION_SECONDS = 15;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);

/** A score counter that rolls up to its value. */
const CountUp: React.FC<{ to: number; ms?: number }> = ({ to, ms = 1100 }) => {
  const [value, setValue] = useState(() => (prefersReducedMotion() ? to : 0));
  useEffect(() => {
    if (prefersReducedMotion()) {
      setValue(to);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / ms);
      setValue(Math.round(to * (1 - Math.pow(1 - p, 4))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, ms]);
  return <>{value.toLocaleString()}</>;
};

/** Font size for the one huge figure on a slide, so any length fills the frame without overflowing. */
function fit(text: string): React.CSSProperties {
  const n = text.length;
  const cqw = n <= 3 ? 46 : n <= 5 ? 36 : n === 6 ? 30 : n === 7 ? 26 : n <= 9 ? 21 : 16;
  return { fontSize: `min(${cqw}cqw, 30cqh)` };
}

const i = (n: number) => ({ '--i': n }) as React.CSSProperties;

function buildSlides(stats: UserStats, funMessage: string, theme: Theme, onDone: () => void): Slide[] {
  const facts = calendarFacts(stats.contributionCalendar);
  const insights = stats.commitInsights;
  const name = stats.name || stats.login;
  const slides: Slide[] = [];

  slides.push({
    id: 'intro',
    tone: 'ground',
    body: (
      <>
        {stats.avatarUrl && <img className="story-avatar rise" src={stats.avatarUrl} alt="" />}
        <h2 className="display story-title rise" style={i(1)}>
          {name}, here is your <span className="story-mark">{stats.year}</span>
        </h2>
        <p className="story-text rise" style={i(3)}>
          Ready for a short recap?
        </p>
      </>
    ),
  });

  if (stats.totalContributions === 0) {
    slides.push({
      id: 'empty',
      tone: 'panel',
      body: (
        <>
          <h2 className="display story-h rise">No score yet</h2>
          <p className="story-text rise" style={i(1)}>
            Nothing public was counted for {stats.year}.{' '}
            {stats.includesPrivate ? 'Your first commit of the year starts the board.' : 'If your work lives in private repositories, sign in to count it.'}
          </p>
        </>
      ),
    });
  } else {
    const totalNum = stats.totalContributions;
    const growth = stats.yearOverYearGrowth?.overallGrowth;
    const commitsPct = totalNum > 0 ? Math.round((stats.totalCommits / totalNum) * 100) : 0;
    const prsPct = totalNum > 0 ? Math.round((stats.totalPRs / totalNum) * 100) : 0;
    const reviewsPct = totalNum > 0 ? Math.round((stats.totalPRReviews / totalNum) * 100) : 0;
    const issuesPct = totalNum > 0 ? Math.max(0, 100 - commitsPct - prsPct - reviewsPct) : 0;

    slides.push({
      id: 'score',
      tone: 'ground',
      body: (
        <>
          <div className="story-badge-header rise" style={i(0)}>
            // MATCHDAY TELEMETRY · 2026 CAMPAIGN
          </div>
          <h2 className="display story-h rise" style={{ ...i(1), margin: '0 0 1cqh' }}>
            Season Score
          </h2>

          <div className="story-scoreboard rise" style={i(2)}>
            <div className="story-scoreboard-top">
              <span>Official Match Count</span>
              <span>90&apos;+5 Verified</span>
            </div>
            <div className="story-scoreboard-value">
              <CountUp to={totalNum} />
            </div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 'clamp(0.65rem, 2.1cqw, 0.75rem)', color: 'var(--s-dim)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Total contributions logged on the board
            </div>
            {growth !== undefined && (
              <div className="story-chip" style={{ alignSelf: 'flex-start', margin: '0.4cqh 0 0' }}>
                ▲ {growth >= 0 ? '+' : ''}{growth}% vs {stats.year - 1} campaign
              </div>
            )}
          </div>

          {/* Tactical distribution strip */}
          <div className="story-dist-bar rise" style={i(3)} aria-hidden>
            <div className="story-dist-seg" style={{ width: `${commitsPct}%`, background: '#FFD21F' }} />
            <div className="story-dist-seg" style={{ width: `${prsPct}%`, background: '#FF334B' }} />
            <div className="story-dist-seg" style={{ width: `${reviewsPct}%`, background: '#96D4B0' }} />
            <div className="story-dist-seg" style={{ width: `${issuesPct}%`, background: '#041E10' }} />
          </div>

          {/* 4-up tactical squad cards */}
          <div className="story-squad-grid" aria-label="Contribution breakdown">
            <div className="story-squad-card rise" style={i(4)}>
              <span className="story-squad-label">Commits</span>
              <span className="story-squad-val">{stats.totalCommits.toLocaleString()}</span>
              <span className="story-squad-role">{commitsPct}% · Playmaker</span>
            </div>
            <div className="story-squad-card rise" style={i(5)}>
              <span className="story-squad-label">Pull Requests</span>
              <span className="story-squad-val">{stats.totalPRs.toLocaleString()}</span>
              <span className="story-squad-role">Striker / Attacks</span>
            </div>
            <div className="story-squad-card rise" style={i(6)}>
              <span className="story-squad-label">PR Reviews</span>
              <span className="story-squad-val">{stats.totalPRReviews.toLocaleString()}</span>
              <span className="story-squad-role">Assists &amp; Defense</span>
            </div>
            <div className="story-squad-card rise" style={i(7)}>
              <span className="story-squad-label">Issues</span>
              <span className="story-squad-val">{stats.totalIssues.toLocaleString()}</span>
              <span className="story-squad-role">Tactical Strategy</span>
            </div>
          </div>

          <p className="story-note rise" style={{ ...i(8), marginTop: '0.6cqh' }}>
            Match grade telemetry · Official season whistle confirmed
          </p>
        </>
      ),
    });

    const activePct = Math.round((facts.activeDays / Math.max(facts.days, 1)) * 100);
    const qActive = [0, 0, 0, 0];
    const qTotal = [0, 0, 0, 0];
    for (const d of stats.contributionCalendar) {
      const month = new Date(d.date).getUTCMonth();
      const qIdx = Math.min(3, Math.floor(month / 3));
      qTotal[qIdx]++;
      if (d.count > 0) qActive[qIdx]++;
    }
    const qLabels = ['Q1 [JAN-MAR]', 'Q2 [APR-JUN]', 'Q3 [JUL-SEP]', 'Q4 [OCT-DEC]'];
    const arcLen = 299.5;
    const arcFill = (activePct / 100) * arcLen;

    slides.push({
      id: 'calendar',
      tone: 'ground',
      body: (
        <>
          <div className="story-badge-header rise" style={i(0)}>
            // VICE CRUISE TELEMETRY · 365 DAYS
          </div>
          <h2 className="display story-h rise" style={{ ...i(1), margin: '0 0 0.5cqh' }}>
            Days on Duty
          </h2>

          {/* Speedometer Tachometer Gauge */}
          <div className="story-speedo-frame rise" style={i(2)}>
            <svg viewBox="0 0 260 145" style={{ width: 'min(72cqw, 280px)', overflow: 'visible' }}>
              <defs>
                <linearGradient id="viceSpeedoGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00F5D4" />
                  <stop offset="50%" stopColor="#FF2A85" />
                  <stop offset="100%" stopColor="#FFB703" />
                </linearGradient>
              </defs>
              <path
                d="M 57 122 A 78 78 0 1 1 203 122"
                fill="none"
                stroke="rgba(255, 255, 255, 0.12)"
                strokeWidth="12"
                strokeLinecap="round"
              />
              <path
                d="M 57 122 A 78 78 0 1 1 203 122"
                fill="none"
                stroke="url(#viceSpeedoGrad)"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={`${arcFill} ${arcLen}`}
              />
              <text x="130" y="82" textAnchor="middle" fill="#FFFFFF" fontFamily="'Doto', monospace" fontWeight="900" fontSize="38">
                {facts.activeDays}
              </text>
              <text x="130" y="104" textAnchor="middle" fill="var(--s-dim)" fontFamily="'Martian Mono', monospace" fontWeight="700" fontSize="10" letterSpacing="0.06em">
                / {facts.days} DAYS ACTIVE
              </text>
            </svg>
            <div className="story-chip" style={{ alignSelf: 'center', marginTop: '-1.5cqh' }}>
              ▲ {activePct}% CRUISE ATTENDANCE
            </div>
          </div>

          {/* 4-Quarter Cruise Velocity Breakdown */}
          <div className="story-quarter-grid" aria-label="Quarterly attendance">
            {qLabels.map((qLabel, qIdx) => {
              const ratio = qActive[qIdx] / Math.max(qTotal[qIdx], 1);
              const litCells = Math.round(ratio * 5);
              return (
                <div key={qLabel} className="story-quarter-card rise" style={i(4 + qIdx)}>
                  <span className="story-quarter-title">{qLabel.split(' ')[0]}</span>
                  <div className="story-quarter-bar" aria-hidden>
                    {[0, 1, 2, 3, 4].map((cell) => (
                      <span key={cell} className={`story-quarter-cell${cell < litCells ? ' lit' : ''}`} />
                    ))}
                  </div>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 'clamp(0.55rem, 1.8cqw, 0.65rem)', color: 'var(--s-dim)' }}>
                    {Math.round(ratio * 100)}%
                  </span>
                </div>
              );
            })}
          </div>

          {facts.peak && (
            <div className="story-ticket-strip rise" style={i(8)}>
              <span className="story-ticket-label">Peak Velocity Citation</span>
              <span className="story-ticket-val">
                {formatDay(facts.peak.date)} · {facts.peak.count.toLocaleString()} contributions logged
              </span>
            </div>
          )}
        </>
      ),
    });

    const bestDay = DAYS.indexOf(stats.bestDayOfWeek);
    const maxDay = Math.max(...facts.weekdayTotals, 1);
    const maxHour = insights ? Math.max(...insights.hours, 1) : 1;
    const hourNum = stats.bestHour;
    const hourStr = `${String(hourNum).padStart(2, '0')}:00`;
    const dayName = bestDay >= 0 ? DAYS[bestDay] : 'Weekdays';
    const phaseName =
      hourNum >= 0 && hourNum < 6
        ? 'NIGHT OPS · ZERO VISIBILITY'
        : hourNum < 12
        ? 'DAWN STRIKE · EARLY ACCESS'
        : hourNum < 18
        ? 'AFTERNOON POWER · PRIME RUNTIME'
        : 'EVENING SIEGE · PEAK OUTPUT';

    const hourSpikes = Array.from({ length: 24 }, (_, h) => {
      const cnt = insights ? insights.hours[h] : h === hourNum ? 10 : 0;
      const angle = (h / 24) * 2 * Math.PI - Math.PI / 2;
      const rInner = 50;
      const rOuter = rInner + 8 + 26 * (cnt / maxHour);
      const isPeak = h === hourNum;
      const x1 = 110 + rInner * Math.cos(angle);
      const y1 = 100 + rInner * Math.sin(angle);
      const x2 = 110 + rOuter * Math.cos(angle);
      const y2 = 100 + rOuter * Math.sin(angle);
      return { h, cnt, isPeak, x1, y1, x2, y2 };
    });

    slides.push({
      id: 'rhythm',
      tone: 'ground',
      body: (
        <>
          <div className="story-badge-header rise" style={i(0)}>
            // CHRONO-TACTICAL LOCK-ON · TEMPORAL RETICLE
          </div>
          <h2 className="display story-h rise" style={{ ...i(1), margin: '0 0 0.5cqh' }}>
            Combat Rhythm
          </h2>

          {/* 24-Hour Chrono Radar */}
          <div className="story-radar-container rise" style={i(2)}>
            <svg viewBox="0 0 220 200" style={{ width: 'min(50cqw, 25cqh, 175px)', maxHeight: '25cqh', overflow: 'visible' }}>
              <circle cx="110" cy="100" r="86" fill="none" stroke="#00FF88" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.3" />
              <circle cx="110" cy="100" r="50" fill="none" stroke="#00FF88" strokeWidth="1" strokeDasharray="2 3" opacity="0.2" />
              <line x1="110" y1="12" x2="110" y2="188" stroke="#00FF88" strokeWidth="1" opacity="0.18" />
              <line x1="22" y1="100" x2="198" y2="100" stroke="#00FF88" strokeWidth="1" opacity="0.18" />
              <text x="110" y="9" textAnchor="middle" fill="#00FF88" opacity="0.75" fontFamily="'Martian Mono', monospace" fontSize="8">00h</text>
              <text x="210" y="103" textAnchor="middle" fill="#00FF88" opacity="0.75" fontFamily="'Martian Mono', monospace" fontSize="8">06h</text>
              <text x="110" y="198" textAnchor="middle" fill="#00FF88" opacity="0.75" fontFamily="'Martian Mono', monospace" fontSize="8">12h</text>
              <text x="10" y="103" textAnchor="middle" fill="#00FF88" opacity="0.75" fontFamily="'Martian Mono', monospace" fontSize="8">18h</text>
              {hourSpikes.map(({ h, cnt, isPeak, x1, y1, x2, y2 }) => (
                <line
                  key={h}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={isPeak ? '#00FF88' : cnt > 0 ? '#00FF88' : 'rgba(255, 255, 255, 0.15)'}
                  strokeWidth={isPeak ? 3.5 : cnt > 0 ? 2 : 1}
                  opacity={isPeak ? 1 : cnt > 0 ? 0.35 + 0.65 * (cnt / maxHour) : 0.2}
                />
              ))}
              <text x="110" y="96" textAnchor="middle" fill="#00FF88" fontFamily="'Doto', monospace" fontWeight="900" fontSize="24">
                {hourStr}
              </text>
              <text x="110" y="112" textAnchor="middle" fill="#9AA7B8" fontFamily="'Martian Mono', monospace" fontWeight="800" fontSize="7.5" letterSpacing="0.08em">
                PEAK TARGET
              </text>
            </svg>
          </div>

          <div className="story-chip rise" style={{ alignSelf: 'center', marginTop: '-0.5cqh', ...i(3) }}>
            [ {phaseName} ]
          </div>

          {/* 7-Day Frequency Matrix */}
          <div className="story-days-grid" aria-label="Weekly distribution">
            {facts.weekdayTotals.map((val, d) => {
              const isPeak = d === bestDay;
              const litCount = Math.round((val / maxDay) * 5);
              return (
                <div key={d} className={`story-day-col${isPeak ? ' on' : ''} rise`} style={i(4 + d)}>
                  <div className="story-day-meter" aria-hidden>
                    {[0, 1, 2, 3, 4].map((cell) => (
                      <span key={cell} className={`story-day-cell${cell < litCount ? ' lit' : ''}`} />
                    ))}
                  </div>
                  <span className="story-day-name">{DAYS[d].slice(0, 3)}</span>
                </div>
              );
            })}
          </div>

          <p className="story-note rise" style={{ ...i(11), marginTop: '0.4cqh', textWrap: 'balance' }}>
            {dayName}s carried the year · Chrono synchronized
          </p>
        </>
      ),
    });

    if (facts.streak && facts.streak.days >= 3) {
      const days = facts.streak.days;
      const litCaps = Math.min(10, Math.max(1, Math.round((days / 30) * 10)));
      const statusTitle =
        days >= 45
          ? 'GODLIKE // OVERCLOCK TIER IV'
          : days >= 21
          ? 'HYPERCHARGED // OVERCLOCK TIER III'
          : days >= 7
          ? 'SURGE VELOCITY // OVERCLOCK TIER II'
          : 'MOMENTUM ONLINE // OVERCLOCK TIER I';

      slides.push({
        id: 'streak',
        tone: 'ground',
        body: (
          <>
            <div className="story-badge-header rise" style={i(0)}>
              // PIPELINE RETENTION · COMBO MULTIPLIER
            </div>
            <h2 className="display story-h rise" style={{ ...i(1), margin: '0 0 0.8cqh' }}>
              Unbroken Streak
            </h2>

            {/* Hero Arcade Combo Card */}
            <div className="story-combo-card rise" style={i(2)}>
              <span className="story-combo-badge">[ STREAK MULTIPLIER ]</span>
              <div className="story-combo-digits">
                <CountUp to={days} ms={900} />
              </div>
              <span className="story-combo-sub">Consecutive Days Unbroken</span>
            </div>

            {/* Overclock Capacitor Bank */}
            <div className="story-capacitors-wrap rise" style={i(3)}>
              <div className="story-capacitors-header">
                <span>Capacitor Overclock</span>
                <span>{statusTitle}</span>
              </div>
              <div className="story-capacitors-bar" aria-hidden>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((idx) => (
                  <span key={idx} className={`story-cap-cell${idx < litCaps ? ' lit' : ''}`} />
                ))}
              </div>
            </div>

            {/* Hex Memory Dump Block */}
            <div className="story-hex-block rise" style={i(4)}>
              <div>START: <span>{formatDay(facts.streak.from)}</span></div>
              <div>FINAL: <span>{formatDay(facts.streak.to)}</span></div>
              <div style={{ marginTop: '0.2cqh' }}>BUFFER: <span>100% RETENTION · ZERO MISSED CYCLES</span></div>
            </div>

            <p className="story-note rise" style={{ ...i(5), marginTop: '0.4cqh' }}>
              Hardware pipeline locked · Hex register 0x7E0 active
            </p>
          </>
        ),
      });
    }

    const langs = stats.topLanguages.slice(0, 4);
    if (langs.length > 0) {
      slides.push({
        id: 'languages',
        tone: 'panel',
        body: (
          <>
            <h2 className="display story-h rise">Your loadout</h2>
            <div className="story-meters">
              {langs.map((lang, n) => (
                <div key={lang.name} className="rise" style={i(1 + n * 2)}>
                  <div className="story-meter-head">
                    <span className="story-meter-name">{lang.name}</span>
                    <span className="score-value">{lang.percent.toFixed(1)}%</span>
                  </div>
                  <div className="story-meter">
                    <span className={`m${n}`} style={{ width: `${Math.max(lang.percent, 2)}%`, ...i(2 + n * 2) }} />
                  </div>
                </div>
              ))}
            </div>
            <p className="story-note rise" style={i(8)}>
              Share of your commits, by each repository&rsquo;s main language
            </p>
          </>
        ),
      });
    }

    const repos = stats.topRepos.slice(0, 3);
    if (repos.length > 0) {
      slides.push({
        id: 'repos',
        tone: 'dark',
        body: (
          <>
            <h2 className="display story-h rise">High scores</h2>
            <ol className="story-ranks">
              {repos.map((repo, n) => (
                <li key={`${repo.name}-${n}`} className="rise" style={i(1 + n * 2)}>
                  <span className="story-rank">{RANKS[n]}</span>
                  <span className="story-rank-name">{repo.name}</span>
                  <span className="story-rank-score">{repo.contributions.toLocaleString()}</span>
                </li>
              ))}
            </ol>
            <p className="story-note rise" style={i(8)}>
              Commits per repository
            </p>
          </>
        ),
      });
    }

    const cls = playerClass(stats);

    slides.push({
      id: 'class',
      tone: 'a1',
      body: (
        <>
          <div className="story-pet rise">
            <PlayerAvatar name={cls.name} size={176} />
          </div>
          <p className="story-lead rise" style={i(1)}>That makes you {/^[aeiou]/i.test(cls.name) ? 'an' : 'a'}</p>
          <h2 className="display story-stamp" style={fit(cls.name.split(' ').sort((a, b) => b.length - a.length)[0] + 'xx')}>
            {cls.name}
          </h2>
          <p className="story-text rise" style={i(8)}>
            {cls.line}
          </p>
          <p className="story-chip rise" style={i(10)}>
            {cls.badge}
          </p>
        </>
      ),
    });

    const article = /^[aeiou]/i.test(cls.name) ? 'an' : 'a';

    slides.push({
      id: 'proof',
      tone: 'a2',
      body: (
        <div className="story-proof">
          <div className="story-proof-head rise">
            <div className="story-proof-avatar-box">
              <PlayerAvatar name={cls.name} size={46} />
            </div>
            <div style={{ minWidth: 0, flex: '1 1 auto' }}>
              <span className="story-proof-badge">{cls.badge}</span>
              <h2 className="story-proof-title">
                Why You&rsquo;re {article} {cls.name}
              </h2>
            </div>
          </div>

          <div className="story-proof-dialogue rise" style={i(2)}>
            <span className="story-proof-dialogue-tag">The Verdict</span>
            <p className="story-proof-dialogue-text">
              &ldquo;{cls.proof.headline}&rdquo;
            </p>
          </div>

          <div className="story-proof-grid">
            {cls.proof.metrics.map((m, n) => (
              <div key={m.label} className="story-proof-card rise" style={i(3 + n)}>
                <span className="story-proof-card-label">{m.label}</span>
                <span className="story-proof-card-val">{m.value}</span>
                {m.hint && <span className="story-proof-card-hint">{m.hint}</span>}
              </div>
            ))}
          </div>

          <div className="story-proof-formula rise" style={i(8)}>
            <span>[FORMULA] {cls.proof.formula}</span>
          </div>
        </div>
      ),
    });
  }

  slides.push({
    id: 'card',
    tone: 'ground',
    body: (
      <>
        <h2 className="display story-h story-h-sm rise">Your card is ready</h2>
        <GitWrapCard className="story-print" userData={stats} funMessage={funMessage} theme={theme} />
        <div className="story-actions">
          <button type="button" className="key key-lg key-block" onClick={onDone}>
            Get my card
            <ArrowRight size={20} />
          </button>
        </div>
      </>
    ),
  });

  return slides;
}

interface StorySegmentsProps {
  slides: Slide[];
  current: number;
  paused: boolean;
  onAdvance: () => void;
}

const StorySegments: React.FC<StorySegmentsProps> = ({ slides, current, paused, onAdvance }) => {
  const last = slides.length - 1;
  const isLast = current >= last;
  const activeBarRef = useRef<HTMLElement | null>(null);
  const elapsedRef = useRef(0);
  const lastTimeRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const durationMs = (slides[current]?.seconds ?? STORY_DURATION_SECONDS) * 1000;

  // Whenever the active slide index changes, reset elapsed time and bar transform
  useEffect(() => {
    elapsedRef.current = 0;
    if (activeBarRef.current) {
      activeBarRef.current.style.transform = 'scaleX(0)';
    }
  }, [current]);

  // Handle RAF progress timer
  useEffect(() => {
    if (isLast || paused) {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      return;
    }

    lastTimeRef.current = performance.now();

    const tick = (now: number) => {
      const delta = now - lastTimeRef.current;
      lastTimeRef.current = now;
      elapsedRef.current += delta;

      const progress = Math.min(1, elapsedRef.current / durationMs);

      if (activeBarRef.current) {
        activeBarRef.current.style.transform = `scaleX(${progress})`;
      }

      if (progress >= 1) {
        onAdvance();
      } else {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [current, isLast, paused, durationMs, onAdvance]);

  return (
    <div className="stories-segs" aria-hidden>
      {slides.map((s, n) => {
        const isDone = n < current || (n === current && isLast);
        const isCurrent = n === current && !isLast;
        return (
          <span
            key={s.id}
            className={`stories-seg${isDone ? ' done' : isCurrent ? ' on' : ''}`}
          >
            <i
              ref={isCurrent ? (el) => { activeBarRef.current = el; } : undefined}
              style={isDone ? { transform: 'scaleX(1)' } : isCurrent ? undefined : { transform: 'scaleX(0)' }}
            />
          </span>
        );
      })}
    </div>
  );
};

/** The recap: a run of full-screen stories that ends on the card. */
const Stories: React.FC<Props> = ({ stats, funMessage, theme, onDone }) => {
  const slides = useMemo(() => buildSlides(stats, funMessage, theme, onDone), [stats, funMessage, theme, onDone]);
  const [index, setIndex] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [held, setHeld] = useState(false);
  const [hidden, setHidden] = useState(false);
  const pressedAt = useRef(0);
  const last = slides.length - 1;
  const current = Math.min(index, last);
  const slide = slides[current];
  const paused = userPaused || held || hidden;

  const currentSlideTheme = useMemo(
    () => getSlideTheme(slide.id, current, slides.length, theme),
    [slide.id, current, slides.length, theme]
  );

  const go = useCallback(
    (step: number) => setIndex((n) => Math.max(0, Math.min(slides.length - 1, n + step))),
    [slides.length]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === 'Escape') onDone();
      else if (e.key === ' ' && e.target === document.body) {
        e.preventDefault();
        setUserPaused((p) => !p);
      }
    };
    const onVisibility = () => setHidden(document.hidden);
    window.addEventListener('keydown', onKey);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [go, onDone]);

  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        time: performance.now(),
      };
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    const elapsed = performance.now() - touchStartRef.current.time;
    touchStartRef.current = null;

    // Horizontal swipe detected: >= 40px, predominantly horizontal, within 600ms
    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2 && elapsed < 600) {
      if (deltaX < 0) {
        go(1); // Swipe left -> next slide
      } else {
        go(-1); // Swipe right -> previous slide
      }
    }
  };

  // A quick tap moves; a longer press only holds the story still.
  const zone = (step: number) => ({
    onPointerDown: () => {
      pressedAt.current = performance.now();
      setHeld(true);
    },
    onPointerUp: () => {
      setHeld(false);
      if (performance.now() - pressedAt.current < 300) go(step);
    },
    onPointerLeave: () => setHeld(false),
    onPointerCancel: () => setHeld(false),
    onClick: (e: React.MouseEvent) => {
      if (e.detail === 0) go(step); // keyboard activation
    },
  });

  return (
    <section
      className={`stories${paused ? ' is-paused' : ''}`}
      style={themeVars(currentSlideTheme) as React.CSSProperties}
      aria-roledescription="carousel"
      aria-label={`${stats.login}'s ${stats.year} recap`}
    >
      <div className="stories-side stories-side-prev">
        <button type="button" className="key key-plain" onClick={() => go(-1)} disabled={current === 0} aria-label="Previous story">
          <ArrowLeft size={20} />
        </button>
      </div>

      <div
        className={`stories-frame tone-${slide.tone}`}
        style={themeVars(currentSlideTheme) as React.CSSProperties}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Dynamic Slide Thematic Vector Backdrop */}
        <StoryThemeBackdrop themeId={currentSlideTheme.id} c={currentSlideTheme.c} />

        <div className="stories-top">
          <StorySegments
            slides={slides}
            current={current}
            paused={paused}
            onAdvance={() => go(1)}
          />
          <div className="stories-bar">
            <span className="stories-brand">
              GitWrap {stats.year} · {current + 1}/{slides.length}
            </span>
            {current < last && (
              <>
                <button type="button" className="stories-ctl" onClick={() => setUserPaused((p) => !p)} aria-label={userPaused ? 'Play' : 'Pause'} aria-pressed={userPaused}>
                  {userPaused ? <PlayerArrow size={16} /> : <Pause size={16} />}
                </button>
                <button type="button" className="stories-skip" onClick={onDone}>
                  Skip to card
                </button>
              </>
            )}
          </div>
        </div>

        <div key={slide.id} className={`story story-${slide.id}`} aria-live={paused ? 'polite' : 'off'}>
          {slide.body}
        </div>

        <button type="button" className="stories-tap stories-tap-prev" aria-label="Previous story" disabled={current === 0} {...zone(-1)} />
        {current < last && <button type="button" className="stories-tap stories-tap-next" aria-label="Next story" {...zone(1)} />}
      </div>

      <div className="stories-side stories-side-next">
        <button type="button" className="key" onClick={() => go(1)} disabled={current === last} aria-label="Next story">
          <ArrowRight size={20} />
        </button>
        <span className="silk">Arrow keys move · hold to pause</span>
      </div>
    </section>
  );
};

export default Stories;
