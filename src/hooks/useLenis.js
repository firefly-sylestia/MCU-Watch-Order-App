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
      smoothWheel: true,
      syncTouch: true,
      syncTouchLerp: 0.085,
      touchInertiaExponent: 1.4,
      gestureOrientation: 'vertical',
      autoResize: true,
      lerp: 0.13,
      wheelMultiplier: 1.18,
      touchMultiplier: 1.1,
      overscroll: true,
      autoRaf: false,
    });

    let rafId = 0;
    let idleTimer = 0;

    const setScrollFeedback = () => {
      document.body.classList.add('is-scrolling');
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => document.body.classList.remove('is-scrolling'), 140);
    };

    lenis.on('scroll', (e) => {
      const progress = Number.isFinite(e?.progress) ? e.progress : 0;
      document.documentElement.style.setProperty('--lenis-progress', String(progress));
      setScrollFeedback();
    });

    const raf = (time) => {
      if (window.__overlayActive) {
        lenis.stop();
      } else {
        lenis.start();
        lenis.raf(time);
      }
      rafId = window.requestAnimationFrame(raf);
    };

    rafId = window.requestAnimationFrame(raf);

    return () => {
      window.clearTimeout(idleTimer);
      document.body.classList.remove('is-scrolling');
      window.cancelAnimationFrame(rafId);
      lenis.destroy();
      html.classList.remove('lenis-ready');
    };
  }, []);
};
