export const RHYTHM_SYSTEM_SOURCE = {
  upstream: 'https://github.com/cromaguy/Rhythm',
  sourceApp: 'Rhythm',
  adaptedFor: 'MCU Viewing Order',
  navigation: [
    { id: 'home', label: 'Home', role: 'dashboard' },
    { id: 'library', label: 'Library', role: 'phase-library' },
    { id: 'search', label: 'Search', role: 'finder' },
    { id: 'stats', label: 'Stats', role: 'progress' },
    { id: 'settings', label: 'Settings', role: 'preferences' },
  ],
  librarySurfaces: [
    { id: 'phases', label: 'Phases', description: 'Albums become MCU phase shelves.' },
    { id: 'status', label: 'Saved Status', description: 'Playback state becomes saved watch status.' },
    { id: 'continue', label: 'Continue', description: 'Recently played becomes continue watching.' },
  ],
  statusPlacements: {
    watched: 'Completed rail and phase meters',
    watching: 'Continue lane',
    'plan-to-watch': 'Watchlist shelf',
    'on-hold': 'Paused queue',
    dropped: 'Archived lane',
    unwatched: 'Library backlog',
  },
};

export const RHYTHM_STATUS_ORDER = [
  'watching',
  'plan-to-watch',
  'on-hold',
  'watched',
  'dropped',
  'unwatched',
];
