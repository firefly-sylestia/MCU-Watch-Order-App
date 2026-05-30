import React from 'react';
import { Check, Info } from '../../constants/icons.jsx';
import './PhaseChapter.css';

export const PhaseNavigationDeck = React.memo(function PhaseNavigationDeck({
  phases,
  activePhase,
  grouped,
  activeItems,
  onSelectPhase,
  universe,
}) {
  const totalItems = activeItems.length;
  return (
    <section className="phase-nav-deck" aria-label="Phase command deck">
      <div className="phase-nav-deck__intro">
        <span>{universe === 'dc' ? 'Era Matrix' : 'Saga Matrix'}</span>
        <strong>Choose a chapter</strong>
        <p>Jump between redesigned boxed phase lanes without changing the current scrolling system.</p>
      </div>
      <div className="phase-nav-deck__grid">
        <button
          type="button"
          className={`phase-nav-card ${activePhase === 0 ? 'is-active' : ''}`}
          onClick={() => onSelectPhase(0)}
          style={{ '--phase-color': 'var(--theme-accent)', '--phase-glow': 'color-mix(in srgb, var(--theme-accent) 28%, transparent)' }}
        >
          <span className="phase-nav-card__kicker">All</span>
          <strong>Full Timeline</strong>
          <em>{totalItems} titles</em>
        </button>
        {phases.map((phase) => {
          const rows = grouped[phase.id] || [];
          const watched = rows.filter(item => item.status === 'watched').length;
          const pct = rows.length ? Math.round((watched / rows.length) * 100) : 0;
          return (
            <button
              type="button"
              key={phase.id}
              className={`phase-nav-card ${activePhase === phase.id ? 'is-active' : ''}`}
              onClick={() => onSelectPhase(phase.id)}
              style={{ '--phase-color': phase.color, '--phase-glow': phase.glow || `${phase.color}40` }}
            >
              <span className="phase-nav-card__kicker">{phase.label || `Phase ${phase.id}`}</span>
              <strong>{phase.name}</strong>
              <em>{watched}/{rows.length} watched · {pct}%</em>
            </button>
          );
        })}
      </div>
    </section>
  );
});

export const PhaseChapter = React.memo(function PhaseChapter({
  phase,
  rows,
  done,
  percent,
  summaryOpen,
  isCelebrating,
  darkMode,
  isDesktopViewport,
  borderColor,
  textMuted,
  onToggleSummary,
  onMarkWatched,
  onClearWatched,
  children,
  setRef,
  WatermarkOverlay,
}) {
  const summary = phase.summary || `${phase.name} collects ${rows.length} ${rows.length === 1 ? 'title' : 'titles'} in this viewing lane.`;
  const tagline = phase.tagline || phase.label || 'Viewing Chapter';
  return (
    <section
      className="phase-chapter motion-section"
      data-motion="section"
      data-phase={phase.id}
      ref={setRef}
      style={{ '--phase-color': phase.color, '--phase-glow': phase.glow || `${phase.color}40`, scrollMarginTop: 'var(--sticky-offset)' }}
    >
      {isCelebrating && <div className="phase-chapter__flash" aria-hidden="true" />}
      <div className="phase-chapter__shell">
        <div className="phase-chapter__header" style={{ borderColor }}>
          {WatermarkOverlay && <WatermarkOverlay surface="card" theme={darkMode ? 'dark' : 'light'} viewport={isDesktopViewport ? 'desktop' : 'mobile'} avoid={['title', 'progress']} />}
          <div className="phase-chapter__identity">
            <span>{phase.label || `Phase ${phase.id}`}</span>
            <h2>{phase.name}</h2>
            <p>{tagline}</p>
          </div>
          <div className="phase-chapter__progress" aria-label={`${phase.name} completion ${percent}%`}>
            <strong>{percent}%</strong>
            <span>{done}/{rows.length} complete</span>
            <div className="phase-chapter__meter"><i style={{ width: `${percent}%` }} /></div>
          </div>
          <div className="phase-chapter__actions">
            <button type="button" className="phase-action-btn" onClick={onToggleSummary} aria-expanded={summaryOpen}>
              <Info size={12} /> {summaryOpen ? 'Hide Intel' : 'Intel'}
            </button>
            {done < rows.length ? (
              <button type="button" className="phase-action-btn phase-action-btn--accent" onClick={onMarkWatched}><Check size={12} />Mark All</button>
            ) : (
              <button type="button" className="phase-action-btn" onClick={onClearWatched}>Clear</button>
            )}
          </div>
        </div>
        {summaryOpen && <div className="phase-chapter__summary" style={{ color: textMuted }}>{summary}</div>}
        <div className="phase-chapter__list">{children}</div>
      </div>
    </section>
  );
});

export default PhaseChapter;
