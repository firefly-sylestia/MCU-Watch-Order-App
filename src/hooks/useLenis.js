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

    // Native browser scrolling is preferred for this app's long, media-heavy lists.
    // It preserves platform momentum/trackpad physics, minimizes jank under load,
    // and avoids JS scroll loops competing with image/video rendering.
    const shouldEnableCustomScroll = window.__enableCustomScroll === true;
    if (!shouldEnableCustomScroll) return undefined;

    const html = document.documentElement;
    html.classList.add('lenis-ready');

    let touchY = null;
    let touchX = null;

    const isOverlayActive = () => Boolean(window.__overlayActive);

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

      // Minimal normalization only: convert line/page-wheel units to pixel-ish units,
      // then rely on native scrollBy behavior (no RAF-follow loop / no scrollTo loop).
      event.preventDefault();
      window.scrollBy({ top: deltaY, left: 0, behavior: 'auto' });
    };

    const onTouchStart = (event) => {
      if (event.touches.length !== 1) return;
      if (isOverlayActive()) return;
      touchY = event.touches[0].clientY;
      touchX = event.touches[0].clientX;
    };

    const onTouchMove = (event) => {
      if (event.touches.length !== 1) return;
      if (isOverlayActive()) return;
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
    };

    const onTouchEnd = () => {
      touchY = null;
      touchX = null;
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
      html.classList.remove('lenis-ready');
    };
  }, []);
};
