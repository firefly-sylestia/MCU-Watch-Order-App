export const TYPE_META = {
  film: { label: 'Film', color: '#d4372f' },
  series: { label: 'Series', color: '#4a9ede' },
  short: { label: 'Short', color: '#a06cd5' },
};

export const FALLBACK_TYPE_META = { label: 'Title', color: 'var(--theme-text-secondary)' };

export const STATUS_META = {
  watched: { label: 'Completed', color: '#e11d48', bg: 'rgba(225,29,72,0.12)' },
  'plan-to-watch': { label: 'Watchlist', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
  watching: { label: 'In Progress', color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)' },
  'on-hold': { label: 'Paused', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  dropped: { label: 'Dropped', color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
  unwatched: { label: 'Unwatched', color: 'var(--theme-text-secondary)', bg: 'transparent' },
};

export const SORT_LABELS = { order: 'Chronological', year: 'By Year', title: 'Alphabetical', runtime: 'Runtime', watched: 'Recently Watched', status: 'By Status' };
export const HIDDEN_FILTER_STATUSES = new Set(['watched', 'dropped']);
export const TITLE_ROW_STATIC = {
  titleBtn: { overflow: 'hidden' },
  titleLine: { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  genreMeta: { marginTop: 2, fontSize: 10, fontFamily: 'var(--font-marvel-ui)', letterSpacing: 1.2 },
};
export const DESKTOP_TEXT_SCALES = [1, 1.25, 1.5, 1.75, 2];

export const MARVEL_UI_LEXICON = {
  'Navigation Panel': 'S.H.I.E.L.D. Command Deck',
  'Marvel Fan': 'Stark Initiative Agent',
  Dark: 'Night Ops',
  Light: 'Day Ops',
  'Calendar View': 'Multiverse Calendar',
  'List View': 'Mission List',
  'Quick Phases': 'Phase Jump',
  Analytics: 'Jarvis Analytics',
  'Viewing List': 'Mission Archive',
  WATCHED: 'MISSIONS CLEARED',
  'CONTINUE WATCHING': 'CONTINUE MISSION',
  Preferences: 'Protocol Settings',
  'Dark Theme': 'Night Protocol',
  'Spoiler Safe': 'Spoiler Shield',
  'Performance Mode': 'Arc Reactor Boost',
  'Enable scaling': 'Enable HUD scaling',
  'Backup & Restore': 'Stark Backup Vault',
  'Danger Zone': 'Red Room Alert',
  'S.H.I.E.L.D. Intel Search': 'F.R.I.D.A.Y. Intel Search',
  'Locate any Marvel story node': 'Locate any Marvel timeline node',
  'Back to Home': 'Return to Helicarrier',
  'Back to Home Carousel': 'Return to Helicarrier Deck',
  'Type to begin searching': 'Type to scan the multiverse',
  'Clear Search': 'Clear Scan',
};

export const LIST_MODES = [
  { id: 'core', label: 'MCU', sublabel: 'Curated List', color: '#c0392b', desc: '60 curated films & series' },
  { id: 'extended', label: 'Extended', sublabel: 'Full Chronological', color: '#4a9ede', desc: 'All entries incl. Netflix, SHIELD & more' },
];

export const CACHE_KEYS = {
  poster: 'mcu-poster-cache-v1',
  meta: 'mcu-meta-cache-v1',
  posterExportFailures: 'mcu-poster-export-failures-v1',
  userActions: 'mcu-user-actions-v1',
  userActionsLikes: 'mcu-user-actions-likes-v1',
  userActionsRatings: 'mcu-user-actions-ratings-v1',
  userActionsRewatch: 'mcu-user-actions-rewatch-v1',
  userActionsBookmarks: 'mcu-user-actions-bookmarks-v1',
  userActionsReviews: 'mcu-user-actions-reviews-v1',
  uiState: 'mcu-ui-state-v1',
  heroCarousel: 'mcu-hero-carousel-cache-v1',
};

export const UI_STATE_DEFAULTS = {
  listMode: 'core',
  search: '',
  sortBy: 'order',
  essentialOnly: false,
  watchedOnly: false,
  statusFilter: null,
  typeFilter: null,
  activePhase: 1,
  filtersOpen: false,
  viewMode: 'list',
  densityMode: 'comfortable',
  timelineMode: 'release',
  autoHideStatuses: false,
  performanceMode: true,
  desktopTextScale: 1,
  textScaleEnabled: true,
  scrollTop: 0,
  exportPrefs: { font: 'inter', textScale: 1.08, detailUseReviewStyle: true },
};
