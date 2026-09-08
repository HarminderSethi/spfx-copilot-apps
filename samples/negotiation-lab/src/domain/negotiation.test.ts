import {
  acceptCounterProposal,
  applyNegotiationReply,
  clearPendingTurn,
  completeNegotiation,
  createInitialSessionState,
  inspectCounterProposal,
  pendingCorrelationId,
  replyTermsProblem,
  savePendingTurn,
  type CounterProposalProblem
} from './negotiation';
import type {
  INegotiationReply,
  INegotiationSessionState,
  NegotiationOffer
} from './types';
import {
  JOB_OFFER_SCENARIO,
  SAAS_RENEWAL_SCENARIO
} from './scenarioCatalog';

function correlation(
  state: INegotiationSessionState,
  sessionItemId = 7
): string {
  if (!state.pending) throw new Error('The test requires a pending offer.');
  return pendingCorrelationId(sessionItemId, state.pending);
}

function pendingState(
  offer: NegotiationOffer = SAAS_RENEWAL_SCENARIO.playerOpening
): INegotiationSessionState {
  return savePendingTurn(
    SAAS_RENEWAL_SCENARIO,
    createInitialSessionState(SAAS_RENEWAL_SCENARIO),
    'Please review this package.',
    offer
  );
}

function counterReply(
  state: INegotiationSessionState,
  proposedTermsCsv: string
): INegotiationReply {
  return {
    sessionItemId: 7,
    replyToPendingId: correlation(state),
    counterpartMessage: 'Here is my response.',
    outcome: 'counter',
    proposedTermsCsv
  };
}

describe('lean negotiation contract', () => {
  it('saves exactly one pending offer and restores that draft for editing', () => {
    const offer = {
      annualFeeChf: 99000,
      contractMonths: 36,
      supportHours: 20
    };
    const pending = savePendingTurn(
      SAAS_RENEWAL_SCENARIO,
      createInitialSessionState(SAAS_RENEWAL_SCENARIO),
      '  Please review this package.  ',
      offer
    );

    expect(pending.pending).toMatchObject({
      message: 'Please review this package.',
      offer
    });
    expect(pending.pending?.id).toBeTruthy();
    expect(pending.draftOffer).toEqual(offer);
    expect(pending.exchanges).toHaveLength(0);
    expect(() =>
      savePendingTurn(SAAS_RENEWAL_SCENARIO, pending, 'Duplicate', offer)
    ).toThrow(/already waiting/i);

    const edited = clearPendingTurn(pending);
    expect(edited.pending).toBeUndefined();
    expect(edited.draftOffer).toEqual(offer);
  });

  it('correlates replies to one pending turn, including identical resends and pre-correlation state', () => {
    const first = pendingState();
    const second = savePendingTurn(
      SAAS_RENEWAL_SCENARIO,
      clearPendingTurn(first),
      'Please review this package.',
      SAAS_RENEWAL_SCENARIO.playerOpening
    );
    expect(correlation(second)).not.toBe(correlation(first));
    expect(() =>
      applyNegotiationReply(SAAS_RENEWAL_SCENARIO, second, {
        sessionItemId: 7,
        replyToPendingId: correlation(first),
        counterpartMessage: 'I accept the older offer.',
        outcome: 'accept',
        proposedTermsCsv: ''
      })
    ).toThrow(/older saved turn/i);

    const preCorrelation = {
      message: 'Resume my saved offer.',
      offer: { ...SAAS_RENEWAL_SCENARIO.playerOpening }
    };
    expect(pendingCorrelationId(7, preCorrelation)).toMatch(/^legacy-7-[a-z0-9]+$/);
    expect(pendingCorrelationId(7, preCorrelation)).toBe(
      pendingCorrelationId(7, preCorrelation)
    );
  });

  it('uses one pure counter evaluator for both preview and apply', () => {
    const state = pendingState();
    const original = JSON.parse(JSON.stringify(state)) as typeof state;
    const reply = counterReply(
      state,
      'annualFeeChf,111000\ncontractMonths,24\nsupportHours,12'
    );
    const preview = inspectCounterProposal(
      SAAS_RENEWAL_SCENARIO,
      state,
      reply
    );

    expect(state).toEqual(original);
    if (!preview.valid) throw new Error(preview.detail);
    const applied = applyNegotiationReply(
      SAAS_RENEWAL_SCENARIO,
      state,
      reply
    );
    expect(applied.status).toBe('Active');
    expect(applied.state.counterpartOffer).toEqual(preview.offer);
    expect(applied.state.draftOffer).toEqual(
      SAAS_RENEWAL_SCENARIO.playerOpening
    );
    expect(applied.state.pending).toBeUndefined();
    expect(applied.state.exchanges).toEqual([
      expect.objectContaining({
        playerMessage: 'Please review this package.',
        counterpartMessage: 'Here is my response.',
        counterpartOffer: preview.offer
      })
    ]);
    expect(state).toEqual(original);
  });

  it('fails closed for incomplete, repeated, and concession-free counters', () => {
    const state = pendingState();
    const original = JSON.parse(JSON.stringify(state)) as typeof state;
    const invalid: Array<{
      problem: CounterProposalProblem;
      csv: string;
    }> = [
      {
        problem: 'invalid-terms',
        csv: 'annualFeeChf,111000\ncontractMonths,24'
      },
      {
        problem: 'repeats-player',
        csv: 'annualFeeChf,102000\ncontractMonths,12\nsupportHours,16'
      },
      {
        problem: 'no-concession',
        csv: 'annualFeeChf,120000\ncontractMonths,36\nsupportHours,8'
      }
    ];

    for (const expected of invalid) {
      const reply = counterReply(state, expected.csv);
      const preview = inspectCounterProposal(
        SAAS_RENEWAL_SCENARIO,
        state,
        reply
      );
      expect(preview).toMatchObject({ valid: false, problem: expected.problem });
      if (preview.valid) throw new Error('Expected an invalid counteroffer.');
      expect(() =>
        applyNegotiationReply(SAAS_RENEWAL_SCENARIO, state, reply)
      ).toThrow(preview.detail);
      expect(state).toEqual(original);
    }
  });

  it('uses declared choice order when deciding whether a term improves', () => {
    const state = savePendingTurn(
      JOB_OFFER_SCENARIO,
      createInitialSessionState(JOB_OFFER_SCENARIO),
      'Can you improve the package?',
      JOB_OFFER_SCENARIO.playerOpening
    );
    const result = applyNegotiationReply(JOB_OFFER_SCENARIO, state, {
      sessionItemId: 9,
      replyToPendingId: correlation(state, 9),
      counterpartMessage: 'I can allow a later start.',
      outcome: 'counter',
      proposedTermsCsv:
        'baseSalaryChf,130000\nremoteDays,2\nstartTiming,four-weeks'
    });

    expect(result.state.counterpartOffer.startTiming).toBe('four-weeks');
  });

  it('accepts a valid counterpart proposal as the exact agreement', () => {
    const state = pendingState();
    const reply = counterReply(
      state,
      'annualFeeChf,111000\ncontractMonths,36\nsupportHours,12'
    );
    const result = acceptCounterProposal(
      SAAS_RENEWAL_SCENARIO,
      state,
      reply
    );
    const agreement = {
      annualFeeChf: 111000,
      contractMonths: 36,
      supportHours: 12
    };

    expect(result.status).toBe('Completed');
    expect(result.state.pending).toBeUndefined();
    expect(result.state.agreement).toEqual(agreement);
    expect(result.state.draftOffer).toEqual(agreement);
    expect(result.state.counterpartOffer).toEqual(agreement);
    expect(result.state.completionReason).toBe('agreement');
  });

  it('records an explicit acceptance or decline of the player offer', () => {
    const acceptedState = pendingState();
    const accepted = applyNegotiationReply(
      SAAS_RENEWAL_SCENARIO,
      acceptedState,
      {
        sessionItemId: 7,
        replyToPendingId: correlation(acceptedState),
        counterpartMessage: 'Agreed.',
        outcome: 'accept',
        proposedTermsCsv: ''
      }
    );
    expect(accepted.status).toBe('Completed');
    expect(accepted.state.agreement).toEqual(
      SAAS_RENEWAL_SCENARIO.playerOpening
    );
    expect(accepted.state.completionReason).toBe('agreement');

    const declinedState = pendingState();
    const declined = applyNegotiationReply(
      SAAS_RENEWAL_SCENARIO,
      declinedState,
      {
        sessionItemId: 7,
        replyToPendingId: correlation(declinedState),
        counterpartMessage: 'We cannot agree.',
        outcome: 'decline',
        proposedTermsCsv: ''
      }
    );
    expect(declined.status).toBe('Completed');
    expect(declined.state.agreement).toBeUndefined();
    expect(declined.state.completionReason).toBe('counterpart-declined');
  });

  it.each(['accept', 'decline'] as const)('rejects %s with proposed terms without changing the pending offer', (outcome) => {
    const state = pendingState();
    const original = JSON.stringify(state);
    const reply: INegotiationReply = {
      ...counterReply(state, 'annualFeeChf,108000\ncontractMonths,36\nsupportHours,8'),
      outcome
    };
    const problem = replyTermsProblem(reply);
    expect(problem).toContain('acceptance or decline');
    expect(() => applyNegotiationReply(SAAS_RENEWAL_SCENARIO, state, reply)).toThrow(problem);
    expect(JSON.stringify(state)).toBe(original);
    expect(replyTermsProblem({ ...reply, proposedTermsCsv: ' \n' })).toBeUndefined();
  });

  it('ends a ready practice without inventing an agreement or score', () => {
    const result = completeNegotiation(
      createInitialSessionState(SAAS_RENEWAL_SCENARIO)
    );

    expect(result.status).toBe('Completed');
    expect(result.state.completionReason).toBe('player-ended');
    expect(result.state.agreement).toBeUndefined();
    expect(result.state).not.toHaveProperty('score');
  });
});
