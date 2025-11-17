
import type { Theme } from './types';

export const THEMES: Theme[] = [
  {
    name: 'Space',
    classes: {
      bg: 'bg-gradient-to-br from-[#0d1117] to-[#161b22]',
      textPrimary: 'text-gray-100',
      textSecondary: 'text-gray-400',
      accent: 'text-purple-400',
      highlight: 'text-white',
      heatmapColors: ['bg-gray-700', 'bg-purple-900', 'bg-purple-700', 'bg-purple-500', 'bg-purple-300'],
    },
  },
  {
    name: 'Sunset',
    classes: {
      bg: 'bg-gradient-to-br from-[#1e293b] to-[#4a044e]',
      textPrimary: 'text-orange-100',
      textSecondary: 'text-orange-200',
      accent: 'text-yellow-400',
      highlight: 'text-white',
      heatmapColors: ['bg-slate-600', 'bg-orange-900', 'bg-orange-700', 'bg-orange-500', 'bg-yellow-400'],
    },
  },
  {
    name: 'Retro',
    classes: {
      bg: 'bg-gradient-to-br from-[#2d1738] to-[#044343]',
      textPrimary: 'text-teal-100',
      textSecondary: 'text-teal-200',
      accent: 'text-pink-400',
      highlight: 'text-white',
      heatmapColors: ['bg-gray-700', 'bg-teal-900', 'bg-teal-700', 'bg-pink-500', 'bg-pink-300'],
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
