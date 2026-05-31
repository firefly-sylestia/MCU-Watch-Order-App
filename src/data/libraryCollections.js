const normalize = (value) => String(value || '').toLowerCase();

const spiderTitles = [
  'Spider-Man',
  'Spider-Man 2',
  'Spider-Man 3',
  'The Amazing Spider-Man',
  'The Amazing Spider-Man 2',
  'Spider-Man: Homecoming',
  'Spider-Man: Far From Home',
  'Spider-Man: No Way Home',
  'Spider-Man: Into the Spider-Verse',
  'Spider-Man: Across the Spider-Verse',
  'Spider-Man Noir',
  'Spider-Man: Beyond the Spider-Verse (TBA)',
  'Venom',
  'Venom: Let There Be Carnage',
  'Venom: The Last Dance',
  'Morbius',
  'Madame Web',
  'Kraven the Hunter',
];

export const LIBRARY_COLLECTIONS = {
  mcu: [
    { id: 'mcu-infinity-saga', universe: 'mcu', title: 'Infinity Saga', description: 'Phase 1 through Phase 3 core saga entries.', accent: '#e23636', icon: '✨', match: { phases: [1, 2, 3], types: ['film', 'series'] } },
    { id: 'mcu-multiverse-saga', universe: 'mcu', title: 'Multiverse Saga', description: 'Phase 4 onward, including alternate timelines and variants.', accent: '#7c3aed', icon: '🌀', match: { phases: [4, 5, 6], types: ['film', 'series'] } },
    { id: 'mcu-street-level', universe: 'mcu', title: 'Defenders / Street-Level', description: 'Daredevil, Jessica Jones, Luke Cage, Iron Fist, Punisher, and grounded city stories.', accent: '#f97316', icon: '🏙️', match: { titleIncludes: ['daredevil', 'jessica jones', 'luke cage', 'iron fist', 'defenders', 'punisher', 'echo', 'hawkeye'] } },
    { id: 'mcu-spider-verse', universe: 'mcu', title: 'Spider-Verse / Sony Marvel', description: 'MCU Spider-Man plus Sony and animated Spider-adjacent stories.', accent: '#ef4444', icon: '🕸️', match: { titleSet: spiderTitles, titleIncludes: ['spider-man', 'venom', 'morbius', 'madame web', 'kraven'] } },
    { id: 'mcu-cosmic', universe: 'mcu', title: 'Cosmic Stories', description: 'Space, Asgard, Guardians, Captain Marvel, and galaxy-scale arcs.', accent: '#22d3ee', icon: '🚀', match: { titleIncludes: ['guardians', 'thor', 'loki', 'captain marvel', 'the marvels', 'eternals', 'secret invasion', 'fantastic four', 'silver surfer'] } },
    { id: 'mcu-animated-specials', universe: 'mcu', title: 'Animated / Specials', description: 'Animated entries, one-shots, shorts, and special presentations.', accent: '#a3e635', icon: '🎞️', match: { types: ['short'], titleIncludes: ['what if', 'i am groot', 'zombies', 'animated', 'special presentation', 'holiday special', 'werewolf by night', 'spider-verse', 'friendly neighborhood'] } },
    { id: 'mcu-series', universe: 'mcu', title: 'Series', description: 'Serialized Marvel chapters across Disney+, Netflix, and connected TV.', accent: '#60a5fa', icon: '📺', match: { types: ['series'] } },
    { id: 'mcu-films', universe: 'mcu', title: 'Films', description: 'Feature-length Marvel theatrical and streaming movie entries.', accent: '#facc15', icon: '🎬', match: { types: ['film'] } },
    { id: 'mcu-upcoming', universe: 'mcu', title: 'Upcoming', description: 'Planned, TBA, or future-dated Marvel roadmap entries.', accent: '#38bdf8', icon: '⏳', match: { upcoming: true } },
  ],
  dc: [
    { id: 'dc-dceu-main', universe: 'dc', title: 'DCEU / Main Continuity', description: 'The primary DCEU run from Wonder Woman through the 2023 finale.', accent: '#1f6feb', icon: '🛡️', match: { phases: [1, 2, 3] } },
    { id: 'dc-batman', universe: 'dc', title: 'Batman Collection', description: 'Batman, Gotham, Joker, and Bat-family adjacent entries.', accent: '#64748b', icon: '🦇', match: { titleIncludes: ['batman', 'joker', 'birds of prey', 'the flash'] } },
    { id: 'dc-superman', universe: 'dc', title: 'Superman Collection', description: 'Superman-centered stories and major Kryptonian continuity chapters.', accent: '#38bdf8', icon: '☀️', match: { titleIncludes: ['superman', 'man of steel', 'justice league'] } },
    { id: 'dc-justice-league', universe: 'dc', title: 'Justice League', description: 'Team-up stories and direct lead-ins to the League.', accent: '#60a5fa', icon: '⚡', match: { titleIncludes: ['justice league', 'batman v superman', 'the flash', 'aquaman', 'wonder woman'] } },
    { id: 'dc-animated', universe: 'dc', title: 'Animated DC', description: 'Animated DC Universe stories currently tracked in the library.', accent: '#22c55e', icon: '🎞️', match: { titleIncludes: ['creature commandos'], types: ['short'] } },
    { id: 'dc-series', universe: 'dc', title: 'Series', description: 'Serialized DC chapters and streaming seasons.', accent: '#a78bfa', icon: '📺', match: { types: ['series'] } },
    { id: 'dc-films', universe: 'dc', title: 'Films', description: 'Feature-length DC theatrical and streaming films.', accent: '#facc15', icon: '🎬', match: { types: ['film'] } },
    { id: 'dc-upcoming', universe: 'dc', title: 'Upcoming', description: 'Future-dated or explicitly upcoming DC titles.', accent: '#38bdf8', icon: '⏳', match: { upcoming: true } },
    { id: 'dc-elseworlds', universe: 'dc', title: 'Elseworlds', description: 'Standalone alternate-continuity DC stories.', accent: '#8b5cf6', icon: '🌙', match: { phases: [4], titleIncludes: ['elseworlds', 'joker', 'the batman'] } },
  ],
};

export function getCollectionsForUniverse(universe) {
  return LIBRARY_COLLECTIONS[universe === 'dc' ? 'dc' : 'mcu'] || LIBRARY_COLLECTIONS.mcu;
}

function isUpcomingItem(item) {
  if (!item) return false;
  if (item.upcoming === true) return true;
  const releaseStatus = normalize(item.releaseStatus);
  if (releaseStatus === 'upcoming' || releaseStatus === 'tba') return true;
  const parsed = item.releaseDate ? Date.parse(item.releaseDate) : NaN;
  if (Number.isFinite(parsed) && parsed > Date.now()) return true;
  return normalize(item.title).includes('tba') || normalize(item.prereq).includes('tba');
}

export function collectionMatchesItem(collection, item) {
  if (!collection || !item) return false;
  const match = collection.match || {};
  const hasCriteria = Object.values(match).some(value => Array.isArray(value) ? value.length > 0 : Boolean(value));
  if (!hasCriteria) return false;

  if (Array.isArray(match.phases) && match.phases.length && match.phases.includes(Number(item.phase))) return true;
  if (Array.isArray(match.types) && match.types.length && match.types.includes(item.type)) return true;

  const title = normalize(item.title);
  if (Array.isArray(match.titleSet) && match.titleSet.some(entry => normalize(entry) === title)) return true;
  if (Array.isArray(match.titleIncludes) && match.titleIncludes.some(part => title.includes(normalize(part)))) return true;
  if (match.upcoming && isUpcomingItem(item)) return true;

  return false;
}
