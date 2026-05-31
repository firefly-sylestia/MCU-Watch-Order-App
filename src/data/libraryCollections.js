import { ESSENTIAL_LIST } from './mcuData';
import { AFTER_CREDITS, AFTER_CREDITS_DEFAULT } from './afterCreditsData';
import { SONY_MARVEL_TITLE_SET } from './timelineModes';

const essentialTitles = new Set(ESSENTIAL_LIST.map((item) => item.title));

const includesAny = (value, terms) => {
  const haystack = String(value || '').toLowerCase();
  return terms.some((term) => haystack.includes(term));
};

export const COLLECTION_ROOMS = [
  {
    id: 'infinity-saga',
    title: 'Infinity Saga',
    description: 'The foundational arc from first heroes through the Endgame finale.',
    accent: '#f59e0b',
    icon: '∞',
    sortMode: 'release',
    criteria: (item, { universe } = {}) => universe !== 'dc' && Number(item.phase) <= 3,
  },
  {
    id: 'multiverse-saga',
    title: 'Multiverse Saga',
    description: 'Branches, variants, post-Endgame legacy handoffs, and Secret Wars setup.',
    accent: '#8b5cf6',
    icon: '⌁',
    sortMode: 'release',
    criteria: (item, { universe } = {}) => universe !== 'dc' && Number(item.phase) >= 4,
  },
  {
    id: 'cosmic',
    title: 'Cosmic Shelf',
    description: 'Guardians, Asgardians, galaxies, gods, Kree, Skrulls, and off-world conflicts.',
    accent: '#38bdf8',
    icon: '✦',
    sortMode: 'release',
    criteria: (item) => includesAny(`${item.title} ${item.desc || ''}`, ['guardians', 'galaxy', 'thor', 'marvels', 'captain marvel', 'skrull', 'kree', 'eternals', 'nova', 'silver surfer', 'fantastic four']),
  },
  {
    id: 'magic-myth',
    title: 'Magic & Myth',
    description: 'Mystic arts, witches, monsters, gods, supernatural corners, and mythic lore.',
    accent: '#a855f7',
    icon: '◈',
    sortMode: 'chronological',
    criteria: (item) => includesAny(`${item.title} ${item.desc || ''}`, ['doctor strange', 'wanda', 'agatha', 'witch', 'moon knight', 'blade', 'werewolf', 'thor', 'loki', 'myth', 'asgard']),
  },
  {
    id: 'street-level',
    title: 'Street-Level Heroes',
    description: 'Grounded city stories, spies, vigilantes, law, crime, and neighborhood stakes.',
    accent: '#ef4444',
    icon: '▥',
    sortMode: 'release',
    criteria: (item) => includesAny(`${item.title} ${item.desc || ''}`, ['spider-man', 'daredevil', 'punisher', 'echo', 'hawkeye', 'black widow', 'falcon', 'winter soldier', 'she-hulk', 'defenders', 'jessica jones', 'luke cage', 'iron fist', 'shang-chi']),
  },
  {
    id: 'after-credits',
    title: 'After-Credits Important',
    description: 'Titles with stingers that matter for future setup, callbacks, or continuity.',
    accent: '#f97316',
    icon: '↝',
    sortMode: 'release',
    criteria: (item) => {
      const meta = AFTER_CREDITS[item.title] || AFTER_CREDITS_DEFAULT;
      return meta.advice === 'must' || (Array.isArray(meta.connectsTo) && meta.connectsTo.length > 0);
    },
  },
  {
    id: 'essentials',
    title: 'Essentials Only',
    description: 'The shortest high-signal route through the core continuity.',
    accent: '#eab308',
    icon: '★',
    sortMode: 'release',
    criteria: (item) => Boolean(item.essential) || essentialTitles.has(item.title),
  },
  {
    id: 'shorts-specials',
    title: 'Shorts and Specials',
    description: 'One-Shots, seasonal specials, shorts, and compact side stories.',
    accent: '#ec4899',
    icon: '✺',
    sortMode: 'release',
    criteria: (item) => item.type === 'short' || includesAny(item.title, ['one-shot', 'special', 'i am groot', 'team thor', 'holiday']),
  },
  {
    id: 'series-library',
    title: 'Series Library',
    description: 'Disney+, TV seasons, and episodic branches organized as a dedicated shelf.',
    accent: '#3b82f6',
    icon: '▤',
    sortMode: 'release',
    criteria: (item) => item.type === 'series',
  },
  {
    id: 'spider-verse-sony',
    title: 'Spider-Verse / Sony',
    description: 'Legacy Spider-Man films, animated Spider-Verse, and Sony-adjacent branches.',
    accent: '#dc2626',
    icon: '⌬',
    sortMode: 'release',
    criteria: (item, { universe } = {}) => universe !== 'dc' && (SONY_MARVEL_TITLE_SET.has(item.title) || includesAny(item.title, ['spider-man', 'venom', 'morbius', 'kraven', 'madame web'])),
  },
  {
    id: 'dc-universe',
    title: 'DC Universe',
    description: 'DCEU, Elseworlds, and the new DCU grouped as one archive room.',
    accent: '#2563eb',
    icon: '◆',
    sortMode: 'release',
    dcOnly: true,
    criteria: (_item, { universe } = {}) => universe === 'dc',
  },
];

export const getVisibleCollectionRooms = (universe = 'mcu') => COLLECTION_ROOMS.filter((collection) => !collection.dcOnly || universe === 'dc');

export const collectionMatchesItem = (collection, item, context = {}) => {
  if (!collection || !item) return false;
  if (Array.isArray(collection.titleIds) && collection.titleIds.includes(item.id)) return true;
  if (Array.isArray(collection.titles) && collection.titles.includes(item.title)) return true;
  return typeof collection.criteria === 'function' ? collection.criteria(item, context) : false;
};

export const getCollectionById = (id) => COLLECTION_ROOMS.find((collection) => collection.id === id);
