export type ProjectHealth = 'green' | 'amber' | 'red';
export type ProjectPhase = 'intake' | 'discover' | 'validate' | 'pilot' | 'execute' | 'close';
export type ScenarioId = 'leadership-demo' | 'portfolio-healthy' | 'capacity-pressure';

export interface IPersonRecord {
  id: string;
  displayName: string;
  role: string;
  imageKey: string;
  weeklyCapacityHours: number;
  skills: string[];
}

export interface IStrategicObjectiveRecord {
  id: string;
  title: string;
  ownerId: string;
  keyResults: IKeyResultRecord[];
}

export interface IKeyResultRecord {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: 'percent' | 'currency' | 'count';
}

export interface IProjectRecord {
  id: string;
  title: string;
  phase: ProjectPhase;
  health: ProjectHealth;
  managerId: string;
  sponsorId: string;
  objectiveIds: string[];
  baselineBudget: number;
  forecastCost: number;
  forecastBenefit: number;
  aiBudget: number;
  aiSpend: number;
  scheduleVarianceDays: number;
  nextGateOffsetDays: number;
}

export interface IWorkItemRecord {
  id: string;
  projectId: string;
  title: string;
  ownerId: string;
  status: 'not-started' | 'in-progress' | 'blocked' | 'complete';
  priority: 'critical' | 'high' | 'normal';
  dueOffsetDays: number;
}

export interface IMilestoneRecord {
  id: string;
  projectId: string;
  title: string;
  ownerId: string;
  baselineOffsetDays: number;
  forecastOffsetDays: number;
  confidencePercent: number;
  gate: boolean;
}

export interface IRiskRecord {
  id: string;
  projectId: string;
  title: string;
  ownerId: string;
  probability: number;
  impact: number;
  trend: 'improving' | 'stable' | 'worsening';
  dueOffsetDays: number;
}

export interface IAllocationRecord {
  id: string;
  projectId: string;
  personId: string;
  role: string;
  allocationPercent: number;
  startOffsetDays: number;
  endOffsetDays: number;
}

export interface IAiUsageRecord {
  id: string;
  projectId: string;
  model: string;
  environment: 'evaluation' | 'pilot' | 'production';
  feature: string;
  inputTokens: number;
  outputTokens: number;
  requests: number;
  cost: number;
  usageOffsetDays: number;
}

export interface IApprovalRecord {
  id: string;
  type: 'project-request' | 'budget' | 'resource' | 'stage-gate';
  projectId: string;
  requesterId: string;
  decisionMakerId: string;
  status: 'pending' | 'returned' | 'approved';
  requestedAmount?: number;
  dueOffsetDays: number;
  evidencePercent: number;
}

export interface IMetricSnapshot {
  id: string;
  projectId: string;
  capturedOffsetDays: number;
  health: ProjectHealth;
  forecastCost: number;
  aiSpend: number;
  scheduleVarianceDays: number;
  capacityPercent: number;
}

export interface IScenarioDefinition {
  id: ScenarioId;
  title: string;
  description: string;
  allocationMultiplier: number;
  riskMultiplier: number;
  aiSpendMultiplier: number;
}

export interface IResolvedProjectRecord extends Omit<IProjectRecord, 'nextGateOffsetDays'> {
  nextGateDate: Date;
}

export interface IProjectPortfolioExperience {
  asOf: Date;
  scenario: IScenarioDefinition;
  people: IPersonRecord[];
  objectives: IStrategicObjectiveRecord[];
  projects: IResolvedProjectRecord[];
  workItems: Array<Omit<IWorkItemRecord, 'dueOffsetDays'> & { dueDate: Date }>;
  milestones: Array<Omit<IMilestoneRecord, 'baselineOffsetDays' | 'forecastOffsetDays'> & { baselineDate: Date; forecastDate: Date }>;
  risks: Array<Omit<IRiskRecord, 'dueOffsetDays'> & { dueDate: Date; exposure: number }>;
  allocations: Array<Omit<IAllocationRecord, 'startOffsetDays' | 'endOffsetDays'> & { startDate: Date; endDate: Date }>;
  aiUsage: Array<Omit<IAiUsageRecord, 'usageOffsetDays'> & { usageDate: Date }>;
  approvals: Array<Omit<IApprovalRecord, 'dueOffsetDays'> & { dueDate: Date }>;
  snapshots: IMetricSnapshot[];
}