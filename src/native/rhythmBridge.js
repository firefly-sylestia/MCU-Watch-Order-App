import { Capacitor, registerPlugin } from '@capacitor/core';

export const RhythmBridge = registerPlugin('RhythmBridge');

export const canUseRhythmBridge = () => Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android';

export const buildRhythmLibrarySnapshot = ({
  universe,
  activePhase,
  activeItems,
  phases,
  statusLabels,
  timelineMode,
}) => {
  const counts = activeItems.reduce((acc, item) => {
    const status = item.status || 'unwatched';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const phaseLibrary = phases.map((phase) => {
    const phaseItems = activeItems.filter((item) => item.phase === phase.id);
    const watched = phaseItems.filter((item) => item.status === 'watched').length;
    return {
      id: phase.id,
      name: phase.name,
      tagline: phase.tagline || '',
      color: phase.color,
      total: phaseItems.length,
      watched,
      remaining: Math.max(phaseItems.length - watched, 0),
      titles: phaseItems.map((item) => ({
        id: item.id,
        title: item.title,
        type: item.type,
        year: item.year,
        status: item.status || 'unwatched',
      })),
    };
  });

  return {
    schema: 'rhythm-mcu-library-v1',
    savedAt: new Date().toISOString(),
    universe,
    activePhase,
    timelineMode,
    totals: {
      all: activeItems.length,
      statuses: counts,
    },
    statusLabels,
    phases: phaseLibrary,
  };
};

export const syncRhythmLibrarySnapshot = async (snapshot) => {
  if (!canUseRhythmBridge()) return { skipped: true };
  return RhythmBridge.saveLibrarySnapshot({ snapshot: JSON.stringify(snapshot) });
};
