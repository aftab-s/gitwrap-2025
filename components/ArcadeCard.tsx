import React, { forwardRef, useMemo } from 'react';
import type { UserStats, Theme } from '../types';
import { Lock, PlayerArrow } from './icons/Arcade';
import { playerClass } from '../insights';
import { playerAvatar } from '../playerAvatars';
import ThemeBackdrop from './ThemeBackdrop';
import { CARD_W, CARD_H, LED_STEPS, toWeeks } from '../constants';

/**
 * The wrap card, drawn as an arcade machine's printed control panel.
 *
 * It is always laid out at CARD_W × CARD_H (the exported PNG's size) with inline styles only, so
 * the export iframe and the on-screen preview render the same pixels. On screen it is scaled to
 * fit by <GitWrapCard>; nothing here is responsive on purpose.
 */
const DISPLAY = "'Archivo', 'Arial Narrow', sans-serif";
const MONO = "'Martian Mono', ui-monospace, 'Cascadia Mono', monospace";
const DOT = "'Doto', 'Martian Mono', monospace";

const KEYLINE = 4;
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

interface Props {
  userData: UserStats;
  funMessage: string;
  theme: Theme;
  playerAvatarUrl?: string;
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

function formatHour(h: number): string {
  return `${String(h).padStart(2, '0')}:00`;
}

function getHazardStyle(themeId: string, c: Theme['c']): React.CSSProperties {
  switch (themeId) {
    case 'fifa':
      return {
        height: 16,
        flexShrink: 0,
        backgroundImage: `repeating-linear-gradient(-45deg, #16468F 0 14px, #F7D154 14px 28px)`,
        border: `3px solid #16468F`,
        boxShadow: `0 0 12px rgba(247, 209, 84, 0.35)`,
      };
    case 'artemis':
      return {
        height: 16,
        flexShrink: 0,
        backgroundImage: `repeating-linear-gradient(-45deg, #040A17 0 14px, #E59A1A 14px 28px)`,
        border: `3px solid ${c.line}`,
        boxShadow: `0 0 14px rgba(229, 154, 26, 0.35)`,
      };
    case 'gtavi':
      return {
        height: 18,
        flexShrink: 0,
        backgroundImage: `linear-gradient(90deg, #F3937B 0%, #A480D4 50%, #5E8DA8 100%)`,
        border: `3px solid ${c.line}`,
        boxShadow: `0 0 18px rgba(243, 147, 123, 0.35)`,
      };
    case 'doomsday':
      return {
        height: 16,
        flexShrink: 0,
        backgroundImage: `repeating-linear-gradient(-45deg, #121512 0 14px, #28D443 14px 28px)`,
        border: `3px solid ${c.line}`,
        boxShadow: `0 0 14px rgba(40, 212, 67, 0.35)`,
      };
    case 'maxdark':
      return {
        height: 18,
        flexShrink: 0,
        backgroundImage: `repeating-linear-gradient(-45deg, #000000 0 16px, #D4FF00 16px 32px)`,
        border: `3px solid ${c.line}`,
        boxShadow: `0 0 16px rgba(212, 255, 0, 0.35)`,
      };
    case 'maxlight':
      return {
        height: 16,
        flexShrink: 0,
        backgroundImage: `linear-gradient(90deg, #FF3366 0 25%, #FFD600 25% 50%, #00D2FF 50% 75%, #0B1B61 75% 100%)`,
        border: `3px solid ${c.line}`,
      };
    default:
      return {
        height: 14,
        flexShrink: 0,
        backgroundImage: `repeating-linear-gradient(-45deg, ${c.line} 0 14px, ${c.a1} 14px 28px)`,
        border: `3px solid ${c.line}`,
      };
  }
}

function getFooterInks(themeId: string, c: Theme['c']): string[] {
  switch (themeId) {
    case 'fifa':
      return ['#F7D154', '#C42B30', '#16468F', '#EAECEF', '#60B552', '#8A5A10', '#176840', '#F7D154', '#EAECEF'];
    case 'artemis':
      return ['#7CD6FF', '#E59A1A', '#5078A8', '#D8E7F6', '#162C4E', '#7A460A', '#7CD6FF', c.line, '#E59A1A'];
    case 'gtavi':
      return ['#F3937B', '#A480D4', '#5E8DA8', '#8EA2E5', '#A5769B', '#FDE0C8', '#6B3B5E', c.line, '#F3937B'];
    case 'doomsday':
      return ['#28D443', '#D42329', '#8D9694', '#D5E3A3', '#506340', '#243326', '#28D443', c.line, '#28D443'];
    case 'maxdark':
      return ['#D4FF00', '#FF5500', '#000000', c.panel, '#D4FF00', '#FF5500', '#000000', c.panel, '#D4FF00'];
    case 'maxlight':
      return ['#FF3366', '#FFD600', '#00D2FF', '#0B1B61', '#FF3366', '#FFD600', '#00D2FF', '#0B1B61', '#FF3366'];
    default:
      return [c.a1, c.line, c.a2, c.panel, c.a1, c.a2, c.line, c.panel, c.a1];
  }
}

function getFooterBadge(themeId: string): string {
  switch (themeId) {
    case 'fifa':
      return "GITWRAP 2026";
    case 'artemis':
      return "GITWRAP 2026";
    case 'gtavi':
      return "GITWRAP 2026";
    case 'doomsday':
      return "GITWRAP 2026";
    case 'maxdark':
      return "GITWRAP 2026";
    case 'maxlight':
      return "GITWRAP 2026";
    default:
      return 'GITWRAP 2026';
  }
}

function getFooterEasterEgg(themeId: string): string {
  switch (themeId) {
    case 'fifa':
      return "VAR: COMMITS VERIFIED · 90'+5";
    case 'artemis':
      return 'KSC LC-39B · Δv 10.9 KM/S';
    case 'gtavi':
      return '★ WANTED LEVEL 5 · 98.6 FM';
    case 'doomsday':
      return 'ᛝ BY ROYAL DECREE · VON DOOM ᛝ';
    case 'maxdark':
      return 'HEX: 0x7EA · NO SEGFAULTS';
    case 'maxlight':
      return '検印 · TOKYO RISO NO. 0026';
    default:
      return 'GITWRAP TELEMETRY';
  }
}

function getLangInks(themeId: string, c: Theme['c']): string[] {
  switch (themeId) {
    case 'fifa':
      return ['#F7D154', '#60B552', '#C42B30', '#16468F'];
    case 'artemis':
      return ['#7CD6FF', '#E59A1A', '#5078A8', '#D8E7F6'];
    case 'gtavi':
      return ['#F3937B', '#5E8DA8', '#8EA2E5', '#A480D4'];
    case 'doomsday':
      return ['#28D443', '#D5E3A3', '#8D9694', '#506340'];
    case 'maxdark':
      return [c.a1, c.a2, '#8A8E9A', c.panel];
    case 'maxlight':
      return [c.a1, c.a2, '#FFD600', c.panel];
    default:
      return [c.a1, c.a2, c.onGroundDim, c.panel];
  }
}

const ArcadeCard = forwardRef<HTMLDivElement, Props>(({ userData, funMessage, theme, playerAvatarUrl }, ref) => {
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
  const langs = d.topLanguages.slice(0, 4);
  const langInks = getLangInks(theme.id, c);
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

  const windowShadow =
    theme.id === 'gtavi'
      ? '0 6px 24px -4px rgba(255, 42, 133, 0.22)'
      : theme.id === 'doomsday'
        ? '0 6px 20px -4px rgba(40, 212, 67, 0.22), 0 2px 0 0 #0A0D0A'
        : theme.id === 'maxdark'
          ? '5px 5px 0 0 #000000'
          : theme.id === 'maxlight'
            ? '5px 5px 0 0 #0B1B61'
            : theme.id === 'fifa'
              ? '0 6px 20px -4px rgba(247, 209, 84, 0.35), 0 2px 0 0 #16468F'
              : '0 6px 20px -4px rgba(124, 214, 255, 0.22), 0 2px 0 0 #020610';

  const window_: React.CSSProperties = {
    background: c.panel,
    border: `${KEYLINE}px solid ${c.line}`,
    color: c.ink,
    boxShadow: windowShadow,
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
        padding: '36px 44px 34px',
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
        fontFamily: DISPLAY,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* ---------- Bespoke Theme Backdrop for Volt Matrix & Tokyo Riso ---------- */}
      <ThemeBackdrop themeId={theme.id} c={c} />

      {/* ---------- Theme Identity Tag ---------- */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 1, minHeight: 20 }}>
        <span data-egg="tag-left" style={{ ...label(c.onGroundDim, 15), letterSpacing: '0.12em', fontWeight: 800 }}>
          {theme.id === 'fifa' && "Trionda"}
          {theme.id === 'artemis' && 'Integrity'}
          {theme.id === 'gtavi' && 'Emotion 98.3'}
          {theme.id === 'doomsday' && 'Earth-616'}
          {theme.id === 'maxdark' && 'DEV TELEMETRY'}
          {theme.id === 'maxlight' && 'ARCHIVAL PRESS ISSUE NO. 01'}
        </span>
        <span data-egg="tag-right" style={{ ...label(c.onGroundDim, 14), opacity: 0.85, letterSpacing: '0.08em' }}>
          {theme.id === 'fifa' && 'MATCH GRADE'}
          {theme.id === 'artemis' && 'ORBIT: LUNAR'}
          {theme.id === 'gtavi' && 'LEONIDA DEPT.'}
          {theme.id === 'doomsday' && 'REX LATVERIAE'}
          {theme.id === 'maxdark' && '1080×1440.DP'}
          {theme.id === 'maxlight' && 'TOKYO PRESS'}
        </span>
      </div>

      {/* ---------- Marquee: player and year ---------- */}
      <header style={{ display: 'flex', alignItems: 'stretch', justifyContent: 'space-between', gap: 24, zIndex: 1, position: 'relative' }}>
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
          data-egg="year-console"
          style={{
            ...(theme.id === 'gtavi'
              ? {
                background: 'linear-gradient(135deg, rgba(253, 224, 200, 0.28) 0%, rgba(94, 141, 168, 0.22) 50%, rgba(107, 59, 94, 0.5) 100%)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '3px solid rgba(253, 224, 200, 0.65)',
                boxShadow:
                  'inset 0 2px 0 0 rgba(255, 255, 255, 0.45), inset 0 -2px 0 0 rgba(66, 30, 56, 0.5), 0 8px 24px -4px rgba(66, 30, 56, 0.45)',
                position: 'relative' as const,
                overflow: 'hidden' as const,
              }
              : theme.id === 'doomsday'
                ? {
                  background: 'linear-gradient(180deg, #243326 0%, #161D17 40%, #121512 100%)',
                  border: '3px solid #506340',
                  boxShadow:
                    '0 0 0 1.5px #28D443, inset 0 2px 0 0 rgba(213, 227, 163, 0.45), inset 0 -2px 0 0 #0A0D0A, 0 8px 24px -2px rgba(40, 212, 67, 0.35)',
                  position: 'relative' as const,
                  overflow: 'hidden' as const,
                }
                : theme.id === 'artemis'
                  ? {
                    background: 'linear-gradient(180deg, #162C4E 0%, #081426 50%, #040A17 100%)',
                    border: '3px solid #5078A8',
                    boxShadow:
                      '0 0 0 1.5px rgba(124, 214, 255, 0.45), inset 0 2px 0 0 rgba(216, 231, 246, 0.35), inset 0 -2px 0 0 #020610, 0 8px 24px -2px rgba(124, 214, 255, 0.25)',
                    position: 'relative' as const,
                    overflow: 'hidden' as const,
                  }
                  : theme.id === 'fifa'
                    ? {
                      background: 'linear-gradient(135deg, #16468F 0%, #0F3062 100%)',
                      border: '3px solid #F7D154',
                      boxShadow:
                        '0 0 0 1.5px #8A5A10, inset 0 2px 0 0 rgba(247, 209, 84, 0.45), 0 8px 24px -2px rgba(247, 209, 84, 0.35)',
                      position: 'relative' as const,
                      overflow: 'hidden' as const,
                    }
                    : {
                      background:
                        theme.id === 'maxlight'
                          ? '#0B1B61'
                          : '#0B0D17',
                      border: `${KEYLINE}px solid ${c.line}`,
                    }),
            padding: '10px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {theme.id === 'gtavi' && (
            <>
              {/* Subtle VCR scanline texture */}
              <div
                aria-hidden
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: 'repeating-linear-gradient(0deg, transparent 0 2px, rgba(0, 0, 0, 0.16) 2px 4px)',
                  pointerEvents: 'none',
                }}
              />
              {/* Subtle VCR Playback Status */}
              <span
                style={{
                  position: 'absolute',
                  top: 5,
                  left: 8,
                  fontFamily: MONO,
                  fontSize: 10,
                  fontWeight: 800,
                  letterSpacing: '0.12em',
                  color: '#FDE0C8',
                  opacity: 0.75,
                }}
              >
                PLAY ▶
              </span>
            </>
          )}
          {theme.id === 'doomsday' && (
            <>
              {/* Subtle vertical metal scratches */}
              <div
                aria-hidden
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage:
                    'repeating-linear-gradient(90deg, transparent 0 3px, rgba(141, 150, 148, 0.08) 3px 4px, transparent 4px 9px, rgba(213, 227, 163, 0.04) 9px 10px)',
                  pointerEvents: 'none',
                }}
              />
              {/* Latverian technical mark */}
              <span
                style={{
                  position: 'absolute',
                  top: 5,
                  left: 8,
                  fontFamily: MONO,
                  fontSize: 10,
                  fontWeight: 800,
                  letterSpacing: '0.12em',
                  color: '#8D9694',
                  opacity: 0.85,
                }}
              >
                LATVERIA // STEEL
              </span>
            </>
          )}
          {theme.id === 'artemis' && (
            <span
              style={{
                position: 'absolute',
                top: 5,
                left: 8,
                fontFamily: MONO,
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: '0.12em',
                color: c.onGroundDim,
                opacity: 0.9,
              }}
            >
              ARTEMIS // II · ORBIT
            </span>
          )}
          {theme.id === 'fifa' && (
            <span
              style={{
                position: 'absolute',
                top: 5,
                left: 8,
                fontFamily: MONO,
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: '0.12em',
                color: '#F7D154',
                opacity: 0.9,
              }}
            >
              MATCHDAY // '26
            </span>
          )}
          <div
            style={{
              fontFamily: DOT,
              fontWeight: 900,
              fontSize: 96,
              lineHeight: 1,
              letterSpacing: '0.02em',
              position: 'relative' as const,
              zIndex: 1,
              ...(theme.id === 'gtavi'
                ? {
                  color: '#FDE0C8',
                  textShadow:
                    '0 0 10px #F3937B, 0 0 22px rgba(243, 147, 123, 0.85), 0 0 36px rgba(164, 128, 212, 0.65)',
                }
                : theme.id === 'doomsday'
                  ? {
                    background:
                      'linear-gradient(180deg, #FFFFFF 0%, #D5E3A3 16%, #8D9694 44%, #3A4240 50%, #8D9694 72%, #243326 100%)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    color: '#8D9694',
                    filter:
                      'drop-shadow(0 -1px 0 rgba(255, 255, 255, 0.75)) drop-shadow(0 2px 0 #0A0D0A) drop-shadow(0 0 1px #28D443) drop-shadow(0 0 12px rgba(40, 212, 67, 0.65))',
                  }
                  : theme.id === 'artemis'
                    ? {
                      color: '#7CD6FF',
                    }
                    : theme.id === 'fifa'
                      ? {
                        background:
                          'linear-gradient(180deg, #FFFFFF 0%, #F7D154 22%, #FFEAA7 44%, #8A5A10 50%, #5A3A0A 54%, #F7D154 75%, #8A5A10 100%)',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        color: '#F7D154',
                        filter:
                          'drop-shadow(0 -1px 0 rgba(255, 255, 255, 0.8)) drop-shadow(0 2px 0 #5A3A0A) drop-shadow(0 0 14px rgba(247, 209, 84, 0.65))',
                      }
                      : {
                        color: led,
                      }),
            }}
          >
            {d.year}
          </div>
        </div>
      </header>

      {/* ---------- Hazard stripe ---------- */}
      <div
        aria-hidden
        style={{
          ...getHazardStyle(theme.id, c),
          zIndex: 1,
          position: 'relative',
        }}
      />

      {/* ---------- Score window + score table ---------- */}
      <section style={{ display: 'flex', gap: 22, alignItems: 'stretch', zIndex: 1, position: 'relative' }}>
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
              <span style={{ ...label(c.onGroundDim, 18), fontWeight: 700 }}>{name}</span>
              <span style={{ ...condensed(40, c.onGround, 800), fontStretch: '75%', lineHeight: 1, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
                {value}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Languages: one ink meter ---------- */}
      <section style={{ zIndex: 1, position: 'relative' }}>
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginTop: 12 }}>
              {langs.map((lang, i) => (
                <div key={lang.name} style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, flex: '1 1 0' }}>
                  <span style={{ width: 18, height: 18, background: langInks[i], border: `3px solid ${c.line}`, boxSizing: 'border-box', flexShrink: 0 }} />
                  <span style={{ ...condensed(30, c.onGround, 800), fontStretch: '78%', lineHeight: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 140 }}>{lang.name}</span>
                  <span style={{ ...label(c.onGroundDim, 18), fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>{lang.percent.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div style={{ ...window_, padding: '14px 20px', ...label(c.onPanelDim, 18) }}>No language data for public commits this year</div>
        )}
      </section>

      {/* ---------- Top repository + player class ---------- */}
      <section style={{ display: 'flex', gap: 22, alignItems: 'stretch', zIndex: 1, position: 'relative' }}>
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
              color: theme.id === 'fifa' ? '#EAECEF' : c.ink,
              padding: '16px 20px 18px',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 8,
              overflow: 'hidden',
            }}
          >
            <div style={label(theme.id === 'fifa' ? '#F7D154' : c.ink, 18)}>Player class</div>
            <div style={{ ...condensed(46, theme.id === 'fifa' ? '#EAECEF' : c.ink), lineHeight: 0.92, textTransform: 'uppercase', maxWidth: 210 }}>{cls.name}</div>
            <div style={{ ...label(theme.id === 'fifa' ? '#EAECEF' : c.ink, 18), maxWidth: 210, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cls.short}</div>
            <img
              src={playerAvatarUrl || playerAvatar(cls.name)}
              alt=""
              style={{ position: 'absolute', right: 8, top: 8, width: 140, height: 'calc(100% - 16px)', objectFit: 'contain', imageRendering: 'pixelated' }}
            />
          </div>
        )}
      </section>

      {/* ---------- LED matrix: the year, day by day ---------- */}
      <section style={{ background: '#0B0D17', border: `${KEYLINE}px solid ${c.line}`, padding: '16px 20px 20px', zIndex: 1, position: 'relative' }}>
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
      <section style={{ ...window_, padding: '18px 24px', display: 'flex', alignItems: 'center', gap: 18, flex: '1 1 0', minHeight: 0, zIndex: 1, position: 'relative' }}>
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
      <footer style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, flexShrink: 0, zIndex: 1, position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
          <div aria-hidden style={{ display: 'flex', gap: 5 }}>
            {getFooterInks(theme.id, c).map((ink, i) => (
              <span key={i} style={{ width: 18, height: 18, background: ink, border: `2.5px solid ${c.line}`, boxSizing: 'border-box' }} />
            ))}
          </div>
          <span data-egg="footer" style={{ ...label(c.onGroundDim, 14), letterSpacing: '0.08em', opacity: 0.85, whiteSpace: 'nowrap' }}>
            {getFooterEasterEgg(theme.id)}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexShrink: 0, whiteSpace: 'nowrap' }}>
          {d.includesPrivate && (
            <span style={{ ...label(c.onGroundDim, 14), display: 'inline-flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
              <Lock size={13} color={c.onGroundDim} /> incl. private
            </span>
          )}
          <span style={{ ...label(c.onGround, 17), letterSpacing: '0.06em', fontWeight: 700, whiteSpace: 'nowrap' }}>
            {getFooterBadge(theme.id)}
          </span>
        </div>
      </footer>
    </div>
  );
});

export default ArcadeCard;
