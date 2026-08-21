import {
  AI_USAGE,
  ALLOCATIONS,
  APPROVALS,
  OBJECTIVES,
  PEOPLE,
  PROJECTS,
  RISKS,
  SCENARIOS,
  SNAPSHOTS,
  WORK_ITEMS,
  MILESTONES
} from '../mockData/portfolioSeeds';
import type { IProjectPortfolioExperience, ScenarioId } from '../models/portfolioDomain';

const addDays = (date: Date, offsetDays: number): Date => {
  const result = new Date(date.getTime());
  result.setDate(result.getDate() + offsetDays);
  return result;
};

export interface IProjectPortfolioDataService {
  getExperience(now?: Date, scenarioId?: ScenarioId): IProjectPortfolioExperience;
}

export class MockProjectPortfolioDataService implements IProjectPortfolioDataService {
  public getExperience(now: Date = new Date(), scenarioId: ScenarioId = 'leadership-demo'): IProjectPortfolioExperience {
    const scenario = SCENARIOS.find((item) => item.id === scenarioId) || SCENARIOS[0];
    return {
      asOf: new Date(now.getTime()),
      scenario,
      people: PEOPLE,
      objectives: OBJECTIVES,
      projects: PROJECTS.map(({ nextGateOffsetDays, ...project }) => ({
        ...project,
        aiSpend: Math.round(project.aiSpend * scenario.aiSpendMultiplier),
        nextGateDate: addDays(now, nextGateOffsetDays)
      })),
      workItems: WORK_ITEMS.map(({ dueOffsetDays, ...workItem }) => ({
        ...workItem,
        dueDate: addDays(now, dueOffsetDays)
      })),
      milestones: MILESTONES.map(({ baselineOffsetDays, forecastOffsetDays, ...milestone }) => ({
        ...milestone,
        baselineDate: addDays(now, baselineOffsetDays),
        forecastDate: addDays(now, forecastOffsetDays)
      })),
      risks: RISKS.map(({ dueOffsetDays, ...risk }) => ({
        ...risk,
        probability: Math.min(5, Math.round(risk.probability * scenario.riskMultiplier)),
        exposure: Math.min(25, Math.round(risk.probability * scenario.riskMultiplier) * risk.impact),
        dueDate: addDays(now, dueOffsetDays)
      })),
      allocations: ALLOCATIONS.map(({ startOffsetDays, endOffsetDays, ...allocation }) => ({
        ...allocation,
        allocationPercent: Math.round(allocation.allocationPercent * scenario.allocationMultiplier),
        startDate: addDays(now, startOffsetDays),
        endDate: addDays(now, endOffsetDays)
      })),
      aiUsage: AI_USAGE.map(({ usageOffsetDays, ...usage }) => ({
        ...usage,
        cost: Math.round(usage.cost * scenario.aiSpendMultiplier),
        usageDate: addDays(now, usageOffsetDays)
      })),
      approvals: APPROVALS.map(({ dueOffsetDays, ...approval }) => ({
        ...approval,
        dueDate: addDays(now, dueOffsetDays)
      })),
      snapshots: SNAPSHOTS
    };
  }
}