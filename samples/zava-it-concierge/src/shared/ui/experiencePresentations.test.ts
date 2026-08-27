import { INTENT_CATALOG } from '../intents/intentCatalog';
import { EXPERIENCE_PRESENTATIONS } from './experiencePresentations';

describe('inline experience presentations', () => {
  it('defines a data-rich presentation for every immutable intent', () => {
    expect(Object.keys(EXPERIENCE_PRESENTATIONS)).toHaveLength(INTENT_CATALOG.length);
    for (const intent of INTENT_CATALOG) {
      const presentation = EXPERIENCE_PRESENTATIONS[intent.name];
      expect(presentation.metricValue.length).toBeGreaterThan(0);
      expect(presentation.insight.length).toBeGreaterThan(20);
      expect(presentation.items.length).toBeGreaterThanOrEqual(3);
      expect(new Set(presentation.items.map((item) => item.id)).size).toBe(presentation.items.length);
    }
  });

  it('uses the complete set of inline composition profiles', () => {
    expect(new Set(INTENT_CATALOG.map((intent) => EXPERIENCE_PRESENTATIONS[intent.name].profile)).size).toBe(10);
  });
});