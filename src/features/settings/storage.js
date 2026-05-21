export const readUiState = ({ cacheKey, defaults, validators }) => {
  if (typeof window === 'undefined') return defaults;
  try {
    const raw = window.localStorage.getItem(cacheKey);
    if (!raw) return defaults;
    const saved = JSON.parse(raw);
    return validators(saved, defaults);
  } catch {
    return defaults;
  }
};
