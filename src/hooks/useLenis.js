import { useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

export const useLenis = () => {
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const html = document.documentElement;
    html.classList.add('lenis-ready');

    const lenis = new Lenis({
      autoRaf: true,
      smoothWheel: true,
      syncTouch: false,
      gestureOrientation: 'vertical',
      autoResize: true,
      lerp: 0.09,
      duration: 1.05,
      wheelMultiplier: 1.3,
      touchMultiplier: 1,
      overscroll: true,
    });

    const onScroll = (event) => {
      const progress = Number.isFinite(event?.progress) ? event.progress : 0;
      document.documentElement.style.setProperty('--lenis-progress', String(progress));
    };

    lenis.on('scroll', onScroll);

    let prevOverlay = Boolean(window.__overlayActive);
    if (prevOverlay) lenis.stop();

    const overlayCheckInterval = window.setInterval(() => {
      const next = Boolean(window.__overlayActive);
      if (next === prevOverlay) return;
      prevOverlay = next;
      if (next) lenis.stop();
      else lenis.start();
    }, 120);

    return () => {
      window.clearInterval(overlayCheckInterval);
      lenis.off('scroll', onScroll);
      lenis.destroy();
      html.classList.remove('lenis-ready');
    };
  }, []);
};
