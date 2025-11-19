
import type { Theme } from './types';

export const THEMES: Theme[] = [
  {
    name: 'Space',
    classes: {
      bg: 'bg-gradient-to-br from-[#000000] via-[#0a0a14] to-[#050510]',
      textPrimary: 'text-cyan-100',
      textSecondary: 'text-slate-300',
      accent: 'text-cyan-400',
      highlight: 'text-cyan-200',
      heatmapColors: ['bg-slate-900', 'bg-slate-700', 'bg-cyan-900', 'bg-cyan-600', 'bg-cyan-400'],
      bgImage: '/images/space.jpg',
    },
  },
  {
    name: 'Sunset',
    classes: {
      bg: 'bg-gradient-to-br from-[#fff5eb] via-[#ffd4a3] to-[#ffb366]',
      textPrimary: 'text-slate-800',
      textSecondary: 'text-slate-600',
      accent: 'text-orange-600',
      highlight: 'text-rose-700',
      heatmapColors: ['bg-amber-200', 'bg-orange-300', 'bg-orange-400', 'bg-rose-500', 'bg-rose-600'],
      bgImage: '/images/sunset.jpg',
    },
  },
  {
    name: 'Retro',
    classes: {
      bg: 'bg-gradient-to-br from-[#1a0033] via-[#2d004d] to-[#1a0033]',
      textPrimary: 'text-cyan-300',
      textSecondary: 'text-fuchsia-300',
      accent: 'text-pink-400',
      highlight: 'text-yellow-300',
      heatmapColors: ['bg-purple-900', 'bg-fuchsia-700', 'bg-pink-500', 'bg-yellow-400', 'bg-cyan-400'],
      bgImage: '/images/retro.jpg',
    },
  },
  {
    name: 'Minimal',
    classes: {
      bg: 'bg-white',
      textPrimary: 'text-gray-800',
      textSecondary: 'text-gray-500',
      accent: 'text-blue-600',
      highlight: 'text-black',
      heatmapColors: ['bg-gray-200', 'bg-blue-200', 'bg-blue-400', 'bg-blue-600', 'bg-blue-800'],
    },
  },
];
