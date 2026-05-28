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

export const SEMANTIC_COLOR_MATRIX = {
  dark: {
    background: '#070a13',
    backgroundAlt: '#0d1324',
    surface: '#12192a',
    surfaceElevated: '#1a2338',
    emphasis: '#f7f9ff',
    success: '#4ade80',
    warning: '#facc15',
    error: '#fb7185',
    textPrimary: '#f7f9ff',
    textSecondary: '#c3cce0',
    textMuted: '#8f9bb3',
    border: 'rgba(226, 232, 240, 0.12)',
  },
  light: {
    background: '#f3efe7',
    backgroundAlt: '#e7dfd2',
    surface: '#fffaf2',
    surfaceElevated: '#ffffff',
    emphasis: '#111827',
    success: '#15803d',
    warning: '#b45309',
    error: '#b91c1c',
    textPrimary: '#111827',
    textSecondary: '#475569',
    textMuted: '#64748b',
    border: 'rgba(51, 65, 85, 0.14)',
  },
};

export const buildSemanticThemeVars = (darkMode) => {
  const mode = darkMode ? 'dark' : 'light';
  const c = SEMANTIC_COLOR_MATRIX[mode];

  return {
    '--theme-bg': c.background,
    '--theme-bg-alt': c.backgroundAlt,
    '--theme-surface': c.surface,
    '--theme-surface-elevated': c.surfaceElevated,
    '--theme-surface-hover': `color-mix(in srgb, ${c.surface} 84%, ${c.emphasis})`,
    '--theme-surface-dark': 'color-mix(in srgb, #12192a 90%, #070a13)',
    '--theme-surface-light': 'color-mix(in srgb, #fffaf2 92%, #f3efe7)',
    '--theme-surface-hover-dark': 'color-mix(in srgb, #1a2338 88%, #f7f9ff)',
    '--theme-surface-hover-light': 'color-mix(in srgb, #ffffff 90%, #111827)',
    '--theme-comp-card-dark': 'color-mix(in srgb, #1a2338 84%, #0d1324)',
    '--theme-comp-card-light': 'color-mix(in srgb, #ffffff 94%, #f3efe7)',
    '--theme-border': c.border,
    '--theme-text': c.textPrimary,
    '--theme-text-primary': c.textPrimary,
    '--theme-text-secondary': c.textSecondary,
    '--theme-text-muted': c.textMuted,
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
