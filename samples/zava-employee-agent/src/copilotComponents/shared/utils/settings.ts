import type {
  HomePanelId,
  IZavaSettings,
  PrivacyLevel,
  ZavaCurrency,
  ZavaJurisdiction
} from '../models/zavaEmployee';

const STORAGE_KEY = 'zavaEmployeeAgent.settings';

export const HOME_PANEL_IDS: ReadonlyArray<HomePanelId> = [
  'actions',
  'timeline',
  'snapshot',
  'learning',
  'people',
  'milestone'
];

export const DEFAULT_ZAVA_SETTINGS: IZavaSettings = {
  currency: 'EUR',
  jurisdiction: 'FI',
  privacyLevel: 'standard',
  visibleHomePanels: ['actions', 'timeline', 'snapshot', 'learning', 'people', 'milestone']
};

const isPrivacyLevel = (value: unknown): value is PrivacyLevel =>
  value === 'standard' || value === 'private' || value === 'sensitive';

const isCurrency = (value: unknown): value is ZavaCurrency =>
  value === 'EUR' || value === 'USD' || value === 'GBP';

const isJurisdiction = (value: unknown): value is ZavaJurisdiction =>
  value === 'FI' || value === 'SE' || value === 'US';

export const isHomePanelId = (value: unknown): value is HomePanelId =>
  typeof value === 'string' && HOME_PANEL_IDS.indexOf(value as HomePanelId) !== -1;

export const normalizeVisibleHomePanels = (value: unknown): HomePanelId[] => {
  if (!Array.isArray(value)) {
    return DEFAULT_ZAVA_SETTINGS.visibleHomePanels.slice();
  }
  const panels = value.filter(isHomePanelId).filter(
    (panel, index, values) => values.indexOf(panel) === index
  );
  return panels.length > 0 ? panels : DEFAULT_ZAVA_SETTINGS.visibleHomePanels.slice();
};

const cloneDefaults = (): IZavaSettings => ({
  ...DEFAULT_ZAVA_SETTINGS,
  visibleHomePanels: DEFAULT_ZAVA_SETTINGS.visibleHomePanels.slice()
});

export const loadZavaSettings = (storage?: Storage): IZavaSettings => {
  const target = storage || (typeof window !== 'undefined' ? window.sessionStorage : undefined);
  if (!target) {
    return cloneDefaults();
  }

  try {
    const value = target.getItem(STORAGE_KEY);
    if (!value) {
      return cloneDefaults();
    }
    const parsed = JSON.parse(value) as Partial<IZavaSettings>;
    return {
      currency: isCurrency(parsed.currency) ? parsed.currency : DEFAULT_ZAVA_SETTINGS.currency,
      jurisdiction: isJurisdiction(parsed.jurisdiction) ? parsed.jurisdiction : DEFAULT_ZAVA_SETTINGS.jurisdiction,
      privacyLevel: isPrivacyLevel(parsed.privacyLevel) ? parsed.privacyLevel : 'standard',
      visibleHomePanels: normalizeVisibleHomePanels(parsed.visibleHomePanels)
    };
  } catch {
    return cloneDefaults();
  }
};

export const saveZavaSettings = (settings: IZavaSettings, storage?: Storage): void => {
  const target = storage || (typeof window !== 'undefined' ? window.sessionStorage : undefined);
  if (!target) {
    return;
  }
  try {
    target.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Sandboxed hosts may block storage; settings remain valid for the current render.
  }
};