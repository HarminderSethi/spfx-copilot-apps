import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { BaseCopilotComponent } from '@microsoft/sp-copilot-component';
import type { SPCopilotDisplayMode } from '@microsoft/sp-copilot-component';
import type { MSGraphClientV3 } from '@microsoft/sp-http';

import AgentsExplorer from './components/AgentsExplorer';
import type { IAgentsExplorerProps } from './components/IAgentsExplorerProps';
import type { IAgentsExplorerCopilotComponentProperties } from './AgentsExplorerCopilotComponentProperties';
import AgentsExplorerService, { type ICopilotAgent } from '../../services/AgentsExplorerService';

import * as strings from 'AgentsExplorerCopilotComponentStrings';

/**
 * SPFx Copilot Component that surfaces the Copilot Agents (Dataverse bots)
 * published across every Power Platform environment the current user can
 * reach, using brokered SSO (`aadHttpClientFactory`) — no token code needed.
 *
 * Lifecycle:
 *  1. `onInit()` — resolves the user's display name and fetches agents
 *     (runs once before first render).
 *  2. `render()` — mounts the React tree into `this.context.domElement`.
 *     Re-invoked by the framework on host-context changes.
 *  3. `onTeardown()` — unmounts React before the host tears down the iframe.
 */
export default class AgentsExplorerCopilotComponent extends BaseCopilotComponent<IAgentsExplorerCopilotComponentProperties> {
  private _userDisplayName: string = '';
  private _agents: ICopilotAgent[] = [];
  private _errorMessage: string = '';

  protected async onInit(): Promise<void> {
    try {
      const graphClient: MSGraphClientV3 = await this.context.msGraphClientFactory.getClient('3');
      const me: { displayName?: string } = await graphClient.api('/me').select('displayName').get();
      this._userDisplayName = me.displayName || this.context.pageContext.user?.displayName || 'User';
    } catch {
      this._userDisplayName = this.context.pageContext.user?.displayName || 'User';
    }

    try {
      const agentsService = new AgentsExplorerService(this.context);
      this._agents = await agentsService.getCopilotAgents();
    } catch (error) {
      console.error('Failed to load Copilot Agents', error);
      this._errorMessage = 'Failed to load Copilot Agents. Please check your permissions.';
    }
  }

  protected render(): void {
    const props: IAgentsExplorerProps = {
      ownershipFilter: this.properties.ownershipFilter,
      searchText: this.properties.searchText,
      userDisplayName: this._userDisplayName,
      agents: this._agents,
      errorMessage: this._errorMessage,
      hostContext: this.hostContext,
      bridge: this.context.copilotBridge,
      onRequestDisplayMode: async (mode: SPCopilotDisplayMode) => {
        await this.requestDisplayModeAsync(mode);
      },
      targetDocument: this.context.domElement.ownerDocument,
      strings
    };

    ReactDOM.render(React.createElement(AgentsExplorer, props), this.context.domElement);
  }

  protected async onTeardown(): Promise<void> {
    ReactDOM.unmountComponentAtNode(this.context.domElement);
  }
}
