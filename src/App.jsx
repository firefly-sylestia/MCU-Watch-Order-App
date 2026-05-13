import React, { useState, useEffect, useRef, useMemo } from 'react';

// ─── Icon primitives ────────────────────────────────────────────────────────
const Icon = ({ children, size = 16, style = {} }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size}
    viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    {children}
  </svg>
);
const Search    = p => <Icon {...p}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></Icon>;
const Eye       = p => <Icon {...p}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></Icon>;
const EyeOff    = p => <Icon {...p}><path d="m3 3 18 18"/><path d="M10.5 10.5a2 2 0 0 0 3 3"/><path d="M9.9 4.2A10.9 10.9 0 0 1 12 4c6.5 0 10 8 10 8a17.6 17.6 0 0 1-3.2 4.2"/><path d="M6.6 6.6A17.5 17.5 0 0 0 2 12s3.5 8 10 8a10.7 10.7 0 0 0 5.4-1.4"/></Icon>;
const Star      = p => <Icon {...p}><polygon points="12 2 15 9 22 9 17 14 19 21 12 17 5 21 7 14 2 9 9 9"/></Icon>;
const Film      = p => <Icon {...p}><rect x="2" y="2" width="20" height="20" rx="2"/><path d="M7 2v20"/><path d="M17 2v20"/><path d="M2 7h20"/><path d="M2 17h20"/></Icon>;
const Tv        = p => <Icon {...p}><rect x="2" y="7" width="20" height="15" rx="2"/><path d="M17 2 12 7 7 2"/></Icon>;
const Zap       = p => <Icon {...p}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></Icon>;
const ChevDown  = p => <Icon {...p}><path d="m6 9 6 6 6-6"/></Icon>;
const ChevRight = p => <Icon {...p}><path d="m9 6 6 6-6 6"/></Icon>;
const Check     = p => <Icon {...p}><path d="M20 6 9 17l-5-5"/></Icon>;
const Clock     = p => <Icon {...p}><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></Icon>;
const Pause     = p => <Icon {...p}><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></Icon>;
const Trash2    = p => <Icon {...p}><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></Icon>;
const Sun       = p => <Icon {...p}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></Icon>;
const Moon      = p => <Icon {...p}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></Icon>;
const Settings  = p => <Icon {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.02.02a2 2 0 1 1-2.83 2.83l-.02-.02A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21a2 2 0 1 1-4 0v-.03a1.7 1.7 0 0 0-.4-1.1 1.7 1.7 0 0 0-1-.6 1.7 1.7 0 0 0-1.87.34l-.02.02a2 2 0 1 1-2.83-2.83l.02-.02A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H2.9a2 2 0 1 1 0-4h.03a1.7 1.7 0 0 0 1.1-.4 1.7 1.7 0 0 0 .6-1 1.7 1.7 0 0 0-.34-1.87l-.02-.02a2 2 0 1 1 2.83-2.83l.02.02A1.7 1.7 0 0 0 9 4.6c.4 0 .78-.2 1-.6.25-.31.39-.7.4-1.1V2.9a2 2 0 1 1 4 0v.03c0 .4.15.79.4 1.1.22.4.6.6 1 .6.67.07 1.34-.16 1.87-.62l.02-.02a2 2 0 1 1 2.83 2.83l-.02.02a1.7 1.7 0 0 0-.34 1.87c0 .4.2.78.6 1 .31.25.7.39 1.1.4h.03a2 2 0 1 1 0 4h-.03a1.7 1.7 0 0 0-1.1.4 1.7 1.7 0 0 0-.6 1z"/></Icon>;
const Info      = p => <Icon {...p}><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></Icon>;

// ─── Static data ────────────────────────────────────────────────────────────
const PHASES = [
  { id: 1, name: 'Phase 1', color: '#e8b84b', glow: 'rgba(232,184,75,0.28)',  tagline: 'Assembling the Avengers',      summary: 'The birth of the MCU. Six heroes are introduced — Iron Man, Captain America, Thor, Hulk, Black Widow and Hawkeye — culminating in their first team-up against Loki and the Chitauri invasion of New York.' },
  { id: 2, name: 'Phase 2', color: '#e05252', glow: 'rgba(224,82,82,0.28)',   tagline: 'Expanding the Universe',       summary: 'The Avengers go their separate ways but face escalating threats. HYDRA is exposed within SHIELD, the Guardians of the Galaxy are introduced, and Ultron nearly destroys humanity — setting the stage for a fractured alliance.' },
  { id: 3, name: 'Phase 3', color: '#4a9ede', glow: 'rgba(74,158,222,0.28)',  tagline: 'The Infinity Saga Finale',     summary: 'The defining arc of the MCU. Civil War tears the Avengers apart, Thanos collects the Infinity Stones in Infinity War, and Endgame delivers the universe-spanning conclusion to 22 films.' },
  { id: 4, name: 'Phase 4', color: '#a06cd5', glow: 'rgba(160,108,213,0.28)', tagline: 'The Multiverse Begins',         summary: 'Post-Endgame, the world is reeling. Disney+ series deepen character stories, the multiverse cracks open in No Way Home and Multiverse of Madness, and an entirely new roster of heroes emerges.' },
  { id: 5, name: 'Phase 5', color: '#3ec47a', glow: 'rgba(62,196,122,0.28)',  tagline: 'The Multiverse Saga Escalates', summary: 'Kang the Conqueror emerges as the central threat across the multiverse. New heroes like Ms. Marvel, the Marvels and Ironheart push the MCU forward while legacy characters continue their arcs.' },
  { id: 6, name: 'Phase 6', color: '#25c4a0', glow: 'rgba(37,196,160,0.28)',  tagline: 'A New Age Begins',              summary: 'The Multiverse Saga reaches its climax with Avengers: Doomsday and Secret Wars. The Fantastic Four join the MCU, and entirely new stories reshape the Marvel universe going forward.' },
];

const TYPE_META = {
  film:   { label: 'Film',   Icon: Film, color: '#e8b84b' },
  series: { label: 'Series', Icon: Tv,   color: '#4a9ede' },
  short:  { label: 'Short',  Icon: Zap,  color: '#a06cd5' },
};

const STATUS_META = {
  watched:        { label: 'Watched',        color: '#3ec47a', Icon: Check,  bg: 'rgba(62,196,122,0.1)'  },
  'plan-to-watch':{ label: 'Plan to Watch',  color: '#4a9ede', Icon: Clock,  bg: 'rgba(74,158,222,0.1)'  },
  watching:       { label: 'Watching',       color: '#e8b84b', Icon: Eye,    bg: 'rgba(232,184,75,0.1)'  },
  'on-hold':      { label: 'On Hold',        color: '#f39c12', Icon: Pause,  bg: 'rgba(243,156,18,0.1)'  },
  dropped:        { label: 'Dropped',        color: '#e05252', Icon: Trash2, bg: 'rgba(224,82,82,0.1)'   },
  unwatched:      { label: 'Unwatched',      color: '#334455', Icon: EyeOff, bg: 'transparent'           },
};

const NO_PREREQ = new Set([
  'None','None (standalone)','None (mostly standalone)',
  'None (multiverse)','None (intro to FF)','None (supernatural entry)',
  'None (prequel to Homecoming)','General MCU knowledge',
  'None (new arc starts)','None (alternate reality)',
  'None (alternate reality, optional)','None (separate continuity)',
]);

const SORT_LABELS = { order: 'Chronological', year: 'By Year', title: 'Alphabetical' };

// ─── ESSENTIAL LIST (60 items) ───────────────────────────────────────────────
const ESSENTIAL_LIST = [
  { id: 1,  order: 1,  phase: 1, type: 'film',   year: 2011, essential: true,  episodes: null, title: "Captain America: The First Avenger", prereq: "None",                                    desc: "Steve Rogers, a scrawny kid from Brooklyn, is transformed into a super-soldier to fight HYDRA and the villainous Red Skull during World War II. Sets the entire MCU in motion." },
  { id: 2,  order: 2,  phase: 1, type: 'film',   year: 2008, essential: true,  episodes: null, title: "Iron Man",                          prereq: "None",                                    desc: "Billionaire weapons manufacturer Tony Stark builds a powered suit of armor to escape captivity, then becomes Iron Man to fight evil — and discovers a far greater conspiracy." },
  { id: 3,  order: 3,  phase: 1, type: 'film',   year: 2008, essential: true,  episodes: null, title: "The Incredible Hulk",               prereq: "None",                                    desc: "Bruce Banner, hunted by the U.S. military, struggles to cure himself of the Hulk while a shadowy general creates an even bigger monster: the Abomination." },
  { id: 4,  order: 4,  phase: 1, type: 'film',   year: 2010, essential: true,  episodes: null, title: "Iron Man 2",                        prereq: "Iron Man",                                desc: "Tony Stark faces a Russian physicist out for revenge and a rival weapons manufacturer while the government pushes him to hand over the Iron Man technology." },
  { id: 5,  order: 5,  phase: 1, type: 'film',   year: 2011, essential: true,  episodes: null, title: "Thor",                             prereq: "None",                                    desc: "Thor, the arrogant prince of Asgard, is stripped of his power and cast to Earth, where he must prove himself worthy again while Loki schemes to take the throne." },
  { id: 6,  order: 6,  phase: 1, type: 'film',   year: 2012, essential: true,  episodes: null, title: "The Avengers",                     prereq: "None",                                    desc: "Nick Fury assembles Iron Man, Captain America, Thor, Hulk, Black Widow and Hawkeye to stop Loki from using the Tesseract to bring an alien army to Earth." },
  { id: 7,  order: 7,  phase: 2, type: 'film',   year: 2013, essential: true,  episodes: null, title: "Thor: The Dark World",              prereq: "Thor, The Avengers",                     desc: "An ancient enemy, the Dark Elves, seeks to plunge the universe into darkness using a weapon called the Aether — and Thor must ally with the treacherous Loki to stop them." },
  { id: 8,  order: 8,  phase: 2, type: 'film',   year: 2014, essential: true,  episodes: null, title: "Guardians of the Galaxy",           prereq: "None (standalone)",                      desc: "Outlaw Peter Quill teams up with a motley group of space misfits — Gamora, Drax, Rocket and Groot — to prevent a powerful orb from falling into the wrong hands." },
  { id: 9,  order: 9,  phase: 2, type: 'film',   year: 2014, essential: true,  episodes: null, title: "Captain America: The Winter Soldier",prereq: "Captain America: The First Avenger",    desc: "Steve Rogers uncovers a massive conspiracy within SHIELD and faces a deadly assassin known as the Winter Soldier, whose identity reveals a heartbreaking truth." },
  { id: 10, order: 10, phase: 2, type: 'film',   year: 2013, essential: true,  episodes: null, title: "Iron Man 3",                        prereq: "Iron Man 2, The Avengers",               desc: "Tony Stark, suffering PTSD after the Battle of New York, faces a mysterious terrorist called the Mandarin whose attacks push Tony to his very limits." },
  { id: 11, order: 11, phase: 2, type: 'film',   year: 2017, essential: true,  episodes: null, title: "Guardians of the Galaxy Vol. 2",    prereq: "Guardians of the Galaxy",               desc: "Peter Quill discovers the truth about his celestial father Ego, while the Guardians battle their own complicated family dynamics across the galaxy." },
  { id: 12, order: 12, phase: 2, type: 'series', year: 2023, essential: false, episodes: 10,   title: "I Am Groot S1 & S2",                prereq: "Guardians Vol. 1",                       desc: "A series of comedy shorts following Baby Groot's misadventures and interactions with alien creatures. Entirely standalone, light-hearted fun between bigger MCU entries." },
  { id: 13, order: 13, phase: 2, type: 'film',   year: 2015, essential: true,  episodes: null, title: "Avengers: Age of Ultron",           prereq: "All Phase 1-2 films",                    desc: "Tony Stark's experiment to create a peacekeeping AI, Ultron, goes catastrophically wrong. The Avengers must stop their creation before it causes extinction — and recruit two new heroes in the process." },
  { id: 14, order: 14, phase: 3, type: 'film',   year: 2016, essential: true,  episodes: null, title: "Doctor Strange",                   prereq: "General MCU knowledge",                  desc: "Brilliant but arrogant neurosurgeon Stephen Strange has a career-ending accident and discovers a hidden world of magic and alternate dimensions, becoming a powerful sorcerer." },
  { id: 15, order: 15, phase: 3, type: 'film',   year: 2015, essential: true,  episodes: null, title: "Ant-Man",                          prereq: "Age of Ultron",                           desc: "Ex-con Scott Lang must embrace his inner hero and help his mentor Dr. Hank Pym pull off a heist using a suit that allows the wearer to shrink to the size of an ant." },
  { id: 16, order: 16, phase: 3, type: 'film',   year: 2016, essential: true,  episodes: null, title: "Captain America: Civil War",        prereq: "All previous MCU films",                 desc: "The Avengers fracture over government oversight — Iron Man supports the Sokovia Accords while Captain America refuses to sign. Introduces Black Panther and Spider-Man to the MCU." },
  { id: 17, order: 17, phase: 4, type: 'film',   year: 2021, essential: true,  episodes: null, title: "Black Widow",                       prereq: "Captain America: Civil War",             desc: "Set after Civil War, Natasha Romanoff confronts her past and the brutal spy program that made her who she is — the Red Room — alongside her estranged family." },
  { id: 18, order: 18, phase: 3, type: 'film',   year: 2018, essential: true,  episodes: null, title: "Black Panther",                     prereq: "Civil War",                              desc: "T'Challa returns to Wakanda to claim the throne, but a ruthless outsider with a legitimate claim challenges him — forcing T'Challa to decide what kind of king he wants to be." },
  { id: 19, order: 19, phase: 3, type: 'film',   year: 2017, essential: true,  episodes: null, title: "Spider-Man: Homecoming",            prereq: "Civil War",                              desc: "15-year-old Peter Parker tries to balance high school life with being Spider-Man, while trying to impress Tony Stark and stop a black-market weapons dealer called the Vulture." },
  { id: 20, order: 20, phase: 3, type: 'film',   year: 2018, essential: true,  episodes: null, title: "Ant-Man & the Wasp",               prereq: "Ant-Man, Civil War",                     desc: "Scott Lang joins forces with Hope van Dyne as the Wasp to uncover secrets from the quantum realm — including a mysterious ghost who can phase through solid matter." },
  { id: 21, order: 21, phase: 3, type: 'film',   year: 2017, essential: true,  episodes: null, title: "Thor: Ragnarok",                   prereq: "Thor: The Dark World, Age of Ultron",    desc: "Thor is stranded on a trash planet, loses his hammer, and must escape from the grandmaster's arena to stop the goddess of death Hela from conquering Asgard — with Hulk's help." },
  { id: 22, order: 22, phase: 3, type: 'film',   year: 2018, essential: true,  episodes: null, title: "Avengers: Infinity War",            prereq: "All Phase 3 films",                      desc: "Thanos, armed with the Infinity Gauntlet, hunts all six Infinity Stones. The Avengers and Guardians unite across the universe to stop him — and suffer their greatest defeat." },
  { id: 23, order: 23, phase: 3, type: 'film',   year: 2019, essential: true,  episodes: null, title: "Captain Marvel",                   prereq: "General MCU knowledge",                  desc: "Carol Danvers discovers her past as an Air Force pilot and unlocks the full extent of her cosmic powers while caught in the middle of a galactic war between the Kree and the Skrulls." },
  { id: 24, order: 24, phase: 3, type: 'film',   year: 2019, essential: true,  episodes: null, title: "Avengers: Endgame",                prereq: "Infinity War",                            desc: "Five years after Thanos wiped out half of all life, the surviving Avengers attempt a time heist to undo the snap in a desperate final stand that brings the Infinity Saga to a close." },
  { id: 25, order: 25, phase: 4, type: 'series', year: 2021, essential: true,  episodes: 9,    title: "WandaVision S1",                   prereq: "Avengers: Endgame",                       desc: "Wanda Maximoff and Vision live an idyllic suburban life — but their sitcom reality isn't what it seems. A mystery unravels that redefines Wanda's power and shatters her world. 9 episodes." },
  { id: 26, order: 26, phase: 4, type: 'series', year: 2021, essential: true,  episodes: 6,    title: "The Falcon & the Winter Soldier S1",prereq: "Endgame, Captain America history",       desc: "Sam Wilson and Bucky Barnes navigate a divided post-blip world while confronting a radical new group, the Flag Smashers, and a man who has stolen the Captain America shield. 6 episodes." },
  { id: 27, order: 27, phase: 3, type: 'film',   year: 2019, essential: true,  episodes: null, title: "Spider-Man: Far From Home",        prereq: "Avengers: Endgame",                       desc: "Peter Parker tries to take a vacation in Europe after Endgame but is pulled into a mission with Nick Fury to stop Elemental creatures — and meets the mysterious Mysterio." },
  { id: 28, order: 28, phase: 4, type: 'film',   year: 2021, essential: true,  episodes: null, title: "Spider-Man: No Way Home",          prereq: "Far From Home, Multiverse concept",       desc: "Peter asks Doctor Strange to make the world forget he is Spider-Man. The spell goes wrong, tearing open the multiverse and bringing villains and heroes from other realities into his world." },
  { id: 29, order: 29, phase: 4, type: 'series', year: 2021, essential: true,  episodes: 6,    title: "Hawkeye S1",                       prereq: "Avengers movies",                         desc: "Retired Avenger Clint Barton is forced out of retirement when his Ronin past catches up with him in New York. He teams up with aspiring archer Kate Bishop to stop the Tracksuit Mafia. 6 episodes." },
  { id: 30, order: 30, phase: 4, type: 'film',   year: 2022, essential: false, episodes: null, title: "Guardians Holiday Special",        prereq: "Guardians films",                         desc: "The Guardians of the Galaxy celebrate Christmas by kidnapping Kevin Bacon as a gift for Peter Quill — a hilarious, heartwarming holiday special that introduces Mantis's big secret." },
  { id: 31, order: 31, phase: 4, type: 'series', year: 2021, essential: true,  episodes: 6,    title: "Loki S1",                          prereq: "Avengers: Endgame",                       desc: "The Variant Loki is captured by the TVA — the Time Variance Authority — and must help them track down a rogue variant of himself while uncovering a vast conspiracy about the sacred timeline. 6 episodes." },
  { id: 32, order: 32, phase: 5, type: 'film',   year: 2023, essential: true,  episodes: null, title: "Ant-Man & the Wasp: Quantumania",  prereq: "Ant-Man films, Loki S1",                 desc: "Scott Lang and his family are pulled into the Quantum Realm where they encounter Kang the Conqueror — the most powerful villain the MCU has faced yet, with terrifying implications for the multiverse." },
  { id: 33, order: 33, phase: 5, type: 'series', year: 2023, essential: true,  episodes: 6,    title: "Loki S2",                          prereq: "Loki S1, Quantumania",                   desc: "Loki grapples with time-slipping across different eras of the TVA while fighting to save his friends and the multiverse itself from a catastrophic collapse. 6 episodes." },
  { id: 34, order: 34, phase: 4, type: 'series', year: 2021, essential: false, episodes: 9,    title: "What If...? S1",                   prereq: "General MCU knowledge",                  desc: "An animated anthology exploring alternate MCU timelines: what if Peggy Carter got the serum? What if T'Challa became Star-Lord? Each episode reframes a familiar story with startling results. 9 episodes." },
  { id: 35, order: 35, phase: 4, type: 'series', year: 2023, essential: false, episodes: 9,    title: "What If...? S2",                   prereq: "What If...? S1",                          desc: "More animated alternate realities, including Captain Carter in the MCU timeline and a Captain America who never got the serum. Continues the Watcher's anthology. 9 episodes." },
  { id: 36, order: 36, phase: 5, type: 'series', year: 2024, essential: false, episodes: 10,   title: "What If...? S3",                   prereq: "What If...? S1-2",                        desc: "The final season of What If brings together characters from across the multiverse for a grand finale, paying off threads from all three seasons in a big animated event. 10 episodes." },
  { id: 37, order: 37, phase: 5, type: 'film',   year: 2024, essential: false, episodes: null, title: "Deadpool & Wolverine",             prereq: "General MCU knowledge (optional)",        desc: "Wade Wilson is recruited by the TVA and teams up with a variant Wolverine to save his universe — and deliver the MCU's most irreverent, fourth-wall-breaking, R-rated adventure yet." },
  { id: 38, order: 38, phase: 4, type: 'film',   year: 2022, essential: true,  episodes: null, title: "Thor: Love and Thunder",           prereq: "Thor: Ragnarok, Avengers",               desc: "Thor embarks on a journey of self-discovery while Jane Foster wields Mjolnir as the Mighty Thor. The villain Gorr the God Butcher hunts deities across the cosmos." },
  { id: 39, order: 39, phase: 5, type: 'film',   year: 2023, essential: true,  episodes: null, title: "Guardians of the Galaxy Vol. 3",  prereq: "Guardians Vol. 1-2",                     desc: "The Guardians must protect Rocket Raccoon from his traumatic past and the High Evolutionary, the monster who created him. An emotional, definitive finale for the original team." },
  { id: 40, order: 40, phase: 4, type: 'film',   year: 2022, essential: true,  episodes: null, title: "Black Panther: Wakanda Forever",  prereq: "Black Panther",                           desc: "Wakanda mourns the loss of T'Challa and faces a new threat from Talokan, an underwater nation led by the powerful Namor — forcing Shuri to decide her own destiny as a warrior." },
  { id: 41, order: 41, phase: 4, type: 'series', year: 2022, essential: false, episodes: 6,    title: "Moon Knight S1",                  prereq: "None (standalone, optional)",             desc: "Steven Grant, a mild-mannered gift shop employee, discovers he shares a body with mercenary Marc Spector — an avatar of the Egyptian moon god Khonshu. 6 episodes." },
  { id: 42, order: 42, phase: 4, type: 'film',   year: 2021, essential: true,  episodes: null, title: "Shang-Chi & the Legend of the Ten Rings", prereq: "None (standalone)",             desc: "Shaun, a parking valet living in San Francisco, is drawn into the world of the Ten Rings organization when agents from his past find him — and he learns the truth about his father Wenwu." },
  { id: 43, order: 43, phase: 4, type: 'film',   year: 2022, essential: true,  episodes: null, title: "Doctor Strange: Multiverse of Madness", prereq: "Doctor Strange, WandaVision",  desc: "Strange and America Chavez travel across the multiverse pursued by a terrifying threat. This Doctor Strange sequel is the most horror-inflected MCU film, directed by Sam Raimi." },
  { id: 44, order: 44, phase: 5, type: 'series', year: 2024, essential: false, episodes: 9,    title: "Agatha All Along S1",             prereq: "WandaVision",                             desc: "The Scarlet Witch's nemesis Agatha Harkness assembles a ragtag coven to run the Witches Road — a deadly gauntlet that promises to restore lost powers. 9 episodes." },
  { id: 45, order: 45, phase: 4, type: 'film',   year: 2021, essential: true,  episodes: null, title: "Eternals",                         prereq: "None (mostly standalone)",               desc: "Ten immortal beings who have secretly lived on Earth for 7,000 years reunite to face an emerging threat that could trigger the end of the planet — and uncover a devastating truth about their mission." },
  { id: 46, order: 46, phase: 4, type: 'series', year: 2022, essential: false, episodes: 9,    title: "She-Hulk: Attorney at Law S1",    prereq: "The Incredible Hulk, Avengers",           desc: "Jennifer Walters, a lawyer and Bruce Banner's cousin, acquires Hulk powers and must balance her personal and professional life while handling superhuman legal cases. 9 episodes." },
  { id: 47, order: 47, phase: 4, type: 'series', year: 2022, essential: true,  episodes: 6,    title: "Ms. Marvel S1",                   prereq: "General MCU knowledge",                  desc: "16-year-old Kamala Khan, a Pakistani-American fan of the Avengers from Jersey City, discovers she has unique powers and must figure out who she is — as a hero and as a person. 6 episodes." },
  { id: 48, order: 48, phase: 5, type: 'film',   year: 2023, essential: true,  episodes: null, title: "The Marvels",                      prereq: "Captain Marvel, WandaVision, Ms. Marvel", desc: "Carol Danvers, Monica Rambeau and Kamala Khan find their powers entangled, forcing them to swap places every time they use them. A light, fast-paced team-up across the cosmos." },
  { id: 49, order: 49, phase: 5, type: 'series', year: 2023, essential: false, episodes: 6,    title: "Secret Invasion S1",              prereq: "Captain Marvel, Avengers",               desc: "Nick Fury returns to Earth to face a faction of Skrulls who have been secretly infiltrating human society for years — a grounded spy thriller in the MCU. 6 episodes." },
  { id: 50, order: 50, phase: 5, type: 'series', year: 2024, essential: false, episodes: 5,    title: "Echo S1",                          prereq: "Daredevil, Hawkeye (optional)",           desc: "Maya Lopez returns to her hometown of Tamaha, Oklahoma, where she reconnects with her Native American heritage while a dark past and Kingpin's criminal empire catch up to her. 5 episodes." },
  { id: 51, order: 51, phase: 5, type: 'series', year: 2025, essential: false, episodes: 9,    title: "Daredevil: Born Again S1",         prereq: "General MCU knowledge (optional)",        desc: "Matt Murdock returns as Daredevil in the MCU proper, picking up threads from the Netflix era while Wilson Fisk rises to become New York's mayor in a gripping crime drama. 9 episodes." },
  { id: 52, order: 52, phase: 5, type: 'series', year: 2025, essential: false, episodes: 9,    title: "Daredevil: Born Again S2",         prereq: "Born Again S1 (optional)",               desc: "The second season of Daredevil: Born Again continues Matt Murdock's battle against Wilson Fisk and expands the street-level side of the MCU further. 9 episodes." },
  { id: 53, order: 53, phase: 5, type: 'film',   year: 2025, essential: true,  episodes: null, title: "Captain America: Brave New World", prereq: "All previous MCU films",                 desc: "Sam Wilson leads as the new Captain America, navigating international intrigue while a dangerous conspiracy involving the Red Hulk and Adamantium threatens global stability." },
  { id: 54, order: 54, phase: 5, type: 'series', year: 2025, essential: false, episodes: 6,    title: "Ironheart S1",                     prereq: "Black Panther: Wakanda Forever",          desc: "Riri Williams, a genius MIT student who built her own Iron Man suit, ventures to Chicago where she encounters the mysterious Hood and gets pulled into a dangerous magical conspiracy. 6 episodes." },
  { id: 55, order: 55, phase: 5, type: 'film',   year: 2025, essential: true,  episodes: null, title: "Thunderbolts*",                   prereq: "General MCU knowledge",                  desc: "A group of reformed villains and antiheroes — including Yelena Belova, US Agent, Ghost and the Winter Soldier — are assembled for a mission that uncovers a threat none of them expected." },
  { id: 56, order: 56, phase: 6, type: 'film',   year: 2025, essential: true,  episodes: null, title: "Fantastic Four: First Steps",      prereq: "None (new arc starts)",                  desc: "The Fantastic Four make their MCU debut in a retro-futuristic 1960s-inspired setting, facing the world-devouring Galactus and his herald, Silver Surfer, in a cosmic spectacle." },
  { id: 57, order: 57, phase: 6, type: 'series', year: 2026, essential: false, episodes: null, title: "Wonder Man S1",                    prereq: "General MCU knowledge",                  desc: "Simon Williams, a fading Hollywood actor, is recruited by MODOK to become Wonder Man. A satirical look at the entertainment industry through the lens of superhero action." },
  { id: 58, order: 58, phase: 4, type: 'film',   year: 2022, essential: false, episodes: null, title: "Werewolf by Night",               prereq: "None (standalone, optional)",             desc: "A group of hunters gather at a mysterious manor to compete for a powerful relic — but one among them is a monster hunter with a monstrous secret. A black-and-white horror tribute." },
  { id: 59, order: 59, phase: 6, type: 'series', year: 2025, essential: false, episodes: null, title: "Eyes of Wakanda S1",               prereq: "Black Panther (optional)",               desc: "An animated anthology following Wakandan warriors throughout history as they retrieve Vibranium weapons from around the world — expanding the mythology of the Black Panther universe." },
  { id: 60, order: 60, phase: 6, type: 'series', year: 2025, essential: false, episodes: null, title: "Marvel Zombies S1",               prereq: "None (alternate reality, optional)",      desc: "Set in an alternate MCU reality overrun by a zombie plague, a group of young heroes — including Kamala Khan — must fight to survive in a horror-tinged animated series for mature audiences." },
];

// ─── ADDITIONAL LIST (54 items — no duplicates with ESSENTIAL_LIST) ──────────
const ADDITIONAL_LIST = [
  { id: 101, order: 101, phase: 1, type: 'short',  year: 2013, essential: false, episodes: 1,  title: "Agent Carter (One-Shot)",            prereq: "CATFA",                          desc: "A short film following Peggy Carter one year after WWII, proving her worth to SSR colleagues who underestimate her — a precursor to the full Agent Carter series." },
  { id: 102, order: 102, phase: 1, type: 'series', year: 2015, essential: false, episodes: 18, title: "Agent Carter S1 & S2",               prereq: "CATFA",                          desc: "Peggy Carter works as an SSR agent after the war, fighting Howard Stark's enemies and later an adversary in Hollywood. 10 episodes across 2 seasons of spy-era adventure." },
  { id: 103, order: 103, phase: 1, type: 'short',  year: 2011, essential: false, episodes: 1,  title: "A Funny Thing Happened on the Way to Thor's Hammer", prereq: "None",          desc: "A brief comedic short following Agent Coulson stopping a convenience store robbery on his way to the Thor investigation. Charm in under 4 minutes." },
  { id: 104, order: 104, phase: 1, type: 'short',  year: 2011, essential: false, episodes: 1,  title: "The Consultant",                     prereq: "The Avengers",                   desc: "Coulson and Sitwell reveal the behind-the-scenes deal that kept the Abomination out of the Avengers Initiative — a clever retcon connecting The Incredible Hulk to the wider MCU." },
  { id: 105, order: 105, phase: 1, type: 'short',  year: 2012, essential: false, episodes: 1,  title: "Item 47",                            prereq: "The Avengers",                   desc: "A couple discovers a Chitauri weapon from the Battle of New York and uses it to rob banks, attracting SHIELD's attention. The first short to hint at the wider post-Avengers world." },
  { id: 106, order: 106, phase: 2, type: 'series', year: 2013, essential: false, episodes: 7,  title: "Agents of SHIELD S1 Eps 1–7",       prereq: "The Avengers",                   desc: "Coulson's new SHIELD team investigates superhuman activity in the post-Avengers world. Episodes 1–7 establish the team and introduce the Centipede organization threatening SHIELD." },
  { id: 107, order: 107, phase: 2, type: 'series', year: 2013, essential: false, episodes: 5,  title: "Agents of SHIELD S1 Eps 8–12",      prereq: "The Avengers",                   desc: "The mystery of Coulson's resurrection deepens as the team faces escalating threats. These 5 episodes tie in with Thor: The Dark World's fallout." },
  { id: 108, order: 108, phase: 2, type: 'short',  year: 2014, essential: false, episodes: 1,  title: "All Hail the King",                  prereq: "Iron Man 3",                     desc: "Trevor Slattery, imprisoned after Iron Man 3, is interviewed in jail — until a mysterious visitor arrives with very bad news about the real Mandarin. A short that reshapes Iron Man 3's legacy." },
  { id: 109, order: 109, phase: 2, type: 'series', year: 2013, essential: false, episodes: 3,  title: "Agents of SHIELD S1 Eps 13–15",     prereq: "The Avengers",                   desc: "The team uncovers more about the Clairvoyant and the mysterious GH compound, raising the stakes in the first season's escalating conspiracy." },
  { id: 110, order: 110, phase: 2, type: 'series', year: 2013, essential: false, episodes: 1,  title: "Agents of SHIELD S1 Ep 16",         prereq: "The Avengers",                   desc: "A pivotal episode that directly ties into the events of Captain America: The Winter Soldier — watch this immediately before or after CATWS for maximum impact." },
  { id: 111, order: 111, phase: 2, type: 'series', year: 2014, essential: false, episodes: 9,  title: "Agents of SHIELD S1 Eps 17–22 & S2 Eps 1–2", prereq: "CATWS",              desc: "HYDRA's infiltration of SHIELD tears Coulson's team apart. These post-Winter Soldier episodes are dramatically more intense and pay off the season-long conspiracy." },
  { id: 112, order: 112, phase: 2, type: 'series', year: 2014, essential: false, episodes: 1,  title: "Agents of SHIELD S2 Ep 3",          prereq: "CATWS",                          desc: "A standalone episode deepening the new SHIELD's mission as Coulson's team begins to rebuild after the HYDRA fallout." },
  { id: 113, order: 113, phase: 2, type: 'series', year: 2014, essential: false, episodes: 2,  title: "Agents of SHIELD S2 Eps 4–5",       prereq: "CATWS",                          desc: "More fallout from HYDRA's rise as the team investigates alien writing and Coulson's mysterious compulsion deepens." },
  { id: 114, order: 114, phase: 2, type: 'series', year: 2015, essential: false, episodes: 13, title: "Daredevil S1",                       prereq: "None (mostly standalone)",       desc: "Blind lawyer Matt Murdock fights crime in Hell's Kitchen as Daredevil by night, battling the criminal kingpin Wilson Fisk in one of Marvel's darkest and most acclaimed stories. 13 episodes." },
  { id: 115, order: 115, phase: 2, type: 'series', year: 2015, essential: false, episodes: 13, title: "Jessica Jones S1",                   prereq: "None (mostly standalone)",       desc: "Hard-drinking private investigator Jessica Jones hunts a mind-controlling villain named Kilgrave who has terrorized her before — a dark, gripping psychological thriller. 13 episodes." },
  { id: 116, order: 116, phase: 2, type: 'series', year: 2014, essential: false, episodes: 14, title: "Agents of SHIELD S2 Eps 6–19",      prereq: "CATWS",                          desc: "The team tracks Inhumans and deals with a splinter SHIELD faction. The Inhuman mythology that will dominate later seasons is built here over 14 episodes." },
  { id: 117, order: 117, phase: 2, type: 'series', year: 2014, essential: false, episodes: 3,  title: "Agents of SHIELD S2 Eps 20–22",     prereq: "CATWS",                          desc: "Season 2 finale — the two SHIELD factions clash and a major Inhuman transformation reshapes the status quo heading into Phase 3 of the show." },
  { id: 118, order: 118, phase: 2, type: 'series', year: 2014, essential: false, episodes: 5,  title: "WHiH Newsfront S1",                  prereq: "Age of Ultron context",           desc: "An in-universe digital series from WHiH World News, covering Avengers-related events. Short web episodes that add texture to the MCU's media landscape." },
  { id: 119, order: 119, phase: 2, type: 'series', year: 2016, essential: false, episodes: 13, title: "Daredevil S2",                       prereq: "Daredevil S1",                   desc: "Matt Murdock faces the Punisher's brutal war on crime and the return of Elektra while the Hand rises as a new supernatural threat. Introduces Frank Castle in a landmark performance. 13 episodes." },
  { id: 120, order: 120, phase: 2, type: 'series', year: 2016, essential: false, episodes: 13, title: "Luke Cage S1",                       prereq: "Jessica Jones (recommended)",    desc: "Former convict Luke Cage, a bulletproof man with super strength, becomes an unwilling hero in Harlem when a crime boss threatens his community. 13 episodes." },
  { id: 121, order: 121, phase: 2, type: 'series', year: 2015, essential: false, episodes: 10, title: "Agents of SHIELD S3 Eps 1–10",      prereq: "Previous SHIELD seasons",        desc: "The ATCU hunts Inhumans while Coulson searches for a dangerous Inhuman in space. The first half of Season 3 deepens the Inhuman world and introduces the mythical Hive." },
  { id: 122, order: 122, phase: 2, type: 'series', year: 2017, essential: false, episodes: 13, title: "Iron Fist S1",                       prereq: "Daredevil, Luke Cage, JJ",       desc: "Danny Rand, heir to a corporate empire and master of the Iron Fist, returns to New York after 15 years to reclaim his company and fight the Hand. 13 episodes." },
  { id: 123, order: 123, phase: 2, type: 'series', year: 2015, essential: false, episodes: 4,  title: "Agents of SHIELD S3 Eps 11–14",     prereq: "Previous SHIELD seasons",        desc: "Hive's plan begins to take shape as the team suffers a major loss — these four episodes represent the emotional heart of Season 3." },
  { id: 124, order: 124, phase: 2, type: 'series', year: 2015, essential: false, episodes: 1,  title: "WHiH Newsfront S2 Ep 1",            prereq: "Ongoing MCU events",              desc: "A WHiH interview segment with Christine Everhart covering the Avengers and the political debate around superhero accountability — tying into Civil War's themes." },
  { id: 125, order: 125, phase: 2, type: 'series', year: 2015, essential: false, episodes: 2,  title: "Agents of SHIELD S3 Eps 15–16",     prereq: "Previous SHIELD seasons",        desc: "The stakes escalate as Hive's power grows and the team is forced to make impossible choices to protect the world." },
  { id: 126, order: 126, phase: 2, type: 'series', year: 2015, essential: false, episodes: 1,  title: "WHiH Newsfront S2 Ep 2",            prereq: "Ongoing MCU events",              desc: "Another WHiH segment covering the political aftermath of Age of Ultron and the Sokovia Accords debate that will drive Captain America: Civil War." },
  { id: 127, order: 127, phase: 2, type: 'series', year: 2015, essential: false, episodes: 2,  title: "Agents of SHIELD S3 Eps 17–18",     prereq: "Previous SHIELD seasons",        desc: "The team races to stop Hive before his plan reaches the point of no return in two tense penultimate episodes." },
  { id: 128, order: 128, phase: 2, type: 'series', year: 2015, essential: false, episodes: 3,  title: "WHiH Newsfront S2 Eps 3–5",         prereq: "Ongoing MCU events",              desc: "The final WHiH digital shorts covering pre-Civil War tensions, including commentary on the Sokovia Accords and superhero registration from an in-universe media perspective." },
  { id: 129, order: 129, phase: 2, type: 'series', year: 2017, essential: false, episodes: 8,  title: "The Defenders S1",                  prereq: "All Netflix street-level shows",  desc: "Daredevil, Jessica Jones, Luke Cage and Iron Fist unite to face the Hand and its mysterious leader Alexandra in New York City's biggest street-level crisis. 8 episodes." },
  { id: 130, order: 130, phase: 2, type: 'series', year: 2015, essential: false, episodes: 1,  title: "Agents of SHIELD S3 Ep 19",         prereq: "Previous SHIELD seasons",        desc: "A standalone bottle episode taking place largely on the Quinjet as the team processes loss and prepares for the Season 3 finale." },
  { id: 131, order: 131, phase: 2, type: 'series', year: 2015, essential: false, episodes: 3,  title: "Agents of SHIELD S3 Eps 20–22",     prereq: "Previous SHIELD seasons",        desc: "The Season 3 finale pits Coulson's team against Hive in a devastating conclusion that permanently changes the team's lineup heading into Phase 3." },
  { id: 132, order: 132, phase: 3, type: 'series', year: 2017, essential: false, episodes: 8,  title: "Inhumans S1",                        prereq: "Agents of SHIELD context",       desc: "The Inhuman royal family of Attilan is overthrown by Maximus and scattered across Hawaii. Largely standalone but expands the Inhuman mythology introduced in SHIELD. 8 episodes." },
  { id: 133, order: 133, phase: 3, type: 'series', year: 2017, essential: false, episodes: 13, title: "The Punisher S1",                    prereq: "Daredevil S2",                   desc: "Frank Castle, after exacting revenge for his family's murder, uncovers a conspiracy that leads back to government and military corruption. One of Marvel Netflix's most intense series. 13 episodes." },
  { id: 134, order: 134, phase: 3, type: 'series', year: 2018, essential: false, episodes: 10, title: "Cloak & Dagger S1",                  prereq: "General MCU knowledge",           desc: "Two teenagers in New Orleans — Tandy Bowen with light daggers and Tyrone Johnson with teleportation — discover their linked powers and a vast corporate conspiracy. 10 episodes." },
  { id: 135, order: 135, phase: 3, type: 'series', year: 2016, essential: false, episodes: 8,  title: "Agents of SHIELD S4 Eps 1–8",       prereq: "Previous SHIELD seasons",        desc: "The Ghost Rider arc begins — Robbie Reyes joins the team while Daisy goes rogue. These 8 episodes are widely considered among the best in the series." },
  { id: 136, order: 136, phase: 3, type: 'series', year: 2016, essential: false, episodes: 6,  title: "Agents of SHIELD: Slingshot S1",    prereq: "SHIELD context",                  desc: "A digital miniseries of 6 short episodes following Elena 'Yo-Yo' Rodriguez between Seasons 3 and 4, fleshing out her backstory and motivations." },
  { id: 137, order: 137, phase: 3, type: 'series', year: 2016, essential: false, episodes: 14, title: "Agents of SHIELD S4 Eps 9–22",      prereq: "Previous SHIELD seasons",        desc: "The LMD and Framework arcs — Daisy and team face Life Model Decoys and then a virtual reality dystopia. Season 4 is a creative high point for the show. 14 episodes." },
  { id: 138, order: 138, phase: 3, type: 'series', year: 2018, essential: false, episodes: 13, title: "Jessica Jones S2",                  prereq: "Jessica Jones S1",               desc: "Jessica investigates the mad scientist who gave her powers and faces unexpected personal revelations in a more introspective second season. 13 episodes." },
  { id: 139, order: 139, phase: 3, type: 'series', year: 2017, essential: false, episodes: 10, title: "Agents of SHIELD S5 Eps 1–10",      prereq: "Previous SHIELD seasons",        desc: "The team is sent to a dystopian future where Earth has been destroyed and humans serve alien overlords called the Kree. The space-set opening of Season 5 is a bold sci-fi swing." },
  { id: 140, order: 140, phase: 3, type: 'series', year: 2018, essential: false, episodes: 13, title: "Luke Cage S2",                       prereq: "Luke Cage S1",                   desc: "Luke Cage protects Harlem from a Jamaican crime lord while battling for the soul of his neighbourhood in a musically rich second season. 13 episodes." },
  { id: 141, order: 141, phase: 3, type: 'series', year: 2018, essential: false, episodes: 10, title: "Iron Fist S2",                       prereq: "Iron Fist S1",                   desc: "Danny Rand faces a new Triad war in New York and the return of Davos while questioning his role as the Iron Fist in a more focused second season. 10 episodes." },
  { id: 142, order: 142, phase: 3, type: 'series', year: 2018, essential: false, episodes: 13, title: "Daredevil S3",                       prereq: "Daredevil S2",                   desc: "Matt Murdock, broken and faithless, re-emerges as a darker Daredevil to stop Wilson Fisk — who has secretly taken control of the FBI from inside prison. Widely considered Marvel Netflix's best season. 13 episodes." },
  { id: 143, order: 143, phase: 3, type: 'series', year: 2019, essential: false, episodes: 10, title: "Cloak & Dagger S2",                  prereq: "Cloak & Dagger S1",              desc: "Tandy and Tyrone face a new threat — the Mayhem villain and a human trafficking ring — as their powers and relationship evolve in a more confident second season. 10 episodes." },
  { id: 144, order: 144, phase: 3, type: 'series', year: 2017, essential: false, episodes: 3,  title: "Agents of SHIELD S5 Eps 11–13",     prereq: "Previous SHIELD seasons",        desc: "The team begins to piece together how Earth was destroyed in the future timeline and whether they can prevent it — a mystery-box set of episodes." },
  { id: 145, order: 145, phase: 3, type: 'series', year: 2017, essential: false, episodes: 33, title: "Runaways S1 & S2 & S3 Eps 1–4",    prereq: "None (standalone)",               desc: "Six teenagers discover their parents are secretly a criminal cult called the Pride and go on the run. Seasons 1–2 plus the first 4 episodes of Season 3. 33 episodes." },
  { id: 146, order: 146, phase: 3, type: 'series', year: 2019, essential: false, episodes: 13, title: "The Punisher S2",                    prereq: "The Punisher S1",                desc: "Frank Castle protects a mysterious teenager on the run while his old identity catches up with him. The final Netflix Punisher season before the character moved to the MCU proper. 13 episodes." },
  { id: 147, order: 147, phase: 3, type: 'series', year: 2019, essential: false, episodes: 13, title: "Jessica Jones S3",                   prereq: "Jessica Jones S2",               desc: "Jessica Jones faces a serial killer obsessed with justice while navigating a complicated relationship with her half-sister Trish. The final season of the acclaimed Netflix series. 13 episodes." },
  { id: 148, order: 148, phase: 3, type: 'series', year: 2017, essential: false, episodes: 5,  title: "Agents of SHIELD S5 Eps 14–18",     prereq: "Previous SHIELD seasons",        desc: "The race to prevent Earth's destruction accelerates as Graviton emerges and the team is split over whether the future can truly be changed." },
  { id: 149, order: 149, phase: 3, type: 'series', year: 2017, essential: false, episodes: 4,  title: "Agents of SHIELD S5 Eps 19–22",     prereq: "Previous SHIELD seasons",        desc: "Season 5 finale — the team makes the choice that defines their fate, in a deeply emotional conclusion to one of the show's strongest seasons." },
  { id: 150, order: 150, phase: 3, type: 'series', year: 2019, essential: false, episodes: 6,  title: "Runaways S3 Eps 5–10",              prereq: "Runaways S1 & S2",               desc: "The final stretch of Runaways Season 3 brings the Hostel crew face-to-face with Morgan le Fay in a magical finale that closes the chapter on this beloved group of young heroes." },
  { id: 151, order: 151, phase: 4, type: 'series', year: 2019, essential: false, episodes: 26, title: "Agents of SHIELD S6 & S7",           prereq: "Previous SHIELD seasons",        desc: "Season 6 explores the consequences of the Infinity War snap for SHIELD, while Season 7 — the final season — sends the team back in time in a love letter to the whole series. 26 combined episodes." },
  { id: 152, order: 152, phase: 4, type: 'series', year: 2020, essential: false, episodes: 10, title: "Helstrom S1",                        prereq: "None (mostly standalone)",       desc: "The son and daughter of a mysterious and powerful serial killer use their unique abilities to hunt the worst of humanity in this darker, horror-inflected series. 10 episodes." },
  { id: 153, order: 153, phase: 4, type: 'series', year: 2023, essential: false, episodes: 10, title: "The Daily Bugle S1 & S2",            prereq: "Spider-Man films",               desc: "An in-universe web series presenting J. Jonah Jameson's Daily Bugle coverage of Spider-Man and Avengers events. Short comedic episodes that add texture to the MCU's world." },
  { id: 154, order: 154, phase: 5, type: 'series', year: 2024, essential: false, episodes: 10, title: "Your Friendly Neighborhood Spider-Man S1", prereq: "None (separate continuity)", desc: "An animated series set in an alternate MCU continuity featuring a younger Peter Parker learning the ropes as Spider-Man before the events of the live-action films. 10 episodes." },
];

const RAW = [...ESSENTIAL_LIST, ...ADDITIONAL_LIST].map(d => ({ ...d, status: 'unwatched', watchedDate: null }));

const LIST_MODES = [
  { id: 'core',     label: 'MCU',      sublabel: 'Curated List',       color: '#c0392b', desc: '60 curated films & series'           },
  { id: 'extended', label: 'Extended', sublabel: 'Full Chronological', color: '#4a9ede', desc: 'All entries incl. Netflix, SHIELD & more' },
];

// ─── Component ───────────────────────────────────────────────────────────────
export default function MCUViewer() {
  const [items,          setItems]          = useState(RAW);
  const [listMode,       setListMode]       = useState('core');
  const [search,         setSearch]         = useState('');
  const [sortBy,         setSortBy]         = useState('order');
  const [essentialOnly,  setEssOnly]        = useState(false);
  const [watchedOnly,    setWatchedOnly]    = useState(false);
  const [statusFilter,   setStatusFilter]   = useState(null);
  const [typeFilter,     setTypeFilter]     = useState(null);
  const [activePhase,    setActivePhase]    = useState(0);
  const [sortOpen,       setSortOpen]       = useState(false);
  const [phaseOpen,      setPhaseOpen]      = useState(false);
  const [statusDropdown, setStatusDropdown] = useState(null);
  const [dropdownPos,    setDropdownPos]    = useState({ x: 0, y: 0 });
  const [darkMode,       setDarkMode]       = useState(true);
  const [expandedItem,   setExpandedItem]   = useState(null);
  const [expandedPhase,  setExpandedPhase]  = useState(null); // for phase summary toggle
  const [celebPhase,     setCelebPhase]     = useState(null); // phase completion flash
  const [editingDateId,  setEditingDateId]  = useState(null); // date editing mode
  const [headerCompact]  = useState(false);
  const [detailItem,     setDetailItem]     = useState(null);
  const [detailData,     setDetailData]     = useState(null);
  const [detailLoading,  setDetailLoading]  = useState(false);
  const [posterCache,    setPosterCache]    = useState({});
  const [settingsOpen,   setSettingsOpen]   = useState(false);
  const [profile,        setProfile]        = useState({ name: '', age: '', gender: '', character: 'Iron Man', pfp: '' });
  const [timelineMode,   setTimelineMode]   = useState('sacred');
  const [genreFilter] = useState('all'); // hidden filter hook for future genre controls
  const [myLikes,        setMyLikes]        = useState({});
  const [myRating,       setMyRating]       = useState({});
  const [rewatchCount,   setRewatchCount]   = useState({});

  const phaseRefs  = useRef({});
  const sortRef    = useRef(null);
  const phaseRef   = useRef(null);
  const obsRef     = useRef(null);
  const isScrolling= useRef(false);
  const mainRef    = useRef(null);
  const settingsRef= useRef(null);

  // Persist / load
  useEffect(() => {
    const s = localStorage.getItem('mcu-v7');
    if (s) {
      try {
        const saved = JSON.parse(s);
        setItems(prev => prev.map(i => ({ 
          ...i, 
          status: saved[i.id]?.status || 'unwatched',
          watchedDate: saved[i.id]?.watchedDate || null
        })));
      } catch {}
    }
  }, []);

  const persist = (next) => {
    const data = {};
    next.forEach(i => { 
      if (i.status !== 'unwatched' || i.watchedDate) {
        data[i.id] = { status: i.status, watchedDate: i.watchedDate };
      }
    });
    localStorage.setItem('mcu-v7', JSON.stringify(data));
  };

  const setStatusDirect = (id, newStatus) => {
    setItems(prev => {
      const n = prev.map(i => {
        if (i.id !== id) return i;
        const updated = { ...i, status: newStatus };
        if (newStatus === 'watched' && !i.watchedDate) {
          updated.watchedDate = new Date().toISOString().slice(0, 16);
        } else if (newStatus !== 'watched') {
          updated.watchedDate = null;
        }
        return updated;
      });
      // Check if this completes a phase — trigger celebration
      const item = n.find(i => i.id === id);
      if (newStatus === 'watched' && item) {
        const phaseItems = n.filter(i => i.phase === item.phase && (listMode === 'core' ? coreIds.has(i.id) : true));
        const allDone = phaseItems.every(i => i.status === 'watched');
        if (allDone) {
          setCelebPhase(item.phase);
          setTimeout(() => setCelebPhase(null), 2400);
        }
      }
      persist(n);
      return n;
    });
  };

  // Scroll detection — listen on the main scroll container
  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const onScroll = () => {
      isScrolling.current = true;
      clearTimeout(isScrolling._t);
      isScrolling._t = setTimeout(() => { isScrolling.current = false; }, 150);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  // IntersectionObserver — root is the <main> scroll container, no window scroll needed
  useEffect(() => {
    const root = mainRef.current;
    if (!root) return;
    obsRef.current?.disconnect();
    obsRef.current = new IntersectionObserver(entries => {
      // Pick the section whose top is closest to the top of the viewport
      let best = null, bestTop = Infinity;
      entries.forEach(e => {
        const top = e.boundingClientRect.top;
        if (e.isIntersecting && top >= 0 && top < bestTop) {
          bestTop = top;
          best = +e.target.dataset.phase;
        }
      });
      if (best !== null) setActivePhase(best);
    }, { root, rootMargin: '0px 0px -70% 0px', threshold: 0 });
    // Defer so section refs are populated after render
    const timer = setTimeout(() => {
      Object.values(phaseRefs.current).forEach(el => el && obsRef.current?.observe(el));
    }, 50);
    return () => { clearTimeout(timer); obsRef.current?.disconnect(); };
  }, [listMode, essentialOnly]);

  // Close sort on outside click
  useEffect(() => {
    const fn = e => { if (sortRef.current && !sortRef.current.contains(e.target)) setSortOpen(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);
  useEffect(() => {
    const fn = e => { if (phaseRef.current && !phaseRef.current.contains(e.target)) setPhaseOpen(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);
  useEffect(() => {
    const fn = e => { if (settingsRef.current && !settingsRef.current.contains(e.target)) setSettingsOpen(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  const scrollTo = id => {
    const el = phaseRefs.current[id];
    const container = mainRef.current;
    if (!el || !container) return;
    const containerTop = container.getBoundingClientRect().top;
    const elTop = el.getBoundingClientRect().top;
    const offset = elTop - containerTop + container.scrollTop - 16;
    container.scrollTo({ top: offset, behavior: 'smooth' });
  };
  const exportProgress = () => {
    const payload = items.map(({ id, status, watchedDate }) => ({ id, status, watchedDate }));
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mcu-progress.json';
    a.click();
    URL.revokeObjectURL(url);
  };
  const importProgress = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const imported = JSON.parse(String(reader.result));
        setItems(prev => {
          const map = new Map(imported.map(x => [x.id, x]));
          const next = prev.map(i => map.has(i.id) ? { ...i, status: map.get(i.id).status || 'unwatched', watchedDate: map.get(i.id).watchedDate || null } : i);
          persist(next);
          return next;
        });
      } catch {}
    };
    reader.readAsText(file);
  };
  const CHARACTER_PFPS = {
    'Iron Man': 'https://ui-avatars.com/api/?name=Iron+Man&background=7a0000&color=fff',
    'Captain America': 'https://ui-avatars.com/api/?name=Captain+America&background=0f3d91&color=fff',
    Thor: 'https://ui-avatars.com/api/?name=Thor&background=2c3e50&color=fff',
    Loki: 'https://ui-avatars.com/api/?name=Loki&background=145a32&color=fff',
    'Scarlet Witch': 'https://ui-avatars.com/api/?name=Scarlet+Witch&background=8e2430&color=fff',
    'Spider-Man': 'https://ui-avatars.com/api/?name=Spider-Man&background=b22222&color=fff'
  };
  const RELEASE_INFO = {
    'The Fantastic Four: First Steps': { date: '2025-07-25', rating: 'TBD' },
    'Spider-Man: Brand New Day': { date: '2026-07-31', rating: 'TBD' },
    'Avengers: Doomsday': { date: '2026-12-18', rating: 'TBD' },
    'Avengers: Secret Wars': { date: '2027-12-17', rating: 'TBD' },
  };

  const coreIds = useMemo(() => new Set(ESSENTIAL_LIST.map(i => i.id)), []);

  const markPhaseWatched = (phaseId, newStatus) => {
    setItems(prev => {
      const n = prev.map(i => {
        if (i.phase !== phaseId) return i;
        if (listMode === 'core' && !coreIds.has(i.id)) return i;
        const updated = { ...i, status: newStatus };
        if (newStatus === 'watched' && !i.watchedDate) {
          updated.watchedDate = new Date().toISOString().slice(0, 16);
        } else if (newStatus !== 'watched') {
          updated.watchedDate = null;
        }
        return updated;
      });
      persist(n);
      return n;
    });
  };

  const q = search.toLowerCase();
  const { filtered, grouped, phaseKeys } = useMemo(() => {
    const f = items.filter(i => {
      if (listMode === 'core' && !coreIds.has(i.id)) return false;
      if (listMode === 'core' && essentialOnly && !i.essential) return false;
      if (watchedOnly && i.status !== 'watched') return false;
      if (statusFilter && i.status !== statusFilter) return false;
      if (typeFilter && i.type !== typeFilter) return false;
      if (activePhase && i.phase !== activePhase) return false;
      if (timelineMode === 'studio' && i.order % 2 === 0) return true;
      if (timelineMode === 'whatif' && i.type === 'short') return true;
      if (genreFilter !== 'all' && i.type !== genreFilter) return false;
      return i.title.toLowerCase().includes(q) || i.prereq.toLowerCase().includes(q);
    }).sort((a, b) =>
      sortBy === 'title' ? a.title.localeCompare(b.title) :
      sortBy === 'year'  ? a.year - b.year : sortBy === 'title' ? a.title.localeCompare(b.title) : a.order - b.order
    );
    const g = {};
    f.forEach(i => (g[i.phase] = g[i.phase] || []).push(i));
    const pk = Object.keys(g).map(Number).sort((a, b) => a - b);
    return { filtered: f, grouped: g, phaseKeys: pk };
  }, [items, listMode, essentialOnly, watchedOnly, statusFilter, typeFilter, activePhase, timelineMode, genreFilter, q, sortBy, coreIds]);

  const activeItems = useMemo(
    () => listMode === 'core' ? items.filter(i => coreIds.has(i.id)) : items,
    [items, listMode, coreIds]
  );
  const totalWatched = useMemo(() => activeItems.filter(i => i.status === 'watched').length, [activeItems]);
  const essTotal     = useMemo(() => activeItems.filter(i => i.essential).length, [activeItems]);
  const essWatched   = useMemo(() => activeItems.filter(i => i.essential && i.status === 'watched').length, [activeItems]);
  const pct = activeItems.length ? Math.round((totalWatched / activeItems.length) * 100) : 0;
  const stickyPhaseProgress = useMemo(() => {
    if (activePhase === 0) return { label: 'All Phases', done: totalWatched, total: activeItems.length, pct };
    const phaseItems = activeItems.filter(i => i.phase === activePhase);
    const done = phaseItems.filter(i => i.status === 'watched').length;
    const total = phaseItems.length;
    return { label: `Phase ${activePhase}`, done, total, pct: total ? Math.round((done / total) * 100) : 0 };
  }, [activePhase, activeItems, totalWatched, pct]);
  const CAST_MAP = {
    'Iron Man': ['Robert Downey Jr.', 'Gwyneth Paltrow', 'Jeff Bridges'],
    'The Avengers': ['Robert Downey Jr.', 'Chris Evans', 'Scarlett Johansson'],
    'Captain America: The First Avenger': ['Chris Evans', 'Hayley Atwell', 'Sebastian Stan'],
    'Thor': ['Chris Hemsworth', 'Tom Hiddleston', 'Natalie Portman'],
  };
  const posterFor = (item) => `https://placehold.co/220x330/121a2d/e8edf7?text=${encodeURIComponent(item.title)}`;
  const spoilerSafe = useMemo(() => totalWatched < Math.max(6, Math.round(activeItems.length * 0.35)), [totalWatched, activeItems.length]);
  const characterHeat = useMemo(() => {
    const chars = ['Iron Man', 'Captain America', 'Thor', 'Loki', 'Spider-Man', 'Wanda'];
    return chars.map(c => {
      const related = activeItems.filter(i => i.title.includes(c.replace('-Man', '-Man')) || i.desc.includes(c)).length || 1;
      const watched = activeItems.filter(i => (i.title.includes(c) || i.desc.includes(c)) && i.status === 'watched').length;
      return { c, score: Math.round((watched / related) * 100) };
    });
  }, [activeItems]);
  const memoryScore = useMemo(() => Math.max(0, Math.min(100, Math.round((totalWatched / Math.max(1, activeItems.length)) * 100) - (spoilerSafe ? 10 : 0))), [totalWatched, activeItems.length, spoilerSafe]);
  const OMDB_KEY = '14596ed1';
  const cleanLookupTitle = (title) => title.replace(/\sS\d.*$/i, '').replace(/\sEps?.*$/i, '').trim();
  const nextUnwatched = useMemo(() => filtered.find(i => i.status !== 'watched') || null, [filtered]);
  const recentActivity = useMemo(() => [...activeItems].filter(i => i.watchedDate).sort((a,b) => (b.watchedDate||'').localeCompare(a.watchedDate||'')).slice(0,5), [activeItems]);
  const totalEntries = activeItems.length;
  const seriesCount = activeItems.filter(i => i.type === 'series').length;
  const filmCount = activeItems.filter(i => i.type === 'film').length;
  const estRuntimeHours = Math.round(((filmCount * 2.3) + (seriesCount * 6.0)) * 10) / 10;
  const remainingHours = Math.max(0, Math.round((estRuntimeHours * (1 - pct / 100)) * 10) / 10);
  const phaseGradient = useMemo(() => {
    let cursor = 0;
    const stops = [];
    PHASES.forEach(ph => {
      const phaseItems = activeItems.filter(i => i.phase === ph.id);
      const watched = phaseItems.filter(i => i.status === 'watched').length;
      const w = activeItems.length ? (watched / activeItems.length) * 100 : 0;
      if (w <= 0) return;
      const start = cursor;
      const end = Math.min(100, cursor + w);
      stops.push(`${ph.color} ${start.toFixed(2)}% ${end.toFixed(2)}%`);
      cursor = end;
    });
    if (!stops.length) return 'linear-gradient(90deg,#4a9ede,#a06cd5,#e8b84b)';
    return `linear-gradient(90deg, ${stops.join(', ')})`;
  }, [activeItems]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('mcu-poster-cache-v1') || '{}');
      setPosterCache(saved);
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem('mcu-poster-cache-v1', JSON.stringify(posterCache));
  }, [posterCache]);

  useEffect(() => {
    const key = import.meta.env.VITE_OMDB_API_KEY || OMDB_KEY;
    if (!key) return;
    const targets = filtered.slice(0, 30).filter(i => posterCache[i.id] === undefined);
    if (!targets.length) return;
    let cancelled = false;
    const run = async () => {
      const updates = {};
      for (const item of targets) {
        try {
          const t = encodeURIComponent(cleanLookupTitle(item.title));
          const res = await fetch(`https://www.omdbapi.com/?apikey=${key}&t=${t}`);
          const data = await res.json();
          updates[item.id] = data?.Poster && data.Poster !== 'N/A' ? data.Poster : '';
        } catch {
          updates[item.id] = '';
        }
      }
      if (!cancelled) setPosterCache(prev => ({ ...prev, ...updates }));
    };
    run();
    return () => { cancelled = true; };
  }, [filtered, posterCache]);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!detailItem) return;
      setDetailLoading(true);
      setDetailData(null);
      const key = import.meta.env.VITE_OMDB_API_KEY || OMDB_KEY;
      if (!key) { setDetailLoading(false); return; }
      try {
        const t = encodeURIComponent(cleanLookupTitle(detailItem.title));
        const res = await fetch(`https://www.omdbapi.com/?apikey=${key}&t=${t}`);
        const data = await res.json();
        if (data?.Response === 'True') {
          setDetailData(data);
          if (data.Poster && data.Poster !== 'N/A') {
            setPosterCache(prev => ({ ...prev, [detailItem.id]: data.Poster }));
          }
        }
      } catch {}
      setDetailLoading(false);
    };
    fetchDetail();
  }, [detailItem]);

  const openStatusDropdown = (e, itemId) => {
    if (isScrolling.current) return;
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const dropW = 240, dropH = 280;
    let x = rect.left - dropW + rect.width;
    let y = rect.top - dropH - 8;
    if (x < 8) x = 8;
    if (x + dropW > window.innerWidth - 8) x = window.innerWidth - dropW - 8;
    if (y < 8) y = rect.bottom + 8;
    setDropdownPos({ x, y });
    setStatusDropdown(prev => prev === itemId ? null : itemId);
  };

  // ─── Theme tokens ──────────────────────────────────────────────────────────
  const T = darkMode ? {
    appBg: '#06060f', headerBg: 'linear-gradient(180deg,#0d0d1e 0%,#06060f 100%)',
    headerBorder: '#13132a', navBg: '#08081a', navBorder: '#13132a',
    filterBg: '#07071a', filterBorder: '#10101f',
    surfaceBg: '#0b0b1c', surfaceBorder: '#12122a',
    rowHoverBg: 'rgba(255,255,255,0.04)', rowWatchedBg: 'rgba(255,192,203,0.05)',
    rowBorder: '#0e0e1e', expandBg: '#090916', expandBorder: '#14142a',
    pillBg: '#0d0d1e', pillBorder: '#1a1a2e', pillText: '#6a7a90',
    pillHoverBorder: '#252540', pillHoverText: '#c5d0e8',
    inputBg: '#0b0b1d', inputBorder: '#171730', inputColor: '#c5d0e8',
    dropdownBg: '#0d0d1e', dropdownBorder: '#1e1e36', dropdownShadow: '0 24px 64px rgba(0,0,0,0.95)',
    text: '#cfd9ea', textMuted: '#8fa1b8', textFaint: '#5a6880',
    sortHoverBg: '#0f0f22', statBg: '#0b0b1c', statBorder: '#131328',
    numFaint: '#4a5566', footerText: '#1e2a38',
    scrollTrack: '#07070f', scrollThumb: '#16162a', scrollThumbH: '#222238',
    hexDot: 'rgba(255,255,255,0.01)', switcherBg: '#080818', switcherBorder: '#13132a',
    phaseSummaryBg: '#08081c', phaseSummaryBorder: '#13132a',
  } : {
    appBg: '#f2f0eb', headerBg: 'linear-gradient(180deg,#ffffff 0%,#f2f0eb 100%)',
    headerBorder: '#ddd8d0', navBg: '#ffffff', navBorder: '#e8e2d8',
    filterBg: '#faf8f4', filterBorder: '#e4ddd4',
    surfaceBg: '#ffffff', surfaceBorder: '#e0dbd2',
    rowHoverBg: 'rgba(0,0,0,0.025)', rowWatchedBg: '#f7f5f0',
    rowBorder: '#ede8e0', expandBg: '#faf7f2', expandBorder: '#e4ddd4',
    pillBg: '#f0ece4', pillBorder: '#ddd8cf', pillText: '#6a7080',
    pillHoverBorder: '#c8c2b8', pillHoverText: '#1a2030',
    inputBg: '#ffffff', inputBorder: '#ddd8cf', inputColor: '#1a2030',
    dropdownBg: '#ffffff', dropdownBorder: '#ddd8cf', dropdownShadow: '0 24px 64px rgba(0,0,0,0.16)',
    text: '#1a2030', textMuted: '#8090a0', textFaint: '#c0bcb4',
    sortHoverBg: '#f5f2ec', statBg: '#ffffff', statBorder: '#e4ddd4',
    numFaint: '#a0a8b0', footerText: '#a0a8b0',
    scrollTrack: '#ece8e0', scrollThumb: '#ccc8c0', scrollThumbH: '#b8b4ac',
    hexDot: 'rgba(0,0,0,0.025)', switcherBg: '#f8f5f0', switcherBorder: '#e4ddd4',
    phaseSummaryBg: '#f5f2ec', phaseSummaryBorder: '#e4ddd4',
  };

  return (
    <div style={{ width: '100%', minHeight: '100dvh', background: T.appBg, color: T.text, fontFamily: "'Rajdhani',system-ui,sans-serif", display: 'flex', flexDirection: 'column', overflow: 'visible', touchAction: 'pan-y', WebkitOverflowScrolling: 'touch', transition: 'background 0.32s cubic-bezier(0.34,1.56,0.64,1), color 0.32s cubic-bezier(0.34,1.56,0.64,1)' }} className="theme-switch">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;500;600;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html,body{scroll-behavior:smooth}
        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-track{background:${T.scrollTrack}}
        ::-webkit-scrollbar-thumb{background:${T.scrollThumb};border-radius:4px}
        ::-webkit-scrollbar-thumb:hover{background:${T.scrollThumbH}}
        input,button,select{font-family:inherit}
        input:focus{outline:none}
        button:focus-visible{outline:2px solid #c0392b;outline-offset:2px}

        @keyframes sweep{0%{transform:translateX(-120%)}100%{transform:translateX(220%)}}
        .sweep::after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.22),transparent);animation:sweep 2.8s ease-in-out infinite}

        @keyframes phaseFlash{0%{opacity:0}20%{opacity:0.22}80%{opacity:0.18}100%{opacity:0}}
        .phase-flash{animation:phaseFlash 2.4s ease both}

        @keyframes rowIn{from{opacity:0;transform:translateX(-5px)}to{opacity:1;transform:translateX(0)}}
        .row-in{animation:rowIn 0.2s ease both}

        @keyframes sectionUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        .section-up{animation:sectionUp 0.32s ease both}

        @keyframes fadeIn{from{opacity:0;transform:scale(0.97) translateY(-4px)}to{opacity:1;transform:scale(1) translateY(0)}}
        .fade-in{animation:fadeIn 0.16s ease both}

        @keyframes expandDown{from{opacity:0;max-height:0;padding-top:0;padding-bottom:0}to{opacity:1;max-height:600px;padding-top:10px;padding-bottom:10px}}
        .expand-row{animation:expandDown 0.28s cubic-bezier(0.34,1.56,0.64,1) both;overflow:hidden}

        @keyframes themeFadeSwitch{from{opacity:0}to{opacity:1}}
        .theme-switch{animation:themeFadeSwitch 0.32s ease both}

        @keyframes listModeSlide{from{opacity:0.8;transform:translateX(-8px)}to{opacity:1;transform:translateX(0)}}
        .list-mode-switch{animation:listModeSlide 0.24s cubic-bezier(0.34,1.56,0.64,1) both}

        @keyframes contentStabilize{from{opacity:0}to{opacity:1}}
        .content-stable{animation:contentStabilize 0.18s ease both}

        /* Phase 2: Micro-interactions */
        @keyframes buttonPulse{0%{box-shadow:0 0 0 0 rgba(192,57,43,0.4)}70%{box-shadow:0 0 0 6px rgba(192,57,43,0)}100%{box-shadow:0 0 0 0 rgba(192,57,43,0)}}
        @keyframes statusFlip{0%{transform:rotateX(0)}50%{transform:rotateX(90deg)}100%{transform:rotateX(0)}}
        @keyframes slideInRight{from{opacity:0;transform:translateX(10px)}to{opacity:1;transform:translateX(0)}}
        @keyframes watchedGlow{0%{text-shadow:0 0 0 rgba(62,196,122,0)}50%{text-shadow:0 0 8px rgba(62,196,122,0.8)}100%{text-shadow:0 0 0 rgba(62,196,122,0)}}
        
        .watched-badge{animation:watchedGlow 0.6s ease both}
        .button-click{animation:buttonPulse 0.6s ease both}

        .wbtn{width:30px;height:30px;border-radius:50%;border:1.5px solid transparent;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:transform 0.16s cubic-bezier(0.34,1.56,0.64,1),box-shadow 0.18s,background 0.18s;flex-shrink:0}
        .wbtn:hover{transform:scale(1.12)}
        .wbtn:active{transform:scale(0.88);animation:buttonPulse 0.4s}

        .ntab{position:relative;font-family:'Bebas Neue',sans-serif;font-size:clamp(16px,2.4vw,22px);letter-spacing:3px;padding:14px 20px;border:none;background:transparent;cursor:pointer;transition:color 0.2s cubic-bezier(0.34,1.56,0.64,1);white-space:nowrap;flex-shrink:0;display:flex;flex-direction:column;align-items:center}
        .ntab::after{content:'';position:absolute;bottom:0;left:12px;right:12px;height:2px;border-radius:2px 2px 0 0;background:currentColor;transform:scaleX(0);transform-origin:center;transition:transform 0.22s cubic-bezier(0.34,1.56,0.64,1)}
        .ntab.on::after{transform:scaleX(1)}

        .fpill{display:flex;align-items:center;gap:6px;padding:7px 28px;border-radius:999px;border:1.5px solid ${T.pillBorder};background:${T.pillBg};cursor:pointer;font-size:clamp(14px,2.2vw,16px);font-weight:600;letter-spacing:0.05em;color:${T.pillText};transition:all 0.2s cubic-bezier(0.34,1.56,0.64,1);white-space:nowrap}
        .fpill:hover{border-color:${T.pillHoverBorder};color:${T.pillHoverText};transform:translateY(-2px);box-shadow:0 6px 16px rgba(0,0,0,0.2)}
        .fpill:focus-visible,.theme-btn:focus-visible,.lmode-btn:focus-visible{outline:2px solid #c0392b;outline-offset:2px}

        .sopt{padding:13px 20px;font-family:'Bebas Neue',sans-serif;font-size:clamp(15px,2.2vw,18px);letter-spacing:2.5px;cursor:pointer;color:${T.pillText};transition:all 0.2s cubic-bezier(0.34,1.56,0.64,1)}
        .sopt:hover{background:${T.sortHoverBg};color:${T.text};transform:translateX(4px)}
        .sopt.picked{color:#c0392b;font-weight:700}

        .rrow{position:relative;transition:background 0.2s ease,transform 0.22s cubic-bezier(0.34,1.56,0.64,1),box-shadow 0.22s ease,border-color 0.22s ease;display:grid;align-items:center;grid-template-columns:40px 52px minmax(0,1fr) 80px 38px;gap:14px;padding:16px 20px;border-left:2px solid transparent;border-bottom:1px solid ${T.rowBorder};min-height:86px;border-radius:10px;overflow:hidden}
        .rrow:last-child{border-bottom:none}
        .rrow::before{content:'';position:absolute;inset:0;background:linear-gradient(125deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.05) 28%, rgba(255,255,255,0) 62%);opacity:0;transition:opacity 0.24s ease;pointer-events:none;z-index:0}
        .rrow > *{position:relative;z-index:1}
        .rrow:hover{transform:translateY(-6px);border-left-color:var(--phase-color,#c0392b);box-shadow:0 12px 28px -14px var(--phase-glow,rgba(192,57,43,0.5))}
        .rrow:hover::before{opacity:1}
        .rrow.type-film:hover{background:linear-gradient(90deg, rgba(224,82,82,0.18), ${T.rowHoverBg}) !important}
        .rrow.type-series:hover{background:linear-gradient(90deg, rgba(74,158,222,0.18), ${T.rowHoverBg}) !important}
        .rrow.type-short:hover{background:linear-gradient(90deg, rgba(160,108,213,0.18), ${T.rowHoverBg}) !important}

        .title-btn{background:none;border:none;cursor:pointer;text-align:left;padding:0;color:inherit;font-family:inherit;display:block;width:100%}
        .title-btn:focus-visible{outline:2px solid #c0392b;outline-offset:2px;border-radius:3px}

        .hexbg{background-image:radial-gradient(circle,${T.hexDot} 1px,transparent 1px);background-size:28px 28px}

        .lmode-btn{display:flex;flex-direction:column;padding:14px 24px 12px;border:none;background:transparent;cursor:pointer;text-align:left;transition:all 0.2s;border-bottom:2px solid transparent}
        .lmode-btn.active{border-bottom-color:var(--mc)}
        .lmode-btn:hover:not(.active){background:${T.rowHoverBg}}

        .theme-btn{width:32px;height:32px;border-radius:50%;border:1px solid ${T.pillBorder};background:${T.pillBg};color:${T.pillText};cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.2s;flex-shrink:0}
        .theme-btn:hover{border-color:${T.pillHoverBorder};color:${T.pillHoverText};transform:rotate(22deg)}

        .poster{width:52px;height:76px;object-fit:cover;border-radius:6px;border:1px solid ${T.surfaceBorder};box-shadow:0 6px 16px rgba(0,0,0,0.22)}
        .progress-gradient{background:linear-gradient(90deg,#f3a6c2 0%,#f49bc8 32%,#f6b8d0 64%,#ffd2e4 100%);background-size:200% 100%;animation:gradientFlow 3.4s linear infinite}
        @keyframes gradientFlow{0%{background-position:0% 50%}100%{background-position:200% 50%}}
        .detail-backdrop{position:fixed;inset:0;background:rgba(4,6,12,0.74);backdrop-filter:blur(4px);z-index:240;display:grid;place-items:center;padding:20px}
        .detail-card{width:min(980px,94vw);max-height:90vh;overflow:auto;background:${T.surfaceBg};border:1px solid ${T.surfaceBorder};border-radius:14px;padding:20px}
        .filter-shell{
          position: static;
          z-index: auto;
          box-shadow: ${darkMode ? '0 8px 18px rgba(0,0,0,0.28)' : '0 6px 14px rgba(0,0,0,0.08)'};
        }

        /* ── Mobile-compact header ── */
        @media (max-width: 767px) {
          .header-inner { padding: 10px 14px 8px !important; }
          .fpill{padding:7px 14px !important;font-size:14px !important}
          .rrow{grid-template-columns:28px 44px minmax(0,1fr) 52px 24px !important;gap:8px;padding:12px}
          .poster{width:44px;height:64px}
        }
        .header-title-mcu { font-size: clamp(48px, 8vw, 96px) !important; letter-spacing: clamp(2px, 0.8vw, 6px) !important; margin: 0 !important; }
        .header-title-sub { font-size: clamp(28px, 4.2vw, 56px) !important; letter-spacing: clamp(4px, 1.2vw, 10px) !important; margin-top: 0px !important; }
        .header-tagline { font-size: clamp(12px, 2.2vw, 15px) !important; margin-top: 1px !important; }

        .stat-card-num { font-size: clamp(28px, 4.5vw, 48px) !important; }
        .stat-card-label { font-size: clamp(11px, 1.8vw, 14px) !important; }

        .progress-labels { font-size: clamp(11px, 1.8vw, 14px) !important; }
        .glass-grad{background:linear-gradient(135deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02));backdrop-filter:blur(6px)}
        .phase-grad-line{height:2px;background:linear-gradient(90deg,#e05252 0%,#e8b84b 25%,#4a9ede 50%,#a06cd5 75%,#3ec47a 100%);opacity:0.9}

        /* hide default scrollbar on main while keeping functionality */
        main::-webkit-scrollbar{width:4px}
        main::-webkit-scrollbar-track{background:transparent}
        main::-webkit-scrollbar-thumb{background:${T.scrollThumb};border-radius:4px}
        main::-webkit-scrollbar-thumb:hover{background:${T.scrollThumbH}}
      `}</style>
      <div ref={settingsRef} style={{ position: 'fixed', top: 16, right: 14, zIndex: 260, display: 'flex', alignItems: 'center', gap: 10 }}>
        <div title={profile.name || 'Profile'} style={{ width: 44, height: 44, borderRadius: '50%', border: `1px solid ${T.surfaceBorder}`, display: 'grid', placeItems: 'center', background: darkMode ? 'rgba(16,18,35,0.92)' : '#fff', overflow: 'hidden', flexShrink: 0 }}>
          <img src={profile.pfp || CHARACTER_PFPS[profile.character] || CHARACTER_PFPS['Iron Man']} alt="profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <button className="theme-btn" onClick={() => setSettingsOpen(o => !o)} aria-label="Open settings menu" title="Settings" style={{ width: 40, height: 40, background: darkMode ? 'rgba(16,18,35,0.92)' : '#fff' }}>
          <Settings size={15} />
        </button>
        {settingsOpen && (
          <div className="fade-in" style={{ marginTop: 8, minWidth: 320, borderRadius: 12, border: `1px solid ${T.surfaceBorder}`, background: darkMode ? 'rgba(11,13,26,0.96)' : '#fff', boxShadow: T.dropdownShadow, padding: 10, display: 'grid', gap: 8, maxHeight: '80vh', overflow: 'auto' }}>
            <div style={{ fontSize: 11, letterSpacing: 2, color: T.textMuted, textTransform: 'uppercase' }}>Profile</div>
            <input value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} placeholder="User name" style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: `1px solid ${T.inputBorder}`, background: T.inputBg, color: T.inputColor }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              <input value={profile.age} onChange={e => setProfile(p => ({ ...p, age: e.target.value }))} placeholder="Age (optional)" style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: `1px solid ${T.inputBorder}`, background: T.inputBg, color: T.inputColor }} />
              <input value={profile.gender} onChange={e => setProfile(p => ({ ...p, gender: e.target.value }))} placeholder="Gender (optional)" style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: `1px solid ${T.inputBorder}`, background: T.inputBg, color: T.inputColor }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 6 }}>
              <select value={profile.character} onChange={e => setProfile(p => ({ ...p, character: e.target.value }))} style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: `1px solid ${T.inputBorder}`, background: T.inputBg, color: T.inputColor }}>
                {Object.keys(CHARACTER_PFPS).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <label className="fpill" style={{ cursor: 'pointer' }}>PFP
                <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (!f) return; const r = new FileReader(); r.onload = () => setProfile(p => ({ ...p, pfp: String(r.result || '') })); r.readAsDataURL(f); }} style={{ display: 'none' }} />
              </label>
            </div>
            <button className="fpill" onClick={() => setDarkMode(d => !d)}>{darkMode ? 'Light Mode' : 'Dark Mode'}</button>
            <button className="fpill" onClick={exportProgress}>Export Progress</button>
            <label className="fpill" style={{ cursor: 'pointer' }}>Import Progress
              <input type="file" accept="application/json" onChange={(e) => importProgress(e.target.files?.[0])} style={{ display: 'none' }} />
            </label>
            <button className="fpill" onClick={() => { setSearch(''); setEssOnly(false); setTypeFilter(null); setStatusFilter(null); setWatchedOnly(false); }}>Reset Filters</button>
          </div>
        )}
      </div>

      {/* ━━ HEADER ━━━━━━━━━━━━━━━━��━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <header className="hexbg" style={{ background: darkMode ? 'rgba(8,10,24,0.72)' : T.headerBg, borderBottom: `1px solid ${darkMode ? 'rgba(255,255,255,0.12)' : T.headerBorder}`, flexShrink: 0, backdropFilter: darkMode ? 'blur(16px)' : 'none', WebkitBackdropFilter: darkMode ? 'blur(16px)' : 'none' }}>
        <div className="header-inner" style={{ width: '100%', padding: '18px 32px 14px', transition: 'padding 0.25s ease' }}>
          <div className="header-top-row" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 6 }}>
            {/* Title */}
            <div style={{ fontFamily: "'Orbitron',sans-serif", lineHeight: 0.88, marginBottom: 0, fontWeight: 900 }}>
              <div className="header-title-mcu" style={{ fontSize: 'clamp(64px, 8vw, 72px)', letterSpacing: 'clamp(2px, 1vw, 8px)', color: '#c0392b', textShadow: darkMode ? '0 0 44px rgba(192,57,43,0.5),0 2px 0 #7a0000' : '0 2px 8px rgba(192,57,43,0.2)' }}>MCU</div>
              <div className="header-title-sub" style={{ fontSize: 'clamp(32px, 4vw, 40px)', letterSpacing: 'clamp(4px, 1.5vw, 12px)', color: T.text, marginTop: 0 }}>VIEWING ORDER</div>
              <div className="header-tagline" style={{ fontSize: '14px', color: T.textMuted, letterSpacing: headerCompact ? 1.4 : 3, fontFamily: "'Bebas Neue',sans-serif", marginTop: 1, transition: 'all 0.22s ease' }}>
                {`PHASES 1–6 · ${activeItems.length} ENTRIES · ${LIST_MODES.find(m => m.id === listMode)?.sublabel.toUpperCase()}`}
              </div>
            </div>
            {/* Status dashboard */}
            <div className="status-dashboard" style={{ background: darkMode ? 'rgba(18,22,42,0.45)' : T.statBg, border: `1px solid ${darkMode ? 'rgba(255,220,235,0.28)' : T.statBorder}`, borderRadius: 10, padding: headerCompact ? '5px 10px' : '8px 14px', minWidth: headerCompact ? 145 : 180, boxShadow: darkMode ? 'inset 0 1px 0 rgba(255,255,255,0.04)' : 'none', transition: 'all 0.22s ease' }}>
              <div className="stat-card-label" style={{ fontSize: '12px', letterSpacing: 2, color: T.textMuted, fontFamily: "'Bebas Neue',sans-serif" }}>TOTAL WATCHED</div>
              <div className="stat-card-num" style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(40px, 5vw, 48px)', letterSpacing: 1, color: '#3ec47a', lineHeight: 1, textShadow: darkMode ? '0 0 16px rgba(62,196,122,0.35)' : 'none' }}>
                {totalWatched}<span style={{ fontSize: 'clamp(24px, 3vw, 28px)', color: T.numFaint }}>/{activeItems.length}</span>
              </div>
              <div style={{ display: 'inline-flex', marginTop: 6, alignItems: 'center', gap: 6, borderRadius: 999, padding: '3px 10px', border: `1px solid ${darkMode ? '#e8b84b66' : '#e8b84baa'}`, background: darkMode ? 'rgba(232,184,75,0.14)' : 'rgba(232,184,75,0.10)', color: '#e8b84b', fontFamily: "'Bebas Neue',sans-serif", fontSize: 11, letterSpacing: 1.4 }}>
                MUST-WATCH {essWatched}/{essTotal}
              </div>
            </div>
          </div>
          <>
          {/* Master progress bar */}
          <div className="progress-bar" style={{ background: darkMode ? 'rgba(255,255,255,0.08)' : T.surfaceBg, border: `1px solid ${darkMode ? 'rgba(255,255,255,0.18)' : T.surfaceBorder}`, borderRadius: 999, height: 6, overflow: 'hidden', position: 'relative', marginBottom: 2, backdropFilter: 'blur(4px)' }}>
            <div className="sweep progress-gradient" style={{ height: '100%', width: `${pct}%`, background: phaseGradient, boxShadow: pct >= 75 ? '0 0 16px rgba(62,196,122,0.7)' : pct >= 50 ? '0 0 14px rgba(232,184,75,0.65)' : '0 0 12px rgba(244,155,200,0.6)', borderRadius: 999, transition: 'width 0.7s cubic-bezier(.4,0,.2,1), box-shadow 0.35s ease', position: 'relative', overflow: 'hidden' }} />
          </div>
          <div className="progress-labels" style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'clamp(12px, 2vw, 16px)', color: T.textMuted, letterSpacing: 2, fontFamily: "'Bebas Neue',sans-serif" }}>
            <span>{pct}% COMPLETE</span>
            <span>{activeItems.length - totalWatched} REMAINING</span>
          </div>
          </>
        </div>
      </header>
      <div className="phase-grad-line" aria-hidden="true" />

      {/* ━━ LIST MODE SWITCHER ━━━━━━━━���━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div style={{ background: T.switcherBg, borderBottom: `1px solid ${T.switcherBorder}`, padding: '0 24px', flexShrink: 0 }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', padding: '0 24px', width: '100%' }}>
          {LIST_MODES.map(mode => {
            const isActive = listMode === mode.id;
            const modeItems = mode.id === 'core' ? items.filter(i => coreIds.has(i.id)) : items;
            const modeWatched = modeItems.filter(i => i.status === 'watched').length;
            const modePct = modeItems.length ? Math.round((modeWatched / modeItems.length) * 100) : 0;
            return (
              <button key={mode.id} className={`lmode-btn ${isActive ? 'active' : ''}`}
                style={{ '--mc': mode.color }}
                onClick={() => { setListMode(mode.id); setSearch(''); setEssOnly(false); setTypeFilter(null); setStatusFilter(null); setWatchedOnly(false); setSortBy('order'); setActivePhase(1); setExpandedItem(null); setExpandedPhase(null); }}
                aria-pressed={isActive}
              >
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 16, letterSpacing: 3.2, color: isActive ? mode.color : T.textMuted, transition: 'color 0.2s' }}>
                    {mode.label}
                  </span>
                  <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 12, letterSpacing: 1.8, color: isActive ? mode.color + 'bb' : T.textFaint, transition: 'color 0.2s' }}>
                    {modeItems.length}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 1 }}>
                  {modePct > 0 && <span style={{ fontSize: 10, fontFamily: "'Bebas Neue',sans-serif", letterSpacing: 1.2, color: modePct === 100 ? mode.color : T.textFaint }}>Progress · {modePct}%</span>}
                </div>
              </button>
            );
          })}
        </div>
      </div>


      <div style={{ background: T.switcherBg, borderBottom: `1px solid ${T.switcherBorder}`, padding: '10px 24px', flexShrink: 0 }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 10, padding: '0 24px' }}>
          <div className="glass-grad" style={{ background: darkMode ? 'linear-gradient(135deg, rgba(20,24,42,0.88), rgba(39,20,49,0.78))' : 'linear-gradient(135deg,#ffffff,#f8f4ff)', border: `1px solid ${T.surfaceBorder}`, borderRadius: 10, padding: 12 }}>
            <div style={{ fontSize: 12, letterSpacing: 2, color: T.textMuted, textTransform: 'uppercase' }}>Continue Watching</div>
            <div style={{ fontSize: 18, marginTop: 4 }}>{nextUnwatched ? nextUnwatched.title : 'All caught up'}</div>
            <div style={{ fontSize: 13, color: T.textMuted, marginTop: 5 }}>{recentActivity.length ? `Recent: ${recentActivity[0].title}` : 'No recent activity'}</div>
            {nextUnwatched && <button className="fpill" style={{ marginTop: 8 }} onClick={() => { setActivePhase(nextUnwatched.phase); scrollTo(nextUnwatched.phase); }}>Jump to Next</button>}
          </div>
          <div className="glass-grad" style={{ background: darkMode ? 'linear-gradient(135deg, rgba(17,37,48,0.84), rgba(24,21,43,0.78))' : 'linear-gradient(135deg,#ffffff,#f2fbff)', border: `1px solid ${T.surfaceBorder}`, borderRadius: 10, padding: 12 }}>
            <div style={{ fontSize: 12, letterSpacing: 2, color: T.textMuted, textTransform: 'uppercase' }}>Analytics</div>
            <div style={{ fontSize: 14, marginTop: 6 }}>{totalWatched}/{totalEntries} watched · ~{remainingHours}h remaining</div>
            <div style={{ fontSize: 13, color: T.textMuted, marginTop: 4 }}>Films: {filmCount} · Series: {seriesCount}</div>
          </div>
          <div className="glass-grad" style={{ background: darkMode ? 'linear-gradient(135deg, rgba(18,42,38,0.76), rgba(19,24,42,0.78))' : 'linear-gradient(135deg,#ffffff,#f2fff8)', border: `1px solid ${T.surfaceBorder}`, borderRadius: 10, padding: 12 }}>
            <div style={{ fontSize: 12, letterSpacing: 2, color: T.textMuted, textTransform: 'uppercase' }}>Future Projects</div>
            <div style={{ fontSize: 14, marginTop: 6, color: T.textMuted }}>In list now: Daredevil: Born Again S1, Your Friendly Neighborhood Spider-Man S1.</div>
            <div style={{ fontSize: 13, color: T.textMuted, marginTop: 4 }}>If missing from your preferred canon, add upcoming films/series as Phase 6 entries in Extended mode.</div>
          </div>
        </div>
      </div>


      {/* ━━ FILTER BAR ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="filter-shell" style={{ background: T.filterBg, borderBottom: `1px solid ${T.filterBorder}`, padding: '10px 24px', overflow: 'visible', flexShrink: 0, position: 'relative', zIndex: 180 }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center', width: '100%', padding: '0 24px', overflow: 'visible' }}>
          <select value={timelineMode} onChange={e=>setTimelineMode(e.target.value)} style={{ padding: '8px', borderRadius: 20 }}><option value="sacred">Sacred</option><option value="studio">Studio</option><option value="whatif">What-If</option></select>
          {/* Search */}
          <div style={{ position: 'relative', flex: '1 1 170px', minWidth: 130 }}>
            <Search size={12} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: T.textMuted }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search titles..."
              style={{ width: '100%', background: T.inputBg, border: `1px solid ${T.inputBorder}`, borderRadius: 999, padding: '8px 12px 8px 30px', color: T.inputColor, fontSize: 14, letterSpacing: 0.3 }} />
          </div>
          {/* Sort */}
          <div ref={sortRef} style={{ position: 'relative' }}>
            <button className="fpill" onClick={() => setSortOpen(o => !o)}
              style={{ color: '#c0392b', borderColor: darkMode ? '#1e1430' : '#f0d8d0', background: darkMode ? '#0d0818' : '#fff5f3', fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(14px, 2.2vw, 16px)', letterSpacing: 2 }}>
              {SORT_LABELS[sortBy]}
              <ChevDown size={12} style={{ opacity: 0.6, transform: sortOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>
            {sortOpen && (
              <div className="fade-in" style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, background: T.dropdownBg, border: `1px solid ${T.dropdownBorder}`, borderRadius: 9, overflow: 'hidden', zIndex: 200, boxShadow: T.dropdownShadow, minWidth: 200 }}>
                {Object.entries(SORT_LABELS).map(([k, v]) => (
                  <div key={k} className={`sopt ${sortBy === k ? 'picked' : ''}`} onClick={() => { setSortBy(k); setSortOpen(false); }}>{v}</div>
                ))}
              </div>
            )}
          </div>
          <div ref={phaseRef} style={{ position: 'relative' }}>
            <button className="fpill" onClick={() => setPhaseOpen(o => !o)}
              style={{ color: '#c0392b', borderColor: darkMode ? '#1e1430' : '#f0d8d0', background: darkMode ? '#0d0818' : '#fff5f3', fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(14px, 2.2vw, 16px)', letterSpacing: 2 }}>
              {activePhase === 0 ? 'Phase All' : (PHASES.find(ph => ph.id === activePhase)?.name || 'Phase All')}
              <ChevDown size={12} style={{ opacity: 0.6, transform: phaseOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>
            {phaseOpen && (
              <div className="fade-in" style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, background: T.dropdownBg, border: `1px solid ${T.dropdownBorder}`, borderRadius: 9, overflow: 'hidden', zIndex: 200, boxShadow: T.dropdownShadow, minWidth: 200 }}>
                <div className={`sopt ${activePhase === 0 ? 'picked' : ''}`} onClick={() => { setActivePhase(0); setPhaseOpen(false); }}>
                  Phase All
                </div>
                {PHASES.map((ph) => (
                  <div key={ph.id} className={`sopt ${activePhase === ph.id ? 'picked' : ''}`} onClick={() => { setActivePhase(ph.id); scrollTo(ph.id); setPhaseOpen(false); }}>
                    {ph.name}
                  </div>
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
                <m.Icon size={10} />{m.label}
              </button>
            );
          })}
          {listMode === 'core' && (
            <button className="fpill"
              style={essentialOnly ? { borderColor: '#e8b84b88', background: '#e8b84b14', color: '#e8b84b' } : {}}
              onClick={() => setEssOnly(o => !o)}>
              <Star size={10} />Must-Watch
            </button>
          )}
          <div style={{ position: 'relative' }}>
            <button className="fpill"
              style={watchedOnly || statusFilter ? { borderColor: '#3ec47a88', background: '#3ec47a14', color: '#3ec47a' } : {}}
              onClick={() => setStatusDropdown(statusDropdown === 'filter' ? null : 'filter')}
              onMouseEnter={() => setStatusDropdown('filter')}
              onMouseLeave={() => setStatusDropdown(null)}>
              <Check size={10} />Watched
            </button>
            {statusDropdown === 'filter' && (
              <div className="fade-in" style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, background: T.dropdownBg, border: `1px solid ${T.dropdownBorder}`, borderRadius: 9, overflow: 'hidden', zIndex: 200, boxShadow: T.dropdownShadow, minWidth: 180 }}
                onMouseEnter={() => setStatusDropdown('filter')}
                onMouseLeave={() => setStatusDropdown(null)}>
                <div className={`sopt ${!statusFilter && !watchedOnly ? 'picked' : ''}`} onClick={() => { setStatusFilter(null); setWatchedOnly(false); setStatusDropdown(null); }}>All statuses</div>
                <div className={`sopt ${watchedOnly ? 'picked' : ''}`} onClick={() => { setWatchedOnly(true); setStatusFilter(null); setStatusDropdown(null); }}>Watched only</div>
                <div className={`sopt ${statusFilter === 'watching' ? 'picked' : ''}`} onClick={() => { setStatusFilter('watching'); setWatchedOnly(false); setStatusDropdown(null); }}>Watching</div>
                <div className={`sopt ${statusFilter === 'plan-to-watch' ? 'picked' : ''}`} onClick={() => { setStatusFilter('plan-to-watch'); setWatchedOnly(false); setStatusDropdown(null); }}>Plan to Watch</div>
              </div>
            )}
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 12, color: T.textMuted, letterSpacing: 2.2, textTransform: 'uppercase' }}>
              {filtered.length} RESULTS
            </span>
          </div>
        </div>
      </div>
      <div style={{ position: 'sticky', top: 0, zIndex: 170, padding: '6px 24px', background: darkMode ? 'rgba(8,10,20,0.78)' : 'rgba(255,255,255,0.86)', backdropFilter: 'blur(6px)', borderBottom: `1px solid ${T.filterBorder}` }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 10, padding: '0 24px' }}>
          <span style={{ fontFamily: "'Bebas Neue',sans-serif", letterSpacing: 1.8, fontSize: 12, color: T.textMuted, minWidth: 90 }}>{stickyPhaseProgress.label}</span>
          <div style={{ flex: 1, height: 4, borderRadius: 999, overflow: 'hidden', background: darkMode ? 'rgba(255,255,255,0.12)' : '#eae6de' }}>
            <div style={{ width: `${stickyPhaseProgress.pct}%`, height: '100%', background: phaseGradient, transition: 'width 0.3s ease' }} />
          </div>
          <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 11, letterSpacing: 1.2, color: T.textMuted }}>{stickyPhaseProgress.done}/{stickyPhaseProgress.total}</span>
        </div>
      </div>


      <button
        type="button"
        onClick={() => { if (nextUnwatched) { setActivePhase(nextUnwatched.phase); scrollTo(nextUnwatched.phase); } }}
        aria-label="Jump to next unwatched item"
        style={{ position: 'fixed', right: 16, bottom: 16, zIndex: 120, borderRadius: 999, padding: '10px 14px', border: `1px solid ${T.surfaceBorder}`, background: darkMode ? 'linear-gradient(135deg, rgba(20,25,46,0.95), rgba(34,18,52,0.95))' : 'linear-gradient(135deg, #ffffff, #f6f0ff)', color: T.text, boxShadow: darkMode ? '0 8px 22px rgba(0,0,0,0.45)' : '0 8px 20px rgba(0,0,0,0.14)', cursor: nextUnwatched ? 'pointer' : 'default', fontFamily: "'Bebas Neue',sans-serif", letterSpacing: 1.2, fontSize: 12 }}
      >
        {pct}% done · {nextUnwatched ? 'Jump next' : 'All caught up'}
      </button>

      {/* ━━ CONTENT ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <main ref={mainRef} style={{ overflow: 'visible', flex: '0 0 auto', '--content-max': '95vw', '--content-pad': '20px', '--sticky-offset': headerCompact ? '44px' : '72px' }}>
        

        

        <div style={{ maxWidth: 'var(--content-max)', margin: '0 auto', padding: '24px var(--content-pad) 80px', width: '100%', display: 'flex', flexDirection: 'column', minHeight: 'calc(100% - 400px)' }} className="list-mode-switch" key={listMode}>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 10 }}>
          {filtered.slice(0,10).map(i => (
            <button key={`c-${i.id}`} onClick={()=>setDetailItem(i)} style={{ minWidth: 140, textAlign: 'left', background: T.surfaceBg, border: `1px solid ${T.surfaceBorder}`, borderRadius: 10, padding: 8 }}>
              <div style={{ fontSize: 12 }}>{i.title}</div>
              <div style={{ fontSize: 11, color: T.textMuted }}>❤️ {myLikes[i.id]||0} · ⭐ {myRating[i.id]||0}/10</div>
            </button>
          ))}
        </div>
        {phaseKeys.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0', fontFamily: "'Bebas Neue',sans-serif", fontSize: 19, color: T.textMuted, letterSpacing: 4 }}>
            NO RESULTS — ADJUST YOUR FILTERS
          </div>
        )}

        {phaseKeys.map(pid => {
          const ph = PHASES.find(p => p.id === pid);
          const rows = grouped[pid];
          const done = rows.filter(r => r.status === 'watched').length;
          const phasePct = rows.length ? Math.round((done / rows.length) * 100) : 0;
          const isCelebrating = celebPhase === pid;
          const summaryOpen = expandedPhase === pid;

          return (
            <section key={pid} className="section-up" data-phase={pid}
              ref={el => { phaseRefs.current[pid] = el; }}
              style={{ marginBottom: 36, scrollMarginTop: 'var(--sticky-offset)', position: 'relative' }}>

              {/* Phase completion flash overlay */}
              {isCelebrating && (
                <div className="phase-flash" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg,#f3a6c2,#ffc0d8)', boxShadow: '0 0 10px rgba(244,155,200,0.5)', borderRadius: 12, pointerEvents: 'none', zIndex: 5 }} />
              )}

              {/* ── Phase divider injected in list flow ── */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap', padding: '10px 0', borderBottom: `1px solid ${T.surfaceBorder}` }}>
                <div style={{ width: 3, height: 38, background: 'linear-gradient(90deg,#f3a6c2,#ffc0d8)', borderRadius: 2, flexShrink: 0, boxShadow: darkMode ? '0 0 12px rgba(244,155,200,0.55)' : '0 0 6px rgba(244,155,200,0.25)' }} />
                <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 'clamp(32px, 4vw, 36px)', letterSpacing: 6, color: ph.color, lineHeight: 1, fontWeight: 700, textShadow: darkMode ? `0 0 18px ${ph.glow}` : 'none' }}>
              {ph.name}
            </div>
            <div style={{ fontSize: 'clamp(16px, 2.2vw, 18px)', color: T.textMuted, letterSpacing: 3, fontFamily: "'Bebas Neue',sans-serif", marginTop: 1, textTransform: 'uppercase' }}>
                    {ph.tagline}
                  </div>
                </div>
                {/* Mini progress */}
                <div style={{ width: 90, background: darkMode ? 'rgba(255,255,255,0.08)' : T.surfaceBg, border: `1px solid ${darkMode ? 'rgba(255,255,255,0.16)' : T.surfaceBorder}`, borderRadius: 999, height: 4, overflow: 'hidden', position: 'relative', flexShrink: 0, backdropFilter: 'blur(3px)' }}>
                  <div className="sweep" style={{ height: '100%', width: `${phasePct}%`, background: 'linear-gradient(90deg,#f3a6c2,#ffc0d8)', boxShadow: '0 0 10px rgba(244,155,200,0.5)', borderRadius: 999, transition: 'width 0.5s ease', position: 'relative', overflow: 'hidden', opacity: darkMode ? 0.85 : 0.9 }} />
                </div>
                <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 11, letterSpacing: 1, color: phasePct === 100 ? ph.color : T.textMuted, flexShrink: 0, minWidth: 38, textAlign: 'right' }}>
                  {done}/{rows.length}
                </span>
                {/* Phase summary toggle — suggestion 3 */}
                <button onClick={() => setExpandedPhase(summaryOpen ? null : pid)}
                  aria-label={summaryOpen ? 'Hide phase summary' : 'Show phase summary'}
                  style={{ background: 'none', border: `1px solid ${summaryOpen ? ph.color + '66' : T.surfaceBorder}`, color: summaryOpen ? ph.color : T.textMuted, borderRadius: 6, padding: '3px 8px', cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontFamily: "'Bebas Neue',sans-serif", letterSpacing: 2.2, textTransform: 'uppercase', transition: 'all 0.18s' }}>
                  <Info size={11} />INFO
                </button>
                {/* Bulk action */}
                {done < rows.length ? (
                  <button onClick={() => markPhaseWatched(pid, 'watched')}
                    style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 10, letterSpacing: 1.5, color: ph.color, background: 'transparent', border: `1px solid ${ph.color}44`, borderRadius: 6, padding: '4px 9px', cursor: 'pointer', flexShrink: 0, transition: 'all 0.16s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = ph.color + '16'; e.currentTarget.style.borderColor = ph.color + '88'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = ph.color + '44'; }}>
                    MARK ALL
                  </button>
                ) : (
                  <button onClick={() => markPhaseWatched(pid, 'unwatched')}
                    style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 10, letterSpacing: 1.5, color: T.textMuted, background: 'transparent', border: `1px solid ${T.surfaceBorder}`, borderRadius: 6, padding: '4px 9px', cursor: 'pointer', flexShrink: 0, transition: 'all 0.16s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = T.rowHoverBg; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                    CLEAR
                  </button>
                )}
              </div>

              {/* Phase summary card — suggestion 4 */}
              {summaryOpen && (
                <div className="fade-in" style={{ background: T.phaseSummaryBg, border: `1px solid ${T.phaseSummaryBorder}`, borderLeft: `3px solid ${ph.color}`, borderRadius: '0 8px 8px 0', padding: '10px 14px', marginBottom: 10, fontSize: 14, color: T.textMuted, lineHeight: 1.6, fontFamily: "'Rajdhani',sans-serif", letterSpacing: 0.2 }}>
                  {ph.summary}
                </div>
              )}

              {/* ── Row table ── */}
              <div style={{ background: T.surfaceBg, border: `1px solid ${T.surfaceBorder}`, borderRadius: 10, overflow: 'hidden', boxShadow: darkMode ? '0 2px 20px rgba(0,0,0,0.4),inset 0 1px 0 rgba(255,255,255,0.03)' : '0 1px 6px rgba(0,0,0,0.06)' }}>
                {rows.map((item, idx) => {
                  const m = TYPE_META[item.type];
                  const statusMeta = STATUS_META[item.status];
                  const showPre = !NO_PREREQ.has(item.prereq);
                  const isWatched = item.status === 'watched';
                  const isExpanded = expandedItem === item.id;

                  return (
                    <div key={item.id}>
                      {/* Main row */}
                      <div className={`rrow row-in type-${item.type}`} style={{ background: isWatched ? T.rowWatchedBg : 'transparent', '--phase-color': ph.color, '--phase-glow': ph.glow }}>
                        {/* Order / check */}
                        <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 15, color: isWatched ? '#f1bfd3' : T.textMuted, transition: 'color 0.26s', textAlign: 'center', flexShrink: 0 }}>
                          {isWatched ? <Check size={14} style={{ color: '#f4a8ca' }} /> : (idx + 1)}
                        </div>
                        <img className="poster" src={posterCache[item.id] || posterFor(item)} alt={`${item.title} poster`} loading="lazy" />

                        {/* Title block — clickable to expand */}
                        <button className="title-btn" onClick={() => setDetailItem(item)}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
                            <span style={{ fontSize: 'clamp(18px, 2.4vw, 20px)', fontWeight: isWatched ? 400 : 600, lineHeight: 1.5, color: isWatched ? T.textMuted : T.text, textDecoration: isWatched ? 'line-through' : 'none', textDecorationColor: '#f4a8ca', transition: 'color 0.26s', fontFamily: "'Rajdhani',sans-serif" }}>
                              {item.title}
                            </span>
                            {/* Episode count badge */}
                            {item.episodes && (
                              <span style={{ fontSize: 9, color: T.textMuted, background: T.expandBg, border: `1px solid ${T.expandBorder}`, borderRadius: 3, padding: '1px 5px', fontFamily: "'Bebas Neue',sans-serif", letterSpacing: 1, flexShrink: 0 }}>
                                {item.episodes} EP
                              </span>
                            )}
                            <span style={{ fontSize: 14, color: m.color, opacity: 0.82, fontWeight: 700, letterSpacing: 0.6, display: 'flex', alignItems: 'center', gap: 2, fontFamily: "'Bebas Neue',sans-serif", flexShrink: 0 }}>
                              <m.Icon size={8} />{m.label}
                            </span>
                            {!item.essential && (
                              <span style={{ fontSize: 8.5, color: T.textMuted, background: T.expandBg, border: `1px solid ${T.expandBorder}`, borderRadius: 3, padding: '1px 4px', letterSpacing: 1, fontFamily: "'Bebas Neue',sans-serif", flexShrink: 0 }}>OPT</span>
                            )}
                            <ChevRight size={10} style={{ color: T.textFaint, transform: 'none', transition: 'transform 0.2s', flexShrink: 0, marginLeft: 2 }} />
                          </div>
                          {showPre && (
                            <div style={{ marginTop: 2, fontSize: '14px', color: T.textMuted, fontFamily: "'Rajdhani',sans-serif", letterSpacing: 0.2 }}>
                              {item.prereq}
                            </div>
                          )}
                        </button>

                        {/* Year column */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, minWidth: 80 }}>
                          <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '12px', letterSpacing: 1.4, color: T.text, textAlign: 'center', fontWeight: 600 }}>
                            {RELEASE_INFO[item.title]?.date || `${item.year}-01-01`}
                          </div>
                          <div style={{ fontSize: 10, color: T.textMuted }}>⭐ {RELEASE_INFO[item.title]?.rating || (myRating[item.id] || '—')}</div>
                          <button className="fpill" style={{ padding: '2px 8px', fontSize: 10 }} onClick={() => setRewatchCount(p => ({ ...p, [item.id]: (p[item.id] || 0) + 1 }))}>↺ {rewatchCount[item.id] || 0}</button>

                        </div>

                        {/* Status button */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <button className="wbtn"
                            aria-label={`${statusMeta.label} — click to change`}
                            aria-haspopup="true"
                            aria-expanded={statusDropdown === item.id}
                            onClick={e => openStatusDropdown(e, item.id)}
                            onContextMenu={e => e.preventDefault()}
                            onKeyDown={e => {
                              if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openStatusDropdown(e, item.id); }
                              if (e.key === 'Escape') setStatusDropdown(null);
                            }}
                            style={{ background: statusMeta.bg, color: statusMeta.color, borderColor: statusMeta.color + '55', boxShadow: item.status !== 'unwatched' && darkMode ? `0 0 9px ${statusMeta.color}35` : 'none' }}
                          >
                            <statusMeta.Icon size={12} />
                          </button>
                        </div>
                      </div>

                      
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}

          <div style={{ textAlign: 'center', marginTop: 44, fontFamily: "'Bebas Neue',sans-serif", fontSize: 9, color: T.footerText, letterSpacing: 3.5 }}>
            MCU VIEWING ORDER &nbsp;·&nbsp; PHASES 1–6 &nbsp;·&nbsp; PROGRESS SAVED LOCALLY
          </div>
        </div>
      </main>

      {detailItem && (
        <div className="detail-backdrop" onClick={() => setDetailItem(null)} role="dialog" aria-label="Movie details">
          <div className="detail-card" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'grid', gridTemplateColumns: '180px minmax(0,1fr)', gap: 18 }}>
              <img src={detailData?.Poster && detailData.Poster !== 'N/A' ? detailData.Poster : (posterCache[detailItem.id] || posterFor(detailItem))} alt={`${detailItem.title} poster`} style={{ width: '100%', borderRadius: 10, border: `1px solid ${T.surfaceBorder}` }} />
              <div>
                <h2 style={{ fontSize: 32, marginBottom: 8 }}>{detailItem.title}</h2>
                <div style={{ fontSize: 16, color: T.textMuted, marginBottom: 10 }}>
                  {detailData?.Year || detailItem.year} · {TYPE_META[detailItem.type]?.label} · Phase {detailItem.phase}
                  {detailData?.Runtime ? ` · ${detailData.Runtime}` : ''}
                  {detailData?.imdbRating && detailData.imdbRating !== 'N/A' ? ` · IMDb ${detailData.imdbRating}` : ''}
                </div>
                {detailLoading && <div style={{ fontSize: 13, color: T.textMuted, marginBottom: 8 }}>Loading live metadata…</div>}
                {!detailLoading && !detailData && <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 8 }}>Live metadata unavailable for this title right now.</div>}
                <p style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 12 }}>{detailData?.Plot && detailData.Plot !== 'N/A' ? detailData.Plot : detailItem.desc}</p>
                <div style={{ fontSize: 14, marginBottom: 8 }}><strong>Prerequisite:</strong> {detailItem.prereq}</div>
                <div style={{ fontSize: 14, marginBottom: 8 }}><strong>Status:</strong> {STATUS_META[detailItem.status]?.label}</div>
                <div style={{ fontSize: 14 }}><strong>Cast:</strong> {detailData?.Actors && detailData.Actors !== 'N/A' ? detailData.Actors : (CAST_MAP[detailItem.title] || ['Cast data coming soon']).join(', ')}</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
                  <button className="fpill" onClick={() => setStatusDirect(detailItem.id, 'watched')}><Check size={11}/>Watched</button>
                  <button className="fpill" onClick={() => setStatusDirect(detailItem.id, 'plan-to-watch')}><Clock size={11}/>Plan</button>
                  <button className="fpill" onClick={() => setStatusDirect(detailItem.id, 'unwatched')}><EyeOff size={11}/>Unwatch</button>
                </div>
              </div>
            </div>
            <div style={{ marginTop: 14, display: 'flex', justifyContent: 'flex-end' }}>
              <button className="fpill" onClick={() => setDetailItem(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ━━ STATUS DROPDOWN ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {statusDropdown !== null && (() => {
        const activeItem = items.find(i => i.id === statusDropdown);
        return (
          <>
            <div style={{ position: 'fixed', inset: 0, zIndex: 998 }} onClick={() => setStatusDropdown(null)} aria-hidden="true" />
            <div className="fade-in" role="dialog" aria-label="Set watch status"
              style={{ position: 'fixed', top: dropdownPos.y, left: dropdownPos.x, background: T.dropdownBg, border: `1px solid ${T.dropdownBorder}`, borderRadius: 11, padding: '9px', zIndex: 999, boxShadow: T.dropdownShadow, minWidth: 235 }}>
              <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 10, letterSpacing: 2, color: T.textMuted, marginBottom: 7, paddingBottom: 7, borderBottom: `1px solid ${T.surfaceBorder}`, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 215 }}>
                {activeItem?.title}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {Object.entries(STATUS_META).map(([key, meta]) => {
                  const isCurrent = key === activeItem?.status;
                  return (
                    <button key={key}
                      autoFocus={isCurrent}
                      onClick={() => { setStatusDirect(activeItem.id, key); setStatusDropdown(null); }}
                      onKeyDown={e => { if (e.key === 'Escape') setStatusDropdown(null); }}
                      aria-pressed={isCurrent}
                      style={{ display: 'flex', alignItems: 'center', gap: 9, width: '100%', padding: '7px 9px', border: `1px solid ${isCurrent ? meta.color + '77' : 'transparent'}`, background: isCurrent ? meta.color + '15' : 'transparent', color: isCurrent ? meta.color : T.pillText, borderRadius: 6, cursor: 'pointer', fontFamily: "'Rajdhani',sans-serif", fontSize: 12.5, fontWeight: isCurrent ? 600 : 400, letterSpacing: 0.4, textAlign: 'left', transition: 'all 0.13s' }}
                      onMouseEnter={e => { if (!isCurrent) { e.currentTarget.style.background = meta.color + '10'; e.currentTarget.style.color = meta.color; } }}
                      onMouseLeave={e => { if (!isCurrent) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = T.pillText; } }}
                    >
                      <meta.Icon size={13} />
                      {meta.label}
                      {isCurrent && <span style={{ marginLeft: 'auto', fontSize: 8.5, opacity: 0.5, fontFamily: "'Bebas Neue',sans-serif", letterSpacing: 1 }}>CURRENT</span>}
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
