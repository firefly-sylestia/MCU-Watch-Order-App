# Dependency Usage Audit

This project was audited against imports/usages in `src/`, root build scripts, and `api/`.

## Runtime dependencies (`dependencies`)

- `@capacitor/core`: Used by app runtime to detect platform behavior (`Capacitor`) in `src/App.jsx`.
- `@capacitor/filesystem`: Used by app runtime for file writes (`Filesystem`, `Directory`) in `src/App.jsx`.
- `@capacitor/share`: Used by app runtime for native sharing in `src/App.jsx`.
- `react`: Used throughout React components (`src/main.jsx`, `src/App.jsx`, `src/components/CropModal.jsx`, `src/theme-provider.tsx`).
- `react-dom`: Used by app entrypoint to mount the app (`src/main.jsx`).

## Build/dev dependencies (`devDependencies`)

- `@capacitor/android`: Android platform package needed for Capacitor Android build/sync (referenced in generated Android Capacitor project files).
- `@capacitor/cli`: Required for Capacitor CLI commands used in local build/release workflows (`npx cap ...`).
- `@vitejs/plugin-react`: Used by Vite config (`vite.config.js`).
- `vite`: Used by npm scripts `dev`, `build`, `preview` and Vite config.

## Removed packages

- `@capacitor-community/media`: Removed because no imports or usage were found in `src/`, `api/`, or root scripts.
- `lucide-react`: Removed because no imports or usage were found in app/build files.
- `sharp`: Removed from dependencies because it is only referenced by `generate-icons.js` and not required by app runtime; icon generation is not part of the app/build path.

## Notes

- Android Capacitor generated files were refreshed with `npx cap sync android` after dependency changes.
- Lockfile was regenerated (`npm install --package-lock-only`) after dependency updates.
