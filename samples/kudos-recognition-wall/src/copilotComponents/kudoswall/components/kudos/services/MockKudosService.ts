import type {
  IKudos,
  IKudosFilters,
  IKudosService,
  ILeaderboardEntry,
  IPerson,
  ISendKudosInput,
  KudosTimeRange,
} from '../models/kudos.types';
import { ALL_TEAMS } from '../constants/kudos.constants';

const P = (id: string, displayName: string, department: string): IPerson => ({
  id,
  displayName,
  department,
});

export const PEOPLE = {
  sarah: P('sarah', 'Sarah Chen', 'Finance'),
  miguel: P('miguel', 'Miguel Santos', 'Finance'),
  priya: P('priya', 'Priya Raman', 'Engineering'),
  rory: P('rory', 'Rory O’Donnell', 'Research'),
  aisha: P('aisha', 'Aisha Mensah', 'Engineering'),
  tomas: P('tomas', 'Tomás Novák', 'Research'),
  elena: P('elena', 'Elena Fischer', 'Operations'),
  james: P('james', 'James Whitfield', 'Operations'),
};

const hoursAgo = (h: number): string => new Date(Date.now() - h * 3600_000).toISOString();

export const MOCK_KUDOS: IKudos[] = [
  {
    id: 'k1',
    giver: PEOPLE.miguel,
    recipient: PEOPLE.sarah,
    value: 'teamwork',
    message:
      'Sarah picked up the client demo forty minutes before it started and carried it as if she had built the deck herself. Nobody in the room knew.',
    createdOn: hoursAgo(2),
  },
  {
    id: 'k2',
    giver: PEOPLE.priya,
    recipient: PEOPLE.rory,
    value: 'innovation',
    message:
      'Rory rebuilt the spectrum valuation model overnight so the Nordic team could test three new scenarios before the regulator call.',
    createdOn: hoursAgo(5),
  },
  {
    id: 'k3',
    giver: PEOPLE.sarah,
    recipient: PEOPLE.aisha,
    value: 'extraMile',
    message:
      'Aisha steered the Dublin stakeholder workshop single-handed when the flights fell through — and still sent notes the same evening.',
    createdOn: hoursAgo(26),
  },
  {
    id: 'k4',
    giver: PEOPLE.tomas,
    recipient: PEOPLE.elena,
    value: 'clientImpact',
    message:
      'Elena turned a difficult procurement conversation into a clear, candid recommendation the client acted on within a week.',
    createdOn: hoursAgo(30),
  },
  {
    id: 'k5',
    giver: PEOPLE.aisha,
    recipient: PEOPLE.tomas,
    value: 'teamwork',
    message:
      'Tomás held the whole fibre benchmark together while two of us were on leave. Quietly, and without being asked.',
    createdOn: hoursAgo(50),
  },
  {
    id: 'k6',
    giver: PEOPLE.elena,
    recipient: PEOPLE.priya,
    value: 'innovation',
    message:
      'Priya’s reworking of the DataHub cohort query cut the analysis from two days to an afternoon.',
    createdOn: hoursAgo(74),
  },
  {
    id: 'k7',
    giver: PEOPLE.rory,
    recipient: PEOPLE.miguel,
    value: 'clientImpact',
    message:
      'Miguel charted a clear course through the National Broadband governance review — the client called the note the most useful thing they read this quarter.',
    createdOn: hoursAgo(98),
  },
  {
    id: 'k8',
    giver: PEOPLE.sarah,
    recipient: PEOPLE.james,
    value: 'extraMile',
    message:
      'James stayed on the call until midnight to make sure the space-sector data landed correctly.',
    createdOn: hoursAgo(146),
  },
];

const delay = <T,>(value: T, ms = 220): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

/** Drop-in stand-in for the real SharePoint list / Graph-backed service. */
export class MockKudosService implements IKudosService {
  private items: IKudos[] = [...MOCK_KUDOS];

  public async getKudos(filters: IKudosFilters): Promise<IKudos[]> {
    return delay(
      this.items.filter(
        (k) =>
          (filters.value === 'all' || k.value === filters.value) &&
          (filters.department === ALL_TEAMS || k.recipient.department === filters.department),
      ),
    );
  }

  public async getMostRecognised(_range: KudosTimeRange): Promise<ILeaderboardEntry[]> {
    return delay([
      { person: PEOPLE.sarah, count: 14 },
      { person: PEOPLE.aisha, count: 11 },
      { person: PEOPLE.tomas, count: 9 },
      { person: PEOPLE.priya, count: 7 },
      { person: PEOPLE.elena, count: 6 },
    ]);
  }

  public async getTopGivers(_range: KudosTimeRange): Promise<ILeaderboardEntry[]> {
    return delay([
      { person: PEOPLE.miguel, count: 18 },
      { person: PEOPLE.sarah, count: 12 },
      { person: PEOPLE.rory, count: 10 },
    ]);
  }

  public async getDepartments(): Promise<string[]> {
    return delay([
      'Finance',
      'Engineering',
      'Research',
      'Operations',
    ]);
  }

  public async sendKudos(input: ISendKudosInput): Promise<IKudos> {
    const found = Object.values(PEOPLE).find((p) => p.id === input.recipientId) ?? PEOPLE.sarah;
    // Chosen team wins over the person's default department, mirroring the list.
    const recipient: IPerson = { ...found, department: input.team ?? found.department };
    const created: IKudos = {
      id: `k${Date.now()}`,
      giver: PEOPLE.miguel, // real service uses the signed-in user
      recipient,
      value: input.value,
      message: input.message,
      createdOn: new Date().toISOString(),
    };
    this.items = [created, ...this.items];
    return delay(created);
  }
}
