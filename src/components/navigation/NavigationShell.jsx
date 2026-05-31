import React, { useState } from 'react';
import { Bookmark, ChevRight, Film, Layers, Menu, Search, Settings, Star, X } from '../../constants/icons.jsx';
import './NavigationShell.css';

const defaultDestinations = [
  { id: 'home', label: 'Home', Icon: Star, primary: true },
  { id: 'library', label: 'Library', Icon: Film, primary: true },
  { id: 'collections', label: 'Collections', Icon: Layers, primary: true },
  { id: 'search', label: 'Search', Icon: Search, primary: true },
  { id: 'progress', label: 'Progress', Icon: Bookmark, primary: false },
  { id: 'settings', label: 'Settings', Icon: Settings, primary: false },
];

const controlStyle = (darkMode, pillBorder) => ({
  '--nav-control-bg': darkMode ? 'rgba(8,12,28,0.92)' : 'rgba(255,255,255,0.94)',
  '--nav-control-text': darkMode ? '#f5fffd' : '#0f172a',
  '--nav-control-border': darkMode ? 'rgba(255,255,255,0.22)' : pillBorder,
});

export const FloatingNavigationControls = React.memo(function FloatingNavigationControls({ darkMode, pillBorder, controlsHidden = false, onToggle, onOpenSettings }) {
  return (
    <nav className="navigation-control-cluster" style={controlsHidden ? { opacity: 0, pointerEvents: 'none', visibility: 'hidden' } : undefined} aria-label="Archive quick controls">
      <button className="theme-btn navigation-control-btn navigation-control-btn--menu" type="button" onClick={onToggle} aria-label="Open archive menu" title="Open archive menu" style={controlStyle(darkMode, pillBorder)}><Menu size={20} aria-hidden="true" /><span>Menu</span></button>
      <button className="theme-btn navigation-control-btn navigation-control-btn--settings" type="button" onClick={onOpenSettings} aria-label="Open settings" title="Open settings" style={controlStyle(darkMode, pillBorder)}><Settings size={20} aria-hidden="true" /><span>Settings</span></button>
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
  onDismissBackdrop,
  controlsHidden = false,
  destinations = defaultDestinations,
  activeDestination = 'home',
  progressBadges = {},
  onNavigate,
  children,
}, ref) {
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);
  const runDestination = (destination) => {
    if (destination.id === 'settings') onOpenSettings?.();
    else onNavigate?.(destination.id);
    setMobileMoreOpen(false);
  };
  const handleControlToggle = () => {
    if (typeof window !== 'undefined' && window.matchMedia?.('(max-width: 760px)').matches) {
      setMobileMoreOpen(true);
      return;
    }
    onToggle?.();
  };
  const primaryDock = destinations.filter((d) => d.primary).slice(0, 4);
  const secondaryDock = destinations.filter((d) => !primaryDock.some((p) => p.id === d.id));

  return (
    <>
      <FloatingNavigationControls darkMode={darkMode} pillBorder={pillBorder} controlsHidden={controlsHidden} onToggle={handleControlToggle} onOpenSettings={onOpenSettings} />
      {open && <button className="navigation-backdrop" data-state="open" type="button" aria-label="Collapse archive navigation" onPointerDown={(event) => { event.preventDefault(); event.stopPropagation(); onDismissBackdrop?.(); onClose?.(); }} onClick={(event) => { event.preventDefault(); event.stopPropagation(); }} />}
      <aside ref={ref} data-state={open ? 'open' : 'closed'} aria-label="Archive Navigation" className="navigation-shell archive-rail" style={{ '--navigation-bg': darkMode ? 'rgba(8,12,28,0.92)' : 'rgba(248,251,255,0.94)', '--navigation-border': surfaceBorder, '--navigation-shadow': darkMode ? 'var(--elevation-surface-3)' : 'var(--elevation-surface-2)', '--navigation-blur': performanceMode ? 'none' : 'blur(12px)' }}>
        <div className="navigation-shell__topbar"><span>Archive Navigation</span><button className="navigation-close-btn" type="button" onClick={onClose} aria-label="Collapse navigation"><X size={14} /></button></div>
        <nav className="archive-rail__destinations" aria-label="Top-level destinations">
          {destinations.map((destination) => {
            const Icon = destination.Icon;
            const active = activeDestination === destination.id;
            return <button key={destination.id} type="button" className="archive-rail__destination" data-active={active} onClick={() => runDestination(destination)}><Icon size={18} /><span>{destination.label}</span>{progressBadges[destination.id] != null && <b>{progressBadges[destination.id]}</b>}<ChevRight size={13} className="archive-rail__chev" /></button>;
          })}
        </nav>
        <div className="archive-rail__content">{children}</div>
      </aside>

      <nav className="archive-mobile-dock" aria-label="Archive mobile dock">
        {primaryDock.map((destination) => { const Icon = destination.Icon; return <button key={destination.id} type="button" data-active={activeDestination === destination.id} onClick={() => runDestination(destination)}><Icon size={18} /><span>{destination.label}</span></button>; })}
        <button type="button" data-active={mobileMoreOpen} onClick={() => setMobileMoreOpen(true)}><Menu size={18} /><span>More</span></button>
      </nav>
      {mobileMoreOpen && <div className="archive-command-sheet" role="dialog" aria-label="Archive command palette"><button className="archive-command-sheet__backdrop" aria-label="Close command palette" onClick={() => setMobileMoreOpen(false)} /><div className="archive-command-sheet__panel"><div><strong>Archive Commands</strong><button onClick={() => setMobileMoreOpen(false)}><X size={14} /></button></div>{secondaryDock.map((destination) => { const Icon = destination.Icon; return <button key={destination.id} data-active={activeDestination === destination.id} onClick={() => runDestination(destination)}><Icon size={18} /><span>{destination.label}</span>{progressBadges[destination.id] != null && <b>{progressBadges[destination.id]}</b>}</button>; })}</div></div>}
    </>
  );
}));

export default NavigationShell;
