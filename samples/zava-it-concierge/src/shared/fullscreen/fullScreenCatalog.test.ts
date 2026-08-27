import { INTENT_CATALOG } from '../intents/intentCatalog';
import type { IIntentDefinition } from '../intents/intentCatalog';
import { FULL_SCREEN_LENSES, getFullScreenLensIntents, resolveFullScreenLens } from './fullScreenCatalog';
import type { FullScreenLens } from './fullScreenCatalog';

const LENS_IDS: readonly FullScreenLens[] = ['personal', 'team', 'portfolio'];

describe('full-screen product mapping', () => {
  it('maps every inline intent to exactly one business lens', () => {
    const mapped = LENS_IDS.reduce<string[]>((names, lens) => names.concat(getFullScreenLensIntents(lens).map((intent) => intent.name)), []);

    expect(mapped).toHaveLength(31);
    expect(new Set(mapped).size).toBe(31);
    expect(INTENT_CATALOG.every((intent) => mapped.indexOf(intent.name) >= 0)).toBe(true);
  });

  it('routes personal, team, and organization use cases to their owning tabs', () => {
    const find = (name: string): IIntentDefinition => INTENT_CATALOG.find((intent) => intent.name === name)!;

    expect(resolveFullScreenLens(find('ReportItIssue'))).toBe('personal');
    expect(resolveFullScreenLens(find('ReviewDeviceApproval'))).toBe('team');
    expect(resolveFullScreenLens(find('GetFleetHealth'))).toBe('portfolio');
    expect(resolveFullScreenLens(find('GenerateItBrief'))).toBe('portfolio');
  });

  it('defines a business question, outcome, metrics, and default for every lens', () => {
    LENS_IDS.map((id) => FULL_SCREEN_LENSES[id]).forEach((lens) => {
      expect(lens.businessQuestion.length).toBeGreaterThan(20);
      expect(lens.outcome.length).toBeGreaterThan(20);
      expect(lens.metrics).toHaveLength(3);
      expect(getFullScreenLensIntents(lens.id).some((intent) => intent.name === lens.defaultIntent)).toBe(true);
    });
  });
});