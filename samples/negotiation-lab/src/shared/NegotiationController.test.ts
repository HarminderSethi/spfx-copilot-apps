import type { CopilotComponentContext } from '@microsoft/sp-copilot-component';

import type { NegotiationLabView } from '../components/NegotiationLabApp';
import type { NegotiationRepository } from '../data/NegotiationRepository';
import type { INegotiationReply, INegotiationSession } from '../domain/types';

jest.mock('../data/createNegotiationRepository', () => ({
  createNegotiationRepository: jest.fn()
}));
jest.mock('./relayDelivery', () => ({
  deliverPracticeQuestion: jest.fn(),
  deliverNegotiationRelay: jest.fn(),
  syncNegotiationModelContext: jest.fn().mockResolvedValue(undefined)
}));

const { createNegotiationRepository } = jest.requireMock<
  typeof import('../data/createNegotiationRepository')
>('../data/createNegotiationRepository');
const { NegotiationConflictError } = jest.requireActual<
  typeof import('../data/errors')
>('../data/errors');
const { SAAS_RENEWAL_SCENARIO: scenario } = jest.requireActual<
  typeof import('../domain/scenarioCatalog')
>('../domain/scenarioCatalog');
const { NegotiationController } = jest.requireActual<
  typeof import('./NegotiationController')
>('./NegotiationController');
const {
  deliverPracticeQuestion,
  deliverNegotiationRelay,
  syncNegotiationModelContext
} = jest.requireMock<typeof import('./relayDelivery')>('./relayDelivery');

const pending = {
  id: 'pending-42-1',
  message: 'Please review this package.',
  offer: { ...scenario.playerOpening }
};
const reply: INegotiationReply = {
  sessionItemId: 42,
  replyToPendingId: pending.id,
  counterpartMessage: 'I can meet you with this balanced package.',
  outcome: 'counter',
  proposedTermsCsv:
    'annualFeeChf,111000\ncontractMonths,36\nsupportHours,12'
};
const agreement = {
  annualFeeChf: 111000,
  contractMonths: 36,
  supportHours: 12
};
const activeSession: INegotiationSession = {
  itemId: 42,
  revision: '"1"',
  scenarioKey: scenario.key,
  status: 'Active',
  state: {
    draftOffer: { ...scenario.playerOpening },
    counterpartOffer: { ...scenario.counterpartOpening },
    pending,
    exchanges: []
  }
};
const readySession: INegotiationSession = {
  ...activeSession,
  state: { ...activeSession.state, pending: undefined }
};
const completedSession: INegotiationSession = {
  ...activeSession,
  status: 'Completed',
  state: {
    draftOffer: agreement,
    counterpartOffer: agreement,
    exchanges: [{
      playerMessage: pending.message,
      playerOffer: pending.offer,
      counterpartMessage: reply.counterpartMessage,
      outcome: 'counter',
      counterpartOffer: agreement
    }],
    agreement,
    completionReason: 'agreement'
  }
};
const continuedSession: INegotiationSession = {
  ...readySession,
  state: {
    ...readySession.state,
    counterpartOffer: agreement,
    exchanges: completedSession.state.exchanges
  }
};

type RepositoryMocks = Record<string, jest.Mock>;

function setup(
  active: INegotiationSession | undefined,
  methods: RepositoryMocks = {}
): {
  context: CopilotComponentContext;
  controller: InstanceType<typeof NegotiationController>;
  repository: RepositoryMocks;
  views: NegotiationLabView[];
} {
  const repository: RepositoryMocks = {
    listScenarios: jest.fn().mockResolvedValue([scenario]),
    getActiveSession: jest.fn().mockResolvedValue(active),
    ...methods
  };
  (createNegotiationRepository as jest.MockedFunction<
    typeof createNegotiationRepository
  >).mockResolvedValue(repository as unknown as NegotiationRepository);
  const context = {} as CopilotComponentContext;
  const views: NegotiationLabView[] = [];
  const controller = new NegotiationController(context, (view) => views.push(view));
  return { context, controller, repository, views };
}

function lastView(views: NegotiationLabView[]): NegotiationLabView | undefined {
  return views[views.length - 1];
}

describe('NegotiationController counteroffer decisions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    [
      syncNegotiationModelContext,
      deliverPracticeQuestion,
      deliverNegotiationRelay
    ].forEach((mock) => (mock as jest.Mock).mockResolvedValue(undefined));
  });

  it('restores an existing pending turn as an explicit pending view', async () => {
    const { controller, views } = setup(activeSession);

    await controller.initialize();

    expect(views).toEqual([{ kind: 'pending', scenario, session: activeSession }]);
  });

  it('shows the persisted pending turn before delivery starts', async () => {
    const { controller, repository, views } = setup(readySession, {
      loadSession: jest.fn().mockResolvedValue(activeSession),
      savePending: jest.fn().mockResolvedValue(activeSession)
    });
    let viewAtDelivery: NegotiationLabView | undefined;
    (deliverNegotiationRelay as jest.Mock).mockImplementation(async () => {
      viewAtDelivery = lastView(views);
    });

    await controller.initialize();
    await controller.send(pending.message, pending.offer);

    expect(repository.savePending).toHaveBeenCalledWith(
      readySession.itemId,
      readySession.revision,
      pending.message,
      pending.offer
    );
    expect(viewAtDelivery).toEqual({ kind: 'pending', scenario, session: activeSession });
  });

  it('reloads the authoritative view after a stale write is rejected', async () => {
    const latest = { ...activeSession, revision: '"2"' };
    const { context, controller, views } = setup(readySession, {
      savePending: jest.fn().mockRejectedValue(new NegotiationConflictError()),
      loadSession: jest.fn().mockResolvedValue(latest)
    });

    await controller.initialize();
    await controller.send('Please review this.', readySession.state.draftOffer);

    expect(deliverNegotiationRelay).not.toHaveBeenCalled();
    expect(syncNegotiationModelContext).toHaveBeenLastCalledWith(context, scenario, latest);
    expect(lastView(views)).toEqual({ kind: 'pending', scenario, session: latest });
  });

  it('keeps a failed delivery retryable without saving a second turn', async () => {
    const { controller, repository, views } = setup(readySession, {
      loadSession: jest.fn().mockResolvedValue(activeSession),
      savePending: jest.fn().mockResolvedValue(activeSession)
    });
    (deliverNegotiationRelay as jest.Mock)
      .mockRejectedValueOnce(new Error('Copilot delivery failed.'))
      .mockResolvedValueOnce(undefined);

    await controller.initialize();
    await controller.send(pending.message, pending.offer);

    expect(lastView(views)).toEqual({
      kind: 'pending',
      scenario,
      session: activeSession,
      problem: 'Copilot delivery failed.'
    });
    await controller.retry();
    expect(repository.savePending).toHaveBeenCalledTimes(1);
    expect(deliverNegotiationRelay).toHaveBeenCalledTimes(2);
  });

  it('asks the counterpart without writing negotiation state', async () => {
    const writes = [
      'startSession',
      'savePending',
      'clearPending',
      'applyReply',
      'acceptCounterProposal',
      'completeSession'
    ].reduce<RepositoryMocks>((mocks, name) => {
      mocks[name] = jest.fn();
      return mocks;
    }, {});
    const { context, controller } = setup(readySession, {
      loadSession: jest.fn().mockResolvedValue(readySession),
      ...writes
    });

    await controller.initialize();
    await controller.ask('What matters most to you?');

    expect(deliverPracticeQuestion).toHaveBeenCalledWith(
      context,
      scenario,
      readySession,
      'What matters most to you?'
    );
    expect(deliverNegotiationRelay).not.toHaveBeenCalled();
    Object.keys(writes).forEach((name) =>
      expect(writes[name]).not.toHaveBeenCalled()
    );
  });

  it('does not ask from a board whose Ready round is stale', async () => {
    const { controller, views } = setup(readySession, {
      loadSession: jest.fn().mockResolvedValue(activeSession)
    });

    await controller.initialize();
    await controller.ask('What matters most?');

    expect(deliverPracticeQuestion).not.toHaveBeenCalled();
    expect(lastView(views)).toEqual({ kind: 'pending', scenario, session: activeSession });
  });

  it('does not retry a pending turn that another board already handled', async () => {
    const { controller, views } = setup(activeSession, {
      loadSession: jest.fn().mockResolvedValue(continuedSession)
    });

    await controller.initialize();
    await controller.retry();

    expect(deliverNegotiationRelay).not.toHaveBeenCalled();
    expect(lastView(views)).toEqual({
      kind: 'board',
      scenario,
      session: continuedSession,
      notice: 'This practice changed in another board. Continue from the current view.'
    });
  });

  it('edits only the pending turn shown by the current board', async () => {
    const { context, controller, repository, views } = setup(activeSession, {
      clearPending: jest.fn().mockResolvedValue(readySession)
    });

    await controller.initialize();
    (syncNegotiationModelContext as jest.Mock).mockClear();
    await controller.editPending();

    expect(repository.clearPending).toHaveBeenCalledWith(activeSession.itemId, pending.id);
    expect(syncNegotiationModelContext).toHaveBeenCalledWith(context, scenario, readySession);
    expect(lastView(views)).toEqual({
      kind: 'board',
      scenario,
      session: readySession,
      notice: 'Your saved turn is back on the board.',
      initialOfferMessage: pending.message
    });
  });

  it('persists an accepted proposal without starting another Copilot round', async () => {
    const { context, controller, repository, views } = setup(activeSession, {
      acceptCounterProposal: jest.fn().mockResolvedValue(completedSession)
    });

    await controller.initialize();
    (syncNegotiationModelContext as jest.Mock).mockClear();
    await controller.acceptCounterProposal(reply);

    expect(repository.acceptCounterProposal).toHaveBeenCalledWith(reply);
    expect(syncNegotiationModelContext).toHaveBeenCalledWith(
      context,
      scenario,
      completedSession
    );
    expect(deliverNegotiationRelay).not.toHaveBeenCalled();
    expect(lastView(views)).toEqual({
      kind: 'completed',
      scenario,
      session: completedSession
    });
  });

  it('keeps a counteroffer as an editable draft without recording agreement', async () => {
    const { context, controller, repository, views } = setup(activeSession, {
      applyReply: jest.fn().mockResolvedValue(continuedSession)
    });

    await controller.initialize();
    (syncNegotiationModelContext as jest.Mock).mockClear();
    await controller.applyReply(reply);

    expect(repository.applyReply).toHaveBeenCalledWith(reply);
    expect(syncNegotiationModelContext).toHaveBeenCalledWith(
      context,
      scenario,
      continuedSession
    );
    expect(deliverNegotiationRelay).not.toHaveBeenCalled();
    expect(lastView(views)).toEqual({
      kind: 'board',
      scenario,
      session: continuedSession,
      notice: 'No agreement yet. Make another offer when you are ready.',
      initialOfferMessage: ''
    });
  });

  it('reopens a newer active practice instead of clearing its model context', async () => {
    const { context, controller, views } = setup(activeSession, {
      loadSession: jest.fn().mockResolvedValue(completedSession)
    });

    await controller.loadSession(completedSession.itemId);
    await controller.chooseAnother();

    expect(syncNegotiationModelContext).toHaveBeenCalledWith(
      context,
      scenario,
      activeSession
    );
    expect(lastView(views)).toEqual({ kind: 'pending', scenario, session: activeSession });
  });
});
