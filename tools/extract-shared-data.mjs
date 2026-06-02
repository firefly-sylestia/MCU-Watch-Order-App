import fs from 'node:fs';
import path from 'node:path';
import { RAW, PHASES } from '../webApp/src/data/mcuData.js';
import { DC_RAW, DC_PHASES } from '../webApp/src/data/dcData.js';
import { TIMELINE_MODES } from '../webApp/src/data/timelineModes.js';
import { TRAILER_DATA } from '../webApp/src/data/trailerData.js';
import { AFTER_CREDITS } from '../webApp/src/data/afterCreditsData.js';
import { LIBRARY_COLLECTIONS } from '../webApp/src/data/libraryCollections.js';

const out = 'shared-data';
fs.mkdirSync(out, { recursive: true });
const slugify = (value) => String(value ?? '')
  .toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
  .replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'untitled';
const normalizeType = (type) => {
  const t = String(type ?? 'unknown').toLowerCase();
  if (['film','series','short','special','collection'].includes(t)) return t;
  if (t.includes('series') || t.includes('season')) return 'series';
  if (t.includes('short')) return 'short';
  if (t.includes('special')) return 'special';
  if (t.includes('film') || t.includes('movie')) return 'film';
  return 'unknown';
};
const posterName = (title) => `${slugify(title)}.jpg`;
const titleToSlug = new Map();
const normalizeTitle = (item, universe) => {
  const slug = `${universe}-${slugify(item.slug ?? item.title ?? item.id)}`;
  titleToSlug.set(item.title, slug);
  return {
    id: `${universe}-${item.id}`,
    sourceId: item.id,
    slug,
    title: item.title ?? 'Untitled',
    type: normalizeType(item.type),
    universe,
    phase: Number.isFinite(Number(item.phase)) ? Number(item.phase) : null,
    chronologicalOrder: Number(item.order ?? item.chronologicalOrder ?? 0),
    releaseYear: Number.isFinite(Number(item.year)) ? Number(item.year) : null,
    releaseDate: item.releaseDate ?? null,
    runtimeMinutes: Number.isFinite(Number(item.runtime ?? item.runtimeMinutes)) ? Number(item.runtime ?? item.runtimeMinutes) : null,
    episodes: item.episodes ?? null,
    synopsis: item.desc ?? item.description ?? item.synopsis ?? null,
    posterPath: item.poster || `posters/${posterName(item.title)}`,
    isEssential: Boolean(item.essential ?? item.isEssential),
    isCompletionist: !Boolean(item.essential ?? item.isEssential),
    prerequisites: Array.isArray(item.prerequisites) ? item.prerequisites : (item.prereq && item.prereq !== 'None' && item.prereq !== '—' ? [String(item.prereq)] : []),
    timelineModes: Array.isArray(item.timelineModes) ? item.timelineModes : [],
    trailerIds: [],
    afterCreditsIds: [],
    collectionIds: [],
    status: String(item.status ?? 'unwatched').toLowerCase(),
    watchedDate: item.watchedDate ?? null
  };
};
const mcu = RAW.map(item => normalizeTitle(item, 'mcu'));
const dc = DC_RAW.map(item => normalizeTitle(item, 'dc'));
const trailerEntries = [];
for (const [title, value] of Object.entries(TRAILER_DATA)) {
  const list = Array.isArray(value) ? value : [value];
  for (const [index, trailer] of list.entries()) {
    trailerEntries.push({ id: `${slugify(title)}-${index + 1}`, title, titleSlug: titleToSlug.get(title) ?? null, label: trailer.label ?? 'Trailer', youtubeId: trailer.youtubeId ?? '', type: trailer.type ?? 'trailer' });
  }
}
const afterCredits = Object.entries(AFTER_CREDITS).map(([title, value]) => ({ id: `${slugify(title)}-credits`, title, titleSlug: titleToSlug.get(title) ?? null, count: value.count ?? null, advice: value.advice ?? 'unknown', connectsTo: value.connectsTo ?? [] }));
const collections = LIBRARY_COLLECTIONS.map(c => ({ ...c, titleSlugs: [] }));
const modes = TIMELINE_MODES.map(m => ({ id: m.id, label: m.label, description: m.description ?? '' }));
const write = (name, data) => fs.writeFileSync(path.join(out, name), JSON.stringify(data, null, 2) + '\n');
write('mcu-titles.json', mcu); write('dc-titles.json', dc); write('timeline-modes.json', modes); write('trailers.json', trailerEntries); write('after-credits.json', afterCredits); write('collections.json', collections); write('phases.json', { mcu: PHASES, dc: DC_PHASES });
console.log(`Extracted ${mcu.length} MCU and ${dc.length} DC titles to ${out}`);
