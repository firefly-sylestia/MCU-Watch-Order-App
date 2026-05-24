const withPrimary = (youtubeId, label = 'Official Trailer', kind = 'trailer') => ({ youtubeId, label, kind });

export const TRAILER_DATA = {
  'Iron Man': { videos: [withPrimary('8hYlB38asDY')] },
  'The Incredible Hulk': { videos: [withPrimary('xbqNb2PFKKA')] },
  'Iron Man 2': { videos: [withPrimary('wKtcmiifycU')] },
  'Thor': { videos: [withPrimary('JOddp-nlNvQ')] },
  'The Avengers': { videos: [withPrimary('eOrNdBpGMv8')] },
  'Thor: The Dark World': { videos: [withPrimary('npvJ9FTgZbM')] },
  'Captain America: The Winter Soldier': { videos: [withPrimary('7SlILk2WMTI')] },
  'Guardians of the Galaxy': { videos: [withPrimary('d96cjJhvlMA')] },
  'Avengers: Age of Ultron': { videos: [withPrimary('tmeOjFno6Do')] },
  'Captain America: Civil War': { videos: [withPrimary('dKrVegVI0Us')] },
  'Doctor Strange': { videos: [withPrimary('HSzx-zryEgM')] },
  'Spider-Man: Homecoming': { videos: [withPrimary('rk-dF1lIbIg'), withPrimary('n9DwoQ7HWvI', 'Official Teaser', 'teaser')] },
  'Thor: Ragnarok': { videos: [withPrimary('ue80QwXMRHg'), withPrimary('v7MGUNV8MxU', 'Official Teaser', 'teaser')] },
  'Black Panther': { videos: [withPrimary('xjDjIWPwcPU'), withPrimary('dxWvtMOGAhw', 'Official Teaser', 'teaser')] },
  'Avengers: Infinity War': { videos: [withPrimary('6ZfuNTqbHE8'), withPrimary('QwievZ1Tx-8', 'Official Teaser', 'teaser')] },
  'Avengers: Endgame': { videos: [withPrimary('TcMBFSGVi1c'), withPrimary('hA6hldpSTF8', 'Official Teaser', 'teaser')] },
  'WandaVision': { videos: [withPrimary('sj9J2ecsSpo')] },
  'The Falcon and the Winter Soldier': { videos: [withPrimary('IWBsDaFWyTE')] },
  'Loki': { videos: [withPrimary('nW948Va-l10'), withPrimary('G4JuopziR3Q', 'Season 2 Trailer', 'trailer')] },
  'What If...?': { videos: [withPrimary('x9D0uUKJ5KI'), withPrimary('9fVYKsEmuRo', 'Season 2 Trailer', 'trailer')] },
  'Shang-Chi and the Legend of the Ten Rings': { videos: [withPrimary('8YjFbMbfXaQ'), withPrimary('giWIr7U1deA', 'Official Teaser', 'teaser')] },
  'Spider-Man: No Way Home': { videos: [withPrimary('JfVOs4VSpmA'), withPrimary('rt-2cxAiPJk', 'Official Teaser', 'teaser')] },
  'Doctor Strange: Multiverse of Madness': { videos: [withPrimary('aWzlQ2N6qqg'), withPrimary('RFY_pjXx9rY', 'Official Teaser', 'teaser')] },
  'Moon Knight': { videos: [withPrimary('x7Krla_UxRg')] },
  'Ms. Marvel': { videos: [withPrimary('m9EX0f6V11Y')] },
  'Thor: Love and Thunder': { videos: [withPrimary('Go8nTmfrQd8'), withPrimary('tgB1wUcmbbw', 'Official Teaser', 'teaser')] },
  'She-Hulk: Attorney at Law': { videos: [withPrimary('gim2kprjL50')] },
  'Black Panther: Wakanda Forever': { videos: [withPrimary('_Z3QKkl1WyM'), withPrimary('RlOB3UALvrQ', 'Official Teaser', 'teaser')] },
  'Guardians of the Galaxy Vol. 3': { videos: [withPrimary('u3V5KDHRQvk'), withPrimary('JqcncLPi9zw', 'Official Teaser', 'teaser')] },
  'Secret Invasion': { videos: [withPrimary('Tp_YZNqNBhw')] },
  'The Marvels': { videos: [withPrimary('wS_qbDztgVY'), withPrimary('iuk77TjvfmE', 'Official Teaser', 'teaser')] },
  'Echo': { videos: [withPrimary('AFUKnherhuw')] },
  'Deadpool & Wolverine': { videos: [withPrimary('73_1biulkYk'), withPrimary('uJMCNJP2ipI', 'Official Teaser', 'teaser')] },
  'Agatha All Along': { videos: [withPrimary('R9pXbNz6Vbw')] },
  'Captain America: Brave New World': { videos: [withPrimary('1pHDWnXmK7Y'), withPrimary('O_A8HdCDaWM', 'Official Teaser', 'teaser')] },
  'Daredevil: Born Again': { videos: [withPrimary('7xALolZzhSM')] },
  'Thunderbolts*': { videos: [withPrimary('v-94Snw-H4o')] },
  'Ironheart': { videos: [withPrimary('SxQf3A4xV4Q', 'First Look', 'teaser')] },
  'Wonder Man': { videos: [withPrimary('nxeA4fL2zAc', 'First Look', 'teaser')] },
};

export const trailerEmbedUrl = (youtubeId) => `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`;

export const getTrailerByTitle = (title = '') => {
  const normalized = title
    .replace(/\sS\d+.*$/i, '')
    .replace(/\sEps?\s.*$/i, '')
    .replace(/\sEp\s.*$/i, '')
    .replace(/\s&\sS\d+.*$/i, '')
    .replace(/:\sSlingshot.*$/i, '')
    .trim();
  const direct = TRAILER_DATA[title] || TRAILER_DATA[normalized];
  if (!direct) return null;
  if (Array.isArray(direct.videos) && direct.videos.length) return direct;
  if (direct.youtubeId) return { videos: [withPrimary(direct.youtubeId)] };
  return null;
};
