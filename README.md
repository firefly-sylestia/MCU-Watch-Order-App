# MCU Viewing Order

MCU Viewing Order is now organized as a two-platform project: a preserved Vite/React web application and a native Android Kotlin application scaffolded with Jetpack Compose + Material 3.

## Project layout

- `webApp/` contains the original Vite + React source. Poster and binary assets remain at their original root/legacy Android paths instead of being moved into `webApp/`.
- `androidApp/` contains the native Android Kotlin package `com.mcuviewingorder.app`.
- `shared/` contains Kotlin domain models, filtering, sorting, progress calculations, and generated catalog fixtures used by Android.
- `shared-data/` contains platform-neutral JSON catalog data for MCU/DC titles, trailers, after-credits metadata, timeline modes, phases, and collections.
- `tools/` contains data validation and code generation scripts.

## Root commands

```bash
npm run web:dev
npm run web:build
npm run web:preview
npm run data:validate
npm run data:generate
gradle :androidApp:assembleDebug
gradle :androidApp:assembleRelease
```

## Native Android direction

The native app is not a WebView wrapper. It uses Kotlin source files under `androidApp/src/main/java/com/mcuviewingorder/app`, Jetpack Compose-style screens, Material 3 theme tokens, Compose Navigation routes, DataStore-backed progress/settings repositories, and shared domain logic from `shared/`.

See:

- [BUILDING_ANDROID.md](BUILDING_ANDROID.md)
- [ANDROID_MIGRATION.md](ANDROID_MIGRATION.md)
- [WEB_APP.md](WEB_APP.md)
- [DATA_SYNC.md](DATA_SYNC.md)
