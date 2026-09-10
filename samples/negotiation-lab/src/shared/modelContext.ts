import type {
  INegotiationScenario,
  INegotiationSession,
  NegotiationCompletionReason,
  NegotiationOffer,
  NegotiationValue
} from '../domain/types';
import { pendingCorrelationId } from '../domain/negotiation';
import { getNegotiatorStyle, type NegotiatorStyle } from '../domain/negotiatorStyle';

export const MODEL_CONTEXT_PROTOCOL = 'negotiation-lab/v5';
export const MODEL_CONTEXT_MAX_BYTES = 6000;

interface INumberIssueContext {
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

interface IChoiceIssueContext {
  key: string;
  label: string;
  description?: string;
  kind: 'choice';
  options: Array<{ value: string; label: string }>;
}

export interface INegotiationScenarioContext {
  key: string;
  title: string;
  playerRole: string;
  counterpartRole: string;
  counterpartProfile: string;
  negotiatorStyle: ReturnType<typeof getNegotiatorStyle>;
  issues: Array<INumberIssueContext | IChoiceIssueContext>;
}

export interface IReadyNegotiationModelContext extends Record<string, unknown> {
  protocol: typeof MODEL_CONTEXT_PROTOCOL;
  interactionState: 'Ready';
  scenario?: INegotiationScenarioContext;
  binding?: {
    counterpartOffer: NegotiationOffer;
    questionContextId: string;
  };
}

export interface IAwaitingNegotiationModelContext
  extends Record<string, unknown> {
  protocol: typeof MODEL_CONTEXT_PROTOCOL;
  interactionState: 'AwaitingCounterpart';
  scenario: INegotiationScenarioContext;
  binding: {
    counterpartOffer: NegotiationOffer;
    pending: {
      sessionItemId: number;
      id: string;
      playerMessage: string;
      playerOffer: NegotiationOffer;
    };
  };
}

export interface ICompletedNegotiationModelContext
  extends Record<string, unknown> {
  protocol: typeof MODEL_CONTEXT_PROTOCOL;
  interactionState: 'Completed';
  scenario: INegotiationScenarioContext;
  result: {
    completionReason: NegotiationCompletionReason;
    agreement?: NegotiationOffer;
  };
}

export type NegotiationModelContext =
  | IReadyNegotiationModelContext
  | IAwaitingNegotiationModelContext
  | ICompletedNegotiationModelContext;

function utf8ByteLength(value: string): number {
  let bytes = 0;
  for (const character of value) {
    const codePoint = character.codePointAt(0) ?? 0;
    if (codePoint <= 0x7f) bytes += 1;
    else if (codePoint <= 0x7ff) bytes += 2;
    else if (codePoint <= 0xffff) bytes += 3;
    else bytes += 4;
  }
  return bytes;
}

function stableOpaqueHash(value: string): string {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(36);
}

function offerFingerprint(offer: NegotiationOffer): string {
  return Object.keys(offer)
    .sort()
    .map((key) => `${key}:${String(offer[key])}`)
    .join('|');
}

/** Identify one Ready round without exposing its SharePoint list item number. */
export function questionContextIdForSession(
  session: Pick<
    INegotiationSession,
    'itemId' | 'revision' | 'scenarioKey' | 'state'
  >
): string {
  const source = [
    MODEL_CONTEXT_PROTOCOL,
    session.scenarioKey,
    session.itemId,
    session.revision,
    getNegotiatorStyle(session.state.negotiatorStyle).id,
    session.state.exchanges.length,
    offerFingerprint(session.state.draftOffer),
    offerFingerprint(session.state.counterpartOffer)
  ].join('|');
  return `question-${stableOpaqueHash(source)}-${stableOpaqueHash(
    `ready|${source}`
  )}`;
}

function orderedOffer(
  scenario: INegotiationScenario,
  offer: NegotiationOffer
): NegotiationOffer {
  const ordered: NegotiationOffer = {};
  for (const issue of scenario.issues) {
    const value: NegotiationValue | undefined = offer[issue.key];
    if (
      value === undefined ||
      (typeof value === 'number' && !Number.isFinite(value))
    ) {
      throw new Error(`The model context is missing a valid ${issue.key} value.`);
    }
    ordered[issue.key] = value;
  }
  return ordered;
}

function scenarioContext(
  scenario: INegotiationScenario, style?: NegotiatorStyle
): INegotiationScenarioContext {
  return {
    key: scenario.key,
    title: scenario.title,
    playerRole: scenario.playerRole,
    counterpartRole: scenario.counterpartRole,
    counterpartProfile: scenario.counterpartBrief,
    negotiatorStyle: getNegotiatorStyle(style),
    issues: scenario.issues.map((issue) =>
      issue.kind === 'choice'
        ? {
            key: issue.key,
            label: issue.label,
            ...(issue.description ? { description: issue.description } : {}),
            kind: issue.kind,
            options: issue.options.map(({ value, label }) => ({ value, label }))
          }
        : {
            key: issue.key,
            label: issue.label,
            ...(issue.description ? { description: issue.description } : {}),
            kind: issue.kind,
            minimum: issue.minimum,
            maximum: issue.maximum,
            step: issue.step,
            format: issue.format,
            ...(issue.currency ? { currency: issue.currency } : {})
          }
    )
  };
}

export function modelContextByteLength(context: NegotiationModelContext): number {
  return utf8ByteLength(JSON.stringify(context));
}

export function serializeNegotiationModelContext(
  context: NegotiationModelContext
): string {
  const serialized = JSON.stringify(context);
  const bytes = utf8ByteLength(serialized);
  if (bytes > MODEL_CONTEXT_MAX_BYTES) {
    throw new Error(
      `The Negotiation Lab model context is ${bytes} bytes; the ${MODEL_CONTEXT_MAX_BYTES}-byte safety limit was exceeded.`
    );
  }
  return serialized;
}

function withinSizeLimit<TContext extends NegotiationModelContext>(
  context: TContext
): TContext {
  serializeNegotiationModelContext(context);
  return context;
}

/** Build one complete, replacement snapshot from authoritative lean state. */
export function buildNegotiationModelContext(
  scenario?: INegotiationScenario,
  session?: INegotiationSession
): NegotiationModelContext {
  if (!session) {
    return withinSizeLimit({
      protocol: MODEL_CONTEXT_PROTOCOL,
      interactionState: 'Ready',
      ...(scenario ? { scenario: scenarioContext(scenario) } : {})
    });
  }
  if (!scenario) {
    throw new Error('A session model context requires its scenario.');
  }
  if (session.scenarioKey !== scenario.key) {
    throw new Error('The session and scenario do not match.');
  }

  const projectedScenario = scenarioContext(scenario, session.state.negotiatorStyle);
  if (session.status === 'Completed') {
    if (!session.state.completionReason) {
      throw new Error('A completed session requires a completion reason.');
    }
    return withinSizeLimit({
      protocol: MODEL_CONTEXT_PROTOCOL,
      interactionState: 'Completed',
      scenario: projectedScenario,
      result: {
        completionReason: session.state.completionReason,
        ...(session.state.agreement
          ? { agreement: orderedOffer(scenario, session.state.agreement) }
          : {})
      }
    });
  }

  const counterpartOffer = orderedOffer(
    scenario,
    session.state.counterpartOffer
  );
  const pending = session.state.pending;
  if (!pending) {
    return withinSizeLimit({
      protocol: MODEL_CONTEXT_PROTOCOL,
      interactionState: 'Ready',
      scenario: projectedScenario,
      binding: {
        counterpartOffer,
        questionContextId: questionContextIdForSession(session)
      }
    });
  }

  return withinSizeLimit({
    protocol: MODEL_CONTEXT_PROTOCOL,
    interactionState: 'AwaitingCounterpart',
    scenario: projectedScenario,
    binding: {
      counterpartOffer,
      pending: {
        sessionItemId: session.itemId,
        id: pendingCorrelationId(session.itemId, pending),
        playerMessage: pending.message,
        playerOffer: orderedOffer(scenario, pending.offer)
      }
    }
  });
}
