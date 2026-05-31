import React, { useMemo, useState } from 'react';
import { Bookmark, ChevRight, Eye, Layers, Menu, Search, Settings, SlidersH, X } from '../../constants/icons.jsx';
import './NavigationShell.css';

const ICONS = { Home: Eye, Library: Layers, Collections: Bookmark, Search, Progress: SlidersH, Settings };

export const FloatingNavigationControls = React.memo(function FloatingNavigationControls({ controlsHidden = false, onToggle }) {
  return (
    <nav className="navigation-control-cluster" style={controlsHidden ? { opacity: 0, pointerEvents: 'none', visibility: 'hidden' } : undefined} aria-label="Archive quick controls">
      <button className="theme-btn navigation-control-btn navigation-control-btn--menu" onClick={onToggle} aria-label="Open archive command sheet"><Menu size={18} /></button>
    </nav>
  );
});

export const NavigationShell = React.memo(React.forwardRef(function NavigationShell({
  open,
  performanceMode,
  surfaceBorder,
  onToggle,
  onClose,
  onDismissBackdrop,
  controlsHidden = false,
  destinations = [],
  activeDestination = 'Home',
  progressBadge = '',
  children,
}, ref) {
  const [expanded, setExpanded] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const primaryMobile = destinations.slice(0, 4);
  const secondaryMobile = destinations.slice(4);
  const navItems = useMemo(() => destinations.map((destination) => ({ ...destination, Icon: destination.Icon || ICONS[destination.label] || Layers })), [destinations]);
  const invoke = (destination) => {
    destination.onSelect?.();
    setSheetOpen(false);
    onClose?.();
  };

  return (
    <>
      <FloatingNavigationControls controlsHidden={controlsHidden} onToggle={() => { setSheetOpen(true); onToggle?.(); }} />

      <aside
        ref={ref}
        className={`archive-navigation-rail${expanded ? ' is-expanded' : ' is-collapsed'}`}
        aria-label="Archive Navigation"
        style={{ '--navigation-border': surfaceBorder, '--navigation-blur': performanceMode ? 'none' : 'blur(14px)' }}
      >
        <button className="archive-rail-toggle" type="button" onClick={() => setExpanded((value) => !value)} aria-label={expanded ? 'Collapse archive navigation' : 'Expand archive navigation'}>
          <Layers size={18} /><span>Archive</span><ChevRight size={14} />
        </button>
        <nav className="archive-rail-list" aria-label="Primary archive destinations">
          {navItems.map((destination) => {
            const active = activeDestination === destination.id || activeDestination === destination.label;
            return <button key={destination.id || destination.label} type="button" className={`archive-nav-item${active ? ' is-active' : ''}`} onClick={() => invoke(destination)} aria-current={active ? 'page' : undefined}>
              <destination.Icon size={18} />
              <span>{destination.label}</span>
              {!!destination.badge && <em>{destination.badge}</em>}
              {destination.label === 'Progress' && progressBadge && <em>{progressBadge}</em>}
            </button>;
          })}
        </nav>
      </aside>

      <nav className="archive-mobile-dock" aria-label="Archive mobile dock" style={controlsHidden ? { opacity: 0, pointerEvents: 'none' } : undefined}>
        {primaryMobile.map((destination) => {
          const Icon = destination.Icon || ICONS[destination.label] || Layers;
          const active = activeDestination === destination.id || activeDestination === destination.label;
          return <button key={destination.id || destination.label} type="button" className={active ? 'is-active' : ''} onClick={() => invoke(destination)}><Icon size={18} /><span>{destination.label}</span></button>;
        })}
        <button type="button" onClick={() => setSheetOpen(true)}><Menu size={18} /><span>More</span></button>
      </nav>

      {(open || sheetOpen) && <button className="navigation-backdrop" data-state="open" type="button" aria-label="Close archive navigation" onPointerDown={(event) => { event.preventDefault(); event.stopPropagation(); onDismissBackdrop?.(); setSheetOpen(false); onClose?.(); }} />}

      <aside
        data-state={(open || sheetOpen) ? 'open' : 'closed'}
        aria-hidden={!(open || sheetOpen)}
        aria-label="Archive command sheet"
        className="navigation-shell"
        style={{ '--navigation-border': surfaceBorder, '--navigation-transform': (open || sheetOpen) ? 'translateY(0)' : 'translateY(105%)', '--navigation-blur': performanceMode ? 'none' : 'blur(12px)' }}
      >
        <div className="navigation-shell__topbar"><span>Archive Navigation</span><button className="navigation-close-btn" type="button" onClick={() => { setSheetOpen(false); onClose?.(); }} aria-label="Close archive navigation"><X size={14} /></button></div>
        <div className="archive-sheet-destinations">
          {[...primaryMobile, ...secondaryMobile].map((destination) => {
            const Icon = destination.Icon || ICONS[destination.label] || Layers;
            const active = activeDestination === destination.id || activeDestination === destination.label;
            return <button key={`sheet-${destination.id || destination.label}`} className={`archive-nav-item${active ? ' is-active' : ''}`} type="button" onClick={() => invoke(destination)}><Icon size={18}/><span>{destination.label}</span>{!!destination.badge && <em>{destination.badge}</em>}</button>;
          })}
        </div>
        {children}
      </aside>
    </>
  );
}));

export default NavigationShell;
