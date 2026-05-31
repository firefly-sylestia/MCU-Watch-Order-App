import { ESSENTIAL_LIST, PHASES } from './mcuData.js';
import { DC_PHASES } from './dcData.js';
import { AFTER_CREDITS, AFTER_CREDITS_DEFAULT } from './afterCreditsData.js';
import { SONY_MARVEL_TITLE_SET } from './timelineModes.js';

const essentialTitles = new Set(ESSENTIAL_LIST.map((item) => item.title));
const titleIncludes = (item, terms) => terms.some((term) => item.title.toLowerCase().includes(term));

export const LIBRARY_COLLECTIONS = [
  {
    id: 'infinity-saga',
    title: 'Infinity Saga',
    description: 'The foundational MCU run from Phase 1 through Endgame-era Phase 3.',
    accent: '#f59e0b',
    icon: '∞',
    sortMode: 'release',
    criteria: (item, context) => context.universe !== 'dc' && item.phase >= 1 && item.phase <= 3,
  },
  {
    id: 'multiverse-saga',
    title: 'Multiverse Saga',
    description: 'Reality-bending projects, post-Endgame fallout, and branch-timeline stories.',
    accent: '#8b5cf6',
    icon: '◇',
    sortMode: 'chronological',
    criteria: (item, context) => context.universe !== 'dc' && (item.phase >= 4 || /multiverse|what if|loki|deadpool|variant|timeline/i.test(`${item.title} ${item.desc || ''}`)),
  },
  {
    id: 'cosmic',
    title: 'Cosmic Shelf',
    description: 'Guardians, gods, space empires, and off-world mythology.',
    accent: '#38bdf8',
    icon: '✦',
    sortMode: 'release',
    criteria: (item) => titleIncludes(item, ['guardians', 'thor', 'marvel', 'eternals', 'infinity war', 'endgame', 'nova', 'groot']),
  },
  {
    id: 'magic-myth',
    title: 'Magic & Myth',
    description: 'Mystic arts, witches, monsters, gods, and supernatural entries.',
    accent: '#a855f7',
    icon: '✹',
    sortMode: 'chronological',
    criteria: (item) => titleIncludes(item, ['doctor strange', 'wanda', 'agatha', 'moon knight', 'blade', 'werewolf', 'thor', 'loki', 'what if']),
  },
  {
    id: 'street-level',
    title: 'Street-Level Heroes',
    description: 'Grounded vigilantes, neighborhoods, espionage, and city-scale stakes.',
    accent: '#ef4444',
    icon: '▣',
    sortMode: 'release',
    criteria: (item) => titleIncludes(item, ['daredevil', 'punisher', 'jessica jones', 'luke cage', 'iron fist', 'defenders', 'hawkeye', 'echo', 'spider-man', 'winter soldier', 'black widow']),
  },
  {
    id: 'after-credits',
    title: 'After-Credits Important',
    description: 'Titles with stingers that set up important future viewing context.',
    accent: '#f97316',
    icon: '◒',
    sortMode: 'release',
    criteria: (item) => {
      const meta = AFTER_CREDITS[item.title] || AFTER_CREDITS_DEFAULT;
      return meta.advice === 'must' || Number(meta.count) > 0 || (Array.isArray(meta.connectsTo) && meta.connectsTo.length > 0);
    },
  },
  {
    id: 'essentials',
    title: 'Essentials Only',
    description: 'The streamlined canon-forward list for high-signal viewing.',
    accent: '#eab308',
    icon: '★',
    sortMode: 'release',
    criteria: (item) => item.essential || essentialTitles.has(item.title),
  },
  {
    id: 'shorts-specials',
    title: 'Shorts and Specials',
    description: 'One-Shots, specials, shorts, and quick side-story entries.',
    accent: '#22c55e',
    icon: '◌',
    sortMode: 'release',
    criteria: (item) => item.type === 'short' || /one-shot|special|i am groot|holiday/i.test(item.title),
  },
  {
    id: 'series-library',
    title: 'Series Library',
    description: 'Disney+, Netflix-era, animated, and serialized television shelves.',
    accent: '#3b82f6',
    icon: '▤',
    sortMode: 'release',
    criteria: (item) => item.type === 'series',
  },
  {
    id: 'spider-verse-sony',
    title: 'Spider-Verse / Sony',
    description: 'Spider-Man legacy, animation, Sony-adjacent, and symbiote universe projects.',
    accent: '#dc2626',
    icon: '☄',
    sortMode: 'release',
    criteria: (item) => SONY_MARVEL_TITLE_SET.has(item.title) || /spider|venom|morbius|kraven|madame web/i.test(item.title),
  },
  {
    id: 'dc-universe',
    title: 'DC Universe',
    description: 'DC films and series grouped as a dedicated archive room.',
    accent: '#2563eb',
    icon: '◆',
    sortMode: 'release',
    universes: ['dc'],
    criteria: (_item, context) => context.universe === 'dc',
  },
];

export const phaseCollectionsForUniverse = (universe = 'mcu') => (universe === 'dc' ? DC_PHASES : PHASES).map((phase) => ({
  id: `phase-${phase.id}`,
  title: phase.name,
  description: phase.tagline || phase.summary || 'Release phase collection',
  accent: phase.color,
  icon: String(phase.id),
  sortMode: 'release',
  criteria: (item) => item.phase === phase.id,
}));

export const getLibraryCollections = (universe = 'mcu') => LIBRARY_COLLECTIONS.filter((collection) => !collection.universes || collection.universes.includes(universe));

export const collectionMatchesItem = (collection, item, context = {}) => {
  if (!collection || !item) return false;
  if (Array.isArray(collection.titleIds) && collection.titleIds.includes(item.id)) return true;
  if (Array.isArray(collection.titles) && collection.titles.includes(item.title)) return true;
  return typeof collection.criteria === 'function' ? collection.criteria(item, context) : false;
};
