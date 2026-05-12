'use client';

import React, { useState, useEffect, useRef, useMemo, memo } from 'react';

const Icon = ({ children, size = 16, style = {} }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
  >
    {children}
  </svg>
);

const Search = ({ size, style }) => (
  <Icon size={size} style={style}>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </Icon>
);

const Eye = ({ size, style }) => (
  <Icon size={size} style={style}>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </Icon>
);

const EyeOff = ({ size, style }) => (
  <Icon size={size} style={style}>
    <path d="m3 3 18 18" />
    <path d="M10.5 10.5a2 2 0 0 0 3 3" />
    <path d="M9.9 4.2A10.9 10.9 0 0 1 12 4c6.5 0 10 8 10 8a17.6 17.6 0 0 1-3.2 4.2" />
    <path d="M6.6 6.6A17.5 17.5 0 0 0 2 12s3.5 8 10 8a10.7 10.7 0 0 0 5.4-1.4" />
  </Icon>
);

const Star = ({ size, style }) => (
  <Icon size={size} style={style}>
    <polygon points="12 2 15 9 22 9 17 14 19 21 12 17 5 21 7 14 2 9 9 9" />
  </Icon>
);

const Film = ({ size, style }) => (
  <Icon size={size} style={style}>
    <rect x="2" y="2" width="20" height="20" rx="2" />
    <path d="M7 2v20" />
    <path d="M17 2v20" />
    <path d="M2 7h20" />
    <path d="M2 17h20" />
  </Icon>
);

const Tv = ({ size, style }) => (
  <Icon size={size} style={style}>
    <rect x="2" y="7" width="20" height="15" rx="2" />
    <path d="M17 2 12 7 7 2" />
  </Icon>
);

const Zap = ({ size, style }) => (
  <Icon size={size} style={style}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </Icon>
);

const ChevronDown = ({ size, style }) => (
  <Icon size={size} style={style}>
    <path d="m6 9 6 6 6-6" />
  </Icon>
);

const Check = ({ size, style }) => (
  <Icon size={size} style={style}>
    <path d="M20 6 9 17l-5-5" />
  </Icon>
);

const Clock = ({ size, style }) => (
  <Icon size={size} style={style}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </Icon>
);

const Pause = ({ size, style }) => (
  <Icon size={size} style={style}>
    <rect x="6" y="4" width="4" height="16" />
    <rect x="14" y="4" width="4" height="16" />
  </Icon>
);

const Trash2 = ({ size, style }) => (
  <Icon size={size} style={style}>
    <path d="M3 6h18" />
    <path d="M8 6V4h8v2" />
    <path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
  </Icon>
);

const PHASES = [
  { id: 1, name: 'Phase 1', color: '#e8b84b', glow: 'rgba(232,184,75,0.28)', bg: 'rgba(232,184,75,0.06)' },
  { id: 2, name: 'Phase 2', color: '#e05252', glow: 'rgba(224,82,82,0.28)', bg: 'rgba(224,82,82,0.06)' },
  { id: 3, name: 'Phase 3', color: '#4a9ede', glow: 'rgba(74,158,222,0.28)', bg: 'rgba(74,158,222,0.06)' },
  { id: 4, name: 'Phase 4', color: '#a06cd5', glow: 'rgba(160,108,213,0.28)', bg: 'rgba(160,108,213,0.06)' },
  { id: 5, name: 'Phase 5', color: '#3ec47a', glow: 'rgba(62,196,122,0.28)', bg: 'rgba(62,196,122,0.06)' },
  { id: 6, name: 'Phase 6', color: '#25c4a0', glow: 'rgba(37,196,160,0.28)', bg: 'rgba(37,196,160,0.06)' },
];

const TYPE_META = {
  film: { label: 'Film', Icon: Film, color: '#e8b84b' },
  series: { label: 'Series', Icon: Tv, color: '#4a9ede' },
  short: { label: 'Short', Icon: Zap, color: '#a06cd5' },
};

const NO_PREREQ = new Set([
  'None', 'None (standalone)', 'None (mostly standalone)',
  'None (multiverse)', 'None (intro to FF)', 'None (supernatural entry)',
  'None (prequel to Homecoming)', 'General MCU knowledge',
  'None (new arc starts)', 'None (alternate reality)',
  'None (alternate reality, optional)', 'None (separate continuity)',
]);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ESSENTIAL LIST - 60 items from MCUViewerFixed
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const ESSENTIAL_LIST = [
  { id: 1, order: 1, title: "Captain America: The First Avenger", year: 2011, prereq: "None", essential: true, phase: 1, type: 'film' },
  { id: 2, order: 2, title: "Iron Man", year: 2008, prereq: "None", essential: true, phase: 1, type: 'film' },
  { id: 3, order: 3, title: "The Incredible Hulk", year: 2008, prereq: "None", essential: true, phase: 1, type: 'film' },
  { id: 4, order: 4, title: "Iron Man 2", year: 2010, prereq: "Iron Man", essential: true, phase: 1, type: 'film' },
  { id: 5, order: 5, title: "Thor", year: 2011, prereq: "None", essential: true, phase: 1, type: 'film' },
  { id: 6, order: 6, title: "The Avengers", year: 2012, prereq: "None", essential: true, phase: 1, type: 'film' },
  { id: 7, order: 7, title: "Thor: The Dark World", year: 2013, prereq: "Thor, The Avengers", essential: true, phase: 2, type: 'film' },
  { id: 8, order: 8, title: "Guardians of the Galaxy", year: 2014, prereq: "None (standalone)", essential: true, phase: 2, type: 'film' },
  { id: 9, order: 9, title: "Captain America: The Winter Soldier", year: 2014, prereq: "Captain America: The First Avenger", essential: true, phase: 2, type: 'film' },
  { id: 10, order: 10, title: "Iron Man 3", year: 2013, prereq: "Iron Man 2, The Avengers", essential: true, phase: 2, type: 'film' },
  { id: 11, order: 11, title: "Guardians of the Galaxy Vol. 2", year: 2017, prereq: "Guardians of the Galaxy", essential: true, phase: 2, type: 'film' },
  { id: 12, order: 12, title: "I Am Groot S1 & S2", year: 2023, prereq: "Guardians Vol. 1", essential: false, phase: 2, type: 'series' },
  { id: 13, order: 13, title: "Avengers: Age of Ultron", year: 2015, prereq: "All Phase 1-2 films", essential: true, phase: 2, type: 'film' },
  { id: 14, order: 14, title: "Doctor Strange", year: 2016, prereq: "General MCU knowledge", essential: true, phase: 3, type: 'film' },
  { id: 15, order: 15, title: "Ant-Man", year: 2015, prereq: "Age of Ultron", essential: true, phase: 3, type: 'film' },
  { id: 16, order: 16, title: "Captain America: Civil War", year: 2016, prereq: "All previous MCU films", essential: true, phase: 3, type: 'film' },
  { id: 17, order: 17, title: "Black Widow", year: 2021, prereq: "Captain America: Civil War", essential: true, phase: 4, type: 'film' },
  { id: 18, order: 18, title: "Black Panther", year: 2018, prereq: "Civil War", essential: true, phase: 3, type: 'film' },
  { id: 19, order: 19, title: "Spider-Man: Homecoming", year: 2017, prereq: "Civil War", essential: true, phase: 3, type: 'film' },
  { id: 20, order: 20, title: "Ant-Man & the Wasp", year: 2018, prereq: "Ant-Man, Civil War", essential: true, phase: 3, type: 'film' },
  { id: 21, order: 21, title: "Thor: Ragnarök", year: 2017, prereq: "Thor: The Dark World, Age of Ultron", essential: true, phase: 3, type: 'film' },
  { id: 22, order: 22, title: "Avengers: Infinity War", year: 2018, prereq: "All Phase 3 films", essential: true, phase: 3, type: 'film' },
  { id: 23, order: 23, title: "Captain Marvel", year: 2019, prereq: "General MCU knowledge", essential: true, phase: 3, type: 'film' },
  { id: 24, order: 24, title: "Avengers: Endgame", year: 2019, prereq: "Infinity War", essential: true, phase: 3, type: 'film' },
  { id: 25, order: 25, title: "WandaVision S1", year: 2021, prereq: "Avengers: Endgame", essential: true, phase: 4, type: 'series' },
  { id: 26, order: 26, title: "The Falcon & the Winter Soldier S1", year: 2021, prereq: "Endgame, Captain America history", essential: true, phase: 4, type: 'series' },
  { id: 27, order: 27, title: "Spider-Man: Far From Home", year: 2019, prereq: "Avengers: Endgame", essential: true, phase: 3, type: 'film' },
  { id: 28, order: 28, title: "Spider-Man: No Way Home", year: 2021, prereq: "Far From Home, Multiverse concept", essential: true, phase: 4, type: 'film' },
  { id: 29, order: 29, title: "Hawkeye S1", year: 2021, prereq: "Avengers movies", essential: true, phase: 4, type: 'series' },
  { id: 30, order: 30, title: "Guardians of the Galaxy Holiday Special", year: 2022, prereq: "Guardians films", essential: false, phase: 4, type: 'film' },
  { id: 31, order: 31, title: "Loki S1", year: 2021, prereq: "Avengers: Endgame", essential: true, phase: 4, type: 'series' },
  { id: 32, order: 32, title: "Ant-Man & the Wasp: Quantumania", year: 2023, prereq: "Ant-Man films, Loki S1", essential: true, phase: 5, type: 'film' },
  { id: 33, order: 33, title: "Loki S2", year: 2023, prereq: "Loki S1, Quantumania", essential: true, phase: 5, type: 'series' },
  { id: 34, order: 34, title: "What If...? S1", year: 2021, prereq: "General MCU knowledge", essential: false, phase: 4, type: 'series' },
  { id: 35, order: 35, title: "What If...? S2", year: 2023, prereq: "What If...? S1", essential: false, phase: 4, type: 'series' },
  { id: 36, order: 36, title: "What If...? S3", year: 2024, prereq: "What If...? S1-2", essential: false, phase: 5, type: 'series' },
  { id: 37, order: 37, title: "Deadpool & Wolverine", year: 2024, prereq: "General MCU knowledge (optional)", essential: false, phase: 5, type: 'film' },
  { id: 38, order: 38, title: "Thor: Love and Thunder", year: 2022, prereq: "Thor: Ragnarök, Avengers", essential: true, phase: 4, type: 'film' },
  { id: 39, order: 39, title: "Guardians of the Galaxy Vol. 3", year: 2023, prereq: "Guardians Vol. 1-2", essential: true, phase: 5, type: 'film' },
  { id: 40, order: 40, title: "Black Panther: Wakanda Forever", year: 2022, prereq: "Black Panther", essential: true, phase: 4, type: 'film' },
  { id: 41, order: 41, title: "Moon Knight S1", year: 2022, prereq: "None (standalone, optional)", essential: false, phase: 4, type: 'series' },
  { id: 42, order: 42, title: "Shang-Chi & the Legend of the Ten Rings", year: 2021, prereq: "None (standalone)", essential: true, phase: 4, type: 'film' },
  { id: 43, order: 43, title: "Doctor Strange: Multiverse of Madness", year: 2022, prereq: "Doctor Strange, Wandavision", essential: true, phase: 4, type: 'film' },
  { id: 44, order: 44, title: "Agatha All Along S1", year: 2024, prereq: "WandaVision", essential: false, phase: 5, type: 'series' },
  { id: 45, order: 45, title: "Eternals", year: 2021, prereq: "None (mostly standalone)", essential: true, phase: 4, type: 'film' },
  { id: 46, order: 46, title: "She-Hulk: Attorney at Law S1", year: 2022, prereq: "The Incredible Hulk, Avengers", essential: false, phase: 4, type: 'series' },
  { id: 47, order: 47, title: "Ms. Marvel S1", year: 2022, prereq: "General MCU knowledge", essential: true, phase: 4, type: 'series' },
  { id: 48, order: 48, title: "The Marvels", year: 2023, prereq: "Captain Marvel, WandaVision, Ms. Marvel", essential: true, phase: 5, type: 'film' },
  { id: 49, order: 49, title: "Secret Invasion S1", year: 2023, prereq: "Captain Marvel, Avengers", essential: false, phase: 5, type: 'series' },
  { id: 50, order: 50, title: "Echo S1", year: 2024, prereq: "Daredevil, Hawkeye (optional)", essential: false, phase: 5, type: 'series' },
  { id: 51, order: 51, title: "Daredevil: Born Again S1", year: 2025, prereq: "General MCU knowledge (optional)", essential: false, phase: 5, type: 'series' },
  { id: 52, order: 52, title: "Daredevil: Born Again S2", year: 2025, prereq: "Born Again S1 (optional)", essential: false, phase: 5, type: 'series' },
  { id: 53, order: 53, title: "Captain America: Brave New World", year: 2025, prereq: "All previous MCU films", essential: true, phase: 5, type: 'film' },
  { id: 54, order: 54, title: "Ironheart S1", year: 2025, prereq: "Black Panther: Wakanda Forever", essential: false, phase: 5, type: 'series' },
  { id: 55, order: 55, title: "Thunderbolts*", year: 2025, prereq: "General MCU knowledge", essential: true, phase: 5, type: 'film' },
  { id: 56, order: 56, title: "Fantastic Four: First Steps", year: 2025, prereq: "None (new arc starts)", essential: true, phase: 6, type: 'film' },
  { id: 57, order: 57, title: "Wonder Man S1", year: 2026, prereq: "General MCU knowledge", essential: false, phase: 6, type: 'series' },
  { id: 58, order: 58, title: "Werewolf by Night", year: 2022, prereq: "None (standalone, optional)", essential: false, phase: 4, type: 'film' },
  { id: 59, order: 59, title: "Eyes of Wakanda S1", year: 2025, prereq: "Black Panther (optional)", essential: false, phase: 6, type: 'series' },
  { id: 60, order: 60, title: "Marvel Zombies S1", year: 2025, prereq: "None (alternate reality, optional)", essential: false, phase: 6, type: 'series' },
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ADDITIONAL LIST - Optional content from Reddit chronological order
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const ADDITIONAL_LIST = [
  { id: 101, order: 101, title: "Agent Carter (short)", year: 2013, prereq: "CATFA", essential: false, phase: 1, type: 'short' },
  { id: 102, order: 102, title: "Agent Carter S1 & S2", year: 2015, prereq: "CATFA", essential: false, phase: 1, type: 'series' },
  { id: 103, order: 103, title: "A Funny Thing Happened on the Way to Thor's Hammer", year: 2011, prereq: "None", essential: false, phase: 1, type: 'short' },
  { id: 104, order: 104, title: "The Consultant", year: 2011, prereq: "The Avengers", essential: false, phase: 1, type: 'short' },
  { id: 105, order: 105, title: "Item 47", year: 2012, prereq: "The Avengers", essential: false, phase: 1, type: 'short' },
  { id: 106, order: 106, title: "Agents of SHIELD S1 Eps 1-7", year: 2013, prereq: "The Avengers", essential: false, phase: 2, type: 'series' },
  { id: 107, order: 107, title: "Agents of SHIELD S1 Eps 8-12", year: 2013, prereq: "The Avengers", essential: false, phase: 2, type: 'series' },
  { id: 108, order: 108, title: "All Hail the King", year: 2014, prereq: "Iron Man 3", essential: false, phase: 2, type: 'short' },
  { id: 109, order: 109, title: "Agents of SHIELD S1 Eps 13-15", year: 2013, prereq: "The Avengers", essential: false, phase: 2, type: 'series' },
  { id: 110, order: 110, title: "Agents of SHIELD S1 Ep 16", year: 2013, prereq: "The Avengers", essential: false, phase: 2, type: 'series' },
  { id: 111, order: 111, title: "Agents of SHIELD S1 Eps 17-22 & S2 Eps 1-2", year: 2014, prereq: "CATWS", essential: false, phase: 2, type: 'series' },
  { id: 112, order: 112, title: "Agents of SHIELD S2 Ep 3", year: 2014, prereq: "CATWS", essential: false, phase: 2, type: 'series' },
  { id: 113, order: 113, title: "Agents of SHIELD S2 Eps 4-5", year: 2014, prereq: "CATWS", essential: false, phase: 2, type: 'series' },
  { id: 114, order: 114, title: "Daredevil S1", year: 2015, prereq: "None (mostly standalone)", essential: false, phase: 2, type: 'series' },
  { id: 115, order: 115, title: "Jessica Jones S1", year: 2015, prereq: "None (mostly standalone)", essential: false, phase: 2, type: 'series' },
  { id: 116, order: 116, title: "Agents of SHIELD S2 Eps 6-19", year: 2014, prereq: "CATWS", essential: false, phase: 2, type: 'series' },
  { id: 117, order: 117, title: "Agents of SHIELD S2 Eps 20-22", year: 2014, prereq: "CATWS", essential: false, phase: 2, type: 'series' },
  { id: 118, order: 118, title: "WHiH Newsfront S1", year: 2014, prereq: "Age of Ultron context", essential: false, phase: 2, type: 'series' },
  { id: 119, order: 119, title: "Daredevil S2", year: 2016, prereq: "Daredevil S1", essential: false, phase: 2, type: 'series' },
  { id: 120, order: 120, title: "Luke Cage S1", year: 2016, prereq: "Jessica Jones (recommended)", essential: false, phase: 2, type: 'series' },
  { id: 121, order: 121, title: "Agents of SHIELD S3 Eps 1-10", year: 2015, prereq: "Previous SHIELD seasons", essential: false, phase: 2, type: 'series' },
  { id: 122, order: 122, title: "Iron Fist S1", year: 2017, prereq: "Daredevil, Luke Cage, JJ", essential: false, phase: 2, type: 'series' },
  { id: 123, order: 123, title: "Agents of SHIELD S3 Eps 11-14", year: 2015, prereq: "Previous SHIELD seasons", essential: false, phase: 2, type: 'series' },
  { id: 124, order: 124, title: "WHiH Newsfront S2 Ep 1", year: 2015, prereq: "Ongoing MCU events", essential: false, phase: 2, type: 'series' },
  { id: 125, order: 125, title: "Agents of SHIELD S3 Eps 15-16", year: 2015, prereq: "Previous SHIELD seasons", essential: false, phase: 2, type: 'series' },
  { id: 126, order: 126, title: "WHiH Newsfront S2 Ep 2", year: 2015, prereq: "Ongoing MCU events", essential: false, phase: 2, type: 'series' },
  { id: 127, order: 127, title: "Agents of SHIELD S3 Eps 17-18", year: 2015, prereq: "Previous SHIELD seasons", essential: false, phase: 2, type: 'series' },
  { id: 128, order: 128, title: "WHiH Newsfront S2 Eps 3-5", year: 2015, prereq: "Ongoing MCU events", essential: false, phase: 2, type: 'series' },
  { id: 129, order: 129, title: "The Defenders S1", year: 2017, prereq: "All Netflix street-level shows", essential: false, phase: 2, type: 'series' },
  { id: 130, order: 130, title: "Agents of SHIELD S3 Ep 19", year: 2015, prereq: "Previous SHIELD seasons", essential: false, phase: 2, type: 'series' },
  { id: 131, order: 131, title: "Agents of SHIELD S3 Eps 20-22", year: 2015, prereq: "Previous SHIELD seasons", essential: false, phase: 2, type: 'series' },
  { id: 132, order: 132, title: "Inhumans S1", year: 2017, prereq: "Agents of SHIELD context", essential: false, phase: 3, type: 'series' },
  { id: 133, order: 133, title: "The Punisher S1", year: 2017, prereq: "Daredevil S2", essential: false, phase: 3, type: 'series' },
  { id: 134, order: 134, title: "Cloak & Dagger S1", year: 2018, prereq: "General MCU knowledge", essential: false, phase: 3, type: 'series' },
  { id: 135, order: 135, title: "Agents of SHIELD S4 Eps 1-8", year: 2016, prereq: "Previous SHIELD seasons", essential: false, phase: 3, type: 'series' },
  { id: 136, order: 136, title: "Agents of SHIELD: Slingshot S1", year: 2016, prereq: "SHIELD context", essential: false, phase: 3, type: 'series' },
  { id: 137, order: 137, title: "Agents of SHIELD S4 Eps 9-22", year: 2016, prereq: "Previous SHIELD seasons", essential: false, phase: 3, type: 'series' },
  { id: 138, order: 138, title: "Jessica Jones S2", year: 2018, prereq: "Jessica Jones S1", essential: false, phase: 3, type: 'series' },
  { id: 139, order: 139, title: "Agents of SHIELD S5 Eps 1-10", year: 2017, prereq: "Previous SHIELD seasons", essential: false, phase: 3, type: 'series' },
  { id: 140, order: 140, title: "Luke Cage S2", year: 2018, prereq: "Luke Cage S1", essential: false, phase: 3, type: 'series' },
  { id: 141, order: 141, title: "Iron Fist S2", year: 2018, prereq: "Iron Fist S1", essential: false, phase: 3, type: 'series' },
  { id: 142, order: 142, title: "Daredevil S3", year: 2018, prereq: "Daredevil S2", essential: false, phase: 3, type: 'series' },
  { id: 143, order: 143, title: "Cloak & Dagger S2", year: 2019, prereq: "Cloak & Dagger S1", essential: false, phase: 3, type: 'series' },
  { id: 144, order: 144, title: "Agents of SHIELD S5 Eps 11-13", year: 2017, prereq: "Previous SHIELD seasons", essential: false, phase: 3, type: 'series' },
  { id: 145, order: 145, title: "Runaways S1 & S2 & S3 Eps 1-4", year: 2017, prereq: "None (standalone)", essential: false, phase: 3, type: 'series' },
  { id: 146, order: 146, title: "The Punisher S2", year: 2019, prereq: "The Punisher S1", essential: false, phase: 3, type: 'series' },
  { id: 147, order: 147, title: "Jessica Jones S3", year: 2019, prereq: "Jessica Jones S2", essential: false, phase: 3, type: 'series' },
  { id: 148, order: 148, title: "Agents of SHIELD S5 Eps 14-18", year: 2017, prereq: "Previous SHIELD seasons", essential: false, phase: 3, type: 'series' },
  { id: 149, order: 149, title: "Agents of SHIELD S5 Eps 19-22", year: 2017, prereq: "Previous SHIELD seasons", essential: false, phase: 3, type: 'series' },
  { id: 150, order: 150, title: "Runaways S3 Eps 5-10", year: 2019, prereq: "Runaways S1 & S2", essential: false, phase: 3, type: 'series' },
  { id: 151, order: 151, title: "Agents of SHIELD S6 & S7", year: 2019, prereq: "Previous SHIELD seasons", essential: false, phase: 4, type: 'series' },
  { id: 152, order: 152, title: "Helstrom S1", year: 2020, prereq: "None (mostly standalone)", essential: false, phase: 4, type: 'series' },
  { id: 153, order: 153, title: "The Daily Bugle S1 & S2", year: 2023, prereq: "Spider-Man films", essential: false, phase: 4, type: 'series' },
  { id: 154, order: 154, title: "Your Friendly Neighborhood Spider-Man S1", year: 2024, prereq: "None (separate continuity)", essential: false, phase: 5, type: 'series' },
];

const RAW = [...ESSENTIAL_LIST, ...ADDITIONAL_LIST].map(d => ({ ...d, status: 'unwatched' }));

const SORT_LABELS = { order: 'Chronological', year: 'By Year', title: 'Alphabetical' };

const Sun = ({ size, style }) => (
  <Icon size={size} style={style}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </Icon>
);

const Moon = ({ size, style }) => (
  <Icon size={size} style={style}>
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </Icon>
);

const STATUS_META = {
  watched: { label: 'Watched', color: '#3ec47a', Icon: Check, bg: 'rgba(62,196,122,0.1)' },
  'plan-to-watch': { label: 'Plan to Watch', color: '#4a9ede', Icon: Clock, bg: 'rgba(74,158,222,0.1)' },
  watching: { label: 'Watching', color: '#e8b84b', Icon: Eye, bg: 'rgba(232,184,75,0.1)' },
  'on-hold': { label: 'On Hold', color: '#f39c12', Icon: Pause, bg: 'rgba(243,156,18,0.1)' },
  dropped: { label: 'Dropped', color: '#e05252', Icon: Trash2, bg: 'rgba(224,82,82,0.1)' },
  unwatched: { label: 'Unwatched', color: '#1c1c30', Icon: EyeOff, bg: 'transparent' },
};

// 'core' = the curated 60-item list, 'extended' = all 114 items combined in order
const LIST_MODES = [
  { id: 'core', label: 'MCU', sublabel: 'Curated List', color: '#c0392b', desc: '60 curated films & series' },
  { id: 'extended', label: 'Extended', sublabel: 'Full Chronological', color: '#4a9ede', desc: 'All MCU incl. Netflix, SHIELD & more' },
];

export default function MCUViewer() {
  const [items, setItems] = useState(RAW);
  const [listMode, setListMode] = useState('core');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('order');
  const [essentialOnly, setEssOnly] = useState(false);
  const [watchedOnly, setWatchedOnly] = useState(false);
  const [statusFilter, setStatusFilter] = useState(null);
  const [typeFilter, setTypeFilter] = useState(null);
  const [activePhase, setActivePhase] = useState(1);
  const [sortOpen, setSortOpen] = useState(false);
  const [statusDropdown, setStatusDropdown] = useState(null);
  const [dropdownPos, setDropdownPos] = useState({ x: 0, y: 0 });
  const [darkMode, setDarkMode] = useState(true);

  const phaseRefs = useRef({});
  const sortRef = useRef(null);
  const obsRef = useRef(null);
  const isScrolling = useRef(false);
  const mainRef = useRef(null);

  // Load saved
  useEffect(() => {
    const s = localStorage.getItem('mcu-v6');
    if (s) {
      const saved = JSON.parse(s);
      setItems(prev => prev.map(i => ({ ...i, status: saved[i.id] || 'unwatched' })));
    }
  }, []);

  const persist = (next) => {
    const statuses = {};
    next.forEach(i => {
      if (i.status !== 'unwatched') statuses[i.id] = i.status;
    });
    localStorage.setItem('mcu-v6', JSON.stringify(statuses));
  };

  const setStatusDirect = (id, newStatus) => {
    setItems(prev => {
      const n = prev.map(i => i.id === id ? { ...i, status: newStatus } : i);
      persist(n);
      return n;
    });
  };

  // Track scrolling to prevent accidental clicks
  useEffect(() => {
    const container = mainRef.current?.parentElement;
    if (!container) return;

    const onScroll = () => {
      isScrolling.current = true;
      clearTimeout(isScrolling.current.timeout);
      isScrolling.current.timeout = setTimeout(() => {
        isScrolling.current = false;
      }, 150);
    };

    container.addEventListener('scroll', onScroll, { passive: true });
    return () => container.removeEventListener('scroll', onScroll);
  }, []);

  // IntersectionObserver for active nav tab
  useEffect(() => {
    obsRef.current?.disconnect();
    obsRef.current = new IntersectionObserver(
      entries => {
        let mostVisible = null;
        let maxRatio = 0;

        entries.forEach(e => {
          if (e.intersectionRatio > maxRatio) {
            maxRatio = e.intersectionRatio;
            mostVisible = +e.target.dataset.phase;
          }
        });

        if (mostVisible) {
          setActivePhase(mostVisible);
        }
      },
      {
        rootMargin: '-80px 0px -60% 0px'
      }
    );

    Object.values(phaseRefs.current).forEach(el => el && obsRef.current.observe(el));
    return () => obsRef.current?.disconnect();
  }, []);

  // Close sort dropdown on outside click
  useEffect(() => {
    const fn = e => { if (sortRef.current && !sortRef.current.contains(e.target)) setSortOpen(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  const scrollTo = (id) => {
    phaseRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const markPhaseWatched = (phaseId, newStatus) => {
    setItems(prev => {
      const n = prev.map(i => {
        if (i.phase !== phaseId) return i;
        // In core mode only touch the 60 curated items; in extended mode touch all
        if (listMode === 'core' && !coreIds.has(i.id)) return i;
        return { ...i, status: newStatus };
      });
      persist(n);
      return n;
    });
  };

  const coreIds = useMemo(() => new Set(ESSENTIAL_LIST.map(i => i.id)), []);
  const q = search.toLowerCase();
  const { filtered, grouped, phaseKeys } = useMemo(() => {
    const f = items
      .filter(i => {
        // List mode gate:
        // 'core'     → only the 60 curated items
        // 'extended' → ALL items (both lists combined)
        if (listMode === 'core' && !coreIds.has(i.id)) return false;
        // In core mode, essentialOnly can still narrow to must-watch only
        if (listMode === 'core' && essentialOnly && !i.essential) return false;
        if (watchedOnly && i.status !== 'watched') return false;
        if (statusFilter && i.status !== statusFilter) return false;
        if (typeFilter && i.type !== typeFilter) return false;
        return i.title.toLowerCase().includes(q) || i.prereq.toLowerCase().includes(q);
      })
      .sort((a, b) =>
        sortBy === 'title' ? a.title.localeCompare(b.title) :
          sortBy === 'year' ? a.year - b.year : a.order - b.order
      );
    const g = {};
    f.forEach(i => (g[i.phase] = g[i.phase] || []).push(i));
    const pk = Object.keys(g).map(Number).sort((a, b) => a - b);
    return { filtered: f, grouped: g, phaseKeys: pk };
  }, [items, listMode, essentialOnly, watchedOnly, statusFilter, typeFilter, q, sortBy, coreIds]);

  const activeItems = useMemo(
    () => listMode === 'core' ? items.filter(i => coreIds.has(i.id)) : items,
    [items, listMode, coreIds]
  );
  const totalWatched = useMemo(() => activeItems.filter(i => i.status === 'watched').length, [activeItems]);
  const essTotal = useMemo(() => activeItems.filter(i => i.essential).length, [activeItems]);
  const essWatched = useMemo(() => activeItems.filter(i => i.essential && i.status === 'watched').length, [activeItems]);
  const pct = activeItems.length ? Math.round((totalWatched / activeItems.length) * 100) : 0;

  // CSS variables per theme
  const T = darkMode ? {
    // Dark (cinematic MCU) theme
    appBg: '#06060f',
    headerBg: 'linear-gradient(180deg, #0d0d1e 0%, #06060f 100%)',
    headerBorder: '#13132a',
    navBg: '#08081a',
    navBorder: '#13132a',
    filterBg: '#07071a',
    filterBorder: '#10101f',
    surfaceBg: '#0b0b1c',
    surfaceBorder: '#12122a',
    rowHoverBg: 'rgba(255,255,255,0.025)',
    rowWatchedBg: '#080814',
    rowBorder: '#0e0e1e',
    pillBg: '#0d0d1e',
    pillBorder: '#1a1a2e',
    pillText: '#7a8599',
    pillHoverBorder: '#252540',
    pillHoverText: '#c5d0e8',
    inputBg: '#0b0b1d',
    inputBorder: '#171730',
    inputColor: '#c5d0e8',
    dropdownBg: '#0d0d1e',
    dropdownBorder: '#1e1e36',
    dropdownShadow: '0 24px 64px rgba(0,0,0,0.92)',
    text: '#c8d4e8',
    textMuted: '#556070',
    textFaint: '#2e3a4a',
    sortOptionHoverBg: '#0f0f22',
    statCardBg: '#0b0b1c',
    statCardBorder: '#131328',
    numFaint: '#4a5566',
    footerText: '#2a3344',
    scrollTrack: '#07070f',
    scrollThumb: '#16162a',
    scrollThumbHover: '#222238',
    hexDot: 'rgba(255,255,255,0.01)',
    listSwitcherBg: '#080818',
    listSwitcherBorder: '#13132a',
  } : {
    // Light (poster/editorial) theme
    appBg: '#f2f0eb',
    headerBg: 'linear-gradient(180deg, #ffffff 0%, #f2f0eb 100%)',
    headerBorder: '#ddd8d0',
    navBg: '#ffffff',
    navBorder: '#e8e2d8',
    filterBg: '#faf8f4',
    filterBorder: '#e4ddd4',
    surfaceBg: '#ffffff',
    surfaceBorder: '#e0dbd2',
    rowHoverBg: 'rgba(0,0,0,0.025)',
    rowWatchedBg: '#f7f5f0',
    rowBorder: '#ede8e0',
    pillBg: '#f0ece4',
    pillBorder: '#ddd8cf',
    pillText: '#6a7080',
    pillHoverBorder: '#c8c2b8',
    pillHoverText: '#1a2030',
    inputBg: '#ffffff',
    inputBorder: '#ddd8cf',
    inputColor: '#1a2030',
    dropdownBg: '#ffffff',
    dropdownBorder: '#ddd8cf',
    dropdownShadow: '0 24px 64px rgba(0,0,0,0.16)',
    text: '#1a2030',
    textMuted: '#8090a0',
    textFaint: '#bbb8b0',
    sortOptionHoverBg: '#f5f2ec',
    statCardBg: '#ffffff',
    statCardBorder: '#e4ddd4',
    numFaint: '#a0a8b0',
    footerText: '#a0a8b0',
    scrollTrack: '#ece8e0',
    scrollThumb: '#ccc8c0',
    scrollThumbHover: '#b8b4ac',
    hexDot: 'rgba(0,0,0,0.025)',
    listSwitcherBg: '#f8f5f0',
    listSwitcherBorder: '#e4ddd4',
  };

  const openStatusDropdown = (e, itemId) => {
    if (isScrolling.current) return;
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const dropW = 240;
    const dropH = 260;
    let x = rect.left - dropW + rect.width;
    let y = rect.top - dropH - 8;
    if (x < 8) x = 8;
    if (x + dropW > window.innerWidth - 8) x = window.innerWidth - dropW - 8;
    if (y < 8) y = rect.bottom + 8;
    setDropdownPos({ x, y });
    setStatusDropdown(prev => prev === itemId ? null : itemId);
  };

  return (
    <div style={{ width: '100%', minHeight: '100dvh', background: T.appBg, color: T.text, fontFamily: "'Rajdhani', system-ui, sans-serif", display: 'flex', flexDirection: 'column', transition: 'background 0.3s, color 0.3s' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${T.scrollTrack}; }
        ::-webkit-scrollbar-thumb { background: ${T.scrollThumb}; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: ${T.scrollThumbHover}; }
        input, button, select { font-family: inherit; }
        input:focus { outline: none; }
        button:focus-visible { outline: 2px solid #c0392b; outline-offset: 2px; }

        @keyframes sweep {
          0%   { transform: translateX(-120%); }
          100% { transform: translateX(220%); }
        }
        .sweep::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent);
          animation: sweep 2.8s ease-in-out infinite;
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.06; }
          50%       { opacity: 0.18; }
        }
        @keyframes rowIn {
          from { opacity: 0; transform: translateX(-6px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .row-in { animation: rowIn 0.22s ease both; }
        @keyframes sectionUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .section-up { animation: sectionUp 0.35s ease both; }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.97) translateY(-4px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .fade-in { animation: fadeIn 0.18s ease both; }

        .wbtn {
          width: 32px; height: 32px; border-radius: 50%;
          border: 1.5px solid transparent; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: transform 0.18s, box-shadow 0.2s, background 0.2s, border-color 0.2s;
          flex-shrink: 0;
        }
        .wbtn:hover  { transform: scale(1.12); }
        .wbtn:active { transform: scale(0.88); }

        .ntab {
          position: relative;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 13px; letter-spacing: 2.5px;
          padding: 10px 18px;
          border: none; background: transparent; cursor: pointer;
          transition: color 0.2s; white-space: nowrap;
          flex-shrink: 0;
          display: flex; flex-direction: column; align-items: center;
        }
        .ntab::after {
          content: '';
          position: absolute;
          bottom: 0; left: 14px; right: 14px; height: 2px;
          border-radius: 2px 2px 0 0;
          background: currentColor;
          transform: scaleX(0);
          transform-origin: center;
          transition: transform 0.22s ease;
        }
        .ntab.on::after { transform: scaleX(1); }

        .fpill {
          display: flex; align-items: center; gap: 6px;
          padding: 6px 13px; border-radius: 999px;
          border: 1px solid ${T.pillBorder}; background: ${T.pillBg};
          cursor: pointer; font-size: 11.5px; font-weight: 600;
          letter-spacing: 0.04em; color: ${T.pillText};
          transition: all 0.16s; white-space: nowrap;
        }
        .fpill:hover { border-color: ${T.pillHoverBorder}; color: ${T.pillHoverText}; }

        .sopt {
          padding: 9px 16px;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 13px; letter-spacing: 2px;
          cursor: pointer; color: ${T.pillText};
          transition: background 0.14s, color 0.14s;
        }
        .sopt:hover  { background: ${T.sortOptionHoverBg}; color: ${T.text}; }
        .sopt.picked { color: #c0392b; }

        .rrow {
          position: relative; transition: background 0.14s;
          display: grid; align-items: center;
          grid-template-columns: 42px 1fr 56px 38px;
          gap: 12px; padding: 12px 14px;
          border-bottom: 1px solid ${T.rowBorder};
        }
        .rrow:last-child { border-bottom: none; }
        .rrow:hover { background: ${T.rowHoverBg} !important; }

        .hexbg {
          background-image: radial-gradient(circle, ${T.hexDot} 1px, transparent 1px);
          background-size: 28px 28px;
        }

        .theme-btn {
          width: 36px; height: 36px;
          border-radius: 50%; border: 1px solid ${T.pillBorder};
          background: ${T.pillBg}; color: ${T.pillText};
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: all 0.2s; flex-shrink: 0;
        }
        .theme-btn:hover { border-color: ${T.pillHoverBorder}; color: ${T.pillHoverText}; transform: rotate(20deg); }

        .lmode-btn {
          display: flex; flex-direction: column;
          padding: 13px 24px 11px;
          border: none; background: transparent; cursor: pointer;
          text-align: left; transition: all 0.2s;
          border-bottom: 2px solid transparent;
        }
        .lmode-btn.active { border-bottom-color: var(--mode-color); }
        .lmode-btn:hover:not(.active) { background: ${T.rowHoverBg}; }
      `}</style>

      {/* ━━━━ HEADER ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <header className="hexbg" style={{ background: T.headerBg, borderBottom: `1px solid ${T.headerBorder}`, padding: '32px 24px 24px', flexShrink: 0 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20, marginBottom: 24 }}>

            {/* Title */}
            <div>
              <div style={{ fontFamily: "'Orbitron', sans-serif", lineHeight: 0.88, marginBottom: 10, fontWeight: 900 }}>
                <div style={{ fontSize: 58, letterSpacing: 4, color: '#c0392b', textShadow: darkMode ? '0 0 48px rgba(192,57,43,0.5), 0 2px 0 #8e0000' : '0 2px 8px rgba(192,57,43,0.25)' }}>MCU</div>
                <div style={{ fontSize: 32, letterSpacing: 7, color: T.text, marginTop: 2 }}>VIEWING ORDER</div>
              </div>
              <div style={{ fontSize: 10, color: T.textMuted, letterSpacing: 3, fontFamily: "'Bebas Neue', sans-serif", marginTop: 6 }}>
                PHASES 1–6 &nbsp;·&nbsp; {activeItems.length} ENTRIES &nbsp;·&nbsp; {LIST_MODES.find(m => m.id === listMode)?.sublabel.toUpperCase()}
              </div>
            </div>

            {/* Right: stats + theme toggle */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12 }}>
              {/* Theme toggle */}
              <button className="theme-btn" onClick={() => setDarkMode(d => !d)} title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'} aria-label="Toggle theme">
                {darkMode ? <Sun size={15} /> : <Moon size={15} />}
              </button>
              {/* Stat cards */}
              <div style={{ display: 'flex', gap: 8 }}>
                {[
                  { label: 'WATCHED', cur: totalWatched, tot: activeItems.length, color: '#3ec47a', glow: 'rgba(62,196,122,0.35)' },
                  { label: 'MUST-WATCH', cur: essWatched, tot: essTotal, color: '#e8b84b', glow: 'rgba(232,184,75,0.35)' },
                ].map(s => (
                  <div key={s.label} style={{ background: T.statCardBg, border: `1px solid ${T.statCardBorder}`, borderRadius: 10, padding: '12px 18px', minWidth: 106, textAlign: 'center', boxShadow: darkMode ? `inset 0 1px 0 rgba(255,255,255,0.04)` : 'none' }}>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 30, letterSpacing: 1, color: s.color, lineHeight: 1, textShadow: darkMode ? `0 0 18px ${s.glow}` : 'none' }}>
                      {s.cur}<span style={{ fontSize: 18, color: T.numFaint }}>/{s.tot}</span>
                    </div>
                    <div style={{ fontSize: 9, letterSpacing: 2, color: T.textMuted, marginTop: 3, fontFamily: "'Bebas Neue', sans-serif" }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Master progress bar */}
          <div style={{ background: T.surfaceBg, border: `1px solid ${T.surfaceBorder}`, borderRadius: 999, height: 7, overflow: 'hidden', position: 'relative', marginBottom: 6 }}>
            <div className="sweep" style={{ height: '100%', width: `${pct}%`, background: `linear-gradient(90deg, #8e0000 0%, #c0392b 40%, #e85252 75%, #3ec47a 100%)`, borderRadius: 999, transition: 'width 0.7s cubic-bezier(.4,0,.2,1)', position: 'relative', overflow: 'hidden' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: T.textMuted, letterSpacing: 2, fontFamily: "'Bebas Neue', sans-serif" }}>
            <span>{pct}% COMPLETE</span>
            <span>{activeItems.length - totalWatched} REMAINING</span>
          </div>
        </div>
      </header>

      {/* ━━━━ LIST MODE SWITCHER ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div style={{ background: T.listSwitcherBg, borderBottom: `1px solid ${T.listSwitcherBorder}`, padding: '0 24px', flexShrink: 0 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex' }}>
          {LIST_MODES.map(mode => {
            const isActive = listMode === mode.id;
            const modeItems = mode.id === 'core' ? items.filter(i => coreIds.has(i.id)) : items;
            const modeWatched = modeItems.filter(i => i.status === 'watched').length;
            const modePct = modeItems.length ? Math.round((modeWatched / modeItems.length) * 100) : 0;
            return (
              <button
                key={mode.id}
                className={`lmode-btn ${isActive ? 'active' : ''}`}
                style={{ '--mode-color': mode.color }}
                onClick={() => { setListMode(mode.id); setSearch(''); setEssOnly(false); setTypeFilter(null); setStatusFilter(null); setWatchedOnly(false); setSortBy('order'); setActivePhase(1); }}
                aria-pressed={isActive}
              >
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 7 }}>
                  <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, letterSpacing: 3, color: isActive ? mode.color : T.textMuted, transition: 'color 0.2s' }}>
                    {mode.label}
                  </span>
                  <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 10, letterSpacing: 1.5, color: isActive ? mode.color + 'bb' : T.textFaint, transition: 'color 0.2s' }}>
                    {modeItems.length}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 1 }}>
                  <span style={{ fontSize: 10, color: isActive ? T.textMuted : T.textFaint, letterSpacing: 0.5, fontFamily: "'Rajdhani', sans-serif", transition: 'color 0.2s' }}>
                    {mode.desc}
                  </span>
                  {modePct > 0 && (
                    <span style={{ fontSize: 9, fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 1, color: modePct === 100 ? mode.color : T.textFaint }}>
                      · {modePct}%
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ━━━━ PHASE NAVBAR ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <nav aria-label="Phase navigation" style={{ background: T.navBg, borderBottom: `1px solid ${T.navBorder}`, overflowX: 'auto', flexShrink: 0 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex' }}>
          {PHASES.map(ph => {
            const phItems = items.filter(i => {
              if (i.phase !== ph.id) return false;
              if (listMode === 'core' && !coreIds.has(i.id)) return false;
              if (listMode === 'core' && essentialOnly && !i.essential) return false;
              return true;
            });
            const phWatched = phItems.filter(i => i.status === 'watched').length;
            const phPct = phItems.length ? Math.round((phWatched / phItems.length) * 100) : 0;
            const isOn = activePhase === ph.id;
            return (
              <button key={ph.id} className={`ntab ${isOn ? 'on' : ''}`}
                aria-label={`${ph.name} — ${phPct}% watched`}
                aria-current={isOn ? 'true' : undefined}
                style={{ color: isOn ? ph.color : T.textMuted }}
                onClick={() => scrollTo(ph.id)}
              >
                <span>{ph.name}</span>
                {phItems.length > 0 && (
                  <span style={{ fontSize: 8.5, letterSpacing: 1, color: phPct === 100 ? ph.color : T.textFaint, fontFamily: "'Bebas Neue', sans-serif", marginTop: 2, lineHeight: 1 }}>
                    {phPct === 100 ? '✓' : `${phPct}%`}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* ━━━━ FILTER BAR ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div style={{ background: T.filterBg, borderBottom: `1px solid ${T.filterBorder}`, padding: '9px 24px', overflowX: 'auto', flexShrink: 0 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', gap: 7, flexWrap: 'wrap', alignItems: 'center' }}>

          {/* Search */}
          <div style={{ position: 'relative', flex: '1 1 180px', minWidth: 140 }}>
            <Search size={12} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: T.textMuted }} />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search titles..."
              style={{ width: '100%', background: T.inputBg, border: `1px solid ${T.inputBorder}`, borderRadius: 999, padding: '6px 12px 6px 28px', color: T.inputColor, fontSize: 11.5, letterSpacing: 0.3, fontFamily: 'inherit' }}
            />
          </div>

          {/* Sort */}
          <div ref={sortRef} style={{ position: 'relative' }}>
            <button className="fpill" onClick={() => setSortOpen(o => !o)}
              style={{ color: '#c0392b', borderColor: darkMode ? '#1e1430' : '#f0d8d0', background: darkMode ? '#0d0818' : '#fff5f3', fontFamily: "'Bebas Neue', sans-serif", fontSize: 13, letterSpacing: 2 }}>
              {SORT_LABELS[sortBy]}
              <ChevronDown size={11} style={{ opacity: 0.6, transform: sortOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>
            {sortOpen && (
              <div className="fade-in" style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, background: T.dropdownBg, border: `1px solid ${T.dropdownBorder}`, borderRadius: 10, overflow: 'hidden', zIndex: 100, boxShadow: T.dropdownShadow, minWidth: 170 }}>
                {Object.entries(SORT_LABELS).map(([k, v]) => (
                  <div key={k} className={`sopt ${sortBy === k ? 'picked' : ''}`} onClick={() => { setSortBy(k); setSortOpen(false); }}>{v}</div>
                ))}
              </div>
            )}
          </div>

          {/* Type pills */}
          {['film', 'series', 'short'].map(t => {
            const m = TYPE_META[t];
            const on = typeFilter === t;
            return (
              <button key={t} className="fpill"
                style={on ? { borderColor: m.color + '88', background: m.color + '14', color: m.color } : {}}
                onClick={() => setTypeFilter(on ? null : t)}>
                <m.Icon size={10} />
                {m.label}
              </button>
            );
          })}

          {/* Must-Watch — core mode only */}
          {listMode === 'core' && (
            <button className="fpill"
              style={essentialOnly ? { borderColor: '#e8b84b88', background: '#e8b84b14', color: '#e8b84b' } : {}}
              onClick={() => setEssOnly(o => !o)}>
              <Star size={10} />
              Must-Watch
            </button>
          )}

          {/* Watched filter */}
          <button className="fpill"
            style={watchedOnly ? { borderColor: '#3ec47a88', background: '#3ec47a14', color: '#3ec47a' } : {}}
            onClick={() => setWatchedOnly(o => !o)}>
            <Check size={10} />
            Watched
          </button>

          <div style={{ marginLeft: 'auto', fontFamily: "'Bebas Neue', sans-serif", fontSize: 11, color: T.textMuted, letterSpacing: 2 }}>
            {filtered.length} RESULTS
          </div>
        </div>
      </div>

      {/* ━━━━ CONTENT ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <main ref={mainRef} style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px 80px', width: '100%', flex: 1 }}>
        {phaseKeys.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0', fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: T.textMuted, letterSpacing: 4 }}>
            NO RESULTS — ADJUST YOUR FILTERS
          </div>
        )}

        {phaseKeys.map(pid => {
          const ph = PHASES.find(p => p.id === pid);
          const rows = grouped[pid];
          const done = rows.filter(r => r.status === 'watched').length;
          const phasePct = rows.length ? Math.round((done / rows.length) * 100) : 0;

          return (
            <section key={pid} className="section-up" data-phase={pid} ref={el => { phaseRefs.current[pid] = el; }} style={{ marginBottom: 40, scrollMarginTop: 120 }}>

              {/* ── Phase heading ── */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
                {/* Color bar */}
                <div style={{ width: 3, height: 40, background: ph.color, borderRadius: 2, flexShrink: 0, boxShadow: darkMode ? `0 0 14px ${ph.glow}` : 'none' }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 20, letterSpacing: 5, color: ph.color, lineHeight: 1, fontWeight: 700, textShadow: darkMode ? `0 0 20px ${ph.glow}` : 'none' }}>
                    {ph.name}
                  </div>
                  <div style={{ fontSize: 9.5, color: T.textMuted, letterSpacing: 2, fontFamily: "'Bebas Neue', sans-serif", marginTop: 2 }}>
                    {done}/{rows.length} WATCHED
                  </div>
                </div>
                {/* Mini progress bar */}
                <div style={{ width: 100, background: T.surfaceBg, border: `1px solid ${T.surfaceBorder}`, borderRadius: 999, height: 3, overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
                  <div className="sweep" style={{ height: '100%', width: `${phasePct}%`, background: ph.color, borderRadius: 999, transition: 'width 0.5s ease', position: 'relative', overflow: 'hidden', opacity: darkMode ? 0.8 : 0.9 }} />
                </div>
                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 12, letterSpacing: 1, color: phasePct === 100 ? ph.color : T.textMuted, flexShrink: 0, minWidth: 34, textAlign: 'right' }}>
                  {phasePct === 100 ? '✓ DONE' : `${phasePct}%`}
                </span>
                {/* Bulk action */}
                {done < rows.length ? (
                  <button
                    aria-label={`Mark all ${ph.name} as watched`}
                    onClick={() => markPhaseWatched(pid, 'watched')}
                    style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 10, letterSpacing: 1.5, color: ph.color, background: 'transparent', border: `1px solid ${ph.color}44`, borderRadius: 6, padding: '4px 10px', cursor: 'pointer', flexShrink: 0, transition: 'all 0.18s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = ph.color + '16'; e.currentTarget.style.borderColor = ph.color + '88'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = ph.color + '44'; }}
                  >
                    MARK ALL
                  </button>
                ) : (
                  <button
                    aria-label={`Clear all ${ph.name}`}
                    onClick={() => markPhaseWatched(pid, 'unwatched')}
                    style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 10, letterSpacing: 1.5, color: T.textMuted, background: 'transparent', border: `1px solid ${T.surfaceBorder}`, borderRadius: 6, padding: '4px 10px', cursor: 'pointer', flexShrink: 0, transition: 'all 0.18s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = T.rowHoverBg; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    CLEAR
                  </button>
                )}
              </div>

              {/* ── Row table ── */}
              <div style={{ background: T.surfaceBg, border: `1px solid ${T.surfaceBorder}`, borderRadius: 12, overflow: 'hidden', boxShadow: darkMode ? `0 2px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.03)` : '0 1px 8px rgba(0,0,0,0.06)' }}>
                {rows.map((item) => {
                  const m = TYPE_META[item.type];
                  const statusMeta = STATUS_META[item.status];
                  const showPre = !NO_PREREQ.has(item.prereq);
                  const isWatched = item.status === 'watched';

                  return (
                    <div key={item.id}
                      className="rrow row-in"
                      style={{ background: isWatched ? T.rowWatchedBg : 'transparent' }}
                    >
                      {/* Phase glow pulse on watched */}
                      {isWatched && darkMode && (
                        <div style={{ position: 'absolute', inset: 0, background: ph.color, opacity: 0, animation: 'glowPulse 4s ease-in-out infinite', pointerEvents: 'none', borderRadius: 0 }} />
                      )}

                      {/* Order / check */}
                      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 17, letterSpacing: 1, color: isWatched ? ph.color : T.textMuted, transition: 'color 0.28s', position: 'relative', textAlign: 'center' }}>
                        {isWatched
                          ? <Check size={15} style={{ color: ph.color }} />
                          : item.order}
                      </div>

                      {/* Title block */}
                      <div style={{ position: 'relative', minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                          <span style={{
                            fontSize: 13.5, fontWeight: isWatched ? 400 : 600, lineHeight: 1.35,
                            color: isWatched ? T.textMuted : T.text,
                            textDecoration: isWatched ? 'line-through' : 'none',
                            textDecorationColor: T.textFaint,
                            transition: 'color 0.28s',
                            fontFamily: "'Rajdhani', sans-serif",
                          }}>
                            {item.title}
                          </span>
                          {/* Type badge */}
                          <span style={{ fontSize: 9, color: m.color, opacity: 0.7, fontWeight: 700, letterSpacing: 0.6, display: 'flex', alignItems: 'center', gap: 2, fontFamily: "'Bebas Neue', sans-serif" }}>
                            <m.Icon size={8} />{m.label}
                          </span>
                          {/* Optional badge */}
                          {!item.essential && (
                            <span style={{ fontSize: 8.5, color: T.textMuted, background: darkMode ? '#0c0c20' : '#f0ece4', border: `1px solid ${T.pillBorder}`, borderRadius: 3, padding: '1px 5px', letterSpacing: 1, fontFamily: "'Bebas Neue', sans-serif" }}>
                              OPT
                            </span>
                          )}
                        </div>
                        {showPre && (
                          <div style={{ fontSize: 10, color: T.textMuted, marginTop: 2, fontFamily: "'Rajdhani', sans-serif", letterSpacing: 0.2 }}>
                            Needs: {item.prereq}
                          </div>
                        )}
                      </div>

                      {/* Year */}
                      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 12.5, letterSpacing: 1, color: T.textMuted, textAlign: 'center' }}>
                        {item.year}
                      </div>

                      {/* Status button */}
                      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button
                          className="wbtn"
                          aria-label={`${statusMeta.label} — click to change`}
                          aria-haspopup="true"
                          aria-expanded={statusDropdown === item.id}
                          onClick={e => openStatusDropdown(e, item.id)}
                          onContextMenu={e => e.preventDefault()}
                          onKeyDown={e => {
                            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openStatusDropdown(e, item.id); }
                            if (e.key === 'Escape') setStatusDropdown(null);
                          }}
                          style={{
                            background: statusMeta.bg,
                            color: statusMeta.color,
                            borderColor: statusMeta.color + '55',
                            boxShadow: item.status !== 'unwatched' && darkMode ? `0 0 10px ${statusMeta.color}38` : 'none',
                          }}
                        >
                          <statusMeta.Icon size={13} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}

        <div style={{ textAlign: 'center', marginTop: 48, fontFamily: "'Bebas Neue', sans-serif", fontSize: 9.5, color: T.footerText, letterSpacing: 3.5 }}>
          MCU VIEWING ORDER &nbsp;·&nbsp; PHASES 1–6 &nbsp;·&nbsp; PROGRESS SAVED LOCALLY
        </div>
      </main>

      {/* ━━━━ STATUS DROPDOWN ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {statusDropdown !== null && (() => {
        const activeItem = items.find(i => i.id === statusDropdown);
        return (
          <>
            <div style={{ position: 'fixed', inset: 0, zIndex: 998 }} onClick={() => setStatusDropdown(null)} aria-hidden="true" />
            <div
              className="fade-in"
              role="dialog"
              aria-label="Set watch status"
              style={{
                position: 'fixed',
                top: dropdownPos.y,
                left: dropdownPos.x,
                background: T.dropdownBg,
                border: `1px solid ${T.dropdownBorder}`,
                borderRadius: 12,
                padding: '10px',
                zIndex: 999,
                boxShadow: T.dropdownShadow,
                minWidth: 240,
              }}
            >
              {/* Item title */}
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 10.5, letterSpacing: 2, color: T.textMuted, marginBottom: 8, paddingBottom: 8, borderBottom: `1px solid ${T.surfaceBorder}`, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 220 }}>
                {activeItem?.title}
              </div>
              {/* Status options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {Object.entries(STATUS_META).map(([key, meta]) => {
                  const isCurrent = key === activeItem?.status;
                  return (
                    <button
                      key={key}
                      autoFocus={isCurrent}
                      onClick={() => { setStatusDirect(activeItem.id, key); setStatusDropdown(null); }}
                      onKeyDown={e => { if (e.key === 'Escape') setStatusDropdown(null); }}
                      aria-pressed={isCurrent}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                        padding: '8px 10px',
                        border: `1px solid ${isCurrent ? meta.color + '77' : 'transparent'}`,
                        background: isCurrent ? meta.color + '15' : 'transparent',
                        color: isCurrent ? meta.color : T.pillText,
                        borderRadius: 7, cursor: 'pointer',
                        fontFamily: "'Rajdhani', sans-serif", fontSize: 13,
                        fontWeight: isCurrent ? 600 : 400, letterSpacing: 0.4,
                        textAlign: 'left', transition: 'all 0.14s',
                      }}
                      onMouseEnter={e => { if (!isCurrent) { e.currentTarget.style.background = meta.color + '10'; e.currentTarget.style.color = meta.color; } }}
                      onMouseLeave={e => { if (!isCurrent) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = T.pillText; } }}
                    >
                      <meta.Icon size={14} />
                      {meta.label}
                      {isCurrent && <span style={{ marginLeft: 'auto', fontSize: 9, opacity: 0.5, fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 1 }}>CURRENT</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        );
      })()}
    </div>
  );
}
