import { useEffect, useRef } from 'react';

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
  const backStepActiveRef = useRef(false);
  useEffect(() => {
    const hasOverlay = Boolean(sidebarOpen || settingsOpen || detailItem || analyticsOpen);
    const hasBackStep = hasOverlay || hasInAppBackStep;
    if (!hasBackStep) {
      backStepActiveRef.current = false;
      return;
    }

    if (!backStepActiveRef.current) {
      window.history.pushState({ mcuOverlay: true, hasOverlay, hasInAppBackStep: Boolean(hasInAppBackStep) }, '');
      backStepActiveRef.current = true;
    } else {
      window.history.replaceState({ mcuOverlay: true, hasOverlay, hasInAppBackStep: Boolean(hasInAppBackStep) }, '');
    }

    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';

    const onBack = () => {
      backStepActiveRef.current = false;
      if (detailItem) onCloseDetail();
      else if (analyticsOpen) onCloseAnalytics();
      else if (settingsOpen) onCloseSettings();
      else if (sidebarOpen) onCloseSidebar();
      else if (hasInAppBackStep && typeof onInAppBack === 'function') onInAppBack();
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
