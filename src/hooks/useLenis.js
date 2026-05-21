import { useEffect } from 'react';

// Lightweight smooth-scroll controller with Lenis-compatible behavior.
export const useLenis = () => {
  useEffect(() => {
    const html = document.documentElement;
    html.classList.add('lenis-ready');

    let target = window.scrollY;
    let current = window.scrollY;
    let rafId = 0;
    let ticking = false;

    const tick = () => {
      const delta = target - current;
      current += delta * 0.12;
      if (Math.abs(delta) < 0.4) {
        current = target;
      }
      window.scrollTo(0, current);
      if (Math.abs(target - current) > 0.4) {
        rafId = requestAnimationFrame(tick);
      } else {
        ticking = false;
      }
    };

    const onWheel = (event) => {
      if (event.ctrlKey || event.defaultPrevented) return;
      target = Math.max(0, target + event.deltaY);
      if (!ticking) {
        ticking = true;
        rafId = requestAnimationFrame(tick);
      }
      event.preventDefault();
    };

    window.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      window.removeEventListener('wheel', onWheel);
      cancelAnimationFrame(rafId);
      html.classList.remove('lenis-ready');
    };
  }, []);
};
