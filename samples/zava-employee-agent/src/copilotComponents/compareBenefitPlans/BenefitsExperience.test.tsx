import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { ConfiguredFamilyDashboard, ConfiguredFamilyInline } from '../shared/experiences/ConfiguredFamilyExperience';
import { MockZavaEmployeeDataService } from '../shared/services/MockZavaEmployeeDataService';
import { normalizeCompareBenefitPlansProperties } from './CompareBenefitPlansCopilotComponentProperties';

describe('Benefits experience', () => {
  test('renders a weighted plan matrix', () => {
    const params = normalizeCompareBenefitPlansProperties({ dependentCount: 2, priorities: ['deductible', 'dental'] });
    const markup = renderToStaticMarkup(<ConfiguredFamilyInline intentKey="compareBenefitPlans" params={params} />);
    expect(markup).toContain('Benefit plan comparison for a family with two children');
    expect(markup).toContain('Low deductible · 40%');
    expect(markup).toContain('Zava Plus');
  });

  test('renders a staged life-event impact review', () => {
    const markup = renderToStaticMarkup(<ConfiguredFamilyInline intentKey="startLifeEvent" params={{ lifeEvent: 'birth', effectiveDate: '2026-08-01' }} />);
    expect(markup).toContain('Birth or adoption');
    expect(markup).toContain('Estimated employee cost increases EUR 42/month');
    expect(markup).toContain('Review life event');
  });

  test('renders an implemented Benefits dashboard', () => {
    const user = new MockZavaEmployeeDataService().getEmployeeExperience().user;
    const markup = renderToStaticMarkup(<ConfiguredFamilyDashboard family="benefits" user={user} />);
    expect(markup).toContain('benefits/compare');
    expect(markup).toContain('benefits/life-event');
  });
});