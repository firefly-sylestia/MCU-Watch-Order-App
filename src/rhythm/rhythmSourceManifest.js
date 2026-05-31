export const RHYTHM_UPSTREAM = {
  repository: 'https://github.com/cromaguy/Rhythm',
  sourceRoot: 'app/src',
  designSystem: 'Material 3 Expressive inspired Android shell',
  importedConcepts: [
    'adaptive navigation surfaces',
    'large hero home surface',
    'library-first content hierarchy',
    'persistent local-first user state',
    'dark and light dynamic palettes',
    'subtle press, hover, and selection feedback',
  ],
};

export const RHYTHM_APP_AREAS = [
  { id: 'home', label: 'Home', purpose: 'overview, continue watching, phase progress' },
  { id: 'library', label: 'Library', purpose: 'phase-grouped MCU titles and saved status edits' },
  { id: 'progress', label: 'Progress', purpose: 'completion analytics and status collections' },
  { id: 'settings', label: 'Settings', purpose: 'theme mode and saved-data controls' },
];
