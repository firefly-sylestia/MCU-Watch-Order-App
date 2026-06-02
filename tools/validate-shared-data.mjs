import fs from 'node:fs';
import path from 'node:path';
const dir = 'shared-data';
const read = (name) => JSON.parse(fs.readFileSync(path.join(dir, name), 'utf8'));
const titles = [...read('mcu-titles.json'), ...read('dc-titles.json')];
const trailers = read('trailers.json');
const collections = read('collections.json');
const validTypes = new Set(['film','series','short','special','collection','unknown']);
const validStatuses = new Set(['watched','watching','plan-to-watch','on-hold','dropped','unwatched']);
const errors = [];
const requireUnique = (field) => {
  const seen = new Map();
  for (const title of titles) {
    const v = title[field];
    if (!v) errors.push(`${title.title || '<unknown>'} missing ${field}`);
    if (seen.has(v)) errors.push(`duplicate ${field}: ${v} (${seen.get(v)} / ${title.title})`);
    seen.set(v, title.title);
  }
};
requireUnique('id'); requireUnique('slug');
const ids = new Set(titles.map(t => t.id));
const slugs = new Set(titles.map(t => t.slug));
const trailerIds = new Set(trailers.map(t => t.id));
const collectionIds = new Set(collections.map(c => c.id));
for (const title of titles) {
  if (!validTypes.has(title.type)) errors.push(`${title.id} has unknown type ${title.type}`);
  if (!validStatuses.has(title.status ?? 'unwatched')) errors.push(`${title.id} has unknown status ${title.status}`);
  if (title.phase != null && (!Number.isInteger(title.phase) || title.phase < 0 || title.phase > 20)) errors.push(`${title.id} has invalid phase ${title.phase}`);
  if (!title.posterPath || typeof title.posterPath !== 'string') errors.push(`${title.id} missing posterPath`);
  for (const ref of title.prerequisiteIds ?? []) if (!ids.has(ref)) errors.push(`${title.id} bad prerequisite id ${ref}`);
  for (const ref of title.trailerIds ?? []) if (!trailerIds.has(ref)) errors.push(`${title.id} bad trailer id ${ref}`);
  for (const ref of title.collectionIds ?? []) if (!collectionIds.has(ref)) errors.push(`${title.id} bad collection id ${ref}`);
}
for (const trailer of trailers) if (trailer.titleSlug && !slugs.has(trailer.titleSlug)) errors.push(`trailer ${trailer.id} bad titleSlug ${trailer.titleSlug}`);
for (const collection of collections) for (const slug of collection.titleSlugs ?? []) if (!slugs.has(slug)) errors.push(`collection ${collection.id} bad title slug ${slug}`);
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`Validated ${titles.length} titles, ${trailers.length} trailers, and ${collections.length} collections.`);
