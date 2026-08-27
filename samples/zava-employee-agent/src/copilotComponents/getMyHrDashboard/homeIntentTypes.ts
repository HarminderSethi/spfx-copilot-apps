import type { HomeView, INormalizedHomeProperties } from './normalizeHomeProperties';

export type HomeIntentParamValue = string | number | boolean | string[];
export type HomeIntentParams = Record<string, HomeIntentParamValue>;

export interface IResolvedHomeIntent {
  view: HomeView;
  route: string;
  properties: INormalizedHomeProperties;
  params: HomeIntentParams;
}

export const compactIntentParams = (
  values: Record<string, HomeIntentParamValue | undefined>
): HomeIntentParams => Object.keys(values).reduce<HomeIntentParams>((result, key) => {
  const value = values[key];
  if (value !== undefined) {
    result[key] = value;
  }
  return result;
}, {});