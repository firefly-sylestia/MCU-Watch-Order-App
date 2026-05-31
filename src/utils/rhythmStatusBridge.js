import { Capacitor, registerPlugin } from '@capacitor/core';

const RhythmStatus = registerPlugin('RhythmStatus');
const isNativeRhythmAvailable = () => Capacitor.isNativePlatform?.() && Boolean(RhythmStatus);

export const syncRhythmStatuses = async (items = []) => {
  if (!isNativeRhythmAvailable()) return false;

  await Promise.all(items.map(item => {
    if (!item.status || item.status === 'unwatched') {
      return RhythmStatus.clearStatus({ titleId: item.id });
    }

    return RhythmStatus.saveStatus({
      titleId: item.id,
      status: item.status,
      metadata: {
        watchedDate: item.watchedDate || null,
        statusChangedAt: item.statusChangedAt || null,
        phase: item.phase ?? null,
        title: item.title || '',
        universe: item.universe || '',
      },
    });
  }));

  return true;
};

export const getRhythmAppSystem = async () => {
  if (!isNativeRhythmAvailable()) return null;
  return RhythmStatus.getAppSystem();
};

export default RhythmStatus;
