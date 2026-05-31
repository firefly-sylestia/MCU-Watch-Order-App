const normalize = (value = '') => String(value).toLowerCase();

const titleSet = (titles) => titles.map(title => normalize(title));

export const LIBRARY_COLLECTIONS = {
  mcu: [
    {
      id: 'mcu-infinity-saga', universe: 'mcu', title: 'Infinity Saga', icon: '✨', accent: '#e23636',
      description: 'Phase 1 through Phase 3 core saga titles, from the first Avengers assembly through Endgame.',
      match: { phases: [1, 2, 3], types: ['film', 'series', 'short'] },
    },
    {
      id: 'mcu-multiverse-saga', universe: 'mcu', title: 'Multiverse Saga', icon: '🌀', accent: '#8b5cf6',
      description: 'Phase 4 through Phase 6 stories that expand variants, timelines, and new legacy heroes.',
      match: { phases: [4, 5, 6], types: ['film', 'series', 'short'] },
    },
    {
      id: 'mcu-street-level', universe: 'mcu', title: 'Defenders / Street-Level', icon: '🏙️', accent: '#f97316',
      description: 'Daredevil, Jessica Jones, Luke Cage, Iron Fist, Punisher, Echo, and grounded New York stories.',
      match: { titleIncludes: ['daredevil', 'jessica jones', 'luke cage', 'iron fist', 'defenders', 'punisher', 'echo', 'hawkeye'] },
    },
    {
      id: 'mcu-spider-verse', universe: 'mcu', title: 'Spider-Verse / Sony Marvel', icon: '🕸️', accent: '#ef4444',
      description: 'Spider-Man, Venom, Spider-Verse animation, and Sony-adjacent Marvel entries.',
      match: { titleIncludes: ['spider', 'venom', 'morbius', 'madame web', 'kraven'] },
    },
    {
      id: 'mcu-cosmic', universe: 'mcu', title: 'Cosmic Stories', icon: '🚀', accent: '#22c55e',
      description: 'Guardians, Thor, Captain Marvel, Eternals, Fantastic Four, and universe-spanning adventures.',
      match: { titleIncludes: ['guardians', 'thor', 'captain marvel', 'the marvels', 'eternals', 'fantastic four', 'silver surfer', 'nova', 'i am groot'] },
    },
    {
      id: 'mcu-animated-specials', universe: 'mcu', title: 'Animated / Specials', icon: '🎞️', accent: '#06b6d4',
      description: 'Animated seasons, shorts, and special presentations for a lighter branch through the library.',
      match: { types: ['short'], titleIncludes: ['what if', 'x-men', 'friendly neighborhood', 'i am groot', 'zombies', 'spider-man (2017)', 'maximum venom'] },
    },
    {
      id: 'mcu-series', universe: 'mcu', title: 'Series', icon: '📺', accent: '#4a9ede',
      description: 'All episodic entries in the current Marvel archive.',
      match: { types: ['series'] },
    },
    {
      id: 'mcu-films', universe: 'mcu', title: 'Films', icon: '🎬', accent: '#d4372f',
      description: 'Feature-length Marvel and Marvel-adjacent films in the active universe list.',
      match: { types: ['film'] },
    },
    {
      id: 'mcu-upcoming', universe: 'mcu', title: 'Upcoming', icon: '⏳', accent: '#f59e0b',
      description: 'Announced, dated, or TBA Marvel titles that are still ahead on the roadmap.',
      match: { upcoming: true },
    },
  ],
  dc: [
    {
      id: 'dc-dceu-main', universe: 'dc', title: 'DCEU / Main Continuity', icon: '🛡️', accent: '#2b6fff',
      description: 'The core DCEU run from Wonder Woman and Man of Steel through Aquaman and the Lost Kingdom.',
      match: { phases: [1, 2, 3], types: ['film', 'series'] },
    },
    {
      id: 'dc-batman', universe: 'dc', title: 'Batman Collection', icon: '🦇', accent: '#8b5cf6',
      description: 'Batman, Gotham, Joker, Harley-adjacent, and Dark Knight connected stories.',
      match: { titleIncludes: ['batman', 'joker', 'harley', 'birds of prey', 'suicide squad'] },
    },
    {
      id: 'dc-superman', universe: 'dc', title: 'Superman Collection', icon: '☀️', accent: '#ef4444',
      description: 'Superman and Kryptonian stories across the DC timeline.',
      match: { titleIncludes: ['superman', 'man of steel'] },
    },
    {
      id: 'dc-justice-league', universe: 'dc', title: 'Justice League', icon: '⚡', accent: '#22a4ff',
      description: 'Team-up and direct League-adjacent chapters across the DC archive.',
      match: { titleIncludes: ['justice league', 'batman v superman', 'the flash', 'aquaman', 'wonder woman', 'cyborg'] },
    },
    {
      id: 'dc-animated', universe: 'dc', title: 'Animated DC', icon: '🎞️', accent: '#06b6d4',
      description: 'Animated DC projects available in the active data set.',
      match: { titleIncludes: ['animated', 'creature commandos'] },
    },
    {
      id: 'dc-series', universe: 'dc', title: 'Series', icon: '📺', accent: '#4c8dff',
      description: 'All episodic DC entries in the current archive.',
      match: { types: ['series'] },
    },
    {
      id: 'dc-films', universe: 'dc', title: 'Films', icon: '🎬', accent: '#2b6fff',
      description: 'Feature-length DC films in the current archive.',
      match: { types: ['film'] },
    },
    {
      id: 'dc-upcoming', universe: 'dc', title: 'Upcoming', icon: '⏳', accent: '#f59e0b',
      description: 'Future DC titles with upcoming, TBA, or future-dated release metadata.',
      match: { upcoming: true },
    },
    {
      id: 'dc-elseworlds', universe: 'dc', title: 'Elseworlds', icon: '🌌', accent: '#a855f7',
      description: 'Standalone continuity stories outside the main DC thread.',
      match: { phases: [4], titleIncludes: ['joker', 'the batman'] },
    },
  ],
};

export function getCollectionsForUniverse(universe) {
  return LIBRARY_COLLECTIONS[universe === 'dc' ? 'dc' : 'mcu'] || LIBRARY_COLLECTIONS.mcu;
}

function isUpcomingItem(item) {
  if (!item) return false;
  const status = normalize(item.releaseStatus || item.status || item.releaseLabel);
  if (item.upcoming === true || status === 'upcoming' || status === 'tba' || status.includes('coming')) return true;
  if (item.releaseDate) {
    const time = Date.parse(item.releaseDate);
    if (Number.isFinite(time) && time > Date.now()) return true;
  }
  return false;
}

export function collectionMatchesItem(collection, item) {
  if (!collection || !item) return false;
  const match = collection.match || {};
  let hasCriteria = false;
  let matched = false;

  if (Array.isArray(match.phases) && match.phases.length) {
    hasCriteria = true;
    matched = matched || match.phases.includes(Number(item.phase));
  }

  if (Array.isArray(match.types) && match.types.length) {
    hasCriteria = true;
    matched = matched || match.types.includes(item.type);
  }

  if (Array.isArray(match.titleSet) && match.titleSet.length) {
    hasCriteria = true;
    const titles = new Set(titleSet(match.titleSet));
    matched = matched || titles.has(normalize(item.title));
  }

  if (Array.isArray(match.titleIncludes) && match.titleIncludes.length) {
    hasCriteria = true;
    const title = normalize(item.title);
    matched = matched || match.titleIncludes.some(fragment => title.includes(normalize(fragment)));
  }

  if (match.upcoming) {
    hasCriteria = true;
    matched = matched || isUpcomingItem(item);
  }

  return hasCriteria ? matched : false;
}
