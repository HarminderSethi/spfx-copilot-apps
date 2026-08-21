import approvalInboxSchema from '../../approvalInbox/ApprovalInboxCopilotComponentProperties';
import compareBenefitPlansSchema, { normalizeCompareBenefitPlansProperties } from '../../compareBenefitPlans/CompareBenefitPlansCopilotComponentProperties';
import createHrCaseSchema from '../../createHrCase/CreateHrCaseCopilotComponentProperties';
import explainPayChangeSchema from '../../explainPayChange/ExplainPayChangeCopilotComponentProperties';
import exploreOrganizationSchema, { normalizeExploreOrganizationProperties } from '../../exploreOrganization/ExploreOrganizationCopilotComponentProperties';
import findExpertSchema from '../../findExpert/FindExpertCopilotComponentProperties';
import employeeMilestonesSchema from '../../getEmployeeMilestones/GetEmployeeMilestonesCopilotComponentProperties';
import myHrDashboardSchema from '../../getMyHrDashboard/GetMyHrDashboardCopilotComponentProperties';
import nextBestActionsSchema from '../../getNextBestActions/GetNextBestActionsCopilotComponentProperties';
import profileHealthSchema from '../../getProfileHealth/GetProfileHealthCopilotComponentProperties';
import worklifeSnapshotSchema from '../../getWorklifeSnapshot/GetWorklifeSnapshotCopilotComponentProperties';
import latestPaySchema from '../../latestPay/LatestPayCopilotComponentProperties';
import leaveBalanceSchema from '../../leaveBalance/LeaveBalanceCopilotComponentProperties';
import policyAnswerSchema from '../../policyAnswer/PolicyAnswerCopilotComponentProperties';
import policyComparisonSchema from '../../policyComparison/PolicyComparisonCopilotComponentProperties';
import requestTimeOffSchema from '../../requestTimeOff/RequestTimeOffCopilotComponentProperties';
import requiredLearningSchema, { normalizeRequiredLearningProperties } from '../../requiredLearning/RequiredLearningCopilotComponentProperties';
import startLifeEventSchema, { normalizeStartLifeEventProperties } from '../../startLifeEvent/StartLifeEventCopilotComponentProperties';
import teamAbsenceCalendarSchema from '../../teamAbsenceCalendar/TeamAbsenceCalendarCopilotComponentProperties';
import totalRewardsSchema, { normalizeTotalRewardsSummaryProperties } from '../../totalRewardsSummary/TotalRewardsSummaryCopilotComponentProperties';

const schemas = [
  approvalInboxSchema,
  compareBenefitPlansSchema,
  createHrCaseSchema,
  explainPayChangeSchema,
  exploreOrganizationSchema,
  findExpertSchema,
  employeeMilestonesSchema,
  myHrDashboardSchema,
  nextBestActionsSchema,
  profileHealthSchema,
  worklifeSnapshotSchema,
  latestPaySchema,
  leaveBalanceSchema,
  policyAnswerSchema,
  policyComparisonSchema,
  requestTimeOffSchema,
  requiredLearningSchema,
  startLifeEventSchema,
  teamAbsenceCalendarSchema,
  totalRewardsSchema
];

describe('Copilot Component property schemas', () => {
  test('omit unsupported constraint keywords from all 20 schemas', () => {
    expect(schemas).toHaveLength(20);
    const serialized = JSON.stringify(schemas);
    expect(serialized).not.toContain('minLength');
    expect(serialized).not.toContain('maxLength');
    expect(serialized).not.toContain('maxItems');
    expect(serialized).not.toContain('minimum');
    expect(serialized).not.toContain('maximum');
  });

  test('preserves numeric bounds in normalization without emitting schema constraints', () => {
    expect(normalizeCompareBenefitPlansProperties({ dependentCount: 99 }).dependentCount).toBe(12);
    expect(normalizeStartLifeEventProperties({ dependentCount: -1 }).dependentCount).toBe(0);
    expect(normalizeRequiredLearningProperties({ dueWithinDays: 999 }).dueWithinDays).toBe(365);
    expect(normalizeTotalRewardsSummaryProperties({ year: 1900 }).year).toBe(2020);
    expect(normalizeExploreOrganizationProperties({ depth: 9 }).depth).toBe(4);
  });
});
