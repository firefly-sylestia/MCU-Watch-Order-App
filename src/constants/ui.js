import { MODERN_COLOR_SYSTEM, buildModeColorVars, getColorMode } from './colorSystem';

export const MOBILE_TABS = ["assets", "avatar", "text"];

export const UI_PARITY_TOKENS = {
  spacing: { xs: '6px', sm: '10px', md: '14px', lg: '18px', xl: '24px' },
  typography: {
    display: 'clamp(2.4rem, 6vw, 4.75rem)',
    h1: 'clamp(1.7rem, 4vw, 2.5rem)',
    h2: 'clamp(1.25rem, 3vw, 1.75rem)',
    body: '1rem',
    caption: '0.78rem',
  },
  radius: { sm: '10px', md: '12px', lg: '16px' },
  motion: { fast: '150ms', base: '200ms', slow: '240ms' },
  contrastTargets: { normalText: '4.5:1', largeText: '3:1', nonTextUI: '3:1' },
};

export const SEMANTIC_COLOR_MATRIX = MODERN_COLOR_SYSTEM;

export const buildSemanticThemeVars = (darkMode) => {
  const mode = getColorMode(darkMode);

  return {
    ...buildModeColorVars(darkMode),
    '--theme-surface-dark': 'color-mix(in srgb, var(--theme-surface) 90%, black)',
    '--theme-surface-light': 'color-mix(in srgb, var(--theme-surface) 90%, white)',
    '--theme-surface-hover-dark': 'color-mix(in srgb, var(--theme-surface-hover) 85%, white)',
    '--theme-surface-hover-light': 'color-mix(in srgb, var(--theme-surface-hover) 88%, black)',
    '--theme-comp-card-dark': 'color-mix(in srgb, var(--theme-surface-elevated) 82%, #0f172a)',
    '--theme-comp-card-light': 'color-mix(in srgb, var(--theme-surface-elevated) 92%, #eef3fb)',
    '--theme-mode': mode,
  };
};

export const UI_TOKENS = {
  panel: { level1: 'var(--ui-panel-1)', level2: 'var(--ui-panel-2)' },
  border: { soft: 'var(--ui-border-soft)', strong: 'var(--ui-border-strong)' },
  shadow: { level1: 'var(--ui-shadow-1)', level2: 'var(--ui-shadow-2)' },
  spacing: {
    xs: 'var(--ui-space-1)', sm: 'var(--ui-space-2)', md: 'var(--ui-space-3)', lg: 'var(--ui-space-4)',
  },
  radius: { sm: 'var(--ui-radius-sm)', md: 'var(--ui-radius-md)', lg: 'var(--ui-radius-lg)' },
};
