import { getMockReleaseReadinessData } from '../data/mockReleaseReadiness';
import type { IReleasePlan } from '../models/IReleaseReadiness';
import type { IReleaseReadinessDataService } from './IReleaseReadinessDataService';

export class MockReleaseReadinessDataService implements IReleaseReadinessDataService {
  public readonly sourceLabel: string = 'Mock data';

  public async getReleases(): Promise<IReleasePlan[]> {
    return getMockReleaseReadinessData();
  }
}
