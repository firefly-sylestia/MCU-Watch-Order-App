export const UI_PARITY_TOKENS = {
  spacing: { xs: '6px', sm: '10px', md: '14px', lg: '18px', xl: '24px' },
  typography: {
    display: 'clamp(2.5rem, 6.4vw, 5rem)',
    h1: 'clamp(1.75rem, 3.8vw, 2.6rem)',
    h2: 'clamp(1.3rem, 2.8vw, 1.85rem)',
    body: '1rem',
    caption: '0.82rem',
  },
  radius: { sm: '10px', md: '14px', lg: '20px' },
  motion: { fast: '140ms', base: '200ms', slow: '260ms' },
  contrastTargets: { normalText: '4.5:1', largeText: '3:1', nonTextUI: '3:1' },
};

export const SEMANTIC_COLOR_MATRIX = {
  dark: {
    background: '#070b14',
    surface: '#121a2c',
    emphasis: '#f4f8ff',
    success: '#4ade80',
    warning: '#fbbf24',
    error: '#f87171',
    textPrimary: '#edf3ff',
    textSecondary: '#9fb0cb',
  },
  light: {
    background: '#eef3fb',
    surface: '#ffffff',
    emphasis: '#101a2f',
    success: '#166534',
    warning: '#b45309',
    error: '#b91c1c',
    textPrimary: '#101a2f',
    textSecondary: '#4b5f7a',
  },
};

export const buildSemanticThemeVars = (darkMode) => {
  const mode = darkMode ? 'dark' : 'light';
  const c = SEMANTIC_COLOR_MATRIX[mode];

  return {
    '--theme-bg': c.background,
    '--theme-surface': c.surface,
    '--theme-surface-hover': `color-mix(in srgb, ${c.surface} 88%, ${c.emphasis})`,
    '--theme-surface-dark': 'color-mix(in srgb, #121a2c 92%, #070b14)',
    '--theme-surface-light': 'color-mix(in srgb, #ffffff 95%, #eef3fb)',
    '--theme-surface-hover-dark': 'color-mix(in srgb, #1a2740 88%, #f4f8ff)',
    '--theme-surface-hover-light': 'color-mix(in srgb, #f9fbff 92%, #101a2f)',
    '--theme-comp-card-dark': 'color-mix(in srgb, #17233b 90%, #070b14)',
    '--theme-comp-card-light': 'color-mix(in srgb, #ffffff 96%, #eef3fb)',
    '--theme-text': c.textPrimary,
    '--theme-text-primary': c.textPrimary,
    '--theme-text-secondary': c.textSecondary,
    '--theme-text-muted': c.textSecondary,
    '--theme-success': c.success,
    '--theme-warning': c.warning,
    '--theme-danger': c.error,
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
