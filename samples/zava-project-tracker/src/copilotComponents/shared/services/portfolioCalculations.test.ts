import { ALLOCATIONS, PROJECTS, RISKS } from '../mockData/portfolioSeeds';
import {
  deriveProjectHealth,
  getAiBudgetConsumption,
  getBenefitCostRatio,
  getCostVariance,
  getPersonAllocation,
  getRiskExposure
} from './portfolioCalculations';

describe('portfolio calculations', () => {
  test('calculates project financial and AI budget positions', () => {
    expect(getCostVariance(PROJECTS[0])).toBe(23000);
    expect(getAiBudgetConsumption(PROJECTS[0])).toBe(81);
  });

  test('calculates risk and constrained-person exposure', () => {
    expect(getRiskExposure(RISKS[0])).toBe(20);
    expect(getPersonAllocation('pradeep', ALLOCATIONS)).toBe(118);
  });

  test('calculates portfolio benefit to forecast-cost ratio', () => {
    expect(getBenefitCostRatio(PROJECTS)).toBe(2.34);
  });

  test.each([
    [2, 72, 6, 'green'],
    [8, 81, 20, 'red'],
    [6, 88, 10, 'amber'],
    [1, 106, 4, 'red']
  ])('derives health for schedule %s, budget %s, and exposure %s', (schedule, budget, exposure, health) => {
    expect(deriveProjectHealth(schedule as number, budget as number, exposure as number)).toBe(health);
  });
});