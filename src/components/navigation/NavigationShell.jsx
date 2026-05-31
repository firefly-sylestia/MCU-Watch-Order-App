import React, { useEffect, useId, useState } from 'react';
import { Bookmark, ChevRight, Film, Layers, Menu, Search, Settings, Star, X } from '../../constants/icons.jsx';
import './NavigationShell.css';

const defaultDestinations = [
  { id: 'home', label: 'Home', meta: 'Curated dashboard', Icon: Star, primary: true, group: 'Navigation' },
  { id: 'library', label: 'Library', meta: 'Complete archive', Icon: Film, primary: true, group: 'Navigation' },
  { id: 'collections', label: 'Collections', meta: 'Themed rooms', Icon: Layers, primary: true, group: 'Navigation' },
  { id: 'search', label: 'Search', meta: 'Find titles', Icon: Search, primary: true, group: 'Navigation' },
  { id: 'progress', label: 'Progress', meta: 'Stats and export', Icon: Bookmark, primary: false, group: 'Navigation' },
  { id: 'settings', label: 'Settings', meta: 'Preferences', Icon: Settings, primary: false, group: 'App' },
];

const grouped = (destinations) => destinations.reduce((acc, destination) => {
  const key = destination.group || (destination.primary ? 'Navigation' : 'App');
  acc[key] = [...(acc[key] || []), destination];
  return acc;
}, {});

const controlStyle = (darkMode, pillBorder) => ({
  '--nav-control-bg': darkMode ? 'rgba(8,12,28,0.92)' : 'rgba(255,255,255,0.94)',
  '--nav-control-text': darkMode ? '#f5fffd' : '#0f172a',
  '--nav-control-border': darkMode ? 'rgba(255,255,255,0.22)' : pillBorder,
});

export const FloatingNavigationControls = React.memo(function FloatingNavigationControls({ darkMode, pillBorder, controlsHidden = false, open = false, onToggle, onOpenSearch, onOpenMore, menuControlsId, moreControlsId }) {
  return (
    <nav className="navigation-control-cluster" style={controlsHidden ? { opacity: 0, pointerEvents: 'none', visibility: 'hidden' } : undefined} aria-label="App command controls">
      <button className="theme-btn navigation-control-btn navigation-control-btn--menu" type="button" onClick={onToggle} aria-label={open ? 'Close sidebar hub' : 'Open sidebar hub'} title="Sidebar hub" aria-expanded={open} aria-controls={menuControlsId} data-open={open} style={controlStyle(darkMode, pillBorder)}><Menu size={20} aria-hidden="true" /><span>Hub</span></button>
      <button className="theme-btn navigation-control-btn navigation-control-btn--search" type="button" onClick={onOpenSearch} aria-label="Open search" title="Search archive" style={controlStyle(darkMode, pillBorder)}><Search size={19} aria-hidden="true" /><span>Search</span></button>
      <button className="theme-btn navigation-control-btn navigation-control-btn--more" type="button" onClick={onOpenMore} aria-label="Open more commands" title="More commands" aria-controls={moreControlsId} style={controlStyle(darkMode, pillBorder)}><Settings size={19} aria-hidden="true" /><span>More</span></button>
    </nav>
  );
});

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
  children,
}, ref) {
  const [mobileHubOpen, setMobileHubOpen] = useState(false);
  const shellId = useId();
  const moreId = `${shellId}-more`;
  const destinationGroups = grouped(destinations);
  const primaryDock = destinations.filter((d) => d.primary).slice(0, 4);

  useEffect(() => {
    if (!mobileHubOpen) return undefined;
    const onKey = (event) => { if (event.key === 'Escape') setMobileHubOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileHubOpen]);

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

  const hubContent = (
    <>
      <div className="navigation-shell__topbar"><span>Sidebar Hub</span><button className="navigation-close-btn" type="button" onClick={() => { setMobileHubOpen(false); onClose?.(); }} aria-label="Collapse sidebar hub"><X size={14} /></button></div>
      <div className="archive-rail__scroller">
        {Object.entries(destinationGroups).map(([label, group]) => (
          <section className="archive-rail__group" key={label} aria-label={label}>
            <p>{label}</p>
            <nav className="archive-rail__destinations" aria-label={`${label} destinations`}>
              {group.map((destination) => {
                const Icon = destination.Icon;
                const active = activeDestination === destination.id;
                return <button key={destination.id} type="button" className="archive-rail__destination" aria-current={active ? 'page' : undefined} aria-pressed={active} data-active={active} onClick={() => runDestination(destination)}><Icon size={18} /><span><strong>{destination.label}</strong>{destination.meta && <small>{destination.meta}</small>}</span>{progressBadges[destination.id] != null && <b>{progressBadges[destination.id]}</b>}<ChevRight size={13} className="archive-rail__chev" /></button>;
              })}
            </nav>
          </section>
        ))}
        <div className="archive-rail__content">{children}</div>
      </div>
    </>
  );

  return (
    <>
      <FloatingNavigationControls darkMode={darkMode} pillBorder={pillBorder} controlsHidden={controlsHidden} open={open || mobileHubOpen} onToggle={handleControlToggle} onOpenSearch={onOpenSearch} onOpenMore={onOpenSettings} menuControlsId={shellId} moreControlsId={moreId} />
      {open && <button className="navigation-backdrop" data-state="open" type="button" aria-label="Collapse sidebar hub" onPointerDown={(event) => { event.preventDefault(); event.stopPropagation(); onDismissBackdrop?.(); onClose?.(); }} onClick={(event) => { event.preventDefault(); event.stopPropagation(); }} />}
      <aside id={shellId} ref={ref} data-state={open ? 'open' : 'closed'} aria-label="Sidebar Hub" className="navigation-shell archive-rail" style={{ '--navigation-bg': darkMode ? 'rgba(8,12,28,0.92)' : 'rgba(248,251,255,0.94)', '--navigation-border': surfaceBorder, '--navigation-shadow': darkMode ? 'var(--elevation-surface-3)' : 'var(--elevation-surface-2)', '--navigation-blur': performanceMode ? 'none' : 'blur(12px)' }}>
        {hubContent}
      </aside>

      <nav className="archive-mobile-dock" aria-label="Mobile primary navigation">
        {primaryDock.map((destination) => { const Icon = destination.Icon; return <button key={destination.id} type="button" aria-current={activeDestination === destination.id ? 'page' : undefined} data-active={activeDestination === destination.id} onClick={() => runDestination(destination)}><Icon size={18} /><span>{destination.label}</span></button>; })}
        <button type="button" aria-expanded={mobileHubOpen} aria-controls={`${shellId}-mobile`} data-active={mobileHubOpen} onClick={() => setMobileHubOpen(true)}><Menu size={18} /><span>Hub</span></button>
      </nav>
      {mobileHubOpen && <div id={`${shellId}-mobile`} className="archive-command-sheet" role="dialog" aria-modal="true" aria-label="Sidebar Hub"><button className="archive-command-sheet__backdrop" aria-label="Close sidebar hub" onClick={() => setMobileHubOpen(false)} /><div className="archive-command-sheet__panel">{hubContent}</div></div>}
    </>
  );
}));

export default NavigationShell;
