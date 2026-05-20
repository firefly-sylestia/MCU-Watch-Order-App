import { useEffect, useMemo, useState } from 'react';

export function useResponsiveLayout() {
  const [viewport, setViewport] = useState(() => {
    if (typeof window === 'undefined') return { width: 0, dpr: 1, coarsePointer: false };
    return {
      width: window.innerWidth,
      dpr: window.devicePixelRatio || 1,
      coarsePointer: window.matchMedia('(pointer: coarse)').matches,
    };
  });

  useEffect(() => {
    const pointerQuery = window.matchMedia('(pointer: coarse)');
    const onResize = () => {
      setViewport({
        width: window.innerWidth,
        dpr: window.devicePixelRatio || 1,
        coarsePointer: pointerQuery.matches,
      });
    };
    onResize();
    window.addEventListener('resize', onResize);
    pointerQuery.addEventListener?.('change', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      pointerQuery.removeEventListener?.('change', onResize);
    };
  }, []);

  const isDesktopViewport = useMemo(
    () => viewport.width >= 1024 && !viewport.coarsePointer,
    [viewport.width, viewport.coarsePointer]
  );

  return { isDesktopViewport, devicePixelRatio: viewport.dpr, isCoarsePointer: viewport.coarsePointer };
}
