# Web App

The original Vite/React app source has been moved into `webApp/` without moving poster or binary assets. Existing React entry points remain available at:

- `webApp/index.html`
- `webApp/src/main.jsx`
- `webApp/src/App.jsx`

## Commands

```bash
npm --prefix webApp run dev
npm --prefix webApp run build
npm --prefix webApp run preview
```

Root aliases are also available:

```bash
npm run web:dev
npm run web:build
npm run web:preview
```

## Shared data

`tools/generate-web-data.mjs` writes `webApp/src/data/generatedCatalog.js` from `shared-data/*.json`; `webApp/vite.config.js` serves the unchanged root `public/` directory so posters and icons stay in their original paths. The legacy web data modules are preserved for compatibility, and new web features should prefer the generated catalog to avoid manual data drift.
