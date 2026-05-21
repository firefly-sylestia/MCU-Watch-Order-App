import { STATUS_SORT_ORDER } from '../watchlist/selectors';

export const filterAndSortItems = ({ items, listMode, coreIds, essentialOnly, watchedOnly, statusFilter, autoHideStatuses, hiddenStatuses, typeFilter, activePhase, timelineMode, genreFilter, search, sortBy }) => {
  const filtered = items.filter((i) => {
    if (listMode === 'core' && !coreIds.has(i.id)) return false;
    if (essentialOnly && !i.essential) return false;
    if (watchedOnly && i.status !== 'watched') return false;
    if (statusFilter && i.status !== statusFilter) return false;
    if (autoHideStatuses && hiddenStatuses.has(i.status)) return false;
    if (typeFilter && i.type !== typeFilter) return false;
    if (activePhase && i.phase !== activePhase) return false;
    if (timelineMode === 'studio' && i.studioOrder == null) return false;
    if (genreFilter && !(i.genre || []).includes(genreFilter)) return false;
    if (search && !`${i.title} ${i.notes || ''}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    if (sortBy === 'year') return a.year - b.year;
    if (sortBy === 'runtime') return (a.episodes || (a.type === 'film' ? 2.3 : 6)) - (b.episodes || (b.type === 'film' ? 2.3 : 6));
    if (sortBy === 'watched') return (b.watchedDate || '').localeCompare(a.watchedDate || '');
    if (sortBy === 'status') return (STATUS_SORT_ORDER[a.status] ?? 99) - (STATUS_SORT_ORDER[b.status] ?? 99);
    return (a.order ?? 0) - (b.order ?? 0);
  });
  const grouped = filtered.reduce((acc, item) => {
    const key = item.phase ?? 0;
    acc[key] = acc[key] || [];
    acc[key].push(item);
    return acc;
  }, {});
  const phaseKeys = Object.keys(grouped).map(Number).sort((a, b) => a - b);
  return { filtered, grouped, phaseKeys };
};
