import React from 'react';

const shellStyles = `
.app-sections-shell {
  --section-gap: clamp(0.9rem, 1.6vw, 1.35rem);
  --section-radius: clamp(0.85rem, 1.3vw, 1.15rem);
  --section-pad: clamp(0.85rem, 1.2vw, 1.15rem);
  display: grid;
  gap: var(--section-gap);
  width: min(1200px, 100% - 2rem);
  margin-inline: auto;
  padding-block: clamp(0.9rem, 1.8vw, 1.4rem) clamp(1.4rem, 2.8vw, 2rem);
}

.app-sections-shell :is(.section-surface, .section-modal) {
  border: 1px solid var(--theme-border, rgba(120, 130, 160, 0.35));
  background: var(--theme-overlay-surface, rgba(255, 255, 255, 0.66));
  color: var(--theme-text-primary, var(--theme-text, #101828));
  border-radius: var(--section-radius);
  box-shadow: 0 10px 28px color-mix(in srgb, var(--theme-shadow, rgba(0,0,0,0.22)) 48%, transparent);
  backdrop-filter: blur(14px) saturate(1.1);
  transition: transform 160ms ease, border-color 160ms ease, box-shadow 160ms ease;
}

.app-sections-shell :is(.section-surface, .section-modal):focus-within {
  border-color: color-mix(in srgb, var(--theme-accent, #6c5ce7) 45%, var(--theme-border, rgba(120, 130, 160, 0.35)));
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--theme-accent, #6c5ce7) 24%, transparent), 0 14px 26px rgba(0, 0, 0, 0.22);
}

.section-surface {
  padding: var(--section-pad);
}

.section-header-shell {
  position: sticky;
  top: clamp(0.35rem, 1vw, 0.8rem);
  z-index: 35;
}

.section-filter-bar {
  position: sticky;
  top: clamp(4.4rem, 8vw, 5.25rem);
  z-index: 30;
}

.section-phase-list {
  min-height: min(40vh, 480px);
}

.section-settings-panel {
  position: sticky;
  top: clamp(0.35rem, 1vw, 0.8rem);
  align-self: start;
}

.section-modal {
  width: min(900px, calc(100% - 1.6rem));
  margin-inline: auto;
  padding: clamp(0.95rem, 1.6vw, 1.4rem);
}

@media (max-width: 1024px) {
  .app-sections-shell {
    width: min(100%, 100% - 1rem);
    padding-inline: 0.2rem;
  }

  .section-header-shell,
  .section-filter-bar,
  .section-settings-panel {
    position: static;
  }
}

@media (prefers-reduced-motion: reduce) {
  .app-sections-shell :is(.section-surface, .section-modal) {
    transition: none;
  }
}
`;

const wrap = (Tag, className, children, landmarkProps = {}) => (
  <Tag className={`section-surface ${className}`.trim()} {...landmarkProps}>
    {children}
  </Tag>
);

export const HeaderShell = ({ children }) => (
  <>
    <style>{shellStyles}</style>
    <main className="app-sections-shell" aria-label="MCU viewing order app layout">
      {wrap('header', 'section-header-shell', children, { role: 'banner' })}
    </main>
  </>
);

export const HeroBackdrop = ({ children }) => <section className="section-hero-backdrop" aria-hidden="true">{children}</section>;
export const HeroCarousel = ({ children }) => <section className="section-hero-carousel section-surface" aria-label="Featured timeline highlights">{children}</section>;
export const FloatingQuickControls = ({ children }) => <aside className="section-floating-controls section-surface" aria-label="Quick controls">{children}</aside>;
export const FilterBar = ({ children }) => wrap('section', 'section-filter-bar', children, { 'aria-label': 'Filter options' });
export const PhaseList = ({ children }) => wrap('section', 'section-phase-list', children, { 'aria-label': 'Phase watchlist' });
export const SettingsPanel = ({ children }) => wrap('aside', 'section-settings-panel', children, { 'aria-label': 'Application settings' });
export const DetailModal = ({ children }) => (
  <section role="dialog" aria-modal="true" className="section-modal" aria-label="Item detail modal">
    {children}
  </section>
);
