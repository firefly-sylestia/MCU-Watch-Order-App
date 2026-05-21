export const STATUS_SORT_ORDER = {
  watching: 0,
  'plan-to-watch': 1,
  'on-hold': 2,
  unwatched: 3,
  watched: 4,
  dropped: 5,
};

export const calculateWatchStreak = (items) => {
  const dayKey = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  const daySet = new Set(items.filter((item) => item.status === 'watched' && item.watchedDate).map((item) => String(item.watchedDate).slice(0, 10)).filter(Boolean));
  if (!daySet.size) return 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  if (!daySet.has(dayKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
    if (!daySet.has(dayKey(cursor))) return 0;
  }
  let streak = 0;
  while (daySet.has(dayKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
};

export const getProgressStats = (activeItems) => {
  const totalWatched = activeItems.filter((i) => i.status === 'watched').length;
  const essTotal = activeItems.filter((i) => i.essential).length;
  const essWatched = activeItems.filter((i) => i.essential && i.status === 'watched').length;
  return { totalWatched, essTotal, essWatched };
};
