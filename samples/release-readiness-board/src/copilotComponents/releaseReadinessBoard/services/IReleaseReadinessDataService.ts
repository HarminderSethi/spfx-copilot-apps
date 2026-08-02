import type { IReleasePlan } from '../models/IReleaseReadiness';

export interface IReleaseReadinessDataService {
  readonly sourceLabel: string;
  getReleases(): Promise<IReleasePlan[]>;
}
