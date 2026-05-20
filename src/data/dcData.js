export const DC_PHASES = [
  { id: 1, label: 'Chapter 1', name: 'Gods and Monsters', color: '#2f73d4' },
  { id: 2, label: 'Legacy', name: 'Worlds of DC', color: '#3b82f6' },
];

export const DC_RAW = [
  { id: 5001, order: 1, title: 'Man of Steel', year: 2013, phase: 1, type: 'film', essential: true, runtime: 143, releaseDate: '2013-06-14', status: 'unwatched' },
  { id: 5002, order: 2, title: 'Batman v Superman: Dawn of Justice', year: 2016, phase: 1, type: 'film', essential: true, runtime: 152, releaseDate: '2016-03-25', status: 'unwatched' },
  { id: 5003, order: 3, title: 'Wonder Woman', year: 2017, phase: 1, type: 'film', essential: true, runtime: 141, releaseDate: '2017-06-02', status: 'unwatched' },
  { id: 5004, order: 4, title: 'Zack Snyder’s Justice League', year: 2021, phase: 1, type: 'film', essential: true, runtime: 242, releaseDate: '2021-03-18', status: 'unwatched' },
  { id: 5005, order: 5, title: 'The Suicide Squad', year: 2021, phase: 2, type: 'film', essential: true, runtime: 132, releaseDate: '2021-08-06', status: 'unwatched' },
  { id: 5006, order: 6, title: 'Peacemaker Season 1', year: 2022, phase: 2, type: 'series', essential: false, runtime: 360, releaseDate: '2022-01-13', status: 'unwatched' },
  { id: 5007, order: 7, title: 'Blue Beetle', year: 2023, phase: 2, type: 'film', essential: false, runtime: 127, releaseDate: '2023-08-18', status: 'unwatched' },
  { id: 5008, order: 8, title: 'Superman', year: 2025, phase: 2, type: 'film', essential: true, runtime: 0, releaseDate: '2025-07-11', status: 'unwatched', upcoming: true },
];

export const DC_CORE_IDS = new Set(DC_RAW.map(item => item.id));
