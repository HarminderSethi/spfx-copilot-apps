import { normalizePolicyAnswerProperties } from './PolicyAnswerCopilotComponentProperties';
import { normalizePolicyComparisonProperties } from '../policyComparison/PolicyComparisonCopilotComponentProperties';

describe('Policy property normalization', () => {
  test('provides useful defaults and rejects malformed dates', () => {
    expect(normalizePolicyAnswerProperties({ effectiveOn: 'tomorrow' })).toEqual(expect.objectContaining({ effectiveOn: '2026-08-01', includeSources: true }));
  });

  test('requires at least two useful comparison jurisdictions', () => {
    expect(normalizePolicyComparisonProperties({ jurisdictions: ['Finland'] }).jurisdictions).toEqual(['Finland', 'Sweden']);
    expect(normalizePolicyComparisonProperties({ jurisdictions: [' Finland ', ' Sweden '] }).jurisdictions).toEqual(['Finland', 'Sweden']);
  });
});