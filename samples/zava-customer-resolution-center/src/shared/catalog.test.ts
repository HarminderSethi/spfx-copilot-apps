import { CASE_SCOPED_INTENTS, INTENTS, LENS_LABELS } from './catalog';

describe('customer resolution catalog', () => {
  it('owns 23 unique immutable tools and routes', () => {
    expect(INTENTS).toHaveLength(23);
    expect(new Set(INTENTS.map((item) => item.key)).size).toBe(23);
    expect(new Set(INTENTS.map((item) => item.route)).size).toBe(23);
  });
  it('has four operational lenses and one isolated education lens', () => {
    expect(Object.keys(LENS_LABELS)).toEqual(['my-queue','customer-360','resolution-room','service-operations','education']);
    expect(INTENTS.filter((item) => item.operation === 'education')).toHaveLength(1);
  });
  it('gives every tool routing guidance and a realistic prompt', () => {
    for (const item of INTENTS) {
      expect(item.excludes.length).toBeGreaterThan(20);
      expect(item.prompt.length).toBeGreaterThan(20);
      expect(item.decisionQuestion.endsWith('?')).toBe(true);
      expect(item.outcome.length).toBeGreaterThan(30);
    }
    expect(new Set(INTENTS.map((item) => `${item.decisionQuestion} ${item.outcome} ${item.excludes}`)).size).toBe(23);
  });
  it('owns the case list and detail contract for every case-scoped tool', () => {
    expect(CASE_SCOPED_INTENTS.size).toBe(11);
    for (const key of Array.from(CASE_SCOPED_INTENTS)) expect(INTENTS.some((item) => item.key === key)).toBe(true);
    expect(CASE_SCOPED_INTENTS.has('ReviewServiceRecovery')).toBe(true);
    expect(CASE_SCOPED_INTENTS.has('ExploreServicePerformance')).toBe(false);
  });
});
