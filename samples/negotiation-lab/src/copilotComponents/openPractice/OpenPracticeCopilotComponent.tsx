import * as React from 'react';
import { BaseCopilotComponent } from '@microsoft/sp-copilot-component';

import NegotiationLabApp, {
  type INegotiationLabActions,
  type NegotiationLabView
} from '../../components/NegotiationLabApp';
import {
  inspectNegotiationLabTarget,
  provisionNegotiationLabData
} from '../../provisioning/provisionNegotiationLabData';
import { NegotiationController } from '../../shared/NegotiationController';
import { questionContextIdForSession } from '../../shared/modelContext';
import {
  archiveSharedRoot,
  renderInSharedRoot
} from '../../shared/sharedReactRoot';
import type { NegotiationOffer } from '../../domain/types';
import type { NegotiatorStyle } from '../../domain/negotiatorStyle';
import {
  openPracticePropertiesSchema,
  type IOpenPracticeCopilotComponentProperties
} from './OpenPracticeCopilotComponentProperties';

type ActiveBoardView = Extract<NegotiationLabView, { kind: 'board' }>;

function answerViewForCurrentRound(
  properties: IOpenPracticeCopilotComponentProperties,
  session: Awaited<ReturnType<NegotiationController['initialize']>>,
  view: NegotiationLabView
): ActiveBoardView | undefined {
  if (properties.mode !== 'answer' || !session || view.kind !== 'board') {
    return undefined;
  }
  const {
    scenarioKey,
    questionContextId,
    playerQuestion,
    counterpartMessage
  } = properties;
  const matchesCurrentRound =
    !!scenarioKey &&
    !!questionContextId &&
    !!playerQuestion &&
    !!counterpartMessage &&
    session.status === 'Active' &&
    !session.state.pending &&
    session.scenarioKey === scenarioKey &&
    view.session.itemId === session.itemId &&
    view.scenario.key === scenarioKey &&
    questionContextId === questionContextIdForSession(session);
  return matchesCurrentRound
    ? {
        ...view,
        answer: { question: playerQuestion, counterpartMessage }
      }
    : undefined;
}

function problemForStatus(status: string): string | undefined {
  if (status === 'permission-required') {
    return 'You need Manage Lists permission on the target site to create the sample lists.';
  }
  if (status === 'player-permission-required') {
    return 'You need View Items on the scenarios list and View, Add and Edit Items on the sessions list. Ask a site owner to give you Edit access, then check again.';
  }
  if (status === 'site-unavailable') {
    return 'The configured SharePoint site could not be reached.';
  }
  return undefined;
}

export default class OpenPracticeCopilotComponent extends BaseCopilotComponent<IOpenPracticeCopilotComponentProperties> {
  private view: NegotiationLabView = { kind: 'loading' };
  private controller?: NegotiationController;
  private loadStarted = false;
  private parsedProperties: IOpenPracticeCopilotComponentProperties = {};

  protected onInit(): Promise<void> {
    const parsed = openPracticePropertiesSchema.safeParse(this.properties);
    if (!parsed.success) {
      this.view = {
        kind: 'error',
        message: 'NegotiationLabOpenPractice received invalid input.'
      };
    } else {
      this.parsedProperties = parsed.data;
    }
    return Promise.resolve();
  }

  private setView = (view: NegotiationLabView): void => {
    this.view = view;
    if (!this.isDisposed) this.render();
  };

  private async load(): Promise<void> {
    this.setView({ kind: 'loading' });
    try {
      const inspection = await inspectNegotiationLabTarget(this.context);
      if (inspection.status !== 'ready') {
        this.setView({
          kind: 'setup',
          targetSiteUrl: inspection.targetSiteUrl,
          canProvision: inspection.status === 'ready-to-provision',
          problem: problemForStatus(inspection.status)
        });
        return;
      }
      this.controller = new NegotiationController(this.context, this.setView);
      const session = await this.controller.initialize();
      const answerView = answerViewForCurrentRound(
        this.parsedProperties,
        session,
        this.view
      );
      if (answerView) this.setView(answerView);
    } catch (error) {
      this.setView({
        kind: 'error',
        message:
          error instanceof Error ? error.message : 'Negotiation Lab could not open.'
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

  private actions(): INegotiationLabActions {
    return {
      provision: async () => {
        const inspection = await inspectNegotiationLabTarget(this.context);
        await provisionNegotiationLabData(this.context, undefined, (progress) => {
          this.setView({
            kind: 'setup',
            targetSiteUrl: inspection.targetSiteUrl,
            canProvision: false,
            progress: progress.message
          });
        });
        await this.load();
      },
      reload: async () => this.load(),
      start: async (scenarioKey: string, style: NegotiatorStyle) =>
        this.requireController().start(scenarioKey, style),
      ask: async (question: string) =>
        this.requireController().ask(question),
      send: async (message: string, offer: NegotiationOffer) =>
        this.requireController().send(message, offer),
      retry: async () => this.requireController().retry(),
      editPending: async () => this.requireController().editPending(),
      applyReply: async () => {
        throw new Error('No counterpart reply is open.');
      },
      acceptCounterProposal: async () => {
        throw new Error('No counterpart counteroffer is open.');
      },
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
        idPrefix: `negotiation-lab-open-${this.instanceId}-`,
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
