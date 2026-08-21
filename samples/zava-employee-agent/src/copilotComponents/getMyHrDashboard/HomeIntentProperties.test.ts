import profileSchema from '../getProfileHealth/GetProfileHealthCopilotComponentProperties';
import actionsSchema, {
  normalizeGetNextBestActionsProperties
} from '../getNextBestActions/GetNextBestActionsCopilotComponentProperties';
import snapshotSchema, {
  normalizeGetWorklifeSnapshotProperties
} from '../getWorklifeSnapshot/GetWorklifeSnapshotCopilotComponentProperties';
import milestonesSchema, {
  normalizeGetEmployeeMilestonesProperties
} from '../getEmployeeMilestones/GetEmployeeMilestonesCopilotComponentProperties';
import {
  resolveEmployeeMilestonesIntent,
  resolveHomeSummaryIntent,
  resolveNextBestActionsIntent,
  resolveProfileHealthIntent,
  resolveWorklifeSnapshotIntent
} from './homeIntentDefinitions';
import { getHomeRouteSelector, HOME_INTENT_ROUTES } from './homeIntentRoutes';

type JsonSchema = { properties?: Record<string, { description?: string }> };

describe('Home intent properties', () => {
  test('keeps Profile Health parameterless', () => {
    expect(Object.keys((profileSchema as JsonSchema).properties || {})).toEqual([]);
  });

  test('assigns only the planned optional fields to each parameterized tool', () => {
    expect(Object.keys((actionsSchema as JsonSchema).properties || {}))
      .toEqual(['period', 'focusArea', 'includeSensitive']);
    expect(Object.keys((snapshotSchema as JsonSchema).properties || {}))
      .toEqual(['period']);
    expect(Object.keys((milestonesSchema as JsonSchema).properties || {}))
      .toEqual(['period', 'milestoneId']);
  });

  test('normalizes invalid fields independently without throwing', () => {
    expect(normalizeGetNextBestActionsProperties({
      period: 'week',
      focusArea: 'invalid',
      includeSensitive: true
    })).toEqual({ period: 'week', includeSensitive: true });
    expect(normalizeGetWorklifeSnapshotProperties({ period: 'invalid' })).toEqual({});
    expect(normalizeGetEmployeeMilestonesProperties({
      period: 'quarter',
      milestoneId: ''
    })).toEqual({ period: 'quarter' });
  });

  test('resolves each component to one fixed Home view and fullscreen route', () => {
    const intents = [
      resolveHomeSummaryIntent({}),
      resolveProfileHealthIntent(),
      resolveNextBestActionsIntent({}),
      resolveWorklifeSnapshotIntent({}),
      resolveEmployeeMilestonesIntent({})
    ];
    expect(intents.map((intent) => intent.view))
      .toEqual(['summary', 'profile', 'actions', 'timeline', 'milestones']);
    expect(intents.map((intent) => intent.route))
      .toEqual([
        HOME_INTENT_ROUTES.summary,
        HOME_INTENT_ROUTES.profile,
        HOME_INTENT_ROUTES.actions,
        HOME_INTENT_ROUTES.timeline,
        HOME_INTENT_ROUTES.milestones
      ]);
    expect(intents.every((intent) => intent.properties.view === intent.view)).toBe(true);
  });

  test('preserves only normalized parameters for fullscreen initialization', () => {
    expect(resolveNextBestActionsIntent({
      period: 'today',
      focusArea: 'learning',
      includeSensitive: true,
      unrelated: 'ignored'
    }).params).toEqual({
      period: 'today',
      focusArea: 'learning',
      includeSensitive: true
    });
    expect(resolveEmployeeMilestonesIntent({
      period: 'quarter',
      milestoneId: 'five-years'
    })).toMatchObject({
      params: { period: 'quarter', milestoneId: 'five-years' },
      properties: { period: 'year' }
    });
  });

  test('focuses only known Home routes', () => {
    expect(getHomeRouteSelector('home/actions')).toBe('[data-home-route="home/actions"]');
    expect(getHomeRouteSelector('home/unknown')).toBeUndefined();
    expect(getHomeRouteSelector(undefined)).toBeUndefined();
  });
});