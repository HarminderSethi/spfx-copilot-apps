export type ReviewKind = 'project' | 'budget' | 'resource' | 'gate';

export interface IReviewItem {
  id: string;
  intentKey: string;
  kind: ReviewKind;
  title: string;
  person: string;
  imageKey: string;
  context: string;
  consequence: string;
  receiptId: string;
  due: string;
  evidence: number;
  amount?: number;
  allocation?: number;
  blocked?: boolean;
}

export const PROJECT_REQUESTS: ReadonlyArray<IReviewItem> = [
  { id: 'PRQ-2606', intentKey: 'ReviewProjectRequest', kind: 'project', title: 'Supply Chain Exception Agent', person: 'Patti Fernandez', imageKey: 'Patti-Fernandez', context: '$640k requested / strategic fit 86', consequence: 'Approval starts discovery. Return requests a completed benefit baseline.', receiptId: 'APR-PRJ-2606', due: 'Due tomorrow', evidence: 72, amount: 640000 },
  { id: 'PRQ-2609', intentKey: 'ReviewProjectRequest', kind: 'project', title: 'Sales Quality Coach', person: 'Lee Gu', imageKey: 'Lee-Gu', context: '$420k requested / strategic fit 78', consequence: 'Approval starts validation and assigns the Product Council sponsor.', receiptId: 'APR-PRJ-2609', due: 'Due Friday', evidence: 88, amount: 420000 },
  { id: 'PRQ-2610', intentKey: 'ReviewProjectRequest', kind: 'project', title: 'Invoice Anomaly Agent', person: 'Miriam Graham', imageKey: 'Miriam-Graham', context: '$310k requested / strategic fit 71', consequence: 'Return requests duplicate-platform analysis before intake.', receiptId: 'APR-PRJ-2610', due: 'Due next week', evidence: 64, amount: 310000 }
];

export const BUDGET_REQUESTS: ReadonlyArray<IReviewItem> = [
  { id: 'BUD-2601', intentKey: 'ReviewProjectBudget', kind: 'budget', title: 'Customer Service Copilot AI budget', person: 'Megan Bowen', imageKey: 'Megan-Bowen', context: '$75k / production capacity', consequence: 'Approval protects $620k forecast benefit and the production date.', receiptId: 'APR-BUD-2601', due: 'Due in 2 days', evidence: 94, amount: 75000 },
  { id: 'BUD-2603', intentKey: 'ReviewProjectBudget', kind: 'budget', title: 'Contract Intelligence supplier change', person: 'Pradeep Gupta', imageKey: 'Pradeep-Gupta', context: '$120k / security remediation', consequence: 'Approval funds the remediation path; return delays validation by four weeks.', receiptId: 'APR-BUD-2603', due: 'Due today', evidence: 81, amount: 120000 },
  { id: 'BUD-2604', intentKey: 'ReviewProjectBudget', kind: 'budget', title: 'Knowledge Platform indexing scale', person: 'Diego Siciliani', imageKey: 'Diego-Siciliani', context: '$48k / production indexing', consequence: 'Approval raises the indexing ceiling for three dependent projects.', receiptId: 'APR-BUD-2604', due: 'Due Friday', evidence: 100, amount: 48000 }
];

export const RESOURCE_REQUESTS: ReadonlyArray<IReviewItem> = [
  { id: 'RES-2601', intentKey: 'ReviewResourceAssignment', kind: 'resource', title: 'Customer Service Copilot / AI review', person: 'Pradeep Gupta', imageKey: 'Pradeep-Gupta', context: '40% requested / Sep-Oct', consequence: 'A 20% assignment protects Contract Intelligence while meeting the review need.', receiptId: 'APR-RES-2601', due: 'Due tomorrow', evidence: 100, allocation: 40 },
  { id: 'RES-2602', intentKey: 'ReviewResourceAssignment', kind: 'resource', title: 'Demand Forecasting / data engineering', person: 'Isaiah Langer', imageKey: 'Isaiah-Langer', context: '30% requested / next quarter', consequence: 'Approval closes the forecast-engineering gap without overtime.', receiptId: 'APR-RES-2602', due: 'Due Friday', evidence: 92, allocation: 30 },
  { id: 'RES-2605', intentKey: 'ReviewResourceAssignment', kind: 'resource', title: 'Sales Meeting Assistant / adoption', person: 'Lee Gu', imageKey: 'Lee-Gu', context: '20% requested / six weeks', consequence: 'Approval protects the adoption evidence milestone.', receiptId: 'APR-RES-2605', due: 'Due next week', evidence: 86, allocation: 20 }
];

export const GATE_REQUESTS: ReadonlyArray<IReviewItem> = [
  { id: 'GATE-2601', intentKey: 'ReviewStageGate', kind: 'gate', title: 'Customer Service Copilot / Pilot exit', person: 'Megan Bowen', imageKey: 'Megan-Bowen', context: 'Criteria 82% / one blocker', consequence: 'Production approval remains blocked until Responsible AI evidence is complete.', receiptId: 'APR-GATE-2601', due: 'Due Friday', evidence: 82, blocked: true },
  { id: 'GATE-2603', intentKey: 'ReviewStageGate', kind: 'gate', title: 'Contract Intelligence / Validate exit', person: 'Pradeep Gupta', imageKey: 'Pradeep-Gupta', context: 'Criteria 91% / security accepted', consequence: 'Approval moves the project into pilot with monitored supplier risk.', receiptId: 'APR-GATE-2603', due: 'Due Monday', evidence: 91 },
  { id: 'GATE-2608', intentKey: 'ReviewStageGate', kind: 'gate', title: 'Invoice Automation / Closure', person: 'Miriam Graham', imageKey: 'Miriam-Graham', context: 'Criteria 96% / benefits verified', consequence: 'Approval closes delivery and starts benefits tracking.', receiptId: 'APR-GATE-2608', due: 'Due next week', evidence: 96 }
];

export const REVIEW_QUEUE_BY_INTENT: Readonly<Record<string, ReadonlyArray<IReviewItem>>> = {
  GetApprovalInbox: [RESOURCE_REQUESTS[0], BUDGET_REQUESTS[0], GATE_REQUESTS[0], PROJECT_REQUESTS[0]],
  ReviewProjectRequest: PROJECT_REQUESTS,
  ReviewProjectBudget: BUDGET_REQUESTS,
  ReviewResourceAssignment: RESOURCE_REQUESTS,
  ReviewStageGate: GATE_REQUESTS
};

export const ALL_REVIEW_DECISIONS: ReadonlyArray<IReviewItem> = [
  ...RESOURCE_REQUESTS,
  ...BUDGET_REQUESTS,
  ...GATE_REQUESTS,
  ...PROJECT_REQUESTS
];

export const REVIEW_KIND_BY_INTENT: Readonly<Record<string, ReviewKind>> = {
  ReviewProjectRequest: 'project',
  ReviewProjectBudget: 'budget',
  ReviewResourceAssignment: 'resource',
  ReviewStageGate: 'gate'
};
