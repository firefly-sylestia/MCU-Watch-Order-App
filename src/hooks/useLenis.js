import { useEffect } from 'react';
import 'lenis/dist/lenis.css';

const startFallbackScroll = () => {
  const html = document.documentElement;
  html.classList.add('lenis-ready');
  let current = window.scrollY;
  let target = window.scrollY;
  let rafId = 0;

  const maxScrollY = () => Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  const kickoff = () => {
    if (rafId) return;
    rafId = window.requestAnimationFrame(function step() {
      current += (target - current) * 0.14;
      if (Math.abs(target - current) < 0.2) current = target;
      window.scrollTo(0, current);
      if (Math.abs(target - current) >= 0.2) rafId = window.requestAnimationFrame(step);
      else rafId = 0;
    });
  };

  const onWheel = (event) => {
    if (event.ctrlKey || event.defaultPrevented) return;
    target = Math.min(maxScrollY(), Math.max(0, target + event.deltaY * 0.95));
    kickoff();
    event.preventDefault();
  };

  const onScroll = () => {
    if (rafId) return;
    current = window.scrollY;
    target = window.scrollY;
  };

  window.addEventListener('wheel', onWheel, { passive: false });
  window.addEventListener('scroll', onScroll, { passive: true });

  return () => {
    window.removeEventListener('wheel', onWheel);
    window.removeEventListener('scroll', onScroll);
    window.cancelAnimationFrame(rafId);
    html.classList.remove('lenis-ready');
  };
};

export const useLenis = () => {
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    let cleanup = () => {};

    const init = async () => {
      try {
        const { default: Lenis } = await import('lenis');
        const lenis = new Lenis({
          autoRaf: true,
          smoothWheel: true,
          syncTouch: true,
          allowNestedScroll: true,
          overscroll: false,
          gestureOrientation: 'vertical',
          wheelMultiplier: 1,
          touchMultiplier: 1,
          lerp: 0.12,
        });

        const html = document.documentElement;
        html.classList.add('lenis-ready');

        const onScroll = () => {
          if (window.__overlayActive) lenis.stop();
          else lenis.start();
        };

        window.addEventListener('resize', () => lenis.resize());
        window.addEventListener('scroll', onScroll, { passive: true });

        cleanup = () => {
          window.removeEventListener('scroll', onScroll);
          lenis.destroy();
          html.classList.remove('lenis-ready');
        };
      } catch {
        cleanup = startFallbackScroll();
      }
    };

    init();

    return () => cleanup();
  }, []);
};
