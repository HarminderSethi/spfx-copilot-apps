/**
 * Thin client over the Work IQ Chat API (REST domain).
 *
 * - `POST /rest/conversations` -> 201, returns an `id`
 * - `POST /rest/conversations/{id}/chat` -> 200, one turn
 *
 * Reference: https://learn.microsoft.com/microsoft-365/copilot/extensibility/work-iq/rest/overview
 *
 * Auth uses `context.aadHttpClientFactory.getClient(resource)`: delegated
 * token, granted once via `webApiPermissionRequests` in
 * `config/package-solution.json`, no middle tier. Work IQ's CORS policy
 * allows direct browser calls (`Access-Control-Allow-Origin: *`), verified
 * against a live tenant; see the README's "Known limitations".
 *
 * `useMock` defaults to `true` and goes through the same
 * {@link WorkIQService.toAnswer} extraction as live responses. See
 * `core/mockResponses.ts` for the two citation shapes it models.
 */
import { AadHttpClient, type AadHttpClientFactory, type HttpClientResponse } from '@microsoft/sp-http';

import { createMockChatResponse, createMockConversation } from './mockResponses';
import type {
  IWorkIQAnswer,
  IWorkIQChatRequest,
  IWorkIQContextualResources,
  IWorkIQConversation,
  IWorkIQMessage
} from './workIQTypes';

/** App ID URI passed to `aadHttpClientFactory.getClient()`. SPFx appends `/.default` itself. */
export const WORK_IQ_RESOURCE = 'api://workiq.svc.cloud.microsoft';

export const WORK_IQ_HOST = 'https://workiq.svc.cloud.microsoft';

/** `beta` is unsupported in production per the docs; this sample defaults to `v1`. */
export type WorkIQApiVersion = 'v1' | 'beta';

export interface IWorkIQServiceOptions {
  /** Defaults to `true`; the sample runs fully offline out of the box. */
  useMock?: boolean;
  /** Required when `useMock` is `false`. */
  aadHttpClientFactory?: AadHttpClientFactory;
  apiVersion?: WorkIQApiVersion;
  /** IANA time zone id. Defaults to the browser's. */
  timeZone?: string;
  /** Overrides the service host. Point this at a proxy if you need one. */
  host?: string;
}

/** Per-turn grounding options, passed straight through to the API. */
export interface ISendMessageOptions {
  additionalContext?: string[];
  contextualResources?: IWorkIQContextualResources;
}

export class WorkIQService {
  private readonly _useMock: boolean;
  private readonly _aadHttpClientFactory: AadHttpClientFactory | undefined;
  private readonly _apiVersion: WorkIQApiVersion;
  private readonly _timeZone: string;
  private readonly _host: string;

  /** Mock-only turn counter, standing in for the API's server-side state. */
  private _mockTurnCount: number = 0;

  private _client: AadHttpClient | undefined;

  public constructor(options: IWorkIQServiceOptions = {}) {
    this._useMock = options.useMock !== false;
    this._aadHttpClientFactory = options.aadHttpClientFactory;
    this._apiVersion = options.apiVersion || 'v1';
    this._timeZone = options.timeZone || resolveBrowserTimeZone();
    this._host = options.host || WORK_IQ_HOST;

    if (!this._useMock && !this._aadHttpClientFactory) {
      throw new Error(
        'WorkIQService: aadHttpClientFactory is required when useMock is false.'
      );
    }
  }

  public get useMock(): boolean {
    return this._useMock;
  }

  /** Call once per session; pass the id to {@link sendMessage} for follow-up turns. */
  public async startConversation(): Promise<string> {
    if (this._useMock) {
      await delay(200);
      this._mockTurnCount = 0;
      return createMockConversation().id;
    }

    const conversation = await this._post<IWorkIQConversation>(
      `${this._baseUrl}/conversations`,
      {}
    );

    if (!conversation || !conversation.id) {
      throw new Error('Work IQ did not return a conversation id.');
    }

    return conversation.id;
  }

  /** `locationHint` is required on every call; how Work IQ resolves relative dates. */
  public async sendMessage(
    conversationId: string,
    questionText: string,
    options: ISendMessageOptions = {}
  ): Promise<IWorkIQAnswer> {
    if (!conversationId) {
      throw new Error('WorkIQService.sendMessage: conversationId is required.');
    }

    if (this._useMock) {
      await delay(700);
      this._mockTurnCount += 1;
      return this.toAnswer(
        createMockChatResponse(conversationId, questionText, this._mockTurnCount)
      );
    }

    const body: IWorkIQChatRequest = {
      message: { text: questionText },
      locationHint: { timeZone: this._timeZone }
    };

    if (options.additionalContext && options.additionalContext.length > 0) {
      body.additionalContext = options.additionalContext.map((text) => ({ text }));
    }

    if (options.contextualResources) {
      body.contextualResources = options.contextualResources;
    }

    const conversation = await this._post<IWorkIQConversation>(
      `${this._baseUrl}/conversations/${encodeURIComponent(conversationId)}/chat`,
      body
    );

    return this.toAnswer(conversation);
  }

  /** Shared by mock and live paths; the seam that makes `useMock` a drop-in switch. */
  public toAnswer(conversation: IWorkIQConversation): IWorkIQAnswer {
    const messages: IWorkIQMessage[] = conversation.messages || [];
    const answer = messages[messages.length - 1];

    if (!answer) {
      throw new Error('Work IQ returned a conversation with no messages.');
    }

    return {
      text: answer.text || '',
      attributions: answer.attributions || [],
      references: answer.references,
      sensitivityLabel: answer.sensitivityLabel,
      turnCount: conversation.turnCount,
      conversationId: conversation.id
    };
  }

  private get _baseUrl(): string {
    return this._apiVersion === 'beta' ? `${this._host}/rest/beta` : `${this._host}/rest`;
  }

  private async _post<T>(url: string, body: unknown): Promise<T> {
    const client = await this._getClient();

    const response: HttpClientResponse = await client.post(
      url,
      AadHttpClient.configurations.v1,
      {
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      }
    );

    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      throw new Error(
        `Work IQ request failed (${response.status} ${response.statusText}): ${detail}`
      );
    }

    return (await response.json()) as T;
  }

  private async _getClient(): Promise<AadHttpClient> {
    if (!this._client) {
      this._client = await this._aadHttpClientFactory!.getClient(WORK_IQ_RESOURCE);
    }

    return this._client;
  }
}

function resolveBrowserTimeZone(): string {
  try {
    const resolved = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return resolved || 'UTC';
  } catch {
    return 'UTC';
  }
}

function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
