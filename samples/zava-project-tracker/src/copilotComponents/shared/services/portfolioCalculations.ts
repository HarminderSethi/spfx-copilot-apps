import type { IAllocationRecord, IProjectRecord, IRiskRecord, ProjectHealth } from '../models/portfolioDomain';

export const getCostVariance = (project: Pick<IProjectRecord, 'baselineBudget' | 'forecastCost'>): number =>
  project.baselineBudget - project.forecastCost;

export const getAiBudgetConsumption = (project: Pick<IProjectRecord, 'aiBudget' | 'aiSpend'>): number =>
  project.aiBudget === 0 ? 0 : Math.round(project.aiSpend / project.aiBudget * 100);

export const getRiskExposure = (risk: Pick<IRiskRecord, 'probability' | 'impact'>): number =>
  risk.probability * risk.impact;

export const getPersonAllocation = (
  personId: string,
  allocations: Array<Pick<IAllocationRecord, 'personId' | 'allocationPercent'>>
): number => allocations
  .filter((allocation) => allocation.personId === personId)
  .reduce((total, allocation) => total + allocation.allocationPercent, 0);

export const getBenefitCostRatio = (
  projects: Array<Pick<IProjectRecord, 'forecastBenefit' | 'forecastCost'>>
): number => {
  const cost = projects.reduce((total, project) => total + project.forecastCost, 0);
  const benefit = projects.reduce((total, project) => total + project.forecastBenefit, 0);
  return cost === 0 ? 0 : Math.round(benefit / cost * 100) / 100;
};

export const deriveProjectHealth = (
  scheduleVarianceDays: number,
  budgetConsumptionPercent: number,
  highestRiskExposure: number
): ProjectHealth => {
  if (scheduleVarianceDays > 14 || budgetConsumptionPercent > 105 || highestRiskExposure >= 20) {
    return 'red';
  }
  if (scheduleVarianceDays > 5 || budgetConsumptionPercent > 90 || highestRiskExposure >= 12) {
    return 'amber';
  }
  return 'green';
};