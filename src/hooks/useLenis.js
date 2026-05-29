import { useEffect } from 'react';

/**
 * Keep the historical hook name, but let the browser handle scrolling natively.
 * The previous implementation intercepted wheel/touch input and drove a custom
 * requestAnimationFrame loop. That felt cinematic locally, but on the Vercel web
 * app it could fall behind React rendering and make the page feel laggy.
 */
export const useLenis = () => {
  useEffect(() => {
    if (typeof document === 'undefined') return undefined;

    const html = document.documentElement;
    html.classList.remove('lenis-ready');
    html.classList.add('native-scroll-ready');

    return () => {
      html.classList.remove('native-scroll-ready');
    };
  }, []);
};
