import { useEffect } from 'react';

const isEditableTarget = (target) => {
  if (!(target instanceof Element)) return false;
  const tag = target.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.closest('[contenteditable="true"]');
};

const hasScrollableParent = (target, deltaY, deltaX = 0) => {
  if (!(target instanceof Element)) return false;
  let node = target;
  while (node && node !== document.body) {
    const style = window.getComputedStyle(node);
    const overflowY = style.overflowY;
    const overflowX = style.overflowX;
    const canScroll = (overflowY === 'auto' || overflowY === 'scroll') && node.scrollHeight > node.clientHeight + 1;
    const canScrollX = (overflowX === 'auto' || overflowX === 'scroll') && node.scrollWidth > node.clientWidth + 1;
    if (canScroll) {
      const atTop = node.scrollTop <= 0;
      const atBottom = node.scrollTop + node.clientHeight >= node.scrollHeight - 1;
      if ((deltaY < 0 && !atTop) || (deltaY > 0 && !atBottom)) return true;
    }
    if (canScrollX && Math.abs(deltaX) >= Math.abs(deltaY)) {
      const atLeft = node.scrollLeft <= 0;
      const atRight = node.scrollLeft + node.clientWidth >= node.scrollWidth - 1;
      if ((deltaX < 0 && !atLeft) || (deltaX > 0 && !atRight)) return true;
    }
    if (canScrollX && Math.abs(deltaX) > 0) return true;
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
    let touchY = null;

    const maxScrollY = () => Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const kickoff = () => { if (!rafId) rafId = window.requestAnimationFrame(step); };

    const step = () => {
      const delta = target - current;
      if (Math.abs(delta) <= 0.2) {
        current = target;
        rafId = 0;
        return;
      }
      current += delta * (isFinePointer ? 0.14 : 0.19);
      if (Math.abs(delta) <= 0.35) current = target;
      window.scrollTo({ top: current, left: 0, behavior: 'auto' });
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
      if (isEditableTarget(event.target)) return;
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      const deltaY = normalizeDelta(event);
      const deltaX = event.deltaX;
      if (!Number.isFinite(deltaY) || deltaY === 0) return;
      if (hasScrollableParent(event.target, deltaY, deltaX)) return;

      const tune = getScrollTuning();
      const deskCap = 30 + tune.desktopDeltaCap * 10;
      const deskMult = 0.8 + (tune.desktopMultiplier * 0.2);
      const limitedDelta = Math.max(-deskCap, Math.min(deskCap, deltaY)) * deskMult;
      target = Math.min(maxScrollY(), Math.max(0, target + limitedDelta));
      kickoff();
      event.preventDefault();
    };

    const onTouchStart = (event) => {
      if (isFinePointer || event.touches.length !== 1) return;
      touchY = event.touches[0].clientY;
    };

    const onTouchMove = (event) => {
      if (isFinePointer || event.touches.length !== 1) return;
      if (isEditableTarget(event.target)) return;
      if (touchY == null) { touchY = event.touches[0].clientY; return; }

      const nextY = event.touches[0].clientY;
      const rawDelta = touchY - nextY;
      touchY = nextY;
      if (!Number.isFinite(rawDelta) || rawDelta === 0) return;
      if (hasScrollableParent(event.target, rawDelta, 0)) return;

      const tune = getScrollTuning();
      const mobileCap = 15 + tune.mobileDeltaCap * 10;
      const mobileMult = 0.85 + (tune.mobileMultiplier * 0.2);
      const limitedDelta = Math.max(-mobileCap, Math.min(mobileCap, rawDelta)) * mobileMult;
      target = Math.min(maxScrollY(), Math.max(0, target + limitedDelta));
      kickoff();
      event.preventDefault();
    };

    const onTouchEnd = () => { touchY = null; };
    const syncToNativeScroll = () => {
      if (rafId) return;
      current = window.scrollY;
      target = window.scrollY;
    };
    const stabilizeScrollState = () => {
      if (rafId) return;
      const y = window.scrollY;
      current = y;
      target = y;
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('touchcancel', onTouchEnd, { passive: true });
    window.addEventListener('scroll', syncToNativeScroll, { passive: true });
    window.addEventListener('pageshow', stabilizeScrollState, { passive: true });
    window.addEventListener('load', stabilizeScrollState, { passive: true });
    const onResize = () => { target = Math.min(target, maxScrollY()); current = Math.min(current, maxScrollY()); };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);
      window.removeEventListener('scroll', syncToNativeScroll);
      window.removeEventListener('pageshow', stabilizeScrollState);
      window.removeEventListener('load', stabilizeScrollState);
      window.removeEventListener('resize', onResize);
      window.cancelAnimationFrame(rafId);
      html.classList.remove('lenis-ready');
    };
  }, []);
};
