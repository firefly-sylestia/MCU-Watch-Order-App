export const TIMELINE_MODES = [
  { id: 'release', label: 'Release Order', desc: 'Original theatrical/stream release cadence.' },
  { id: 'chronological', label: 'Chronological Story Order', desc: 'In-universe story progression.' },
  { id: 'loki-journey', label: 'Character POV: Loki Journey', desc: 'Focuses on Loki arc and adjacent titles.' },
  { id: 'wanda-arc', label: 'Character POV: Wanda Arc', desc: 'Focuses on Wanda Maximoff story path.' },
  { id: 'multiverse-map', label: 'Branching Multiverse Map', desc: 'Prioritizes variant branches and nexus titles.' },
];

export const AFTER_CREDITS_META = {
  'Iron Man': { count: 1, urgency: 'must', connectsTo: ['The Incredible Hulk', 'The Avengers'] },
  'The Incredible Hulk': { count: 1, urgency: 'can-skip', connectsTo: ['The Avengers'] },
  'Iron Man 2': { count: 1, urgency: 'must', connectsTo: ['Thor'] },
  'Thor': { count: 1, urgency: 'must', connectsTo: ['The Avengers'] },
  'Captain America: The First Avenger': { count: 1, urgency: 'must', connectsTo: ['The Avengers'] },
  'The Avengers': { count: 1, urgency: 'must', connectsTo: ['Thor: The Dark World'] },
  'Captain America: Civil War': { count: 2, urgency: 'must', connectsTo: ['Black Panther', 'Spider-Man: Homecoming'] },
  'Avengers: Infinity War': { count: 1, urgency: 'must', connectsTo: ['Captain Marvel', 'Avengers: Endgame'] },
  'Avengers: Endgame': { count: 1, urgency: 'must', connectsTo: ['Loki S1', 'WandaVision S1'] },
  'Black Widow': { count: 1, urgency: 'must', connectsTo: ['Hawkeye S1', 'Thunderbolts'] },
  'Shang-Chi and the Legend of the Ten Rings': { count: 2, urgency: 'must', connectsTo: ['Avengers: Doomsday'] },
  'Eternals': { count: 2, urgency: 'must', connectsTo: ['Blade', 'Captain America: Brave New World'] },
  'Doctor Strange: Multiverse of Madness': { count: 2, urgency: 'must', connectsTo: ['Doctor Strange 3'] },
  'Ant-Man and the Wasp: Quantumania': { count: 2, urgency: 'must', connectsTo: ['Avengers: Doomsday'] },
  'The Marvels': { count: 2, urgency: 'must', connectsTo: ["X-Men '97 S2", 'Avengers: Secret Wars'] },
  'Deadpool and Wolverine': { count: 1, urgency: 'must', connectsTo: ['Avengers: Secret Wars'] },
};

export const CHARACTER_POV_IDS = {
  'loki-journey': new Set([5, 6, 7, 21, 31, 33]),
  'wanda-arc': new Set([13, 16, 25, 43]),
};

export const MULTIVERSE_KEYWORDS = ['multiverse', 'variant', 'timeline', 'what if', 'loki', 'wanda', 'quantum'];
