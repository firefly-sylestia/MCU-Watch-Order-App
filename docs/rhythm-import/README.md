# Rhythm Android app-system import

This repository keeps the React JSX/CSS website intact and imports a Kotlin-native APK layer inspired by the upstream Rhythm Android project:

- Upstream: <https://github.com/cromaguy/Rhythm>
- App architecture observed upstream: Kotlin-first Android app using Material-style theming, typed app sections, and persisted library/status behavior.
- Local placement: `android/app/src/main/java/com/mcuviewingorder/app/rhythm/`

## What is mapped locally

| Rhythm app-system concept | Local implementation |
| --- | --- |
| Kotlin native app shell | `MainActivity.kt` launches the Capacitor web app and registers the native bridge. |
| Home/library section contract | `RhythmAppSystem.homeSections` assigns Home, Phases Library, Saved Status, and Analytics routes. |
| Saved status library | `RhythmStatusPlugin` persists title statuses in Android SharedPreferences for APK installs. |
| Dark/light native chrome | `RhythmTheme.applyRhythmEdgeToEdge` keeps transparent system bars and icon contrast ready for dark/light mode. |
| Website preservation | Existing JSX and CSS remain the web UI source of truth; only a JS bridge mirrors saved statuses to native storage. |

## Import note

The execution environment blocked direct `git clone`/archive downloads from GitHub with a 403 tunnel response. Because of that, the local import is an adapted Kotlin app-system layer that follows the current public Rhythm repository structure and README-described architecture without replacing the website source.
