export const AFTER_CREDITS = {
  'Iron Man': { count: 1, advice: 'must', connectsTo: ['The Avengers'] },
  'The Avengers': { count: 1, advice: 'must', connectsTo: ['Avengers: Infinity War'] },
  'Captain America: Civil War': { count: 2, advice: 'must', connectsTo: ['Black Panther', 'Spider-Man: Homecoming'] },
  'Avengers: Infinity War': { count: 1, advice: 'must', connectsTo: ['Captain Marvel', 'Avengers: Endgame'] },
  'Avengers: Endgame': { count: 0, advice: 'skip', connectsTo: [] },
  'Spider-Man: No Way Home': { count: 2, advice: 'must', connectsTo: ['Doctor Strange: Multiverse of Madness'] },
  'Doctor Strange: Multiverse of Madness': { count: 2, advice: 'must', connectsTo: ['Doctor Strange 3 (TBA)', 'Clea arc'] },
  'Ant-Man & the Wasp: Quantumania': { count: 2, advice: 'must', connectsTo: ['Loki S2', 'Avengers: The Kang Dynasty (retitled)'] },
  'The Marvels': { count: 2, advice: 'must', connectsTo: ["X-Men '97 S1", 'Young Avengers setup'] },
  'Deadpool & Wolverine': { count: 1, advice: 'skip', connectsTo: ['Multiverse Saga'] },
};

export const AFTER_CREDITS_DEFAULT = { count: null, advice: 'unknown', connectsTo: [] };
