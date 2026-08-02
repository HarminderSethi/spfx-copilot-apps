import type { IReleasePlan } from '../models/IReleaseReadiness';
import type { IReleaseReadinessDataService } from './IReleaseReadinessDataService';

type TReleaseApiPayload = IReleasePlan[] | { releases: IReleasePlan[] };

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isReleaseArray = (value: unknown): value is IReleasePlan[] =>
  Array.isArray(value);

const extractReleases = (payload: unknown): IReleasePlan[] => {
  if (isReleaseArray(payload)) {
    return payload;
  }

  if (isRecord(payload) && isReleaseArray(payload.releases)) {
    return payload.releases;
  }

  throw new Error('Release readiness API response must be an array or an object with a releases array.');
};

export class ApiReleaseReadinessDataService implements IReleaseReadinessDataService {
  public readonly sourceLabel: string;
  private readonly _url: string;

  public constructor(url: string) {
    this._url = url;
    this.sourceLabel = 'Live API';
  }

  public async getReleases(): Promise<IReleasePlan[]> {
    const response = await fetch(this._url, {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Release readiness API request failed (${response.status} ${response.statusText}).`);
    }

    const payload = await response.json() as TReleaseApiPayload;
    return extractReleases(payload);
  }
}
