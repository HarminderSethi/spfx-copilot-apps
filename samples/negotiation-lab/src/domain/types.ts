import type { NegotiatorStyle } from './negotiatorStyle';
export type NegotiationValue = number | string;

export type NegotiationOffer = Record<string, NegotiationValue>;

export interface INumberNegotiationIssue {
  key: string;
  label: string;
  description?: string;
  kind: 'number';
  minimum: number;
  maximum: number;
  step: number;
  format: 'number' | 'currency';
  currency?: string;
}

export interface INegotiationChoiceOption {
  value: string;
  label: string;
}

export interface IChoiceNegotiationIssue {
  key: string;
  label: string;
  description?: string;
  kind: 'choice';
  options: INegotiationChoiceOption[];
}

export type NegotiationIssue =
  | INumberNegotiationIssue
  | IChoiceNegotiationIssue;

export interface INegotiationScenario {
  key: string;
  title: string;
  briefing: string;
  objective: string;
  playerRole: string;
  counterpartRole: string;
  counterpartBrief: string;
  issues: NegotiationIssue[];
  playerOpening: NegotiationOffer;
  counterpartOpening: NegotiationOffer;
}

export type NegotiationSessionStatus = 'Active' | 'Completed';

export type NegotiationReplyOutcome = 'counter' | 'accept' | 'decline';

export type NegotiationCompletionReason =
  | 'agreement'
  | 'player-ended'
  | 'counterpart-declined';

export interface INegotiationPendingTurn {
  /** Optional so sessions created before correlation IDs remain resumable. */
  id?: string;
  message: string;
  offer: NegotiationOffer;
}

export interface INegotiationReply {
  sessionItemId: number;
  replyToPendingId: string;
  counterpartMessage: string;
  outcome: NegotiationReplyOutcome;
  proposedTermsCsv: string;
}

export interface INegotiationExchange {
  playerMessage: string;
  playerOffer: NegotiationOffer;
  counterpartMessage: string;
  outcome: NegotiationReplyOutcome;
  counterpartOffer?: NegotiationOffer;
}

export interface INegotiationSessionState {
  negotiatorStyle?: NegotiatorStyle;
  draftOffer: NegotiationOffer;
  counterpartOffer: NegotiationOffer;
  pending?: INegotiationPendingTurn;
  exchanges: INegotiationExchange[];
  agreement?: NegotiationOffer;
  completionReason?: NegotiationCompletionReason;
}

export interface INegotiationSession {
  itemId: number;
  /** SharePoint ETag used only to reject actions from an older rendered board. */
  revision: string;
  scenarioKey: string;
  status: NegotiationSessionStatus;
  state: INegotiationSessionState;
}

export type NegotiationScenarioTerms = Pick<
  INegotiationScenario,
  | 'objective'
  | 'playerRole'
  | 'counterpartRole'
  | 'counterpartBrief'
  | 'issues'
  | 'playerOpening'
  | 'counterpartOpening'
>;

export interface INegotiationTransition {
  status: NegotiationSessionStatus;
  state: INegotiationSessionState;
}
