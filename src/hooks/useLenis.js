import { useEffect } from 'react';
import Lenis from 'lenis';

const isEditableTarget = (target) => {
  if (!(target instanceof Element)) return false;
  const tag = target.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || Boolean(target.closest('[contenteditable], [contenteditable="true"], [contenteditable="plaintext-only"]'));
};

const hasScrollableParent = (target) => {
  if (!(target instanceof Element)) return false;
  let node = target;
  while (node && node !== document.body) {
    const style = window.getComputedStyle(node);
    const overflowY = style.overflowY;
    const overflowX = style.overflowX;
    const canScrollY = (overflowY === 'auto' || overflowY === 'scroll') && node.scrollHeight > node.clientHeight + 1;
    const canScrollX = (overflowX === 'auto' || overflowX === 'scroll') && node.scrollWidth > node.clientWidth + 1;

    if (canScrollY || canScrollX) return true;
    node = node.parentElement;
  }
  return false;
};

const getScrollTuning = () => {
  const t = (typeof window !== 'undefined' && window.__scrollTuning) ? window.__scrollTuning : {};
  const clamp10 = (v, d) => Math.max(1, Math.min(10, Number.isFinite(Number(v)) ? Number(v) : d));
  return {
    desktopMultiplier: clamp10(t.desktopMultiplier, 6),
    mobileMultiplier: clamp10(t.mobileMultiplier, 6),
  };
};

export const useLenis = () => {
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const html = document.documentElement;
    const saveDataMode = navigator?.connection?.saveData === true;
    if (saveDataMode) return undefined;

    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    const tune = getScrollTuning();

    const lenis = new Lenis({
      smoothWheel: true,
      syncTouch: true,
      touchInertiaMultiplier: 18,
      wheelMultiplier: isFinePointer ? 0.72 + (tune.desktopMultiplier * 0.14) : 1,
      touchMultiplier: isFinePointer ? 1 : 0.7 + (tune.mobileMultiplier * 0.1),
      duration: isFinePointer ? 0.95 : 0.85,
      lerp: isFinePointer ? 0.12 : 0.15,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      overscroll: false,
      gestureOrientation: 'vertical',
      prevent: (node) => {
        if (!(node instanceof Element)) return false;
        if (window.__overlayActive) return true;
        if (isEditableTarget(node)) return true;
        return hasScrollableParent(node);
      },
    });

    html.classList.add('lenis-ready');

    let rafId = 0;
    const raf = (time) => {
      lenis.raf(time);
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
