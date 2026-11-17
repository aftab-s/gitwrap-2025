<div align="center">
  <img alt="GitWrap 2026 Banner" src="public/images/banner-image.png" style="width:100%;max-width:1000px;border-radius:8px;box-shadow:0 8px 30px rgba(2,6,23,0.3)" />

  <p style="margin-top:12px;font-size:18px;">Showcase your 2026 GitHub contributions with a polished, customizable year-in-review card - themeable, concise, and ready to share.</p>
</div>

# GitWrap 2026

> Create a polished year-in-review card for your GitHub contributions and share it with your network.

## ✨ Highlights

- **Personalized Stats:** Commits, PRs, Issues, and Reviews aggregated into one card.
- **🔒 Private contributions (new):** Sign in with GitHub to include work from private repositories. Private repo names are hidden on the card unless you opt in.
- **🤖 AI co-authored stat (new, optional):** What share of your commits carry an AI co-author signature (Claude Code, Copilot, Cursor, Codex, Gemini/Jules, Aider, Devin, Windsurf, Amazon Q, Junie), with a per-tool breakdown.
- **Multiple Themes** and a **shareable 1080×1440 PNG export**.
- **AI (Text Only):** Gemini writes the one-liner on the card (falls back to a template).

## 📅 Editions: one URL per year

| URL | Shows |
|---|---|
| `/2025` | GitWrap 2025 (Dec 1 2024 → Dec 1 2025, the original window) |
| `/2026` | GitWrap 2026 (Dec 1 2025 → Nov 30 2026) |
| `/2025/u/<name>`, `/2026/u/<name>` | That user's wrap for that year |
| `/`, unknown years, old `/u/<name>` links | Redirect to the current edition (`/2026`) |

Editions live in [`config.ts`](config.ts). To add 2027, add one entry to `EDITIONS` (and bump `DEFAULT_YEAR` when it should become the landing page). Signing in returns you to the edition you started from.

## 🔐 Architecture & security

The browser never holds an API token. A handful of Vercel serverless functions in [`api/`](api) do all the talking to GitHub and Gemini:

| Endpoint | What it does |
|---|---|
| `GET /api/stats?username=&year=` | Public wrap, fetched with the server's `GITHUB_APP_TOKEN`. CDN-cached for an hour. |
| `GET /api/stats?username=&year=&private=1` | The signed-in owner's wrap incl. private repos, fetched with *their* token. Never cached. Rejected unless the session belongs to that username. |
| `GET /api/auth/login` → `GET /api/auth/callback` | Standard GitHub OAuth web flow with a `state` check. The code → token exchange uses the client secret server-side. |
| `GET /api/auth/me`, `POST /api/auth/logout` | Who is signed in (login only) / sign out. |

- **No secrets in the bundle.** No environment variable is `VITE_`-prefixed, so nothing is compiled into client JavaScript.
- **The user's GitHub token is never exposed to the page.** It is stored only in an AES-256-GCM-encrypted, `HttpOnly`, `Secure`, `SameSite=Lax` cookie (8-hour lifetime) that only the `/api` functions can decrypt.
- **Scopes:** `read:user` and `repo`. GitHub OAuth Apps have no read-only scope for private repositories; the server only ever sends read queries.
- The private view is shown **only to the signed-in owner**. A shared link always shows the public view, and private repository names are hidden on the card unless the owner opts in.
- **Organization repos:** if an org restricts third-party OAuth app access, its private repos stay invisible until an org owner approves the app.

## 🚀 Quick Start (Development)

```powershell
git clone https://github.com/aftab-s/gitwrap-2026.git
cd gitwrap-2026
npm install
copy .env.example .env.local   # then fill it in
npm run dev                    # http://localhost:3000  (frontend + /api on one port)
```

`npm run dev` serves the `/api` functions through a small Vite plugin (see [`vite.config.ts`](vite.config.ts)), so the Vercel CLI isn't needed locally.

### Environment variables

Set these in `.env.local` for development and in **Vercel → Project → Settings → Environment Variables** for production.

| Variable | Required | Purpose |
|---|---|---|
| `GITHUB_APP_TOKEN` | Yes | Token for public lookups. A classic PAT with **no scopes** is enough. |
| `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` | For sign-in | Your GitHub OAuth App's credentials. |
| `SESSION_SECRET` | For sign-in | Random 32+ character string that encrypts the session cookie. `node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"` |
| `GEMINI_API_KEY` | No | Gemini one-liner on the card (falls back to a template). `GEMINI_MODEL` overrides the model. |
| `APP_URL` | No | Force the public origin used for the OAuth redirect (auto-detected by default). |

Sign-in UI appears only when all three sign-in variables are set; without them the app works in public-only mode.

### GitHub sign-in setup (2 minutes)

1. GitHub → *Settings* → *Developer settings* → *OAuth Apps* → **New OAuth App**.
2. *Homepage URL*: your site. *Authorization callback URL*: `<your site>/api/auth/callback`.
3. Copy the **Client ID**, generate a **Client secret**, and set them with a `SESSION_SECRET` as above.

An OAuth App allows one callback URL, so create a second app for local development with the callback `http://localhost:3000/api/auth/callback`.

## 🤖 How the AI co-authored stat works

[`api/_lib/commitAnalysis.ts`](api/_lib/commitAnalysis.ts) reads your non-merge commits on the default branch of your most-active repositories in the wrap window (public view: top 8 repos × 100 commits; signed in: top 30 repos × 500 commits) and looks for the signatures AI tools leave in commit messages, mainly `Co-authored-by:` trailers.

- **Headline:** % of commits with an AI signature. Also reported: % of added lines (per-commit additions capped at 2,000 so lockfiles don't skew it) and a per-tool breakdown.
- **It's a lower bound.** Inline autocomplete and code pasted from a chat window leave no trace in git, and squash merges can drop trailers. The UI says so.
- Rules are deliberately specific (e.g. `Claude` only matches `@anthropic.com` / `Claude Code|Opus|Sonnet…`), so a human co-author named Claude isn't counted.
- Users can hide the stat on the card with the *Show AI co-authored stat* toggle.

The same commit scan supplies real commit timestamps for **Best Hour**. It replaces the 2025 search-API call, which hit secondary rate limits.

## 🧩 Project Structure

- `config.ts` — editions (years + date ranges), repo URL (shared by client and server)
- `pages/`, `components/` — React UI: home, user page, card layouts, sign-in button, AI stats panel
- `services/api.ts`, `services/auth.ts` — browser-side calls to our own `/api`
- `api/stats.ts`, `api/auth/*.ts` — serverless endpoints
- `api/_lib/github.ts` — GraphQL fetch + stat derivation (server-only)
- `api/_lib/commitAnalysis.ts` — commit scan, AI detection, commit hours (server-only)
- `api/_lib/session.ts` — encrypted cookie session + OAuth state (server-only)
- `api/_lib/funMessage.ts` — Gemini one-liner (server-only)

## 🤝 Contributing

Contributions are welcome. Open an issue for discussion or submit a PR with your changes.

## 👥 Contributors

<a href="https://github.com/aftab-s/gitwrap-2026/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=aftab-s/gitwrap-2026" alt="Contributors" />
</a>

---

Happy wrapping! 🎁
