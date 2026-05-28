import React from 'react';
import './ThemeDesignBrief.css';

const COPY = {
  glass: {
    kicker: 'Liquid Glass System',
    title: 'A translucent command deck for long timeline planning.',
    body: 'Layered panes, softened borders, and legible frosted depth keep the poster art cinematic without sacrificing readable controls.',
    font: 'Display: Syne · UI: Manrope',
  },
  neon: {
    kicker: 'Neon Signal Mode',
    title: 'Bright accents, restrained glow, and clear contrast hierarchy.',
    body: 'Electric edge lighting is reserved for navigation, selected states, and progress signals so every glow has a job.',
    font: 'Display: Orbitron · UI: Rajdhani',
  },
  pixelated: {
    kicker: 'Pixel Grid Mode',
    title: 'Retro arcade texture rebuilt as a modern tracker interface.',
    body: 'Crisp stepped edges, block shadows, scan lines, and compact mono labeling create a pixel-art feel while preserving touch targets.',
    font: 'Display: Press Start 2P · UI: Share Tech Mono',
  },
  minimal: {
    kicker: 'Editorial Minimal Mode',
    title: 'Quiet surfaces for users who want the list to lead.',
    body: 'Reduced decoration, generous spacing, and bookish typography make filters and viewing status feel calm and predictable.',
    font: 'Display: Fraunces · UI: Inter',
  },
};

export default function ThemeDesignBrief({ appearanceMode, universe }) {
  const copy = COPY[appearanceMode] || COPY.glass;
  return (
    <section className="theme-design-brief" aria-label="Current visual system notes">
      <div className="theme-design-brief__copy">
        <p className="theme-design-brief__kicker">{copy.kicker}</p>
        <h2>{copy.title}</h2>
        <p>{copy.body}</p>
      </div>
      <div className="theme-design-brief__meta" aria-label="Typography pairing">
        <span>{universe === 'dc' ? 'DC archive' : 'MCU archive'}</span>
        <strong>{copy.font}</strong>
      </div>
    </section>
  );
}
