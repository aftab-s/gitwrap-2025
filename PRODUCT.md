# Product: GitWrap

## Platform

Web application (mobile-first responsive SPA with desktop studio mode).

## Target Users

Developers with a GitHub account at the end of the year who want a meaningful recap of their engineering journey to share across LinkedIn, X, or developer communities. Many visit on mobile from shared links; they expect fast results and a high-fidelity image export.

## Product Narrative: The 2026 Sequel

GitWrap 2025 launched as an arcade-inspired year-in-review card generator for public GitHub activity. Developer feedback on the 2025 edition highlighted two critical gaps:

1. Private Contributions: Most developers perform their primary work inside private repositories for employers, clients, or proprietary startups. Public-only counting left their cards incomplete.
2. Spotify-Style Story Recap: Static summary cards are useful for sharing, but developers wanted an engaging, interactive recap they could tap through to experience their milestones before exporting.

GitWrap 2026 is the direct sequel built to answer both requests while introducing a new aesthetic standard and richer developer telemetry.

## Positioning & Core Capabilities

1. Private Contributions via GitHub Sign-In:
   - Users can authenticate with GitHub via read-only OAuth to include private repository contributions (commits, pull requests, issues, reviews).
   - Session tokens are encrypted in AES-256-GCM HttpOnly cookies and never written to a database.
   - Private repository names are masked on public links so proprietary project names remain confidential.

2. 10-Slide Tap-Through Story Mode:
   - A full interactive recap (Spotify Wrapped format) preceding the card deck.
   - Tracks attendance consistency, 52-week activity mosaics, 24-hour combat radar clocks, streak capacitors, PR shipping cadence, polyglot language balance, and 16-bit companion reveals.

3. Six Bespoke 2026 Colourways:
   - Matchday '26 (fifa): World Cup 2026 procedural fluid flow fields and stadium tricolor.
   - Lunar Orbit (artemis): NASA Artemis II translunar trajectories and lunar slate cartography.
   - Vice Sunset (gtavi): GTA VI neon dusk, crepuscular rays, and humid photographic grain.
   - Latverian Steel (doomsday): Avengers Doomsday alchemy summoning rings and gunmetal armor.
   - Volt Matrix (maxdark): Maximalist high-voltage yellow terminal, cybernetic traces, and barcode stamps.
   - Tokyo Riso (maxlight): Japanese ISBN barcodes, red Hanko inspection seals, halftone riso grain, and Swiss crop marks.

4. Interactive Hero Contribution Graph:
   - 7x52 contribution matrix spelling "YOUR 2026" with Story 3 pop physics and cell commit tooltips.
   - Tactile stamped certification seal (SCORED.) toggleable between Tokyo Riso Hanko and Volt Matrix telemetry.

5. Ambient CPU Circuit Pulse Backdrop:
   - Hairline 0.8px semiconductor traces with traveling optical pulses across the homepage and studio canvas.

6. Deterministic Archetypes & 16-Bit Companions:
   - 13 distinct player classes computed from contribution ratios and commit verb analysis, paired with pixel-art virtual pets.

7. High-Fidelity 1080x1440 Card Export:
   - Browser-based DOM rasterization via html-to-image in an isolated iframe.
   - Base64 pre-inlined assets and self-hosted fonts ensuring crisp exports across mobile Safari and desktop browsers.

## Operating Constraints

- Real data only: all telemetry originates from GitHub GraphQL and REST endpoints.
- Zero client secrets: all OAuth transactions and AI synthesis run through serverless functions in /api.
- Clean typography and instant readability: stats must remain legible when cards are scaled down in social feeds.
- Square corners everywhere: arcade control panel aesthetic strictly enforced (border-radius: 0 !important).

## Product Principles

1. The card is the artifact, but the story is the journey: the recap delivers insight; the exported card preserves it.
2. Respect developer privacy: private contributions count toward totals, but repository names never leak without explicit consent.
3. Authentic numbers: player classes and metrics are mathematically determined from GitHub telemetry, never randomized.
4. Minimal friction: public lookups require only a username; private lookups require a single OAuth sign-in.
