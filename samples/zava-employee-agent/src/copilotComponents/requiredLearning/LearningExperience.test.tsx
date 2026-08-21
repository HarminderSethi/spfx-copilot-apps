import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { ConfiguredFamilyDashboard, ConfiguredFamilyInline } from '../shared/experiences/ConfiguredFamilyExperience';
import { MockZavaEmployeeDataService } from '../shared/services/MockZavaEmployeeDataService';
import { normalizeRequiredLearningProperties } from './RequiredLearningCopilotComponentProperties';

describe('Learning experience', () => {
  test('renders compliance progress and urgency', () => {
    const params = normalizeRequiredLearningProperties({ dueWithinDays: 14 });
    const markup = renderToStaticMarkup(<ConfiguredFamilyInline intentKey="requiredLearning" params={params} />);
    expect(markup).toContain('Learning compliance 86 percent');
    expect(markup).toContain('Privacy foundations');
    expect(markup).toContain('Due Friday · 24 minutes left');
    expect(markup).toContain('Resume');
  });

  test('renders an implemented Learning dashboard', () => {
    const user = new MockZavaEmployeeDataService().getEmployeeExperience().user;
    const markup = renderToStaticMarkup(<ConfiguredFamilyDashboard family="learning" user={user} />);
    expect(markup).toContain('data-family-view="learning"');
    expect(markup).toContain('learning/required');
  });
});