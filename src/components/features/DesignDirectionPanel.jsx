import React from 'react';
import { APPEARANCE_MODES, normalizeAppearanceMode } from '../../constants/themeSettings';
import './DesignDirectionPanel.css';

const RESEARCH_NOTES = [
  { label: 'Purposeful glass', text: 'Layered frost is reserved for key containers so the backdrop still feels cinematic and readable.' },
  { label: 'Quiet neon', text: 'Glow is treated as feedback and emphasis instead of flooding every surface.' },
  { label: 'Type-led systems', text: 'Each visual mode changes display, UI, body, and mono font roles for a distinct editorial voice.' },
  { label: 'Accessible modes', text: 'Light and dark palettes avoid pure extremes, preserving hierarchy through elevation and tint.' },
];

export default function DesignDirectionPanel({ appearanceMode, darkMode, universeLabel }) {
  const activeMode = normalizeAppearanceMode(appearanceMode);
  const mode = APPEARANCE_MODES.find(item => item.id === activeMode) || APPEARANCE_MODES[0];

  return (
    <section className="design-direction-panel" aria-label="Design direction summary">
      <div className="design-direction-panel__copy">
        <p className="design-direction-panel__eyebrow">Modern viewing interface</p>
        <h2>{mode.label} system for {universeLabel}</h2>
        <p>
          A rebuilt visual layer with consistent spacing, subtle motion, mode-specific typography,
          refined glass depth, cleaner neon accents, and a stronger pixel treatment that still supports readability.
        </p>
      </div>
      <div className="design-direction-panel__mode-card" data-mode={activeMode}>
        <span>{darkMode ? 'Dark' : 'Light'} mode</span>
        <strong>{mode.label}</strong>
        <em>{mode.description}</em>
      </div>
      <div className="design-direction-panel__notes">
        {RESEARCH_NOTES.map(note => (
          <article key={note.label}>
            <strong>{note.label}</strong>
            <span>{note.text}</span>
          </article>
        ))}
      </div>
    </section>
  );
}
