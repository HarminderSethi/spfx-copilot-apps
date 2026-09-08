import {
  JOB_OFFER_SCENARIO,
  SAAS_RENEWAL_SCENARIO
} from '../domain/scenarioCatalog';
import { pendingCorrelationId } from '../domain/negotiation';
import { NEGOTIATOR_STYLES } from '../domain/negotiatorStyle';
import type {
  INegotiationPendingTurn,
  INegotiationScenario,
  INegotiationSession
} from '../domain/types';
import {
  MODEL_CONTEXT_MAX_BYTES,
  MODEL_CONTEXT_PROTOCOL,
  buildNegotiationModelContext,
  modelContextByteLength,
  questionContextIdForSession,
  serializeNegotiationModelContext
} from './modelContext';

function activeSession(
  overrides: Partial<INegotiationSession> = {}
): INegotiationSession {
  return {
    itemId: 42,
    revision: '"1"',
    scenarioKey: SAAS_RENEWAL_SCENARIO.key,
    status: 'Active',
    state: {
      draftOffer: { ...SAAS_RENEWAL_SCENARIO.playerOpening },
      counterpartOffer: {
        supportHours: 8,
        annualFeeChf: 120000,
        contractMonths: 36
      },
      exchanges: []
    },
    ...overrides
  };
}

describe('lean Negotiation Lab model context', () => {
  it.each(NEGOTIATOR_STYLES)('carries the saved $label style through questions, offers and completion', (style) => {
    const ready = activeSession();
    ready.state = { ...ready.state, negotiatorStyle: style.id };
    const pending = { ...ready, state: { ...ready.state, pending: { id: 'style-turn', message: 'A trade', offer: ready.state.draftOffer } } };
    const completed: INegotiationSession = { ...ready, status: 'Completed', state: { ...ready.state, completionReason: 'player-ended' } };
    for (const session of [ready, pending, completed]) {
      const context = buildNegotiationModelContext(SAAS_RENEWAL_SCENARIO, session);
      expect(context.scenario?.negotiatorStyle).toEqual(style);
      expect(modelContextByteLength(context)).toBeLessThan(MODEL_CONTEXT_MAX_BYTES);
    }
    expect(buildNegotiationModelContext(SAAS_RENEWAL_SCENARIO, activeSession()).scenario?.negotiatorStyle.id).toBe('medium');
    expect(questionContextIdForSession({ ...ready, state: { ...ready.state, negotiatorStyle: 'cool' } }))
      .not.toBe(questionContextIdForSession({ ...ready, state: { ...ready.state, negotiatorStyle: 'hard' } }));
  });
  it('clears stale state with a minimal Ready snapshot', () => {
    expect(buildNegotiationModelContext()).toEqual({
      protocol: MODEL_CONTEXT_PROTOCOL,
      interactionState: 'Ready'
    });
  });

  it('builds an ordered Ready snapshot without player-only fields', () => {
    const context = buildNegotiationModelContext(
      SAAS_RENEWAL_SCENARIO,
      activeSession()
    );
    if (context.interactionState !== 'Ready' || !context.binding) {
      throw new Error('Expected an active Ready snapshot.');
    }

    expect(context.scenario?.issues.map(({ key }) => key)).toEqual([
      'annualFeeChf',
      'contractMonths',
      'supportHours'
    ]);
    expect(context.scenario?.issues.map(({ description }) => description)).toEqual(
      SAAS_RENEWAL_SCENARIO.issues.map(({ description }) => description)
    );
    expect(Object.keys(context.binding.counterpartOffer)).toEqual([
      'annualFeeChf',
      'contractMonths',
      'supportHours'
    ]);
    expect(context.binding.questionContextId).toBe(
      questionContextIdForSession(activeSession())
    );
    expect(context.binding.questionContextId).toMatch(
      /^question-[a-z0-9]+-[a-z0-9]+$/
    );
    expect(context.binding.questionContextId).not.toContain('42');
    const serialized = serializeNegotiationModelContext(context);
    expect(JSON.parse(serialized)).toEqual(context);
    expect(serialized).not.toMatch(
      /"(?:briefing|objective|playerOpening|siteUrl|etag|stateJson)"/
    );
    expect(modelContextByteLength(context)).toBeLessThan(
      MODEL_CONTEXT_MAX_BYTES
    );
  });

  it('fingerprints each Ready round input independently and ignores offer key order', () => {
    const session = activeSession();
    const current = questionContextIdForSession(session);
    const identify = (overrides: Partial<INegotiationSession>): string =>
      questionContextIdForSession(activeSession(overrides));

    expect(identify({ itemId: 43 })).not.toBe(current);
    expect(identify({ revision: '"2"' })).not.toBe(current);
    expect(
      identify({
        state: {
          ...session.state,
          draftOffer: {
            ...session.state.draftOffer,
            annualFeeChf: 99000
          }
        }
      })
    ).not.toBe(current);
    expect(
      identify({
        state: {
          ...session.state,
          counterpartOffer: {
            ...session.state.counterpartOffer,
            annualFeeChf: 114000
          }
        }
      })
    ).not.toBe(current);
    expect(
      identify({
        state: {
          ...session.state,
          exchanges: [
            {
              playerMessage: 'Previous offer',
              playerOffer: { ...SAAS_RENEWAL_SCENARIO.playerOpening },
              counterpartMessage: 'Previous reply',
              outcome: 'counter',
              counterpartOffer: { ...SAAS_RENEWAL_SCENARIO.counterpartOpening }
            }
          ]
        }
      })
    ).not.toBe(current);
    expect(
      identify({
        state: {
          ...session.state,
          draftOffer: {
            supportHours: 16,
            contractMonths: 12,
            annualFeeChf: 102000
          },
          counterpartOffer: {
            contractMonths: 36,
            annualFeeChf: 120000,
            supportHours: 8
          }
        }
      })
    ).toBe(current);
  });

  it('retains choice values in scenario order', () => {
    const context = buildNegotiationModelContext(JOB_OFFER_SCENARIO);
    const choice = context.scenario?.issues.find(
      ({ key }) => key === 'startTiming'
    );
    if (!choice || choice.kind !== 'choice') {
      throw new Error('Expected the start timing choice issue.');
    }
    expect(choice.options.map(({ value }) => value)).toEqual([
      'immediate',
      'two-weeks',
      'four-weeks'
    ]);
  });

  it('uses a persisted pending identifier in an AwaitingCounterpart snapshot', () => {
    const pending = {
      id: 'pending-42-1',
      message: 'I can commit for two years if the annual fee comes down.',
      offer: {
        supportHours: 16,
        contractMonths: 12,
        annualFeeChf: 102000
      }
    } as INegotiationPendingTurn & { id: string };
    const context = buildNegotiationModelContext(
      SAAS_RENEWAL_SCENARIO,
      activeSession({
        state: {
          ...activeSession().state,
          pending
        }
      })
    );
    if (context.interactionState !== 'AwaitingCounterpart') {
      throw new Error('Expected an AwaitingCounterpart snapshot.');
    }

    expect(context.binding.pending).toMatchObject({
      sessionItemId: 42,
      id: 'pending-42-1',
      playerMessage: pending.message
    });
    expect(Object.keys(context.binding.pending.playerOffer)).toEqual([
      'annualFeeChf',
      'contractMonths',
      'supportHours'
    ]);
  });

  it('creates a stable correlation fallback for pre-correlation pending state', () => {
    const pending: INegotiationPendingTurn = {
      message: 'Saved before correlation IDs were added',
      offer: { ...SAAS_RENEWAL_SCENARIO.playerOpening }
    };
    const session = activeSession({
      state: { ...activeSession().state, pending }
    });
    const context = buildNegotiationModelContext(
      SAAS_RENEWAL_SCENARIO,
      session
    );
    if (context.interactionState !== 'AwaitingCounterpart') {
      throw new Error('Expected an AwaitingCounterpart snapshot.');
    }

    expect(context.binding.pending.id).toBe(
      pendingCorrelationId(session.itemId, pending)
    );
    expect(context.binding.pending.id).toMatch(/^legacy-42-[a-z0-9]+$/);
  });

  it('builds a Completed snapshot with an ordered agreement', () => {
    const context = buildNegotiationModelContext(
      SAAS_RENEWAL_SCENARIO,
      activeSession({
        status: 'Completed',
        state: {
          ...activeSession().state,
          completionReason: 'agreement',
          agreement: {
            supportHours: 16,
            contractMonths: 12,
            annualFeeChf: 102000
          }
        }
      })
    );
    if (context.interactionState !== 'Completed') {
      throw new Error('Expected a Completed snapshot.');
    }

    expect(context.result.completionReason).toBe('agreement');
    expect(Object.keys(context.result.agreement ?? {})).toEqual([
      'annualFeeChf',
      'contractMonths',
      'supportHours'
    ]);
    expect('binding' in context).toBe(false);
  });

  it('fails closed using UTF-8 bytes rather than string length', () => {
    const oversizedScenario: INegotiationScenario = {
      ...SAAS_RENEWAL_SCENARIO,
      counterpartBrief: 'é'.repeat(3000)
    };
    expect(oversizedScenario.counterpartBrief.length).toBe(3000);
    expect(() => buildNegotiationModelContext(oversizedScenario)).toThrow(
      /6000-byte safety limit/
    );
  });

  it('rejects a session paired with the wrong scenario', () => {
    expect(() =>
      buildNegotiationModelContext(JOB_OFFER_SCENARIO, activeSession())
    ).toThrow(/do not match/);
  });
});
