export const TRAILER_DATA = {
  'Iron Man': { youtubeId: '8hYlB38asDY' },
  'The Incredible Hulk': { youtubeId: 'xbqNb2PFKKA' },
  'Iron Man 2': { youtubeId: 'wKtcmiifycU' },
  'Thor': { youtubeId: 'JOddp-nlNvQ' },
  'The Avengers': { youtubeId: 'eOrNdBpGMv8' },
  'Thor: The Dark World': { youtubeId: 'npvJ9FTgZbM' },
  'Captain America: The Winter Soldier': { youtubeId: '7SlILk2WMTI' },
  'Guardians of the Galaxy': { youtubeId: 'd96cjJhvlMA' },
  'Avengers: Age of Ultron': { youtubeId: 'tmeOjFno6Do' },
  'Captain America: Civil War': { youtubeId: 'dKrVegVI0Us' },
  'Doctor Strange': { youtubeId: 'HSzx-zryEgM' },
  'Thor: Ragnarok': { youtubeId: 'ue80QwXMRHg' },
  'Avengers: Infinity War': { youtubeId: '6ZfuNTqbHE8' },
  'Avengers: Endgame': { youtubeId: 'TcMBFSGVi1c' },
  'Spider-Man: No Way Home': { youtubeId: 'JfVOs4VSpmA' },
  'Doctor Strange: Multiverse of Madness': { youtubeId: 'aWzlQ2N6qqg' },
  'Thor: Love and Thunder': { youtubeId: 'Go8nTmfrQd8' },
  'Black Panther: Wakanda Forever': { youtubeId: '_Z3QKkl1WyM' },
  'Ant-Man & the Wasp: Quantumania': { youtubeId: 'ZlNFpri-Y40' },
  'The Marvels': { youtubeId: 'wS_qbDztgVY' },
};

export const trailerEmbedUrl = (youtubeId) => `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`;


export const getTrailerByTitle = (title = '') => {
  const direct = TRAILER_DATA[title];
  if (direct?.youtubeId) return direct;
  const normalized = title
    .replace(/\sS\d+.*$/i, '')
    .replace(/\sEps?\s.*$/i, '')
    .replace(/\sEp\s.*$/i, '')
    .replace(/\s&\sS\d+.*$/i, '')
    .replace(/:\sSlingshot.*$/i, '')
    .trim();
  return TRAILER_DATA[normalized] || null;
};
