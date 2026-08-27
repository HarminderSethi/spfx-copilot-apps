import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {
  BaseCopilotComponent,
  createCopilotTextContent
} from '@microsoft/sp-copilot-component';

import ReleaseReadinessBoard from './components/ReleaseReadinessBoard';
import type { IReleaseReadinessBoardProps } from './components/IReleaseReadinessBoardProps';
import type { IReleaseReadinessBoardCopilotComponentProperties } from './ReleaseReadinessBoardCopilotComponentProperties';
import { getMockReleaseReadinessData } from './data/mockReleaseReadiness';
import type { IReleasePlan } from './models/IReleaseReadiness';
import { createReleaseReadinessDataService } from './services/createReleaseReadinessDataService';

import * as strings from 'ReleaseReadinessBoardCopilotComponentStrings';

export default class ReleaseReadinessBoardCopilotComponent extends BaseCopilotComponent<IReleaseReadinessBoardCopilotComponentProperties> {
  private _releases: IReleasePlan[] = [];
  private _dataSourceLabel: string = 'Mock data';

  protected async onInit(): Promise<void> {
    const dataService = createReleaseReadinessDataService({
      useMock: this.properties.useMock,
      dataServiceUrl: this.properties.dataServiceUrl
    });

    try {
      this._releases = await dataService.getReleases();
      this._dataSourceLabel = dataService.sourceLabel;
    } catch {
      this._releases = getMockReleaseReadinessData();
      this._dataSourceLabel = 'Mock data (fallback)';
    }
  }

  protected render(): void {
    const props: IReleaseReadinessBoardProps = {
      releases: this._releases,
      dataSourceLabel: this._dataSourceLabel,
      releaseName: this.properties.releaseName,
      owner: this.properties.owner,
      showBlockedOnly: this.properties.showBlockedOnly,
      userDisplayName: this.context.pageContext.user?.displayName || 'Release Manager',
      hostContext: this.hostContext,
      onRequestDisplayMode: async (mode) => {
        await this.requestDisplayModeAsync(mode);
      },
      onSendFollowUp: async (message: string) => {
        const result = await this.context.copilotBridge.sendFollowUpMessageAsync([
          createCopilotTextContent(message)
        ]);
        return result.isError !== true;
      },
      targetDocument: this.context.domElement.ownerDocument,
      strings
    };

    ReactDOM.render(React.createElement(ReleaseReadinessBoard, props), this.context.domElement);
  }

  protected async onTeardown(): Promise<void> {
    ReactDOM.unmountComponentAtNode(this.context.domElement);
  }
}
