import { z } from 'zod';

export const HOME_VIEWS = ['summary', 'profile', 'actions', 'timeline', 'milestones'] as const;
export type HomeView = typeof HOME_VIEWS[number];

export const HOME_PERIODS = ['today', 'week', 'month', 'year'] as const;
export type HomePeriod = typeof HOME_PERIODS[number];

export const HOME_FOCUS_AREAS = [
  'all',
  'time',
  'money',
  'benefits',
  'rewards',
  'policy',
  'support',
  'learning',
  'team',
  'people'
] as const;
export type HomeFocusArea = typeof HOME_FOCUS_AREAS[number];

export const HOME_PRIVACY_LEVELS = ['standard', 'private', 'sensitive'] as const;
export type HomePrivacyLevel = typeof HOME_PRIVACY_LEVELS[number];

const runtimeSchema = z.object({
  view: z.enum(HOME_VIEWS).optional().catch(undefined),
  period: z.enum(HOME_PERIODS).optional().catch(undefined),
  focusArea: z.enum(HOME_FOCUS_AREAS).optional().catch(undefined),
  includeSensitive: z.boolean().optional().catch(undefined),
  locale: z.string().min(2).max(35).optional().catch(undefined),
  privacyLevel: z.enum(HOME_PRIVACY_LEVELS).optional().catch(undefined)
});

export interface INormalizedHomeProperties {
  view: HomeView;
  period: HomePeriod;
  focusArea: HomeFocusArea;
  includeSensitive: boolean;
  locale?: string;
  privacyLevel: HomePrivacyLevel;
}

export const DEFAULT_HOME_PROPERTIES: INormalizedHomeProperties = {
  view: 'summary',
  period: 'week',
  focusArea: 'all',
  includeSensitive: false,
  privacyLevel: 'standard'
};

export const normalizeHomeProperties = (input: unknown): INormalizedHomeProperties => {
  const parsed = runtimeSchema.safeParse(input);
  const value = parsed.success ? parsed.data : {};
  return {
    view: value.view || DEFAULT_HOME_PROPERTIES.view,
    period: value.period || DEFAULT_HOME_PROPERTIES.period,
    focusArea: value.focusArea || DEFAULT_HOME_PROPERTIES.focusArea,
    includeSensitive: value.includeSensitive === true,
    locale: value.locale,
    privacyLevel: value.privacyLevel || DEFAULT_HOME_PROPERTIES.privacyLevel
  };
};

export const getHomePropertiesSignature = (properties: INormalizedHomeProperties): string =>
  [
    properties.view,
    properties.period,
    properties.focusArea,
    properties.includeSensitive ? '1' : '0',
    properties.locale || '',
    properties.privacyLevel
  ].join('|');

export interface IHomePropertiesVersionState {
  signature: string;
  version: number;
}

export const advanceHomePropertiesVersion = (
  previousSignature: string | undefined,
  currentVersion: number,
  properties: INormalizedHomeProperties
): IHomePropertiesVersionState => {
  const signature = getHomePropertiesSignature(properties);
  return {
    signature,
    version: signature === previousSignature ? currentVersion : currentVersion + 1
  };
};