# GitWrap Technical Architecture Analysis

## Overview

GitWrap is a web application that compiles a developer's GitHub contributions into an arcade-styled year-in-review card and an interactive 10-slide story recap.

GitWrap 2026 is the direct sequel to the original 2025 release. The 2025 edition established the core concept of generating an arcade card from public GitHub stats, but two major limitations emerged from developer feedback:
1. Developers do their heaviest, most critical engineering inside private repositories for employers, clients, or private startups. A public-only calculation omitted the majority of their real contributions.
2. Developers requested an engaging, interactive recap they could tap through, similar to Spotify Wrapped, before exporting the final image card.

GitWrap 2026 was architected to address both requirements with a serverless backend for secure OAuth session handling, an interactive 10-slide story carousel, six bespoke themes, an interactive hero contribution matrix, and a hardened 1080x1440 browser-side card export engine.

---

## Technology Stack

### Frontend Core & Build Tools
- React 19.2.0: Component rendering and state management.
- TypeScript 5.8.2: End-to-end static typing across client and serverless endpoints.
- Vite 6.2.0: Build system, bundling, and local development server with built-in API proxying.
- React Router DOM 7.9.6: Client-side URL routing (`/` for landing, `/u/:username` for player studio).
- Zod 4.6.7: Runtime schema validation for API responses and payload sanitization.

### Serverless Backend & Security
- Vercel Serverless Functions (`/api`): Node.js serverless execution runtime for all external API queries.
- Node.js Crypto (`crypto`): AES-256-GCM cookie sealing, unsealing, and CSRF token generation.
- Node.js Built-in Fetch: Native HTTP communication with GitHub GraphQL/REST and AI endpoints.

### AI Synthesis & Telemetry
- Google Gemini API (`@google/genai` 1.29.1): Primary provider for dynamic, personalized card one-liners (`gemini-2.5-flash-lite`).
- Groq Cloud API: Secondary / fallback provider (`qwen/qwen3.8-27b`).
- Deterministic Template Engine: High-reliability zero-cost fallback when no API keys are configured or upstream rate limits are reached.

### Typography & Styling
- Pure CSS with CSS Custom Properties (`index.css`): Strict design tokens, zero external UI libraries, zero utility framework overhead.
- Self-Hosted Variable Web Fonts (`public/fonts/`):
  - Archivo (Latin subset, width 62-125%, weight 100-900): Headlines, player names, and body text.
  - Martian Mono (Latin subset, width 75-112.5%, weight 100-800): Telemetry, measurements, and silkscreen labels.
  - Doto (Latin subset, weight 100-900): Dot-matrix year badge on cards, live scoreboard counter in the hero matrix, and Volt Matrix stamped seal.

### Image Generation & Export
- `html-to-image`: DOM-to-PNG rasterization engine executed inside an isolated offscreen iframe.
- Base64 Inlining Pipeline: Pre-inlines avatar images, background textures, and font assets to bypass cross-origin taint and guarantee Safari/iOS compatibility.

### Monitoring & Analytics
- `@vercel/analytics` 1.5.0: Privacy-friendly production telemetry.

---

## Directory Structure & Code Organization

```
gitwrap/
├── api/                             # Serverless API endpoints
│   ├── _lib/                        # Server utilities (GitHub GQL, crypto, AI)
│   │   ├── commitAnalysis.ts        # Commit message verb parsing & local hour detection
│   │   ├── funMessage.ts            # Gemini & Groq one-liner generation
│   │   ├── github.ts                # GitHub GraphQL queries & stat normalization
│   │   └── session.ts               # AES-256-GCM cookie sealing & OAuth helpers
│   ├── auth/                        # OAuth authentication endpoints
│   │   ├── callback.ts              # OAuth code exchange & cookie issuance
│   │   ├── login.ts                 # GitHub OAuth redirection & CSRF state
│   │   ├── logout.ts                # Session teardown
│   │   └── me.ts                    # Session identity verification
│   └── stats.ts                     # Primary wrap compilation endpoint
├── components/                      # React UI components
│   ├── icons/                       # Vector iconography
│   │   ├── Arcade.tsx               # Pixel/arcade icons (arrows, badges, controls)
│   │   ├── LinkedInIcon.tsx         # LinkedIn share glyph
│   │   └── XIcon.tsx                # X / Twitter share glyph
│   ├── ArcadeCard.tsx               # Fixed 1080x1440 card layout (inline styled)
│   ├── Contributors.tsx             # GitHub open-source contributors grid
│   ├── ExportCard.tsx               # Offscreen print wrapper with inlined assets
│   ├── Footer.tsx                   # Page footer with edition metadata
│   ├── FuturisticLoader.tsx         # Radar scanner & micro-segmented telemetry loader
│   ├── GitHubSignIn.tsx             # OAuth sign-in / sign-out button
│   ├── GitWrapCard.tsx              # Responsive preview container with CSS scaling
│   ├── HeroContributionGraph.tsx    # Animated 7x52 matrix spelling "YOUR 2026"
│   ├── HomeFusionBackdrop.tsx       # Ambient CPU circuit pulse backdrop
│   ├── Marquee.tsx                  # Top navigation bar with hazard stripes
│   ├── PlayerAvatar.tsx             # 16-bit virtual pet companion renderer
│   ├── SocialShare.tsx              # One-click native & social sharing controls
│   ├── Stories.tsx                  # 10-slide tap-through interactive recap carousel
│   ├── ThemeBackdrop.tsx            # Bespoke thematic backdrops for cards
│   └── ThemeSelector.tsx            # Six-colourway swatch picker
├── pages/
│   ├── HomePage.tsx                 # Landing hero, username input, interactive matrix
│   └── UserPage.tsx                 # Player studio, recap player, export deck
├── public/                          # Static assets
│   ├── avatars/                     # 16-bit virtual pet companion sprites
│   ├── fonts/                       # Local variable fonts (Archivo, Martian Mono, Doto)
│   └── images/                      # Open Graph graphics and theme banners
├── config.ts                        # Edition date windows and repository coordinates
├── constants.ts                     # Colourway themes, design tokens & export metrics
├── insights.ts                      # Player class archetype scoring logic & metrics
├── playerAvatars.ts                 # 16-bit virtual pet companion mappings
├── types.ts                         # Shared TypeScript types & Zod schemas
└── vite.config.ts                   # Vite configuration with local API proxy
```

---

## Serverless API & Security Model

A primary design constraint in GitWrap 2026 is that the browser never holds elevated GitHub access tokens or AI API keys. All privileged operations execute inside Vercel serverless functions in `/api`.

### Endpoints

1. `GET /api/stats?username=<login>&year=<year>[&private=1]`
   - Public Query (`private` unset): Fetches public contribution data using the server's shared token (`GITHUB_APP_TOKEN`). Edge cached for 1 hour (`s-maxage=3600`).
   - Private Query (`private=1`): Extracts the encrypted session token from the `gw_session` cookie. Validates that the requested username matches the authenticated session user. Fetches combined public and private contribution data. Marked `Cache-Control: private, no-store`.

2. `GET /api/auth/login`
   - Generates an unguessable 32-byte CSRF `state` string.
   - Sets a short-lived `gw_oauth_state` cookie (`HttpOnly`, `SameSite=Lax`, 10-minute TTL).
   - Redirects the user to `https://github.com/login/oauth/authorize` with scopes `read:user` and `repo`.

3. `GET /api/auth/callback`
   - Validates the incoming `state` against the `gw_oauth_state` cookie.
   - Exchanges the temporary OAuth code for a GitHub user access token via GitHub's token endpoint.
   - Fetches the user's login identity to verify ownership.
   - Encrypts the user's access token and login into an AES-256-GCM sealed payload.
   - Sets the `gw_session` cookie (`HttpOnly`, `Secure` in production, `SameSite=Lax`, 8-hour TTL).
   - Redirects to `/u/<username>`.

4. `GET /api/auth/me`
   - Decrypts the session cookie if present.
   - Returns `{ authenticated: boolean, login: string | null, oauthConfigured: boolean }`.

5. `POST /api/auth/logout`
   - Clears the session cookie by setting `Max-Age=0`.

### Security Implementation Details

- AES-256-GCM Cookie Encryption (`api/_lib/session.ts`):
  - Uses a derived 32-byte key from `SESSION_SECRET` via `crypto.createHash('sha256')`.
  - Generates a fresh 12-byte initialization vector (`iv`) for every cookie write.
  - Generates a 16-byte authentication tag (`tag`) preventing tampering.
  - Combines `iv:tag:ciphertext` as a base64url string.
  - Zero database storage: all session state resides in the encrypted cookie, eliminating token database leak risks.
- Read-Only Execution: The application queries GitHub GraphQL contribution collections and commit histories; it performs zero write operations to user repositories.
- Private Repository Protection: Private repository names are masked on public links so proprietary client or employer repository names are never displayed to unauthenticated third parties.

---

## Data Ingestion & Analytics Pipeline

### GitHub GraphQL Integration (`api/_lib/github.ts`)

The serverless query fetches comprehensive telemetry in a single round-trip:
- Primary Window (2026 Edition: Dec 1, 2025 to Nov 30, 2026):
  - `totalCommitContributions`
  - `totalIssueContributions`
  - `totalPullRequestContributions`
  - `totalPullRequestReviewContributions`
  - `contributionCalendar`: daily counts and dates across 52 weeks.
  - `commitContributionsByRepository`: contribution count grouped by repository.
- Comparison Window (Previous year for growth calculation).
- Repository metadata: primary languages, stargazers, fork status.

### Metric Calculations

1. Longest Streak: Traverses the chronological daily calendar to find consecutive days with count > 0.
2. Attendance Rate: Percentage of days in the year with at least one recorded contribution.
3. Commit Verb Parsing (`api/_lib/commitAnalysis.ts`):
   - Inspects commit messages across the user's top active repositories.
   - Matches action verbs against categorized buckets (`fix`, `feat`, `refactor`, `chore`, `docs`, `test`, `style`, `build`, `ci`).
   - Identifies the developer's "signature move" (most frequent opening verb).
4. Local Productive Coding Hours:
   - Evaluates commit author timestamps with ISO-8601 offset parsing to determine the user's real local time.
   - Buckets activity into Morning (06:00-12:00), Afternoon (12:00-18:00), Evening (18:00-24:00), and Night (00:00-06:00).
5. Polyglot Language Distribution:
   - Aggregates bytes and contribution counts across repository languages.
   - Computes percentage distribution and stack balance.

---

## Player Archetype Classification Engine (`insights.ts`)

GitWrap computes 13 deterministic player archetypes based on contribution distributions:

| Archetype | Key Qualification Heuristic | Companion Avatar |
|---|---|---|
| Night Owl | > 35% of commits authored between 00:00 and 06:00 local time | Pixel Cat |
| Early Riser | > 35% of commits authored between 06:00 and 10:00 local time | Pixel Rooster |
| Bug Hunter | > 40% of commit verbs match `fix`, `resolve`, or `patch` | Pixel Hound |
| PR Shipper | PR-to-commit ratio significantly above community average | Pixel Falcon |
| Code Reviewer | Review-to-PR ratio > 1.2; significant review contributions | Pixel Owl |
| Streak Keeper | Longest active streak > 45 consecutive days | Pixel Turtle |
| Marathoner | Total contributions > 1,500; consistent annual attendance | Pixel Horse |
| Polyglot | 4 or more distinct programming languages with > 10% share each | Pixel Chameleon |
| Specialist | Single primary language accounts for > 75% of overall activity | Pixel Beaver |
| Weekend Warrior | > 35% of total annual contributions committed on Saturdays/Sundays | Pixel Wolf |
| Sprinter | Concentrated bursts of extreme quarterly velocity | Pixel Cheetah |
| All-Rounder | Balanced distribution across commits, PRs, reviews, and issues | Pixel Fox |
| New Challenger | Account created within the active tracking year | Pixel Slime |

---

## 10-Slide Interactive Story Mode (`components/Stories.tsx`)

The story recap provides an interactive review modeled after mobile story experiences:
- Touch and Click Navigation: Left side tap navigates backward; right side tap advances forward; long press pauses progress.
- Keyboard Navigation: Arrow Left / Arrow Right step through slides; Space pauses/resumes.
- Synchronized Progress Indicators: Top segmented bars fill smoothly with CSS animations, reacting to pause/resume states.
- Visual Instrumentation:
  - Slide 2: Speedo attendance gauge drawn on an SVG circular track.
  - Slide 3: 52-week micro-mosaic with quarterly activity grouping and Story 3 pop physics.
  - Slide 4: 24-hour combat radar clock plotting 4-quadrant time windows.
  - Slide 5: Segmented momentum capacitor bar tracking streak multipliers.
  - Slide 8: Polyglot language distribution matrix.
  - Slide 10: Archetype reveal with animated 16-bit virtual pet avatar and 3D arcade card feed.

---

## Interactive Hero Contribution Matrix (`components/HeroContributionGraph.tsx`)

The landing page features an interactive 7x52 calendar matrix:
- Spells out `YOUR 2026` across 52 columns and 7 rows using active calendar cells.
- Adds procedural ambient activity noise across empty cells to mimic an authentic GitHub profile.
- Employs Story 3 elastic pop physics (`mosaicPop`) with staggered quarterly entrance delays.
- Provides interactive cell tooltips with commit counts, dates, and quarter tags.
- Features a stamped certification seal (`SCORED.`):
  - Tokyo Riso mode: Red circular Japanese Hanko seal with alignment crop marks.
  - Volt Matrix mode: Cybernetic barcode stamp with hex memory telemetry.

---

## Ambient CPU Circuit Backdrop (`components/HomeFusionBackdrop.tsx`)

A semiconductor-inspired background system on the homepage and wrap studio:
- 0.8px hairline vector micro-traces running on orthogonal 90-degree interconnects.
- Surface-mount pads and junction nodes.
- Moving optical data packets with subtle bloom effects.
- Pre-warmed negative animation delays (`-1.5s`, `-3.2s`, etc.) to eliminate static initial states.

---

## Card Export Pipeline (`components/ExportCard.tsx`)

The arcade card export guarantees high-fidelity rasterization across mobile and desktop:
1. Exact Dimensions: Statically rendered at 1080x1440 pixels.
2. Isolated Export Iframe: An offscreen iframe mounts a fresh React root with identical self-hosted `@font-face` declarations and inline styling.
3. Base64 Asset Pre-Inlining:
   - User avatars are converted to data URLs via Canvas to bypass cross-origin browser security restrictions.
   - Theme backgrounds and pet companion sprites are bundled as local vector/PNG assets.
4. Layout Stabilization & Font Readiness:
   - Waits for `document.fonts.ready`.
   - Uses `requestAnimationFrame` double-flushes to ensure full CSS layout calculation.
5. DOM-to-PNG Generation:
   - `html-to-image.toPng` captures the isolated iframe at pixel ratio 1.
   - Programmatically triggers file download (`gitwrap-<username>-2026.png`).

---

## Theming Engine (`constants.ts`)

GitWrap uses a strict three-ink silkscreen print system:
- Every theme defines:
  - `ground`: Silkscreened base field.
  - `line`: Keylines and 6px physical button travel edges.
  - `ink`: Text on light surfaces (windows, keys, chips).
  - `panel`: Light score window face.
  - `a1`: Primary ink (START button, lit LED calendar cells, headline values).
  - `a2`: Secondary ink (AI block, secondary languages, warning strips).
  - `led`: Optional illuminated color behind dark glass when `a1` contrast is insufficient.
  - `onGround`, `onGroundDim`, `onPanelDim`: Strictly tuned contrast tiers.

### Active 2026 Theme Roster:
1. `artemis`: Lunar Orbit (#040A17 ground, #7CD6FF primary)
2. `fifa`: Matchday '26 (#176840 ground, #F7D154 primary)
3. `gtavi`: Vice Sunset (#6B3B5E ground, #F3937B primary)
4. `doomsday`: Latverian Steel (#121512 ground, #28D443 primary)
5. `maxdark`: Volt Matrix (#0A0B0E ground, #D4FF00 primary)
6. `maxlight`: Tokyo Riso (#F4EFE6 ground, #FF3366 primary)
7. `fusion`: 2026 Fusion (#090B13 ground) — Homepage atmospheric canvas
8. `studio`: Studio Control (#0B0D17 ground) — Dedicated studio command deck chrome

---

## Verification & Build Integrity

- Build Command: `npm run build`
- Type Check: TypeScript 5.8.2 strict mode
- Bundler: Vite 6.2.0 producing clean distribution assets in `dist/`
