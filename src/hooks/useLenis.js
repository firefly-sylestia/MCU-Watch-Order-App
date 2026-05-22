import { useEffect } from 'react';

const isEditableTarget = (target) => {
  if (!(target instanceof Element)) return false;
  const tag = target.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.closest('[contenteditable="true"]');
};

export const useLenis = () => {
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const html = document.documentElement;
    html.classList.add('lenis-ready');

    let current = window.scrollY;
    let target = window.scrollY;
    let rafId = 0;

    const maxScrollY = () => Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

    const step = () => {
      const delta = target - current;
      current += delta * 0.115;
      if (Math.abs(delta) <= 0.35) current = target;
      window.scrollTo(0, current);
      if (Math.abs(target - current) > 0.35) {
        rafId = window.requestAnimationFrame(step);
      } else {
        rafId = 0;
      }
    };

    const kickoff = () => {
      if (!rafId) rafId = window.requestAnimationFrame(step);
    };

    const normalizeDelta = (event) => {
      if (event.deltaMode === 1) return event.deltaY * 16; // lines
      if (event.deltaMode === 2) return event.deltaY * window.innerHeight; // pages
      return event.deltaY; // pixels
    };

    const onWheel = (event) => {
      if (event.defaultPrevented || event.ctrlKey) return;
      if (isEditableTarget(event.target)) return;
      const deltaY = normalizeDelta(event);
      if (!Number.isFinite(deltaY) || deltaY === 0) return;

      target = Math.min(maxScrollY(), Math.max(0, target + deltaY));
      kickoff();
      event.preventDefault();
    };

    const syncToNativeScroll = () => {
      if (rafId) return;
      current = window.scrollY;
      target = window.scrollY;
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('scroll', syncToNativeScroll, { passive: true });
    window.addEventListener('resize', () => {
      target = Math.min(target, maxScrollY());
      current = Math.min(current, maxScrollY());
    });

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('scroll', syncToNativeScroll);
      window.cancelAnimationFrame(rafId);
      html.classList.remove('lenis-ready');
    };
  }, []);
};
