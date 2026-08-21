import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { PolicyDashboard } from '../../policyAnswer/PolicyExperience';
import type { ZavaFamilyId } from '../models/families';
import { MockZavaEmployeeDataService } from '../services/MockZavaEmployeeDataService';
import { ConfiguredFamilyDashboard } from './ConfiguredFamilyExperience';

describe('full-screen family completeness', () => {
  const user = new MockZavaEmployeeDataService().getEmployeeExperience().user;
  const familyRoutes: Array<[ZavaFamilyId, string[]]> = [
    ['time', ['time/balance', 'time/usage', 'time/request', 'time/status', 'time/coverage']],
    ['money', ['money/latest', 'money/explain-change', 'money/deductions', 'money/history', 'money/documents']],
    ['benefits', ['benefits/current', 'benefits/compare', 'benefits/dependents', 'benefits/enrollment', 'benefits/life-event']],
    ['support', ['support/quick-answer', 'support/cases', 'support/status', 'support/create', 'support/health']],
    ['learning', ['learning/required', 'learning/continue', 'learning/progress', 'learning/recommendations', 'learning/team-status']],
    ['rewards', ['rewards/summary', 'rewards/history', 'rewards/explain-change', 'rewards/equity', 'rewards/pension']],
    ['team', ['team/hub', 'team/approvals', 'team/absence', 'team/risks', 'team/check-in']],
    ['people', ['people/network', 'people/organization', 'people/expert', 'people/meeting', 'people/signals']]
  ];

  test.each(familyRoutes)('renders all five %s dashboard routes', (family, routes) => {
    const markup = renderToStaticMarkup(<ConfiguredFamilyDashboard family={family} user={user} />);
    expect((markup.match(/data-family-route=/g) || [])).toHaveLength(5);
    routes.forEach((route) => expect(markup).toContain(`data-family-route="${route}"`));
  });

  test('renders all five Policy dashboard routes', () => {
    const markup = renderToStaticMarkup(<PolicyDashboard user={user} />);
    expect((markup.match(/data-family-route=/g) || [])).toHaveLength(5);
    ['policy/answer', 'policy/compare', 'policy/sources', 'policy/changes', 'policy/private-support']
      .forEach((route) => expect(markup).toContain(`data-family-route="${route}"`));
  });

  test('renders representative rich internal UX rather than route-only placeholders', () => {
    const time = renderToStaticMarkup(<ConfiguredFamilyDashboard family="time" user={user} />);
    const learning = renderToStaticMarkup(<ConfiguredFamilyDashboard family="learning" user={user} />);
    const rewards = renderToStaticMarkup(<ConfiguredFamilyDashboard family="rewards" user={user} />);
    expect(time).toContain('Time off request approval timeline');
    expect(time).toContain('Team coverage for proposed leave dates');
    expect(learning).toContain('Role based learning recommendations');
    expect(rewards).toContain('Equity vesting timeline');
  });
});