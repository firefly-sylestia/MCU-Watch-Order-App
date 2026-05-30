# Deep Links and Fluid UI Notes

## Supported deep links

Universe-prefixed links are the canonical Vercel app links. The legacy unprefixed links still resolve, then the app rewrites them to the active universe route.

- `/marvel` and `/marvel/home` open the Marvel home/hero timeline experience.
- `/dc` and `/dc/home` open the DC home/hero timeline experience.
- `/marvel/search` and `/dc/search` open full-library search for that universe.
- `/marvel/search?q=iron%20man` opens Marvel search with the query restored in the search box.
- `/dc/search?q=superman` opens DC search with the query restored in the search box.
- `/marvel/search?q=loki&type=series` restores both the query and the Series filter.
- `/marvel/series` and `/dc/series` open each universe's Series browse surface without requiring sidebar navigation.
- `/marvel/series/:slug` and `/dc/series/:slug` open a series detail card directly.
- `/marvel/movie/:slug` and `/dc/movie/:slug` open a film/short detail card directly.
- `/marvel/title/:slug` and `/dc/title/:slug` are generic aliases for title detail cards.
- `/marvel/phase` and `/dc/phase` open the redesigned phase/era view across all phases.
- `/marvel/phase/:id` and `/dc/phase/:id` open a specific phase/era view.
- `/marvel/settings` and `/dc/settings` open the settings overlay.
- `/marvel/analytics` and `/dc/analytics` open the analytics overlay.
- Legacy paths (`/home`, `/search`, `/series`, `/phase`, `/settings`, `/analytics`, `/movie/:slug`) are still accepted for compatibility.

## Fluid UI implementation checklist

- Keep search URL updates as `replaceState` while the user types so browser history is not flooded.
- Defer search filtering work with React deferred values so keystrokes stay responsive.
- Animate only compositor-friendly properties (`opacity` and `transform`) for high-frequency UI.
- Disable expensive blur/filter layers in performance mode, phase mode, small screens, and reduced-motion contexts.
- Use `content-visibility`, containment, lazy poster loading, and capped poster decode tracking for long timelines.
- **Warning:** never remove the virtualized scrolling system in list/phase view; optimize its math, overscan, or row components only. Removing virtualization reintroduces deep-list Vercel lag.
- Keep subtle interaction feedback on buttons/cards while avoiding layout-triggering animations.
