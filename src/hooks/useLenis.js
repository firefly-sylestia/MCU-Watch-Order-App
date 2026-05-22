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
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const html = document.documentElement;
    html.classList.add('lenis-ready');

    let touchY = null;
    let touchX = null;
    let targetY = window.scrollY;
    let rafId = null;

    const isOverlayActive = () => Boolean(window.__overlayActive);
    const clampTarget = () => Math.max(0, Math.min(targetY, document.documentElement.scrollHeight - window.innerHeight));

    const tick = () => {
      const currentY = window.scrollY;
      const diff = clampTarget() - currentY;
      if (Math.abs(diff) < 0.35) {
        window.scrollTo(0, clampTarget());
        rafId = null;
        return;
      }
      window.scrollTo(0, currentY + diff * 0.18);
      rafId = window.requestAnimationFrame(tick);
    };

    const queueScroll = (deltaY) => {
      targetY += deltaY;
      if (rafId == null) rafId = window.requestAnimationFrame(tick);
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
      queueScroll(deltaY * 0.96);
    };

    const onTouchStart = (event) => {
      if (event.touches.length !== 1 || isOverlayActive()) return;
      touchY = event.touches[0].clientY;
      touchX = event.touches[0].clientX;
      targetY = window.scrollY;
    };

    const onTouchMove = (event) => {
      if (event.touches.length !== 1 || isOverlayActive()) return;
      if (isEditableTarget(event.target)) return;

      if (touchY == null) {
        touchY = event.touches[0].clientY;
        touchX = event.touches[0].clientX;
        return;
      }

      const nextY = event.touches[0].clientY;
      const nextX = event.touches[0].clientX;
      const deltaY = touchY - nextY;
      const deltaX = (touchX ?? nextX) - nextX;
      touchY = nextY;
      touchX = nextX;

      if (!Number.isFinite(deltaY) || Math.abs(deltaY) < 0.8) return;
      const horizontalIntent = Math.abs(deltaX) > Math.abs(deltaY) * 1.1;
      if (horizontalIntent) return;
      if (hasScrollableParent(event.target, { deltaY, axis: 'y' })) return;

      event.preventDefault();
      window.scrollBy({ top: deltaY, left: 0, behavior: 'auto' });
      targetY = window.scrollY;
    };

    const onTouchEnd = () => {
      touchY = null;
      touchX = null;
      targetY = window.scrollY;
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('touchcancel', onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);
      if (rafId != null) window.cancelAnimationFrame(rafId);
      html.classList.remove('lenis-ready');
    };
  }, []);
};
