import type {
  INegotiationPendingTurn,
  INegotiationReply,
  INegotiationScenario,
  INegotiationSessionState,
  INegotiationTransition,
  NegotiationIssue,
  NegotiationOffer,
  NegotiationValue
} from './types';

import { getNegotiatorStyle, type NegotiatorStyle } from './negotiatorStyle';
export const MAX_PLAYER_MESSAGE_LENGTH = 800;

function createPendingId(): string {
  const cryptoApi = globalThis.crypto as Crypto | undefined;
  if (typeof cryptoApi?.randomUUID === 'function') {
    return cryptoApi.randomUUID();
  }
  return `pending-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2)}`;
}

function stablePendingHash(pending: INegotiationPendingTurn): string {
  const input = [
    pending.message,
    ...Object.keys(pending.offer)
      .sort()
      .map((key) => `${key}:${String(pending.offer[key])}`)
  ].join('|');
  let hash = 0x811c9dc5;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(36);
}

/** Use the saved UUID, or derive a stable ID for pre-correlation state. */
export function pendingCorrelationId(
  sessionItemId: number,
  pending: INegotiationPendingTurn
): string {
  return pending.id ?? `legacy-${sessionItemId}-${stablePendingHash(pending)}`;
}

export function pendingCorrelationMatches(
  sessionItemId: number,
  state: INegotiationSessionState,
  expectedId: string
): boolean {
  return !!state.pending &&
    expectedId.trim() === pendingCorrelationId(sessionItemId, state.pending);
}

function copyOffer(offer: NegotiationOffer): NegotiationOffer {
  return { ...offer };
}

type PreferenceDirection = -1 | 0 | 1;

/** Infer whether the player prefers lower or higher values from the openings. */
function playerPreferenceDirection(
  scenario: INegotiationScenario,
  issue: NegotiationIssue
): PreferenceDirection {
  const playerValue = scenario.playerOpening[issue.key];
  const counterpartValue = scenario.counterpartOpening[issue.key];

  if (issue.kind === 'number') {
    if (
      typeof playerValue !== 'number' ||
      typeof counterpartValue !== 'number' ||
      playerValue === counterpartValue
    ) {
      return 0;
    }
    return playerValue > counterpartValue ? 1 : -1;
  }

  if (
    typeof playerValue !== 'string' ||
    typeof counterpartValue !== 'string'
  ) {
    return 0;
  }
  const playerIndex = issue.options.findIndex(
    ({ value }) => value === playerValue
  );
  const counterpartIndex = issue.options.findIndex(
    ({ value }) => value === counterpartValue
  );
  if (
    playerIndex < 0 ||
    counterpartIndex < 0 ||
    playerIndex === counterpartIndex
  ) {
    return 0;
  }
  return playerIndex > counterpartIndex ? 1 : -1;
}

export function counterImprovesAtLeastOneTermForPlayer(
  scenario: INegotiationScenario,
  priorCounterpartOffer: NegotiationOffer,
  proposedCounterpartOffer: NegotiationOffer
): boolean {
  return scenario.issues.some((issue) => {
    const direction = playerPreferenceDirection(scenario, issue);
    if (direction === 0) return false;

    const priorValue = priorCounterpartOffer[issue.key];
    const proposedValue = proposedCounterpartOffer[issue.key];
    if (issue.kind === 'number') {
      if (
        typeof priorValue !== 'number' ||
        typeof proposedValue !== 'number'
      ) {
        return false;
      }
      return direction > 0
        ? proposedValue > priorValue
        : proposedValue < priorValue;
    }

    if (
      typeof priorValue !== 'string' ||
      typeof proposedValue !== 'string'
    ) {
      return false;
    }
    const priorIndex = issue.options.findIndex(
      ({ value }) => value === priorValue
    );
    const proposedIndex = issue.options.findIndex(
      ({ value }) => value === proposedValue
    );
    if (priorIndex < 0 || proposedIndex < 0) return false;
    return direction > 0
      ? proposedIndex > priorIndex
      : proposedIndex < priorIndex;
  });
}

export function negotiationOffersMatch(
  scenario: INegotiationScenario,
  left: NegotiationOffer,
  right: NegotiationOffer
): boolean {
  return scenario.issues.every(({ key }) => left[key] === right[key]);
}

function parseValue(issue: NegotiationIssue, raw: string): NegotiationValue {
  if (issue.kind === 'choice') {
    return raw.trim();
  }
  const value = Number(raw.trim());
  if (!Number.isFinite(value)) {
    throw new Error(`${issue.label} must be a number.`);
  }
  return value;
}

function parseAbsoluteTerms(
  scenario: INegotiationScenario,
  csv: string,
  baseline: NegotiationOffer
): NegotiationOffer {
  const text = csv.trim();
  if (!text) {
    throw new Error('A counteroffer must include at least one proposed term.');
  }

  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const pairs: Array<[string, string]> = [];
  for (const line of lines) {
    const separator = line.indexOf(',');
    if (
      separator < 1 ||
      separator === line.length - 1 ||
      line.indexOf(',', separator + 1) >= 0
    ) {
      throw new Error(`Malformed proposed term: ${line}.`);
    }
    pairs.push([
      line.slice(0, separator).trim(),
      line.slice(separator + 1).trim()
    ]);
  }

  const offer = copyOffer(baseline);
  const seenIssueKeys = new Set<string>();
  for (const [key, raw] of pairs) {
    const issue = scenario.issues.find((candidate) => candidate.key === key);
    if (!issue) {
      throw new Error(`Unknown negotiation term: ${key}.`);
    }
    if (seenIssueKeys.has(key)) {
      throw new Error(`${issue.label} appears more than once in the counteroffer.`);
    }
    seenIssueKeys.add(key);
    offer[key] = parseValue(issue, raw);
  }
  const validated = validateOffer(scenario, offer);
  const missingIssue = scenario.issues.find(
    ({ key }) => !seenIssueKeys.has(key)
  );
  if (missingIssue) {
    throw new Error(
      `A counteroffer must include every term. Missing ${missingIssue.label}.`
    );
  }
  return validated;
}

export type CounterProposalProblem =
  | 'invalid-terms'
  | 'repeats-player'
  | 'no-concession';

export type CounterProposalInspection =
  | { valid: true; offer: NegotiationOffer }
  | {
      valid: false;
      problem: CounterProposalProblem;
      detail: string;
      offer?: NegotiationOffer;
    };

/** One counteroffer decision shared by preview and persistence. */
export function inspectCounterProposal(
  scenario: INegotiationScenario,
  state: INegotiationSessionState,
  reply: INegotiationReply
): CounterProposalInspection {
  const pending = state.pending;
  if (reply.outcome !== 'counter' || !pending) {
    return {
      valid: false,
      problem: 'invalid-terms',
      detail: 'A saved player offer is required before reviewing a counteroffer.'
    };
  }

  let offer: NegotiationOffer;
  try {
    offer = parseAbsoluteTerms(
      scenario,
      reply.proposedTermsCsv,
      state.counterpartOffer
    );
  } catch (error) {
    return {
      valid: false,
      problem: 'invalid-terms',
      detail: error instanceof Error ? error.message : 'The counteroffer terms are invalid.'
    };
  }

  if (negotiationOffersMatch(scenario, offer, pending.offer)) {
    return {
      valid: false,
      problem: 'repeats-player',
      detail: 'A counteroffer must change at least one term. Accept the player offer instead.',
      offer
    };
  }
  if (
    !counterImprovesAtLeastOneTermForPlayer(
      scenario,
      state.counterpartOffer,
      offer
    )
  ) {
    return {
      valid: false,
      problem: 'no-concession',
      detail: 'Copilot did not improve any term from its previous position. Edit your offer and try again.',
      offer
    };
  }
  return { valid: true, offer };
}

export function validateOffer(
  scenario: INegotiationScenario,
  offer: NegotiationOffer
): NegotiationOffer {
  const issueKeys = new Set(scenario.issues.map(({ key }) => key));
  const unknownKey = Object.keys(offer).find((key) => !issueKeys.has(key));
  if (unknownKey) {
    throw new Error(`Unknown negotiation term: ${unknownKey}.`);
  }

  const validated: NegotiationOffer = {};
  for (const issue of scenario.issues) {
    const value = offer[issue.key];
    if (issue.kind === 'choice') {
      if (
        typeof value !== 'string' ||
        !issue.options.some((option) => option.value === value)
      ) {
        throw new Error(`${issue.label} is not one of the available choices.`);
      }
    } else {
      if (
        typeof value !== 'number' ||
        !Number.isFinite(value) ||
        value < issue.minimum ||
        value > issue.maximum
      ) {
        throw new Error(
          `${issue.label} must be between ${issue.minimum} and ${issue.maximum}.`
        );
      }
      const steps = (value - issue.minimum) / issue.step;
      if (Math.abs(steps - Math.round(steps)) > 1e-9) {
        throw new Error(`${issue.label} must use increments of ${issue.step}.`);
      }
    }
    validated[issue.key] = value;
  }
  return validated;
}

export function createInitialSessionState(
  scenario: INegotiationScenario, style: NegotiatorStyle = 'medium'
): INegotiationSessionState {
  return {
    negotiatorStyle: getNegotiatorStyle(style).id,
    draftOffer: validateOffer(scenario, scenario.playerOpening),
    counterpartOffer: validateOffer(scenario, scenario.counterpartOpening),
    exchanges: []
  };
}

export function savePendingTurn(
  scenario: INegotiationScenario,
  state: INegotiationSessionState,
  message: string,
  offer: NegotiationOffer
): INegotiationSessionState {
  if (state.pending) {
    throw new Error('A player offer is already waiting for a counterpart reply.');
  }
  const playerMessage = message.trim();
  if (!playerMessage) {
    throw new Error('Enter a short message before sending the offer.');
  }
  if (playerMessage.length > MAX_PLAYER_MESSAGE_LENGTH) {
    throw new Error(
      `Keep the message to ${MAX_PLAYER_MESSAGE_LENGTH} characters or fewer.`
    );
  }
  const playerOffer = validateOffer(scenario, offer);
  return {
    ...state,
    draftOffer: copyOffer(playerOffer),
    pending: {
      id: createPendingId(),
      message: playerMessage,
      offer: copyOffer(playerOffer)
    }
  };
}

export function clearPendingTurn(
  state: INegotiationSessionState
): INegotiationSessionState {
  if (!state.pending) {
    return state;
  }
  return { ...state, pending: undefined };
}

/** Final responses refer to the saved player offer; new terms require a counter. */
export function replyTermsProblem(reply: INegotiationReply): string | undefined {
  return reply.outcome !== 'counter' && reply.proposedTermsCsv.trim()
    ? 'Copilot included proposed terms with an acceptance or decline. Review your offer and send again.'
    : undefined;
}

export function applyNegotiationReply(
  scenario: INegotiationScenario,
  state: INegotiationSessionState,
  reply: INegotiationReply
): INegotiationTransition {
  validateReplyCorrelation(state, reply);
  const termsProblem = replyTermsProblem(reply);
  if (termsProblem) throw new Error(termsProblem);
  const pending = state.pending;
  // validateReplyCorrelation establishes this invariant.
  if (!pending) throw new Error('There is no player offer waiting for a reply.');
  const counterpartMessage = reply.counterpartMessage.trim();
  if (!counterpartMessage) {
    throw new Error('The counterpart reply is empty.');
  }

  const next = clearPendingTurn(state);
  if (reply.outcome === 'counter') {
    const inspection = inspectCounterProposal(scenario, state, reply);
    if (!inspection.valid) throw new Error(inspection.detail);
    const counterpartOffer = inspection.offer;
    return {
      status: 'Active',
      state: {
        ...next,
        // Continuing records their position without silently making it ours.
        draftOffer: copyOffer(pending.offer),
        counterpartOffer,
        exchanges: [
          ...state.exchanges,
          {
            playerMessage: pending.message,
            playerOffer: copyOffer(pending.offer),
            counterpartMessage,
            outcome: reply.outcome,
            counterpartOffer: copyOffer(counterpartOffer)
          }
        ]
      }
    };
  }

  const accepted = reply.outcome === 'accept';
  const agreement = accepted ? copyOffer(pending.offer) : undefined;
  return {
    status: 'Completed',
    state: {
      ...next,
      counterpartOffer: agreement ?? next.counterpartOffer,
      exchanges: [
        ...state.exchanges,
        {
          playerMessage: pending.message,
          playerOffer: copyOffer(pending.offer),
          counterpartMessage,
          outcome: reply.outcome,
          ...(agreement ? { counterpartOffer: copyOffer(agreement) } : {})
        }
      ],
      ...(agreement ? { agreement } : {}),
      completionReason: accepted ? 'agreement' : 'counterpart-declined'
    }
  };
}

/** Accept a validated counterpart counteroffer without starting another round. */
export function acceptCounterProposal(
  scenario: INegotiationScenario,
  state: INegotiationSessionState,
  reply: INegotiationReply
): INegotiationTransition {
  if (reply.outcome !== 'counter') {
    throw new Error('Only a counterpart counteroffer can be accepted directly.');
  }

  const applied = applyNegotiationReply(scenario, state, reply);
  if (applied.status !== 'Active') {
    throw new Error('The counterpart counteroffer could not be accepted.');
  }
  const agreement = copyOffer(applied.state.counterpartOffer);
  return {
    status: 'Completed',
    state: {
      ...applied.state,
      draftOffer: copyOffer(agreement),
      agreement,
      completionReason: 'agreement'
    }
  };
}

/** Bind a model reply to one saved pending turn, including identical resends. */
export function validateReplyCorrelation(
  state: INegotiationSessionState,
  reply: INegotiationReply
): void {
  if (!state.pending) {
    throw new Error('There is no player offer waiting for a reply.');
  }
  if (!pendingCorrelationMatches(reply.sessionItemId, state, reply.replyToPendingId)) {
    throw new Error('This reply belongs to an older saved turn.');
  }
}

export function completeNegotiation(
  state: INegotiationSessionState
): INegotiationTransition {
  return {
    status: 'Completed',
    state: {
      ...clearPendingTurn(state),
      completionReason: 'player-ended'
    }
  };
}
