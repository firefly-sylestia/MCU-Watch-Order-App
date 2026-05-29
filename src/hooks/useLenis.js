import { useEffect } from 'react';

/**
 * Keep scrolling native.
 *
 * The previous runtime implemented custom wheel/touch smoothing with non-passive
 * listeners and a requestAnimationFrame scroll loop. That made long timelines
 * janky because every wheel event competed with React row virtualization,
 * poster decoding, and IntersectionObserver work. Modern browsers already ship
 * fast compositor-backed scrolling, so this hook now only exposes the legacy
 * readiness class for CSS compatibility and lets the browser handle input.
 */
export const useLenis = () => {
  useEffect(() => {
    if (typeof document === 'undefined') return undefined;
    const html = document.documentElement;
    html.classList.add('lenis-ready', 'native-scroll-ready');
    return () => {
      html.classList.remove('lenis-ready', 'native-scroll-ready');
    };
  }, []);
};
