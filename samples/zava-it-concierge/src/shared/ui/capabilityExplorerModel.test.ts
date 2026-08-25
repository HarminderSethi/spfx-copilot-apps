import { INTENT_CATALOG } from '../intents/intentCatalog';
import { FEATURED_CAPABILITY_NAMES, getCapabilityMatches, getCapabilityPage } from './capabilityExplorerModel';

describe('capability explorer model', () => {
  it('advertises every operational tool without advertising itself', () => {
    const matches = getCapabilityMatches({ query: '', lens: 'all', operation: 'all' });

    expect(matches).toHaveLength(INTENT_CATALOG.length - 1);
    expect(matches.some((intent) => intent.name === 'ExploreAgentCapabilities')).toBe(false);
  });

  it('searches titles, descriptions, categories, and sample prompts', () => {
    expect(getCapabilityMatches({ query: 'battery drain', lens: 'all', operation: 'all' }).map((intent) => intent.name)).toContain('RunDeviceDiagnostics');
    expect(getCapabilityMatches({ query: 'over-threshold policy exception', lens: 'all', operation: 'all' }).map((intent) => intent.name)).toContain('ReviewPolicyException');
    expect(getCapabilityMatches({ query: 'Cost optimization', lens: 'all', operation: 'all' }).map((intent) => intent.name)).toEqual(expect.arrayContaining(['GetLicenseReclaim', 'GetItSpendBridge']));
    expect(getCapabilityMatches({ query: 'four-year refresh threshold', lens: 'all', operation: 'all' }).map((intent) => intent.name)).toContain('GetDeviceAgeDistribution');
  });

  it('combines audience and operation filters', () => {
    const matches = getCapabilityMatches({ query: '', lens: 'team', operation: 'review' });

    expect(matches.map((intent) => intent.name)).toEqual(['ReviewDeviceApproval', 'GetApprovalQueue', 'ReviewPolicyException']);
  });

  it('clamps pagination and keeps an empty result on the first page', () => {
    const matches = getCapabilityMatches({ query: '', lens: 'me', operation: 'all' });
    const lastPage = getCapabilityPage(matches, 99);
    const emptyPage = getCapabilityPage([], 4);

    expect(lastPage.page).toBe(lastPage.pageCount - 1);
    expect(lastPage.items.length).toBeGreaterThan(0);
    expect(emptyPage).toEqual({ page: 0, pageCount: 1, items: [] });
  });

  it('features high-value operational tools only', () => {
    expect(new Set(FEATURED_CAPABILITY_NAMES).size).toBe(FEATURED_CAPABILITY_NAMES.length);
    expect(FEATURED_CAPABILITY_NAMES).toEqual(expect.arrayContaining(['RunDeviceDiagnostics', 'GetApprovalQueue', 'GetFleetHealth']));
    expect(FEATURED_CAPABILITY_NAMES).not.toContain('ExploreAgentCapabilities');
  });
});
