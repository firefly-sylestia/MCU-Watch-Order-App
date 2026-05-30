import { useEffect, useMemo } from 'react';

export const ROUTE_FALLBACK = '/home';
export const SEARCH_ROUTE = '/search';
export const SERIES_ROUTE = '/series';

const UNIVERSE_SEGMENTS = new Set(['marvel', 'mcu', 'dc']);
const toUniverse = (segment) => (segment === 'dc' ? 'dc' : 'mcu');
const universeRouteSegment = (universe) => (universe === 'dc' ? 'dc' : 'marvel');

const slugify = (value) => String(value || '')
  .toLowerCase()
  .replace(/&/g, 'and')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

const compactRouteSlug = (value) => slugify(value).replace(/-/g, '');

const titleRoutePath = (item, universe) => `/${universeRouteSegment(universe)}/${item?.type === 'series' ? 'series' : 'movie'}/${slugify(item?.title) || item?.id || ''}`;

const searchRoutePath = (query = '', type = '', universe = 'mcu') => {
  const params = new URLSearchParams();
  const trimmedQuery = String(query || '').trim();
  if (trimmedQuery) params.set('q', trimmedQuery);
  if (type) params.set('type', type);
  const qs = params.toString();
  return `/${universeRouteSegment(universe)}${SEARCH_ROUTE}${qs ? `?${qs}` : ''}`;
};

const phaseRoutePath = (phase = 0, universe = 'mcu') => `/${universeRouteSegment(universe)}/phase${phase ? `/${phase}` : ''}`;

const routeItemMatchesSlug = (item, rawSlug) => {
  const slug = slugify(decodeURIComponent(String(rawSlug || '')));
  if (!item || !slug) return false;
  const titleSlug = slugify(item.title);
  const compactSlug = compactRouteSlug(slug);
  const compactTitle = compactRouteSlug(item.title);
  return String(item.id) === slug
    || titleSlug === slug
    || compactTitle === compactSlug
    || titleSlug.includes(slug)
    || compactTitle.includes(compactSlug);
};

const normalizeRoute = (path = '/', queryString = '') => {
  const cleanPath = `/${String(path || '').split('?')[0].split('#')[0].replace(/^\/+/, '')}`.replace(/\/+$/, '') || ROUTE_FALLBACK;
  const rawParts = cleanPath.split('/').filter(Boolean);
  const maybeUniverse = rawParts[0]?.toLowerCase();
  const hasUniversePrefix = UNIVERSE_SEGMENTS.has(maybeUniverse);
  return {
    cleanPath,
    params: new URLSearchParams(String(queryString || '').replace(/^\?/, '')),
    universe: hasUniversePrefix ? toUniverse(maybeUniverse) : null,
    parts: hasUniversePrefix ? rawParts.slice(1) : rawParts,
  };
};

export default function DeepLinkRouteSync({
  universe,
  setUniverse,
  items,
  itemsByUniverse = null,
  detailItem,
  settingsOpen,
  analyticsOpen,
  browseMode,
  activePhase,
  search,
  typeFilter,
  validTypes,
  routeEpoch = 0,
  actions,
}) {
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const applyUrlRoute = (path = window.location.pathname, queryString = window.location.search) => {
      const route = normalizeRoute(path, queryString);
      if (route.universe && route.universe !== universe) {
        if (window.history.state?.mcuRoute) return;
        setUniverse(route.universe);
      }

      const primary = route.parts[0] || 'home';
      const requestedSearch = route.params.get('q') || '';
      const requestedType = validTypes.has(route.params.get('type')) ? route.params.get('type') : null;

      actions.closeTransient();

      if (primary === 'search') {
        actions.openSearch({ query: requestedSearch, type: requestedType });
        return;
      }

      if (primary === 'settings') {
        actions.openSettings();
        return;
      }

      if (primary === 'analytics') {
        actions.openAnalytics();
        return;
      }

      if (primary === 'phase') {
        const requestedPhase = Number(route.parts[1] || 0);
        actions.openPhase(Number.isFinite(requestedPhase) && requestedPhase > 0 ? requestedPhase : 0);
        return;
      }

      if (primary === 'series' && route.parts.length === 1) {
        actions.openSearch({ query: requestedSearch, type: 'series' });
        return;
      }

      if (primary === 'movie' || primary === 'title' || primary === 'series') {
        const requestedSlug = route.parts.slice(1).join('-');
        const lookupUniverse = route.universe || universe;
        const lookupItems = itemsByUniverse?.[lookupUniverse] || items;
        const routedItem = lookupItems.find(item => routeItemMatchesSlug(item, requestedSlug));
        if (routedItem) actions.openDetailRoute(routedItem);
        else actions.openSearch({ query: decodeURIComponent(requestedSlug || '').replace(/-/g, ' '), type: null });
        return;
      }

      actions.openHome();
    };

    applyUrlRoute(window.location.pathname, window.location.search);
    const onPopState = () => applyUrlRoute(window.location.pathname, window.location.search);
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [actions, items, itemsByUniverse, routeEpoch, setUniverse, universe, validTypes]);

  const canonicalRoute = useMemo(() => {
    if (detailItem) return titleRoutePath(detailItem, universe);
    if (settingsOpen) return `/${universeRouteSegment(universe)}/settings`;
    if (analyticsOpen) return `/${universeRouteSegment(universe)}/analytics`;
    if (browseMode === 'search' && typeFilter === 'series' && !search.trim()) return `/${universeRouteSegment(universe)}${SERIES_ROUTE}`;
    if (browseMode === 'search') return searchRoutePath(search, typeFilter, universe);
    if (browseMode === 'phase') return phaseRoutePath(activePhase, universe);
    return `/${universeRouteSegment(universe)}${ROUTE_FALLBACK}`;
  }, [activePhase, analyticsOpen, browseMode, detailItem, search, settingsOpen, typeFilter, universe]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const currentPath = window.location.pathname.replace(/\/+$/, '') || '/';
    const currentRoute = `${currentPath}${window.location.search || ''}`;
    const nextState = { ...(window.history.state || {}), mcuRoute: canonicalRoute };
    if (currentRoute === canonicalRoute) {
      if (window.history.state?.mcuRoute !== canonicalRoute) window.history.replaceState(nextState, '', canonicalRoute);
      return;
    }
    const currentPrimary = currentPath.split('/').filter(Boolean)[0] || 'home';
    const nextPrimary = canonicalRoute.split('?')[0].split('/').filter(Boolean)[0] || 'home';
    const method = currentPath === '/' || currentPrimary === nextPrimary ? 'replaceState' : 'pushState';
    window.history[method](nextState, '', canonicalRoute);
  }, [canonicalRoute]);

  return null;
}
