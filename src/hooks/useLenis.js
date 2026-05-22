import { useEffect } from 'react';

const isEditableTarget = (target) => {
  if (!(target instanceof Element)) return false;
  const tag = target.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.closest('[contenteditable="true"]');
};

const hasScrollableParent = (target, { deltaX = 0, deltaY = 0, axis = 'y' } = {}) => {
  if (!(target instanceof Element)) return false;
  let node = target;
  while (node && node !== document.body) {
    const style = window.getComputedStyle(node);
    const overflowY = style.overflowY;
    const overflowX = style.overflowX;
    const canScrollY = (overflowY === 'auto' || overflowY === 'scroll') && node.scrollHeight > node.clientHeight + 1;
    const canScrollX = (overflowX === 'auto' || overflowX === 'scroll') && node.scrollWidth > node.clientWidth + 1;

    if (axis === 'x' && canScrollX) {
      const atLeft = node.scrollLeft <= 0;
      const atRight = node.scrollLeft + node.clientWidth >= node.scrollWidth - 1;
      if ((deltaX < 0 && !atLeft) || (deltaX > 0 && !atRight)) return true;
    }

    if (axis === 'y' && canScrollY) {
      const atTop = node.scrollTop <= 0;
      const atBottom = node.scrollTop + node.clientHeight >= node.scrollHeight - 1;
      if ((deltaY < 0 && !atTop) || (deltaY > 0 && !atBottom)) return true;
    }

    node = node.parentElement;
  }
  return false;
};

const getScrollTuning = () => {
  const t = (typeof window !== 'undefined' && window.__scrollTuning) ? window.__scrollTuning : {};
  const clamp10 = (v, d) => Math.max(1, Math.min(10, Number.isFinite(Number(v)) ? Number(v) : d));
  return {
    desktopMultiplier: clamp10(t.desktopMultiplier, 6),
    desktopDeltaCap: clamp10(t.desktopDeltaCap, 9),
    mobileMultiplier: clamp10(t.mobileMultiplier, 6),
    mobileDeltaCap: clamp10(t.mobileDeltaCap, 9),
  };
};

export const useLenis = () => {
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const html = document.documentElement;
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    html.classList.add('lenis-ready');

    let current = window.scrollY;
    let target = window.scrollY;
    let rafId = 0;
    let lastFrame = 0;

    const maxScrollY = () => Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const isOverlayActive = () => Boolean(typeof window !== 'undefined' && window.__overlayActive);

    const kickoff = () => { if (!rafId) rafId = window.requestAnimationFrame(step); };

    const step = () => {
      const now = performance.now();
      const dt = lastFrame ? Math.min(40, now - lastFrame) : 16;
      lastFrame = now;
      const delta = target - current;
      const frameLerp = Math.min(0.28, (isFinePointer ? 0.16 : 0.2) * (dt / 16.67));
      current += delta * frameLerp;
      if (Math.abs(delta) <= 0.35) current = target;
      window.scrollTo(0, current);
      if (Math.abs(target - current) > 0.35) rafId = window.requestAnimationFrame(step);
      else rafId = 0;
    };

    const normalizeDelta = (event) => {
      if (event.deltaMode === 1) return event.deltaY * 16;
      if (event.deltaMode === 2) return event.deltaY * window.innerHeight;
      return event.deltaY;
    };

    const onWheel = (event) => {
      if (!isFinePointer) return;
      if (event.defaultPrevented || event.ctrlKey) return;
      if (isOverlayActive()) return;
      if (isEditableTarget(event.target)) return;
      const horizontalIntent = Math.abs(event.deltaX) > Math.abs(event.deltaY) * 1.1;
      const deltaY = normalizeDelta(event);
      if (horizontalIntent) {
        if (hasScrollableParent(event.target, { deltaX: event.deltaX, axis: 'x' })) return;
        return;
      }
      if (!Number.isFinite(deltaY) || deltaY === 0) return;
      if (hasScrollableParent(event.target, { deltaY, axis: 'y' })) return;

      const tune = getScrollTuning();
      const deskCap = 30 + tune.desktopDeltaCap * 10;
      const deskMult = 0.8 + (tune.desktopMultiplier * 0.2);
      const limitedDelta = Math.max(-deskCap, Math.min(deskCap, deltaY)) * deskMult;
      target = Math.min(maxScrollY(), Math.max(0, target + limitedDelta));
      kickoff();
      event.preventDefault();
    };

    const syncToNativeScroll = () => {
      if (isOverlayActive()) return;
      if (rafId) {
        const drift = Math.abs(window.scrollY - current);
        if (drift > 80) {
          window.cancelAnimationFrame(rafId);
          rafId = 0;
        } else {
          return;
        }
      }
      current = window.scrollY;
      target = window.scrollY;
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('scroll', syncToNativeScroll, { passive: true });
    const onResize = () => { target = Math.min(target, maxScrollY()); current = Math.min(current, maxScrollY()); };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('scroll', syncToNativeScroll);
      window.removeEventListener('resize', onResize);
      window.cancelAnimationFrame(rafId);
      html.classList.remove('lenis-ready');
    };
  }, []);
};
