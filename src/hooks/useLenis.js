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
    desktopDeltaCap: clamp10(t.desktopDeltaCap, 9),
    mobileMultiplier: clamp10(t.mobileMultiplier, 7),
    mobileDeltaCap: clamp10(t.mobileDeltaCap, 8),
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
    let velocity = 0;
    let rafId = 0;
    let lastTs = 0;
    let internalScrollWrite = false;
    let touchY = null;
    let touchX = null;

    const maxScrollY = () => Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const clampY = (y) => Math.min(maxScrollY(), Math.max(0, y));
    const isOverlayActive = () => Boolean(window.__overlayActive);

    const kickoff = () => { if (!rafId) rafId = window.requestAnimationFrame(step); };

    const step = (ts) => {
      const dt = lastTs ? Math.min(34, Math.max(8, ts - lastTs)) : 16;
      lastTs = ts;

      const stiffness = isFinePointer ? 0.13 : 0.16;
      const damping = isFinePointer ? 0.8 : 0.76;
      const accel = (target - current) * stiffness;
      velocity = (velocity + accel) * damping;
      current += velocity * (dt / 16.67);

      current = clampY(current);
      if ((current <= 0 || current >= maxScrollY()) && Math.abs(velocity) < 0.05) velocity = 0;

      const done = Math.abs(target - current) < 0.25 && Math.abs(velocity) < 0.1;
      if (done) {
        current = target;
        velocity = 0;
      }

      internalScrollWrite = true;
      window.scrollTo(0, current);
      window.requestAnimationFrame(() => { internalScrollWrite = false; });

      if (!done) rafId = window.requestAnimationFrame(step);
      else { rafId = 0; lastTs = 0; }
    };

    const normalizeDelta = (event) => {
      if (event.deltaMode === 1) return event.deltaY * 16;
      if (event.deltaMode === 2) return event.deltaY * window.innerHeight;
      return event.deltaY;
    };

    const onWheel = (event) => {
      if (!isFinePointer || saveDataMode) return;
      if (event.defaultPrevented || event.ctrlKey || isOverlayActive()) return;
      if (isEditableTarget(event.target)) return;

      const horizontalIntent = Math.abs(event.deltaX) > Math.abs(event.deltaY) * 1.1;
      if (horizontalIntent) {
        if (hasScrollableParent(event.target, { deltaX: event.deltaX, axis: 'x' })) return;
        return;
      }

      const deltaY = normalizeDelta(event);
      if (!Number.isFinite(deltaY) || deltaY === 0) return;
      if (hasScrollableParent(event.target, { deltaY, axis: 'y' })) return;

      const tune = getScrollTuning();
      const cap = 52 + tune.desktopDeltaCap * 10;
      const mult = 1.22 + (tune.desktopMultiplier * 0.22);
      const next = Math.max(-cap, Math.min(cap, deltaY)) * mult;
      target = clampY(target + next);
      kickoff();
      event.preventDefault();
    };

    const onTouchStart = (event) => {
      if (isFinePointer || saveDataMode || event.touches.length !== 1 || isOverlayActive()) return;
      touchY = event.touches[0].clientY;
      touchX = event.touches[0].clientX;
    };

    const onTouchMove = (event) => {
      if (isFinePointer || saveDataMode || event.touches.length !== 1 || isOverlayActive()) return;
      if (isEditableTarget(event.target)) return;
      if (touchY == null) { touchY = event.touches[0].clientY; return; }

      const nextY = event.touches[0].clientY;
      const nextX = event.touches[0].clientX;
      const rawDeltaY = touchY - nextY;
      const rawDeltaX = (touchX ?? nextX) - nextX;
      touchY = nextY;
      touchX = nextX;

      if (!Number.isFinite(rawDeltaY) || Math.abs(rawDeltaY) < 0.6) return;
      const horizontalIntent = Math.abs(rawDeltaX) > Math.abs(rawDeltaY) * 1.08;
      if (horizontalIntent) return;
      if (hasScrollableParent(event.target, { deltaY: rawDeltaY, axis: 'y' })) return;

      const tune = getScrollTuning();
      const cap = 28 + tune.mobileDeltaCap * 9;
      const mult = 1.1 + (tune.mobileMultiplier * 0.19);
      const next = Math.max(-cap, Math.min(cap, rawDeltaY)) * mult;
      target = clampY(target + next);
      kickoff();
      event.preventDefault();
    };

    const onTouchEnd = () => { touchY = null; touchX = null; };

    const onNativeScroll = () => {
      if (isOverlayActive() || internalScrollWrite || rafId) return;
      current = window.scrollY;
      target = current;
      velocity = 0;
    };

    const onResize = () => {
      current = clampY(current);
      target = clampY(target);
      internalScrollWrite = true;
      window.scrollTo(0, current);
      window.requestAnimationFrame(() => { internalScrollWrite = false; });
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('touchcancel', onTouchEnd, { passive: true });
    window.addEventListener('scroll', onNativeScroll, { passive: true });
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);
      window.removeEventListener('scroll', onNativeScroll);
      window.removeEventListener('resize', onResize);
      window.cancelAnimationFrame(rafId);
      html.style.overscrollBehaviorY = prevHtmlOverscroll;
      document.body.style.overscrollBehaviorY = prevBodyOverscroll;
      html.classList.remove('lenis-ready');
    };
  }, []);
};
