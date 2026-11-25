/**
 * Content for the /themes field guide. Facts were checked against the linked sources on
 * November 25, 2026. Each egg's `spot` matches a `data-egg` attribute on the rendered card
 * (ArcadeCard / ThemeBackdrop), so the guide can spotlight the exact element.
 */

export type EggSpot = 'tag-left' | 'tag-right' | 'year-console' | 'footer' | 'barcode' | 'hex-stream' | 'isbn' | 'hanko';

export interface ThemeEgg {
  spot: EggSpot;
  /** Clue shown before the egg is revealed. */
  where: string;
  /** The text as printed on the card. */
  label: string;
  text: string;
}

export interface ThemeGuideEntry {
  id: string;
  /** ISO dates (UTC) for the 2026 timeline. `end` makes a range. */
  start: string;
  end?: string;
  when: string;
  event: string;
  kicker: string;
  title: string;
  happened: string;
  stats: Array<[string, string]>;
  onCard: string;
  eggs: ThemeEgg[];
  sources: Array<[string, string]>;
}

/** Ordered by when each moment happened in 2026. */
export const THEME_GUIDE: ThemeGuideEntry[] = [
  {
    id: 'maxdark',
    start: '2026-02-15',
    when: 'February 2026',
    event: 'ENIAC turns 80',
    kicker: 'For the hardware romantics',
    title: 'Still chasing that first spark.',
    happened:
      'In February 2026, Penn and Philadelphia celebrated 80 years since ENIAC, the first general-purpose electronic computer, was unveiled in 1946. J. Presper Eckert and John Mauchly built it at the University of Pennsylvania from 40 nine-foot panels and more than 17,000 vacuum tubes. Volt Matrix started as a maximalist dark study of logic analyzers and oscilloscopes. In 2026 it found its moment: a salute to the room-sized machine at the root of every stack you ship on.',
    stats: [['80', 'years since 1946'], ['17,000+', 'vacuum tubes'], ['40', 'nine-foot panels']],
    onCard:
      'Chassis black, volt yellow and thermal orange. A calibration dot grid, a faint oscilloscope trace and hard 5px shadows turn your recap into a diagnostic printout.',
    eggs: [
      { spot: 'tag-right', where: 'Header · top right', label: '1080×1440.DP', text: 'The card prints its own export size. Download it and you get exactly 1,080 × 1,440 pixels.' },
      { spot: 'hex-stream', where: 'Left edge · rotated', label: '0xCAFE · 0xDEAD · 0xBEEF', text: 'A faint memory dump runs up the margin, packed with classic hexspeak. It is decorative, not real diagnostics.' },
      { spot: 'footer', where: 'Footer · telemetry', label: 'HEX: 0x7EA', text: 'Do the conversion: 7×256 + 14×16 + 10 = 2026. No segfaults, as promised.' },
    ],
    sources: [['Penn Today · ENIAC turns 80', 'https://penntoday.upenn.edu/news/penns-eniac-worlds-first-electronic-computer-turns-80']],
  },
  {
    id: 'artemis',
    start: '2026-04-01',
    end: '2026-04-10',
    when: 'April 1–10, 2026',
    event: 'Artemis II flies around the Moon',
    kicker: 'Beyond the everyday',
    title: 'A little farther. A little bolder.',
    happened:
      'On April 1, 2026, NASA’s SLS rocket lifted off from Kennedy’s Launch Complex 39B carrying Reid Wiseman, Victor Glover, Christina Koch and the Canadian Space Agency’s Jeremy Hansen aboard Orion. It was the first crewed trip to the Moon since Apollo 17 in 1972. During the lunar flyby they reached 252,756 miles from Earth, beating Apollo 13’s 1970 distance record. They splashed down off California on April 10.',
    stats: [['4', 'crew aboard'], ['252,756 mi', 'farthest from Earth'], ['10', 'days in flight']],
    onCard:
      'Telemetry cyan against deep-space navy, warmed by a visor-gold glow on the horizon. Silver score windows and fine regolith stardust make the card feel like a recovered mission log.',
    eggs: [
      { spot: 'tag-left', where: 'Header · top left', label: 'Integrity', text: 'The name the crew gave their Orion spacecraft.' },
      { spot: 'year-console', where: 'Year console', label: 'ARTEMIS // II · ORBIT', text: 'A mission-style stamp above the year. Strictly speaking, Artemis II flew past the Moon rather than orbiting it. The label is patch-style shorthand.' },
      { spot: 'footer', where: 'Footer · telemetry', label: 'KSC LC-39B · Δv 10.9 KM/S', text: 'The launch pad is real: Launch Complex 39B at Kennedy Space Center. The Δv figure is decorative telemetry, not a mission measurement.' },
    ],
    sources: [['NASA · Artemis II crew returns', 'https://www.nasa.gov/news-release/nasa-welcomes-record-setting-artemis-ii-moonfarers-back-to-earth/']],
  },
  {
    id: 'fifa',
    start: '2026-06-11',
    end: '2026-07-19',
    when: 'June 11 – July 19, 2026',
    event: 'The FIFA World Cup 2026',
    kicker: 'Every contribution counts',
    title: 'Your season. On the scoreboard.',
    happened:
      'The first 48-team World Cup was played across 16 host cities in Canada, Mexico and the United States. On July 19 at MetLife Stadium in New Jersey, Spain beat Argentina 1–0 after extra time. Ferran Torres scored in the 106th minute, giving Spain its second world title.',
    stats: [['48', 'teams'], ['16', 'host cities'], ['106′', 'winning goal']],
    onCard:
      'Crimson, cobalt and pitch green flow into one another like a stadium wave. Championship-gold readouts and chalk-white score windows give your stats a tournament finish.',
    eggs: [
      { spot: 'tag-left', where: 'Header · top left', label: 'Trionda', text: 'adidas’s official match ball. Its red, green and blue panels stand for the three host nations, with gold for the trophy. A built-in sensor fed real-time data to match officials.' },
      { spot: 'year-console', where: 'Year console', label: 'MATCHDAY // ’26', text: 'The gold year digits nod to Trionda Final, the gold ball used from the semi-finals on. It was the first time adidas made an entirely new ball design for a World Cup’s closing matches.' },
      { spot: 'footer', where: 'Footer · telemetry', label: 'VAR: COMMITS VERIFIED · 90′+5', text: 'A stoppage-time joke for anyone who has pushed one last fix. The real final ran even longer, into extra time.' },
    ],
    sources: [
      ['NPR · Spain wins the final', 'https://www.npr.org/2026/07/19/nx-s1-5899071/spain-2026-world-cup-champion'],
      ['FIFA · Trionda Final', 'https://inside.fifa.com/en/news/final-four-world-cup-2026-matches-trionda-official-match-ball'],
    ],
  },
  {
    id: 'maxlight',
    start: '2026-09-02',
    when: 'September 2026',
    event: 'RISO turns 80',
    kicker: 'Fresh from the press',
    title: 'Your year deserves a first edition.',
    happened:
      'On September 2, 1946, Noboru Hayama opened a stencil-printing business in Tokyo called Riso-sha. “Riso” means “ideal”. The company introduced its first Risograph duplicator in 1980, and the machine’s grainy, vivid spot-colour prints went on to become a favourite of zine makers and independent studios. RISO marked its 80th anniversary in September 2026.',
    stats: [['1946', 'founded in Tokyo'], ['1980', 'first Risograph'], ['80', 'years of ink']],
    onCard:
      'Warm washi paper, fluorescent coral and soy-yellow inks, with Prussian-blue rules. Halftone dots, crop marks and a CMYK registration strip make your digital recap feel like a small-run print.',
    eggs: [
      { spot: 'hanko', where: 'Bottom left · slanted stamp', label: '初版限定 · 2026', text: 'The red rubber stamp reads “limited first edition”. Your year only gets printed once.' },
      { spot: 'isbn', where: 'Top right · barcode', label: 'ISBN 978-4-00-2026-1', text: '978-4 is the real ISBN prefix for Japanese publishers. The rest is fiction, as is the line beneath it: a magazine code and a list price of ¥2026.' },
      { spot: 'footer', where: 'Footer · colophon', label: '検印 · TOKYO RISO NO. 0026', text: '検印 (kenin) means “inspection seal”, a mark of approval on Japanese print. Here it certifies archive copy no. 0026.' },
    ],
    sources: [
      ['RISO · 80th anniversary', 'https://www.riso.co.jp/english/80th/index.html'],
      ['Risograph · history', 'https://en.wikipedia.org/wiki/Risograph'],
    ],
  },
  {
    id: 'gtavi',
    start: '2026-11-19',
    when: 'November 19, 2026',
    event: 'Grand Theft Auto VI launches',
    kicker: 'After hours, in full colour',
    title: 'One more commit before sunrise.',
    happened:
      'Rockstar’s return to Vice City arrived on November 19, 2026 for PlayStation 5 and Xbox Series X|S. It is set across Leonida, a Florida-inspired state, and follows Lucia Caminos and Jason Duval. Take-Two estimated day-one sales at $3.79 billion and called it the biggest entertainment launch in history.',
    stats: [['Nov 19', 'launch day'], ['$3.79B', 'day one · Take-Two est.'], ['2', 'protagonists']],
    onCard:
      'Coral, plum and coastal teal melt into a humid dusk sky. Heat-haze light rays, film grain and a scanlined VCR year monitor give the card its late-night glow.',
    eggs: [
      { spot: 'tag-left', where: 'Header · top left', label: 'Emotion 98.3', text: 'The soft-rock station from 2002’s GTA: Vice City. It was not among the six stations Rockstar showcased before launch, so read it as a love letter to the original game.' },
      { spot: 'year-console', where: 'Year console', label: 'PLAY ▶', text: 'The year plays back on a VHS-style monitor, complete with CRT scanlines.' },
      { spot: 'footer', where: 'Footer · telemetry', label: '★ WANTED LEVEL 5 · 98.6 FM', text: 'Maximum heat on a fictional dial. 98.6 is deliberately a different frequency from Emotion’s 98.3.' },
    ],
    sources: [
      ['Rockstar · out now', 'https://www.rockstargames.com/VI/out-now'],
      ['Fox Business · launch sales', 'https://www.foxbusiness.com/entertainment/grand-theft-auto-vi-shatters-entertainment-records-staggering-3-79b-debut'],
    ],
  },
  {
    id: 'doomsday',
    start: '2026-12-18',
    when: 'December 18, 2026',
    event: 'Avengers: Doomsday',
    kicker: 'Built to last',
    title: 'Forged, not just shipped.',
    happened:
      'Anthony and Joe Russo return to direct, and Robert Downey Jr. comes back to the MCU as Victor von Doom, a casting revealed at San Diego Comic-Con in 2024. Its US release date is December 18, 2026, with Avengers: Secret Wars to follow in December 2027.',
    stats: [['Dec 18', 'US release'], ['2', 'Russo brothers'], ['RDJ', 'as Doctor Doom']],
    onCard:
      'Obsidian steel, cloak green and arcane emerald, with one crimson seal. Gothic lancets, iron latticework and a forged-chrome year plate bring the weight. Pale chartreuse keeps the numbers readable.',
    eggs: [
      { spot: 'tag-left', where: 'Header · top left', label: 'Earth-616', text: 'The designation for Marvel’s main comics universe. It is a nod to the lore, not a claim about the film’s plot.' },
      { spot: 'tag-right', where: 'Header · top right', label: 'REX LATVERIAE', text: 'Latin for “King of Latveria”, Doom’s fictional homeland.' },
      { spot: 'footer', where: 'Footer · proclamation', label: 'ᛝ BY ROYAL DECREE · VON DOOM ᛝ', text: 'Your year in code, signed off as a royal proclamation between runic marks.' },
    ],
    sources: [
      ['TechRadar · Doomsday guide', 'https://www.techradar.com/streaming/entertainment/marvels-avengers-doomsday-hub'],
      ['Rotten Tomatoes · what we know', 'https://editorial.rottentomatoes.com/article/everything-we-know-about-avengers-doomsday'],
    ],
  },
];

export const TOTAL_EGGS = THEME_GUIDE.reduce((n, t) => n + t.eggs.length, 0);

/** The six 2025-edition colourways (Tailwind gradients over photo backdrops), for the upgrade story. */
export const LEGACY_2025 = [
  { name: 'Space', bg: 'linear-gradient(135deg,#000000,#0a0a14,#050510)', ink: '#22d3ee' },
  { name: 'Sunset', bg: 'linear-gradient(135deg,#fff5eb,#ffd4a3,#ffb366)', ink: '#ea580c' },
  { name: 'Retro', bg: 'linear-gradient(135deg,#1a0033,#2d004d,#1a0033)', ink: '#f472b6' },
  { name: 'Aurora', bg: 'linear-gradient(135deg,#021024,#043a2d,#3b0f4f)', ink: '#34d399' },
  { name: 'Nocturne', bg: 'linear-gradient(135deg,#030411,#0b1220,#07101a)', ink: '#38bdf8' },
  { name: 'Minimal', bg: '#ffffff', ink: '#2563eb' },
];
