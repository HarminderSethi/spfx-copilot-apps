import type { CopilotComponentContext } from '@microsoft/sp-copilot-component';
import type { NegotiatorStyle } from '../domain/negotiatorStyle';

import type {
  INegotiationReply,
  INegotiationScenario,
  INegotiationSession,
  NegotiationOffer
} from '../domain/types';
import {
  pendingCorrelationId,
  pendingCorrelationMatches,
  validateReplyCorrelation
} from '../domain/negotiation';
import { createNegotiationRepository } from '../data/createNegotiationRepository';
import { NegotiationConflictError } from '../data/errors';
import type { NegotiationRepository } from '../data/NegotiationRepository';
import type { NegotiationLabView } from '../components/NegotiationLabApp';
import { questionContextIdForSession } from './modelContext';
import {
  deliverPracticeQuestion,
  deliverNegotiationRelay,
  syncNegotiationModelContext
} from './relayDelivery';

type ViewWriter = (view: NegotiationLabView) => void;

interface ISessionViewOptions {
  notice?: string;
  initialOfferMessage?: string;
}

const STALE_VIEW_NOTICE =
  'This practice changed in another board. Continue from the current view.';

function isNegotiationConflict(error: unknown): boolean {
  return error instanceof NegotiationConflictError ||
    (error instanceof Error && error.name === 'NegotiationConflictError');
}

/** Small UI controller shared by both component entry points. */
export class NegotiationController {
  private repository?: NegotiationRepository;
  private scenarios: INegotiationScenario[] = [];
  private current?: INegotiationSession;

  public constructor(
    private readonly context: CopilotComponentContext,
    private readonly writeView: ViewWriter
  ) {}

  private requireRepository(): NegotiationRepository {
    if (!this.repository) {
      throw new Error('Negotiation Lab data is not ready yet.');
    }
    return this.repository;
  }

  private requireCurrent(): INegotiationSession {
    if (!this.current) throw new Error('No practice is open.');
    return this.current;
  }

  private async reloadCurrent(): Promise<{
    cached: INegotiationSession;
    latest: INegotiationSession;
  }> {
    const cached = this.requireCurrent();
    const latest = await this.requireRepository().loadSession(cached.itemId);
    this.current = latest;
    return { cached, latest };
  }

  private async commit(
    command: (
      repository: NegotiationRepository,
      current: INegotiationSession
    ) => Promise<INegotiationSession>
  ): Promise<INegotiationSession | undefined> {
    const current = this.requireCurrent();
    const repository = this.requireRepository();
    try {
      return await command(repository, current);
    } catch (error) {
      if (!isNegotiationConflict(error)) throw error;
      const latest = await repository.loadSession(current.itemId);
      await this.refreshModelContext(this.scenarioFor(latest), latest);
      this.showSession(latest, { notice: STALE_VIEW_NOTICE });
      return undefined;
    }
  }

  private scenarioFor(session: INegotiationSession): INegotiationScenario {
    const scenario = this.scenarios.find(({ key }) => key === session.scenarioKey);
    if (!scenario) {
      throw new Error(`Scenario ${session.scenarioKey} is not available.`);
    }
    return scenario;
  }

  private showSession(
    session: INegotiationSession,
    options: ISessionViewOptions = {}
  ): void {
    this.current = session;
    const scenario = this.scenarioFor(session);
    if (session.status === 'Completed') {
      this.writeView({ kind: 'completed', scenario, session });
      return;
    }
    if (session.state.pending) {
      this.writeView({ kind: 'pending', scenario, session });
      return;
    }
    this.writeView({ kind: 'board', scenario, session, ...options });
  }

  /**
   * Refresh background model state after local transitions. These transitions
   * are already authoritative in SharePoint, so a host refresh failure must
   * not undo them. Sending a turn uses the strict fail-closed gateway instead.
   */
  private async refreshModelContext(
    scenario?: INegotiationScenario,
    session?: INegotiationSession
  ): Promise<void> {
    try {
      await syncNegotiationModelContext(this.context, scenario, session);
    } catch {
      // The next board action retries a complete replacement snapshot.
    }
  }

  public async initialize(): Promise<INegotiationSession | undefined> {
    this.repository = await createNegotiationRepository(this.context);
    this.scenarios = await this.repository.listScenarios();
    const active = await this.repository.getActiveSession();
    if (active) {
      await this.refreshModelContext(this.scenarioFor(active), active);
      this.showSession(active);
    } else {
      await this.refreshModelContext();
      this.writeView({ kind: 'picker', scenarios: this.scenarios });
    }
    return active;
  }

  public async loadSession(itemId: number): Promise<INegotiationSession> {
    if (!this.repository) {
      this.repository = await createNegotiationRepository(this.context);
      this.scenarios = await this.repository.listScenarios();
    }
    const session = await this.repository.loadSession(itemId);
    this.current = session;
    return session;
  }

  public showReply(session: INegotiationSession, reply: INegotiationReply): boolean {
    this.current = session;
    try {
      validateReplyCorrelation(session.state, reply);
    } catch {
      return false;
    }
    this.writeView({
      kind: 'reply',
      scenario: this.scenarioFor(session),
      session,
      reply
    });
    return true;
  }

  public showCurrent(notice?: string): void {
    this.showSession(this.requireCurrent(), { notice });
  }

  public async start(scenarioKey: string, style: NegotiatorStyle = 'medium'): Promise<void> {
    const session = await this.requireRepository().startSession(scenarioKey, style);
    await this.refreshModelContext(this.scenarioFor(session), session);
    this.showSession(session);
  }

  public async send(
    message: string,
    offer: NegotiationOffer
  ): Promise<void> {
    const saved = await this.commit((repository, current) =>
      repository.savePending(
        current.itemId,
        current.revision,
        message,
        offer
      )
    );
    if (!saved) return;
    this.showSession(saved);
    const scenario = this.scenarioFor(saved);
    await this.deliverSaved(scenario, saved);
  }

  public async ask(question: string): Promise<void> {
    const { cached, latest } = await this.reloadCurrent();
    const sameReadyRound =
      cached.status === 'Active' &&
      latest.status === 'Active' &&
      !cached.state.pending &&
      !latest.state.pending &&
      questionContextIdForSession(cached) ===
        questionContextIdForSession(latest);
    if (!sameReadyRound) {
      this.showSession(latest, { notice: STALE_VIEW_NOTICE });
      return;
    }
    await deliverPracticeQuestion(
      this.context,
      this.scenarioFor(latest),
      latest,
      question
    );
  }

  private async deliverSaved(
    scenario: INegotiationScenario,
    session: INegotiationSession
  ): Promise<void> {
    try {
      await deliverNegotiationRelay(this.context, scenario, session);
    } catch (error) {
      this.writeView({
        kind: 'pending',
        scenario,
        session,
        problem:
          error instanceof Error ? error.message : 'The turn could not be sent.'
      });
    }
  }

  public async retry(): Promise<void> {
    const cached = this.requireCurrent();
    const pending = cached.state.pending;
    if (!pending) {
      throw new Error('No saved exchange is waiting to be sent.');
    }
    const expectedPendingId = pendingCorrelationId(cached.itemId, pending);
    const latest = await this.requireRepository().loadSession(cached.itemId);
    this.current = latest;
    if (
      latest.status !== 'Active' ||
      !pendingCorrelationMatches(latest.itemId, latest.state, expectedPendingId)
    ) {
      this.showSession(latest, { notice: STALE_VIEW_NOTICE });
      return;
    }
    this.showSession(latest);
    await this.deliverSaved(this.scenarioFor(latest), latest);
  }

  public async editPending(): Promise<void> {
    const current = this.requireCurrent();
    const pending = current.state.pending;
    if (!pending) throw new Error('No saved exchange is waiting to be edited.');
    const session = await this.commit((repository) =>
      repository.clearPending(
        current.itemId,
        pendingCorrelationId(current.itemId, pending)
      )
    );
    if (!session) return;
    await this.refreshModelContext(this.scenarioFor(session), session);
    this.showSession(session, {
      notice: 'Your saved turn is back on the board.',
      initialOfferMessage: pending.message
    });
  }

  public async applyReply(reply: INegotiationReply): Promise<void> {
    const session = await this.commit((repository) =>
      repository.applyReply(reply)
    );
    if (!session) return;
    await this.refreshModelContext(this.scenarioFor(session), session);
    const continueNegotiating =
      reply.outcome === 'counter' && session.status === 'Active';
    this.showSession(
      session,
      continueNegotiating
        ? {
            notice: 'No agreement yet. Make another offer when you are ready.',
            initialOfferMessage: ''
          }
        : {}
    );
  }

  public async acceptCounterProposal(reply: INegotiationReply): Promise<void> {
    const session = await this.commit((repository) =>
      repository.acceptCounterProposal(reply)
    );
    if (!session) return;
    await this.refreshModelContext(this.scenarioFor(session), session);
    this.showSession(session);
  }

  public async endPractice(): Promise<void> {
    const session = await this.commit((repository, current) =>
      repository.completeSession(current.itemId, current.revision)
    );
    if (!session) return;
    await this.refreshModelContext(this.scenarioFor(session), session);
    this.showSession(session);
  }

  public async chooseAnother(): Promise<void> {
    const active = await this.requireRepository().getActiveSession();
    if (active) {
      await this.refreshModelContext(this.scenarioFor(active), active);
      this.showSession(active, {
        notice: 'A practice is already active. Continue from this board.'
      });
      return;
    }
    this.current = undefined;
    await this.refreshModelContext();
    this.writeView({ kind: 'picker', scenarios: this.scenarios });
  }
}
