import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {
  BaseCopilotComponent,
  createCopilotTextContent
} from '@microsoft/sp-copilot-component';

import ShowActionChoices from './components/ShowActionChoices';
import type { IShowActionChoicesProps } from './components/IShowActionChoicesProps';
import type { IShowActionChoicesCopilotComponentProperties } from './ShowActionChoicesCopilotComponentProperties';

export default class ShowActionChoicesCopilotComponent extends BaseCopilotComponent<IShowActionChoicesCopilotComponentProperties> {
  protected render(): void {
    const props: IShowActionChoicesProps = {
      question: this.properties.question,
      options: Array.from(this.properties.options),
      idPrefix: 'choice-relay-options-' + this.instanceId + '-',
      hostContext: this.hostContext,
      onSendFollowUp: async (message: string) => {
        const result = await this.context.copilotBridge.sendFollowUpMessageAsync([
          createCopilotTextContent(message)
        ]);
        return result.isError !== true;
      },
      targetDocument: this.context.domElement.ownerDocument
    };

    ReactDOM.render(
      React.createElement(ShowActionChoices, props),
      this.context.domElement
    );
  }

  protected async onTeardown(): Promise<void> {
    ReactDOM.unmountComponentAtNode(this.context.domElement);
  }
}
