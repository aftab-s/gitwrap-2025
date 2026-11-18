# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Developers with a GitHub account, at the end of the year, who want a recap of their activity to post on LinkedIn or X. They arrive from someone else's shared card, type a username (or sign in), and expect a finished card within seconds. Many view on a phone; the card is downloaded as an image.

## Product Purpose

GitWrap turns a GitHub username into a shareable year-in-review card. Success means the card gets downloaded and shared. The on-screen recap exists to serve the card.

## Positioning

- Private contributions are included only when the profile's owner signs in with GitHub; a shared link always shows the public view.
- A tap-through recap (stories) plays before the card.
- A "player class" earned from the user's own numbers, and a "signature move" (the verb that opens most of their commits).
- One URL per year: `/2025`, `/2026`.

## Operating Context

- Flow: landing page (username field, optional sign-in) → loading → recap stories → wrap page (card, customise, download, share).
- The card is exported as a 1080×1440 PNG and viewed mostly inside social feeds at small sizes.
- Open source; hosted on Vercel.

## Capabilities and Constraints

- Card stats: total contributions (commits, PRs, issues, reviews, private when signed in), best hour, reviews, stars earned, top three languages, streak, peak day, repositories, year-over-year growth, top repository, player class, contribution heatmap, one generated sentence.
- Card options: colourway, show/hide private repository names.
- Styling is plain CSS (`index.css`); the card is inline-styled at 1080×1440. The export renders the same card component in an iframe and rasterises it with html-to-image, so fonts used on the card must be self-hosted.
- No secrets in the browser; all GitHub and Gemini calls run in `/api`.

## Brand Commitments

- Name: GitWrap, followed by the year.
- User-pinned look for the 2026 revamp: tactile maximalist, arcade style, minimal yet funky; no glass, no rounded corners.
- The previous six card themes are retired; a new set of colourways replaces them.
- Must not read as childish, and stats must stay easy to read at a glance.

## Evidence on Hand

- Real data only: every number on a card comes from the GitHub API for that user.
- No testimonials, usage counts, or press exist; none may be invented.
- Assets: `public/images/banner-image.png` (shows the old look), self-hosted Archivo, Martian Mono and Doto in `public/fonts/`.

## Product Principles

1. The card is the product; every screen exists to get someone to a card worth posting.
2. Numbers are honest: private data needs the owner's sign-in, and the player class is computed, never random.
3. Legible first: a stat must read in one glance at feed size.
4. Seconds, not steps: one field, one button, a card.
