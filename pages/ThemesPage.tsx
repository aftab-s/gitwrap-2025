import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Marquee from '../components/Marquee';
import Footer from '../components/Footer';
import HomeFusionBackdrop from '../components/HomeFusionBackdrop';
import GitWrapCard from '../components/GitWrapCard';
import { THEMES, HOME_FUSION_THEME, CHROME_ACCENTS, themeVars } from '../constants';
import { demoStats, DEMO_MESSAGE } from '../demo';
import { THEME_GUIDE, TOTAL_EGGS, LEGACY_2025, type ThemeGuideEntry, type EggSpot } from '../themeGuide';
import type { Theme } from '../types';
import './ThemesPage.css';

const sample = demoStats(2026);
const themeById = (id: string) => THEMES.find((t) => t.id === id)!;
const pad = (n: number) => String(n).padStart(2, '0');
const YEAR_START = Date.UTC(2026, 0, 1);
const YEAR_MS = Date.UTC(2027, 0, 1) - YEAR_START;
/** Position of a 2026 date along the timeline, in percent. */
const yearPct = (iso: string) => ((Date.parse(`${iso}T00:00:00Z`) - YEAR_START) / YEAR_MS) * 100;
const isUpcoming = (e: ThemeGuideEntry) => Date.now() < Date.parse(`${e.start}T00:00:00Z`);
const MONTHS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];

/* ---------------- Found eggs: a per-visitor convenience, safe without storage ---------------- */

const STORE_KEY = 'gitwrap:theme-guide:eggs';
const VALID_EGG_IDS = new Set(THEME_GUIDE.flatMap(entry =>
  entry.eggs.map(egg => entry.id + ':' + egg.spot)
));

function useFoundEggs() {
  const [found, setFound] = useState<Set<string>>(() => {
    try {
      const raw = window.localStorage.getItem(STORE_KEY);
      const saved: unknown = raw ? JSON.parse(raw) : [];
      return new Set(Array.isArray(saved)
        ? saved.filter((id): id is string => typeof id === 'string' && VALID_EGG_IDS.has(id))
        : []);
    } catch {
      return new Set<string>();
    }
  });

  useEffect(() => {
    try {
      if (found.size) window.localStorage.setItem(STORE_KEY, JSON.stringify([...found]));
      else window.localStorage.removeItem(STORE_KEY);
    } catch { /* storage unavailable */ }
  }, [found]);

  const mark = useCallback((id: string) => {
    if (!VALID_EGG_IDS.has(id)) return;
    setFound(prev => prev.has(id) ? prev : new Set(prev).add(id));
  }, []);
  const reset = useCallback(() => setFound(new Set<string>()), []);
  return { found, mark, reset };
}

/* ---------------- A sample card that can spotlight its own hidden details ---------------- */

type Box = { left: number; top: number; width: number; height: number };

interface SpotlightCardProps {
  theme: Theme;
  spots: EggSpot[];
  active: EggSpot | null;
  isFound: (spot: EggSpot) => boolean;
  onPick: (spot: EggSpot) => void;
}

function SpotlightCard({ theme, spots, active, isFound, onPick }: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [boxes, setBoxes] = useState<Partial<Record<EggSpot, Box>>>({});
  const spotKey = spots.join('|');

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    let frame = 0;
    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const base = root.getBoundingClientRect();
        if (!base.width) return;
        const next: Partial<Record<EggSpot, Box>> = {};
        for (const spot of spotKey.split('|') as EggSpot[]) {
          const el = root.querySelector(`[data-egg="${spot}"]`);
          if (!el) continue;
          const r = el.getBoundingClientRect();
          const padPx = 4;
          next[spot] = {
            left: ((r.left - base.left - padPx) / base.width) * 100,
            top: ((r.top - base.top - padPx) / base.height) * 100,
            width: ((r.width + padPx * 2) / base.width) * 100,
            height: ((r.height + padPx * 2) / base.height) * 100,
          };
        }
        setBoxes(next);
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    document.fonts?.ready.then(measure).catch(() => undefined);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, [spotKey, theme.id]);

  return (
    <div ref={ref} className="guide-spotlight">
      <GitWrapCard userData={sample} funMessage={DEMO_MESSAGE} theme={theme} />
      {active && boxes[active] && (
        <div key={active} className="guide-spot" style={toStyle(boxes[active]!)} aria-hidden="true" />
      )}
      {spots.map((spot, n) => {
        const b = boxes[spot];
        if (!b) return null;
        // Sit beside the detail, never on it: to its right, or to its left near the card's right edge.
        const flip = b.left + b.width > 80;
        const top = Math.min(Math.max(b.top + b.height / 2, 3), 97);
        return (
          <button
            key={spot}
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            className={`guide-pin${flip ? ' is-flipped' : ''}${isFound(spot) ? ' is-found' : ''}${active === spot ? ' is-active' : ''}`}
            style={{ left: `${flip ? b.left : b.left + b.width}%`, top: `${top}%` }}
            onClick={() => onPick(spot)}
          >
            {isFound(spot) ? '✓' : n + 1}
          </button>
        );
      })}
    </div>
  );
}

const toStyle = (b: Box): React.CSSProperties => ({ left: `${b.left}%`, top: `${b.top}%`, width: `${b.width}%`, height: `${b.height}%` });

/* ---------------- One theme, one moment ---------------- */

interface ExhibitProps {
  entry: ThemeGuideEntry;
  n: number;
  found: Set<string>;
  onFind: (id: string) => void;
}

function Exhibit({ entry, n, found, onFind }: ExhibitProps) {
  const theme = themeById(entry.id);
  const [selected, setSelected] = useState<EggSpot | null>(null);
  const eggId = (spot: EggSpot) => `${entry.id}:${spot}`;
  // Resetting discovery progress also hides the current answer and card spotlight.
  const active = selected && found.has(eggId(selected)) ? selected : null;
  const pick = (spot: EggSpot) => {
    setSelected(active === spot ? null : spot);
    onFind(eggId(spot));
  };
  const foundHere = entry.eggs.filter((e) => found.has(eggId(e.spot))).length;
  const upcoming = isUpcoming(entry);

  return (
    <section
      id={entry.id}
      className="guide-exhibit"
      aria-labelledby={`${entry.id}-title`}
      style={{ '--guide-accent': theme.c.a1, '--guide-accent-2': theme.c.a2, '--guide-ground': theme.c.ground } as React.CSSProperties}
    >
      <div className="guide-exhibit-head">
        <span className="guide-exhibit-num">{pad(n + 1)}</span>
        <span className="guide-exhibit-when">{entry.when}{upcoming && <b className="guide-soon">Coming soon</b>}</span>
        <span className="guide-exhibit-event">{entry.event}</span>
      </div>

      <div className="guide-card-column">
        <SpotlightCard
          theme={theme}
          spots={entry.eggs.map((e) => e.spot)}
          active={active}
          isFound={(spot) => found.has(eggId(spot))}
          onPick={pick}
        />
        <div className="guide-palette" aria-label={`${theme.name} colour palette`}>
          {(['ground', 'panel', 'a1', 'a2'] as const).map((role) => (
            <span key={role}>
              <i style={{ background: theme.c[role] }} aria-hidden="true" />
              <small>{role === 'a1' ? 'ink 1' : role === 'a2' ? 'ink 2' : role}</small>
              <code>{theme.c[role]}</code>
            </span>
          ))}
        </div>
      </div>

      <div className="guide-copy">
        <div className="guide-overline">{entry.kicker}</div>
        <h2 id={`${entry.id}-title`}>{theme.name}</h2>
        <p className="guide-title">{entry.title}</p>

        <div className="guide-block">
          <span className="guide-label">What happened</span>
          <p>{entry.happened}</p>
          <dl className="guide-stats">
            {entry.stats.map(([value, label]) => (
              <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
            ))}
          </dl>
        </div>

        <div className="guide-block">
          <span className="guide-label">How it shows up on your card</span>
          <p>{entry.onCard}</p>
        </div>

        <div className="guide-hunt">
          <div className="guide-hunt-head">
            <span>Easter egg hunt</span>
            <span className="guide-hunt-score" aria-live="polite">{foundHere}/{entry.eggs.length} found</span>
          </div>
          <ol>
            {entry.eggs.map((egg, i) => {
              const isFound = found.has(eggId(egg.spot));
              const isActive = active === egg.spot;
              return (
                <li key={egg.spot} className={`${isFound ? 'is-found' : ''}${isActive ? ' is-active' : ''}`}>
                  <button type="button" aria-expanded={isActive} onClick={() => pick(egg.spot)}>
                    <span className="guide-egg-num" aria-hidden="true">{isFound ? '✓' : i + 1}</span>
                    <span className="guide-egg-where">{egg.where}</span>
                    <strong>{isFound ? egg.label : 'Find it on the card'}</strong>
                  </button>
                  {isActive && <p>{egg.text}</p>}
                </li>
              );
            })}
          </ol>
        </div>

        <div className="guide-sources">
          <span>Sources</span>
          {entry.sources.map(([label, href]) => (
            <a key={href} href={href} target="_blank" rel="noopener noreferrer">{label} ↗</a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Page ---------------- */

export default function ThemesPage() {
  const { found, mark, reset } = useFoundEggs();
  const [tryOn, setTryOn] = useState(0);
  const tryOnTheme = themeById(THEME_GUIDE[tryOn].id);
  const keysRef = useRef<Array<HTMLButtonElement | null>>([]);
  const now = new Date();
  const todayPct = now.getUTCFullYear() === 2026 ? yearPct(now.toISOString().slice(0, 10)) : null;
  const complete = found.size >= TOTAL_EGGS;

  useEffect(() => {
    const previous = document.title;
    document.title = 'The 2026 Themes · GitWrap';
    window.scrollTo(0, 0);
    return () => { document.title = previous; };
  }, []);

  const onKeysKeyDown = (e: React.KeyboardEvent) => {
    const step = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = (tryOn + step + THEME_GUIDE.length) % THEME_GUIDE.length;
    setTryOn(next);
    keysRef.current[next]?.focus();
  };

  return (
    <div className="gw circuit-shell theme-guide" style={{ ...themeVars(HOME_FUSION_THEME), ...CHROME_ACCENTS } as React.CSSProperties}>
      <HomeFusionBackdrop />
      <Marquee year={2026} />

      <main id="guide-top" className="guide-main">
        {/* ---------- Hero: try the six themes on one card ---------- */}
        <header className="guide-hero" style={{ '--guide-accent': tryOnTheme.c.a1 } as React.CSSProperties}>
          <div className="guide-hero-top"><span>GITWRAP // THEME SELECT</span><span>2026 EDITION</span></div>
          <div className="guide-hero-copy">
            <div className="guide-overline">The 2026 collection</div>
            <h1>Six themes.<br /><span>Six moments</span><br />from 2026.</h1>
            <p>Every 2026 theme starts from something that happened this year: a crewed flight around the Moon, a 48-team World Cup, a computer turning 80, a print studio turning 80, a long-awaited game and an Avengers premiere. Pick one, read its story, then go looking for the easter eggs hidden on the card.</p>
            <div className="guide-tryon-label" id="tryon-label">Try them on · same player, six moods</div>
            <div className="guide-tryon-keys" role="radiogroup" aria-labelledby="tryon-label" onKeyDown={onKeysKeyDown}>
              {THEME_GUIDE.map((entry, i) => {
                const t = themeById(entry.id);
                const on = i === tryOn;
                return (
                  <button
                    key={entry.id}
                    ref={(el) => { keysRef.current[i] = el; }}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    tabIndex={on ? 0 : -1}
                    className="guide-tryon-key"
                    style={{ '--k-ground': t.c.ground, '--k-a1': t.c.a1, '--k-a2': t.c.a2 } as React.CSSProperties}
                    onClick={() => setTryOn(i)}
                  >
                    <span className="guide-tryon-chip" aria-hidden="true"><i /><i /></span>
                    <span>{t.name}</span>
                  </button>
                );
              })}
            </div>
            <a className="guide-tryon-jump" href={`#${tryOnTheme.id}`}>Read the {tryOnTheme.name} story ↓</a>
          </div>
          <div className="guide-hero-card">
            <div className="guide-card-caption"><span>{pad(tryOn + 1)} / {tryOnTheme.name}</span><span>{THEME_GUIDE[tryOn].when}</span></div>
            <div key={tryOnTheme.id} className="guide-hero-card-swap">
              <GitWrapCard userData={sample} funMessage={DEMO_MESSAGE} theme={tryOnTheme} />
            </div>
          </div>
        </header>

        {/* ---------- 2026 timeline ---------- */}
        <section className="guide-timeline" aria-labelledby="timeline-title">
          <div className="guide-section-head">
            <h2 id="timeline-title">The year, in six themes</h2>
            <span className="silk">Jan → Dec 2026</span>
          </div>
          <div className="guide-rail">
            <div className="guide-rail-months" aria-hidden="true">{MONTHS.map((m, i) => <span key={i}>{m}</span>)}</div>
            <div className="guide-rail-track" aria-hidden="true">
              {todayPct !== null && <span className="guide-rail-today" style={{ left: `${todayPct}%` }}><b>Today</b></span>}
              {THEME_GUIDE.map((entry) => {
                const t = themeById(entry.id);
                const left = yearPct(entry.start);
                const width = entry.end ? Math.max(yearPct(entry.end) - left, 1) : 0;
                return <span key={entry.id} className={`guide-rail-mark${width ? ' is-range' : ''}${isUpcoming(entry) ? ' is-upcoming' : ''}`} style={{ left: `${left}%`, width: width ? `${width}%` : undefined, '--m': t.c.a1 } as React.CSSProperties} />;
              })}
            </div>
            <ol className="guide-rail-list">
              {THEME_GUIDE.map((entry, i) => {
                const t = themeById(entry.id);
                return (
                  <li key={entry.id} style={{ '--m': t.c.a1, '--m-ground': t.c.ground } as React.CSSProperties}>
                    <a href={`#${entry.id}`}>
                      <span className="guide-rail-num">{pad(i + 1)}</span>
                      <span className="guide-rail-when">{entry.when}{isUpcoming(entry) && ' · soon'}</span>
                      <strong>{entry.event}</strong>
                      <span className="guide-rail-theme">{t.name} →</span>
                    </a>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        {/* ---------- 2025 → 2026 ---------- */}
        <section className="guide-upgrade" aria-labelledby="upgrade-title">
          <div className="guide-section-head">
            <h2 id="upgrade-title">2025 → 2026: from moods to moments</h2>
            <span className="silk">What changed</span>
          </div>
          <div className="guide-upgrade-grid">
            <div className="guide-edition is-legacy">
              <span className="guide-edition-tag">2025 edition</span>
              <ul className="guide-edition-chips">
                {LEGACY_2025.map((t) => <li key={t.name}><i style={{ background: t.bg, borderColor: t.ink }} aria-hidden="true" />{t.name}</li>)}
              </ul>
              <p>The first GitWrap gave your year six general moods, from Space to Minimal, built from soft gradients over photo backdrops.</p>
            </div>
            <div className="guide-upgrade-arrow" aria-hidden="true">→</div>
            <div className="guide-edition is-current">
              <span className="guide-edition-tag">2026 edition</span>
              <ul className="guide-edition-chips">
                {THEME_GUIDE.map((e) => { const t = themeById(e.id); return <li key={t.id}><i style={{ background: t.c.ground, borderColor: t.c.a1, boxShadow: `inset -8px 0 0 ${t.c.a2}` }} aria-hidden="true" />{t.name}</li>; })}
              </ul>
              <p>2026 builds on that recap with a redesigned arcade card. Each theme is tied to a real moment from the year, printed in its own three-ink palette, and comes with hand-built artwork and hidden details.</p>
            </div>
          </div>
          <dl className="guide-diff">
            <div><dt>Inspiration</dt><dd><s>General moods</s> Real 2026 moments</dd></div>
            <div><dt>Artwork</dt><dd><s>Photo backdrops</s> Hand-built SVG scenes</dd></div>
            <div><dt>Colour</dt><dd><s>Gradients</s> Three-ink print palettes</dd></div>
            <div><dt>Hidden details</dt><dd>{TOTAL_EGGS} easter eggs to find</dd></div>
          </dl>
        </section>

        {/* ---------- Exhibits ---------- */}
        <div className="guide-intro">
          <span>Look closer.</span>
          <p>Every card below uses the same fictional sample player. Tap a numbered marker or a clue to spotlight a hidden detail and find out what it means.</p>
        </div>

        {THEME_GUIDE.map((entry, n) => <Exhibit key={entry.id} entry={entry} n={n} found={found} onFind={mark} />)}

        {/* ---------- Finale ---------- */}
        <section className="guide-finale">
          {complete
            ? <div className="guide-overline">High score · all {TOTAL_EGGS} easter eggs found</div>
            : <div className="guide-overline">Your turn · 2026 edition</div>}
          <h2>Pick your moment.<br />Print your year.</h2>
          <p>Every theme tells your year differently. Enter a GitHub username and you can switch between all six before you download.</p>
          <Link className="key key-lg" to="/">Make my GitWrap →</Link>
          <a className="guide-top-link" href="#guide-top">Back to the top ↑</a>
        </section>

        <p className="guide-editorial">
          Facts checked November 25, 2026 against the sources linked in each section. Volt Matrix and Tokyo Riso began as maximalist design studies and take their 2026 connection from the ENIAC and RISO anniversaries. Numbers printed as card decoration, such as delta-v readouts and ISBNs, are fictional. GitWrap’s themes are independent tributes, not official collaborations with or endorsements by NASA, FIFA, adidas, Rockstar Games, Take-Two, Marvel, Disney, the University of Pennsylvania or RISO.
        </p>
      </main>

      {/* ---------- Egg counter ---------- */}
      <aside className={`guide-hud${complete ? ' is-complete' : ''}`} aria-label="Easter eggs found">
        <span className="guide-hud-label">{complete ? 'High score!' : 'Eggs found'}</span>
        <span className="guide-hud-count">{pad(found.size)}<small>/{TOTAL_EGGS}</small></span>
        <span className="guide-hud-leds" aria-hidden="true">
          {Array.from({ length: TOTAL_EGGS }, (_, i) => <i key={i} className={i < found.size ? 'on' : ''} />)}
        </span>
        {found.size > 0 && <button type="button" className="guide-hud-reset" onClick={reset}>Reset</button>}
      </aside>

      <Footer />
    </div>
  );
}
