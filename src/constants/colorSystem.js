export const MODERN_COLOR_SYSTEM = {
  dark: {
    bg: '#070913',
    bgAlt: '#0c1020',
    surface: 'rgba(17, 24, 39, 0.82)',
    surfaceElevated: 'rgba(24, 32, 50, 0.92)',
    surfaceHover: 'rgba(38, 49, 74, 0.92)',
    text: '#f8fafc',
    textSecondary: '#cbd5e1',
    textMuted: '#94a3b8',
    textDisabled: 'rgba(203, 213, 225, 0.52)',
    border: 'rgba(148, 163, 184, 0.18)',
    borderStrong: 'rgba(226, 232, 240, 0.28)',
    overlaySoft: 'rgba(2, 6, 23, 0.34)',
    overlayDark: 'rgba(2, 6, 23, 0.52)',
    overlayStrong: 'rgba(2, 6, 23, 0.66)',
    shadowSm: '0 10px 24px rgba(2, 6, 23, 0.32)',
    shadowMd: '0 22px 54px rgba(2, 6, 23, 0.42)',
    shadowLg: '0 34px 90px rgba(2, 6, 23, 0.58)',
    success: '#4ade80',
    warning: '#facc15',
    danger: '#fb7185',
  },
  light: {
    bg: '#eef3fb',
    bgAlt: '#f8fbff',
    surface: 'rgba(255, 255, 255, 0.84)',
    surfaceElevated: 'rgba(255, 255, 255, 0.96)',
    surfaceHover: 'rgba(241, 245, 249, 0.98)',
    text: '#0f172a',
    textSecondary: '#334155',
    textMuted: '#64748b',
    textDisabled: 'rgba(71, 85, 105, 0.54)',
    border: 'rgba(15, 23, 42, 0.12)',
    borderStrong: 'rgba(15, 23, 42, 0.2)',
    overlaySoft: 'rgba(15, 23, 42, 0.08)',
    overlayDark: 'rgba(15, 23, 42, 0.14)',
    overlayStrong: 'rgba(15, 23, 42, 0.22)',
    shadowSm: '0 10px 24px rgba(15, 23, 42, 0.08)',
    shadowMd: '0 22px 54px rgba(15, 23, 42, 0.12)',
    shadowLg: '0 34px 90px rgba(15, 23, 42, 0.16)',
    success: '#15803d',
    warning: '#b45309',
    danger: '#be123c',
  },
};

export const getColorMode = (darkMode) => (darkMode ? 'dark' : 'light');

export const getModeColors = (darkMode) => MODERN_COLOR_SYSTEM[getColorMode(darkMode)];

export const buildModeColorVars = (darkMode) => {
  const c = getModeColors(darkMode);
  return {
    '--theme-bg': c.bg,
    '--theme-bg-alt': c.bgAlt,
    '--theme-surface': c.surface,
    '--theme-surface-elevated': c.surfaceElevated,
    '--theme-surface-hover': c.surfaceHover,
    '--theme-border': c.border,
    '--theme-border-strong': c.borderStrong,
    '--theme-text': c.text,
    '--theme-text-primary': c.text,
    '--theme-text-secondary': c.textSecondary,
    '--theme-text-muted': c.textMuted,
    '--theme-text-disabled': c.textDisabled,
    '--theme-success': c.success,
    '--theme-warning': c.warning,
    '--theme-danger': c.danger,
    '--overlay-soft': c.overlaySoft,
    '--overlay-dark': c.overlayDark,
    '--overlay-strong': c.overlayStrong,
    '--shadow-surface-sm': c.shadowSm,
    '--shadow-surface-md': c.shadowMd,
    '--shadow-surface-lg': c.shadowLg,
  };
};

export const buildAppSurfaceVars = ({ darkMode, accent, accentAlt }) => {
  const mode = getColorMode(darkMode);
  const dark = mode === 'dark';
  const c = MODERN_COLOR_SYSTEM[mode];
  return {
    '--app-bg-base': c.bg,
    '--app-bg-vignette': dark ? 'rgba(2, 6, 23, 0.42)' : 'rgba(15, 23, 42, 0.06)',
    '--app-bg-noise-opacity': dark ? '0.055' : '0.025',
    '--theme-app-bg': dark
      ? `radial-gradient(circle at 8% 2%, color-mix(in srgb, ${accent} 34%, transparent), transparent 34%), radial-gradient(circle at 90% 8%, color-mix(in srgb, ${accentAlt} 28%, transparent), transparent 42%), linear-gradient(138deg, #020617 0%, #08111f 38%, #0f172a 100%)`
      : `radial-gradient(circle at 8% 4%, color-mix(in srgb, ${accent} 14%, #eef3fb), transparent 34%), radial-gradient(circle at 88% 14%, color-mix(in srgb, ${accentAlt} 12%, #eef3fb), transparent 40%), linear-gradient(140deg, #eef3fb 0%, #f8fbff 52%, #e8eef8 100%)`,
    '--theme-header-bg': dark
      ? `linear-gradient(180deg, color-mix(in srgb, ${accent} 15%, #0f172a), #070913)`
      : `linear-gradient(180deg, color-mix(in srgb, ${accent} 8%, #ffffff), #eef3fb)`,
    '--theme-watched-bg': dark
      ? `linear-gradient(100deg, color-mix(in srgb, ${accent} 18%, rgba(15, 23, 42, 0.72)), color-mix(in srgb, ${accentAlt} 10%, rgba(15, 23, 42, 0.64)))`
      : `linear-gradient(100deg, color-mix(in srgb, ${accent} 12%, #ffffff), color-mix(in srgb, ${accentAlt} 7%, #f8fbff))`,
  };
};

export const THEME_MODE_TOKENS = {
  dark: {
    appBg: 'var(--theme-bg)', headerBg: 'var(--theme-header-bg)',
    headerBorder: 'var(--theme-border)', navBg: 'var(--theme-surface-elevated)', navBorder: 'var(--theme-border)',
    filterBg: 'transparent', filterBorder: 'var(--theme-border)',
    surfaceBg: 'transparent', surfaceBorder: 'var(--theme-border)',
    rowHoverBg: 'color-mix(in srgb, var(--theme-surface-hover) 50%, transparent)', rowWatchedBg: 'var(--theme-watched-bg)',
    rowBorder: 'var(--theme-border)', expandBg: 'var(--theme-surface)', expandBorder: 'var(--theme-border)',
    pillBg: 'var(--theme-surface)', pillBorder: 'var(--theme-border)', pillText: 'var(--theme-text-muted)',
    pillHoverBorder: 'var(--theme-border-strong)', pillHoverText: 'var(--theme-text-primary)',
    inputBg: 'var(--theme-surface)', inputBorder: 'var(--theme-border)', inputColor: 'var(--theme-text-primary)',
    dropdownBg: 'var(--theme-surface-elevated)', dropdownBorder: 'var(--theme-border)', dropdownShadow: 'var(--shadow-surface-lg)',
    text: 'var(--theme-text-primary)', textMuted: 'var(--theme-text-muted)', textFaint: 'var(--theme-text-disabled)',
    sortHoverBg: 'var(--theme-surface-hover)', statBg: 'var(--theme-surface)', statBorder: 'var(--theme-border)',
    numFaint: 'var(--theme-text-disabled)', footerText: 'var(--theme-text-disabled)',
    scrollTrack: 'color-mix(in srgb, var(--theme-bg) 82%, black)', scrollThumb: 'color-mix(in srgb, var(--theme-accent) 24%, var(--theme-border))', scrollThumbH: 'color-mix(in srgb, var(--theme-accent) 36%, var(--theme-border))',
    hexDot: 'rgba(255,255,255,0.012)', switcherBg: 'var(--theme-surface)', switcherBorder: 'var(--theme-border)',
    phaseSummaryBg: 'color-mix(in srgb, var(--theme-surface) 58%, transparent)', phaseSummaryBorder: 'var(--theme-border)',
  },
  light: {
    appBg: 'var(--theme-bg)', headerBg: 'var(--theme-header-bg)',
    headerBorder: 'var(--theme-border)', navBg: 'var(--theme-surface-elevated)', navBorder: 'var(--theme-border)',
    filterBg: 'transparent', filterBorder: 'var(--theme-border)',
    surfaceBg: 'transparent', surfaceBorder: 'var(--theme-border)',
    rowHoverBg: 'color-mix(in srgb, var(--theme-accent) 6%, white)', rowWatchedBg: 'var(--theme-watched-bg)',
    rowBorder: 'var(--theme-border)', expandBg: 'var(--theme-surface)', expandBorder: 'var(--theme-border)',
    pillBg: 'var(--theme-surface)', pillBorder: 'var(--theme-border)', pillText: 'var(--theme-text-muted)',
    pillHoverBorder: 'var(--theme-border-strong)', pillHoverText: 'var(--theme-text-primary)',
    inputBg: 'var(--theme-surface-elevated)', inputBorder: 'var(--theme-border)', inputColor: 'var(--theme-text-primary)',
    dropdownBg: 'var(--theme-surface-elevated)', dropdownBorder: 'var(--theme-border)', dropdownShadow: 'var(--shadow-surface-lg)',
    text: 'var(--theme-text-primary)', textMuted: 'var(--theme-text-muted)', textFaint: 'var(--theme-text-disabled)',
    sortHoverBg: 'var(--theme-surface-hover)', statBg: 'var(--theme-surface)', statBorder: 'var(--theme-border)',
    numFaint: 'var(--theme-text-disabled)', footerText: 'var(--theme-text-muted)',
    scrollTrack: 'color-mix(in srgb, var(--theme-bg) 92%, white)', scrollThumb: 'color-mix(in srgb, var(--theme-accent) 20%, var(--theme-border))', scrollThumbH: 'color-mix(in srgb, var(--theme-accent) 34%, var(--theme-border))',
    hexDot: 'rgba(15,23,42,0.024)', switcherBg: 'var(--theme-surface)', switcherBorder: 'var(--theme-border)',
    phaseSummaryBg: 'color-mix(in srgb, var(--theme-surface) 72%, transparent)', phaseSummaryBorder: 'var(--theme-border)',
  },
};
