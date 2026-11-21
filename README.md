<div align="center">
  <img alt="GitWrap 2026 Banner" src="public/images/banner-image.png" style="width:100%;max-width:1000px;border-radius:8px;box-shadow:0 8px 30px rgba(2,6,23,0.3)" />

  <p style="margin-top:16px;font-size:18px;font-weight:600;">Showcase your 2026 GitHub contributions with a polished, arcade-inspired year-in-review card — themeable, responsive, and ready to share.</p>
</div>

# GitWrap 2026

> Create a high-fidelity, arcade-crafted year-in-review card for your GitHub contributions and share it with your network.

---

## ✨ Features & Highlights

- **📊 Comprehensive Personal Telemetry:** Commits, Pull Requests, Issues, Code Reviews, streaks, and top 4 languages aggregated into a single cohesive control deck.
- **🎨 Six Bespoke 2026 Colourways:**
  - **Matchday '26** — Pitch chalk stripes, tactical 4-3-3 formation, and gold stars inspired by World Cup 2026.
  - **Lunar Orbit** — Translunar trajectory vectors and celestial cartography inspired by NASA Artemis II.
  - **Vice Sunset** — Neon coastal dusk gradients and palm silhouettes inspired by GTA VI.
  - **Latverian Steel** — Mystic alchemy summoning circles and runic columns inspired by Avengers Doomsday.
  - **Volt Matrix** — Cybernetic circuit traces, neon yellow terminals, and hex debug telemetry.
  - **Tokyo Riso** — Japanese ISBN barcodes, red Hanko inspection seals, and Swiss editorial crop marks.
- **🕹️ Multi-Theme Story Recap:** Before the card, an interactive tap-through storyline that takes you through your season score, attendance speedo gauge, 24-hour combat radar, streak multipliers, and earned player class.
- **👾 Player Class & Signature Moves:** An archetype earned from your own numbers (Night Owl, PR Shipper, Code Reviewer, Polyglot, etc.) paired with an 8-bit companion pet and the verb that opens most of your commit messages.
- **🔒 Private Contributions:** Sign in with GitHub to count commits from private repositories. Private repository names remain masked on the exported card unless you explicitly opt in.
- **⚡ Cybernetic Loading HUD:** Animated concentric radar scanner and micro-segmented energy meter tracking real-time API telemetry during data compilation.
- **📱 Native Apple Device & Safari Compatibility:** Complete Base64 pre-inlined asset pipeline, explicit `<base>` resolution in offscreen export iframes, and rasterizer warm-up passes ensuring 100% reliable 1080×1440 PNG downloads on iOS and macOS Safari.
- **🤖 Dual-Provider AI One-Liners:** Google Gemini (primary) with automatic fallback to Groq or deterministic templates to synthesize a punchy, single-sentence summary on the card.
- **👥 Open Source Community Shelf:** Built for developers by the community, featuring live contributor grid hydration.

---

## 📅 The 2026 Edition

GitWrap 2026 covers contributions logged across **Dec 1, 2025 → Nov 30, 2026**.
- `/` is the landing page and username dispatcher.
- `/u/<username>` is the dedicated player studio and export deck.

All edition windows, year constants, and repository links are centrally configured in [`config.ts`](config.ts).

---

## 🔐 Architecture & Security

The browser client never holds any elevated GitHub credentials or AI API keys. Serverless functions in [`api/`](api) handle all upstream communication with the GitHub GraphQL API, Gemini, and Groq:

| Endpoint | Method | Purpose | Caching Strategy |
|---|---|---|---|
| `/api/stats?username=&year=` | `GET` | Public wrap data fetched using server's shared token. | CDN edge cached for 1 hour (`s-maxage=3600`). |
| `/api/stats?username=&year=&private=1` | `GET` | Private wrap data fetched using the authenticated owner's token. | Strictly private (`no-store`), rejected unless session matches. |
| `/api/auth/login` | `GET` | Initiates the GitHub OAuth authorization code flow. | No cache. |
| `/api/auth/callback` | `GET` | Validates CSRF `state`, exchanges code for token, sets encrypted cookie. | No cache, redirects to `/u/<login>`. |
| `/api/auth/me` | `GET` | Returns authenticated user's login and OAuth availability. | Session-checked. |
| `/api/auth/logout` | `POST` | Clears the session cookie and signs the user out. | No cache. |

### Security Guarantees:
- **Zero Client-Side Secrets:** No environment variables use the `VITE_` prefix, preventing sensitive tokens from being bundled into client JavaScript.
- **AES-256-GCM Session Encryption:** The user's OAuth access token is stored strictly inside an AES-256-GCM sealed, `HttpOnly`, `Secure`, `SameSite=Lax` cookie with an 8-hour TTL.
- **Minimal Scopes:** Requests `read:user` and `repo` (required by GitHub OAuth to read commit contribution counts in private repositories). The server issues read-only GraphQL queries and never performs write operations.
- **Private View Isolation:** The private contribution view is only visible to the signed-in repository owner. Shared links or third-party visitors always receive the sanitized public view.

---

## 🚀 Quick Start (Development)

### 1. Clone the repository
```bash
git clone https://github.com/aftab-s/gitwrap.git
cd gitwrap
```

### 2. Install dependencies
```bash
npm install
# or
pnpm install
```

### 3. Configure environment variables
Copy the example environment configuration to `.env.local`:
```bash
# On Linux / macOS:
cp .env.example .env.local

# On Windows (PowerShell):
copy .env.example .env.local
```
Fill in at least `GITHUB_APP_TOKEN` (a classic GitHub Personal Access Token with **no scopes**).

### 4. Run the local development server
```bash
npm run dev
# or
pnpm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

> **Note:** The Vite dev server includes a built-in API proxy plugin (see [`vite.config.ts`](vite.config.ts)) that executes the `/api` serverless endpoints locally without requiring the Vercel CLI.

---

## ⚙️ Environment Variables Reference

Configure these in `.env.local` for local development and under **Vercel → Project Settings → Environment Variables** for production deployments:

| Variable | Required | Description |
|---|---|---|
| `GITHUB_APP_TOKEN` | **Yes** | Shared GitHub Personal Access Token (classic PAT, **0 scopes needed**) for public lookups (5,000 req/hr). |
| `GITHUB_CLIENT_ID` | Optional | GitHub OAuth App Client ID (enables user sign-in & private contribution counting). |
| `GITHUB_CLIENT_SECRET` | Optional | GitHub OAuth App Client Secret. |
| `SESSION_SECRET` | Optional | Random 32+ character string used to encrypt session cookies via AES-256-GCM. |
| `GEMINI_API_KEY` | Optional | Google Gemini API key for personalized AI one-liner summaries. |
| `GEMINI_MODEL` | Optional | Model identifier (defaults to `gemini-2.5-flash-lite`). |
| `GROQ_API_KEY` | Optional | Groq API key (used as alternative or fallback AI provider). |
| `GROQ_MODEL` | Optional | Model identifier for Groq (defaults to `qwen/qwen3.8-27b`). |
| `APP_URL` | Optional | Public origin override for OAuth callback redirect (auto-detected by default). |
| `VITE_GITHUB_REPOSITORY`| Optional | Target repository for community contributors widget (defaults to `aftab-s/gitwrap-2026`). |

Generate a secure `SESSION_SECRET` quickly with:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```

---

## 🔑 GitHub OAuth Setup Guide (Sign-In)

To enable private repository contributions:
1. Navigate to **GitHub → Settings → Developer settings → OAuth Apps → [New OAuth App](https://github.com/settings/applications/new)**.
2. Fill in the details:
   - **Application name:** `GitWrap 2026`
   - **Homepage URL:** `http://localhost:3000` (or your live domain)
   - **Authorization callback URL:** `http://localhost:3000/api/auth/callback` (or `https://your-domain.com/api/auth/callback`)
3. Click **Register application**.
4. Copy the **Client ID**, generate a **Client Secret**, and paste them into your `.env.local` alongside a generated `SESSION_SECRET`.

---

## 📁 Project Structure

```
gitwrap-2026/
├── api/                        # Vercel Serverless Functions
│   ├── _lib/                   # Server-only utilities (GitHub GQL, session crypto, AI)
│   │   ├── commitAnalysis.ts   # Commit message verb parsing & local hour detection
│   │   ├── funMessage.ts       # Gemini & Groq one-liner generation
│   │   ├── github.ts           # GitHub GraphQL queries & stat normalization
│   │   └── session.ts          # AES-256-GCM cookie sealing & OAuth helpers
│   ├── auth/                   # Authentication endpoints (/login, /callback, /me, /logout)
│   └── stats.ts                # Main wrap aggregation API endpoint
├── components/                 # React UI Components
│   ├── icons/                  # Arcade icons, GitHub, X, and LinkedIn vectors
│   ├── ArcadeCard.tsx          # Master 1080×1440 arcade card canvas
│   ├── ExportCard.tsx          # Offscreen print wrapper with inlined assets
│   ├── FuturisticLoader.tsx    # Cybernetic HUD radar & telemetry loader
│   ├── GitWrapCard.tsx         # Responsive auto-scaling preview container
│   ├── Marquee.tsx             # Floating glassmorphism navigation bar
│   ├── Stories.tsx             # Tap-through interactive recap carousel
│   ├── StoryThemeBackdrop.tsx  # Dynamic vector backdrops for stories
│   ├── ThemeBackdrop.tsx       # Bespoke thematic backdrops for cards
│   └── ThemeSelector.tsx       # Six-colourway swatch picker
├── pages/
│   ├── HomePage.tsx            # Landing page with hero dispatcher & fusion backdrop
│   └── UserPage.tsx            # Studio command deck, card preview & download controls
├── public/                     # Static assets (fonts, virtual pet avatars, theme graphics)
├── config.ts                   # Edition definitions & repository metadata
├── constants.ts                # Colourway themes & design tokens
├── insights.ts                 # Player class archetype scoring logic
├── playerAvatars.ts            # 16-bit virtual pet companion mappings
└── types.ts                    # TypeScript types & Zod schemas
```

---

## 🤝 Contributing

Contributions are always welcome! Whether reporting a bug, improving responsive styles, or adding features:
1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes (`git commit -m 'feat: add amazing feature'`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.

---

## 👥 Contributors

<a href="https://github.com/aftab-s/gitwrap-2026/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=aftab-s/gitwrap-2026" alt="Contributors" />
</a>

---

<div align="center">
  <p>Crafted with pride for developers around the world. Happy wrapping! 🎁</p>
</div>
