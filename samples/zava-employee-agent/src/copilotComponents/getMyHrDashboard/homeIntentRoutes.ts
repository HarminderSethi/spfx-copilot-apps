import type { HomeView } from './normalizeHomeProperties';

export const HOME_INTENT_ROUTES: Readonly<Record<HomeView, string>> = {
  summary: 'home/summary',
  profile: 'home/profile',
  actions: 'home/actions',
  timeline: 'home/timeline',
  milestones: 'home/milestones'
};

export const getHomeRouteSelector = (route: string | undefined): string | undefined =>
  route && Object.keys(HOME_INTENT_ROUTES).some(
    (view) => HOME_INTENT_ROUTES[view as HomeView] === route
  ) ? `[data-home-route="${route}"]` : undefined;