import * as React from 'react';

import { Text } from '@fluentui/react-text';
import { makeStyles, mergeClasses } from '@griffel/react';
import { tokens } from '@fluentui/react-theme';

import type {
  HomePanelId,
  IZavaSettings,
  PrivacyLevel,
  ZavaCurrency,
  ZavaJurisdiction
} from '../models/zavaEmployee';
import { HOME_PANEL_IDS } from '../utils/settings';

const PANEL_LABELS: { [panel in HomePanelId]: string } = {
  actions: 'Action center',
  timeline: 'Worklife timeline',
  snapshot: 'HR snapshot',
  learning: 'Learning momentum',
  people: 'People around you',
  milestone: 'Recent milestone'
};

const useStyles = makeStyles({
  group: { minWidth: 0, marginTop: '18px', marginLeft: 0, marginRight: 0, marginBottom: 0, padding: 0, border: 'none' },
  groupLabel: { color: tokens.colorNeutralForeground3, textTransform: 'uppercase', fontWeight: tokens.fontWeightSemibold },
  field: { display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '10px' },
  select: { minHeight: '40px', paddingLeft: '9px', paddingRight: '9px', color: tokens.colorNeutralForeground1, backgroundColor: tokens.colorNeutralBackground1, border: `1px solid ${tokens.colorNeutralStroke1}`, borderRadius: tokens.borderRadiusMedium, '@media (max-width: 760px)': { minHeight: '44px' } },
  radioGroup: { display: 'grid', gap: '7px', marginTop: '9px' },
  option: { minHeight: '40px', display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '9px', paddingRight: '9px', backgroundColor: tokens.colorNeutralBackground3, borderRadius: tokens.borderRadiusMedium, cursor: 'pointer', '@media (max-width: 760px)': { minHeight: '44px' } },
  panelGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '7px', marginTop: '9px', '@media (max-width: 390px)': { gridTemplateColumns: '1fr' } },
  disabled: { opacity: 0.55, cursor: 'not-allowed' },
  hint: { display: 'block', marginTop: '8px', color: tokens.colorNeutralForeground3 }
});

export interface IEditableSettingsControlsProps {
  settings: IZavaSettings;
  onSettingsChange: (patch: Partial<IZavaSettings>) => void;
  onToggleHomePanel: (panel: HomePanelId) => void;
}

const EditableSettingsControls: React.FunctionComponent<IEditableSettingsControlsProps> = (props) => {
  const styles = useStyles();
  return (
    <>
      <div className={styles.group}>
        <Text size={100} block className={styles.groupLabel}>Region and format</Text>
        <label className={styles.field}>
          <Text>Currency</Text>
          <select
            className={styles.select}
            value={props.settings.currency}
            onChange={(event) => props.onSettingsChange({ currency: event.target.value as ZavaCurrency })}
          >
            <option value="EUR">EUR · Euro (€)</option>
            <option value="USD">USD · US dollar ($)</option>
            <option value="GBP">GBP · Pound sterling (£)</option>
          </select>
        </label>
        <label className={styles.field}>
          <Text>Jurisdiction</Text>
          <select
            className={styles.select}
            value={props.settings.jurisdiction}
            onChange={(event) => props.onSettingsChange({ jurisdiction: event.target.value as ZavaJurisdiction })}
          >
            <option value="FI">Finland · EU policy set</option>
            <option value="SE">Sweden · EU policy set</option>
            <option value="US">United States · US policy set</option>
          </select>
        </label>
      </div>

      <fieldset className={styles.group}>
        <legend><Text size={100} className={styles.groupLabel}>Privacy tier</Text></legend>
        <div className={styles.radioGroup}>
          {(['standard', 'private', 'sensitive'] as PrivacyLevel[]).map((level) => (
            <label key={level} className={styles.option}>
              <input
                type="radio"
                name="zava-privacy-level"
                value={level}
                checked={props.settings.privacyLevel === level}
                onChange={() => props.onSettingsChange({ privacyLevel: level })}
              />
              <Text>{level.charAt(0).toUpperCase() + level.slice(1)}</Text>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className={styles.group} aria-describedby="visible-home-panels-hint">
        <legend><Text size={100} className={styles.groupLabel}>Visible Home panels</Text></legend>
        <div className={styles.panelGrid}>
          {HOME_PANEL_IDS.map((panel) => {
            const checked = props.settings.visibleHomePanels.indexOf(panel) !== -1;
            const lastVisible = checked && props.settings.visibleHomePanels.length === 1;
            return (
              <label key={panel} className={mergeClasses(styles.option, lastVisible && styles.disabled)}>
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={lastVisible}
                  onChange={() => props.onToggleHomePanel(panel)}
                />
                <Text>{PANEL_LABELS[panel]}</Text>
              </label>
            );
          })}
        </div>
        <Text id="visible-home-panels-hint" size={200} className={styles.hint}>
          At least one Home panel stays visible.
        </Text>
      </fieldset>
    </>
  );
};

export default EditableSettingsControls;