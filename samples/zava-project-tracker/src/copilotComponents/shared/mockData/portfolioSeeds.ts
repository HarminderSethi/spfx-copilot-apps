import type {
  IAiUsageRecord,
  IAllocationRecord,
  IApprovalRecord,
  IMetricSnapshot,
  IMilestoneRecord,
  IPersonRecord,
  IProjectRecord,
  IRiskRecord,
  IScenarioDefinition,
  IStrategicObjectiveRecord,
  IWorkItemRecord
} from '../models/portfolioDomain';

export const PEOPLE: IPersonRecord[] = [
  { id: 'megan', displayName: 'Megan Bowen', role: 'Senior Program Manager', imageKey: 'Megan-Bowen', weeklyCapacityHours: 40, skills: ['portfolio governance', 'delivery'] },
  { id: 'joni', displayName: 'Joni Sherman', role: 'VP, Digital Strategy', imageKey: 'Joni-Sherman', weeklyCapacityHours: 40, skills: ['strategy', 'sponsorship'] },
  { id: 'pradeep', displayName: 'Pradeep Gupta', role: 'AI Platform Lead', imageKey: 'Pradeep-Gupta', weeklyCapacityHours: 40, skills: ['AI platform', 'evaluation'] },
  { id: 'miriam', displayName: 'Miriam Graham', role: 'Finance Business Partner', imageKey: 'Miriam-Graham', weeklyCapacityHours: 40, skills: ['finance', 'forecasting'] },
  { id: 'diego', displayName: 'Diego Siciliani', role: 'Engineering Manager', imageKey: 'Diego-Siciliani', weeklyCapacityHours: 40, skills: ['engineering', 'architecture'] },
  { id: 'johanna', displayName: 'Johanna Lorenz', role: 'Product Director', imageKey: 'Johanna-Lorenz', weeklyCapacityHours: 40, skills: ['product', 'adoption'] },
  { id: 'lee', displayName: 'Lee Gu', role: 'UX and Adoption Lead', imageKey: 'Lee-Gu', weeklyCapacityHours: 40, skills: ['research', 'adoption'] },
  { id: 'nestor', displayName: 'Nestor Wilke', role: 'Responsible AI Lead', imageKey: 'Nestor-Wilke', weeklyCapacityHours: 40, skills: ['security', 'responsible AI'] },
  { id: 'patti', displayName: 'Patti Fernandez', role: 'Change Lead', imageKey: 'Patti-Fernandez', weeklyCapacityHours: 40, skills: ['change', 'communications'] },
  { id: 'isaiah', displayName: 'Isaiah Langer', role: 'Data Engineering Lead', imageKey: 'Isaiah-Langer', weeklyCapacityHours: 40, skills: ['data engineering', 'forecasting'] },
  { id: 'grady', displayName: 'Grady Archie', role: 'Procurement Lead', imageKey: 'Grady-Archie', weeklyCapacityHours: 40, skills: ['procurement', 'supplier risk'] }
];

export const OBJECTIVES: IStrategicObjectiveRecord[] = [
  { id: 'OBJ-01', title: 'Scale responsible AI adoption', ownerId: 'joni', keyResults: [{ id: 'KR-01', title: 'Production AI experiences', target: 8, current: 5, unit: 'count' }, { id: 'KR-02', title: 'Responsible AI controls complete', target: 100, current: 82, unit: 'percent' }] },
  { id: 'OBJ-02', title: 'Improve customer productivity', ownerId: 'johanna', keyResults: [{ id: 'KR-03', title: 'Agent-assisted resolution', target: 35, current: 24, unit: 'percent' }, { id: 'KR-04', title: 'Annual benefit realized', target: 5000000, current: 3100000, unit: 'currency' }] },
  { id: 'OBJ-03', title: 'Modernize operational decisions', ownerId: 'joni', keyResults: [{ id: 'KR-05', title: 'Forecast accuracy', target: 92, current: 88, unit: 'percent' }] },
  { id: 'OBJ-04', title: 'Reduce information friction', ownerId: 'johanna', keyResults: [{ id: 'KR-06', title: 'Search time reduction', target: 40, current: 31, unit: 'percent' }] },
  { id: 'OBJ-05', title: 'Create reusable AI foundations', ownerId: 'pradeep', keyResults: [{ id: 'KR-07', title: 'Shared platform adoption', target: 6, current: 4, unit: 'count' }] }
];

export const PROJECTS: IProjectRecord[] = [
  { id: 'PRJ-2601', title: 'Customer Service Copilot', phase: 'pilot', health: 'amber', managerId: 'megan', sponsorId: 'joni', objectiveIds: ['OBJ-01', 'OBJ-02'], baselineBudget: 920000, forecastCost: 897000, forecastBenefit: 2800000, aiBudget: 220000, aiSpend: 178200, scheduleVarianceDays: 8, nextGateOffsetDays: 43 },
  { id: 'PRJ-2602', title: 'Demand Forecasting Modernization', phase: 'execute', health: 'green', managerId: 'isaiah', sponsorId: 'johanna', objectiveIds: ['OBJ-03'], baselineBudget: 1100000, forecastCost: 1070000, forecastBenefit: 3600000, aiBudget: 180000, aiSpend: 121000, scheduleVarianceDays: -2, nextGateOffsetDays: 28 },
  { id: 'PRJ-2603', title: 'Contract Intelligence', phase: 'validate', health: 'red', managerId: 'pradeep', sponsorId: 'grady', objectiveIds: ['OBJ-03', 'OBJ-04'], baselineBudget: 780000, forecastCost: 844000, forecastBenefit: 1900000, aiBudget: 160000, aiSpend: 149000, scheduleVarianceDays: 19, nextGateOffsetDays: 21 },
  { id: 'PRJ-2604', title: 'Knowledge Discovery Platform', phase: 'execute', health: 'green', managerId: 'diego', sponsorId: 'joni', objectiveIds: ['OBJ-04', 'OBJ-05'], baselineBudget: 1400000, forecastCost: 1378000, forecastBenefit: 2200000, aiBudget: 290000, aiSpend: 187000, scheduleVarianceDays: 0, nextGateOffsetDays: 35 },
  { id: 'PRJ-2605', title: 'Sales Meeting Assistant', phase: 'discover', health: 'amber', managerId: 'lee', sponsorId: 'johanna', objectiveIds: ['OBJ-02'], baselineBudget: 540000, forecastCost: 552000, forecastBenefit: 1200000, aiBudget: 90000, aiSpend: 41000, scheduleVarianceDays: 6, nextGateOffsetDays: 17 },
  { id: 'PRJ-2606', title: 'Supply Chain Exception Agent', phase: 'intake', health: 'amber', managerId: 'patti', sponsorId: 'joni', objectiveIds: ['OBJ-03'], baselineBudget: 640000, forecastCost: 640000, forecastBenefit: 1800000, aiBudget: 120000, aiSpend: 0, scheduleVarianceDays: 0, nextGateOffsetDays: 12 },
  { id: 'PRJ-2607', title: 'Responsible AI Controls', phase: 'execute', health: 'green', managerId: 'nestor', sponsorId: 'joni', objectiveIds: ['OBJ-01', 'OBJ-05'], baselineBudget: 860000, forecastCost: 842000, forecastBenefit: 900000, aiBudget: 130000, aiSpend: 76000, scheduleVarianceDays: -3, nextGateOffsetDays: 24 },
  { id: 'PRJ-2608', title: 'Invoice Processing Automation', phase: 'close', health: 'green', managerId: 'miriam', sponsorId: 'grady', objectiveIds: ['OBJ-03'], baselineBudget: 680000, forecastCost: 661000, forecastBenefit: 1700000, aiBudget: 105000, aiSpend: 99000, scheduleVarianceDays: 0, nextGateOffsetDays: 8 }
];

export const WORK_ITEMS: IWorkItemRecord[] = [
  { id: 'WI-01', projectId: 'PRJ-2601', title: 'Complete evaluation dataset review', ownerId: 'pradeep', status: 'blocked', priority: 'critical', dueOffsetDays: 2 },
  { id: 'WI-02', projectId: 'PRJ-2601', title: 'Close Responsible AI evidence gap', ownerId: 'nestor', status: 'in-progress', priority: 'critical', dueOffsetDays: 6 },
  { id: 'WI-03', projectId: 'PRJ-2601', title: 'Prepare pilot exit narrative', ownerId: 'megan', status: 'in-progress', priority: 'high', dueOffsetDays: 5 },
  { id: 'WI-04', projectId: 'PRJ-2602', title: 'Validate forecast accuracy', ownerId: 'isaiah', status: 'in-progress', priority: 'high', dueOffsetDays: 8 },
  { id: 'WI-05', projectId: 'PRJ-2603', title: 'Resolve supplier security findings', ownerId: 'grady', status: 'blocked', priority: 'critical', dueOffsetDays: 3 },
  { id: 'WI-06', projectId: 'PRJ-2603', title: 'Review clause extraction quality', ownerId: 'pradeep', status: 'in-progress', priority: 'high', dueOffsetDays: 7 },
  { id: 'WI-07', projectId: 'PRJ-2604', title: 'Publish shared platform release', ownerId: 'diego', status: 'in-progress', priority: 'critical', dueOffsetDays: 11 },
  { id: 'WI-08', projectId: 'PRJ-2605', title: 'Complete adoption research', ownerId: 'lee', status: 'not-started', priority: 'high', dueOffsetDays: 9 },
  { id: 'WI-09', projectId: 'PRJ-2606', title: 'Complete benefit baseline', ownerId: 'patti', status: 'not-started', priority: 'high', dueOffsetDays: 4 },
  { id: 'WI-10', projectId: 'PRJ-2607', title: 'Approve control evidence template', ownerId: 'nestor', status: 'in-progress', priority: 'normal', dueOffsetDays: 13 },
  { id: 'WI-11', projectId: 'PRJ-2608', title: 'Validate realized benefits', ownerId: 'miriam', status: 'in-progress', priority: 'normal', dueOffsetDays: 7 },
  { id: 'WI-12', projectId: 'PRJ-2608', title: 'Publish lessons learned', ownerId: 'megan', status: 'not-started', priority: 'normal', dueOffsetDays: 12 }
];

export const MILESTONES: IMilestoneRecord[] = [
  { id: 'MS-01', projectId: 'PRJ-2601', title: 'Pilot exit gate', ownerId: 'megan', baselineOffsetDays: 35, forecastOffsetDays: 43, confidencePercent: 82, gate: true },
  { id: 'MS-02', projectId: 'PRJ-2602', title: 'Forecast rollout', ownerId: 'isaiah', baselineOffsetDays: 29, forecastOffsetDays: 27, confidencePercent: 94, gate: true },
  { id: 'MS-03', projectId: 'PRJ-2603', title: 'Security validation', ownerId: 'grady', baselineOffsetDays: 12, forecastOffsetDays: 31, confidencePercent: 48, gate: true },
  { id: 'MS-04', projectId: 'PRJ-2604', title: 'Shared platform release', ownerId: 'diego', baselineOffsetDays: 35, forecastOffsetDays: 35, confidencePercent: 91, gate: false },
  { id: 'MS-05', projectId: 'PRJ-2605', title: 'Adoption evidence review', ownerId: 'lee', baselineOffsetDays: 17, forecastOffsetDays: 23, confidencePercent: 68, gate: true },
  { id: 'MS-06', projectId: 'PRJ-2606', title: 'Intake decision', ownerId: 'patti', baselineOffsetDays: 12, forecastOffsetDays: 12, confidencePercent: 72, gate: true },
  { id: 'MS-07', projectId: 'PRJ-2607', title: 'Control framework release', ownerId: 'nestor', baselineOffsetDays: 24, forecastOffsetDays: 21, confidencePercent: 96, gate: false },
  { id: 'MS-08', projectId: 'PRJ-2608', title: 'Project closure', ownerId: 'miriam', baselineOffsetDays: 8, forecastOffsetDays: 8, confidencePercent: 93, gate: true }
];

export const RISKS: IRiskRecord[] = [
  { id: 'RSK-01', projectId: 'PRJ-2601', title: 'Evaluation data quality', ownerId: 'pradeep', probability: 4, impact: 5, trend: 'worsening', dueOffsetDays: 5 },
  { id: 'RSK-02', projectId: 'PRJ-2601', title: 'Responsible AI evidence incomplete', ownerId: 'nestor', probability: 3, impact: 5, trend: 'stable', dueOffsetDays: 9 },
  { id: 'RSK-03', projectId: 'PRJ-2603', title: 'Supplier security review delayed', ownerId: 'grady', probability: 5, impact: 5, trend: 'worsening', dueOffsetDays: 3 },
  { id: 'RSK-04', projectId: 'PRJ-2604', title: 'Shared platform release collision', ownerId: 'diego', probability: 3, impact: 4, trend: 'stable', dueOffsetDays: 16 },
  { id: 'RSK-05', projectId: 'PRJ-2605', title: 'Adoption evidence below threshold', ownerId: 'lee', probability: 4, impact: 3, trend: 'improving', dueOffsetDays: 12 },
  { id: 'RSK-06', projectId: 'PRJ-2602', title: 'Data engineering capacity pressure', ownerId: 'isaiah', probability: 3, impact: 4, trend: 'stable', dueOffsetDays: 22 }
];

export const ALLOCATIONS: IAllocationRecord[] = [
  { id: 'AL-01', projectId: 'PRJ-2601', personId: 'megan', role: 'Program management', allocationPercent: 60, startOffsetDays: -45, endOffsetDays: 90 },
  { id: 'AL-02', projectId: 'PRJ-2603', personId: 'megan', role: 'Governance', allocationPercent: 32, startOffsetDays: -30, endOffsetDays: 60 },
  { id: 'AL-03', projectId: 'PRJ-2601', personId: 'pradeep', role: 'AI platform review', allocationPercent: 48, startOffsetDays: -20, endOffsetDays: 75 },
  { id: 'AL-04', projectId: 'PRJ-2603', personId: 'pradeep', role: 'AI architecture', allocationPercent: 45, startOffsetDays: -25, endOffsetDays: 80 },
  { id: 'AL-05', projectId: 'PRJ-2604', personId: 'pradeep', role: 'Platform governance', allocationPercent: 25, startOffsetDays: -60, endOffsetDays: 120 },
  { id: 'AL-06', projectId: 'PRJ-2604', personId: 'diego', role: 'Engineering leadership', allocationPercent: 70, startOffsetDays: -90, endOffsetDays: 100 },
  { id: 'AL-07', projectId: 'PRJ-2602', personId: 'isaiah', role: 'Data engineering', allocationPercent: 88, startOffsetDays: -70, endOffsetDays: 110 },
  { id: 'AL-08', projectId: 'PRJ-2605', personId: 'lee', role: 'UX and adoption', allocationPercent: 82, startOffsetDays: -35, endOffsetDays: 95 }
];

export const AI_USAGE: IAiUsageRecord[] = [
  { id: 'AIU-01', projectId: 'PRJ-2601', model: 'GPT-5', environment: 'evaluation', feature: 'Resolution evaluation', inputTokens: 2400000, outputTokens: 620000, requests: 18400, cost: 3860, usageOffsetDays: -1 },
  { id: 'AIU-02', projectId: 'PRJ-2601', model: 'GPT-5 mini', environment: 'pilot', feature: 'Agent responses', inputTokens: 8200000, outputTokens: 1900000, requests: 74200, cost: 11800, usageOffsetDays: -4 },
  { id: 'AIU-03', projectId: 'PRJ-2603', model: 'GPT-5', environment: 'evaluation', feature: 'Clause extraction', inputTokens: 5300000, outputTokens: 880000, requests: 22600, cost: 9200, usageOffsetDays: -2 },
  { id: 'AIU-04', projectId: 'PRJ-2604', model: 'text-embedding-3-large', environment: 'production', feature: 'Knowledge indexing', inputTokens: 28200000, outputTokens: 0, requests: 410000, cost: 6400, usageOffsetDays: -3 },
  { id: 'AIU-05', projectId: 'PRJ-2602', model: 'GPT-5 mini', environment: 'pilot', feature: 'Forecast narrative', inputTokens: 3100000, outputTokens: 720000, requests: 19400, cost: 4700, usageOffsetDays: -5 }
];

export const APPROVALS: IApprovalRecord[] = [
  { id: 'APR-01', type: 'resource', projectId: 'PRJ-2601', requesterId: 'megan', decisionMakerId: 'joni', status: 'pending', dueOffsetDays: 1, evidencePercent: 100 },
  { id: 'APR-02', type: 'budget', projectId: 'PRJ-2601', requesterId: 'megan', decisionMakerId: 'miriam', status: 'pending', requestedAmount: 75000, dueOffsetDays: 2, evidencePercent: 94 },
  { id: 'APR-03', type: 'stage-gate', projectId: 'PRJ-2601', requesterId: 'megan', decisionMakerId: 'joni', status: 'pending', dueOffsetDays: 6, evidencePercent: 82 },
  { id: 'APR-04', type: 'project-request', projectId: 'PRJ-2606', requesterId: 'patti', decisionMakerId: 'joni', status: 'pending', requestedAmount: 640000, dueOffsetDays: 4, evidencePercent: 72 }
];

export const SNAPSHOTS: IMetricSnapshot[] = [
  { id: 'SNP-01', projectId: 'PRJ-2601', capturedOffsetDays: -28, health: 'green', forecastCost: 861000, aiSpend: 132000, scheduleVarianceDays: 1, capacityPercent: 87 },
  { id: 'SNP-02', projectId: 'PRJ-2601', capturedOffsetDays: -14, health: 'amber', forecastCost: 879000, aiSpend: 151000, scheduleVarianceDays: 4, capacityPercent: 91 },
  { id: 'SNP-03', projectId: 'PRJ-2603', capturedOffsetDays: -14, health: 'amber', forecastCost: 807000, aiSpend: 127000, scheduleVarianceDays: 11, capacityPercent: 103 }
];

export const SCENARIOS: IScenarioDefinition[] = [
  { id: 'leadership-demo', title: 'Leadership demo', description: 'Balanced story with visible delivery, spend, and capacity decisions.', allocationMultiplier: 1, riskMultiplier: 1, aiSpendMultiplier: 1 },
  { id: 'portfolio-healthy', title: 'Portfolio healthy', description: 'Improved delivery confidence and sustainable capacity.', allocationMultiplier: 0.88, riskMultiplier: 0.72, aiSpendMultiplier: 0.94 },
  { id: 'capacity-pressure', title: 'Capacity pressure', description: 'Review capacity becomes the dominant portfolio constraint.', allocationMultiplier: 1.18, riskMultiplier: 1.16, aiSpendMultiplier: 1.04 }
];