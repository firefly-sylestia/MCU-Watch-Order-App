import React from 'react';
import { Menu, Settings, X } from '../../constants/icons.jsx';
import './NavigationShell.css';

const controlStyle = (darkMode, pillBorder) => ({
  '--nav-control-bg': darkMode ? 'rgba(8,12,28,0.92)' : 'rgba(255,255,255,0.94)',
  '--nav-control-text': darkMode ? '#f5fffd' : '#0f172a',
  '--nav-control-border': darkMode ? 'rgba(255,255,255,0.22)' : pillBorder,
});

export const FloatingNavigationControls = React.memo(function FloatingNavigationControls({
  darkMode,
  pillBorder,
  controlsHidden = false,
  onToggle,
  onOpenSettings,
}) {
  return (
    <nav
      className="navigation-control-cluster"
      style={controlsHidden ? { opacity: 0, pointerEvents: 'none', visibility: 'hidden' } : undefined}
      aria-label="Primary app controls"
    >
      <button
        className="theme-btn navigation-control-btn navigation-control-btn--menu"
        onClick={onToggle}
        aria-label="Open navigation menu"
        style={controlStyle(darkMode, pillBorder)}
      >
        <Menu size={18} />
      </button>
      <button
        className="theme-btn navigation-control-btn navigation-control-btn--settings"
        onClick={onOpenSettings}
        aria-label="Open settings and profile"
        style={controlStyle(darkMode, pillBorder)}
      >
        <Settings size={18} />
      </button>
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
  children,
}, ref) {
  return (
    <>
      <FloatingNavigationControls
        darkMode={darkMode}
        pillBorder={pillBorder}
        controlsHidden={controlsHidden}
        onToggle={onToggle}
        onOpenSettings={onOpenSettings}
      />
      {open && (
        <button
          className="navigation-backdrop"
          data-state="open"
          type="button"
          aria-label="Close navigation menu"
          onPointerDown={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onDismissBackdrop?.();
            onClose?.();
          }}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
        />
      )}
      <aside
        ref={ref}
        data-state={open ? 'open' : 'closed'}
        aria-hidden={!open}
        aria-label="Mission control navigation"
        className="navigation-shell"
        style={{
          '--navigation-bg': darkMode ? 'rgba(8,12,28,0.92)' : 'rgba(248,251,255,0.94)',
          '--navigation-border': surfaceBorder,
          '--navigation-transform': open ? 'translateX(0)' : 'translateX(-105%)',
          '--navigation-shadow': darkMode ? 'var(--elevation-surface-3)' : 'var(--elevation-surface-2)',
          '--navigation-blur': performanceMode ? 'none' : 'blur(12px)',
        }}
      >
        <div className="navigation-shell__topbar">
          <span>Navigation</span>
          <button className="navigation-close-btn" type="button" onClick={onClose} aria-label="Close navigation menu">
            <X size={14} />
          </button>
        </div>
        {children}
      </aside>
    </>
  );
}));

export default NavigationShell;
