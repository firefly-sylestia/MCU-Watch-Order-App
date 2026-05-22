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
    html.classList.add('lenis-ready');

    let current = window.scrollY;
    let target = window.scrollY;
    let rafId = 0;

    const maxScrollY = () => Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

    const step = () => {
      const delta = target - current;
      current += delta * 0.115;
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
      if (event.deltaMode === 1) return event.deltaY * 16; // lines
      if (event.deltaMode === 2) return event.deltaY * window.innerHeight; // pages
      return event.deltaY; // pixels
    };

    const onWheel = (event) => {
      if (event.defaultPrevented || event.ctrlKey) return;
      if (isEditableTarget(event.target)) return;

      // Let native scrolling handle nested scroll regions and horizontal carousels.
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;

      const deltaY = normalizeDelta(event);
      if (!Number.isFinite(deltaY) || deltaY === 0) return;
      if (hasScrollableParent(event.target, deltaY)) return;

      target = Math.min(maxScrollY(), Math.max(0, target + deltaY));
      kickoff();
      event.preventDefault();
    };

    const syncToNativeScroll = () => {
      if (rafId) return;
      current = window.scrollY;
      target = window.scrollY;
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('scroll', syncToNativeScroll, { passive: true });
    window.addEventListener('resize', () => {
      target = Math.min(target, maxScrollY());
      current = Math.min(current, maxScrollY());
    });

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('scroll', syncToNativeScroll);
      window.cancelAnimationFrame(rafId);
      html.classList.remove('lenis-ready');
    };
  }, []);
};
