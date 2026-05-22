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
      syncTouchLerp: 0.1,
      touchInertiaExponent: 1.6,
      gestureOrientation: 'vertical',
      autoResize: true,
      lerp: 0.1,
      wheelMultiplier: 1,
      touchMultiplier: 1,
      overscroll: true,
      autoRaf: false,
    });

    let rafId = 0;
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
      window.cancelAnimationFrame(rafId);
      lenis.destroy();
      html.classList.remove('lenis-ready');
    };
  }, []);
};
