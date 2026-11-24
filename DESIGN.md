---
name: GitWrap
description: Your GitHub year, scored on the printed control panel of an arcade machine.
colors:
  # Default colourway: Lunar Orbit (artemis)
  ground: "#040A17"
  line: "#020610"
  ink: "#040A17"
  panel: "#D8E7F6"
  a1: "#7CD6FF"
  a2: "#E59A1A"
  led: "#7CD6FF"
  on-ground: "#D8E7F6"
  on-ground-dim: "#C6E0FB"
  on-panel-dim: "#162C4E"

  # Matchday '26 (fifa)
  fifa-ground: "#176840"
  fifa-line: "#16468F"
  fifa-ink: "#16468F"
  fifa-panel: "#EAECEF"
  fifa-a1: "#F7D154"
  fifa-a2: "#C42B30"
  fifa-led: "#F7D154"
  fifa-on-ground: "#EAECEF"
  fifa-on-ground-dim: "#F7D154"
  fifa-on-panel-dim: "#8A5A10"

  # Vice Sunset (gtavi)
  gtavi-ground: "#6B3B5E"
  gtavi-line: "#421E38"
  gtavi-ink: "#421E38"
  gtavi-panel: "#FDE0C8"
  gtavi-a1: "#F3937B"
  gtavi-a2: "#5E8DA8"
  gtavi-led: "#F3937B"
  gtavi-on-ground: "#FDE0C8"
  gtavi-on-ground-dim: "#F0D6EC"
  gtavi-on-panel-dim: "#6B3B5E"

  # Latverian Steel (doomsday)
  doomsday-ground: "#121512"
  doomsday-line: "#0A0D0A"
  doomsday-ink: "#121512"
  doomsday-panel: "#D5E3A3"
  doomsday-a1: "#28D443"
  doomsday-a2: "#D42329"
  doomsday-led: "#28D443"
  doomsday-on-ground: "#D5E3A3"
  doomsday-on-ground-dim: "#8D9694"
  doomsday-on-panel-dim: "#506340"

  # Volt Matrix (maxdark)
  maxdark-ground: "#0A0B0E"
  maxdark-line: "#000000"
  maxdark-ink: "#050608"
  maxdark-panel: "#EEEEEE"
  maxdark-a1: "#D4FF00"
  maxdark-a2: "#FF5500"
  maxdark-led: "#D4FF00"
  maxdark-on-ground: "#FFFFFF"
  maxdark-on-ground-dim: "#9CA3AF"
  maxdark-on-panel-dim: "#4B5563"

  # Tokyo Riso (maxlight)
  maxlight-ground: "#F4EFE6"
  maxlight-line: "#0B1B61"
  maxlight-ink: "#0B1B61"
  maxlight-panel: "#FFFFFF"
  maxlight-a1: "#FF3366"
  maxlight-a2: "#FFD600"
  maxlight-led: "#FF3366"
  maxlight-on-ground: "#0B1B61"
  maxlight-on-ground-dim: "#586AA3"
  maxlight-on-panel-dim: "#586AA3"

  # Dark glass: fixed in every colourway
  glass: "#0B0D17"
  glass-text: "#F6F4EC"
  glass-dim: "#9AA0B4"
typography:
  display:
    fontFamily: "'Archivo', 'Arial Narrow', sans-serif"
    fontSize: "clamp(3.25rem, 10.5vw, 6rem)"
    fontWeight: 900
    lineHeight: 0.9
    letterSpacing: "-0.01em"
    fontVariation: "'wdth' 66"
  headline:
    fontFamily: "'Archivo', 'Arial Narrow', sans-serif"
    fontSize: "1.75rem"
    fontWeight: 800
    lineHeight: 1
    fontVariation: "'wdth' 75"
  score-value:
    fontFamily: "'Archivo', 'Arial Narrow', sans-serif"
    fontSize: "1.5rem"
    fontWeight: 800
    lineHeight: 1
    fontFeature: "'tnum'"
    fontVariation: "'wdth' 75"
  lede:
    fontFamily: "'Archivo', 'Arial Narrow', sans-serif"
    fontSize: "1.1875rem"
    fontWeight: 500
    lineHeight: 1.45
  body:
    fontFamily: "'Archivo', 'Arial Narrow', sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "'Martian Mono', ui-monospace, 'Cascadia Mono', monospace"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.04em"
    fontVariation: "'wdth' 87.5"
  key:
    fontFamily: "'Archivo', 'Arial Narrow', sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "0.04em"
    fontVariation: "'wdth' 78"
  wordmark:
    fontFamily: "'Archivo', 'Arial Narrow', sans-serif"
    fontSize: "1.375rem"
    fontWeight: 900
    letterSpacing: "0.02em"
    fontVariation: "'wdth' 112"
  slot-input:
    fontFamily: "'Martian Mono', ui-monospace, 'Cascadia Mono', monospace"
    fontSize: "1.125rem"
    fontWeight: 600
  card-year:
    fontFamily: "'Doto', 'Martian Mono', monospace"
    fontSize: "92px"
    fontWeight: 900
    lineHeight: 0.95
    letterSpacing: "0.02em"
rounded:
  none: "0px"
spacing:
  u: "8px"
  u-1-5: "12px"
  u-2: "16px"
  u-2-5: "20px"
  u-3: "24px"
  u-4: "32px"
  u-5: "40px"
  u-6: "48px"
  u-7: "56px"
  u-8: "64px"
  u-9: "72px"
  keyline: "3px"
  travel: "6px"
  travel-sm: "4px"
  card-keyline: "4px"
  card-gap: "22px"
  card-padding: "44px"
components:
  key:
    backgroundColor: "{colors.a1}"
    textColor: "{colors.ink}"
    typography: "{typography.key}"
    rounded: "{rounded.none}"
    padding: "0.75rem 1.25rem"
    height: "48px"
  key-plain:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    typography: "{typography.key}"
    rounded: "{rounded.none}"
    padding: "0.75rem 1.25rem"
    height: "48px"
  key-plain-current:
    backgroundColor: "{colors.a1}"
    textColor: "{colors.ink}"
  key-sm:
    rounded: "{rounded.none}"
    padding: "0.4rem 0.75rem"
    height: "36px"
  key-lg:
    backgroundColor: "{colors.a1}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "1rem 1.75rem"
    height: "60px"
  slot:
    backgroundColor: "{colors.glass}"
    textColor: "{colors.glass-text}"
    typography: "{typography.slot-input}"
    rounded: "{rounded.none}"
    height: "60px"
  window:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
  strip:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "12px 16px"
  strip-warn:
    backgroundColor: "{colors.a2}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "12px 16px"
  switch:
    backgroundColor: "{colors.panel}"
    rounded: "{rounded.none}"
    size: "28px"
  switch-checked:
    backgroundColor: "{colors.a1}"
    rounded: "{rounded.none}"
    size: "28px"
  swatch:
    backgroundColor: "{colors.ground}"
    rounded: "{rounded.none}"
    height: "44px"
  link:
    textColor: "{colors.on-ground}"
    typography: "{typography.label}"
  link-hover:
    textColor: "{colors.a1}"
  card:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.on-ground}"
    rounded: "{rounded.none}"
    padding: "44px"
    width: "1080px"
    height: "1440px"
---

# Design System: GitWrap 2026

## Overview

**Creative North Star: The Printed Control Panel**

GitWrap is designed as the silkscreened control panel of an arcade machine, and your engineering year is what it scores. Every view uses a flat silkscreened ground ruled by heavy black keylines. Controls are square keycaps with physical travel edges that press down under interaction. Data readings live in light score windows; heatmaps and telemetry live behind dark glass lit by virtual LEDs. Words are rendered in condensed bold capitals, telemetry is set in wide monospace, and dot-matrix typography is reserved for the year, scoreboard readings, and certified stamps.

The system is unapologetic in colour and disciplined in structure:
- Every colourway adheres to a strict three-ink rule (a ground, two accent inks, plus black keylines and light panel face).
- Square corners everywhere: rounded corners are prohibited globally via `border-radius: 0 !important`.
- Physical mechanical keys: buttons possess a 6px hard travel edge that compresses on interaction.
- Flat depth: no soft blurs, no translucent frosted glass, and no faux gradients.
- Typography: Archivo, Martian Mono, and Doto with strict functional assignments.
- Stepped animation: motion uses discrete steps (`steps()`), completely disabled when reduced motion is preferred.

There are no CSS component frameworks or external style libraries. The application uses plain CSS in `index.css` parameterized by CSS custom properties. The exported arcade card (`components/ArcadeCard.tsx`) is an exact 1080x1440 layout styled inline to guarantee pixel-for-pixel parity between on-screen preview and the downloaded PNG.

---

## The Six 2026 Colourways

GitWrap 2026 introduces six bespoke colourways replacing the legacy 2025 palettes:

| ID | Name | Subtitle | Ground | Line | Ink | Panel | A1 (Primary) | A2 (Secondary) |
|---|---|---|---|---|---|---|---|---|
| `artemis` | Lunar Orbit | Inspired by Artemis II | #040A17 | #020610 | #040A17 | #D8E7F6 | #7CD6FF | #E59A1A |
| `fifa` | Matchday '26 | Inspired by World Cup 2026 | #176840 | #16468F | #16468F | #EAECEF | #F7D154 | #C42B30 |
| `gtavi` | Vice Sunset | Inspired by GTA VI | #6B3B5E | #421E38 | #421E38 | #FDE0C8 | #F3937B | #5E8DA8 |
| `doomsday` | Latverian Steel | Inspired by Avengers Doomsday | #121512 | #0A0D0A | #121512 | #D5E3A3 | #28D443 | #D42329 |
| `maxdark` | Volt Matrix | Maximalist Dark | #0A0B0E | #000000 | #050608 | #EEEEEE | #D4FF00 | #FF5500 |
| `maxlight` | Tokyo Riso | Maximalist Light | #F4EFE6 | #0B1B61 | #0B1B61 | #FFFFFF | #FF3366 | #FFD600 |

### Atmospheric Canvas Palettes:
- **2026 Fusion (`fusion`):** Deep cosmic obsidian ground (#090B13) harmonizing accent nodes from all six themes. Used on the homepage backdrop.
- **Studio Control (`studio`):** Command-room palette (#0B0D17) maintaining stable, focused page chrome while the user cycles card themes.

### Dark Glass (Fixed Elements):
- **Glass Ground** (#0B0D17): Used for the coin-slot input, card year display, and LED calendar matrix.
- **Glass Text** (#F6F4EC): Unlit LED cells and high-contrast glass markings.
- **Glass Dim** (#9AA0B4): Slot placeholder text and matrix legends.

---

## Typography System

All typefaces are self-hosted in `public/fonts/` as variable WOFF2 files:

1. **Archivo (Latin Subset, Variable):**
   - Width: 62% to 125%
   - Weight: 100 to 900
   - Role: Stencilled display titles, headlines, player names, and body text. Condensed widths (66% to 75%) give the look of vintage stamped metal machinery.

2. **Martian Mono (Latin Subset, Variable):**
   - Width: 75% to 112.5%
   - Weight: 100 to 800
   - Role: Silkscreened labels, telemetry readouts, commit counts, and control instructions.

3. **Doto (Latin Subset, Variable):**
   - Weight: 100 to 900
   - Role: Dot-matrix year badge on cards, live scoreboard counter in the hero matrix, and Volt Matrix stamped seal.

---

## Interactive Hero Contribution Matrix

The landing hero features an animated 7x52 GitHub contribution board:
- **Spelling Matrix:** Plots a continuous calendar grid that spells out `YOUR 2026` in active contribution cells across 52 weeks and 7 weekday rows.
- **Organic Noise:** Fills surrounding cells with natural background commits to resemble an authentic active developer profile.
- **Story 3 Pop Physics:** Cells animate inward with an elastic overshoot entrance (`mosaicPop`), staggered quarterly.
- **Cell Telemetry Tooltips:** Hovering any cell reveals exact contribution counts, dates, and quarter designations.
- **Dual-Mode Certification Seal (`SCORED.`):**
  - Tokyo Riso mode: Red Japanese circular Hanko seal with registration crop marks.
  - Volt Matrix mode: Cybernetic barcode terminal stamp with hex telemetry.

---

## Ambient CPU Circuit Backdrop

The background of the homepage and studio employs an ambient semiconductor trace system:
- **Architecture:** 0.8px hairline vector buses with orthogonal 90-degree interconnects and surface-mount junction pads.
- **Optical Pulses:** Fine data packets traveling along micro-traces with subtle optical bloom.
- **Zero Initial Delay:** Uses pre-warmed negative animation delays (`-1.5s`, `-3.2s`, etc.) so signals are actively moving the moment the DOM renders, avoiding frozen initial frames.

---

## 10-Slide Tap-Through Story Mode

An interactive Spotify-style story recap preceding card customization:
- **Slide 1:** Player ID pass, avatar, and telemetry summary.
- **Slide 2:** Attendance speedo gauge and consistency rating.
- **Slide 3:** 52-week activity mosaic with quarterly pods (Q1 to Q4).
- **Slide 4:** 24-hour combat radar clock mapping peak commit hours.
- **Slide 5:** Streak multipliers and segmented momentum capacitor bar.
- **Slide 6:** Pull request velocity and review cadence.
- **Slide 7:** Issue resolution and community contributions.
- **Slide 8:** Polyglot language matrix and balanced stack analysis.
- **Slide 9:** Open source collaboration footprint.
- **Slide 10:** Player archetype classification, 16-bit virtual pet companion badge, and 3D arcade card dispenser feed.

---

## Design System Rules

### Do:
- Take all colors from the active theme variables (`--ground`, `--a1`, `--a2`, `--panel`, `--line`).
- Maintain square edges everywhere: `border-radius: 0 !important`.
- Give every pressable button a physical travel edge with a 6px offset shadow that compresses down to 0 on active press.
- Ensure all text on light panels or accent buttons uses `--ink`.
- Use `tabular-nums` for all dynamic numerical readouts.

### Don't:
- Do not introduce rounded corners, pill shapes, or soft drop shadows.
- Do not use blur or glassmorphism filters.
- Do not add random arbitrary colors outside the three-ink print rule.
- Do not use eased glide animations; motion must be crisp and stepped (`steps()`).
