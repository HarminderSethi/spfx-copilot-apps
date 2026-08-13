import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { PolicyDashboard, PolicyInline } from './PolicyExperience';
import { MockZavaEmployeeDataService } from '../shared/services/MockZavaEmployeeDataService';
import { normalizePolicyAnswerProperties } from './PolicyAnswerCopilotComponentProperties';
import { normalizePolicyComparisonProperties } from '../policyComparison/PolicyComparisonCopilotComponentProperties';

describe('Policy experience', () => {
  test('renders a cited answer receipt with an expand action', () => {
    const markup = renderToStaticMarkup(<PolicyInline intent={{ kind: 'answer', properties: normalizePolicyAnswerProperties({ question: 'What leave applies?' }) }} onRequestFullscreen={() => undefined} />);
    expect(markup).toContain('data-policy-intent="answer"');
    expect(markup).toContain('Answer confidence 92%');
    expect(markup).toContain('Zava Family Leave Standard');
    expect(markup).toContain('Open Policy answer in the full HR dashboard');
  });

  test('renders a semantic jurisdiction matrix', () => {
    const markup = renderToStaticMarkup(<PolicyInline intent={{ kind: 'comparison', properties: normalizePolicyComparisonProperties({ topic: 'Parental leave', jurisdictions: ['Finland', 'Sweden'] }) }} />);
    expect(markup).toContain('data-policy-intent="comparison"');
    expect(markup).toContain('Parental leave comparison');
    expect(markup).toContain('480 shared days');
  });

  test('renders the implemented Policy fullscreen dashboard', () => {
    const user = new MockZavaEmployeeDataService().getEmployeeExperience().user;
    const markup = renderToStaticMarkup(<PolicyDashboard user={user} />);
    expect(markup).toContain('data-family-implemented="true"');
    expect(markup).toContain('Policy answers you can trust');
    expect(markup).toContain('policy/answer');
    expect(markup).toContain('policy/compare');
    expect(markup).toContain('policy/sources');
    expect(markup).toContain('policy/changes');
    expect(markup).toContain('policy/private-support');
  });
});