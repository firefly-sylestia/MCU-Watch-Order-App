const titleKey = (value = '') => String(value || '').trim().toLowerCase();

const hasUpcomingSignal = (item) => {
  const status = String(item?.releaseStatus || '').toLowerCase();
  return Boolean(item?.upcoming)
    || status === 'upcoming'
    || status === 'tba'
    || status === 'announced';
};

export const LIBRARY_COLLECTIONS = {
  mcu: [
    {
      id: 'mcu-infinity-saga',
      universe: 'mcu',
      title: 'Infinity Saga',
      description: 'Phase 1 through Phase 3 core saga, from first assembly to Endgame.',
      accent: '#e23636',
      icon: '✨',
      match: { phases: [1, 2, 3], types: ['film', 'series', 'short'] },
    },
    {
      id: 'mcu-multiverse-saga',
      universe: 'mcu',
      title: 'Multiverse Saga',
      description: 'Phase 4 onward: variants, incursions, new teams, and cosmic consequences.',
      accent: '#8b5cf6',
      icon: '🌀',
      match: { phases: [4, 5, 6], types: ['film', 'series', 'short'] },
    },
    {
      id: 'mcu-defenders-street-level',
      universe: 'mcu',
      title: 'Defenders / Street-Level',
      description: 'Grounded vigilantes, Netflix-era heroes, and city-level Marvel stories.',
      accent: '#f97316',
      icon: '🏙️',
      match: { titleIncludes: ['daredevil', 'jessica jones', 'luke cage', 'iron fist', 'punisher', 'defenders', 'echo', 'hawkeye'] },
    },
    {
      id: 'mcu-spider-verse-sony',
      universe: 'mcu',
      title: 'Spider-Verse / Sony Marvel',
      description: 'Spider-Man, Venom, animated Spider-Verse, and adjacent Sony Marvel titles.',
      accent: '#ef4444',
      icon: '🕷️',
      match: { titleIncludes: ['spider', 'venom', 'morbius', 'kraven', 'madame web', 'noir'] },
    },
    {
      id: 'mcu-cosmic-stories',
      universe: 'mcu',
      title: 'Cosmic Stories',
      description: 'Guardians, Thor, Eternals, Captain Marvel, and galaxy-spanning arcs.',
      accent: '#22d3ee',
      icon: '🌌',
      match: { titleIncludes: ['guardians', 'thor', 'captain marvel', 'marvels', 'eternals', 'nova', 'fantastic four', 'silver surfer'] },
    },
    {
      id: 'mcu-animated-specials',
      universe: 'mcu',
      title: 'Animated / Specials',
      description: 'Animated chapters, one-shots, holiday specials, and short-form entries.',
      accent: '#f59e0b',
      icon: '🎞️',
      match: { types: ['short'], titleIncludes: ['what if', 'animated', 'special', 'one-shot', 'one shot', 'zombies', 'freshman', 'friendly neighborhood'] },
    },
    {
      id: 'mcu-series',
      universe: 'mcu',
      title: 'Series',
      description: 'Episodic Marvel stories across Disney+, Netflix, ABC, and more.',
      accent: '#4a9ede',
      icon: '📺',
      match: { types: ['series'] },
    },
    {
      id: 'mcu-films',
      universe: 'mcu',
      title: 'Films',
      description: 'Feature-length Marvel movies in the current viewing library.',
      accent: '#d4372f',
      icon: '🎬',
      match: { types: ['film'] },
    },
    {
      id: 'mcu-upcoming',
      universe: 'mcu',
      title: 'Upcoming / TBA',
      description: 'Announced, dated, and TBA Marvel titles surfaced by the data set.',
      accent: '#25c4a0',
      icon: '⏳',
      match: { upcoming: true },
    },
  ],
  dc: [
    {
      id: 'dc-dceu-main',
      universe: 'dc',
      title: 'DCEU / Main Continuity',
      description: 'Core connected DC films from Man of Steel through the DCEU finale era.',
      accent: '#1f6feb',
      icon: '🛡️',
      match: { phases: [1, 2, 3], types: ['film', 'series'] },
    },
    {
      id: 'dc-batman-collection',
      universe: 'dc',
      title: 'Batman Collection',
      description: 'Batman, Gotham, Joker, Harley, and Bat-family connected titles.',
      accent: '#64748b',
      icon: '🦇',
      match: { titleIncludes: ['batman', 'joker', 'birds of prey', 'harley', 'gotham'] },
    },
    {
      id: 'dc-superman-collection',
      universe: 'dc',
      title: 'Superman Collection',
      description: 'Superman-led titles and stories rooted in Kryptonian legacy.',
      accent: '#3b82f6',
      icon: '☀️',
      match: { titleIncludes: ['superman', 'man of steel'] },
    },
    {
      id: 'dc-justice-league',
      universe: 'dc',
      title: 'Justice League',
      description: 'Team-up entries and chapters that build around DC’s league of heroes.',
      accent: '#60a5fa',
      icon: '⚖️',
      match: { titleIncludes: ['justice league', 'batman v superman', 'wonder woman', 'aquaman', 'flash', 'cyborg'] },
    },
    {
      id: 'dc-animated',
      universe: 'dc',
      title: 'Animated DC',
      description: 'Animated DC titles currently represented in the library data.',
      accent: '#a78bfa',
      icon: '🎞️',
      match: { titleIncludes: ['animated', 'creature commandos'] },
    },
    {
      id: 'dc-series',
      universe: 'dc',
      title: 'Series',
      description: 'Serialized DC stories and season-based entries.',
      accent: '#22a4ff',
      icon: '📺',
      match: { types: ['series'] },
    },
    {
      id: 'dc-films',
      universe: 'dc',
      title: 'Films',
      description: 'Feature-length DC movies in the active library.',
      accent: '#2563eb',
      icon: '🎬',
      match: { types: ['film'] },
    },
    {
      id: 'dc-elseworlds',
      universe: 'dc',
      title: 'Elseworlds',
      description: 'Standalone DC stories outside the primary continuity.',
      accent: '#8b5cf6',
      icon: '🌗',
      match: { phases: [4], titleIncludes: ['joker', 'the batman'] },
    },
    {
      id: 'dc-upcoming',
      universe: 'dc',
      title: 'Upcoming / TBA',
      description: 'Future-facing DC titles marked as upcoming in the data.',
      accent: '#38bdf8',
      icon: '⏳',
      match: { upcoming: true },
    },
  ],
};

export function getCollectionsForUniverse(universe = 'mcu') {
  return LIBRARY_COLLECTIONS[universe === 'dc' ? 'dc' : 'mcu'] || LIBRARY_COLLECTIONS.mcu;
}

export function collectionMatchesItem(collection, item) {
  if (!collection || !item) return false;

  const match = collection.match || {};
  const hasCriteria = ['phases', 'types', 'titleSet', 'titleIncludes'].some((key) => Array.isArray(match[key]) && match[key].length > 0)
    || typeof match.upcoming === 'boolean';
  if (!hasCriteria) return false;

  if (Array.isArray(match.phases) && match.phases.length > 0 && match.phases.includes(Number(item.phase))) {
    return true;
  }

  if (Array.isArray(match.types) && match.types.length > 0 && match.types.includes(String(item.type || '').toLowerCase())) {
    return true;
  }

  const normalizedTitle = titleKey(item.title);
  if (Array.isArray(match.titleSet) && match.titleSet.length > 0) {
    const titleSet = new Set(match.titleSet.map(titleKey));
    if (titleSet.has(normalizedTitle)) return true;
  }

  if (Array.isArray(match.titleIncludes) && match.titleIncludes.length > 0) {
    if (match.titleIncludes.map(titleKey).some((needle) => needle && normalizedTitle.includes(needle))) return true;
  }

  if (match.upcoming === true && hasUpcomingSignal(item)) return true;
  if (match.upcoming === false && !hasUpcomingSignal(item)) return true;

  return false;
}
