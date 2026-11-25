# GitWrap 2026 Themes, Inspirations & Easter Eggs

GitWrap 2026 replaces the legacy 2025 palettes with six bespoke colourways rooted in the cultural, scientific, and engineering milestones of 2026. Rather than treating themes as simple colour swaps, each card carries its own atmospheric identity, SVG backdrop ([`components/ThemeBackdrop.tsx`](components/ThemeBackdrop.tsx)), custom year console, tailored hazard stripe, and hidden Easter eggs inside [`components/ArcadeCard.tsx`](components/ArcadeCard.tsx), while preserving a unified layout and typography system (`Archivo`, `Martian Mono`, `Doto`).

---

## 01. Lunar Orbit (`artemis`)

### 2026 Event & Design Inspiration
Inspired by **NASA's Artemis II mission (April 1–10, 2026 (US dates; splashdown was April 11 UTC))** — the historic ~10-day crewed lunar flyby that sent four astronauts (Commander Reid Wiseman, Pilot Victor Glover, Mission Specialist Christina Koch, and CSA Mission Specialist Jeremy Hansen) around the Moon for the first time since Apollo 17 in 1972.

Visually, the theme draws from classic 1970s/80s NASA flight aesthetics updated with modern sci-fi polish. The complementary cold-blue and amber-gold palette contrasts the sterile, deep-space obsidian blues of the lunar environment against the warm, reflective gold coating of astronauts' EVA helmet visors. Rather than rigid vector lines or hollow outlines, the card pairs a solid cyan `2026` readout inside a deep-space console with smooth feathered luminance gradients, warm right-horizon visor glare, and fine particulate regolith stardust.

### Colour Palette
| Token / Role | Hex | Visual Purpose |
|---|---|---|
| `--space-void` (`ground`, `ink`) | `#040A17` | Deep-space canvas ground and panel text |
| `line` | `#020610` | Capsule keylines and borders |
| `--orbital-navy` (`onPanelDim`) | `#162C4E` | Orbital instrument navy and secondary panel text |
| `--lunar-steel` | `#5078A8` | Deep-space horizon midtone |
| `--electric-cyan` (`a1`, `led`) | `#7CD6FF` | Orion telemetry cyan (LED matrix & primary accents) |
| `--regolith-silver` (`panel`, `onGround`) | `#D8E7F6` | Cool lunar aluminum readout windows & display text |
| `--visor-gold` (`a2`) | `#E59A1A` | Astronaut EVA helmet visor gold |
| `--burnt-ochre` | `#7A460A` | Warm shadow gradient behind visor reflection |
| `onGroundDim` | `#C6E0FB` | High-legibility cyan-tinted labels |

- **Language Meter Inks:** `#7CD6FF`, `#E59A1A`, `#5078A8`, `#D8E7F6`
- **Hazard Stripe:** Diagonal `-45deg` obsidian (`#040A17`) and visor gold (`#E59A1A`) telemetry bands inspired by launchpad ground-support equipment markings.

### Backdrop Craft (`ThemeBackdrop.tsx`)
- Feathered radial deep-space luminance gradient (`artemisLuminanceGlow`) paired with a vertical atmospheric horizon transition.
- Warm radial helmet-visor reflection (`artemisVisorGoldReflect`) positioned along the right horizon.
- High-contrast `feTurbulence` particulate regolith stardust feathered across upper and middle zones.

### Easter Eggs & Hidden Details
- **Header Tag (Left):** `Integrity` — the official spacecraft name selected by the crew for Artemis II's Orion capsule (CM-003).
- **Header Tag (Right):** `ORBIT: LUNAR`
- **Year Monitor Stamp:** `ARTEMIS // II · ORBIT` housed inside a deep-space navy glass module (`#162C4E` -> `#040A17`).
- **Footer Telemetry:** `KSC LC-39B · Δv 10.9 KM/S` — references **Kennedy Space Center Launch Complex 39B** (where the SLS rocket lifted off on April 1, 2026) and a stylized velocity readout. The printed Δv 10.9 KM/S is decorative, not a verified mission delta-v.

---

## 02. Matchday '26 (`fifa`)

### 2026 Event & Design Inspiration
Honors the **FIFA World Cup 2026 (June 11 – July 19, 2026)**, jointly hosted across the United States, Canada, and Mexico and won by Spain at MetLife Stadium.

Initially conceived around three horizontally stacked high-saturation crimson, cobalt, and forest-green bands, the theme was refined during design iteration into a **procedural athletic flow field**. Smoothly blending Crimson Red, Cobalt Blue, and Pitch Forest Green through fluid displacement curves echoes *"la ola"* (the Mexican wave) that also inspired the official **Adidas Trionda** tournament match ball — while replacing rigid stripes with organic motion that stays comfortable on the eyes. Heavy, bold typography is paired with warm championship metallic gold (`--gold-specular` / `--gold-bronze`), a nod to the gold-accented **Trionda Final** ball introduced for the semi-finals and final.

### Colour Palette
| Token / Role | Hex | Visual Purpose |
|---|---|---|
| `--tier-forest` (`ground`) | `#176840` | Pitch forest green |
| `--tier-cobalt` (`line`, `ink`) | `#16468F` | Tournament cobalt blue keylines and panel ink |
| `--tier-crimson` (`a2`) | `#C42B30` | Crimson host-nation accent |
| `--accent-leaf` | `#60B552` | Harmonic pitch green highlight wave |
| `--neutral-white` (`panel`, `onGround`) | `#EAECEF` | Crisp chalk-white negative space & score windows |
| `--gold-specular` (`a1`, `led`, `onGroundDim`) | `#F7D154` | Polished championship metallic gold |
| `--gold-bronze` (`onPanelDim`) | `#8A5A10` | Warm bronze secondary labels |

- **Language Meter Inks:** `#F7D154`, `#60B552`, `#C42B30`, `#16468F`
- **Hazard Stripe:** Diagonal `-45deg` cobalt blue (`#16468F`) and metallic gold (`#F7D154`).
- **Player Class Window Override:** Uses a dedicated tricolor card override so Player Class typography renders in chalk-white (`#EAECEF`) and gold (`#F7D154`) inside the dark cobalt class box.

### Backdrop Craft (`ThemeBackdrop.tsx`)
- Seven-stop diagonal base gradient transitioning seamlessly from Crimson Red (`#C42B30`) through Cobalt Blue (`#16468F`) to Forest Green (`#176840`).
- Layered procedural wave ribbons (`fifaCrimsonRibbon`, `fifaCobaltRibbon`, `fifaForestRibbon`, and a specular gold stream) distorted via an `feTurbulence` displacement warp (`fifaProceduralWarp`) and diffused with Gaussian blur.
- Dashed kinetic spline streamlines, an ambient gold center glow, and subtle photographic texture (`fifaPhotoGrain`).

### Easter Eggs & Hidden Details
- **Header Tag (Left):** `Trionda` — the official FIFA World Cup 2026 match ball manufactured by Adidas, whose connected internal sensor telemetry fed real-time tracking data straight to match officials and VAR.
- **Header Tag (Right):** `MATCH GRADE`
- **Year Monitor Stamp:** `MATCHDAY // '26` above beveled metallic gold `2026` digits with white specular rim highlights.
- **Footer Telemetry:** `VAR: COMMITS VERIFIED · 90'+5` — Video Assistant Referee confirmation stamped at late stoppage time (`90'+5`).

---

## 03. Vice Sunset (`gtavi`)

### 2026 Event & Design Inspiration
Created for the cultural milestone of ***Grand Theft Auto VI***, which officially launched on **November 19, 2026**, returning players to the neon-soaked streets of **Vice City** and the wider Florida-inspired state of **Leonida** alongside protagonists Jason Duval and Lucia Caminos.

Rather than relying on vector palm trees or clip-art silhouettes, the design pulls straight from the humid, golden-hour Florida dusk atmosphere of the game's reveal trailers: seven twilight stops blending palm plum, coastal sky teal, sunset coral, street lavender, and facade cream. Pure gradient and texture work create crepuscular sunburst rays through heat haze and 35mm film grain, while the `2026` year block adopts a **frosted-glass VCR monitor** with horizontal CRT scanlines and warm glowing neon numerals.

### Colour Palette
| Token / Role | Hex | Visual Purpose |
|---|---|---|
| `--palm-plum` (`ground`, `onPanelDim`) | `#6B3B5E` | Humid evening plum sky |
| `line`, `ink` | `#421E38` | Deep burgundy borders and panel text |
| `--facade-cream` (`panel`, `onGround`) | `#FDE0C8` | Golden-hour architectural cream panels |
| `--sunset-coral` (`a1`, `led`) | `#F3937B` | Warm horizon coral neon |
| `--sky-teal` (`a2`) | `#5E8DA8` | Upper twilight sky teal |
| `--sky-mauve` | `#A5769B` | Mid-sky dusk transition |
| `--shadow-periwinkle` | `#8EA2E5` | Cool dusk ray highlight |
| `--street-lavender` | `#A480D4` | Sunburst shaft accent |
| `onGroundDim` | `#F0D6EC` | Soft lavender-cream ground labels |

- **Language Meter Inks:** `#F3937B`, `#5E8DA8`, `#8EA2E5`, `#A480D4`
- **Hazard Stripe:** Smooth horizontal sunset spectrum gradient (`#F3937B` -> `#A480D4` -> `#5E8DA8`) with a warm coral edge glow.

### Backdrop Craft (`ThemeBackdrop.tsx`)
- Seven-stop vertical dusk sky gradient (`viceDuskSky`) layered under an expansive radial horizon sunset glow (`viceHorizonSunGlow`).
- Eleven radiating crepuscular sunburst shafts (`viceRayCoral`, `viceRayLavender`, `viceRayMauve`) pushed through an SVG heat-haze displacement and Gaussian diffusion filter (`viceHeatHaze`).
- Fine 35mm photographic film grain overlay (`viceFilmGrain`) feathered gently into the upper sky.

### Easter Eggs & Hidden Details
- **Header Tag (Left):** `Emotion 98.3` — a Vice City radio homage. The guide does not assert an unverified GTA VI host credit.
- **Header Tag (Right):** `LEONIDA DEPT.` — dispatch stamp referencing the game's Florida-inspired setting.
- **VCR Year Monitor:** Frosted CRT glass box (`backdropFilter: blur(16px)`) overlaid with horizontal scanlines and a top-left `PLAY ▶` status indicator framing neon coral-violet `2026` digits.
- **Footer Telemetry:** `★ WANTED LEVEL 5 · 98.6 FM` — combines a maximum five-star wanted chase alert with a stylized retro FM dial variation (`98.6 FM`).

---

## 04. Latverian Steel (`doomsday`)

### 2026 Event & Design Inspiration
Built around Marvel's ***Avengers: Doomsday*** (directed by Anthony and Joe Russo, scheduled for theatrical release **December 17–18, 2026**), marking **Robert Downey Jr.'s** return to the MCU as **Victor Von Doom / Doctor Doom**.

The design channels a moody dark-emerald and obsidian aesthetic: heavy gunmetal shadows illuminated by backlit chartreuse highlights (`#D5E3A3`) and sharp cloak-emerald (`#28D443`) outer bevels. The `2026` display renders as heavy beveled chrome/gunmetal forged plate with subtle vertical steel scratches. Behind the panels, tall Gothic-meets-Art Deco wrought-iron cathedral lancets and a distressed stained-glass diffuser project an eerie, mystical-industrial fortress atmosphere.

### Colour Palette
| Token / Role | Hex | Visual Purpose |
|---|---|---|
| `--bg-obsidian` (`ground`, `ink`) | `#121512` | Armored obsidian ground and panel text |
| `line` | `#0A0D0A` | Wrought-iron structural keylines |
| `--cloak-pine` | `#243326` | Deep Latverian cloak green shadow |
| `--lattice-moss` (`onPanelDim`) | `#506340` | Distressed lattice and secondary panel labels |
| `--glow-chartreuse` (`panel`, `onGround`) | `#D5E3A3` | Backlit stained-glass chartreuse panels |
| `--accent-emerald` (`a1`, `led`) | `#28D443` | Doom arcane emerald energy |
| `--metal-gunmetal` (`onGroundDim`) | `#8D9694` | Scratched cold gunmetal steel |
| `--badge-crimson` (`a2`) | `#D42329` | Sovereign crimson apex seal accent |

- **Language Meter Inks:** `#28D443`, `#D5E3A3`, `#8D9694`, `#506340`
- **Hazard Stripe:** Diagonal `-45deg` obsidian (`#121512`) and arcane emerald (`#28D443`) bands with emerald glow.

### Backdrop Craft (`ThemeBackdrop.tsx`)
- Distressed stained-glass noise diffuser (`doomGrungeGlass`) overlaid with wrought-iron Gothic lancet arches (`M 280 1440 ... Q 540 32`) and vertical Art Deco mullions.
- Diamond lead-came wrought-iron lattice (`doomLatticePattern`) stretching edge to edge.
- Central radiating Gothic rosette / Art Deco iron medallion (`(540, 240)`) with 16 radiating spokes and a crimson core.
- Stepped Art Deco corner iron brackets and sovereign crimson insignia dots (`#D42329`) crowning the lancet arches.

### Easter Eggs & Hidden Details
- **Header Tag (Left):** `Earth-616` — prime Marvel continuity designation.
- **Header Tag (Right):** `REX LATVERIAE` — Latin royal title ("King of Latveria").
- **Forged Chrome Year Console:** Scratched vertical steel lines framing `LATVERIA // STEEL` and beveled iridescent chrome `2026` numerals lit with an emerald bevel halo.
- **Footer Telemetry:** `ᛝ BY ROYAL DECREE · VON DOOM ᛝ` — sovereign proclamation framed in runic symbols.

---

## 05. Volt Matrix (`maxdark`)

### 2026 Event & Design Inspiration
Originally created as part of a tactile **Maximalist** exploration before evolving into a permanent fixture of the core theme roster. Volt Matrix is an unfiltered dark-mode tribute to logic analyzers, hardware debuggers, oscilloscope diagnostics, and late-night production overclocking — matte chassis black struck with high-voltage neon volt yellow, thermal alert orange, and hard unblurred `5px` brutalist black drop shadows.

### Colour Palette
| Token / Role | Hex | Visual Purpose |
|---|---|---|
| `ground` | `#0A0B0E` | Matte hardware chassis black |
| `line` | `#000000` | Pure black borders and `5px 5px 0 0` brutalist drop shadows |
| `ink` | `#050608` | Jet-black ink on white/volt surfaces |
| `panel` | `#EEEEEE` | Clean diagnostic paper grey |
| `a1` / `led` | `#D4FF00` | High-voltage neon volt yellow |
| `a2` | `#FF5500` | Thermal alert orange |
| `onGround` | `#FFFFFF` | Pure white display typography |
| `onGroundDim` | `#9CA3AF` | Diagnostic grey labels |
| `onPanelDim` | `#4B5563` | Muted slate secondary panel labels |

- **Language Meter Inks:** `#D4FF00`, `#FF5500`, `#8A8E9A`, `#EEEEEE`
- **Hazard Stripe:** Heavy 16px `-45deg` black (`#000000`) and volt yellow (`#D4FF00`) industrial caution striping.

### Backdrop Craft (`ThemeBackdrop.tsx`)
- 28px micro-dot calibration matrix (`voltMatrixGrid`) spanning the canvas.
- Continuous oscilloscope frequency waveform vector along the lower band (`M 120 1120 ... L 960 1120`).
- Engineering corner crosshairs and seven vertical millimeter edge ticks down both left and right borders.

### Easter Eggs & Hidden Details
- **Header Tag (Left):** `DEV TELEMETRY`
- **Header Tag (Right):** `1080×1440.DP` — prints the card's exact export pixel dimensions right on the sheet.
- **Vector Barcode Stamp (Top-Right):** Machine barcode bars stamped `2026-RAW-OVERCLOCK`.
- **Left-Margin Hex Memory Stream:** Rotated vertical memory dump:
  - `0x7E01_SYS_BOOT`
  - `0xB420_CONTRIB_OK`
  - `0xCAFE_VMM_READY`
  - `0xDEAD_NULL_CATCH`
  - `0xBEEF_STACK_SAFE`
  - `0x2026_MATRIX_RAW`
  - `0x00FF_OVERCLOCK`
- **Footer Telemetry:** `HEX: 0x7EA · NO SEGFAULTS` — `0x7EA` is 2026 in hexadecimal (7×256 + 14×16 + 10). Earlier builds printed `0x7E0`, which is 2016.

---

## 06. Tokyo Riso (`maxlight`)

### 2026 Event & Design Inspiration
The daylight counterpart to Volt Matrix from the tactile **Maximalist** design study — blending Japanese independent risograph print studios with Swiss International Typographic grids. Soy-based fluorescent coral (`#FF3366`) and soy yellow (`#FFD600`) inks sit over warm archival washi paper (`#F4EFE6`), grounded by deep Prussian print blue (`#0B1B61`) keylines and hard `5px` offset shadows.

### Colour Palette
| Token / Role | Hex | Visual Purpose |
|---|---|---|
| `ground` | `#F4EFE6` | Warm archival washi paper |
| `line` | `#0B1B61` | Deep Prussian print blue borders and `5px 5px 0 0` shadows |
| `ink` | `#0B1B61` | Prussian blue typography ink |
| `panel` | `#FFFFFF` | Bright stock paper score windows |
| `a1` / `led` | `#FF3366` | Fluorescent coral riso ink |
| `a2` | `#FFD600` | Soy yellow riso ink |
| `onGround` | `#0B1B61` | Prussian blue body/heading ink |
| `onGroundDim` | `#586AA3` | Indigo editorial metadata labels |
| `onPanelDim` | `#586AA3` | Indigo secondary panel labels |

- **Language Meter Inks:** `#FF3366`, `#FFD600`, `#FFD600`, `#FFFFFF`
- **Hazard Stripe:** 4-band CMYK-style registration ribbon (`#FF3366` 25%, `#FFD600` 25%, `#00D2FF` 25%, `#0B1B61` 25%).
- **Year Window:** Deep Prussian blue (`#0B1B61`) container with fluorescent coral (`#FF3366`) Doto digits.

### Backdrop Craft (`ThemeBackdrop.tsx`)
- 14px micro halftone screen dot pattern (`risoHalftoneScreen`).
- Swiss printer corner crop marks at all four corners (`(10, 20)` to `(1070, 1420)`).
- Top-center alignment registration crosshair circle at `(540, 38)`.
- Four-color CMYK density calibration patches (`#00D2FF`, `#FF3366`, `#FFD600`, `#0B1B61`) centered at the top trim.

### Easter Eggs & Hidden Details
- **Header Tag (Left):** `ARCHIVAL PRESS ISSUE NO. 01`
- **Header Tag (Right):** `TOKYO PRESS`
- **Japanese Editorial ISBN Barcode (Top-Right):** Vector barcode labeled:
  - `ISBN 978-4-00-2026-1`
  - `雑誌 082026-12 定価 2026円` (Magazine Issue 08-2026, List Price ¥2026)
- **Slanted Red Rubber Hanko Stamp (Bottom-Left):** Tilted `-6deg` dashed red inspection box reading:
  - `初版限定 · 2026` (Limited First Edition · 2026)
  - `検印 / TOKYO RISO ARCHIVE` (Inspection Seal / Tokyo Riso Archive)
- **Footer Telemetry:** `検印 · TOKYO RISO NO. 0026`

---

## Atmospheric Shell Palettes (Site Chrome)

In addition to the six card themes, `constants.ts` defines two full-viewport chrome palettes so the website navigation, backdrops, and controls stay visually cohesive regardless of which card theme is active:

- **2026 Fusion (`fusion`, `HOME_FUSION_THEME`):** Ground `#090B13` harmonizing accents from all six editions (`#FFD21F`, `#FF2A85`, `#00E5FF`, `#28D443`, `#FF3366`). Used on `/` alongside the ambient 0.8px CPU circuit pulse backdrop (`HomeFusionBackdrop.tsx`).
- **Studio Control (`studio`, `USER_STUDIO_THEME`):** Ground `#0B0D17` with obsidian command-room panels (`#19191F`), used on `/u/:username` and the loading HUD.

---

## Homepage Hero Contribution Matrix Seal

On the landing page (`pages/HomePage.tsx`), the interactive 7x52 `YOUR 2026` matrix ([`components/HeroContributionGraph.tsx`](components/HeroContributionGraph.tsx)) features a clickable `SCORED.` certification stamp that toggles live between the two maximalist tributes:

1. **Tokyo Riso Stamp (Default):**
   - Header: `検印` + `TOKYO RISO ARCHIVE`
   - Title: `SCORED.`
   - Footer Barcode: `ISBN 978-4-00-2026`
2. **Volt Matrix Stamp (Click to toggle):**
   - Header: `[ + ]` + `0x7E01 // TELEMETRY`
   - Title: `SCORED.`
   - Footer Barcode: `0x2026_RECORD_OK`


## Theme guide (`/themes`) — fact check, November 25, 2026

The public `/themes` page (`pages/ThemesPage.tsx`, content in `themeGuide.ts`) renders the real card with fictional demo data, orders the themes by when their moment happened in 2026, and lets visitors spotlight each easter egg on the card (via `data-egg` attributes in `ArcadeCard.tsx` / `ThemeBackdrop.tsx`).

- **Volt Matrix · ENIAC at 80 (Feb 2026):** Penn celebrated 80 years since ENIAC's 1946 unveiling (40 panels, 17,000+ vacuum tubes; Eckert & Mauchly). Volt Matrix began as a maximalist study; ENIAC is its 2026 connection. [Penn Today](https://penntoday.upenn.edu/news/penns-eniac-worlds-first-electronic-computer-turns-80)
- **Lunar Orbit · Artemis II (Apr 1–10):** Launched from LC-39B on April 1; record 252,756 mi from Earth (beating Apollo 13); splashdown 5:07 p.m. PDT April 10 (April 11 UTC). *Integrity* confirmed. "ORBIT" is shorthand for a flyby; the Δv readout is decorative. [NASA](https://www.nasa.gov/news-release/nasa-welcomes-record-setting-artemis-ii-moonfarers-back-to-earth/)
- **Matchday '26 · World Cup (Jun 11–Jul 19):** 48 teams, 16 host cities. Spain beat Argentina 1–0 a.e.t. at MetLife Stadium (Ferran Torres, 106'). Trionda's red/green/blue panels represent the three hosts; the gold Trionda Final ball was used from the semi-finals. The VAR footer is a GitWrap joke. [NPR](https://www.npr.org/2026/07/19/nx-s1-5899071/spain-2026-world-cup-champion) · [FIFA](https://inside.fifa.com/en/news/final-four-world-cup-2026-matches-trionda-official-match-ball)
- **Tokyo Riso · RISO at 80 (Sep 2026):** Founded September 2, 1946 in Tokyo as Riso-sha ("riso" = ideal); first Risograph 1980. The ISBN uses Japan's real 978-4 prefix but is otherwise fictional. [RISO](https://www.riso.co.jp/english/80th/index.html)
- **Vice Sunset · GTA VI (Nov 19):** Launched on PS5 and Xbox Series X|S; Take-Two estimated $3.79B day-one sales. **Emotion 98.3 was not among the six stations Rockstar showcased pre-launch** (Cocoteo FM, Back Country Radio, AfroBank FM, The Chamber 106.6, Flash FM, Dirty South Classics), so the guide presents it as a homage to 2002's *Vice City*. 98.6 FM is fictional. [Rockstar](https://www.rockstargames.com/VI/out-now)
- **Latverian Steel · Avengers: Doomsday (Dec 18):** Scheduled US release, still upcoming as of this check; the page shows a "Coming soon" badge until the date passes. Russo brothers directing; Robert Downey Jr. as Victor von Doom. [TechRadar](https://www.techradar.com/streaming/entertainment/marvels-avengers-doomsday-hub)
