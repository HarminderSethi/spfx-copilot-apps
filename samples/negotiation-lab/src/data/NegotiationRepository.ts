import type { IList } from '@pnp/sp/lists';
import type { IWeb } from '@pnp/sp/webs';
import '@pnp/sp/items';
import '@pnp/sp/lists';
import '@pnp/sp/site-users/web';

import {
  acceptCounterProposal,
  applyNegotiationReply,
  clearPendingTurn,
  completeNegotiation,
  createInitialSessionState,
  pendingCorrelationMatches,
  savePendingTurn
} from '../domain/negotiation';
import type {
  INegotiationReply,
  INegotiationScenario,
  INegotiationSession,
  INegotiationSessionState,
  NegotiationOffer,
  NegotiationSessionStatus
} from '../domain/types';
import { NegotiationConflictError, NegotiationDataError } from './errors';
import type { NegotiatorStyle } from '../domain/negotiatorStyle';
import { requireNegotiationLists } from './negotiationLists';
import {
  SCENARIO_SELECT_FIELDS,
  scenarioFromListRow,
  type INegotiationScenarioRow
} from './scenarioListCodec';

interface INegotiationSessionRow {
  Id: number;
  ScenarioKey: string;
  Status: NegotiationSessionStatus;
  StateJson: string;
  AuthorId: number;
  'odata.etag'?: string;
  '@odata.etag'?: string;
}

const SESSION_SELECT_FIELDS = [
  'Id',
  'ScenarioKey',
  'Status',
  'StateJson',
  'AuthorId'
] as const;

function escapeODataText(value: string): string {
  return value.replace(/'/g, "''");
}

function isPreconditionError(error: unknown): boolean {
  const candidate = error as { status?: number; message?: string };
  return (
    candidate.status === 412 ||
    /(?:412|precondition|etag)/i.test(candidate.message ?? '')
  );
}

function requireEtag(row: INegotiationSessionRow): string {
  const etag = row['@odata.etag'] ?? row['odata.etag'];
  if (!etag) {
    throw new NegotiationConflictError();
  }
  return etag;
}

function requireActive(row: INegotiationSessionRow): void {
  if (row.Status !== 'Active') throw new NegotiationConflictError();
}

function requireRevision(
  row: INegotiationSessionRow,
  expectedRevision: string
): void {
  if (requireEtag(row) !== expectedRevision) {
    throw new NegotiationConflictError();
  }
}

function requirePendingCorrelation(
  row: INegotiationSessionRow,
  state: INegotiationSessionState,
  expectedPendingId: string
): void {
  if (!pendingCorrelationMatches(row.Id, state, expectedPendingId)) {
    throw new NegotiationConflictError();
  }
}

function parseState(row: INegotiationSessionRow): INegotiationSessionState {
  let value: unknown;
  try {
    value = JSON.parse(row.StateJson) as unknown;
  } catch {
    throw new NegotiationDataError(`Practice item ${row.Id} has invalid StateJson.`);
  }
  const state = value as Partial<INegotiationSessionState> | undefined;
  if (
    !state ||
    typeof state !== 'object' ||
    !state.draftOffer ||
    !state.counterpartOffer ||
    !Array.isArray(state.exchanges)
  ) {
    throw new NegotiationDataError(`Practice item ${row.Id} has incomplete state.`);
  }
  return state as INegotiationSessionState;
}

function mapSession(row: INegotiationSessionRow): INegotiationSession {
  if (row.Status !== 'Active' && row.Status !== 'Completed') {
    throw new NegotiationDataError(`Practice item ${row.Id} has an unknown status.`);
  }
  return {
    itemId: row.Id,
    revision: requireEtag(row),
    scenarioKey: row.ScenarioKey,
    status: row.Status,
    state: parseState(row)
  };
}

export class NegotiationRepository {
  private constructor(
    private readonly currentUserId: number,
    private readonly scenarioList: IList,
    private readonly sessionList: IList
  ) {}

  public static async create(web: IWeb): Promise<NegotiationRepository> {
    const [currentUser, lists] = await Promise.all([
      web.currentUser() as Promise<{ Id: number }>,
      requireNegotiationLists(web)
    ]);
    return new NegotiationRepository(
      currentUser.Id,
      lists.scenarios,
      lists.sessions
    );
  }

  public async listScenarios(): Promise<INegotiationScenario[]> {
    const rows = (await this.scenarioList.items
      .select(...SCENARIO_SELECT_FIELDS)
      .filter('Enabled eq 1')
      .orderBy('Title', true)()) as INegotiationScenarioRow[];
    return rows.map(scenarioFromListRow);
  }

  private async getScenario(scenarioKey: string): Promise<INegotiationScenario> {
    const rows = (await this.scenarioList.items
      .select(...SCENARIO_SELECT_FIELDS)
      .filter(
        `ScenarioKey eq '${escapeODataText(scenarioKey)}' and Enabled eq 1`
      )
      .top(2)()) as INegotiationScenarioRow[];
    if (rows.length !== 1) {
      throw new NegotiationDataError(
        `Enabled scenario ${scenarioKey} was not found exactly once.`
      );
    }
    return scenarioFromListRow(rows[0]);
  }

  private async getOwnedSessionRow(
    itemId: number
  ): Promise<INegotiationSessionRow> {
    let row: INegotiationSessionRow;
    try {
      row = (await this.sessionList.items
        .getById(itemId)
        .select(...SESSION_SELECT_FIELDS)()) as INegotiationSessionRow;
    } catch (error) {
      throw new NegotiationDataError(
        `Practice item ${itemId} could not be loaded: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
    if (row.AuthorId !== this.currentUserId) {
      throw new NegotiationDataError('This practice belongs to another player.');
    }
    return row;
  }

  public async getActiveSession(): Promise<INegotiationSession | undefined> {
    const rows = (await this.sessionList.items
      .select(...SESSION_SELECT_FIELDS)
      .filter(`AuthorId eq ${this.currentUserId} and Status eq 'Active'`)
      .orderBy('Modified', false)
      .top(1)()) as INegotiationSessionRow[];
    return rows[0] ? mapSession(rows[0]) : undefined;
  }

  public async startSession(
    scenarioKey: string, style: NegotiatorStyle = 'medium'
  ): Promise<INegotiationSession> {
    const active = await this.getActiveSession();
    if (active) {
      if (active.scenarioKey === scenarioKey) {
        return active;
      }
      throw new NegotiationDataError(
        'Finish the current practice before starting another scenario.'
      );
    }
    const scenario = await this.getScenario(scenarioKey);
    const added = (await this.sessionList.items.add({
      Title: `${scenario.title} practice`,
      ScenarioKey: scenario.key,
      Status: 'Active',
      StateJson: JSON.stringify(createInitialSessionState(scenario, style))
    })) as { data?: { Id?: number }; Id?: number };
    const itemId = Number(added.data?.Id ?? added.Id);
    if (!Number.isInteger(itemId) || itemId <= 0) {
      throw new NegotiationDataError('SharePoint did not return the new practice item ID.');
    }
    return this.loadSession(itemId);
  }

  public async loadSession(itemId: number): Promise<INegotiationSession> {
    return mapSession(await this.getOwnedSessionRow(itemId));
  }

  private async updateSession(
    row: INegotiationSessionRow,
    status: NegotiationSessionStatus,
    state: INegotiationSessionState
  ): Promise<INegotiationSession> {
    try {
      await this.sessionList.items.getById(row.Id).update(
        {
          Status: status,
          StateJson: JSON.stringify(state)
        },
        requireEtag(row)
      );
    } catch (error) {
      if (isPreconditionError(error)) {
        throw new NegotiationConflictError();
      }
      throw error;
    }
    return this.loadSession(row.Id);
  }

  public async savePending(
    sessionItemId: number,
    expectedRevision: string,
    message: string,
    offer: NegotiationOffer
  ): Promise<INegotiationSession> {
    const row = await this.getOwnedSessionRow(sessionItemId);
    requireActive(row);
    requireRevision(row, expectedRevision);
    const scenario = await this.getScenario(row.ScenarioKey);
    return this.updateSession(
      row,
      'Active',
      savePendingTurn(scenario, parseState(row), message, offer)
    );
  }

  public async clearPending(
    sessionItemId: number,
    expectedPendingId: string
  ): Promise<INegotiationSession> {
    const row = await this.getOwnedSessionRow(sessionItemId);
    requireActive(row);
    const state = parseState(row);
    requirePendingCorrelation(row, state, expectedPendingId);
    return this.updateSession(row, 'Active', clearPendingTurn(state));
  }

  private async prepareReply(reply: INegotiationReply): Promise<{
    row: INegotiationSessionRow;
    scenario: INegotiationScenario;
    state: INegotiationSessionState;
  }> {
    const row = await this.getOwnedSessionRow(reply.sessionItemId);
    requireActive(row);
    const state = parseState(row);
    requirePendingCorrelation(row, state, reply.replyToPendingId);
    return {
      row,
      state,
      scenario: await this.getScenario(row.ScenarioKey)
    };
  }

  public async applyReply(
    reply: INegotiationReply
  ): Promise<INegotiationSession> {
    const { row, scenario, state } = await this.prepareReply(reply);
    const transition = applyNegotiationReply(scenario, state, reply);
    return this.updateSession(row, transition.status, transition.state);
  }

  public async acceptCounterProposal(
    reply: INegotiationReply
  ): Promise<INegotiationSession> {
    const { row, scenario, state } = await this.prepareReply(reply);
    const transition = acceptCounterProposal(scenario, state, reply);
    return this.updateSession(row, transition.status, transition.state);
  }

  public async completeSession(
    sessionItemId: number,
    expectedRevision: string
  ): Promise<INegotiationSession> {
    const row = await this.getOwnedSessionRow(sessionItemId);
    if (row.Status === 'Completed') {
      return mapSession(row);
    }
    requireRevision(row, expectedRevision);
    const state = parseState(row);
    if (state.pending) {
      throw new NegotiationConflictError();
    }
    const transition = completeNegotiation(state);
    return this.updateSession(row, transition.status, transition.state);
  }
}
