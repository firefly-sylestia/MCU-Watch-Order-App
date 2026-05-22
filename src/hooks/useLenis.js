import { useEffect } from 'react';

const LENIS_SCRIPT_ID = 'lenis-runtime-script';
const LENIS_SCRIPT_SRC = 'https://cdn.jsdelivr.net/npm/lenis@1.3.23/dist/lenis.min.js';

const isEditableTarget = (target) => {
  if (!(target instanceof Element)) return false;
  const tag = target.tagName;
  return (
    tag === 'INPUT' ||
    tag === 'TEXTAREA' ||
    tag === 'SELECT' ||
    Boolean(target.closest('[contenteditable], [contenteditable="true"], [contenteditable="plaintext-only"]'))
  );
};

const loadLenisScript = () => new Promise((resolve, reject) => {
  if (window.Lenis) {
    resolve(window.Lenis);
    return;
  }

  const existing = document.getElementById(LENIS_SCRIPT_ID);
  if (existing) {
    existing.addEventListener('load', () => resolve(window.Lenis), { once: true });
    existing.addEventListener('error', reject, { once: true });
    return;
  }

  const script = document.createElement('script');
  script.id = LENIS_SCRIPT_ID;
  script.src = LENIS_SCRIPT_SRC;
  script.async = true;
  script.onload = () => resolve(window.Lenis);
  script.onerror = reject;
  document.head.appendChild(script);
});

export const useLenis = () => {
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    let disposed = false;
    let lenis = null;
    const html = document.documentElement;

    const handleOverlayToggle = () => {
      if (!lenis) return;
      if (window.__overlayActive) lenis.stop();
      else lenis.start();
    };

    const onFocusIn = (event) => {
      if (lenis && isEditableTarget(event.target)) lenis.stop();
    };

    const onFocusOut = () => {
      if (lenis && !window.__overlayActive) lenis.start();
    };

    loadLenisScript()
      .then((LenisCtor) => {
        if (disposed || typeof LenisCtor !== 'function') return;

        lenis = new LenisCtor({
          autoRaf: true,
          duration: 1.05,
          smoothWheel: true,
          syncTouch: true,
          normalizeWheel: true,
          gestureOrientation: 'vertical',
          overscroll: false,
          lerp: 0.12,
          prevent: (node) => {
            if (!(node instanceof Element)) return false;
            if (isEditableTarget(node)) return true;
            return Boolean(node.closest('[data-lenis-prevent], .hero-carousel-track, .detail-card, .settings-menu'));
          },
        });

        window.__lenis = lenis;
        html.classList.add('lenis-ready');
        handleOverlayToggle();
      })
      .catch((error) => {
        console.warn('Lenis failed to initialize, continuing with native scrolling.', error);
      });

    window.addEventListener('overlay:change', handleOverlayToggle);
    window.addEventListener('focusin', onFocusIn);
    window.addEventListener('focusout', onFocusOut);

    return () => {
      disposed = true;
      window.removeEventListener('overlay:change', handleOverlayToggle);
      window.removeEventListener('focusin', onFocusIn);
      window.removeEventListener('focusout', onFocusOut);
      if (window.__lenis && window.__lenis === lenis) delete window.__lenis;
      html.classList.remove('lenis-ready');
      lenis?.destroy?.();
    };
  }, []);
};
