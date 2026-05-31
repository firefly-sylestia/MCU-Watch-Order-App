import React, { useEffect, useId, useState } from 'react';
import { Bookmark, ChevRight, Film, Info, Layers, Menu, Search, Settings, Star, X, Zap } from '../../constants/icons.jsx';
import './NavigationShell.css';

const defaultDestinations = [
  { id: 'home', label: 'Home', meta: 'Curated next steps', Icon: Star, primary: true, group: 'Navigation' },
  { id: 'library', label: 'Library', meta: 'Complete archive', Icon: Film, primary: true, group: 'Navigation' },
  { id: 'collections', label: 'Collections', meta: 'Rooms and arcs', Icon: Layers, primary: true, group: 'Navigation' },
  { id: 'search', label: 'Search', meta: 'Find any title', Icon: Search, primary: true, group: 'Navigation' },
  { id: 'progress', label: 'Progress', meta: 'Stats and export', Icon: Bookmark, primary: false, group: 'Navigation' },
  { id: 'settings', label: 'Settings', meta: 'Advanced controls', Icon: Settings, primary: false, group: 'App' },
];

const controlStyle = (darkMode, pillBorder) => ({
  '--nav-control-bg': darkMode ? 'rgba(8,12,28,0.92)' : 'rgba(255,255,255,0.94)',
  '--nav-control-text': darkMode ? '#f5fffd' : '#0f172a',
  '--nav-control-border': darkMode ? 'rgba(255,255,255,0.22)' : pillBorder,
});

export const FloatingNavigationControls = React.memo(function FloatingNavigationControls({ darkMode, pillBorder, controlsHidden = false, open = false, moreOpen = false, moreControlsId, onToggle, onOpenSearch, onOpenMore }) {
  return (
    <nav className="navigation-control-cluster" style={controlsHidden ? { opacity: 0, pointerEvents: 'none', visibility: 'hidden' } : undefined} aria-label="Archive quick controls">
      <button className="theme-btn navigation-control-btn navigation-control-btn--menu" type="button" onClick={onToggle} aria-label={open ? 'Close sidebar hub' : 'Open sidebar hub'} aria-expanded={open} title="Sidebar hub" style={controlStyle(darkMode, pillBorder)} data-open={open}><Menu size={20} aria-hidden="true" /><span>Hub</span></button>
      <button className="theme-btn navigation-control-btn" type="button" onClick={onOpenSearch} aria-label="Open search" title="Search" style={controlStyle(darkMode, pillBorder)}><Search size={19} aria-hidden="true" /><span>Search</span></button>
      <button className="theme-btn navigation-control-btn navigation-control-btn--more" type="button" onClick={onOpenMore} aria-label="Open More command panel" aria-expanded={moreOpen} aria-controls={moreControlsId} title="More" style={controlStyle(darkMode, pillBorder)} data-open={moreOpen}><Zap size={18} aria-hidden="true" /><span>More</span></button>
    </nav>
  );
});

function DestinationButton({ destination, active, badge, onRun }) {
  const Icon = destination.Icon;
  return (
    <button key={destination.id} type="button" className="archive-rail__destination" aria-current={active ? 'page' : undefined} data-active={active} onClick={() => onRun(destination)}>
      <Icon size={18} />
      <span className="archive-rail__destination-copy"><strong>{destination.label}</strong>{destination.meta && <small>{destination.meta}</small>}</span>
      {badge != null && <b>{badge}</b>}
      <ChevRight size={13} className="archive-rail__chev" />
    </button>
  );
}

function MorePanel({ open, id, moreGroups = [], onClose }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => { if (event.key === 'Escape') onClose?.(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="more-command-layer" role="presentation">
      <button className="more-command-backdrop" type="button" aria-label="Close More panel" onClick={onClose} />
      <section className="more-command-panel" id={id} role="dialog" aria-modal="true" aria-label="More commands">
        <header className="more-command-panel__header">
          <div><p>More</p><h2>Command Center</h2></div>
          <button type="button" className="navigation-close-btn" onClick={onClose} aria-label="Close More panel"><X size={14} /></button>
        </header>
        <div className="more-command-panel__groups">
          {moreGroups.map((group) => (
            <section key={group.id || group.title} className={`more-command-group ${group.danger ? 'is-danger' : ''}`}>
              <h3>{group.title}</h3>
              <div>
                {group.items.map((item) => {
                  const Icon = item.Icon || Info;
                  return (
                    <button key={item.id || item.label} type="button" className="more-command-item" onClick={() => { item.onClick?.(); if (item.closeOnClick !== false) onClose?.(); }} aria-pressed={item.pressed} disabled={item.disabled}>
                      <Icon size={17} />
                      <span><strong>{item.label}</strong>{item.meta && <small>{item.meta}</small>}</span>
                      <ChevRight size={13} />
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </section>
    </div>
  );
}

export const NavigationShell = React.memo(React.forwardRef(function NavigationShell({
  open,
  darkMode,
  performanceMode,
  pillBorder,
  surfaceBorder,
  onToggle,
  onClose,
  onOpenSettings,
  onOpenSearch,
  onDismissBackdrop,
  controlsHidden = false,
  destinations = defaultDestinations,
  activeDestination = 'home',
  progressBadges = {},
  onNavigate,
  moreGroups = [],
  brandTitle = 'Archive Hub',
  brandMeta = 'Command Center',
  children,
}, ref) {
  const [mobileHubOpen, setMobileHubOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreId = useId();
  const mobileId = useId();
  const runDestination = (destination) => {
    if (destination.id === 'settings') onOpenSettings?.();
    else onNavigate?.(destination.id);
    setMobileHubOpen(false);
  };
  const handleControlToggle = () => {
    if (typeof window !== 'undefined' && window.matchMedia?.('(max-width: 760px)').matches) {
      setMobileHubOpen(true);
      return;
    }
    onToggle?.();
  };
  const openMore = () => setMoreOpen(true);
  const closeMore = () => setMoreOpen(false);
  const primaryDock = destinations.filter((d) => d.primary).slice(0, 4);

  const grouped = destinations.reduce((acc, destination) => {
    const group = destination.group || 'Navigation';
    acc[group] = acc[group] || [];
    acc[group].push(destination);
    return acc;
  }, {});

  const hubContent = (
    <>
      <header className="navigation-hub__hero">
        <p>{brandMeta}</p>
        <h2>{brandTitle}</h2>
      </header>
      {Object.entries(grouped).map(([group, groupDestinations]) => (
        <section key={group} className="navigation-hub__group">
          <div className="navigation-hub__group-title">{group}</div>
          <nav className="archive-rail__destinations" aria-label={`${group} destinations`}>
            {groupDestinations.map((destination) => <DestinationButton key={destination.id} destination={destination} active={activeDestination === destination.id} badge={progressBadges[destination.id]} onRun={runDestination} />)}
          </nav>
        </section>
      ))}
      <div className="archive-rail__content">{children}</div>
    </>
  );

  return (
    <>
      <FloatingNavigationControls darkMode={darkMode} pillBorder={pillBorder} controlsHidden={controlsHidden} open={open} moreOpen={moreOpen} onToggle={handleControlToggle} onOpenSearch={onOpenSearch || (() => onNavigate?.('search'))} moreControlsId={moreId} onOpenMore={openMore} />
      {open && <button className="navigation-backdrop" data-state="open" type="button" aria-label="Collapse archive navigation" onPointerDown={(event) => { event.preventDefault(); event.stopPropagation(); onDismissBackdrop?.(); onClose?.(); }} onClick={(event) => { event.preventDefault(); event.stopPropagation(); }} />}
      <aside ref={ref} data-state={open ? 'open' : 'closed'} aria-label="Sidebar Hub" className="navigation-shell archive-rail" style={{ '--navigation-bg': darkMode ? 'rgba(8,12,28,0.92)' : 'rgba(248,251,255,0.94)', '--navigation-border': surfaceBorder, '--navigation-shadow': darkMode ? 'var(--elevation-surface-3)' : 'var(--elevation-surface-2)', '--navigation-blur': performanceMode ? 'none' : 'blur(12px)' }}>
        <div className="navigation-shell__topbar"><span>Sidebar Hub</span><button className="navigation-close-btn" type="button" onClick={onClose} aria-label="Collapse navigation"><X size={14} /></button></div>
        {hubContent}
      </aside>

      <nav className="archive-mobile-dock" aria-label="Archive mobile dock">
        {primaryDock.map((destination) => { const Icon = destination.Icon; return <button key={destination.id} type="button" data-active={activeDestination === destination.id} onClick={() => runDestination(destination)}><Icon size={18} /><span>{destination.label}</span></button>; })}
        <button type="button" data-active={mobileHubOpen} aria-expanded={mobileHubOpen} aria-controls={mobileId} onClick={() => setMobileHubOpen(true)}><Menu size={18} /><span>Hub</span></button>
      </nav>
      {mobileHubOpen && <div className="archive-command-sheet" role="dialog" aria-modal="true" aria-label="Sidebar Hub" id={mobileId}><button className="archive-command-sheet__backdrop" aria-label="Close Sidebar Hub" onClick={() => setMobileHubOpen(false)} /><div className="archive-command-sheet__panel"><div className="archive-command-sheet__head"><strong>Sidebar Hub</strong><button onClick={() => setMobileHubOpen(false)} aria-label="Close Sidebar Hub"><X size={14} /></button></div>{hubContent}</div></div>}
      <MorePanel open={moreOpen} id={moreId} moreGroups={moreGroups} onClose={closeMore} />
    </>
  );
}));

export default NavigationShell;
