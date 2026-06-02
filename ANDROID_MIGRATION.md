# Android Migration

## What changed

The repository was restructured from a root Vite/React + Capacitor app into a multi-platform layout. The web app lives in `webApp/`, while the native Android implementation lives in `androidApp/` and uses Kotlin files instead of a WebView wrapper.


## Asset handling note

Poster files and binary assets are intentionally not moved into `webApp/`. The web app serves the unchanged root `public/` folder through Vite `publicDir`, while legacy Android binary resources remain in their original `android/` paths. Native Android poster packaging should be handled later by a generated sync step rather than by relocating source binaries.

## Native architecture

- `MainActivity.kt` launches Compose content.
- `McuViewingOrderApp.kt` applies system/light/dark theme mode from DataStore.
- `navigation/` defines home, title detail, settings, analytics, library, collections, and theme studio routes.
- `ui/theme/` provides semantic color, spacing, typography, and shape tokens.
- `ui/screens/` contains native screens for the title list, details, settings, analytics, library, collections, theme studio, and setup wizard.
- `ui/components/` contains reusable native equivalents for title cards, progress, filters, posters, and status picking.
- `data/` contains DataStore repositories for progress, preferences, and poster lookup.
- `platform/` contains Android sharing/backup hooks.
- `shared/` contains models and business logic that can be tested outside Compose.

## Functional parity map

- Viewing order list: `TitleListScreen.kt` + `TitleCard.kt` backed by generated shared data.
- Watch statuses: `WatchStatus`, `ProgressRepository`, `StatusPicker`, instant watched toggle.
- Filtering/sorting: `FilterState`, `TitleFilter`, `SortMode`, `TitleSorter`, `FilterBar`.
- Progress dashboard: `ProgressCalculator`, `ProgressSection`, phase/runtime/status stats.
- Details: `TitleDetailPane` and `TitleDetailSheet`.
- Settings: `SettingsScreen` + `UserPreferencesRepository`.
- Theme studio: semantic Material 3 tokens in `ThemeTokens.kt`.
- Navigation/deep links: `Routes`, `AppNavGraph`, `DeepLinks`, Android manifest intent filter.
- Library/collections/analytics: native screens under `ui/screens`.
- Poster fallback: `PosterImage`, `PosterFallback`, `PosterRepository`.
- Import/export/share: backup/share use case placeholders plus native share intent support.

## Phased fallback status

This pass implements the requested phased fallback: web preservation, shared JSON, generated Kotlin/web catalog files, a native Kotlin Compose app structure, domain logic, DataStore persistence hooks, and documentation for future synchronization.
