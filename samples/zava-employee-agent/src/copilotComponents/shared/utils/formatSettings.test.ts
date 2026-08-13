import { formatZavaCurrency, getJurisdictionLabel } from './formatSettings';

describe('settings formatting', () => {
  test('formats the same amount using the selected currency', () => {
    expect(formatZavaCurrency(5126, 'EUR', 'en-US')).toBe('€5,126');
    expect(formatZavaCurrency(5126, 'USD', 'en-US')).toBe('$5,126');
    expect(formatZavaCurrency(5126, 'GBP', 'en-GB')).toBe('£5,126');
  });

  test('returns a user-facing jurisdiction label', () => {
    expect(getJurisdictionLabel('FI')).toBe('Finland · EU policy');
    expect(getJurisdictionLabel('US')).toBe('United States · US policy');
  });
});