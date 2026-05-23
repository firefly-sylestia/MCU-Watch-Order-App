# Theme Parity Matrix

| UI region | Dark mode expectation | Light mode expectation |
|---|---|---|
| Header | Elevated surface with strong border and high-legibility title text. | Same elevated hierarchy with warmer base, identical spacing, and equal emphasis. |
| Cards (timeline rows) | `--surface-card` base, readable `--text-primary`, clear hover/selected feedback. | Same token stack and interaction states, with no flat/noisy drift. |
| Modal / overlays | `--surface-elevated-2` shell, `--border-strong`, subtle depth only. | Same depth scale and border rhythm; no extra bloom or muddy shadows. |
| Filters | Pills/dropdowns use `--surface-elevated-1`, `--interactive-bg-hover`, `--text-secondary`. | Same semantics and contrast targets for all controls. |
| Settings | Panel + toggles use shared elevated tokens and status colors for ON/OFF clarity. | Same role mapping and spacing cadence; no component-specific color forks. |
| Analytics | Surface hierarchy mirrors cards/settings, with muted text and accent highlights. | Same hierarchy and contrast parity using shared semantic tokens. |

## Contrast + parity goals

- Text contrast should remain clearly readable in both modes for primary and secondary labels.
- Elevated surfaces must follow one shared scale (`--surface-elevated-1..3`) in both modes.
- Interaction feedback should rely on semantic tokens, not mode-targeted selectors.
