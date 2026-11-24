# Fonts

Self-hosted so the card export can embed them (the PNG is rasterised in the browser).
All three are variable fonts under the SIL Open Font License, Latin subset.

| File | Family | Used for |
|---|---|---|
| `Archivo-latin.woff2` | Archivo (width 62–125, weight 100–900) | Headlines, names, numbers, body text |
| `MartianMono-latin.woff2` | Martian Mono (width 75–112.5, weight 100–800) | Labels, telemetry, and measurements |
| `Doto-latin.woff2` | Doto (weight 100–900) | The dot-matrix year on cards, the live scoreboard counter, and the Volt Matrix seal |

If you change a file name here, update the `@font-face` rules in `index.css` and in the export
iframe in `pages/UserPage.tsx`.
