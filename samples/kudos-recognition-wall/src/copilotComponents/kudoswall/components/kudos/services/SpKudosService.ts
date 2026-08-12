import { SPHttpClient, type SPHttpClientResponse } from '@microsoft/sp-http';
import type {
  IKudos,
  IKudosFilters,
  IKudosService,
  ILeaderboardEntry,
  IPerson,
  ISendKudosInput,
  KudosTimeRange,
} from '../models/kudos.types';
import {
  ALL_TEAMS,
  DEPARTMENTS_LIST_TITLE,
  KUDOS_FIELDS,
  KUDOS_LIST_TITLE,
  KUDOS_PAGE_SIZE,
  KUDOS_VALUE_CHOICE,
  LEADERBOARD_SIZE,
  TITLE_SUMMARY_MAX,
  choiceToKey,
  userPhotoUrl,
} from '../constants/kudos.constants';

/** Signed-in user, used as the default Giver. */
export interface ICurrentUser {
  displayName: string;
  upn: string;
}

/** A person value as returned by RenderListDataAsStream (array per Person field). */
interface ISpStreamPerson {
  id?: string;
  title?: string;
  email?: string;
  sip?: string;
}

/** One Kudos row from RenderListDataAsStream — field internal names as keys. */
interface ISpKudosRow {
  ID: string;
  Message?: string;
  Created: string;
  KudosType?: string;
  Team?: string;
  Recipient?: ISpStreamPerson[];
  Giver?: ISpStreamPerson[];
}

interface ISpDepartmentRow {
  Title?: string;
}

interface ISpStreamResponse<T> {
  Row: T[];
}

const JSON_HEADERS = {
  Accept: 'application/json;odata=nometadata',
  'Content-Type': 'application/json;odata=nometadata',
};

const VIEW_FIELDS = [
  'ID',
  KUDOS_FIELDS.message,
  KUDOS_FIELDS.created,
  KUDOS_FIELDS.type,
  KUDOS_FIELDS.team,
  KUDOS_FIELDS.recipient,
  KUDOS_FIELDS.giver,
];

const escapeXml = (value: string): string =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&apos;');

/**
 * SharePoint-list-backed implementation of IKudosService.
 *
 * Reads go through RenderListDataAsStream (POST + CAML ViewXml): person fields
 * come back resolved and CAML DateTime values avoid the legacy OData
 * `datetime'…'` syntax. Writes use the items endpoint with `ensureuser`.
 *
 * Team is a controlled value chosen from the Departments list and stored on the
 * Kudos item, so value/time/team filters all run server-side and the team
 * vocabulary is stable (no dependency on directory `department` text). Both
 * leaderboards are still counted client-side over the newest-50 fetch — fine at
 * recognition-wall volumes; move to CAML GroupBy or a rolled-up list at scale.
 */
export class SpKudosService implements IKudosService {
  public constructor(
    private readonly spHttpClient: SPHttpClient,
    private readonly webAbsoluteUrl: string,
    private readonly currentUser: ICurrentUser,
  ) {}

  public async getKudos(filters: IKudosFilters): Promise<IKudos[]> {
    const conditions: string[] = [];
    if (filters.value !== 'all') conditions.push(this.valueCondition(filters.value));
    if (filters.department !== ALL_TEAMS) conditions.push(this.teamCondition(filters.department));
    const range = this.rangeCondition(filters.range);
    if (range) conditions.push(range);
    return this.fetchKudos(conditions);
  }

  public async getMostRecognised(range: KudosTimeRange): Promise<ILeaderboardEntry[]> {
    const kudos = await this.fetchKudos(this.rangeConditions(range));
    return this.tally(kudos.map((k) => k.recipient), LEADERBOARD_SIZE.mostRecognised);
  }

  public async getTopGivers(range: KudosTimeRange): Promise<ILeaderboardEntry[]> {
    const kudos = await this.fetchKudos(this.rangeConditions(range));
    return this.tally(kudos.map((k) => k.giver), LEADERBOARD_SIZE.topGivers);
  }

  /** Team vocabulary comes from the controlled Departments list. */
  public async getDepartments(): Promise<string[]> {
    const viewXml =
      `<View><ViewFields><FieldRef Name='Title'/></ViewFields>` +
      `<Query><OrderBy><FieldRef Name='Title' Ascending='TRUE'/></OrderBy></Query>` +
      `<RowLimit>500</RowLimit></View>`;
    try {
      const rows = await this.renderRows<ISpDepartmentRow>(DEPARTMENTS_LIST_TITLE, viewXml);
      return rows.map((r) => r.Title).filter((t): t is string => !!t);
    } catch (error) {
      console.warn('[SpKudosService] Could not read the Departments list.', error);
      return [];
    }
  }

  public async sendKudos(input: ISendKudosInput): Promise<IKudos> {
    const [recipientId, giverId] = await Promise.all([
      this.ensureUser(input.recipientId),
      this.ensureUser(this.currentUser.upn),
    ]);

    const created = await this.post<{ Id: number }>(`${this.listUrl(KUDOS_LIST_TITLE)}/items`, {
      // Title is a readable summary for the SP list view; Message holds the full text.
      [KUDOS_FIELDS.title]: this.summarise(input.message),
      [KUDOS_FIELDS.message]: input.message,
      [KUDOS_FIELDS.recipientId]: recipientId,
      [KUDOS_FIELDS.giverId]: giverId,
      [KUDOS_FIELDS.team]: input.team ?? '',
      [KUDOS_FIELDS.type]: KUDOS_VALUE_CHOICE[input.value],
    });

    const where = `<Eq><FieldRef Name='ID'/><Value Type='Counter'>${created.Id}</Value></Eq>`;
    const rows = await this.renderRows<ISpKudosRow>(KUDOS_LIST_TITLE, this.buildKudosViewXml(where));
    return this.toKudos(rows[0]);
  }

  // ── internals ──────────────────────────────────────────────────────────────

  private listUrl(title: string): string {
    return `${this.webAbsoluteUrl}/_api/web/lists/getbytitle('${title}')`;
  }

  private valueCondition(value: IKudosFilters['value']): string {
    if (value === 'all') return '';
    return `<Eq><FieldRef Name='${KUDOS_FIELDS.type}'/><Value Type='Choice'>${escapeXml(
      KUDOS_VALUE_CHOICE[value],
    )}</Value></Eq>`;
  }

  private teamCondition(team: string): string {
    return `<Eq><FieldRef Name='${KUDOS_FIELDS.team}'/><Value Type='Text'>${escapeXml(team)}</Value></Eq>`;
  }

  private rangeCondition(range: KudosTimeRange): string | undefined {
    const from = this.rangeStart(range);
    return from
      ? `<Geq><FieldRef Name='${KUDOS_FIELDS.created}'/><Value Type='DateTime' IncludeTimeValue='TRUE' StorageTZ='TRUE'>${from}</Value></Geq>`
      : undefined;
  }

  private rangeConditions(range: KudosTimeRange): string[] {
    const clause = this.rangeCondition(range);
    return clause ? [clause] : [];
  }

  private rangeStart(range: KudosTimeRange): string | undefined {
    if (range === 'all') return undefined;
    const now = new Date();
    const month = range === 'quarter' ? Math.floor(now.getMonth() / 3) * 3 : now.getMonth();
    return new Date(Date.UTC(now.getFullYear(), month, 1)).toISOString();
  }

  /** Combines CAML conditions under nested <And> (0, 1 or many). */
  private combineAnd(conditions: string[]): string {
    return conditions.filter(Boolean).reduce((acc, c) => (acc ? `<And>${acc}${c}</And>` : c), '');
  }

  private buildKudosViewXml(where: string): string {
    const fields = VIEW_FIELDS.map((name) => `<FieldRef Name='${name}'/>`).join('');
    const query =
      `<OrderBy><FieldRef Name='${KUDOS_FIELDS.created}' Ascending='FALSE'/></OrderBy>` +
      (where ? `<Where>${where}</Where>` : '');
    return `<View><ViewFields>${fields}</ViewFields><Query>${query}</Query><RowLimit>${KUDOS_PAGE_SIZE}</RowLimit></View>`;
  }

  private async fetchKudos(conditions: string[]): Promise<IKudos[]> {
    try {
      const rows = await this.renderRows<ISpKudosRow>(
        KUDOS_LIST_TITLE,
        this.buildKudosViewXml(this.combineAnd(conditions)),
      );
      return rows.map((row) => this.toKudos(row));
    } catch (error) {
      // The list may not be provisioned yet. Surface an empty wall rather than
      // crashing; the empty state guides the user to provision it.
      console.warn('[SpKudosService] Could not read the Kudos list.', error);
      return [];
    }
  }

  private async renderRows<T>(listTitle: string, viewXml: string): Promise<T[]> {
    const response = await this.post<ISpStreamResponse<T>>(
      `${this.listUrl(listTitle)}/RenderListDataAsStream`,
      { parameters: { ViewXml: viewXml, DatesInUtc: true } },
    );
    return response.Row ?? [];
  }

  private toKudos(row: ISpKudosRow): IKudos {
    const recipient = this.toPerson(row.Recipient);
    // The item's Team is the recipient's team for this recognition.
    recipient.department = row.Team || undefined;
    return {
      id: row.ID,
      giver: this.toPerson(row.Giver),
      recipient,
      value: choiceToKey(row.KudosType),
      message: row.Message ?? '',
      createdOn: row.Created,
    };
  }

  private toPerson(persons: ISpStreamPerson[] | undefined): IPerson {
    const person = persons && persons[0];
    const upn = person?.email || person?.sip || 'unknown';
    return {
      id: upn,
      displayName: person?.title || 'Unknown',
      photoUrl: userPhotoUrl(this.webAbsoluteUrl, upn),
    };
  }

  private tally(people: IPerson[], top: number): ILeaderboardEntry[] {
    const byId = new Map<string, ILeaderboardEntry>();
    people.forEach((person) => {
      const entry = byId.get(person.id);
      if (entry) entry.count += 1;
      else byId.set(person.id, { person, count: 1 });
    });
    return Array.from(byId.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, top);
  }

  private summarise(message: string): string {
    return message.length > TITLE_SUMMARY_MAX
      ? `${message.slice(0, TITLE_SUMMARY_MAX - 1)}…`
      : message;
  }

  private async ensureUser(upn: string): Promise<number> {
    const user = await this.post<{ Id: number }>(`${this.webAbsoluteUrl}/_api/web/ensureuser`, {
      logonName: upn,
    });
    return user.Id;
  }

  private async post<T>(url: string, body: unknown): Promise<T> {
    const response: SPHttpClientResponse = await this.spHttpClient.post(
      url,
      SPHttpClient.configurations.v1,
      { headers: JSON_HEADERS, body: JSON.stringify(body) },
    );
    if (!response.ok) throw new Error(`POST ${url} failed: ${response.status}`);
    return response.json();
  }
}
