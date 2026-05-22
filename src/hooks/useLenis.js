import { useEffect } from 'react';

const isEditableTarget = (target) => {
  if (!(target instanceof Element)) return false;
  const tag = target.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.closest('[contenteditable="true"]');
};

const hasScrollableParent = (target, deltaY) => {
  if (!(target instanceof Element)) return false;
  let node = target;
  while (node && node !== document.body) {
    const style = window.getComputedStyle(node);
    const overflowY = style.overflowY;
    const canScroll = (overflowY === 'auto' || overflowY === 'scroll') && node.scrollHeight > node.clientHeight + 1;
    if (canScroll) {
      const atTop = node.scrollTop <= 0;
      const atBottom = node.scrollTop + node.clientHeight >= node.scrollHeight - 1;
      if ((deltaY < 0 && !atTop) || (deltaY > 0 && !atBottom)) return true;
    }
    node = node.parentElement;
  }
  return false;
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

    const step = () => {
      const delta = target - current;
      current += delta * (isFinePointer ? 0.115 : 0.16);
      if (Math.abs(delta) <= 0.35) current = target;
      window.scrollTo(0, current);
      if (Math.abs(target - current) > 0.35) {
        rafId = window.requestAnimationFrame(step);
      } else {
        rafId = 0;
      }
    };

    const kickoff = () => {
      if (!rafId) rafId = window.requestAnimationFrame(step);
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
      if (!Number.isFinite(deltaY) || deltaY === 0) return;
      if (hasScrollableParent(event.target, deltaY)) return;

      // Desktop speed governor.
      const limitedDelta = Math.max(-86, Math.min(86, deltaY));
      target = Math.min(maxScrollY(), Math.max(0, target + limitedDelta));
      kickoff();
      event.preventDefault();
    };

    const onTouchStart = (event) => {
      if (isFinePointer) return;
      if (event.touches.length !== 1) return;
      touchY = event.touches[0].clientY;
    };

    const onTouchMove = (event) => {
      if (isFinePointer) return;
      if (event.touches.length !== 1) return;
      if (isEditableTarget(event.target)) return;
      if (touchY == null) {
        touchY = event.touches[0].clientY;
        return;
      }
      const nextY = event.touches[0].clientY;
      const rawDelta = touchY - nextY;
      touchY = nextY;
      if (!Number.isFinite(rawDelta) || rawDelta === 0) return;
      if (hasScrollableParent(event.target, rawDelta)) return;

      // Mobile speed governor: cap fast flick deltas for steadier scroll.
      const limitedDelta = Math.max(-38, Math.min(38, rawDelta)) * 0.92;
      target = Math.min(maxScrollY(), Math.max(0, target + limitedDelta));
      kickoff();
      event.preventDefault();
    };

    const onTouchEnd = () => {
      touchY = null;
    };

    const syncToNativeScroll = () => {
      if (rafId) return;
      current = window.scrollY;
      target = window.scrollY;
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('touchcancel', onTouchEnd, { passive: true });
    window.addEventListener('scroll', syncToNativeScroll, { passive: true });

    const onResize = () => {
      target = Math.min(target, maxScrollY());
      current = Math.min(current, maxScrollY());
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);
      window.removeEventListener('scroll', syncToNativeScroll);
      window.removeEventListener('resize', onResize);
      window.cancelAnimationFrame(rafId);
      html.classList.remove('lenis-ready');
    };
  }, []);
};
