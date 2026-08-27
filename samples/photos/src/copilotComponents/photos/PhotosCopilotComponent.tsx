import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { BaseCopilotComponent } from '@microsoft/sp-copilot-component';
import type { SPCopilotDisplayMode } from '@microsoft/sp-copilot-component';

import Photos from './components/Photos';
import type { IPhotosProps } from './components/IPhotosProps';
import type { IPhotosCopilotComponentProperties } from './PhotosCopilotComponentProperties';

import strings from 'PhotosCopilotComponentStrings';

/**
 * Copilot component that supplies SPFx context to the React photo view.
 *
 * The React view owns the Graph request through its data hook. Host-context
 * changes only re-render the view, allowing fullscreen/theme changes without
 * moving the request back into the SPFx lifecycle.
 */
export default class PhotosCopilotComponent extends BaseCopilotComponent<IPhotosCopilotComponentProperties> {
  protected render(): void {
    const props: IPhotosProps = {
      graphClientFactory: this.context.msGraphClientFactory,
      searchProperties: this.properties,
      layout: this.properties.layout || 'columns',
      hostContext: this.hostContext,
      onRequestDisplayMode: async (mode: SPCopilotDisplayMode) => {
        await this.requestDisplayModeAsync(mode);
      },
      targetDocument: this.context.domElement.ownerDocument,
      strings
    };

    ReactDOM.render(React.createElement(Photos, props), this.context.domElement);
  }

  protected async onTeardown(): Promise<void> {
    ReactDOM.unmountComponentAtNode(this.context.domElement);
  }
}
