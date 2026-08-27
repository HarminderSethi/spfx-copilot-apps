/**
 * Wire types for the Work IQ Chat API (REST domain).
 *
 * - Create: https://learn.microsoft.com/microsoft-365/copilot/extensibility/work-iq/rest/copilotroot-post-conversations
 * - Chat: https://learn.microsoft.com/microsoft-365/copilot/extensibility/work-iq/rest/copilotconversation-chat
 *
 * Auth is delegated only (`WorkIQAgent.Ask`); no application-only permission exists.
 */

/** `attributionType` discriminates real sources from inline annotations. */
export type WorkIQAttributionType = 'citation' | 'annotation';

/** Where the attribution came from: retrieved content vs. the model's own link. */
export type WorkIQAttributionSource = 'grounding' | 'model';

/** One entry in a response message's `attributions` array. Annotations ship `providerDisplayName` as `""`, not `undefined`. */
export interface IWorkIQAttribution {
  attributionType: WorkIQAttributionType;
  providerDisplayName?: string;
  attributionSource?: WorkIQAttributionSource;
  seeMoreWebUrl?: string;
  imageWebUrl?: string;
  imageFavIcon?: string;
  imageWidth?: number;
  imageHeight?: number;
}

/** Every field is nullable; an unlabeled answer still returns the object with all values null. */
/* eslint-disable @rushstack/no-new-null -- matches the actual wire format */
export interface IWorkIQSensitivityLabel {
  sensitivityLabelId?: string | null;
  displayName?: string | null;
  tooltip?: string | null;
  priority?: number | null;
  color?: string | null;
  isEncrypted?: boolean | null;
}
/* eslint-enable @rushstack/no-new-null */

/**
 * One entry in a response message's `references` map. Not in the published
 * reference, observed on live responses, keyed by the URL fragment on
 * inline `[N](url)` citation links. See `core/citations.ts`.
 */
export interface IWorkIQConversationReference {
  '@odata.type'?: string;
  targetLink: string;
  isCitedInResponse: boolean;
}

/** The echoed prompt and the answer share the same `@odata.type`, not a usable discriminator. Answer is the last `messages` element. */
export interface IWorkIQMessage {
  '@odata.type'?: string;
  id: string;
  text: string;
  createdDateTime?: string;
  adaptiveCards?: unknown[];
  attributions?: IWorkIQAttribution[];
  references?: { [key: string]: IWorkIQConversationReference };
  sensitivityLabel?: IWorkIQSensitivityLabel;
}

/** Returned by both create and chat. `status` is documented on create, `state` on chat, both modelled. */
export interface IWorkIQConversation {
  id: string;
  createdDateTime?: string;
  displayName?: string;
  status?: string;
  state?: string;
  turnCount: number;
  messages?: IWorkIQMessage[];
}

/** A OneDrive or SharePoint file pinned as grounding for a single turn. */
export interface IWorkIQContextualFile {
  uri: string;
}

/** Per-message toggle for web search grounding (enterprise grounding stays on). */
export interface IWorkIQWebContext {
  isWebEnabled: boolean;
}

/** Optional scoping for a single chat turn. */
export interface IWorkIQContextualResources {
  files?: IWorkIQContextualFile[];
  webContext?: IWorkIQWebContext;
}

/** Free-text grounding passed alongside the prompt. */
export interface IWorkIQContextMessage {
  text: string;
}

/** Request body for `POST /conversations/{conversationId}/chat`. */
export interface IWorkIQChatRequest {
  message: { text: string };
  /** Required by the API on every chat call. `timeZone` must be an IANA id. */
  locationHint: { timeZone: string };
  additionalContext?: IWorkIQContextMessage[];
  contextualResources?: IWorkIQContextualResources;
}

/** What the UI needs from one completed turn. */
export interface IWorkIQAnswer {
  /** Raw answer markdown, citation markup still embedded. See `entityParser.ts`. */
  text: string;
  attributions: IWorkIQAttribution[];
  references?: { [key: string]: IWorkIQConversationReference };
  sensitivityLabel?: IWorkIQSensitivityLabel;
  /** Server-side turn counter; increments across a multi-turn conversation. */
  turnCount: number;
  conversationId: string;
}
