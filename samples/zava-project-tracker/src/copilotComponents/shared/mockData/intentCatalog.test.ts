import { EMBEDDED_FACES } from './embeddedFaces';
import { getIntentDefinition, PROJECT_INTENT_CATALOG } from './intentCatalog';

describe('project portfolio intent catalog', () => {
  test('contains thirty operational experiences and one education experience', () => {
    expect(PROJECT_INTENT_CATALOG).toHaveLength(31);
    expect(new Set(PROJECT_INTENT_CATALOG.map((item) => item.key)).size).toBe(31);
    expect(new Set(PROJECT_INTENT_CATALOG.map((item) => item.route)).size).toBe(31);
  });

  test('covers all four full-screen workspaces', () => {
    const counts = PROJECT_INTENT_CATALOG.reduce<Record<string, number>>((result, item) => ({
      ...result,
      [item.workspace]: (result[item.workspace] || 0) + 1
    }), {});

    expect(counts).toEqual({
      'my-work': 6,
      project: 12,
      portfolio: 7,
      approvals: 5,
      education: 1
    });
  });

  test('advertises complete education metadata for exactly thirty operational scenarios', () => {
    const advertised = PROJECT_INTENT_CATALOG.filter((item) => item.education);
    expect(advertised).toHaveLength(30);
    expect(getIntentDefinition('ExploreAgentCapabilities').education).toBeUndefined();
    expect(new Set(advertised.map((item) => item.education?.examplePrompt)).size).toBe(30);
    advertised.forEach((item) => {
      expect(item.education?.scenarioName.length).toBeGreaterThan(8);
      expect(item.education?.businessOutcome.length).toBeGreaterThan(24);
      expect(item.education?.examplePrompt.length).toBeGreaterThan(20);
      expect(item.education?.audience.length).toBeGreaterThan(0);
      expect(item.education?.tags.length).toBeGreaterThan(2);
      expect(item.education?.previewSafety).toMatch(/^(read-only|stop-before-confirm)$/);
    });
  });

  test('keeps every experience decision-ready', () => {
    PROJECT_INTENT_CATALOG.forEach((item) => {
      expect(item.title.length).toBeGreaterThan(8);
      expect(item.summary.length).toBeGreaterThan(24);
      expect(item.insight.length).toBeGreaterThan(24);
      expect(item.metrics).toHaveLength(3);
      expect(item.people.length).toBeGreaterThan(0);
    });
  });

  test('resolves a bundled portrait for every referenced person', () => {
    PROJECT_INTENT_CATALOG.forEach((item) => {
      item.people.forEach((person) => {
        expect(EMBEDDED_FACES[person.imageKey]).toMatch(/^data:image\/jpeg;base64,/);
      });
    });
  });

  test.each([
    ['GetMyWorkSummary', 'my-work/summary'],
    ['CompareProjects', 'project/compare'],
    ['GetPortfolioCapacity', 'portfolio/capacity'],
    ['ReviewResourceAssignment', 'approvals/resource-assignment'],
    ['ExploreAgentCapabilities', 'education/capabilities']
  ])('maps %s to %s', (key, route) => {
    expect(getIntentDefinition(key).route).toBe(route);
  });
});