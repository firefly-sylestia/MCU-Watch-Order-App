import { useCallback } from 'react';

export function usePerfMark() {
  return useCallback(async (name, fn) => {
    const start = `${name}:start`;
    const end = `${name}:end`;
    performance.mark(start);
    try {
      return await fn();
    } finally {
      performance.mark(end);
      performance.measure(name, start, end);
    }
  }, []);
}
