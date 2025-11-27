This folder contains the Space Grotesk font files used by the app.

Current files in this repo:
- SpaceGrotesk-Regular.ttf
- SpaceGrotesk-Light.ttf
- SpaceGrotesk-Medium.ttf
- SpaceGrotesk-SemiBold.ttf
- SpaceGrotesk-Bold.ttf

If you need to replace them, use the same filenames above. The app will preload these TTF files and the CSS in `src/styles/globals.css` declares @font-face rules for weights 300/400/500/600/700.

Why self-host:
- Self-hosting ensures deterministic layout and avoids cross-origin font availability differences on first load — important for pixel-consistent exports.

After changing or adding font files, restart the dev server to ensure Next.js serves the static assets from `/fonts/`.
