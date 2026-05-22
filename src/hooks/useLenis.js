import { useEffect } from 'react';

const LENIS_SCRIPT_ID = 'lenis-runtime-script';
const LENIS_SCRIPT_SOURCES = [
  'https://unpkg.com/lenis@1.3.23/dist/lenis.min.js',
  'https://cdn.jsdelivr.net/npm/lenis@1.3.23/dist/lenis.min.js',
];

const LENIS_PRESET_OPTIONS = {
  gentle: { duration: 1.35, lerp: 0.075, wheelMultiplier: 0.84, touchMultiplier: 0.88 },
  balanced: { duration: 1.1, lerp: 0.09, wheelMultiplier: 0.92, touchMultiplier: 0.98 },
  snappy: { duration: 0.86, lerp: 0.13, wheelMultiplier: 1.02, touchMultiplier: 1.04 },
};

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
    let activePreset = 'balanced';
    const html = document.documentElement;
    html.classList.add('lenis-pending');

    const hardPrevent = (event) => {
      if (!lenis && !isEditableTarget(event.target)) event.preventDefault();
    };

    const getRuntimeConfig = () => window.__lenisConfig || { preset: 'balanced', performanceMode: false };

    const buildLenisOptions = () => {
      const cfg = getRuntimeConfig();
      activePreset = LENIS_PRESET_OPTIONS[cfg.preset] ? cfg.preset : 'balanced';
      const preset = LENIS_PRESET_OPTIONS[activePreset];
      return {
        autoRaf: true,
        smoothWheel: true,
        syncTouch: !cfg.performanceMode,
        normalizeWheel: true,
        gestureOrientation: 'vertical',
        overscroll: false,
        ...preset,
        prevent: (node) => Boolean(node instanceof Element && node.closest('[data-lenis-prevent], .hero-carousel-track, .detail-card, .settings-menu')),
      };
    };

    const handleOverlayToggle = () => {
      if (!lenis) return;
      if (window.__overlayActive) lenis.stop();
      else lenis.start();
    };

    const handleLenisConfigChange = () => {
      if (!lenis) return;
      const prev = activePreset;
      const nextOptions = buildLenisOptions();
      const presetChanged = prev !== activePreset;
      Object.assign(lenis.options, nextOptions);
      if (presetChanged) {
        lenis.scrollTo(window.scrollY, { immediate: true });
      }
    };

    loadLenisScript()
      .then((LenisCtor) => {
        if (disposed || typeof LenisCtor !== 'function') return;
        lenis = new LenisCtor(buildLenisOptions());

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
    window.addEventListener('lenis:config-change', handleLenisConfigChange);

    return () => {
      disposed = true;
      window.removeEventListener('wheel', hardPrevent);
      window.removeEventListener('touchmove', hardPrevent);
      window.removeEventListener('overlay:change', handleOverlayToggle);
      window.removeEventListener('lenis:config-change', handleLenisConfigChange);
      html.classList.remove('lenis-pending');
      html.classList.remove('lenis-ready');
      if (window.__lenis === lenis) delete window.__lenis;
      lenis?.destroy?.();
    };
  }, []);
};
