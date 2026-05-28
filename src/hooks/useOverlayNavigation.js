import { useEffect } from 'react';

export function useOverlayNavigation({
  sidebarOpen,
  settingsOpen,
  detailItem,
  analyticsOpen,
  onCloseDetail,
  onCloseAnalytics,
  onCloseSettings,
  onCloseSidebar,
  hasInAppBackStep = false,
  onInAppBack = null,
}) {
  useEffect(() => {
    const hasOverlay = Boolean(sidebarOpen || settingsOpen || detailItem || analyticsOpen);
    const hasBackStep = hasOverlay || hasInAppBackStep;
    if (!hasBackStep) return;

    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    const pinnedScrollY = window.scrollY;
    window.history.pushState({ mcuOverlay: true, hasOverlay, hasInAppBackStep: Boolean(hasInAppBackStep), scrollY: pinnedScrollY }, '');

    const onBack = () => {
      const stableY = window.scrollY;
      if (detailItem) onCloseDetail();
      else if (analyticsOpen) onCloseAnalytics();
      else if (settingsOpen) onCloseSettings();
      else if (sidebarOpen) onCloseSidebar();
      else if (hasInAppBackStep && typeof onInAppBack === 'function') onInAppBack();

      requestAnimationFrame(() => {
        window.scrollTo({ top: stableY, left: 0, behavior: 'auto' });
      });
    };

    window.addEventListener('popstate', onBack);
    return () => {
      window.removeEventListener('popstate', onBack);
      window.history.scrollRestoration = previousScrollRestoration || 'auto';
    };
  }, [
    sidebarOpen,
    settingsOpen,
    detailItem,
    analyticsOpen,
    onCloseDetail,
    onCloseAnalytics,
    onCloseSettings,
    onCloseSidebar,
    hasInAppBackStep,
    onInAppBack,
  ]);
}
