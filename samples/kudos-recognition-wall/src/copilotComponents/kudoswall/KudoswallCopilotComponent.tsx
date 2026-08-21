import * as React from "react";
import * as ReactDOM from "react-dom";

import { BaseCopilotComponent } from "@microsoft/sp-copilot-component";
import type { MSGraphClientV3 } from "@microsoft/sp-http";

import {
  KudosApp,
  createKudosServices,
  resolveSurface,
  resolveInlineMode,
  KUDOS_SITE_URL,
  type IKudosServices,
  type IPerson,
} from "./components/kudos";
import type { ICurrentUser } from "./components/kudos";
import type { IKudoswallCopilotComponentProperties } from "./KudoswallCopilotComponentProperties";

/**
 * Kudos & Recognition Wall — an SPFx Copilot Component.
 *
 * Renders in the Microsoft 365 Copilot canvas. The host's display mode selects
 * the surface (inline card vs full-canvas wall) and the tool arguments
 * (recipient / message) select the inline state (launcher vs compose).
 *
 * Lifecycle:
 *  1. onInit()    — resolves the signed-in user, builds the data services, and
 *                   resolves a named recipient (runs once before first render).
 *  2. render()    — mounts the React tree; re-invoked on host-context changes
 *                   (e.g. theme flip, expand to fullscreen).
 *  3. onTeardown()— unmounts React before the host disposes the iframe.
 */
export default class KudoswallCopilotComponent extends BaseCopilotComponent<IKudoswallCopilotComponentProperties> {
  private _services!: IKudosServices;
  private _recipient: IPerson | undefined;

  protected async onInit(): Promise<void> {
    // Copilot host has no site context, so prefer the configured data site.
    const webAbsoluteUrl =
      KUDOS_SITE_URL || this.context.pageContext.web.absoluteUrl;
    const user = this.context.pageContext.user;
    const currentUser: ICurrentUser = {
      displayName: user?.displayName || "You",
      upn: user?.email || user?.loginName || "",
    };

    // Brokered SSO — no token code needed. Graph may be unavailable in the
    // workbench, so the services fall back to the mock directory when it is.
    let graph: MSGraphClientV3 | undefined;
    try {
      graph = await this.context.msGraphClientFactory.getClient("3");
    } catch {
      graph = undefined;
    }

    const forceMock = /[?&]kudosMock=1/i.test(window.location.search);

    this._services = createKudosServices({
      spHttpClient: this.context.spHttpClient,
      graph,
      webAbsoluteUrl,
      currentUser,
      forceMock,
    });

    // Resolve a recipient named in the prompt to a real person for the compose card.
    const named = this.properties.recipient?.trim();
    if (named) {
      try {
        this._recipient = await this._services.people.resolvePerson(named);
      } catch {
        this._recipient = undefined;
      }
    }
  }

  protected render(): void {
    const element = React.createElement(KudosApp, {
      surface: resolveSurface(this.hostContext.displayMode),
      inlineMode: resolveInlineMode(this.properties),
      recipient: this._recipient,
      prefilledMessage: this.properties.message,
      service: this._services.kudos,
      peopleService: this._services.people,
      isDarkTheme: this.hostContext.theme === "dark",
      targetDocument: this.context.domElement.ownerDocument,
      onRequestFullscreen: () => {
        this.requestDisplayModeAsync("fullscreen").catch(() => undefined);
      },
    });

    ReactDOM.render(element, this.context.domElement);
  }

  protected async onTeardown(): Promise<void> {
    ReactDOM.unmountComponentAtNode(this.context.domElement);
  }
}
