# Data Sync

## Shared data location

Platform-neutral content lives in `shared-data/`:

- `mcu-titles.json`
- `dc-titles.json`
- `timeline-modes.json`
- `trailers.json`
- `after-credits.json`
- `collections.json`
- `phases.json`

## Validate data

```bash
npm run data:validate
```

Validation checks stable IDs, slugs, duplicate IDs/slugs, known title/status values, phase ranges, poster references, prerequisite references, trailer references, and collection references.

## Regenerate platform data

```bash
npm run data:generate
```

This runs:

```bash
node tools/generate-kotlin-data.mjs
node tools/generate-web-data.mjs
```

Generated outputs:

- `shared/src/commonMain/kotlin/com/mcuviewingorder/shared/data/GeneratedCatalog.kt`
- `webApp/src/data/generatedCatalog.js`

## Add a new MCU/DC title

1. Add the title object to `shared-data/mcu-titles.json` or `shared-data/dc-titles.json`.
2. Include a stable string `id`, stable `slug`, `title`, `type`, `universe`, chronological order, phase, release metadata, synopsis, poster path, essential flag, prerequisites, and collection/trailer IDs where applicable.
3. Run `npm run data:validate`.
4. Run `npm run data:generate`.
5. Build both platforms.

## Add posters

1. Add web poster assets under the unchanged root `public/posters/` directory.
2. Do not move or duplicate poster binaries into `webApp/`; the web build serves root `public/` via Vite `publicDir`.
3. Add Android poster assets only when native packaging requires them, preferably via a generated/copy step outside normal source moves.
4. Set `posterPath` in the title JSON.
5. Missing files must be tolerated by native fallback UI.

## Add trailers

1. Add an entry to `shared-data/trailers.json` with stable `id`, display `label`, `youtubeId`, `type`, and a `titleSlug` when known.
2. Reference the trailer ID from the title's `trailerIds` if the relationship is title-specific.
3. Run validation and generation.

## Add collections

1. Add or update an object in `shared-data/collections.json`.
2. Keep the collection `id` stable.
3. Reference title slugs through `titleSlugs` or title `collectionIds` as the collection model evolves.
4. Run validation and generation.

## Legacy extraction

`tools/extract-shared-data.mjs` can regenerate the initial shared JSON from the preserved web data modules. Do not use it after hand-editing `shared-data/` unless you intentionally want to overwrite shared JSON from the legacy web source.
