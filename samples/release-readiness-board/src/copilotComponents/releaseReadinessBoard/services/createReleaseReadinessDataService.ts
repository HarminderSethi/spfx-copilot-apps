import { ApiReleaseReadinessDataService } from './ApiReleaseReadinessDataService';
import type { IReleaseReadinessDataService } from './IReleaseReadinessDataService';
import { MockReleaseReadinessDataService } from './MockReleaseReadinessDataService';

export interface IReleaseReadinessDataServiceOptions {
  useMock?: boolean | string;
  dataServiceUrl?: string;
}

const parseUseMock = (value: boolean | string | undefined): boolean => {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    return value.toLowerCase() !== 'false';
  }

  return true;
};

export const createReleaseReadinessDataService = (
  options: IReleaseReadinessDataServiceOptions
): IReleaseReadinessDataService => {
  const useMock = parseUseMock(options.useMock);
  const url = options.dataServiceUrl?.trim();

  if (!useMock && url) {
    return new ApiReleaseReadinessDataService(url);
  }

  return new MockReleaseReadinessDataService();
};
