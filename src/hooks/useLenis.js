import { useEffect } from 'react';

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
    const canScrollY = (style.overflowY === 'auto' || style.overflowY === 'scroll') && node.scrollHeight > node.clientHeight + 1;
    if (canScrollY) return true;
    node = node.parentElement;
  }
  return false;
};

const getScrollTuning = () => {
  const t = (typeof window !== 'undefined' && window.__scrollTuning) ? window.__scrollTuning : {};
  const clamp10 = (v, d) => Math.max(1, Math.min(10, Number.isFinite(Number(v)) ? Number(v) : d));
  return {
    desktopMultiplier: clamp10(t.desktopMultiplier, 7),
    mobileMultiplier: clamp10(t.mobileMultiplier, 7),
  };
};

export const useLenis = () => {
  useEffect(() => {
    let cleanup = null;

    const initLenis = async () => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverscroll = html.style.overscrollBehaviorY;
    const prevBodyOverscroll = body.style.overscrollBehaviorY;
    const prevHtmlOverflow = html.style.overflow;

    try {
      const tune = getScrollTuning();
      const isFinePointer = window.matchMedia('(pointer: fine)').matches;
      const saveDataMode = navigator?.connection?.saveData === true;

      const wheelMultiplier = isFinePointer ? 0.9 + (tune.desktopMultiplier * 0.11) : 1;
      const touchMultiplier = 0.9 + (tune.mobileMultiplier * 0.11);

      const lenisModule = await import(/* @vite-ignore */ 'https://esm.sh/lenis@1.3.23');
      const Lenis = lenisModule.default;
      const lenis = new Lenis({
        autoRaf: false,
        smoothWheel: isFinePointer && !saveDataMode,
        syncTouch: !isFinePointer && !saveDataMode,
        syncTouchLerp: 0.12,
        touchInertiaExponent: 1.6,
        wheelMultiplier,
        touchMultiplier,
        lerp: isFinePointer ? 0.14 : 0.18,
        prevent: (node) => {
          if (window.__overlayActive) return true;
          if (isEditableTarget(node)) return true;
          if (hasScrollableParent(node)) return true;
          return false;
        },
      });

      html.classList.add('lenis-ready');
      html.style.overscrollBehaviorY = 'none';
      body.style.overscrollBehaviorY = 'none';
      html.style.overflow = 'hidden';

      let rafId = 0;
      const raf = (time) => {
        lenis.raf(time);
        rafId = window.requestAnimationFrame(raf);
      };
      rafId = window.requestAnimationFrame(raf);

      cleanup = () => {
        if (rafId) window.cancelAnimationFrame(rafId);
        lenis.destroy();
        html.style.overscrollBehaviorY = prevHtmlOverscroll;
        body.style.overscrollBehaviorY = prevBodyOverscroll;
        html.style.overflow = prevHtmlOverflow;
        html.classList.remove('lenis-ready');
      };
    } catch (error) {
      console.warn('Lenis failed to initialize, falling back to native scroll.', error);
      cleanup = () => {
        html.style.overscrollBehaviorY = prevHtmlOverscroll;
        body.style.overscrollBehaviorY = prevBodyOverscroll;
        html.style.overflow = prevHtmlOverflow;
        html.classList.remove('lenis-ready');
      };
    }
    };

    initLenis();
    return () => { if (cleanup) cleanup(); };
  }, []);
};
