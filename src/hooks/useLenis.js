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

    const shell = document.querySelector('main.app-scroll-shell');
    if (!(shell instanceof HTMLElement)) return undefined;

    const html = document.documentElement;
    const body = document.body;
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    const saveDataMode = navigator?.connection?.saveData === true;

    const prev = {
      htmlOverflow: html.style.overflow,
      bodyOverflow: body.style.overflow,
      htmlOverscrollY: html.style.overscrollBehaviorY,
      bodyOverscrollY: body.style.overscrollBehaviorY,
      bodyTouchAction: body.style.touchAction,
      shellTransform: shell.style.transform,
      shellWillChange: shell.style.willChange,
      shellTransition: shell.style.transition,
    };

    html.classList.add('lenis-ready');
    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    html.style.overscrollBehaviorY = 'none';
    body.style.overscrollBehaviorY = 'none';
    body.style.touchAction = 'none';

    shell.style.willChange = 'transform';
    shell.style.transition = 'none';

    let current = 0;
    let target = 0;
    let maxY = 0;
    let rafId = 0;
    let lastTs = 0;

    let touchY = null;
    let touchX = null;

    const isOverlayActive = () => Boolean(window.__overlayActive);

    const clampTarget = (value) => Math.max(0, Math.min(maxY, value));

    const refreshBounds = () => {
      const fullHeight = Math.max(shell.scrollHeight, shell.offsetHeight);
      maxY = Math.max(0, fullHeight - window.innerHeight);
      target = clampTarget(target);
      current = clampTarget(current);
    };

    const render = () => {
      shell.style.transform = `translate3d(0, ${-current.toFixed(3)}px, 0)`;
    };

    const kickoff = () => { if (!rafId) rafId = window.requestAnimationFrame(step); };

    const step = (ts) => {
      const dt = lastTs ? Math.min(40, Math.max(8, ts - lastTs)) : 16;
      lastTs = ts;
      const response = isFinePointer ? 0.22 : 0.28;
      const lerp = 1 - Math.pow(1 - response, dt / 16.67);
      current += (target - current) * lerp;

      if (Math.abs(target - current) <= 0.15) current = target;
      render();

      if (Math.abs(target - current) > 0.15) rafId = window.requestAnimationFrame(step);
      else { rafId = 0; lastTs = 0; }
    };

    const pushDelta = (delta) => {
      if (!Number.isFinite(delta) || delta === 0) return;
      target = clampTarget(target + delta);
      kickoff();
    };

    const normalizeWheel = (event) => {
      if (event.deltaMode === 1) return event.deltaY * 16;
      if (event.deltaMode === 2) return event.deltaY * window.innerHeight;
      return event.deltaY;
    };

    const onWheel = (event) => {
      if (!isFinePointer || saveDataMode) return;
      if (event.defaultPrevented || event.ctrlKey || isOverlayActive()) return;
      if (isEditableTarget(event.target)) return;

      const horizontalIntent = Math.abs(event.deltaX) > Math.abs(event.deltaY) * 1.12;
      if (horizontalIntent) {
        if (hasScrollableParent(event.target, { deltaX: event.deltaX, axis: 'x' })) return;
        return;
      }

      const deltaY = normalizeWheel(event);
      if (hasScrollableParent(event.target, { deltaY, axis: 'y' })) return;

      const tune = getScrollTuning();
      const cap = 46 + tune.desktopDeltaCap * 10;
      const mult = 1.18 + (tune.desktopMultiplier * 0.22);
      const next = Math.max(-cap, Math.min(cap, deltaY)) * mult;
      pushDelta(next);
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
      const deltaY = touchY - nextY;
      const deltaX = (touchX ?? nextX) - nextX;
      touchY = nextY;
      touchX = nextX;

      if (!Number.isFinite(deltaY) || Math.abs(deltaY) < 0.6) return;
      const horizontalIntent = Math.abs(deltaX) > Math.abs(deltaY) * 1.1;
      if (horizontalIntent || hasScrollableParent(event.target, { deltaY, axis: 'y' })) return;

      const tune = getScrollTuning();
      const cap = 24 + tune.mobileDeltaCap * 9;
      const mult = 1.12 + (tune.mobileMultiplier * 0.19);
      const next = Math.max(-cap, Math.min(cap, deltaY)) * mult;
      pushDelta(next);
      event.preventDefault();
    };

    const onTouchEnd = () => { touchY = null; touchX = null; };

    const onKeyDown = (event) => {
      if (isOverlayActive() || isEditableTarget(event.target)) return;
      const pageJump = Math.max(240, window.innerHeight * 0.88);
      if (event.key === 'ArrowDown') { pushDelta(110); event.preventDefault(); }
      else if (event.key === 'ArrowUp') { pushDelta(-110); event.preventDefault(); }
      else if (event.key === 'PageDown' || event.key === ' ') { pushDelta(pageJump); event.preventDefault(); }
      else if (event.key === 'PageUp') { pushDelta(-pageJump); event.preventDefault(); }
      else if (event.key === 'Home') { target = 0; kickoff(); event.preventDefault(); }
      else if (event.key === 'End') { target = maxY; kickoff(); event.preventDefault(); }
    };

    const resizeObserver = new ResizeObserver(() => {
      refreshBounds();
      render();
    });
    resizeObserver.observe(shell);

    const onResize = () => {
      refreshBounds();
      render();
    };

    refreshBounds();
    render();

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('touchcancel', onTouchEnd, { passive: true });
    window.addEventListener('keydown', onKeyDown, { passive: false });
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', onResize);
      resizeObserver.disconnect();
      window.cancelAnimationFrame(rafId);

      html.style.overflow = prev.htmlOverflow;
      body.style.overflow = prev.bodyOverflow;
      html.style.overscrollBehaviorY = prev.htmlOverscrollY;
      body.style.overscrollBehaviorY = prev.bodyOverscrollY;
      body.style.touchAction = prev.bodyTouchAction;
      shell.style.transform = prev.shellTransform;
      shell.style.willChange = prev.shellWillChange;
      shell.style.transition = prev.shellTransition;
      html.classList.remove('lenis-ready');
    };
  }, []);
};
