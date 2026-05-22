import { useEffect } from 'react';

const EASE = 0.14;

// Lightweight smooth-scroll controller with Lenis-compatible behavior.
export const useLenis = () => {
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return undefined;

    const mediaReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const isTouchPrimary = window.matchMedia('(pointer: coarse)').matches;
    if (mediaReduce.matches || isTouchPrimary) return undefined;

    const html = document.documentElement;
    html.classList.add('lenis-ready');

    let target = window.scrollY;
    let current = window.scrollY;
    let maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    let rafId = 0;
    let ticking = false;

    const refreshMax = () => {
      maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      target = Math.min(target, maxScroll);
      current = Math.min(current, maxScroll);
    };

    const shouldIgnore = (event) => {
      if (event.defaultPrevented || event.ctrlKey) return true;
      const path = event.composedPath ? event.composedPath() : [];
      return path.some((node) => node?.dataset?.lenisPrevent === 'true');
    };

    const tick = () => {
      const delta = target - current;
      current += delta * EASE;
      if (Math.abs(delta) < 0.35) current = target;
      window.scrollTo(0, current);
      if (Math.abs(target - current) > 0.35) {
        rafId = requestAnimationFrame(tick);
      } else {
        ticking = false;
      }
    };

    const startTick = () => {
      if (!ticking) {
        ticking = true;
        rafId = requestAnimationFrame(tick);
      }
    };

    const onWheel = (event) => {
      if (shouldIgnore(event)) return;
      refreshMax();
      const unit = event.deltaMode === 1 ? 16 : 1;
      target = Math.min(maxScroll, Math.max(0, target + event.deltaY * unit));
      startTick();
      event.preventDefault();
    };

    const onScrollSync = () => {
      if (ticking) return;
      current = window.scrollY;
      target = window.scrollY;
    };

    const onResize = () => refreshMax();

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('scroll', onScrollSync, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('scroll', onScrollSync);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(rafId);
      html.classList.remove('lenis-ready');
    };
  }, []);
};
