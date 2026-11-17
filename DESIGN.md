---
name: GitWrap
description: Your GitHub year, scored on the printed control panel of an arcade machine.
colors:
  # Player One: the default colourway, and the values on :root in index.css
  ground: "#2438E8"
  line: "#0B0D17"
  ink: "#0B0D17"
  panel: "#F6F4EC"
  a1: "#FFD21F"
  a2: "#FF5C7A"
  on-ground: "#FFFFFF"
  on-ground-dim: "#C9D0FF"
  on-panel-dim: "#545A70"
  # Token
  token-ground: "#FFC917"
  token-line: "#111111"
  token-ink: "#111111"
  token-panel: "#FFFFFF"
  token-a1: "#FF5A36"
  token-a2: "#8ADBFF"
  token-led: "#FFC917"
  token-on-ground: "#111111"
  token-on-ground-dim: "#5A4700"
  token-on-panel-dim: "#5B5B5B"
  # Mint Cab
  mint-ground: "#1EDC86"
  mint-line: "#062018"
  mint-ink: "#062018"
  mint-panel: "#F4FFF9"
  mint-a1: "#FF63AB"
  mint-a2: "#FFE14A"
  mint-on-ground: "#062018"
  mint-on-ground-dim: "#0B5236"
  mint-on-panel-dim: "#3F6654"
  # Grape
  grape-ground: "#5B2EE5"
  grape-line: "#120A2A"
  grape-ink: "#120A2A"
  grape-panel: "#F4F0FF"
  grape-a1: "#C8F53B"
  grape-a2: "#FF6FB2"
  grape-on-ground: "#FFFFFF"
  grape-on-ground-dim: "#D8CCFF"
  grape-on-panel-dim: "#5C5378"
  # Bone
  bone-ground: "#E8E5DA"
  bone-line: "#111111"
  bone-ink: "#111111"
  bone-panel: "#FFFFFF"
  bone-a1: "#F0442F"
  bone-a2: "#FFD21F"
  bone-on-ground: "#111111"
  bone-on-ground-dim: "#5C594F"
  bone-on-panel-dim: "#5E5E5E"
  # Night Shift
  night-ground: "#14161C"
  night-line: "#F3F1E8"
  night-ink: "#0A0B0F"
  night-panel: "#F3F1E8"
  night-a1: "#1EDC86"
  night-a2: "#FFD21F"
  night-on-ground: "#F3F1E8"
  night-on-ground-dim: "#A9AEBB"
  night-on-panel-dim: "#555A66"
  # Dark glass: fixed in every colourway (coin slot, dispenser mouth, year window, LED matrix)
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

# Design System: GitWrap

## Overview

**Creative North Star: "The Printed Control Panel"**

GitWrap is drawn as the printed control panel of an arcade machine, and your year is what it scores. Each page is one flat silkscreened ground in a single colour, ruled with black keylines. Actions are square keycaps that sit on a visible travel edge and press down onto it. Numbers live in light "score windows"; the contribution heatmap and the year live behind dark glass, lit like LEDs. Words are heavy condensed capitals, measurements are a wide mono, and the dot-matrix face appears once, for the year.

The system is loud in colour and strict in everything else. A colourway is a three-ink print: a ground, and two accent inks, with a keyline and a light panel face. Nothing is rounded, nothing is blurred, nothing glows, and nothing eases. That strictness is what keeps the arcade reference from reading as a toy: the hierarchy is carried by size, weight and width of type, so a stat reads in one glance when the card is shrunk into a social feed.

There is no Tailwind and no component library. The site is plain CSS in `index.css`, driven by custom properties that a page wrapper swaps per colourway. The card (`components/ArcadeCard.tsx`) is a fixed 1080×1440 layout with inline styles only, so the on-screen preview and the exported PNG are the same pixels.

**Key Characteristics:**
- One flat ground per colourway, black keylines, two accent inks
- Square corners everywhere, enforced globally (`border-radius: 0 !important`)
- Keys travel: a hard 6px edge under every pressable thing, which the key drops onto
- Light windows hold readings; dark glass holds lit displays
- Three typefaces with fixed jobs: Archivo, Martian Mono, Doto
- Stepped motion only (`steps()`), removed entirely under reduced motion

## Colors

Six colourways, each a saturated flat ground with two inks printed on it. A page never uses a colour that is not one of the active colourway's roles, apart from the fixed dark glass.

### Roles

Every colourway in `constants.ts` (`THEMES`) fills the same roles. `themeVars(theme)` turns them into the CSS custom properties below; set them on the page wrapper's `style` (`.gw`). The card reads the same object directly as `theme.c`.

| Role | CSS variable | Meaning |
| --- | --- | --- |
| `ground` | `--ground` | The silkscreened field: page and card background |
| `line` | `--line` | Keylines and the travel edge under keys |
| `ink` | `--ink` | Text on light surfaces (windows, keys, accent blocks) |
| `panel` | `--panel` | Score-window face; plain key face; third language ink |
| `a1` | `--a1` | Primary ink: START key, pressed/selected state, lit LEDs, hazard stripe, headline accent |
| `a2` | `--a2` | Secondary ink: second language, the AI block, warning strips |
| `led` | (card only) | Optional. Lit colour behind dark glass when `a1` is too dark for it. Falls back to `a1` |
| `onGround` | `--on-ground` | Text printed straight on the ground; focus ring |
| `onGroundDim` | `--on-ground-dim` | Secondary text on the ground, tinted from the ground's hue |
| `onPanelDim` | `--on-panel-dim` | Secondary text inside a window |

### The six colourways

| id | Name | ground | line | ink | panel | a1 | a2 | onGround | onGroundDim | onPanelDim |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `p1` | Player One (default) | #2438E8 | #0B0D17 | #0B0D17 | #F6F4EC | #FFD21F | #FF5C7A | #FFFFFF | #C9D0FF | #545A70 |
| `token` | Token | #FFC917 | #111111 | #111111 | #FFFFFF | #FF5A36 | #8ADBFF | #111111 | #5A4700 | #5B5B5B |
| `mint` | Mint Cab | #1EDC86 | #062018 | #062018 | #F4FFF9 | #FF63AB | #FFE14A | #062018 | #0B5236 | #3F6654 |
| `grape` | Grape | #5B2EE5 | #120A2A | #120A2A | #F4F0FF | #C8F53B | #FF6FB2 | #FFFFFF | #D8CCFF | #5C5378 |
| `bone` | Bone | #E8E5DA | #111111 | #111111 | #FFFFFF | #F0442F | #FFD21F | #111111 | #5C594F | #5E5E5E |
| `night` | Night Shift | #14161C | #F3F1E8 | #0A0B0F | #F3F1E8 | #1EDC86 | #FFD21F | #F3F1E8 | #A9AEBB | #555A66 |

Token is the only colourway with `led` (#FFC917): its `a1` is a red-orange, so the year and the heatmap light up in the ground's yellow instead.

Night Shift inverts the keyline: `line` is light (#F3F1E8, the same value as `panel`) on a near-black ground, so windows read as solid light blocks with no visible border and the travel edge under keys is light. Its swatch key in the colourway picker overrides `--line` to #0B0D17 so the swatch still has a dark frame.

The landing page is always printed in Player One (`DEFAULT_THEME`). The wrap page re-prints the whole page, chrome included, in whichever colourway is selected.

### Dark glass (fixed)

- **Glass** (#0B0D17): the coin-slot input, the dispenser mouth, the card's year window and the LED matrix. It does not change with the colourway.
- **Glass text** (#F6F4EC): typed text in the slot, labels on glass, unlit LEDs.
- **Glass dim** (#9AA0B4): the slot placeholder and the "less / more" legend.

### Named Rules

**The Three-Ink Rule.** A colourway is a ground plus two inks (`a1`, `a2`), with `line` and `panel` as the print's black and paper. Nothing else gets a colour. A new colourway is a new entry in `THEMES`, never a one-off colour in a component.

**The Ink-Carrying Rule.** `a1` and `a2` are always light enough to carry `ink` text, because keys, chips and the AI block print on them. Text on an accent is `ink`, never `onGround`.

**The Hazard Stripe Rule.** The 45° stripe of `line` and `a1` appears in exactly two places: the marquee strip and the rule under the card's header. It is not a general divider or decoration.

## Typography

**Display Font:** Archivo (variable: weight 100–900, width 62–125%; fallback 'Arial Narrow', sans-serif)
**Body Font:** Archivo, at normal width
**Label/Mono Font:** Martian Mono (variable: weight 100–800, width 75–112.5%; fallback ui-monospace, 'Cascadia Mono', monospace)
**Dot-matrix Font:** Doto (variable weight 100–900; fallback Martian Mono), used for the year on the card only

All three are self-hosted variable fonts in `public/fonts/` (latin subsets, `font-display: swap`). The export iframe declares the same three `@font-face` rules itself, so any face used on the card must stay self-hosted.

**Character:** One family does almost everything by changing width. Archivo squeezed to 66–78% and set heavy is the panel's stencilled lettering; the same family at normal width is quiet running text. Martian Mono is the silkscreened legend beside a control.

### Hierarchy

- **Display** (`.display`; weight 900, width 66%, line-height 0.9, -0.01em, uppercase, balanced wrap): page headlines. Size is set per use: `clamp(3.25rem, 10.5vw, 6rem)` on the landing hero, `clamp(2.5rem, 8vw, 4.5rem)` on loading and error screens, `clamp(2.25rem, 5vw, 3.5rem)` on the wrap page.
- **Headline** (`.heading`; weight 800, width 75%, 1.75rem, line-height 1, uppercase): section headings on the wrap page.
- **Score value** (`.score-value`; weight 800, width 75%, 1.5rem, tabular numerals): the reading at the right of a score row.
- **Lede** (`.lede`; weight 500, 1.1875rem, line-height 1.45, max-width 34rem): the one paragraph under the hero headline.
- **Body** (weight 400, 1.0625rem, line-height 1.5): default text. Supporting notes drop to 0.9375rem and cap at 44–62ch.
- **Label** (`.silk`; Martian Mono 600, width 87.5%, 0.75rem, 0.04em, uppercase, line-height 1.4): legends, measurements, instructions under controls. Coloured `onGroundDim` on the ground and `onPanelDim` inside a `.window`.
- **Key legend** (`.key`; weight 800, width 78%, 1.0625rem, 0.04em, uppercase): text on keys. 0.875rem on `.key-sm`, 1.375rem on `.key-lg`.
- **Wordmark** (`.wordmark`; weight 900, width 112%, 1.375rem, 0.02em, uppercase; 1.125rem at 480px and below): the only place Archivo runs wide.

### Card type (px at 1080 wide)

The card has its own fixed ramp, built from two helpers in `ArcadeCard.tsx`: `condensed(size, color, weight)` (Archivo, width 68%, line-height 0.9) and `label(color, size)` (Martian Mono 600, width 87.5%, 0.04em, uppercase).

- Total contributions: 212px, weight 900 (170px when the total is 100,000 or more)
- AI co-authored share: 96px, weight 900
- Year: Doto 900, 92px
- Player name: 60px, weight 800, width 75%
- Top repository: 54px, weight 800, width 75%
- Score-table values: 40px, weight 800, width 75%
- Language names: 32px, weight 800, width 80%
- One-liner: 29px, weight 600, width 92%, line-height 1.22, clamped to three lines
- Labels: 18–21px mono

Numbers that can change use `tabular-nums`. Long names, logins, repositories and languages are single-line with an ellipsis.

### Named Rules

**The Three Jobs Rule.** Archivo says words and scores. Martian Mono labels and measures. Doto shows the year on the card and nothing else.

**The Width Rule.** Hierarchy comes from Archivo's width axis as much as its size: 66–68% for the biggest figures, 75–80% for headings and values, normal width for reading text, 112% for the wordmark only.

## Layout

The page is a flex column (`.gw`, min-height 100vh): marquee, main, footer pinned to the bottom. Content sits in `.gw-wrap` (max-width 1240px, 24px side padding). Composition is left-aligned; nothing is centred except the card on narrow wrap pages.

**Module.** `--u` is 8px. Stylesheet gaps and padding are written as multiples of it (8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 72); half steps (12, 20) are in use. Structural rules are `--keyline` (3px). Key travel is `--travel` (6px; 4px on small keys and switches).

**Landing (`.hero`).** Two columns: copy and controls (`1fr`), then the sample card (up to 440px), 64px apart, top-aligned, 56px above and 72px below. At 1040px and below it becomes one column with a 56px gap and the card capped at 480px. The control block (`.controls`, max 560px) is a two-column grid: the coin slot spans the full row, START and SIGN IN sit under it, each with a `.silk` instruction 12px below. At 520px and below the controls stack.

**Wrap page (`.wrap-grid`).** Card column (up to 560px) and a controls column (`1fr`), 48px apart. The card is sticky 24px from the top. At 980px and below it is one column, 32px gap, card centred and no longer sticky. Sections in the controls column are separated by 40px (`.stack`).

**Marquee and footer.** Each is a full-width band ruled with one 3px keyline, 16px (marquee) or 20px (footer) of vertical padding. At 480px and below the hazard stripe is removed and the wordmark shrinks; at 640px and below the signed-in login is hidden (`.hide-sm`), leaving the sign-out link.

**The card.** 1080×1440, 44px padding, a single flex column with 22px gaps and 4px keylines (3px on chips and small squares). It is never responsive. `GitWrapCard` scales it with `transform: scale(frameWidth / 1080)` inside `.card-frame`, which holds the 1080:1440 aspect ratio. Order, top to bottom: player header and year window, hazard stripe, total-contributions window beside the seven-row score table (392px wide), language meter and legend, top-repository window beside the AI block (318px wide, omitted when the stat is hidden), LED matrix, one-liner window (takes the remaining height), pixel band and edition label.

## Elevation & Depth

Flat. There are no soft shadows, no blur, no backdrop filters and no gradients used for depth. Layering is by ground, keyline and face colour: light windows and dark glass sit on the ground with a 3px keyline around them.

The only shadows are hard, unblurred offsets that draw a physical edge.

### Shadow Vocabulary

- **Travel edge** (`box-shadow: 0 6px 0 0 var(--line)`): under every key and colourway swatch. 4px under `.key-sm` and switches. It shrinks to 4px on hover and to 0 when pressed, while the key translates down by the same amount.
- **Slot recess** (`box-shadow: inset 0 6px 0 0 rgb(0 0 0 / 0.55)`): the inside top edge of the coin-slot input.
- **Dispenser lip** (`box-shadow: 0 6px 0 0 rgb(0 0 0 / 0.35)`): under the dispenser mouth, over the card feeding out.

### Named Rules

**The Travel Edge Rule.** A hard offset edge means "this moves when pressed". It belongs to keys, swatches and switches only. Windows, strips, the card and images never get one.

## Shapes

Square. `border-radius: 0 !important` is set on every element and pseudo-element, so a radius cannot be introduced by accident. Avatars are square with a keyline. Scrollbar thumbs are square.

Edges are solid keylines in `line`: 3px on pages, 4px on the card. The one dotted line is the score-row separator (`3px dotted`), which reads as a printed leader between a label and its value.

Small filled squares are the system's bullet: breakdown chips and language legend marks on the card, the checked mark in a switch (12px), the loading lamps (28px), the pixel band in the card footer (22px), and the LED cells.

Icons (`components/icons/Arcade.tsx`) are one family: filled, drawn on a 16-unit grid from squares and straight cuts, no curves, rendered with `shape-rendering: crispEdges`. The set is PlayerArrow, Lock, Robot, Download, ArrowRight and Check. Third-party marks (GitHub, X, LinkedIn) keep their own drawings.

The landing headline's accent word (`.hero-accent`) is a keylined `a1` block rotated -2.5deg. It is the only rotated element in the system.

## Components

### Keys (`.key`)

Every action is a square keycap. A text link is used only for secondary navigation (see Links).

- **Shape:** square, 3px keyline, 6px travel edge, min-height 48px, padding 0.75rem 1.25rem, 0.6rem gap between icon and legend, single line.
- **Faces:** default `a1` (primary: START, DOWNLOAD CARD, TRY AGAIN). `.key-plain` uses `panel` (sign in, share, year keys, "another username"). `.key-a2` uses `a2`; it is defined but not used by any screen yet. Text is always `ink`.
- **Sizes:** `.key-sm` (min-height 36px, 0.875rem, 4px travel; 44×44px minimum on coarse pointers), default, `.key-lg` (min-height 60px, 1.375rem). Keys inside the landing `.control` row are 60px tall to match the slot. `.key-block` makes a key full width.
- **Hover:** moves down 2px; the edge shrinks by 2px.
- **Pressed / selected:** `:active`, `[aria-pressed='true']` and `[aria-current='page']` sit fully down (translate by the travel, edge 0). A current year key also switches its face to `a1`.
- **Disabled:** `:disabled` or `[aria-disabled='true']` sits fully down with a diagonal hatch (transparent and 18% black, 6px bands) over its face, `cursor: not-allowed`. Used for sign-in when OAuth is not configured and for DOWNLOAD while the image is being made (`aria-busy`, legend changes to "Printing the card").
- **Motion:** `transform` and `box-shadow`, 70ms `steps(2)`.

### Coin slot (`.slot`)

The username field. A `<label>` wrapping an "@" prefix and a bare input.

- **Style:** dark glass (#0B0D17), 3px keyline, min-height 60px, inset recess at the top edge. The "@" and the caret are `a1`. Typed text is Martian Mono 600 at 1.125rem in #F6F4EC; the placeholder is #9AA0B4.
- **Focus:** the ring is drawn on the whole slot (`:focus-within`, 3px solid `on-ground`, 4px offset); the inner input's own outline is removed.
- **Help and error:** a `.silk` line below, tied with `aria-describedby`. On a validation error the same line swaps to the message, takes `role="alert"` and turns `a1`; the input gets `aria-invalid`.

### Windows and strips

- **Window (`.window`):** `panel` face, `ink` text, 3px keyline. Holds readings. `.silk` labels inside it use `on-panel-dim`. Padding is set per use (8px 16px around a score table).
- **Strip (`.strip`):** a window for a sentence: padding 12px 16px, 0.9375rem, line-height 1.4. Used for the "private repositories are counted" notice, with a Lock icon.
- **Warning strip (`.strip-warn`):** the same on an `a2` face. Used for errors (`role="alert"`): failed sign-in, fetch errors, failed download.

### Score rows (`.score-row`)

A label and a value on one baseline, pushed to opposite ends, 8px above and below, separated from the next row by a 3px dotted line in the current text colour (none after the last row). Label is `.silk`; value is `.score-value`. The card's score table is the same pattern at card scale, printed straight on the ground with `onGroundDim` dots.

### Switches (`.switch`)

A label wrapping a checkbox drawn as a small key: 28px square, `panel` face, 3px keyline, 4px travel edge. Checked: face turns `a1`, it drops 4px onto its edge, and a 12px `ink` square appears in the centre. Label text is 0.9375rem, weight 600, 12px from the box. Motion 70ms `steps(2)`.

### Colourway keys (`.swatches`, `.swatch`)

A `radiogroup` of six square keys in one row (six equal columns, 8px gap, min-height 44px). Each swatch is a proof of its own colourway: the face is its `ground`, and the bottom 38% is split into its `a1` and `a2`, divided by keylines. Hover drops 2px. The selected swatch (`aria-checked='true'`) sits fully down and carries a 3px solid `on-ground` outline at 2px offset. Keyboard focus uses a 3px dashed outline at 6px offset so it stays distinct from selection. The active colourway's name is printed below in `.silk`.

### Marquee (navigation)

The strip across the top of every page: wordmark (links to the edition's landing page), the hazard stripe filling the free space (14px tall, keylined, 10px bands), an optional signed-in login with a "Sign out" link, and one `.key-sm.key-plain` per edition year inside `<nav aria-label="Edition">`. The current year is `aria-current="page"`: pressed down and `a1`.

### Links (`.link`)

Mono label type (0.75rem, 600, uppercase) in `on-ground`, underlined 2px with a 0.25em offset. Hover turns it `a1`. Also used on `<button>` for inline toggles such as "How is this measured?" (`aria-expanded`).

### Dispenser (landing)

A dark-glass mouth (22px tall, keylined, with the dispenser lip) from which the sample card feeds out. The card sits 16px inside the mouth's width with a keyline on three sides and plays `feed` once on load: 900ms `steps(9)`, revealing top to bottom with `clip-path` while sliding down from -12%.

### Lamps (loading)

Eight 28px keylined squares in a row (`role="status"`). Each steps from `panel` to `a1` and back on a 1.6s `steps(1)` loop, staggered by 0.2s, so the light runs left to right.

### Footer

A band closed by a top keyline: a `.silk` note on the left, a `.link` on the right, wrapping on narrow screens.

### The card (`ArcadeCard`)

The product. Inline-styled, colourway passed as a prop, no classes and no CSS variables, so it renders identically in the export iframe.

- **Header:** 116px square avatar with keyline, player name, `@login` in `onGroundDim`, and an `a1` chip ("Year N on GitHub") with a 3px keyline. On the right, the year window: dark glass, the year in Doto lit in `led` (or `a1`), "GitWrap" beneath.
- **Hazard stripe:** 14px tall, 14px bands of `line` and `a1`, 3px keyline.
- **Score window:** a light window with the total in the largest type on the card, and a row of breakdown chips (14px squares alternating `a1` and `a2`). Private contributions get a Lock icon instead of a chip.
- **Score table:** seven rows on the ground, dotted leaders. Best hour, longest streak and peak day print a dash when there is nothing to report.
- **Language meter:** one 46px keylined bar divided in proportion, inked `a1`, `a2`, `panel` in rank order, with a matching legend. With no data, a single window states that.
- **Top repository window** and **AI block:** the AI block is the one solid `a2` surface on the card, `ink` text, Robot icon.
- **LED matrix:** dark glass, up to 53 week columns of 7 cells, 4px gaps. Unlit cells are glass text at 9% opacity; lit cells are `led` at 50%, 70%, 85% and 100% for activity levels 1–4. Days outside the range are invisible.
- **One-liner window:** PlayerArrow icon and one sentence.
- **Footer:** a nine-square pixel band in the colourway's inks, "incl. private" with a Lock when applicable, and "GitWrap {year}".

## Do's and Don'ts

### Do:
- **Do** take every colour from the active colourway's roles via `var(--ground)`, `var(--a1)` and so on (or `theme.c` on the card). The only fixed colours are the dark glass set: #0B0D17, #F6F4EC, #9AA0B4.
- **Do** set `themeVars(theme)` on the `.gw` wrapper of any new page so the whole page, marquee and footer included, prints in one colourway.
- **Do** make every primary action a `.key`, with `a1` for the one main action on a screen and `.key-plain` for the rest.
- **Do** put `ink` text on `panel`, `a1` and `a2`; put `on-ground` or `on-ground-dim` text on the ground.
- **Do** use `steps()` for every transition and animation, and add anything new to the `prefers-reduced-motion` block at the end of `index.css`.
- **Do** keep targets at 44px or more: keys are 48px, small keys grow to 44px on coarse pointers, swatches are at least 44px.
- **Do** keep the `on-ground` focus ring (3px, 4px offset) visible on anything focusable, and keep selection and focus visually distinct, as the swatches do.
- **Do** style anything on the card inline, at 1080×1440 pixel values, using only Archivo, Martian Mono and Doto.
- **Do** use `tabular-nums` for any figure that changes, and truncate user-supplied strings on the card to one line.

### Don't:
- **Don't** round a corner. `border-radius: 0 !important` is global; do not override it.
- **Don't** use glass effects: no `backdrop-filter`, no blur, no translucent panels, no soft or blurred shadows, no glows.
- **Don't** use eased or spring motion, fades or glides. Motion is stepped, short, and never loops except the loading lamps.
- **Don't** add a colour outside the colourway. A fourth ink, a grey border or a semantic red/green breaks the three-ink print; warnings use `a2`.
- **Don't** use the hazard stripe anywhere but the marquee and the card's header rule.
- **Don't** put a travel edge on something that cannot be pressed.
- **Don't** use Doto for anything but the year on the card, or Martian Mono for running text.
- **Don't** add CSS classes, CSS variables or responsive rules to `ArcadeCard`; the export depends on it being self-contained and fixed-size.
- **Don't** shrink card labels below 18px or add decoration that competes with the figures; the card must stay readable at feed size and must not read as childish.
