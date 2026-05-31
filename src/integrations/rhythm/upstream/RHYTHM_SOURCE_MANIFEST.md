# Rhythm source integration manifest

This folder is the React/Capacitor-side landing area for the Rhythm app-system adaptation.

- Upstream project: <https://github.com/cromaguy/Rhythm>
- Upstream app type: native Android Kotlin / Jetpack Compose music player
- Local app type: React + Vite + Capacitor MCU tracker

The terminal in this environment could not download GitHub archives or clone the repository because outbound GitHub tunnel requests returned `403 Forbidden`. The local integration therefore captures the app-system concepts from Rhythm's public README and GitHub page inside `src/integrations/rhythm/` without replacing the existing website JSX/CSS.

The active adapter files are:

- `src/integrations/rhythm/rhythmSystem.js` — local source map for Rhythm navigation, library surfaces, and status placement.
- `src/integrations/rhythm/RhythmHome.jsx` — React home/library/status surface using the existing MCU data and saved status state.
- `src/integrations/rhythm/RhythmHome.css` — additive styling that preserves the current app CSS and theme variables.
