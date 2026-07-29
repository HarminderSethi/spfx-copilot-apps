import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {
  BaseCopilotComponent,
  createCopilotTextContent
} from '@microsoft/sp-copilot-component';

import ShowNextAction from './components/ShowNextAction';
import type { IShowNextActionProps } from './components/IShowNextActionProps';
import type { IShowNextActionCopilotComponentProperties } from './ShowNextActionCopilotComponentProperties';

export default class ShowNextActionCopilotComponent extends BaseCopilotComponent<IShowNextActionCopilotComponentProperties> {
  protected render(): void {
    const props: IShowNextActionProps = {
      selectedOption: this.properties.selectedOption,
      nextAction: this.properties.nextAction,
      explanation: this.properties.explanation,
      idPrefix: 'choice-relay-result-' + this.instanceId + '-',
      hostContext: this.hostContext,
      onSendFollowUp: async (message: string) => {
        const result = await this.context.copilotBridge.sendFollowUpMessageAsync([
          createCopilotTextContent(message)
        ]);
        return result.isError !== true;
      },
      targetDocument: this.context.domElement.ownerDocument
    };

    ReactDOM.render(React.createElement(ShowNextAction, props), this.context.domElement);
  }

  protected async onTeardown(): Promise<void> {
    ReactDOM.unmountComponentAtNode(this.context.domElement);
  }
}
