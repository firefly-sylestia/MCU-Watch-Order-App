export const MODERN_COLOR_MODES = {
  dark: {
    canvas: '#070A12',
    canvasAlt: '#0D1220',
    canvasElevated: '#111827',
    surface: 'rgba(17, 24, 39, 0.84)',
    surfaceElevated: 'rgba(24, 33, 52, 0.92)',
    surfaceSolid: '#151D2E',
    surfaceHover: 'rgba(37, 48, 70, 0.92)',
    text: '#F8FAFC',
    textSecondary: '#CBD5E1',
    textMuted: '#94A3B8',
    textDisabled: 'rgba(148, 163, 184, 0.58)',
    border: 'rgba(148, 163, 184, 0.18)',
    borderStrong: 'rgba(226, 232, 240, 0.26)',
    inputBg: 'rgba(15, 23, 42, 0.72)',
    dropdownBg: 'rgba(15, 23, 42, 0.78)',
    overlaySoft: 'rgba(2, 6, 23, 0.34)',
    overlay: 'rgba(2, 6, 23, 0.52)',
    overlayStrong: 'rgba(2, 6, 23, 0.66)',
    success: '#34D399',
    warning: '#FBBF24',
    danger: '#FB7185',
    appGradient: 'linear-gradient(138deg, #030712 0%, #07111F 34%, #101B33 67%, #17152E 100%)',
    utilityGradient: 'linear-gradient(180deg, rgba(17, 24, 39, 0.68), #070A12)',
    shadowSoft: '0 16px 40px rgba(2, 6, 23, 0.34)',
    shadowElevated: '0 28px 72px rgba(2, 6, 23, 0.48)',
    focusMix: 'white',
  },
  light: {
    canvas: '#F6F8FC',
    canvasAlt: '#EEF3FA',
    canvasElevated: '#FFFFFF',
    surface: 'rgba(255, 255, 255, 0.86)',
    surfaceElevated: 'rgba(255, 255, 255, 0.96)',
    surfaceSolid: '#FFFFFF',
    surfaceHover: 'rgba(229, 237, 248, 0.94)',
    text: '#101827',
    textSecondary: '#334155',
    textMuted: '#64748B',
    textDisabled: 'rgba(71, 85, 105, 0.58)',
    border: 'rgba(15, 23, 42, 0.12)',
    borderStrong: 'rgba(15, 23, 42, 0.20)',
    inputBg: 'rgba(255, 255, 255, 0.9)',
    dropdownBg: 'rgba(255, 255, 255, 0.88)',
    overlaySoft: 'rgba(15, 23, 42, 0.08)',
    overlay: 'rgba(15, 23, 42, 0.14)',
    overlayStrong: 'rgba(15, 23, 42, 0.22)',
    success: '#059669',
    warning: '#B45309',
    danger: '#E11D48',
    appGradient: 'linear-gradient(140deg, #F8FAFC 0%, #EEF4FF 45%, #F6F0FF 100%)',
    utilityGradient: 'linear-gradient(180deg, rgba(255, 255, 255, 0.72), #F6F8FC)',
    shadowSoft: '0 16px 36px rgba(15, 23, 42, 0.11)',
    shadowElevated: '0 26px 58px rgba(15, 23, 42, 0.16)',
    focusMix: '#020617',
  },
};

export const STATUS_COLOR_TOKENS = {
  watched: { color: 'var(--theme-success)', bg: 'var(--theme-success-soft)' },
  'plan-to-watch': { color: 'var(--theme-info)', bg: 'var(--theme-info-soft)' },
  watching: { color: 'var(--theme-accent-alt)', bg: 'var(--theme-accent-alt-soft)' },
  'on-hold': { color: 'var(--theme-warning)', bg: 'var(--theme-warning-soft)' },
  dropped: { color: 'var(--theme-danger)', bg: 'var(--theme-danger-soft)' },
};

export const TYPE_COLOR_TOKENS = {
  film: 'var(--theme-type-film)',
  series: 'var(--theme-type-series)',
  short: 'var(--theme-type-short)',
};

export const getColorMode = (darkMode) => (darkMode ? 'dark' : 'light');
export const getColorModeTokens = (darkMode) => MODERN_COLOR_MODES[getColorMode(darkMode)];

export const composeColorModeCssVars = (darkMode, activeThemeVars = {}) => {
  const palette = getColorModeTokens(darkMode);
  const accent = activeThemeVars['--accent-1'] || activeThemeVars['--theme-accent'] || 'var(--accent)';
  const accentAlt = activeThemeVars['--accent-2'] || activeThemeVars['--theme-accent-alt'] || 'var(--accent-2)';
  return {
    '--theme-bg': palette.canvas,
    '--theme-bg-alt': palette.canvasAlt,
    '--theme-bg-secondary': palette.canvasAlt,
    '--theme-bg-tertiary': palette.canvasElevated,
    '--theme-surface': palette.surface,
    '--theme-surface-elevated': palette.surfaceElevated,
    '--theme-surface-solid': palette.surfaceSolid,
    '--theme-surface-hover': palette.surfaceHover,
    '--theme-border': palette.border,
    '--theme-border-strong': palette.borderStrong,
    '--theme-text': palette.text,
    '--theme-text-primary': palette.text,
    '--theme-text-secondary': palette.textSecondary,
    '--theme-text-muted': palette.textMuted,
    '--theme-text-disabled': palette.textDisabled,
    '--theme-success': palette.success,
    '--theme-warning': palette.warning,
    '--theme-danger': palette.danger,
    '--theme-info': darkMode ? '#60A5FA' : '#2563EB',
    '--theme-type-film': darkMode ? '#FB7185' : '#DC2626',
    '--theme-type-series': darkMode ? '#60A5FA' : '#2563EB',
    '--theme-type-short': darkMode ? '#C084FC' : '#7C3AED',
    '--theme-success-soft': `color-mix(in srgb, ${palette.success} ${darkMode ? 18 : 12}%, transparent)`,
    '--theme-warning-soft': `color-mix(in srgb, ${palette.warning} ${darkMode ? 18 : 12}%, transparent)`,
    '--theme-danger-soft': `color-mix(in srgb, ${palette.danger} ${darkMode ? 18 : 12}%, transparent)`,
    '--theme-info-soft': `color-mix(in srgb, var(--theme-info) ${darkMode ? 18 : 12}%, transparent)`,
    '--theme-accent-soft': `color-mix(in srgb, ${accent} ${darkMode ? 18 : 12}%, transparent)`,
    '--theme-accent-alt-soft': `color-mix(in srgb, ${accentAlt} ${darkMode ? 18 : 12}%, transparent)`,
    '--theme-overlay-surface': darkMode
      ? `color-mix(in srgb, ${accent} 13%, rgba(255,255,255,0.07))`
      : `color-mix(in srgb, ${accentAlt} 9%, rgba(255,255,255,0.78))`,
    '--theme-overlay-border': darkMode
      ? `color-mix(in srgb, ${accentAlt} 30%, ${palette.borderStrong})`
      : `color-mix(in srgb, ${accent} 24%, ${palette.borderStrong})`,
    '--overlay-soft': palette.overlaySoft,
    '--overlay-dark': palette.overlay,
    '--overlay-strong': palette.overlayStrong,
    '--control-solid-bg': darkMode ? 'rgba(17, 24, 39, 0.82)' : 'rgba(255, 255, 255, 0.86)',
    '--comp-overlay-bg': darkMode ? 'rgba(2, 6, 23, 0.54)' : 'rgba(255, 255, 255, 0.62)',
    '--comp-dropdown-bg': palette.dropdownBg,
    '--app-bg-base': palette.canvas,
    '--app-bg-vignette': darkMode ? 'rgba(96, 165, 250, 0.16)' : 'rgba(37, 99, 235, 0.09)',
    '--app-bg-noise-opacity': darkMode ? '0.05' : '0.025',
    '--theme-app-bg': `radial-gradient(circle at 8% 2%, color-mix(in srgb, ${accent} ${darkMode ? 34 : 14}%, transparent), transparent 34%), radial-gradient(circle at 90% 8%, color-mix(in srgb, ${accentAlt} ${darkMode ? 30 : 12}%, transparent), transparent 40%), ${palette.appGradient}`,
    '--theme-header-bg': darkMode
      ? `linear-gradient(180deg, color-mix(in srgb, ${accent} 16%, #0B1120), ${palette.canvas})`
      : `linear-gradient(180deg, color-mix(in srgb, ${accent} 8%, #FFFFFF), ${palette.canvasAlt})`,
    '--theme-watched-bg': darkMode
      ? `linear-gradient(100deg, color-mix(in srgb, ${palette.success} 16%, rgba(15,23,42,0.72)), color-mix(in srgb, ${accent} 10%, rgba(15,23,42,0.52)))`
      : `linear-gradient(100deg, color-mix(in srgb, ${palette.success} 12%, #ffffff), color-mix(in srgb, ${accent} 7%, #ffffff))`,
    '--detail-shell-bg': darkMode
      ? `linear-gradient(145deg, color-mix(in srgb, ${palette.canvas} 92%, #000), color-mix(in srgb, ${palette.canvasAlt} 84%, #000) 56%, color-mix(in srgb, ${accent} 10%, ${palette.canvas}))`
      : `linear-gradient(145deg, #ffffff, color-mix(in srgb, ${palette.canvasAlt} 88%, #ffffff) 56%, color-mix(in srgb, ${accentAlt} 7%, #ffffff))`,
    '--detail-panel-bg': darkMode
      ? `color-mix(in srgb, ${palette.surfaceSolid} 70%, rgba(2,6,23,0.74))`
      : `color-mix(in srgb, #ffffff 82%, ${palette.canvasAlt})`,
    '--theme-scroll-track': darkMode ? 'rgba(15, 23, 42, 0.72)' : 'rgba(226, 232, 240, 0.82)',
    '--theme-scroll-thumb': darkMode ? 'rgba(148, 163, 184, 0.36)' : 'rgba(100, 116, 139, 0.35)',
    '--theme-scroll-thumb-hover': darkMode ? 'rgba(203, 213, 225, 0.52)' : 'rgba(71, 85, 105, 0.52)',
    '--focus-ring': `0 0 0 3px color-mix(in srgb, ${accent} 28%, transparent)`,
    '--shadow-soft': palette.shadowSoft,
    '--shadow-elevated': palette.shadowElevated,
  };
};

export const composeLegacyTheme = (darkMode) => {
  const palette = getColorModeTokens(darkMode);
  return {
    appBg: 'var(--app-bg-base)',
    headerBg: 'var(--theme-header-bg)',
    headerBorder: 'var(--theme-border)',
    navBg: 'var(--theme-surface)',
    navBorder: 'var(--theme-border)',
    filterBg: 'transparent',
    filterBorder: 'var(--theme-border)',
    surfaceBg: 'transparent',
    surfaceBorder: 'var(--theme-border)',
    rowHoverBg: 'var(--theme-surface-hover)',
    rowWatchedBg: 'var(--theme-watched-bg)',
    rowBorder: 'var(--theme-border)',
    expandBg: 'var(--theme-surface)',
    expandBorder: 'var(--theme-border)',
    pillBg: 'var(--theme-surface)',
    pillBorder: 'var(--theme-border)',
    pillText: 'var(--theme-text-muted)',
    pillHoverBorder: 'var(--theme-border-strong)',
    pillHoverText: 'var(--theme-text-secondary)',
    inputBg: palette.inputBg,
    inputBorder: 'var(--theme-border)',
    inputColor: 'var(--theme-text)',
    dropdownBg: palette.dropdownBg,
    dropdownBorder: 'var(--theme-border)',
    dropdownShadow: 'var(--shadow-elevated)',
    text: 'var(--theme-text)',
    textMuted: 'var(--theme-text-muted)',
    textFaint: 'var(--theme-text-disabled)',
    sortHoverBg: 'var(--theme-surface-hover)',
    statBg: 'var(--theme-surface)',
    statBorder: 'var(--theme-border)',
    numFaint: 'var(--theme-text-disabled)',
    footerText: 'var(--theme-text-muted)',
    scrollTrack: 'var(--theme-scroll-track)',
    scrollThumb: 'var(--theme-scroll-thumb)',
    scrollThumbH: 'var(--theme-scroll-thumb-hover)',
    hexDot: darkMode ? 'rgba(255,255,255,0.02)' : 'rgba(15,23,42,0.035)',
    switcherBg: 'var(--theme-surface)',
    switcherBorder: 'var(--theme-border)',
    phaseSummaryBg: 'var(--theme-surface)',
    phaseSummaryBorder: 'var(--theme-border)',
  };
};
