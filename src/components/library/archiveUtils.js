export const COLLECTIONS = [
  { id: 'infinity', label: 'Infinity Saga', description: 'The founding arc from Phase 1 through Endgame.', test: (item) => Number(item.phase) >= 1 && Number(item.phase) <= 3 },
  { id: 'multiverse', label: 'Multiverse Saga', description: 'Branching timelines, variants, incursions, and Phase 4+ stories.', test: (item) => Number(item.phase) >= 4 || /multiverse|loki|what if|variant|incursion|deadpool|x-men|spider-verse/i.test(`${item.title} ${item.desc || ''}`) },
  { id: 'cosmic', label: 'Cosmic', description: 'Spacefaring, alien, and galaxy-scale chapters.', test: (item) => /guardian|galaxy|marvels|captain marvel|thor|loki|eternals|quantumania|infinity|cosmic|skrull|kree|nova|wakanda/i.test(`${item.title} ${item.desc || ''}`) },
  { id: 'magic', label: 'Magic & Myth', description: 'Mystic arts, gods, witches, monsters, and supernatural lore.', test: (item) => /strange|wanda|vision|agatha|witch|magic|myth|thor|moon knight|werewolf|blade|eternals|sacred|supernatural/i.test(`${item.title} ${item.desc || ''}`) },
  { id: 'street', label: 'Street-Level', description: 'Grounded heroes, spies, neighborhoods, and vigilantes.', test: (item) => /daredevil|punisher|echo|hawkeye|spider|falcon|winter soldier|black widow|she-hulk|cage|jessica|iron fist|street|shield/i.test(`${item.title} ${item.desc || ''}`) },
  { id: 'series', label: 'Series', description: 'Episode-first library entries.', test: (item) => item.type === 'series' },
  { id: 'shorts', label: 'Shorts/Specials', description: 'One-shots, specials, and short-form extras.', test: (item) => item.type === 'short' || /special|one-shot|i am groot|holiday|short/i.test(`${item.title} ${item.desc || ''}`) },
  { id: 'essentials', label: 'Essentials', description: 'High-signal entries for a tighter watch path.', test: (item) => Boolean(item.essential) },
  { id: 'afterCredits', label: 'After-Credits Important', description: 'Entries with credits scenes that connect future stories.', test: (_item, after) => Boolean(after?.important || after?.connectsTo?.length || after?.note) },
];

export const DC_COLLECTION = { id: 'dc', label: 'DC Collection', description: 'DC universe titles and continuity shelves.', test: () => true };

export const typeLabel = (type) => ({ film: 'Film', series: 'Series', short: 'Short' }[type] || 'Title');

export const statusLabel = (status) => ({
  watched: 'Completed',
  'plan-to-watch': 'Watchlist',
  watching: 'In Progress',
  'on-hold': 'Paused',
  dropped: 'Dropped',
  unwatched: 'Unwatched',
}[status] || 'Unwatched');

export const releaseLabel = (item) => item.releaseLabel || item.releaseStatus || (item.year ? String(item.year) : 'TBA');

export const estimateRuntime = (item) => {
  if (!item) return '—';
  if (item.runtime) return `${item.runtime}m`;
  if (item.type === 'film') return '~2h 18m';
  if (item.type === 'short') return '~12m';
  return item.episodes ? `${item.episodes} eps` : 'Series';
};

export const uniqueById = (items = []) => {
  const seen = new Set();
  return items.filter((item) => {
    if (!item || seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
};
