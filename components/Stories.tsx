import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { UserStats, Theme } from '../types';
import { calendarFacts, formatDay, playerClass } from '../insights';
import { toWeeks, LED_STEPS } from './ArcadeCard';
import GitWrapCard from './GitWrapCard';
import { ArrowLeft, ArrowRight, Pause, PlayerArrow } from './icons/Arcade';

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
    seconds: 4.5,
    body: (
      <>
        {stats.avatarUrl && <img className="story-avatar rise" src={stats.avatarUrl} alt="" />}
        <h2 className="display story-title rise" style={i(1)}>
          {name}, this was your <span className="story-mark">{stats.year}</span>
        </h2>
        <p className="story-text rise" style={i(3)}>
          A short recap, then your card.
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
    const total = stats.totalContributions.toLocaleString();
    const growth = stats.yearOverYearGrowth?.overallGrowth;
    const rows: Array<[string, number]> = [
      ['Commits', stats.totalCommits],
      ['Pull requests', stats.totalPRs],
      ['Issues', stats.totalIssues],
      ['Reviews', stats.totalPRReviews],
    ];
    slides.push({
      id: 'score',
      tone: 'panel',
      body: (
        <>
          <p className="story-lead rise">You put up</p>
          <div className="story-big rise" style={{ ...fit(total), ...i(1) }}>
            <CountUp to={stats.totalContributions} />
          </div>
          <p className="story-lead rise" style={i(2)}>
            contributions in {stats.year}.
          </p>
          <div className="story-table">
            {rows.map(([label, value], n) => (
              <div key={label} className="score-row rise" style={i(4 + n)}>
                <span className="story-row-label">{label}</span>
                <span className="score-value">{value.toLocaleString()}</span>
              </div>
            ))}
          </div>
          {growth !== undefined && (
            <p className="story-chip rise" style={i(9)}>
              {growth >= 0 ? '+' : ''}
              {growth}% on {stats.year - 1}
            </p>
          )}
        </>
      ),
    });

    // Two rows of half a year each, so every lamp is big enough to read on a phone.
    const weeks = toWeeks(stats.contributionCalendar);
    const perRow = Math.max(Math.ceil(weeks.length / 2), 1);
    const halves = [weeks.slice(0, perRow), weeks.slice(perRow)];
    slides.push({
      id: 'calendar',
      tone: 'dark',
      seconds: 7.5,
      body: (
        <>
          <p className="story-lead rise">You showed up on</p>
          <div className="story-big rise" style={{ ...fit(String(facts.activeDays)), ...i(1) }}>
            <CountUp to={facts.activeDays} />
          </div>
          <p className="story-lead rise" style={i(2)}>
            of {facts.days} days.
          </p>
          <div className="story-leds" aria-hidden>
            {halves.map((half, h) => (
              <div key={h} style={{ gridTemplateColumns: `repeat(${perRow}, 1fr)` }}>
                {half.map((week, w) => (
                  <div key={w} className="story-led-col" style={{ '--c': h * perRow + w } as React.CSSProperties}>
                    {week.map((level, d) => (
                      <span key={d} style={{ background: level <= 0 ? '#f6f4ec' : 'var(--s-hi)', opacity: level < 0 ? 0 : LED_STEPS[level] }} />
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
          {facts.peak && (
            <p className="story-note rise" style={i(12)}>
              Busiest day: {formatDay(facts.peak.date)}, with {facts.peak.count.toLocaleString()} contributions
            </p>
          )}
        </>
      ),
    });

    const bestDay = DAYS.indexOf(stats.bestDayOfWeek);
    if (bestDay >= 0) {
      const maxDay = Math.max(...facts.weekdayTotals, 1);
      const maxHour = insights ? Math.max(...insights.hours, 1) : 1;
      const hour = `${String(stats.bestHour).padStart(2, '0')}:00`;
      slides.push({
        id: 'rhythm',
        tone: 'a1',
        body: (
          <>
            <p className="story-lead rise">{insights ? 'Your hour was' : 'Your day was'}</p>
            <div className="story-big rise" style={{ ...fit(insights ? hour : DAYS[bestDay].slice(0, 3)), ...i(1) }}>
              {insights ? hour : DAYS[bestDay].slice(0, 3)}
            </div>
            {insights && (
              <div className="story-hours rise" style={i(3)} aria-hidden>
                {insights.hours.map((count, h) => (
                  <span key={h} className={h === stats.bestHour ? 'on' : undefined} style={{ '--v': 0.12 + 0.88 * (count / maxHour) } as React.CSSProperties} />
                ))}
                <em>00</em>
                <em>06</em>
                <em>12</em>
                <em>18</em>
              </div>
            )}
            <p className="story-lead rise" style={i(5)}>
              {insights ? `and ${DAYS[bestDay]}s were your day.` : `${DAYS[bestDay]}s carried the year.`}
            </p>
            <div className="story-bars" aria-hidden>
              {facts.weekdayTotals.map((value, d) => (
                <div key={d} className={d === bestDay ? 'on' : undefined}>
                  <span style={{ height: `${Math.max(4, (value / maxDay) * 100)}%`, ...i(d) }} />
                  <em>{DAYS[d][0]}</em>
                </div>
              ))}
            </div>
          </>
        ),
      });
    }

    if (facts.streak && facts.streak.days >= 3) {
      const days = facts.streak.days;
      slides.push({
        id: 'streak',
        tone: 'ground',
        body: (
          <>
            <p className="story-lead rise">You held a combo for</p>
            <div className="story-big rise" style={{ ...fit(String(days)), ...i(1) }}>
              <CountUp to={days} ms={900} />
            </div>
            <p className="story-lead rise" style={i(2)}>
              days in a row.
            </p>
            <div className="story-combo" aria-hidden>
              {Array.from({ length: Math.min(days, 60) }, (_, n) => (
                <span key={n} style={i(n)} />
              ))}
            </div>
            <p className="story-note rise" style={i(10)}>
              {formatDay(facts.streak.from)} to {formatDay(facts.streak.to)}, without a miss
            </p>
          </>
        ),
      });
    }

    const langs = stats.topLanguages.slice(0, 3);
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

    const move = insights?.moves[0];
    if (insights && move && move.commits >= 5) {
      slides.push({
        id: 'move',
        tone: 'a2',
        body: (
          <>
            <p className="story-lead rise">Your commits open with</p>
            <div className="story-big rise" style={{ ...fit(move.name), ...i(1) }}>
              {move.name}
            </div>
            <p className="story-lead rise" style={i(2)}>
              {move.commits.toLocaleString()} times this year. Call it your signature move.
            </p>
            {insights.moves.length > 1 && (
              <div className="story-table">
                {insights.moves.slice(1).map((m, n) => (
                  <div key={m.name} className="score-row rise" style={i(4 + n)}>
                    <span className="story-row-label">{m.name}</span>
                    <span className="score-value">{m.commits.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}
          </>
        ),
      });
    }

    const cls = playerClass(stats);
    slides.push({
      id: 'class',
      tone: move ? 'a1' : 'a2',
      seconds: 7.5,
      body: (
        <>
          <p className="story-lead rise">That makes you {/^[aeiou]/i.test(cls.name) ? 'an' : 'a'}</p>
          <h2 className="display story-stamp" style={fit(cls.name.split(' ').sort((a, b) => b.length - a.length)[0] + 'xx')}>
            {cls.name}
          </h2>
          <p className="story-text rise" style={i(8)}>
            {cls.line}
          </p>
        </>
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
    <section className={`stories${paused ? ' is-paused' : ''}`} aria-roledescription="carousel" aria-label={`${stats.login}'s ${stats.year} recap`}>
      <div className="stories-side stories-side-prev">
        <button type="button" className="key key-plain" onClick={() => go(-1)} disabled={current === 0} aria-label="Previous story">
          <ArrowLeft size={20} />
        </button>
      </div>

      <div className={`stories-frame tone-${slide.tone}`}>
        <div className="stories-top">
          <div className="stories-segs" aria-hidden>
            {slides.map((s, n) => (
              <span key={s.id} className={`stories-seg${n < current || (n === current && n === last) ? ' done' : n === current ? ' on' : ''}`}>
                <i
                  key={n === current ? `run-${current}` : 'idle'}
                  style={{ animationDuration: `${s.seconds ?? 6}s` }}
                  onAnimationEnd={n === current ? () => go(1) : undefined}
                />
              </span>
            ))}
          </div>
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
