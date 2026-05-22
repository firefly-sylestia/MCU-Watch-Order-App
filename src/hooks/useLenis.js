import { useEffect } from 'react';

const LENIS_SCRIPT_ID = 'lenis-runtime-script';
const LENIS_SCRIPT_SOURCES = [
  'https://unpkg.com/lenis@1.3.23/dist/lenis.min.js',
  'https://cdn.jsdelivr.net/npm/lenis@1.3.23/dist/lenis.min.js',
];

const isEditableTarget = (target) => {
  if (!(target instanceof Element)) return false;
  const tag = target.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || Boolean(target.closest('[contenteditable], [contenteditable="true"], [contenteditable="plaintext-only"]'));
};

const injectLenisScript = (src) => new Promise((resolve, reject) => {
  const script = document.createElement('script');
  script.id = LENIS_SCRIPT_ID;
  script.src = src;
  script.async = true;
  script.onload = () => resolve(window.Lenis);
  script.onerror = reject;
  document.head.appendChild(script);
});

const loadLenisScript = async () => {
  if (window.Lenis) return window.Lenis;

  const existing = document.getElementById(LENIS_SCRIPT_ID);
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener('load', () => resolve(window.Lenis), { once: true });
      existing.addEventListener('error', reject, { once: true });
    });
  }

  let lastError = null;
  for (const src of LENIS_SCRIPT_SOURCES) {
    try {
      const LenisCtor = await injectLenisScript(src);
      if (typeof LenisCtor === 'function') return LenisCtor;
    } catch (error) {
      lastError = error;
      const staleScript = document.getElementById(LENIS_SCRIPT_ID);
      staleScript?.remove();
    }
  }

  throw lastError || new Error('Unable to load Lenis runtime');
};

export const useLenis = () => {
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    let disposed = false;
    let lenis = null;
    const html = document.documentElement;
    html.classList.add('lenis-pending');

    const hardPrevent = (event) => {
      if (!lenis && !isEditableTarget(event.target)) event.preventDefault();
    };

    const handleOverlayToggle = () => {
      if (!lenis) return;
      if (window.__overlayActive) lenis.stop();
      else lenis.start();
    };

    loadLenisScript()
      .then((LenisCtor) => {
        if (disposed || typeof LenisCtor !== 'function') return;
        lenis = new LenisCtor({
          autoRaf: true,
          duration: 1.1,
          lerp: 0.09,
          smoothWheel: true,
          syncTouch: true,
          normalizeWheel: true,
          gestureOrientation: 'vertical',
          overscroll: false,
          wheelMultiplier: 0.92,
          touchMultiplier: 0.98,
          prevent: (node) => Boolean(node instanceof Element && node.closest('[data-lenis-prevent], .hero-carousel-track, .detail-card, .settings-menu')),
        });

        window.__lenis = lenis;
        html.classList.remove('lenis-pending');
        html.classList.add('lenis-ready');
        handleOverlayToggle();
      })
      .catch((error) => {
        console.error('Lenis is required but failed to initialize.', error);
      });

    window.addEventListener('wheel', hardPrevent, { passive: false });
    window.addEventListener('touchmove', hardPrevent, { passive: false });
    window.addEventListener('overlay:change', handleOverlayToggle);

    return () => {
      disposed = true;
      window.removeEventListener('wheel', hardPrevent);
      window.removeEventListener('touchmove', hardPrevent);
      window.removeEventListener('overlay:change', handleOverlayToggle);
      html.classList.remove('lenis-pending');
      html.classList.remove('lenis-ready');
      if (window.__lenis === lenis) delete window.__lenis;
      lenis?.destroy?.();
    };
  }, []);
};
