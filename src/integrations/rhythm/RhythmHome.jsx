import React, { useMemo } from 'react';
import { Bookmark, Check, Clock, EyeOff, Layers, PauseCircle, PlayCircle, Search, Star, XCircle } from '../../constants/icons';
import { RHYTHM_STATUS_ORDER, RHYTHM_SYSTEM_SOURCE } from './rhythmSystem';

const STATUS_ICONS = {
  watched: Check,
  watching: PlayCircle,
  'plan-to-watch': Bookmark,
  'on-hold': PauseCircle,
  dropped: XCircle,
  unwatched: EyeOff,
};

const compactNumber = (value) => new Intl.NumberFormat(undefined, { maximumFractionDigits: 1 }).format(value || 0);

export default function RhythmHome({
  activeUniverse,
  items,
  phases,
  phaseStats,
  statusMeta,
  totalWatched,
  pct,
  nextUnwatched,
  recentActivity,
  posterSrc,
  onOpenItem,
  onOpenPhase,
  onOpenSearch,
  onOpenAnalytics,
  onSetStatusFilter,
  onToggleStatus,
}) {
  const dashboard = useMemo(() => {
    const counts = RHYTHM_STATUS_ORDER.map((status) => {
      const meta = statusMeta[status] || statusMeta.unwatched;
      const count = items.filter((item) => item.status === status).length;
      return { status, count, label: meta?.label || status, color: meta?.color || 'var(--theme-accent)' };
    });

    const continueLane = items
      .filter((item) => ['watching', 'plan-to-watch', 'on-hold'].includes(item.status))
      .slice(0, 8);

    const phaseRows = phases.map((phase) => {
      const stat = phaseStats.find((entry) => entry.phase === phase.id) || { watched: 0, total: 0 };
      const percent = stat.total ? Math.round((stat.watched / stat.total) * 100) : 0;
      const next = items.find((item) => item.phase === phase.id && item.status !== 'watched');
      return { ...phase, ...stat, percent, next };
    }).filter((phase) => phase.total > 0);

    return { counts, continueLane, phaseRows };
  }, [items, phases, phaseStats, statusMeta]);

  const featureCopy = RHYTHM_SYSTEM_SOURCE.librarySurfaces.map((surface) => surface.label).join(' • ');

  return (
    <section className="rhythm-home-shell" aria-label="Rhythm inspired MCU home">
      <div className="rhythm-hero-card">
        <div className="rhythm-hero-copy">
          <span className="rhythm-kicker">Rhythm system · {activeUniverse?.title || 'MCU'} library</span>
          <h2>Your phases, queue, and saved statuses in one home.</h2>
          <p>
            The music-player home model is now mapped to MCU content: phases behave like library shelves,
            saved watch states stay in their proper lanes, and the next title is always ready.
          </p>
          <div className="rhythm-hero-actions">
            <button className="fpill rhythm-primary-action" type="button" onClick={() => nextUnwatched && onOpenItem(nextUnwatched)} disabled={!nextUnwatched}>
              <PlayCircle size={15} /> {nextUnwatched ? `Continue: ${nextUnwatched.title}` : 'Library complete'}
            </button>
            <button className="fpill" type="button" onClick={onOpenSearch}><Search size={14} /> Search library</button>
            <button className="fpill" type="button" onClick={onOpenAnalytics}><Layers size={14} /> Stats</button>
          </div>
        </div>
        <div className="rhythm-progress-orb" style={{ '--complete': pct }} aria-label={`${pct}% complete`}>
          <span>{pct}%</span>
          <small>{totalWatched}/{items.length} saved watched</small>
        </div>
      </div>

      <div className="rhythm-system-strip" aria-label="Adapted Rhythm surfaces">
        {RHYTHM_SYSTEM_SOURCE.navigation.map((nav) => (
          <span key={nav.id}>{nav.label}<small>{nav.role}</small></span>
        ))}
      </div>

      <div className="rhythm-grid rhythm-grid--status">
        <article className="rhythm-panel rhythm-panel--wide">
          <div className="rhythm-panel-head">
            <div>
              <span className="rhythm-kicker">Saved status library</span>
              <h3>Everything assigned to its proper place</h3>
            </div>
            <small>{featureCopy}</small>
          </div>
          <div className="rhythm-status-grid">
            {dashboard.counts.map(({ status, label, count, color }) => {
              const Icon = STATUS_ICONS[status] || Star;
              const active = count > 0;
              return (
                <button
                  key={status}
                  type="button"
                  className="rhythm-status-card"
                  style={{ '--status-color': color }}
                  onClick={() => onSetStatusFilter(status)}
                  aria-label={`Filter ${label}`}
                >
                  <Icon size={18} />
                  <strong>{compactNumber(count)}</strong>
                  <span>{label}</span>
                  <small>{active ? RHYTHM_SYSTEM_SOURCE.statusPlacements[status] : 'No saved titles yet'}</small>
                </button>
              );
            })}
          </div>
        </article>

        <article className="rhythm-panel rhythm-panel--queue">
          <div className="rhythm-panel-head">
            <div>
              <span className="rhythm-kicker">Continue queue</span>
              <h3>Resume lane</h3>
            </div>
          </div>
          <div className="rhythm-queue-list">
            {(dashboard.continueLane.length ? dashboard.continueLane : [nextUnwatched].filter(Boolean)).map((item) => {
              const Icon = STATUS_ICONS[item.status] || Clock;
              return (
                <button key={item.id} type="button" className="rhythm-queue-item" onClick={() => onOpenItem(item)}>
                  <img src={posterSrc(item)} alt="" loading="lazy" />
                  <span><strong>{item.title}</strong><small>Phase {item.phase} · {statusMeta[item.status]?.label || item.status}</small></span>
                  <Icon size={15} />
                </button>
              );
            })}
          </div>
        </article>
      </div>

      <article className="rhythm-panel rhythm-phase-library">
        <div className="rhythm-panel-head">
          <div>
            <span className="rhythm-kicker">Phase library</span>
            <h3>Browse by shelf</h3>
          </div>
          <button className="fpill" type="button" onClick={() => onOpenPhase(0)}>Open all phases</button>
        </div>
        <div className="rhythm-phase-shelves">
          {dashboard.phaseRows.map((phase) => (
            <button
              key={phase.id}
              type="button"
              className="rhythm-phase-shelf"
              style={{ '--phase-color': phase.color || 'var(--theme-accent)' }}
              onClick={() => onOpenPhase(phase.id)}
            >
              <span className="rhythm-phase-shelf__number">{phase.id}</span>
              <span className="rhythm-phase-shelf__copy">
                <strong>{phase.name}</strong>
                <small>{phase.watched}/{phase.total} complete · Next: {phase.next?.title || 'Phase complete'}</small>
              </span>
              <span className="rhythm-phase-shelf__meter"><span style={{ width: `${phase.percent}%` }} /></span>
              <span className="rhythm-phase-shelf__pct">{phase.percent}%</span>
            </button>
          ))}
        </div>
      </article>

      {recentActivity?.length > 0 && (
        <article className="rhythm-panel rhythm-recent-panel">
          <div className="rhythm-panel-head">
            <div>
              <span className="rhythm-kicker">Recently saved</span>
              <h3>Latest completed titles</h3>
            </div>
          </div>
          <div className="rhythm-recent-rail">
            {recentActivity.map((item) => (
              <article key={item.id} className="rhythm-recent-card">
                <button type="button" className="rhythm-recent-card__open" onClick={() => onOpenItem(item)}>
                  <img src={posterSrc(item)} alt="" loading="lazy" />
                  <strong>{item.title}</strong>
                  <small>{item.watchedDate ? new Date(item.watchedDate).toLocaleDateString() : 'Saved'}</small>
                </button>
                <button type="button" className="rhythm-mini-toggle" onClick={() => onToggleStatus(item.id, item.status === 'watched' ? 'unwatched' : 'watched')}>
                  {item.status === 'watched' ? 'Clear' : 'Done'}
                </button>
              </article>
            ))}
          </div>
        </article>
      )}
    </section>
  );
}
