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

const normalizeDeltaY = (event) => {
  if (event.deltaMode === 1) return event.deltaY * 16;
  if (event.deltaMode === 2) return event.deltaY * window.innerHeight;
  return event.deltaY;
};

export const useLenis = () => {
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return undefined;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
    const narrowViewport = window.matchMedia('(max-width: 900px)').matches;
    const slowUpdate = window.matchMedia('(update: slow)').matches;
    if (prefersReducedMotion || coarsePointer || narrowViewport || slowUpdate) return undefined;

    const html = document.documentElement;
    html.classList.add('lenis-ready');

    let momentumVelocity = 0;
    let targetY = window.scrollY;
    let rafId = null;

    const isOverlayActive = () => Boolean(window.__overlayActive);
    const clamp = (value) => Math.max(0, Math.min(value, document.documentElement.scrollHeight - window.innerHeight));

    const startLoop = () => {
      if (rafId == null) rafId = window.requestAnimationFrame(tick);
    };

    const tick = () => {
      const currentY = window.scrollY;
      targetY = clamp(targetY + momentumVelocity);
      momentumVelocity *= 0.92;

      const diff = targetY - currentY;
      const easing = Math.abs(diff) > 48 ? 0.2 : 0.16;
      const nextY = currentY + diff * easing;

      window.scrollTo(0, nextY);

      const closeEnough = Math.abs(diff) < 0.45;
      const almostStill = Math.abs(momentumVelocity) < 0.08;
      if (closeEnough && almostStill) {
        window.scrollTo(0, targetY);
        rafId = null;
        return;
      }

      rafId = window.requestAnimationFrame(tick);
    };

    const queueScroll = (deltaY) => {
      targetY = clamp(targetY + deltaY);
      startLoop();
    };

    const onWheel = (event) => {
      if (event.defaultPrevented || event.ctrlKey) return;
      if (isOverlayActive()) return;
      if (isEditableTarget(event.target)) return;

      const horizontalIntent = Math.abs(event.deltaX) > Math.abs(event.deltaY) * 1.1;
      const deltaY = normalizeDeltaY(event);

      if (horizontalIntent) {
        if (hasScrollableParent(event.target, { deltaX: event.deltaX, axis: 'x' })) return;
        return;
      }

      if (!Number.isFinite(deltaY) || deltaY === 0) return;
      if (hasScrollableParent(event.target, { deltaY, axis: 'y' })) return;

      event.preventDefault();
      momentumVelocity = 0;
      queueScroll(deltaY * 0.98);
    };


    window.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      window.removeEventListener('wheel', onWheel);
      if (rafId != null) window.cancelAnimationFrame(rafId);
      html.classList.remove('lenis-ready');
    };
  }, []);
};
