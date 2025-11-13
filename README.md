## GitHub Unwrapped — 2025 activity card generator

Create beautiful, shareable GitHub "year in review" cards for 2025. This is a friendly open-source hobby project — run it locally, pick a theme, and export a high-quality PNG ready for social sharing.

• Lightweight client-side rendering — your data never leaves your browser.

---

## Quick highlights

- Themeable cards (Space, Sunset, Retro, Minimal, High-contrast)
- Contribution heatmap and activity stats
- High-fidelity PNG export optimized for stories (1080×1920, 9:16 ratio)

---

## Quick start (2 minutes)

1. Clone and install

```powershell
git clone https://github.com/aftab-s/github-unwrapped-2025.git
cd github-unwrapped-2025
npm install
```

2. (Optional) Add a GitHub token for higher rate limits

Create or edit `.env.local` in the project root and add:

```env
GITHUB_APP_TOKEN=ghp_YOUR_TOKEN_HERE
```

No scopes are required for public data. Keep the token private.

3. Run the app

```powershell
npm run dev
```

4. Open in browser

Visit: http://localhost:3000/u/<github-username>

Type a GitHub username and the card will generate automatically.

---

## Exporting images

- Click the "Download Card PNG" button to export a 1080×1920 PNG optimized for stories (9:16 aspect ratio).
- Filenames include pixel dimensions to make it easy to confirm the output (e.g. `username-github-unwrapped-2025-1080x1920.png`).

Tips
- Wait for the page to fully load (avatars & external images) before exporting.
- If you see an older layout after edits, do a hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac).

---

## Troubleshooting

- Blank or cropped images: ensure avatar images loaded and try exporting again.
- Export dimensions off: confirm the export button shows the correct size (1080×1920).
- Still broken? Open developer tools (F12) and check console for errors.

---

## Contributing

This is a hobby project — contributions are welcome and appreciated.

How to contribute

1. Open an issue describing what you'd like to change or a bug you found.
2. Create a branch: `git checkout -b fix/your-feature`
3. Send a PR with a short description and small changes.

PR checklist
- Keep changes small and focused
- Add or update a short demo/test for visual changes

---

## License

MIT — see the `LICENSE` file.

---