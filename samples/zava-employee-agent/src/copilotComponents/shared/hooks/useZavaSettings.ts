import * as React from 'react';

import type {
  HomePanelId,
  IZavaSettings
} from '../models/zavaEmployee';
import {
  loadZavaSettings,
  normalizeVisibleHomePanels,
  saveZavaSettings
} from '../utils/settings';

export interface IUseZavaSettingsResult {
  settings: IZavaSettings;
  updateSettings: (patch: Partial<IZavaSettings>) => void;
  toggleHomePanel: (panel: HomePanelId) => void;
}

export const useZavaSettings = (): IUseZavaSettingsResult => {
  const [settings, setSettings] = React.useState<IZavaSettings>(() => loadZavaSettings());

  const updateSettings = React.useCallback((patch: Partial<IZavaSettings>): void => {
    setSettings((current) => {
      const next: IZavaSettings = {
        ...current,
        ...patch,
        visibleHomePanels: patch.visibleHomePanels
          ? normalizeVisibleHomePanels(patch.visibleHomePanels)
          : current.visibleHomePanels.slice()
      };
      saveZavaSettings(next);
      return next;
    });
  }, []);

  const toggleHomePanel = React.useCallback((panel: HomePanelId): void => {
    setSettings((current) => {
      const visible = current.visibleHomePanels.indexOf(panel) !== -1;
      const requested = visible
        ? current.visibleHomePanels.filter((candidate) => candidate !== panel)
        : current.visibleHomePanels.concat(panel);
      const next: IZavaSettings = {
        ...current,
        visibleHomePanels: requested.length > 0
          ? requested
          : current.visibleHomePanels.slice()
      };
      saveZavaSettings(next);
      return next;
    });
  }, []);

  return { settings, updateSettings, toggleHomePanel };
};