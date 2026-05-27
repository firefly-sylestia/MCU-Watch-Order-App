/**
 * UI 8.5 Theme System
 * Single source of truth for accent, gradients, glow, surfaces and interaction tokens.
 */

export const THEME_CHOICES = [
  { id: 'nova-core', label: 'Nova Core', dcLabel: 'Krypton Prime', swatch: '#6d7cff', dcSwatch: '#57a1ff' },
  { id: 'photon-bloom', label: 'Photon Bloom', dcLabel: 'Star Forge', swatch: '#4ed5ff', dcSwatch: '#6f8cff' },
  { id: 'midnight-arc', label: 'Midnight Arc', dcLabel: 'Shadow Grid', swatch: '#8f7bff', dcSwatch: '#6cb8ff' },
  { id: 'ember-shift', label: 'Ember Shift', dcLabel: 'Solar Rush', swatch: '#ff6a9c', dcSwatch: '#ff7a55' },
  { id: 'quantum-jade', label: 'Quantum Jade', dcLabel: 'Emerald Flux', swatch: '#47d7b1', dcSwatch: '#42c7d9' },
  { id: 'aurora-slate', label: 'Aurora Slate', dcLabel: 'Steel Dawn', swatch: '#8ca3be', dcSwatch: '#7698d9' },
];

const createPalette = ({ accent, accentAlt, accentSoft, darkBase, darkElev, lightBase, lightElev }) => ({
  accent,
  accentAlt,
  accentSoft,
  gradientHero: `linear-gradient(135deg, ${accent} 0%, ${accentAlt} 55%, ${accentSoft} 100%)`,
  gradientSurface: `linear-gradient(160deg, color-mix(in srgb, ${accent} 14%, transparent), color-mix(in srgb, ${accentAlt} 9%, transparent))`,
  darkBase,
  darkElev,
  lightBase,
  lightElev,
});

export const THEME_PALETTES = {
  'nova-core': createPalette({ accent: '#6d7cff', accentAlt: '#9d79ff', accentSoft: '#58d8ff', darkBase: '#090d19', darkElev: '#101727', lightBase: '#f4f7ff', lightElev: '#ffffff' }),
  'photon-bloom': createPalette({ accent: '#4ed5ff', accentAlt: '#6f8cff', accentSoft: '#7af2d2', darkBase: '#07131a', darkElev: '#0f1c27', lightBase: '#f2faff', lightElev: '#ffffff' }),
  'midnight-arc': createPalette({ accent: '#8f7bff', accentAlt: '#5ba8ff', accentSoft: '#b28bff', darkBase: '#0c0f1d', darkElev: '#15192b', lightBase: '#f6f5ff', lightElev: '#ffffff' }),
  'ember-shift': createPalette({ accent: '#ff6a9c', accentAlt: '#ff7a55', accentSoft: '#ffa86c', darkBase: '#1a0c14', darkElev: '#241321', lightBase: '#fff5f8', lightElev: '#ffffff' }),
  'quantum-jade': createPalette({ accent: '#47d7b1', accentAlt: '#42c7d9', accentSoft: '#78f2b1', darkBase: '#071713', darkElev: '#10221d', lightBase: '#f2fff9', lightElev: '#ffffff' }),
  'aurora-slate': createPalette({ accent: '#8ca3be', accentAlt: '#7698d9', accentSoft: '#9ec3ff', darkBase: '#0d1218', darkElev: '#151d27', lightBase: '#f4f7fb', lightElev: '#ffffff' }),
};

export const getActiveThemeVars = (themeMode, darkMode) => {
  const p = THEME_PALETTES[themeMode] || THEME_PALETTES['nova-core'];
  const glowStrong = darkMode
    ? `color-mix(in srgb, ${p.accent} 45%, transparent)`
    : `color-mix(in srgb, ${p.accent} 24%, transparent)`;

  return {
    '--theme-accent': p.accent,
    '--theme-accent-alt': p.accentAlt,
    '--theme-accent-soft': p.accentSoft,
    '--theme-accent-glow': glowStrong,
    '--theme-gradient-hero': p.gradientHero,
    '--theme-gradient-surface': p.gradientSurface,
    '--theme-surface': darkMode ? `color-mix(in srgb, ${p.darkElev} 88%, transparent)` : `color-mix(in srgb, ${p.lightElev} 92%, transparent)`,
    '--theme-surface-hover': darkMode ? `color-mix(in srgb, ${p.darkElev} 96%, ${p.accent} 4%)` : `color-mix(in srgb, ${p.lightElev} 90%, ${p.accent} 10%)`,
    '--comp-card-bg': darkMode ? `color-mix(in srgb, ${p.darkBase} 88%, transparent)` : `color-mix(in srgb, ${p.lightBase} 92%, transparent)`,
  };
};
