import * as React from 'react';
import { BaseCopilotComponent } from '@microsoft/sp-copilot-component';

import NegotiationLabApp, {
  type INegotiationLabActions,
  type NegotiationLabView
} from '../../components/NegotiationLabApp';
import type { INegotiationReply, NegotiationOffer } from '../../domain/types';
import type { NegotiatorStyle } from '../../domain/negotiatorStyle';
import { NegotiationController } from '../../shared/NegotiationController';
import {
  archiveSharedRoot,
  renderInSharedRoot
} from '../../shared/sharedReactRoot';
import {
  showReplyPropertiesSchema,
  type IShowReplyCopilotComponentProperties
} from './ShowReplyCopilotComponentProperties';

export default class ShowReplyCopilotComponent extends BaseCopilotComponent<IShowReplyCopilotComponentProperties> {
  private view: NegotiationLabView = { kind: 'loading' };
  private reply?: INegotiationReply;
  private controller?: NegotiationController;
  private loadStarted = false;

  protected onInit(): Promise<void> {
    const parsed = showReplyPropertiesSchema.safeParse(this.properties);
    if (!parsed.success) {
      this.view = {
        kind: 'error',
        message: `NegotiationLabShowReply received invalid input: ${parsed.error.issues
          .map(({ message }) => message)
          .join(' ')}`
      };
      return Promise.resolve();
    }
    this.reply = parsed.data;
    return Promise.resolve();
  }

  private setView = (view: NegotiationLabView): void => {
    this.view = view;
    if (!this.isDisposed) this.render();
  };

  private async load(): Promise<void> {
    if (!this.reply) return;
    this.setView({ kind: 'loading' });
    try {
      this.controller = new NegotiationController(this.context, this.setView);
      const session = await this.controller.loadSession(this.reply.sessionItemId);
      if (session.status === 'Completed') {
        this.controller.showCurrent();
        return;
      }
      if (!this.controller.showReply(session, this.reply)) {
        this.controller.showCurrent(
          'This reply no longer matches the saved turn. Continue from the current board.'
        );
        return;
      }
    } catch (error) {
      this.setView({
        kind: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'The Negotiation Lab reply could not open.'
      });
    }
  }

  private startLoad(): void {
    if (this.loadStarted || this.view.kind === 'error') return;
    this.loadStarted = true;
    this.load().catch(() => undefined);
  }

  private requireController(): NegotiationController {
    if (!this.controller) throw new Error('Negotiation Lab is not ready yet.');
    return this.controller;
  }

  private requireReply(): INegotiationReply {
    if (!this.reply) throw new Error('No valid counterpart reply is open.');
    return this.reply;
  }

  private actions(): INegotiationLabActions {
    return {
      provision: async () => {
        throw new Error('Reopen the practice board to set up the lists.');
      },
      reload: async () => this.load(),
      start: async (scenarioKey: string, style: NegotiatorStyle) =>
        this.requireController().start(scenarioKey, style),
      ask: async (question: string) => this.requireController().ask(question),
      send: async (message: string, offer: NegotiationOffer) =>
        this.requireController().send(message, offer),
      retry: async () => this.requireController().retry(),
      editPending: async () => this.requireController().editPending(),
      applyReply: async () =>
        this.requireController().applyReply(this.requireReply()),
      acceptCounterProposal: async () =>
        this.requireController().acceptCounterProposal(this.requireReply()),
      endPractice: async () => this.requireController().endPractice(),
      chooseAnother: async () => this.requireController().chooseAnother()
    };
  }

  protected render(): void {
    renderInSharedRoot(
      this,
      this.context.domElement,
      React.createElement(NegotiationLabApp, {
        view: this.view,
        actions: this.actions(),
        hostContext: this.hostContext,
        locale:
          this.context.pageContext.cultureInfo?.currentCultureName || 'en-US',
        idPrefix: `negotiation-lab-reply-${this.instanceId}-`,
        onRequestFullscreen: async () => {
          await this.requestDisplayModeAsync('fullscreen');
        }
      }),
      {
        theme: this.hostContext.theme,
        displayMode: this.hostContext.displayMode,
        isActive: () => !this.isDisposed,
        requestSizeChange: async (width, height) =>
          this.requestSizeChangeAsync(width, height)
      }
    );
    this.startLoad();
  }

  protected async onTeardown(): Promise<void> {
    await archiveSharedRoot(this, this.context.domElement, {
      theme: this.hostContext.theme,
      requestSizeChange: async (width, height) =>
        this.requestSizeChangeAsync(width, height)
    });
  }
}
