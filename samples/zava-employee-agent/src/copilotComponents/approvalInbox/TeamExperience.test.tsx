import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { ConfiguredFamilyDashboard, ConfiguredFamilyInline } from '../shared/experiences/ConfiguredFamilyExperience';
import DashboardSupportingExperience from '../shared/experiences/DashboardSupportingExperience';
import { getDashboardOnlyExperience } from '../shared/experiences/familyDashboardCatalog';
import { embeddedImages } from '../shared/mockData/embeddedImages';
import { MockZavaEmployeeDataService } from '../shared/services/MockZavaEmployeeDataService';

describe('Team experience', () => {
  test('renders an actionable approval queue', () => {
    const markup = renderToStaticMarkup(<ConfiguredFamilyInline intentKey="approvalInbox" params={{ approvalType: 'leave' }} />);
    expect(markup).toContain('Lee Gu · Vacation request');
    expect(markup).toContain('Review the Tuesday overlap');
    expect(markup).toContain('No approval is applied automatically.');
  });

  test('renders a semantic absence heatmap', () => {
    const markup = renderToStaticMarkup(<ConfiguredFamilyInline intentKey="teamAbsenceCalendar" params={{}} />);
    expect(markup).toContain('Team absence heatmap. Tuesday has two people away');
    expect(markup).toContain('At least four team members remain available each day.');
  });

  test('renders an implemented Team dashboard', () => {
    const user = new MockZavaEmployeeDataService().getEmployeeExperience().user;
    const markup = renderToStaticMarkup(<ConfiguredFamilyDashboard family="team" user={user} />);
    expect(markup).toContain('team/approvals');
    expect(markup).toContain('team/absence');
  });

  test('renders Lee and Patti portraits in the Team roster', () => {
    const definition = getDashboardOnlyExperience('managerTeamHub');
    expect(definition).toBeDefined();
    const markup = renderToStaticMarkup(<DashboardSupportingExperience definition={definition!} />);
    expect(markup).toContain(embeddedImages.leeGu);
    expect(markup).toContain(embeddedImages.pattiFernandez);
  });

  test('protects manager data for a non-manager user', () => {
    const user = { ...new MockZavaEmployeeDataService().getEmployeeExperience().user, jobTitle: 'Product Designer' };
    const markup = renderToStaticMarkup(<ConfiguredFamilyDashboard family="team" user={user} />);
    expect(markup).toContain('data-role-state="not-manager"');
    expect(markup).toContain('No manager workspace assigned');
    expect(markup).not.toContain('Lee Gu · Vacation request');
  });
});