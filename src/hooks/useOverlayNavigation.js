import { useEffect } from 'react';

export function useOverlayNavigation({ sidebarOpen, settingsOpen, detailItem, analyticsOpen, onCloseDetail, onCloseAnalytics, onCloseSettings, onCloseSidebar }) {
  useEffect(() => {
    const hasOverlay = sidebarOpen || settingsOpen || detailItem || analyticsOpen;
    if (!hasOverlay) return;
    window.history.pushState({ mcuOverlay: true }, '');
    const onBack = () => {
      if (detailItem) onCloseDetail();
      else if (analyticsOpen) onCloseAnalytics();
      else if (settingsOpen) onCloseSettings();
      else if (sidebarOpen) onCloseSidebar();
    };
    window.addEventListener('popstate', onBack);
    return () => window.removeEventListener('popstate', onBack);
  }, [sidebarOpen, settingsOpen, detailItem, analyticsOpen, onCloseDetail, onCloseAnalytics, onCloseSettings, onCloseSidebar]);
}
