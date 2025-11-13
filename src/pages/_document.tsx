import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en" className="dark">
      <Head>
  {/* Preload self-hosted Space Grotesk font files (TTF) for deterministic layout */}
  <link rel="preload" href="/fonts/SpaceGrotesk-Regular.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
  <link rel="preload" href="/fonts/SpaceGrotesk-Medium.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
  <link rel="preload" href="/fonts/SpaceGrotesk-SemiBold.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
  <link rel="preload" href="/fonts/SpaceGrotesk-Bold.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
  {/* Material Symbols (kept as remote CDN for now) */}
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap" rel="stylesheet" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
