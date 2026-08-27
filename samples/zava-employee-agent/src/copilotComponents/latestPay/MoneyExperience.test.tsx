import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { ConfiguredFamilyDashboard, ConfiguredFamilyInline } from '../shared/experiences/ConfiguredFamilyExperience';
import { MockZavaEmployeeDataService } from '../shared/services/MockZavaEmployeeDataService';
import { normalizeExplainPayChangeProperties } from '../explainPayChange/ExplainPayChangeCopilotComponentProperties';

describe('Money experience', () => {
  test('renders a privacy-framed gross-to-net composition', () => {
    const markup = renderToStaticMarkup(<ConfiguredFamilyInline intentKey="latestPay" params={{ period: 'latest' }} />);
    expect(markup).toContain('Net pay EUR 5,126 and deductions EUR 2,294');
    expect(markup).toContain('Sensitive amounts stay inside this Money surface.');
  });

  test('renders the pay-change waterfall with normalized periods', () => {
    const params = normalizeExplainPayChangeProperties({ period: '2026-07', compareTo: '2026-06' });
    const markup = renderToStaticMarkup(<ConfiguredFamilyInline intentKey="explainPayChange" params={params} />);
    expect(markup).toContain('Pay change waterfall from EUR 5,005 to EUR 5,126');
    expect(markup).toContain('Recognition');
    expect(markup).toContain('Withholding');
  });

  test('renders an implemented Money dashboard', () => {
    const user = new MockZavaEmployeeDataService().getEmployeeExperience().user;
    const markup = renderToStaticMarkup(<ConfiguredFamilyDashboard family="money" user={user} />);
    expect(markup).toContain('data-family-view="money"');
    expect(markup).toContain('money/latest');
    expect(markup).toContain('money/explain-change');
  });
});