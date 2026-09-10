import {
  createCopilotTextContent,
  type CopilotComponentContext
} from '@microsoft/sp-copilot-component';

import type {
  INegotiationScenario,
  INegotiationSession
} from '../domain/types';
import { MAX_PLAYER_MESSAGE_LENGTH } from '../domain/negotiation';
import { buildNegotiationModelContext } from './modelContext';

/** Replace the model's Negotiation Lab snapshot without adding chat content. */
export async function syncNegotiationModelContext(
  context: CopilotComponentContext,
  scenario?: INegotiationScenario,
  session?: INegotiationSession
): Promise<void> {
  await context.copilotBridge.updateModelContextAsync({
    structuredContent: buildNegotiationModelContext(scenario, session)
  });
}

async function sendAfterContextSync(
  context: CopilotComponentContext,
  scenario: INegotiationScenario,
  session: INegotiationSession,
  message: string,
  prepareError: string,
  deliveryError: string
): Promise<void> {
  try {
    await syncNegotiationModelContext(context, scenario, session);
  } catch {
    throw new Error(prepareError);
  }

  try {
    const result = await context.copilotBridge.sendFollowUpMessageAsync([
      createCopilotTextContent(message)
    ]);
    if (!result.isError) return;
  } catch {
    // Transport failures and host rejection share the same recovery action.
  }
  throw new Error(deliveryError);
}

/**
 * Synchronize authoritative state before sending the player's natural message.
 * A synchronization or delivery failure leaves the saved pending turn intact
 * so Retry/Edit can recover without creating another round.
 */
export async function deliverNegotiationRelay(
  context: CopilotComponentContext,
  scenario: INegotiationScenario,
  session: INegotiationSession
): Promise<void> {
  const pending = session.state.pending;
  if (!pending) {
    throw new Error('Save a message and offer before sending the turn.');
  }
  await sendAfterContextSync(
    context,
    scenario,
    session,
    pending.message,
    'Copilot could not prepare the saved turn. Retry from this board.',
    'Copilot did not accept the saved turn. Retry from this board.'
  );
}

/** Ask in persona without creating a pending turn or changing SharePoint. */
export async function deliverPracticeQuestion(
  context: CopilotComponentContext,
  scenario: INegotiationScenario,
  session: INegotiationSession,
  question: string
): Promise<void> {
  const normalized = question.trim();
  if (!normalized || normalized.length > MAX_PLAYER_MESSAGE_LENGTH) {
    throw new Error('Enter a shorter question before asking the counterpart.');
  }
  if (session.status !== 'Active' || session.state.pending) {
    throw new Error('Finish the current negotiation action before asking a question.');
  }

  await sendAfterContextSync(
    context,
    scenario,
    session,
    normalized,
    'Copilot could not prepare the question. Try asking again.',
    'Copilot did not accept the question. Try asking again.'
  );
}
