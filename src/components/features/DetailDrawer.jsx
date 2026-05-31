import React, { useEffect, useRef } from 'react';
import './DetailDrawer.css';

const FOCUSABLE = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export default function DetailDrawer({ open, onClose, labelledBy, children }) {
  const panelRef = useRef(null);
  const lastFocusRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    lastFocusRef.current = document.activeElement;
    const focusTarget = panelRef.current?.querySelector(FOCUSABLE) || panelRef.current;
    window.setTimeout(() => focusTarget?.focus?.(), 0);
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose?.();
      if (event.key !== 'Tab') return;
      const nodes = Array.from(panelRef.current?.querySelectorAll(FOCUSABLE) || []).filter((node) => !node.hasAttribute('disabled'));
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      lastFocusRef.current?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="detail-drawer-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose?.(); }} role="presentation">
      <aside ref={panelRef} className="detail-drawer archive-drawer is-open" role="dialog" aria-modal="true" aria-labelledby={labelledBy} tabIndex={-1}>
        {children}
      </aside>
    </div>
  );
}
