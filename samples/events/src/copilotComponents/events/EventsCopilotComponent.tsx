import * as React from "react";
import * as ReactDOM from "react-dom";

import { BaseCopilotComponent } from "@microsoft/sp-copilot-component";

import Events from "./components/Events";
import type { IEventsProps } from "./components/IEventsProps";
import type { IEventsCopilotComponentProperties } from "./EventsCopilotComponentProperties";
import { resolveUserRegionalSettings } from "./utils/userRegionalSettings";

import * as strings from "EventsCopilotComponentStrings";

export default class EventsCopilotComponent extends BaseCopilotComponent<IEventsCopilotComponentProperties> {
  protected render(): void {
    const targetDocument = this.context.domElement.ownerDocument;
    const targetWindow = targetDocument.defaultView;
    const cultureInfo = this.context.pageContext.cultureInfo;
    const regionalSettings = resolveUserRegionalSettings({
      browserLocale: targetWindow?.navigator.language,
      browserTimeZone: targetWindow?.Intl.DateTimeFormat().resolvedOptions().timeZone,
      dateLocale: cultureInfo.currentCultureName,
      firstDayOfWeek:
        this.context.pageContext.user.firstDayOfWeek ??
        this.context.pageContext.web.firstDayOfWeek,
      uiLocale: cultureInfo.currentUICultureName,
    });
    const props: IEventsProps = {
      properties: this.properties,
      graphClientFactory: this.context.msGraphClientFactory,
      hostContext: this.hostContext,
      onRequestDisplayMode: async (mode) => {
        await this.requestDisplayModeAsync(mode);
      },
      onRequestSizeChange: async (width, height) =>
        this.requestSizeChangeAsync(width, height),
      targetDocument,
      strings,
      ...regionalSettings,
    };

    ReactDOM.render(
      React.createElement(Events, props),
      this.context.domElement,
    );
  }

  protected async onTeardown(): Promise<void> {
    ReactDOM.unmountComponentAtNode(this.context.domElement);
  }
}
