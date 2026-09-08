import { validateOffer, counterImprovesAtLeastOneTermForPlayer } from './negotiation';
import { NEGOTIATION_SCENARIOS } from './scenarioCatalog';

describe('lean scenario catalog', () => {
  it('contains exactly three scenarios with unique keys', () => {
    expect(NEGOTIATION_SCENARIOS).toHaveLength(3);
    expect(new Set(NEGOTIATION_SCENARIOS.map(({ key }) => key)).size).toBe(3);
  });

  it.each(NEGOTIATION_SCENARIOS)('$title has complete legal opening offers', (scenario) => {
    expect(validateOffer(scenario, scenario.playerOpening)).toEqual(
      scenario.playerOpening
    );
    expect(validateOffer(scenario, scenario.counterpartOpening)).toEqual(
      scenario.counterpartOpening
    );
    for (const issue of scenario.issues) {
      const opening = scenario.counterpartOpening[issue.key];
      expect(opening).not.toBe(scenario.playerOpening[issue.key]);
      if (issue.kind === 'number') {
        expect(opening).toBeGreaterThan(issue.minimum);
        expect(opening).toBeLessThan(issue.maximum);
      } else {
        const index = issue.options.findIndex(({ value }) => value === opening);
        expect(index).toBeGreaterThan(0);
        expect(index).toBeLessThan(issue.options.length - 1);
      }
    }
  });

  it.each([
    ['saas-renewal', { annualFeeChf: 108000, contractMonths: 36, supportHours: 12 }, 'annualFeeChf', 'contractMonths'],
    ['job-offer', { baseSalaryChf: 135000, remoteDays: 2, startTiming: 'immediate' }, 'baseSalaryChf', 'startTiming'],
    ['service-recovery', { creditPercent: 10, responseTarget: '30-minutes', reviewMonths: 4 }, 'creditPercent', 'responseTarget']
  ] as const)('%s supports a concrete give-and-get trade', (key, offer, gain, give) => {
    const scenario = NEGOTIATION_SCENARIOS.find((item) => item.key === key)!;
    expect(validateOffer(scenario, offer)).toEqual(offer);
    expect(counterImprovesAtLeastOneTermForPlayer(scenario, scenario.counterpartOpening, {
      ...scenario.counterpartOpening, [gain]: offer[gain as keyof typeof offer]
    })).toBe(true);
    expect(counterImprovesAtLeastOneTermForPlayer(scenario, {
      ...scenario.counterpartOpening, [give]: offer[give as keyof typeof offer]
    }, scenario.counterpartOpening)).toBe(true);
  });
});
