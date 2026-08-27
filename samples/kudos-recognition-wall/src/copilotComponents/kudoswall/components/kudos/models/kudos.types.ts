export type KudosValueKey = 'teamwork' | 'clientImpact' | 'innovation' | 'extraMile';

export interface IPerson {
  /** Stable identity — the user's UPN. Backs the avatar URL and the Person-field write. */
  id: string;
  displayName: string;
  /** Optional Graph photo URL; Avatar falls back to initials when absent. */
  photoUrl?: string;
  department?: string;
}

export interface IKudos {
  id: string;
  giver: IPerson;
  recipient: IPerson;
  value: KudosValueKey;
  message: string;
  /** ISO 8601 */
  createdOn: string;
}

export interface ILeaderboardEntry {
  person: IPerson;
  count: number;
}

export type KudosTimeRange = 'month' | 'quarter' | 'all';

export interface IKudosFilters {
  department: string;
  value: KudosValueKey | 'all';
  range: KudosTimeRange;
}

export interface ISendKudosInput {
  recipientId: string;
  value: KudosValueKey;
  message: string;
  /** Team the kudos is filed under, chosen from the Departments list. */
  team?: string;
}

/** Data contract — back this with SPFx SPHttpClient / MSGraphClientV3. */
export interface IKudosService {
  getKudos(filters: IKudosFilters): Promise<IKudos[]>;
  getMostRecognised(range: KudosTimeRange): Promise<ILeaderboardEntry[]>;
  getTopGivers(range: KudosTimeRange): Promise<ILeaderboardEntry[]>;
  sendKudos(input: ISendKudosInput): Promise<IKudos>;
  getDepartments(): Promise<string[]>;
}
