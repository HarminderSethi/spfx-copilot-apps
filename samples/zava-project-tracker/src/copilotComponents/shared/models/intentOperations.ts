import type { IntentOperation } from './projectPortfolio';

export type InlineOperation = IntentOperation;

const reviewIntents = new Set([
  'GetApprovalInbox',
  'ReviewProjectRequest',
  'ReviewProjectBudget',
  'ReviewResourceAssignment',
  'ReviewStageGate'
]);

const submitIntents = new Set([
  'SubmitWeeklyUpdate',
  'SubmitTimesheet',
  'SubmitProjectStatus',
  'SubmitAiUsage',
  'SubmitProjectRequest',
  'RequestAiBudget'
]);

export const getInlineOperation = (intentKey: string): InlineOperation => {
  if (intentKey === 'ExploreAgentCapabilities') {
    return 'education';
  }
  if (reviewIntents.has(intentKey)) {
    return 'review';
  }
  if (submitIntents.has(intentKey)) {
    return 'submit';
  }
  return 'information';
};