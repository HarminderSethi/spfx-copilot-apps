import type { IMockHrSignalSeed, IMockSignalDefinition } from '../models/seeds';

const definitions: ReadonlyArray<IMockSignalDefinition> = [
  {
    id: 'signal-learning-privacy', family: 'learning', title: 'Finish privacy foundations',
    summary: 'One 24-minute module remains in your required privacy learning.', status: 'Due Friday',
    priority: 'critical', privacyLevel: 'standard', dueOffsetMin: 3 * 24 * 60,
    destination: { family: 'learning', route: 'learning/required', params: { courseId: 'privacy-foundations' } },
    relatedPersonIds: ['megan-bowen'], imageKey: 'learningFocus', groundingIds: ['ground-learning']
  },
  {
    id: 'signal-leave-conflict', family: 'time', title: 'Review your vacation conflict',
    summary: 'Your August 4-12 draft overlaps one customer review; team coverage remains healthy.',
    status: 'Needs review', priority: 'high', privacyLevel: 'private', dueOffsetMin: 24 * 60,
    destination: { family: 'time', route: 'time/request', params: { requestId: 'leave-draft-family-trip' } },
    relatedPersonIds: ['megan-bowen', 'lee-gu'], groundingIds: ['ground-leave', 'ground-calendar']
  },
  {
    id: 'signal-benefits-enrollment', family: 'benefits', title: 'Confirm dependent coverage',
    summary: 'Open enrollment closes in 23 days and your current family coverage remains active.',
    status: 'On track', priority: 'normal', privacyLevel: 'private', dueOffsetMin: 23 * 24 * 60,
    destination: { family: 'benefits', route: 'benefits/compare', params: { coverageTier: 'family' } },
    relatedPersonIds: ['megan-bowen', 'nestor-wilke'], groundingIds: ['ground-benefits']
  },
  {
    id: 'signal-payroll-adjustment', family: 'money', title: 'Understand your latest pay adjustment',
    summary: 'Your latest statement includes a one-time recognition adjustment.', status: 'Available',
    priority: 'normal', privacyLevel: 'sensitive',
    destination: { family: 'money', route: 'money/explain-change', params: { period: 'latest', includeDeductions: true } },
    relatedPersonIds: ['megan-bowen'], groundingIds: ['ground-payroll']
  },
  {
    id: 'signal-case-response', family: 'support', title: 'Reply to your HR case',
    summary: 'Case HR-1042 is waiting for one clarification about the payroll adjustment.',
    status: 'Waiting for you', priority: 'high', privacyLevel: 'sensitive', dueOffsetMin: 6 * 60,
    destination: { family: 'support', route: 'support/create', params: { category: 'payroll', caseId: 'HR-1042' } },
    relatedPersonIds: ['megan-bowen', 'patti-fernandez'], groundingIds: ['ground-case']
  },
  {
    id: 'signal-equity-vest', family: 'rewards', title: 'Upcoming equity vest',
    summary: '42 Zava units are scheduled to vest later this month.', status: 'Upcoming',
    priority: 'normal', privacyLevel: 'sensitive', dueOffsetMin: 17 * 24 * 60,
    destination: { family: 'rewards', route: 'rewards/summary', params: { includeEquity: true } },
    relatedPersonIds: ['megan-bowen'], groundingIds: ['ground-rewards']
  },
  {
    id: 'signal-approval-leave', family: 'team', title: 'Review a priority leave approval',
    summary: 'One leave request affects support coverage next week.', status: 'Due today',
    priority: 'high', privacyLevel: 'private', dueOffsetMin: 3 * 60,
    destination: { family: 'team', route: 'team/approvals', params: { approvalId: 'approval-leave-204' } },
    relatedPersonIds: ['megan-bowen', 'lee-gu'], groundingIds: ['ground-team']
  },
  {
    id: 'signal-approval-learning', family: 'team', title: 'Review a learning-plan approval',
    summary: 'A role-development plan is ready for your review.', status: 'Due tomorrow',
    priority: 'normal', privacyLevel: 'private', dueOffsetMin: 24 * 60,
    destination: { family: 'team', route: 'team/approvals', params: { approvalId: 'approval-learning-117' } },
    relatedPersonIds: ['megan-bowen', 'lee-gu'], groundingIds: ['ground-team']
  },
  {
    id: 'signal-policy-change', family: 'policy', title: 'Flexible work policy updated',
    summary: 'The travel-work clause now includes clearer manager approval guidance.',
    status: 'Updated', priority: 'optional', privacyLevel: 'standard',
    destination: { family: 'policy', route: 'policy/answer', params: { question: 'What changed in the flexible work policy?' } },
    relatedPersonIds: ['megan-bowen', 'pradeep-gupta'], groundingIds: ['ground-policy']
  },
  {
    id: 'signal-expert-match', family: 'people', title: 'Three experts match your keynote work',
    summary: 'Accessibility, benefits, and mobility experts are connected to your current projects.',
    status: '3 matches', priority: 'optional', privacyLevel: 'standard',
    destination: { family: 'people', route: 'people/expert', params: { expertise: 'customer keynote' } },
    relatedPersonIds: ['johanna-lorenz', 'nestor-wilke', 'pradeep-gupta'], groundingIds: ['ground-people']
  }
];

export const mockHrSignals: ReadonlyArray<IMockHrSignalSeed> = definitions.map((definition) => ({
  id: definition.id,
  content: { type: 'text', value: definition.summary },
  properties: {
    family: definition.family,
    title: definition.title,
    status: definition.status,
    priority: definition.priority,
    privacyLevel: definition.privacyLevel,
    dueOffsetMin: definition.dueOffsetMin,
    route: definition.destination.route,
    routeParams: definition.destination.params,
    relatedPersonIds: definition.relatedPersonIds,
    imageKey: definition.imageKey,
    groundingIds: definition.groundingIds
  }
}));