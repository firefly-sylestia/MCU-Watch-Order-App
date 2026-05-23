# Premium Marvel-Inspired Theme System

## UI Audit & Theming Surface Inventory
The global theming layer now targets:
- App shell/backgrounds: `body`, `.app-container`.
- Surfaces: cards/panels/modals/dropdowns (`.card`, `.glass-panel`, `.ui-panel`, `.phase-rows-full`, `.calendar-row`, `.modal-content`, `.dropdown-pop`).
- Inputs/forms: `input`, `select`, `textarea`, `.search-input`.
- Actions: `button`, `.fpill`, `.wbtn`, `.theme-btn`, `.status-pill`, `.bottom-action-bar`, `.fab-primary`.
- Typography/links: default text, headings aliases, links.
- Navigation/overlays inherit semantic variables via shared aliases.

Interaction states covered:
- default, hover, active, focus-visible, disabled, selected (`aria-pressed` classes already present in app styles).

Spacing & rhythm standardized:
- 4/8/12/16/24/32 scale via `--space-*`.
- radius scale: 8/12/16.
- elevation scale: subtle 3-level shadows without glow.

## Semantic Tokens
Defined in `src/index.css`:
- Brand: `--color-primary`, `--color-secondary`, `--color-accent`, `--color-success`, `--color-warning`, `--color-danger`.
- Surfaces: `--color-bg-base`, `--color-bg-elevated`, `--color-bg-muted`.
- Text: `--color-text-primary`, `--color-text-secondary`, `--color-text-muted`, `--color-text-inverse`.
- Borders/focus: `--color-border-soft`, `--color-border-strong`, `--color-focus-ring`.

## Light & Dark Architecture
- Light defaults live in `:root`.
- Dark overrides live in `[data-theme="dark"], [data-color-mode="dark"]`.
- Auto dark fallback supported with `@media (prefers-color-scheme: dark)` unless explicitly forced to light.

## Accessibility Notes
- Token pairs are selected for AA-friendly contrast across body text and controls.
- Focus-visible ring is explicit and high contrast.
- Placeholder/helper text uses muted tokens for readability, not overly faint values.
- Motion reduction honored with `prefers-reduced-motion`.

## Component Usage Example
```css
.button-primary {
  background: var(--color-primary);
  color: var(--color-text-inverse);
  border: 1px solid var(--color-primary);
}

.panel {
  background: var(--color-bg-elevated);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-soft);
  box-shadow: var(--elevation-surface-1);
}
```
