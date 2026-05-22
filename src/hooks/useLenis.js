import { useEffect } from 'react';

const isEditableTarget = (target) => {
  if (!(target instanceof Element)) return false;
  const tag = target.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || Boolean(target.closest('[contenteditable], [contenteditable="true"], [contenteditable="plaintext-only"]'));
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
    desktopMultiplier: clamp10(t.desktopMultiplier, 8),
    desktopDeltaCap: clamp10(t.desktopDeltaCap, 10),
    mobileMultiplier: clamp10(t.mobileMultiplier, 8),
    mobileDeltaCap: clamp10(t.mobileDeltaCap, 10),
  };
};

export const useLenis = () => {
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const html = document.documentElement;
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    const saveDataMode = navigator?.connection?.saveData === true;
    html.classList.add('lenis-ready');
    const prevHtmlOverscroll = html.style.overscrollBehaviorY;
    const prevBodyOverscroll = document.body.style.overscrollBehaviorY;
    html.style.overscrollBehaviorY = 'none';
    document.body.style.overscrollBehaviorY = 'none';

    let current = window.scrollY;
    let target = window.scrollY;
    let rafId = 0;

    let touchY = null;
    let touchX = null;

    const maxScrollY = () => Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const isOverlayActive = () => Boolean(typeof window !== 'undefined' && window.__overlayActive);

    const kickoff = () => { if (!rafId) rafId = window.requestAnimationFrame(step); };

    const step = () => {
      const delta = target - current;
      current += delta * (isFinePointer ? 0.2 : 0.26);
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
      if (!isFinePointer || saveDataMode) return;
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
      const deskMult = 1 + (tune.desktopMultiplier * 0.24);
      const limitedDelta = Math.max(-deskCap, Math.min(deskCap, deltaY)) * deskMult;
      target = Math.min(maxScrollY(), Math.max(0, target + limitedDelta));
      kickoff();
      event.preventDefault();
    };


    const onTouchStart = (event) => {
      if (isFinePointer || saveDataMode || event.touches.length !== 1) return;
      if (isOverlayActive()) return;
      touchY = event.touches[0].clientY;
      touchX = event.touches[0].clientX;
    };

    const onTouchMove = (event) => {
      if (isFinePointer || saveDataMode || event.touches.length !== 1) return;
      if (isOverlayActive()) return;
      if (isEditableTarget(event.target)) return;
      if (touchY == null) { touchY = event.touches[0].clientY; return; }

      const nextY = event.touches[0].clientY;
      const nextX = event.touches[0].clientX;
      const rawDeltaY = touchY - nextY;
      const rawDeltaX = (touchX ?? nextX) - nextX;
      touchY = nextY;
      touchX = nextX;

      if (!Number.isFinite(rawDeltaY) || Math.abs(rawDeltaY) < 0.8) return;
      const horizontalIntent = Math.abs(rawDeltaX) > Math.abs(rawDeltaY) * 1.1;
      if (horizontalIntent) return;
      if (hasScrollableParent(event.target, { deltaY: rawDeltaY, axis: 'y' })) return;

      const tune = getScrollTuning();
      const mobileCap = 15 + tune.mobileDeltaCap * 10;
      const mobileMult = 1 + (tune.mobileMultiplier * 0.22);
      const limitedDelta = Math.max(-mobileCap, Math.min(mobileCap, rawDeltaY)) * mobileMult;
      target = Math.min(maxScrollY(), Math.max(0, target + limitedDelta));
      kickoff();
      event.preventDefault();
    };

    const onTouchEnd = () => { touchY = null; touchX = null; };

    const enforceVirtualScroll = () => {
      if (isOverlayActive()) return;
      if (Math.abs(window.scrollY - current) > 0.75) {
        window.scrollTo(0, current);
      }
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('touchcancel', onTouchEnd, { passive: true });
    window.addEventListener('scroll', enforceVirtualScroll, { passive: true });
    const onResize = () => { target = Math.min(target, maxScrollY()); current = Math.min(current, maxScrollY()); };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);
      window.removeEventListener('scroll', enforceVirtualScroll);
      window.removeEventListener('resize', onResize);
      window.cancelAnimationFrame(rafId);
      html.style.overscrollBehaviorY = prevHtmlOverscroll;
      document.body.style.overscrollBehaviorY = prevBodyOverscroll;
      html.classList.remove('lenis-ready');
    };
  }, []);
};
