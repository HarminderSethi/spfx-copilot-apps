import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { ConfiguredFamilyDashboard, ConfiguredFamilyInline } from '../shared/experiences/ConfiguredFamilyExperience';
import { MockZavaEmployeeDataService } from '../shared/services/MockZavaEmployeeDataService';
import { normalizeTotalRewardsSummaryProperties } from './TotalRewardsSummaryCopilotComponentProperties';

describe('Rewards experience', () => {
  test('renders annual value composition distinct from payroll', () => {
    const params = normalizeTotalRewardsSummaryProperties({ year: 2026, currency: 'eur' });
    const markup = renderToStaticMarkup(<ConfiguredFamilyInline intentKey="totalRewardsSummary" params={params} />);
    expect(markup).toContain('Annual rewards composition: salary 55 percent');
    expect(markup).toContain('EUR 184K');
    expect(markup).toContain('annual employment value, not a payslip');
  });

  test('renders an implemented Rewards dashboard', () => {
    const user = new MockZavaEmployeeDataService().getEmployeeExperience().user;
    const markup = renderToStaticMarkup(<ConfiguredFamilyDashboard family="rewards" user={user} />);
    expect(markup).toContain('data-family-view="rewards"');
    expect(markup).toContain('rewards/summary');
  });
});