import type { IList } from '@pnp/sp/lists';

jest.mock('@pnp/sp/items', () => ({}));
jest.mock('@pnp/sp/lists', () => ({}));
jest.mock('@pnp/sp/site-users/web', () => ({}));

import { pendingCorrelationId } from '../domain/negotiation';
import type { INegotiationSessionState } from '../domain/types';
import { NegotiationRepository } from './NegotiationRepository';
import { SAAS_RENEWAL_SCENARIO } from '../domain/scenarioCatalog';
import { NEGOTIATOR_STYLES } from '../domain/negotiatorStyle';

function repositoryWithSession(
  state: INegotiationSessionState,
  status: 'Active' | 'Completed' = 'Active'
): {
  repository: NegotiationRepository;
  update: jest.Mock;
} {
  let row = {
    Id: 42,
    ScenarioKey: 'saas-renewal',
    Status: status,
    StateJson: JSON.stringify(state),
    AuthorId: 7,
    '@odata.etag': '"1"'
  };
  const update = jest.fn(async (changes: {
    Status: 'Active' | 'Completed';
    StateJson: string;
  }) => {
    row = { ...row, ...changes, '@odata.etag': '"2"' };
  });
  const getById = jest.fn(() => ({
    select: jest.fn(() => jest.fn(async () => row)),
    update
  }));
  const repository = Object.create(
    NegotiationRepository.prototype
  ) as NegotiationRepository;
  Object.assign(repository, {
    currentUserId: 7,
    scenarioList: {} as IList,
    sessionList: { items: { getById } } as unknown as IList
  });
  return { repository, update };
}

describe('NegotiationRepository stale intent protection', () => {
  it.each(NEGOTIATOR_STYLES)('persists $label on start and preserves it through resume and ending', async (style) => {
    const { repository } = repositoryWithSession({
      draftOffer: SAAS_RENEWAL_SCENARIO.playerOpening,
      counterpartOffer: SAAS_RENEWAL_SCENARIO.counterpartOpening,
      negotiatorStyle: style.id, exchanges: []
    });
    jest.spyOn(repository, 'getActiveSession').mockResolvedValue(undefined);
    Object.assign(repository, { getScenario: jest.fn().mockResolvedValue(SAAS_RENEWAL_SCENARIO) });
    const internals = repository as unknown as { sessionList: { items: { add: jest.Mock } } };
    internals.sessionList.items.add = jest.fn().mockResolvedValue({ Id: 42 });
    const started = await repository.startSession(SAAS_RENEWAL_SCENARIO.key, style.id);
    const written = JSON.parse(internals.sessionList.items.add.mock.calls[0][0].StateJson);
    expect(written.negotiatorStyle).toBe(style.id);
    expect(started.state.negotiatorStyle).toBe(style.id);
    expect((await repository.loadSession(42)).state.negotiatorStyle).toBe(style.id);
    expect((await repository.completeSession(42, '"1"')).state.negotiatorStyle).toBe(style.id);
  });
  const pending = {
    id: 'pending-current',
    message: 'Please review this offer.',
    offer: { annualFeeChf: 102000 }
  };
  const state: INegotiationSessionState = {
    draftOffer: { annualFeeChf: 102000 },
    counterpartOffer: { annualFeeChf: 120000 },
    pending,
    exchanges: []
  };

  it('does not let an older board clear the current pending turn', async () => {
    const { repository, update } = repositoryWithSession(state);

    await expect(repository.clearPending(42, 'pending-older')).rejects.toMatchObject({
      name: 'NegotiationConflictError',
      message: expect.stringMatching(/changed in another board/i)
    });
    expect(update).not.toHaveBeenCalled();
  });

  it('clears the exact pending turn selected by the player', async () => {
    const { repository, update } = repositoryWithSession(state);

    const result = await repository.clearPending(
      42,
      pendingCorrelationId(42, pending)
    );

    expect(update).toHaveBeenCalledTimes(1);
    expect(result.state.pending).toBeUndefined();
    expect(result.revision).toBe('"2"');
  });

  it('maps a late SharePoint ETag conflict to a negotiation conflict', async () => {
    const { repository, update } = repositoryWithSession(state);
    update.mockRejectedValueOnce({
      status: 412,
      message: 'Precondition Failed'
    });

    await expect(
      repository.clearPending(42, pendingCorrelationId(42, pending))
    ).rejects.toMatchObject({
      name: 'NegotiationConflictError',
      message: expect.stringMatching(/changed in another board/i)
    });
    expect(update).toHaveBeenCalledWith(expect.any(Object), '"1"');
  });

  it('does not let an older ready board end a newer pending turn', async () => {
    const { repository, update } = repositoryWithSession(state);

    await expect(repository.completeSession(42, '"1"')).rejects.toMatchObject({
      name: 'NegotiationConflictError',
      message: expect.stringMatching(/changed in another board/i)
    });
    expect(update).not.toHaveBeenCalled();
  });

  it.each(['send an offer', 'end the practice'])(
    'rejects an older Ready revision that tries to %s',
    async (action) => {
      const readyState = { ...state, pending: undefined };
      const { repository, update } = repositoryWithSession(readyState);
      const request = action === 'send an offer'
        ? repository.savePending(
            42,
            '"older"',
            'Please review this offer.',
            pending.offer
          )
        : repository.completeSession(42, '"older"');

      await expect(request).rejects.toMatchObject({
        name: 'NegotiationConflictError',
        message: expect.stringMatching(/changed in another board/i)
      });
      expect(update).not.toHaveBeenCalled();
    }
  );

  it('reloads stale Apply and Accept decisions through the conflict path', async () => {
    const staleReply = {
      sessionItemId: 42,
      replyToPendingId: 'pending-older',
      counterpartMessage: 'Here is my response.',
      outcome: 'counter' as const,
      proposedTermsCsv: 'annualFeeChf,105000'
    };

    for (const method of ['applyReply', 'acceptCounterProposal'] as const) {
      const { repository, update } = repositoryWithSession(state);
      await expect(repository[method](staleReply)).rejects.toMatchObject({
        name: 'NegotiationConflictError',
        message: expect.stringMatching(/changed in another board/i)
      });
      expect(update).not.toHaveBeenCalled();
    }
  });

  it('treats Send and Apply from an old Active board as conflicts after completion', async () => {
    const staleReply = {
      sessionItemId: 42,
      replyToPendingId: pendingCorrelationId(42, pending),
      counterpartMessage: 'Here is my response.',
      outcome: 'accept' as const,
      proposedTermsCsv: ''
    };
    const requests = [
      (repository: NegotiationRepository) =>
        repository.savePending(42, '"1"', pending.message, pending.offer),
      (repository: NegotiationRepository) => repository.applyReply(staleReply)
    ];

    for (const request of requests) {
      const { repository, update } = repositoryWithSession(state, 'Completed');
      await expect(request(repository)).rejects.toMatchObject({
        name: 'NegotiationConflictError'
      });
      expect(update).not.toHaveBeenCalled();
    }
  });
});
