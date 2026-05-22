import { useEffect } from 'react';
import 'lenis/dist/lenis.css';

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const getTuning = () => {
  const tuning = typeof window !== 'undefined' ? window.__scrollTuning ?? {} : {};
  return {
    desktopMultiplier: clamp(Number(tuning.desktopMultiplier) || 6, 1, 10),
    mobileMultiplier: clamp(Number(tuning.mobileMultiplier) || 6, 1, 10),
  };
};

const startFallbackScroll = () => {
  const html = document.documentElement;
  html.classList.add('lenis-ready');

  let current = window.scrollY;
  let target = window.scrollY;
  let rafId = 0;
  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  const tuning = getTuning();

  const maxScrollY = () => Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

  const kickoff = () => {
    if (rafId) return;
    rafId = window.requestAnimationFrame(function step() {
      const smooth = isTouch ? 0.11 : 0.15;
      current += (target - current) * smooth;
      if (Math.abs(target - current) < 0.2) current = target;
      window.scrollTo(0, current);
      if (Math.abs(target - current) >= 0.2) rafId = window.requestAnimationFrame(step);
      else rafId = 0;
    });
  };

  const onWheel = (event) => {
    if (event.ctrlKey || event.defaultPrevented) return;
    const multiplier = 0.8 + (tuning.desktopMultiplier * 0.06);
    target = Math.min(maxScrollY(), Math.max(0, target + event.deltaY * multiplier));
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
        const isTouch = window.matchMedia('(pointer: coarse)').matches;
        const tuning = getTuning();

        const lenis = new Lenis({
          autoRaf: true,
          smoothWheel: true,
          syncTouch: true,
          syncTouchLerp: 0.08,
          touchInertiaExponent: 1.35,
          allowNestedScroll: true,
          overscroll: false,
          gestureOrientation: 'vertical',
          wheelMultiplier: 0.82 + (tuning.desktopMultiplier * 0.065),
          touchMultiplier: 0.82 + (tuning.mobileMultiplier * 0.065),
          lerp: isTouch ? 0.095 : 0.11,
        });

        const html = document.documentElement;
        html.classList.add('lenis-ready');

        const onOverlayCheck = () => {
          if (window.__overlayActive) lenis.stop();
          else lenis.start();
        };

        const onResize = () => lenis.resize();

        window.addEventListener('resize', onResize);
        window.addEventListener('scroll', onOverlayCheck, { passive: true });

        cleanup = () => {
          window.removeEventListener('resize', onResize);
          window.removeEventListener('scroll', onOverlayCheck);
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
