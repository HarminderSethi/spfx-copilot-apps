import * as React from 'react';

import { Text } from '@fluentui/react-text';
import { Settings20Regular } from '@fluentui/react-icons';

import type {
  HomePanelId,
  IZavaSettings
} from '../../../shared/models/zavaEmployee';
import RightPanel from '../../../shared/components/RightPanel';
import EditableSettingsControls from '../../../shared/components/EditableSettingsControls';

export interface ISettingsSummaryPanelProps {
  settings: IZavaSettings;
  onSettingsChange: (patch: Partial<IZavaSettings>) => void;
  onToggleHomePanel: (panel: HomePanelId) => void;
  isModal?: boolean;
  onDismiss: () => void;
}

const SettingsSummaryPanel: React.FunctionComponent<ISettingsSummaryPanelProps> = (props) => {
  return (
    <RightPanel
      title="Settings"
      icon={<Settings20Regular />}
      isModal={props.isModal}
      onDismiss={props.onDismiss}
      footnote="Settings are stored for this browser session only."
    >
      <Text>
        Your current session preferences apply across the Home dashboard.
      </Text>
      <EditableSettingsControls
        settings={props.settings}
        onSettingsChange={props.onSettingsChange}
        onToggleHomePanel={props.onToggleHomePanel}
      />
    </RightPanel>
  );
};

export default SettingsSummaryPanel;