import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { BaseCopilotComponent } from '@microsoft/sp-copilot-component';
import type { ICopilotComponentHostContext, SPCopilotDisplayMode } from '@microsoft/sp-copilot-component';

import WorkIQAnswers from './components/WorkIQAnswers';
import type { IWorkIQAnswersProps } from './components/IWorkIQAnswersProps';
import type { IWorkIQAnswersCopilotComponentProperties } from './WorkIQAnswersCopilotComponentProperties';
import { toCitations, type ICitation } from './core/citations';
import { parseAnswer, type IAnswerBlock } from './core/entityParser';
import { fireAndForget } from './core/promises';
import { WorkIQService } from './core/WorkIQService';
import type { IWorkIQSensitivityLabel } from './core/workIQTypes';

import * as strings from 'WorkIQAnswersCopilotComponentStrings';

/**
 * Set to `false` to call the live Work IQ Chat API. Requires the
 * `WorkIQAgent.Ask` permission request approved (see `config/package-solution.json`
 * and the README) and Work IQ set up in the tenant.
 */
const USE_MOCK: boolean = true;

/** Sends the user's question to Work IQ and renders the answer as structured UI. */
export default class WorkIQAnswersCopilotComponent extends BaseCopilotComponent<IWorkIQAnswersCopilotComponentProperties> {
  private _service!: WorkIQService;
  private _conversationId: string = '';

  private _question: string = '';
  private _blocks: IAnswerBlock[] = [];
  private _citations: ICitation[] = [];
  private _sensitivityLabel: IWorkIQSensitivityLabel | undefined;
  private _turnCount: number = 0;

  private _isLoading: boolean = false;
  private _errorMessage: string | undefined;

  /** Discards the result of a superseded call if a newer one started first. */
  private _askRequestId: number = 0;

  protected async onInit(): Promise<void> {
    this._service = new WorkIQService({
      useMock: USE_MOCK,
      aadHttpClientFactory: this.context.aadHttpClientFactory
    });

    this._question = this.properties.question || '';

    if (this._question.length === 0) {
      return;
    }

    await this._ask(this._question);
  }

  private async _ask(questionText: string): Promise<void> {
    const requestId = ++this._askRequestId;

    this._question = questionText;
    this._isLoading = true;
    this._errorMessage = undefined;
    this.render();

    try {
      if (!this._conversationId) {
        this._conversationId = await this._service.startConversation();
      }

      const answer = await this._service.sendMessage(this._conversationId, questionText);

      if (requestId !== this._askRequestId) {
        return;
      }

      this._blocks = parseAnswer(answer.text);
      this._citations = toCitations(answer.attributions, answer.references);
      this._sensitivityLabel = answer.sensitivityLabel;
      this._turnCount = answer.turnCount;
    } catch (error) {
      if (requestId !== this._askRequestId) {
        return;
      }

      this._errorMessage = error instanceof Error ? error.message : String(error);
    } finally {
      if (requestId === this._askRequestId) {
        this._isLoading = false;
        this.render();
      }
    }
  }

  protected onHostContextChanged(diff: Partial<ICopilotComponentHostContext>): void {
    if (diff.displayMode !== undefined || diff.theme !== undefined) {
      this.render();
    }
  }

  protected render(): void {
    const props: IWorkIQAnswersProps = {
      question: this._question,
      blocks: this._blocks,
      citations: this._citations,
      sensitivityLabel: this._sensitivityLabel,
      turnCount: this._turnCount,
      isLoading: this._isLoading,
      errorMessage: this._errorMessage,
      isMock: this._service ? this._service.useMock : USE_MOCK,
      onAskFollowUp: (question: string) => {
        fireAndForget(this._ask(question));
      },
      onRetry: () => {
        fireAndForget(this._ask(this._question));
      },
      hostContext: this.hostContext,
      bridge: this.context.copilotBridge,
      onRequestDisplayMode: async (mode: SPCopilotDisplayMode) => {
        await this.requestDisplayModeAsync(mode);
      },
      targetDocument: this.context.domElement.ownerDocument,
      strings
    };

    ReactDOM.render(React.createElement(WorkIQAnswers, props), this.context.domElement);
  }

  protected async onTeardown(): Promise<void> {
    this._askRequestId++;
    ReactDOM.unmountComponentAtNode(this.context.domElement);
  }
}
