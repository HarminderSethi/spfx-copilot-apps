import { NEGOTIATION_SCENARIOS } from '../domain/scenarioCatalog';
import { scenarioFromListRow, scenarioToListValues } from './scenarioListCodec';

describe('scenario list codec', () => {
  it.each(NEGOTIATION_SCENARIOS)('round-trips $title through the five-column row', (scenario) => {
    expect(scenarioFromListRow(scenarioToListValues(scenario))).toEqual(scenario);
  });

  it('rejects malformed TermsJson with a useful scenario key', () => {
    expect(() =>
      scenarioFromListRow({
        Title: 'Broken',
        ScenarioKey: 'broken',
        Briefing: 'Broken row',
        TermsJson: '{',
        Enabled: true
      })
    ).toThrow(/broken.*TermsJson/i);
  });

  it('adds help to previously provisioned rows while preserving saved terms and custom descriptions', () => {
    const scenario = NEGOTIATION_SCENARIOS.find(({ key }) => key === 'service-recovery');
    if (!scenario) throw new Error('Service recovery must be available.');
    const row = scenarioToListValues(scenario);
    const terms = JSON.parse(row.TermsJson);
    terms.issues.forEach((issue: { description?: string }) => { delete issue.description; });
    terms.issues[0].description = 'Site-specific credit guidance.';
    terms.playerOpening.creditPercent = 10;
    row.TermsJson = JSON.stringify(terms);
    const original = row.TermsJson;
    const loaded = scenarioFromListRow(row);
    expect(loaded.issues[0].description).toBe('Site-specific credit guidance.');
    expect(loaded.issues[1].description).toBe(scenario.issues[1].description);
    expect(loaded.issues[2].description).toContain('2 means two meetings');
    expect(loaded.playerOpening.creditPercent).toBe(10);
    expect(row.TermsJson).toBe(original);
  });
});
