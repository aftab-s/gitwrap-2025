/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        // match the runtime inline config (Space Grotesk used in globals/_document)
        display: ['Space Grotesk', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.5rem',
      },
      colors: {
        primary: '#14b8a6',
        'background-light': '#f3f4f6',
        'background-dark': '#111827',
        space: {
          bg1: '#0a0e27',
          bg2: '#1a1f4d',
          accent: '#00ffcc',
        },
        sunset: {
          bg1: '#ff6b35',
          bg2: '#f7931e',
          accent: '#fff75e',
        },
        retro: {
          bg1: '#2d1b69',
          bg2: '#ff006e',
          accent: '#ffbe0b',
        },
        minimal: {
          bg1: '#f8f9fa',
          bg2: '#e9ecef',
          accent: '#495057',
        },
        hc: {
          bg1: '#000000',
          bg2: '#0a0a0a',
          accent: '#00ff41',
        },
      },
    },
  },
  plugins: [],
}
