import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { ConfiguredFamilyDashboard, ConfiguredFamilyInline } from '../shared/experiences/ConfiguredFamilyExperience';
import { MockZavaEmployeeDataService } from '../shared/services/MockZavaEmployeeDataService';
import { normalizeCreateHrCaseProperties } from './CreateHrCaseCopilotComponentProperties';

describe('Support experience', () => {
  test('keeps sensitive details inside a reviewable case intake', () => {
    const params = normalizeCreateHrCaseProperties({ category: 'payroll', privacyLevel: 'sensitive', subject: 'Private deduction question' });
    const markup = renderToStaticMarkup(<ConfiguredFamilyInline intentKey="createHrCase" params={params} />);
    expect(markup).toContain('Private HR workspace');
    expect(markup).toContain('Private deduction question');
    expect(markup).toContain('Possible answer found');
    expect(markup).toContain('Review private case');
  });

  test('renders an implemented Support dashboard', () => {
    const user = new MockZavaEmployeeDataService().getEmployeeExperience().user;
    const markup = renderToStaticMarkup(<ConfiguredFamilyDashboard family="support" user={user} />);
    expect(markup).toContain('data-family-view="support"');
    expect(markup).toContain('support/create');
  });
});