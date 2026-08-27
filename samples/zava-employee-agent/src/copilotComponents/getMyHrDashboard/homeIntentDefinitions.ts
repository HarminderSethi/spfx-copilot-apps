import { normalizeGetEmployeeMilestonesProperties } from '../getEmployeeMilestones/GetEmployeeMilestonesCopilotComponentProperties';
import { normalizeGetNextBestActionsProperties } from '../getNextBestActions/GetNextBestActionsCopilotComponentProperties';
import { normalizeGetWorklifeSnapshotProperties } from '../getWorklifeSnapshot/GetWorklifeSnapshotCopilotComponentProperties';
import { compactIntentParams, type IResolvedHomeIntent } from './homeIntentTypes';
import { HOME_INTENT_ROUTES } from './homeIntentRoutes';
import { normalizeHomeProperties } from './normalizeHomeProperties';

export const resolveHomeSummaryIntent = (input: unknown): IResolvedHomeIntent => {
  const properties = normalizeHomeProperties({ ...(input as object), view: 'summary' });
  return {
    view: 'summary',
    route: HOME_INTENT_ROUTES.summary,
    properties,
    params: compactIntentParams({
      period: properties.period,
      focusArea: properties.focusArea,
      includeSensitive: properties.includeSensitive,
      locale: properties.locale,
      privacyLevel: properties.privacyLevel
    })
  };
};

export const resolveProfileHealthIntent = (): IResolvedHomeIntent => ({
  view: 'profile',
  route: HOME_INTENT_ROUTES.profile,
  properties: normalizeHomeProperties({ view: 'profile' }),
  params: {}
});

export const resolveNextBestActionsIntent = (input: unknown): IResolvedHomeIntent => {
  const normalized = normalizeGetNextBestActionsProperties(input);
  return {
    view: 'actions',
    route: HOME_INTENT_ROUTES.actions,
    properties: normalizeHomeProperties({ ...normalized, view: 'actions' }),
    params: compactIntentParams(normalized)
  };
};

export const resolveWorklifeSnapshotIntent = (input: unknown): IResolvedHomeIntent => {
  const normalized = normalizeGetWorklifeSnapshotProperties(input);
  return {
    view: 'timeline',
    route: HOME_INTENT_ROUTES.timeline,
    properties: normalizeHomeProperties({ ...normalized, view: 'timeline' }),
    params: compactIntentParams(normalized)
  };
};

export const resolveEmployeeMilestonesIntent = (input: unknown): IResolvedHomeIntent => {
  const normalized = normalizeGetEmployeeMilestonesProperties(input);
  const homePeriod = normalized.period === 'quarter' ? 'year' : normalized.period;
  return {
    view: 'milestones',
    route: HOME_INTENT_ROUTES.milestones,
    properties: normalizeHomeProperties({ view: 'milestones', period: homePeriod }),
    params: compactIntentParams(normalized)
  };
};