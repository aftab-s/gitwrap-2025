import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { UserStats, Theme } from '../types';
import { calendarFacts, formatDay, formatHour, playerClass } from '../insights';
import { toWeeks, LED_STEPS } from './ArcadeCard';
import GitWrapCard from './GitWrapCard';
import PlayerAvatar from './PlayerAvatar';
import { ArrowLeft, ArrowRight, Pause, PlayerArrow } from './icons/Arcade';
import { THEMES, themeVars } from '../constants';

const THEME_MAP: Record<string, Theme> = THEMES.reduce((acc, t) => {
  acc[t.id] = t;
  return acc;
}, {} as Record<string, Theme>);

const GTAVI_STORY_THEME: Theme = {
  id: 'gtavi',
  name: 'Vice Sunset',
  tagline: 'Neon Dusk Leonida',
  c: {
    ground: '#18072B',
    line: '#090014',
    ink: '#0E011C',
    panel: '#FFF6FA',
    a1: '#FF2A85',
    a2: '#00F5D4',
    led: '#FFB703',
    onGround: '#FFFFFF',
    onGroundDim: '#DCA8FF',
    onPanelDim: '#704688',
  },
};

/**
 * Progression story design: each slide is crafted around a specific 2026 theme world,
 * taking the user through Maximalist Dark, Vice Sunset, Lunar Orbit, Latverian Steel,
 * Matchday '26, and Tokyo Riso, before culminating in the user's selected card.
 */
// Calm, fixed palettes for the character reveal and supporting evidence.
const CLASS_STORY_THEME: Theme = {
  id: 'story-sage', name: 'Quiet Grove', tagline: 'Player profile',
  c: { ground: '#202C29', line: '#40534B', ink: '#18241F', panel: '#E5ECE5',
    a1: '#B5CFB9', a2: '#C5BCAB', onGround: '#EDF0E8', onGroundDim: '#B9C5BC', onPanelDim: '#526459' },
};
const PROOF_STORY_THEME: Theme = {
  id: 'story-slate', name: 'Evening Slate', tagline: 'Class details',
  c: { ground: '#272C39', line: '#485064', ink: '#202430', panel: '#E8EAF0',
    a1: '#BAC5DC', a2: '#C5BDD5', onGround: '#EDEEF3', onGroundDim: '#B8BECE', onPanelDim: '#586176' },
};

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
      return GTAVI_STORY_THEME;
    case 'rhythm':
      return THEME_MAP['doomsday'] || userTheme;
    case 'streak':
      return THEME_MAP['maxdark'] || userTheme;
    case 'languages':
    case 'repos':
      return THEME_MAP['maxlight'] || userTheme;
    case 'class':
      return CLASS_STORY_THEME;
    case 'proof':
      return PROOF_STORY_THEME;
    default: {
      const sequence = ['artemis', 'fifa', 'gtavi', 'doomsday', 'maxdark', 'maxlight'];
      const themeId = sequence[slideIndex % sequence.length];
      if (themeId === 'gtavi') return GTAVI_STORY_THEME;
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

/** A score counter that rolls up to its value. */
const CountUp: React.FC<{ to: number; ms?: number }> = ({ to, ms = 1100 }) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
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
        <div className="story-player-edition rise" style={i(0)}><span>GitWrap / {stats.year}</span><span>Player 01</span></div>
        <div className="story-player-stage">
          <span className="story-player-echo" aria-hidden="true">{stats.year}</span>
          <div className="story-player-pass">
            <div className="story-player-photo">
              {stats.avatarUrl ? <img src={stats.avatarUrl} alt="" /> : <span className="story-player-initial">{name.slice(0, 1)}</span>}
            </div>
            <span className="story-player-handle">@{stats.login}</span>
          </div>
          <span className="story-player-sticker">MAIN<br />CHARACTER</span>
          <svg className="story-player-spark" viewBox="0 0 40 40" fill="none" aria-hidden="true"><path d="M20 2v12m0 12v12M2 20h12m12 0h12M7 7l8 8m10 10 8 8M7 33l8-8m10-10 8-8" /></svg>
        </div>
        <h2 className="display story-player-title rise" style={i(3)}>Player one.<br /><span>You're up.</span></h2>
        <p className="story-player-name rise" style={i(4)}>{name}, this is your {stats.year}.</p>
        <p className="story-player-copy rise" style={i(5)}>The late nights. The little wins.<br />The commits that made it yours.</p>
        <div className="story-player-footer rise" style={i(6)}><span>Let’s roll the highlights</span><ArrowRight size={18} /></div>
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
              <CountUp to={totalNum} ms={1800} />
            </div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 'clamp(0.65rem, 2.1cqw, 0.75rem)', color: 'var(--s-dim)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Total contributions logged on the board
            </div>
            {growth !== undefined && (
              <div className="story-chip" style={{ alignSelf: 'flex-start', margin: '0.4cqh 0 0', animationDelay: '600ms' }}>
                ▲ {growth >= 0 ? '+' : ''}{growth}% vs {stats.year - 1} campaign
              </div>
            )}
          </div>

          {/* Tactical distribution strip */}
          <div className="story-dist-bar" aria-hidden>
            <div className="story-dist-seg" style={{ width: `${commitsPct}%`, background: '#FFD21F', animationDelay: '400ms' }} />
            <div className="story-dist-seg" style={{ width: `${prsPct}%`, background: '#FF334B', animationDelay: '900ms' }} />
            <div className="story-dist-seg" style={{ width: `${reviewsPct}%`, background: '#96D4B0', animationDelay: '1400ms' }} />
            <div className="story-dist-seg" style={{ width: `${issuesPct}%`, background: '#041E10', animationDelay: '1900ms' }} />
          </div>

          {/* 4-up tactical squad cards */}
          <div className="story-squad-grid" aria-label="Contribution breakdown">
            <div className="story-squad-card" style={{ animationDelay: '600ms' }}>
              <span className="story-squad-label">Commits</span>
              <span className="story-squad-val">{stats.totalCommits.toLocaleString()}</span>
              <span className="story-squad-role">{commitsPct}% · Playmaker</span>
            </div>
            <div className="story-squad-card" style={{ animationDelay: '850ms' }}>
              <span className="story-squad-label">Pull Requests</span>
              <span className="story-squad-val">{stats.totalPRs.toLocaleString()}</span>
              <span className="story-squad-role">Striker / Attacks</span>
            </div>
            <div className="story-squad-card" style={{ animationDelay: '1100ms' }}>
              <span className="story-squad-label">PR Reviews</span>
              <span className="story-squad-val">{stats.totalPRReviews.toLocaleString()}</span>
              <span className="story-squad-role">Assists &amp; Defense</span>
            </div>
            <div className="story-squad-card" style={{ animationDelay: '1350ms' }}>
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
      const month = new Date(`${d.date}T00:00:00Z`).getUTCMonth();
      const qIdx = Math.min(3, Math.floor(month / 3));
      qTotal[qIdx]++;
      if (d.count > 0) qActive[qIdx]++;
    }
    const qLabels = ['Q1 (Jan–Mar)', 'Q2 (Apr–Jun)', 'Q3 (Jul–Sep)', 'Q4 (Oct–Dec)'];
    const weeks = toWeeks(stats.contributionCalendar);

    slides.push({
      id: 'calendar',
      tone: 'ground',
      body: (
        <>
          <div className="story-badge-header rise" style={i(0)}>
            // ACTIVITY · 365 DAYS
          </div>
          <h2 className="display story-h rise" style={{ ...i(1), margin: '0 0 0.4cqh' }}>
            Days Active
          </h2>

          {/* Hero Active Count & 52-Week Mini Heatmap Mosaic */}
          <div className="story-heat-card rise" style={i(2)}>
            <div className="story-heat-card-top">
              <span>Contribution Consistency</span>
              <span>{activePct}% OF YEAR</span>
            </div>
            <div className="story-heat-card-val">
              <CountUp to={facts.activeDays} ms={1600} />
            </div>
            <div className="story-heat-card-sub">
              Active days recorded out of {facts.days} total
            </div>

            {/* 52-Week Micro Contribution Mosaic */}
            <div className="story-heat-strip" aria-label="Year contribution graph">
              <svg viewBox="0 0 252 35" style={{ width: '100%', height: 'auto', display: 'block' }}>
                {weeks.map((w, wIdx) => {
                  const x = wIdx * 4.75;
                  return w.map((lvl, dIdx) => {
                    if (lvl < 0) return null;
                    const y = dIdx * 4.75;
                    const fill =
                      lvl === 0
                        ? 'rgba(255, 255, 255, 0.08)'
                        : lvl === 1
                          ? 'color-mix(in srgb, var(--s-hi) 35%, transparent)'
                          : lvl === 2
                            ? 'color-mix(in srgb, var(--s-hi) 60%, transparent)'
                            : lvl === 3
                              ? 'color-mix(in srgb, var(--s-hi) 85%, transparent)'
                              : 'var(--s-hi)';
                    return (
                      <rect
                        key={`${wIdx}-${dIdx}`}
                        x={x}
                        y={y}
                        width="3.6"
                        height="3.6"
                        rx="0.8"
                        fill={fill}
                        className={lvl > 0 ? 'story-mosaic-cell lit' : 'story-mosaic-cell'}
                        style={{ animationDelay: `${250 + wIdx * 35 + dIdx * 10}ms` }}
                      />
                    );
                  });
                })}
              </svg>
            </div>
          </div>

          {/* 4 Quarterly Activity Pods */}
          <div className="story-q-grid" aria-label="Quarterly activity breakdown">
            {qLabels.map((qLabel, qIdx) => {
              const ratio = qActive[qIdx] / Math.max(qTotal[qIdx], 1);
              const litCells = Math.round(ratio * 5);
              const qShort = qLabel.split(' ')[0];
              const qPeriod = qLabel.split(' ')[1].replace(/[()]/g, '');
              return (
                <div key={qLabel} className="story-q-card" style={{ animationDelay: `${600 + qIdx * 220}ms` }}>
                  <div className="story-q-head">
                    <span className="story-q-tag">{qShort}</span>
                    <span className="story-q-period">{qPeriod}</span>
                  </div>
                  <div className="story-q-num">
                    {qActive[qIdx]} <span className="story-q-num-sub">days</span>
                  </div>
                  <div className="story-q-bar" aria-hidden>
                    {[0, 1, 2, 3, 4].map((cell) => (
                      <span
                        key={cell}
                        className={`story-q-cell${cell < litCells ? ' lit' : ''}`}
                        style={cell < litCells ? { animationDelay: `${750 + qIdx * 200 + cell * 80}ms` } : undefined}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {facts.peak && (
            <div className="story-ticket-strip rise" style={i(8)}>
              <span className="story-ticket-label">Most Active Day</span>
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
    const maxHour = insights ? Math.max(...insights.hours, 1) : 10;
    const hourNum = stats.bestHour;
    const hourStr = formatHour(hourNum);
    const dayName = bestDay >= 0 ? DAYS[bestDay] : 'Weekdays';
    const coderCategory =
      hourNum >= 0 && hourNum < 5
        ? 'Late Night Coder'
        : hourNum < 12
          ? 'Early Morning Coder'
          : hourNum < 18
            ? 'Afternoon Coder'
            : 'Evening Coder';

    const hourSpikes = Array.from({ length: 24 }, (_, h) => {
      let cnt = insights ? insights.hours[h] : 0;
      if (!insights && hourNum >= 0) {
        // Natural distribution curve centered around the user's peak hour
        const dist = Math.min(Math.abs(h - hourNum), 24 - Math.abs(h - hourNum));
        cnt = Math.max(1, Math.round(10 * Math.exp(-(dist * dist) / 18)));
      }
      const angle = (h / 24) * 2 * Math.PI - Math.PI / 2;
      const rInner = 48;
      const rOuter = rInner + 6 + 24 * (cnt / maxHour);
      const isPeak = h === hourNum;
      const x1 = 110 + rInner * Math.cos(angle);
      const y1 = 95 + rInner * Math.sin(angle);
      const x2 = 110 + rOuter * Math.cos(angle);
      const y2 = 95 + rOuter * Math.sin(angle);
      return { h, cnt, isPeak, x1, y1, x2, y2 };
    });

    slides.push({
      id: 'rhythm',
      tone: 'ground',
      body: (
        <>
          <div className="story-badge-header rise" style={i(0)}>
            // PEAK HOURS & DAYS
          </div>
          <h2 className="display story-h rise" style={{ ...i(1), margin: '0 0 0.4cqh' }}>
            When You Code
          </h2>

          {/* 24-Hour Circular Activity Clock */}
          <div className="story-clock-frame rise" style={i(2)}>
            <svg viewBox="0 0 220 190" style={{ width: 'min(52cqw, 24cqh, 175px)', maxHeight: '24cqh', overflow: 'visible' }}>
              <circle cx="110" cy="95" r="82" fill="none" stroke="var(--s-fg)" strokeWidth="1" opacity="0.15" />
              <circle cx="110" cy="95" r="48" fill="none" stroke="var(--s-hi)" strokeWidth="1" strokeDasharray="3 3" opacity="0.3" />
              <line x1="110" y1="12" x2="110" y2="178" stroke="var(--s-fg)" strokeWidth="1" opacity="0.12" />
              <line x1="27" y1="95" x2="193" y2="95" stroke="var(--s-fg)" strokeWidth="1" opacity="0.12" />
              <text x="110" y="8" textAnchor="middle" fill="var(--s-dim)" fontFamily="'Martian Mono', monospace" fontSize="8">00:00</text>
              <text x="210" y="98" textAnchor="middle" fill="var(--s-dim)" fontFamily="'Martian Mono', monospace" fontSize="8">06:00</text>
              <text x="110" y="188" textAnchor="middle" fill="var(--s-dim)" fontFamily="'Martian Mono', monospace" fontSize="8">12:00</text>
              <text x="10" y="98" textAnchor="middle" fill="var(--s-dim)" fontFamily="'Martian Mono', monospace" fontSize="8">18:00</text>
              {hourSpikes.map(({ h, cnt, isPeak, x1, y1, x2, y2 }) => (
                <line
                  key={h}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  className={isPeak ? 'story-clock-peak-spike' : cnt > 0 ? 'story-clock-spike' : undefined}
                  stroke={isPeak ? 'var(--s-hi)' : cnt > 0 ? 'var(--s-hi)' : 'var(--s-fg)'}
                  strokeWidth={isPeak ? 3.5 : cnt > 0 ? 2 : 1}
                  opacity={isPeak ? 1 : cnt > 0 ? 0.35 + 0.65 * (cnt / maxHour) : 0.15}
                  style={cnt > 0 ? { animationDelay: `${350 + h * 55}ms` } : undefined}
                />
              ))}
              <text x="110" y="91" textAnchor="middle" fill="var(--s-hi)" fontFamily="'Doto', monospace" fontWeight="900" fontSize="22" className="story-clock-center-text">
                {hourStr}
              </text>
              <text x="110" y="106" textAnchor="middle" fill="var(--s-dim)" fontFamily="'Martian Mono', monospace" fontWeight="800" fontSize="7.5" letterSpacing="0.08em">
                PEAK TIME
              </text>
            </svg>
          </div>

          <div className="story-chip rise" style={{ alignSelf: 'center', marginTop: '-0.5cqh', ...i(3) }}>
            [ {coderCategory} · Peak at {hourStr} ]
          </div>

          {/* 7-Day Weekday Equalizer */}
          <div className="story-week-grid" aria-label="Weekly contribution distribution">
            {facts.weekdayTotals.map((val, d) => {
              const isPeak = d === bestDay;
              const litCount = val > 0 ? Math.max(1, Math.min(6, Math.round((val / maxDay) * 6))) : 0;
              return (
                <div
                  key={d}
                  className={`story-week-col${isPeak ? ' on' : ''}`}
                  style={{ animationDelay: `${400 + d * 140}ms` }}
                >
                  <div className="story-week-meter" aria-hidden>
                    {[0, 1, 2, 3, 4, 5].map((cell) => (
                      <span
                        key={cell}
                        className={`story-week-cell${cell < litCount ? ' lit' : ''}`}
                        style={cell < litCount ? { animationDelay: `${600 + d * 110 + cell * 75}ms` } : undefined}
                      />
                    ))}
                  </div>
                  <span className="story-week-name">{DAYS[d].slice(0, 3)}</span>
                </div>
              );
            })}
          </div>

          <p className="story-note rise" style={{ ...i(11), marginTop: '0.4cqh', textWrap: 'balance' }}>
            {dayName}s had your highest volume · Weekdays: {Math.round((1 - facts.weekendShare) * 100)}% / Weekends: {Math.round(facts.weekendShare * 100)}%
          </p>
        </>
      ),
    });

    if (facts.streak && facts.streak.days >= 1) {
      const days = facts.streak.days;
      const litCaps = Math.min(10, Math.max(1, Math.round((days / 30) * 10)));
      const streakNote =
        days >= 30
          ? 'Over a month of daily commits without skipping a single day.'
          : days >= 14
            ? 'Two full weeks of continuous daily shipping.'
            : days >= 7
              ? 'Over a week of daily code pushed to GitHub.'
              : days > 1
                ? 'Consecutive days of uninterrupted commits.'
                : 'Peak single-day contribution run.';

      const milestones = [
        { label: '3d', name: 'Starter', reached: days >= 3 },
        { label: '7d', name: '1 Week', reached: days >= 7 },
        { label: '14d', name: '2 Weeks', reached: days >= 14 },
        { label: '30d+', name: '1 Month', reached: days >= 30 },
      ];

      slides.push({
        id: 'streak',
        tone: 'ground',
        body: (
          <>
            <div className="story-badge-header rise" style={i(0)}>
              // DAILY COMMIT CONSISTENCY
            </div>
            <h2 className="display story-h rise" style={{ ...i(1), margin: '0 0 0.6cqh' }}>
              Longest Streak
            </h2>

            {/* Hero Arcade Streak Card */}
            <div className="story-combo-card rise" style={i(2)}>
              <div className="story-combo-badge">DAILY MOMENTUM RECORD</div>
              <div className="story-combo-digits">
                <CountUp to={days} ms={1600} />
              </div>
              <span className="story-combo-sub">Consecutive Days Active</span>
              <div className="story-combo-range">
                {formatDay(facts.streak.from)} — {formatDay(facts.streak.to)}
              </div>
            </div>

            {/* Milestone Checkpoint Track */}
            <div className="story-milestone-track rise" style={i(3)}>
              <div className="story-milestone-header">
                <span>Streak Milestones</span>
                <span>{days >= 30 ? 'Elite Tier' : days >= 14 ? 'High Flow' : days >= 7 ? 'Pace Keeper' : 'Active Run'}</span>
              </div>
              <div className="story-milestones-row">
                {milestones.map((m) => (
                  <div key={m.label} className={`story-milestone-pod${m.reached ? ' reached' : ''}`}>
                    <div className="story-milestone-dot" />
                    <span className="story-milestone-tag">{m.label}</span>
                    <span className="story-milestone-name">{m.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Segmented Momentum LED Bar */}
            <div className="story-capacitors-wrap rise" style={i(4)}>
              <div className="story-capacitors-header">
                <span>Consistency Meter</span>
                <span>{Math.min(100, Math.round((days / 30) * 100))}% Capacity</span>
              </div>
              <div className="story-capacitors-bar" aria-hidden>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((idx) => (
                  <span
                    key={idx}
                    className={`story-cap-cell${idx < litCaps ? ' lit' : ''}`}
                    style={idx < litCaps ? { animationDelay: `${500 + idx * 160}ms` } : undefined}
                  />
                ))}
              </div>
            </div>

            <p className="story-note rise" style={{ ...i(5), marginTop: '0.4cqh' }}>
              {streakNote}
            </p>
          </>
        ),
      });
    }

    const langs = stats.topLanguages.slice(0, 4);
    if (langs.length > 0) {
      slides.push({
        id: 'languages',
        tone: 'ground',
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
                    <span className={`m${n}`} style={{ width: `${Math.max(lang.percent, 2)}%`, animationDelay: `${450 + n * 350}ms` }} />
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
        tone: 'ground',
        body: (
          <>
            <h2 className="display story-h rise">High scores</h2>
            <ol className="story-ranks">
              {repos.map((repo, n) => (
                <li key={`${repo.name}-${n}`} style={{ animationDelay: `${400 + n * 300}ms` }}>
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
    const topMoveName = stats.commitInsights?.moves[0]?.name?.toUpperCase() || 'COMMIT';
    const primaryWeapon = stats.topLanguages[0]?.name || 'Code';
    const peakCadence = `${stats.bestDayOfWeek ? stats.bestDayOfWeek.slice(0, 3) : 'Day'} @ ${formatHour(stats.bestHour)}`;

    slides.push({
      id: 'class',
      tone: 'ground',
      body: (
        <>
          <div className="story-badge-header rise" style={i(0)}>
            // PLAYER PROFILE · CLASS UNLOCKED
          </div>
          <h2 className="display story-h rise" style={{ ...i(1), margin: '0 0 0.4cqh' }}>
            Player Class
          </h2>
          <div className="story-scoreboard story-class-console rise" style={i(2)}>
            <div className="story-scoreboard-top">
              <span>{cls.badge}</span><span>{stats.year} Roster</span>
            </div>
            <div className="story-class-screen">
              <span className="story-class-screen-label">PLAYER / 01</span>
              <div className="story-class-sprite">
                <PlayerAvatar name={cls.name} size={168} animated />
              </div>
              <span className="story-class-screen-status">UNLOCKED</span>
            </div>
            <h3 className="display story-class-name">{cls.name}</h3>
            <p className="story-class-description">{cls.line}</p>
          </div>
          <div className="story-squad-grid story-class-loadout" aria-label="Player loadout">
            <div className="story-class-stat rise" style={i(4)}>
              <span className="story-squad-label">Signature move</span>
              <span className="story-class-stat-value">{topMoveName}</span>
            </div>
            <div className="story-class-stat rise" style={i(5)}>
              <span className="story-squad-label">Main language</span>
              <span className="story-class-stat-value">{primaryWeapon}</span>
            </div>
            <div className="story-class-stat rise" style={i(6)}>
              <span className="story-squad-label">Peak slot</span>
              <span className="story-class-stat-value">{peakCadence}</span>
            </div>
            <div className="story-class-stat rise" style={i(7)}>
              <span className="story-squad-label">Class signal</span>
              <span className="story-class-stat-value">{cls.short}</span>
            </div>
          </div>
          <p className="story-note rise" style={i(8)}>Your habits. Your class. Your season.</p>
        </>
      ),
    });

    slides.push({
      id: 'proof',
      tone: 'ground',
      body: (
        <>
          <div className="story-badge-header rise" style={i(0)}>
            // ALGORITHM VERIFICATION
          </div>
          <h2 className="display story-h rise" style={{ ...i(1), margin: '0 0 0.6cqh' }}>
            Class Telemetry
          </h2>

          {/* Qualifying Criteria Strip */}
          <div className="story-audit-bar" style={{ animationDelay: '220ms' }}>
            <div className="story-audit-bar-top">
              <span className="story-audit-dot" />
              <span className="story-audit-tag">CRITERIA AUDIT</span>
            </div>
            <div className="story-audit-formula">{cls.proof.formula}</div>
          </div>

          {/* 2x2 Telemetry Metric Matrix */}
          <div className="story-audit-grid">
            {cls.proof.metrics.map((m, n) => (
              <div key={m.label} className="story-audit-card" style={{ animationDelay: `${500 + n * 280}ms` }}>
                <span className="story-audit-card-label">{m.label}</span>
                <span className="story-audit-card-val">{m.value}</span>
                {m.hint && <span className="story-audit-card-hint">{m.hint}</span>}
              </div>
            ))}
          </div>

          {/* Audit Verification Footer */}
          <div className="story-audit-footer" style={{ animationDelay: '1300ms' }}>
            <span>DETERMINISTIC CLASSIFICATION</span>
            <span>{stats.totalContributions.toLocaleString()} CONTRIBUTIONS AUDITED</span>
          </div>
        </>
      ),
    });
  }

  slides.push({
    id: 'card',
    tone: 'ground',
    body: (
      <>
        <div className="story-badge-header rise">// SEASON COMPLETE · REWARD UNLOCKED</div>
        <h2 className="display story-h story-h-sm rise" style={i(1)}>Your year. Minted.</h2>
        <div className="story-reward">
          <div className="story-reward-slot" aria-hidden="true">
            <span>GITWRAP / {stats.year}</span>
            <span className="story-reward-led" />
          </div>
          <div className="story-reward-feed">
            <GitWrapCard className="story-print" userData={stats} funMessage={funMessage} theme={theme} />
          </div>
          <div className="story-reward-confetti" aria-hidden="true">
            {Array.from({ length: 12 }, (_, n) => (
              <span key={n} style={{ '--x': `${Math.cos(n * Math.PI / 6) * 115}%`, '--y': `${Math.sin(n * Math.PI / 6) * 110}%`, '--turn': `${n % 2 ? 150 : -120}deg`, animationDelay: `${1250 + (n % 3) * 60}ms` } as React.CSSProperties} />
            ))}
          </div>
          <span className="story-reward-stamp" aria-hidden="true">YEAR CLEARED ✓</span>
        </div>
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

  // Lock document scroll while recap modal is active to prevent inert mobile scrollbars
  useEffect(() => {
    const prevHtml = document.documentElement.style.overflow;
    const prevBody = document.body.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
    };
  }, []);

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
