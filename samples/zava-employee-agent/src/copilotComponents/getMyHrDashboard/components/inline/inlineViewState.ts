import type { HomeView } from '../../normalizeHomeProperties';

type HomeDisplayMode = 'inline' | 'fullscreen';

export const resolveInlineViewForVersion = (
  currentView: HomeView,
  requestedView: HomeView,
  previousVersion: number,
  nextVersion: number
): HomeView => previousVersion === nextVersion ? currentView : requestedView;

export const canRequestFullscreen = (
  availableDisplayModes: HomeDisplayMode[] | undefined
): boolean => availableDisplayModes !== undefined &&
  availableDisplayModes.indexOf('fullscreen') !== -1;