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
  const hasBackStepRef = useRef(false);
  const scrollYRef = useRef(0);

  useEffect(() => {
    const hasOverlay = Boolean(sidebarOpen || settingsOpen || detailItem || analyticsOpen);
    const hasBackStep = hasOverlay || hasInAppBackStep;
    if (!hasBackStep) {
      hasBackStepRef.current = false;
      return;
    }

    if (!hasBackStepRef.current) {
      hasBackStepRef.current = true;
      scrollYRef.current = window.scrollY || 0;
      window.history.pushState({ mcuOverlay: true, hasOverlay, hasInAppBackStep: Boolean(hasInAppBackStep) }, '');
    } else {
      window.history.replaceState({ mcuOverlay: true, hasOverlay, hasInAppBackStep: Boolean(hasInAppBackStep) }, '');
    }

    const onBack = () => {
      const top = scrollYRef.current;
      window.scrollTo(0, top);
      if (detailItem) onCloseDetail();
      else if (analyticsOpen) onCloseAnalytics();
      else if (settingsOpen) onCloseSettings();
      else if (sidebarOpen) onCloseSidebar();
      else if (hasInAppBackStep && typeof onInAppBack === 'function') onInAppBack();
      requestAnimationFrame(() => window.scrollTo(0, top));
    };

    window.addEventListener('popstate', onBack);
    return () => window.removeEventListener('popstate', onBack);
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
