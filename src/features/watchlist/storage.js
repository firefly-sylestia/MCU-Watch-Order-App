import { readStorageJSON, readStorageValue, removeStorageValue, safeLocalStorageSetItem, scheduleStorageWrite, pruneObject } from '../../utils/cacheStorage';

export { readStorageJSON, readStorageValue, removeStorageValue, safeLocalStorageSetItem, scheduleStorageWrite, pruneObject };

export const readLegacySession = (key = 'mcu-v7') => {
  try {
    return JSON.parse(localStorage.getItem(key) || 'null');
  } catch {
    return null;
  }
};

export const writeLegacySession = (data, key = 'mcu-v7') => {
  localStorage.setItem(key, JSON.stringify(data));
};
