import type { IZavaSettings } from '../models/zavaEmployee';
import {
  DEFAULT_ZAVA_SETTINGS,
  loadZavaSettings,
  normalizeVisibleHomePanels,
  saveZavaSettings
} from './settings';

const createStorage = (): Storage => {
  const values: { [key: string]: string } = {};
  return {
    get length(): number {
      return Object.keys(values).length;
    },
    clear: (): void => {
      Object.keys(values).forEach((key) => delete values[key]);
    },
    getItem: (key: string): string | null => values[key] ?? null,
    key: (index: number): string | null => Object.keys(values)[index] ?? null,
    removeItem: (key: string): void => {
      delete values[key];
    },
    setItem: (key: string, value: string): void => {
      values[key] = value;
    }
  };
};

describe('settings utilities', () => {
  test('returns independent defaults when storage is empty', () => {
    const storage = createStorage();
    const first = loadZavaSettings(storage);
    first.visibleHomePanels.pop();
    expect(loadZavaSettings(storage)).toEqual(DEFAULT_ZAVA_SETTINGS);
  });

  test('round-trips valid session settings', () => {
    const storage = createStorage();
    const settings: IZavaSettings = {
      currency: 'USD',
      jurisdiction: 'US',
      privacyLevel: 'private',
      visibleHomePanels: ['actions', 'people']
    };
    saveZavaSettings(settings, storage);
    expect(loadZavaSettings(storage)).toEqual(settings);
  });

  test('falls back safely when stored JSON is invalid', () => {
    const storage = createStorage();
    storage.setItem('zavaEmployeeAgent.settings', '{invalid');
    expect(loadZavaSettings(storage)).toEqual(DEFAULT_ZAVA_SETTINGS);
  });

  test('keeps only unique known panel IDs and never accepts an empty layout', () => {
    expect(normalizeVisibleHomePanels(['actions', 'unknown', 'actions', 'people']))
      .toEqual(['actions', 'people']);
    expect(normalizeVisibleHomePanels([])).toEqual(DEFAULT_ZAVA_SETTINGS.visibleHomePanels);
  });
});