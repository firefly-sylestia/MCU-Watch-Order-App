import { useEffect } from 'react';

const isEditableTarget = (target) => {
  if (!(target instanceof Element)) return false;
  const tag = target.tagName;
  return (
    tag === 'INPUT'
    || tag === 'TEXTAREA'
    || tag === 'SELECT'
    || Boolean(target.closest('[contenteditable], [contenteditable="true"], [contenteditable="plaintext-only"]'))
  );
};

const loadLenisModule = async () => {
  const dynamicImport = new Function('m', 'return import(m)');
  const mod = await dynamicImport('lenis');
  return mod?.default || mod?.Lenis || null;
};

export const useLenis = () => {
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const root = document.documentElement;
    root.classList.add('lenis-ready');

    let lenis = null;
    let disposed = false;

    loadLenisModule()
      .then((Lenis) => {
        if (!Lenis || disposed) return;
        lenis = new Lenis({
          autoRaf: true,
          smoothWheel: true,
          syncTouch: true,
          touchInertiaMultiplier: 24,
          duration: 1.05,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          wheelMultiplier: 1,
          prevent: (node) => {
            if (!(node instanceof Element)) return false;
            if (window.__overlayActive) return true;
            if (isEditableTarget(node)) return true;
            return Boolean(node.closest('[data-native-scroll="true"], [data-lenis-prevent], .lenis-prevent'));
          },
        });
      })
      .catch(() => {
        root.classList.remove('lenis-ready');
      });

    return () => {
      disposed = true;
      lenis?.destroy?.();
      root.classList.remove('lenis-ready');
    };
  }, []);
};
