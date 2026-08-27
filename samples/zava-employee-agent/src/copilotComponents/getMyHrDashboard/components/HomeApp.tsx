import * as React from 'react';

import type {
  ISPCopilotContainerDimensions,
  SPCopilotDisplayMode,
  SPCopilotTheme
} from '@microsoft/sp-copilot-component';

import type { IZavaUser } from '../../shared/models/zavaEmployee';
import type { ZavaFamilyId } from '../../shared/models/families';
import type { HomeView, INormalizedHomeProperties } from '../normalizeHomeProperties';
import HomeInline from './HomeInline';
import HomeThemeProvider from './HomeThemeProvider';
import ZavaDashboardShell from './ZavaDashboardShell';

export interface IHomeAppProps {
  properties: INormalizedHomeProperties;
  propertiesVersion: number;
  currentUser: IZavaUser;
  theme?: SPCopilotTheme;
  displayMode?: SPCopilotDisplayMode;
  availableDisplayModes?: SPCopilotDisplayMode[];
  containerDimensions?: ISPCopilotContainerDimensions;
  targetDocument?: Document;
  onRequestFullscreen?: () => void;
  fixedView?: HomeView;
  initialFamily?: ZavaFamilyId;
  initialRoute?: string;
  initialParams?: Record<string, string | number | boolean | string[]>;
}

const HomeApp: React.FunctionComponent<IHomeAppProps> = (props) => {
  const view = props.displayMode === 'fullscreen' ? (
    <ZavaDashboardShell
      properties={props.properties}
      propertiesVersion={props.propertiesVersion}
      currentUser={props.currentUser}
      containerDimensions={props.containerDimensions}
      initialFamily={props.initialFamily}
      initialRoute={props.initialRoute}
      initialParams={props.initialParams}
    />
  ) : (
    <HomeInline
      properties={props.properties}
      propertiesVersion={props.propertiesVersion}
      currentUser={props.currentUser}
      availableDisplayModes={props.availableDisplayModes}
      containerDimensions={props.containerDimensions}
      onRequestFullscreen={props.onRequestFullscreen}
      fixedView={props.fixedView}
    />
  );

  return (
    <HomeThemeProvider theme={props.theme} targetDocument={props.targetDocument}>
      {view}
    </HomeThemeProvider>
  );
};

export default HomeApp;