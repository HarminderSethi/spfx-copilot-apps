import type { ZavaFamilyId } from '../models/families';
import { getFamilyExperiences } from './familyExperienceCatalog';
import type { IFamilyExperienceDefinition } from './familyExperienceCatalog';

export interface IFamilyDashboardDefinition {
  heroState: string;
  metrics: ReadonlyArray<{ label: string; value: string }>;
  priorityLabel: string;
  actionLabel: string;
  panelTitle: string;
}

const dashboardDefinitions: Partial<Record<ZavaFamilyId, IFamilyDashboardDefinition>> = {
  time: { heroState: 'You have 18 vacation days available and no pending requests.', metrics: [{ label: 'Available days', value: '18' }, { label: 'Pending days', value: '0' }, { label: 'Expiring carryover', value: '3' }, { label: 'Calendar conflicts', value: '1' }], priorityLabel: 'Your leave priorities', actionLabel: 'Review my leave plan', panelTitle: 'Your leave plan' },
  money: { heroState: 'Your latest net pay is EUR 5,126, up 2.4% from the previous period.', metrics: [{ label: 'Net pay', value: 'EUR 5,126' }, { label: 'Gross pay', value: 'EUR 7,420' }, { label: 'Deductions', value: 'EUR 2,294' }, { label: 'Change', value: '+2.4%' }], priorityLabel: 'Your pay insights', actionLabel: 'Explain my latest pay', panelTitle: 'Your pay explanation' },
  benefits: { heroState: 'Your coverage is active; open enrollment closes in 23 days.', metrics: [{ label: 'Active plans', value: '3' }, { label: 'Monthly cost', value: 'EUR 248' }, { label: 'Dependents', value: '2' }, { label: 'Enrollment closes', value: '23 days' }], priorityLabel: 'Your benefits priorities', actionLabel: 'Review my coverage', panelTitle: 'Your coverage plan' },
  support: { heroState: 'One case is waiting for your response; average response time is four hours.', metrics: [{ label: 'Answer confidence', value: '88%' }, { label: 'Open cases', value: '1' }, { label: 'Avg. response', value: '4h' }, { label: 'Knowledge deflection', value: '72%' }], priorityLabel: 'Your support priorities', actionLabel: 'Review my support plan', panelTitle: 'Your support plan' },
  learning: { heroState: 'You are 86% complete; one required course is due this week.', metrics: [{ label: 'Compliance', value: '86%' }, { label: 'Time remaining', value: '24 min' }, { label: 'Recommended', value: '3' }, { label: 'Team at risk', value: '1' }], priorityLabel: 'Your learning priorities', actionLabel: 'Build my learning plan', panelTitle: 'Your learning plan' },
  rewards: { heroState: 'Your estimated total rewards value is EUR 184,000 this year.', metrics: [{ label: 'Base pay', value: 'EUR 102K' }, { label: 'Variable pay', value: 'EUR 15K' }, { label: 'Equity this year', value: 'EUR 24K' }, { label: 'Funded benefits', value: 'EUR 43K' }], priorityLabel: 'Your rewards insights', actionLabel: 'Explain my total rewards', panelTitle: 'Your rewards explanation' },
  team: { heroState: 'Three approvals need you; team coverage is healthy this week.', metrics: [{ label: 'Direct reports', value: '9' }, { label: 'Pending approvals', value: '3' }, { label: 'Coverage risks', value: '1' }, { label: 'Learning compliance', value: '89%' }], priorityLabel: 'Your manager priorities', actionLabel: 'Build my team action plan', panelTitle: 'Your team action plan' },
  people: { heroState: 'Five close collaborators and three experts match your current work.', metrics: [{ label: 'Close collaborators', value: '5' }, { label: 'Experts matched', value: '3' }, { label: 'Organization changes', value: '2' }, { label: 'Next one-to-one', value: 'Tomorrow' }], priorityLabel: 'Your people priorities', actionLabel: 'Prepare my people plan', panelTitle: 'Your people plan' }
};

const dashboardOnlyExperiences: ReadonlyArray<IFamilyExperienceDefinition> = [
  { key: 'timeOffRequestStatus', family: 'time', route: 'time/status', title: 'Request status', eyebrow: 'Approval timeline', summary: 'Your August vacation request is ready for review and has no unresolved policy checks.', kind: 'requestStatus', metrics: [{ label: 'Status', value: 'Draft' }, { label: 'Approvers', value: '1' }, { label: 'Checks passed', value: '3/3' }] },
  { key: 'vacationUsage', family: 'time', route: 'time/usage', title: 'Vacation usage', eyebrow: 'Year at a glance', summary: 'You have used 9 days and are on track to retain a healthy year-end balance.', kind: 'leaveUsage', metrics: [{ label: 'Used', value: '9 days' }, { label: 'Planned', value: '7 days' }, { label: 'Available', value: '18 days' }] },
  { key: 'teamCoverage', family: 'time', route: 'time/coverage', title: 'Team coverage', eyebrow: 'Conflict check', summary: 'Coverage remains healthy across your proposed dates despite one calendar conflict.', kind: 'coverage', metrics: [{ label: 'Available daily', value: '4+' }, { label: 'Conflicts', value: '1' }, { label: 'Risk', value: 'Low' }] },

  { key: 'explainDeductions', family: 'money', route: 'money/deductions', title: 'Where deductions go', eyebrow: 'Allocation detail', summary: 'Tax, pension, and benefits account for 31% of gross pay this period.', kind: 'deductions', metrics: [{ label: 'Tax', value: 'EUR 1,640' }, { label: 'Pension', value: 'EUR 420' }, { label: 'Benefits', value: 'EUR 234' }] },
  { key: 'payHistory', family: 'money', route: 'money/history', title: 'Pay history', eyebrow: 'Six-period trend', summary: 'Net pay is stable, with July elevated by a one-time recognition adjustment.', kind: 'payHistory', metrics: [{ label: 'Six-month avg.', value: 'EUR 5,021' }, { label: 'Highest', value: 'EUR 5,126' }, { label: 'Variance', value: '2.4%' }] },
  { key: 'payDocuments', family: 'money', route: 'money/documents', title: 'Pay documents', eyebrow: 'Private records', summary: 'Your latest statements and annual tax document are available in this private surface.', kind: 'payDocuments', metrics: [{ label: 'Statements', value: '12' }, { label: 'Tax documents', value: '1' }, { label: 'Unread', value: '1' }] },

  { key: 'currentBenefits', family: 'benefits', route: 'benefits/current', title: 'Current coverage', eyebrow: 'Active protection', summary: 'Medical, dental, and wellbeing coverage are active for you and two dependents.', kind: 'currentBenefits', metrics: [{ label: 'Active plans', value: '3' }, { label: 'Dependents', value: '2' }, { label: 'Monthly cost', value: 'EUR 248' }] },
  { key: 'dependentCoverage', family: 'benefits', route: 'benefits/dependents', title: 'Dependent coverage', eyebrow: 'Family details', summary: 'Both dependents have medical and dental coverage with no detected gaps.', kind: 'dependents', metrics: [{ label: 'Covered', value: '2' }, { label: 'Coverage gaps', value: '0' }, { label: 'Documents due', value: '1' }] },
  { key: 'enrollmentChecklist', family: 'benefits', route: 'benefits/enrollment', title: 'Enrollment checklist', eyebrow: '23 days remaining', summary: 'Review plan changes, confirm dependents, and submit elections before enrollment closes.', kind: 'enrollment', metrics: [{ label: 'Complete', value: '2/4' }, { label: 'Days left', value: '23' }, { label: 'Blocking items', value: '1' }] },

  { key: 'hrCaseStatus', family: 'support', route: 'support/status', title: 'Case status', eyebrow: 'Awaiting your response', summary: 'Case HR-2048 has a new private message and remains within its response target.', kind: 'caseStatus', metrics: [{ label: 'Status', value: 'Your reply' }, { label: 'Age', value: '1 day' }, { label: 'SLA', value: 'On track' }] },
  { key: 'myHrCases', family: 'support', route: 'support/cases', title: 'My HR cases', eyebrow: 'Private case board', summary: 'One case needs your response and two recently resolved cases remain available.', kind: 'caseBoard', metrics: [{ label: 'Open', value: '1' }, { label: 'Waiting on you', value: '1' }, { label: 'Resolved', value: '2' }] },
  { key: 'quickHrAnswer', family: 'support', route: 'support/quick-answer', title: 'Quick answer first', eyebrow: 'Knowledge before case', summary: 'A grounded payroll explanation may resolve your question without opening a case.', kind: 'quickAnswer', metrics: [{ label: 'Confidence', value: '88%' }, { label: 'Sources', value: '2' }, { label: 'Private handoff', value: 'Ready' }] },
  { key: 'hrDeskHealth', family: 'support', route: 'support/health', title: 'HR desk health', eyebrow: 'Service transparency', summary: 'Most questions receive a first response within four hours and satisfaction is stable.', kind: 'serviceHealth', metrics: [{ label: 'Avg. response', value: '4h' }, { label: 'Resolved first reply', value: '72%' }, { label: 'Satisfaction', value: '4.7/5' }] },

  { key: 'continueLearning', family: 'learning', route: 'learning/continue', title: 'Continue learning', eyebrow: 'Resume where you stopped', summary: 'Privacy foundations has 24 minutes remaining and resumes at the next module.', kind: 'continueLearning', metrics: [{ label: 'Progress', value: '64%' }, { label: 'Remaining', value: '24 min' }, { label: 'Due', value: 'Friday' }] },
  { key: 'learningProgress', family: 'learning', route: 'learning/progress', title: 'Learning progress', eyebrow: 'Your development', summary: 'You completed five courses this quarter and advanced two role-path skills.', kind: 'learningProgress', metrics: [{ label: 'Completed', value: '5' }, { label: 'Hours learned', value: '8.5' }, { label: 'Skills advanced', value: '2' }] },
  { key: 'learningRecommendations', family: 'learning', route: 'learning/recommendations', title: 'Recommended for you', eyebrow: 'Role-path evidence', summary: 'Three courses support your inclusive product leadership growth goal.', kind: 'recommendations', metrics: [{ label: 'Recommendations', value: '3' }, { label: 'Best fit', value: '94%' }, { label: 'Total time', value: '3h 20m' }] },
  { key: 'teamLearningStatus', family: 'learning', route: 'learning/team-status', title: 'Team learning status', eyebrow: 'Manager compliance', summary: 'Eight of nine team members are compliant; one course becomes overdue Friday.', kind: 'teamLearning', metrics: [{ label: 'Compliant', value: '8/9' }, { label: 'Due soon', value: '1' }, { label: 'Overdue', value: '0' }] },

  { key: 'compensationHistory', family: 'rewards', route: 'rewards/history', title: 'Compensation history', eyebrow: 'Three-year progression', summary: 'Base and variable compensation have grown consistently across the last three review cycles.', kind: 'compensationHistory', metrics: [{ label: '2024', value: 'EUR 146K' }, { label: '2025', value: 'EUR 158K' }, { label: '2026', value: 'EUR 184K' }] },
  { key: 'explainRewardsChange', family: 'rewards', route: 'rewards/explain-change', title: 'What changed', eyebrow: 'Year-over-year drivers', summary: 'A new equity grant and higher employer pension contribution drive most of this year’s increase.', kind: 'rewardsChange', metrics: [{ label: 'Total increase', value: '+EUR 26K' }, { label: 'Equity', value: '+EUR 18K' }, { label: 'Pension', value: '+EUR 5K' }] },
  { key: 'equityVesting', family: 'rewards', route: 'rewards/equity', title: 'Equity vesting', eyebrow: 'Upcoming value', summary: 'Your next vest is expected in October, with three additional events in the next 18 months.', kind: 'equityVesting', metrics: [{ label: 'Next vest', value: 'EUR 8K' }, { label: 'This year', value: 'EUR 24K' }, { label: 'Events', value: '4' }] },
  { key: 'pensionBenefitsValue', family: 'rewards', route: 'rewards/pension', title: 'Pension and benefits value', eyebrow: 'Employer-funded value', summary: 'Pension, medical, wellbeing, and insurance add an estimated EUR 43,000 this year.', kind: 'pensionValue', metrics: [{ label: 'Pension', value: 'EUR 25K' }, { label: 'Benefits', value: 'EUR 18K' }, { label: 'Employer funded', value: '100%' }] },

  { key: 'managerTeamHub', family: 'team', route: 'team/hub', title: 'Team roster', eyebrow: 'Nine direct reports', summary: 'Your team is fully staffed, with one new starter and two upcoming check-ins.', kind: 'teamHub', metrics: [{ label: 'Direct reports', value: '9' }, { label: 'New starters', value: '1' }, { label: 'Check-ins due', value: '2' }] },
  { key: 'teamRiskSignals', family: 'team', route: 'team/risks', title: 'Team signals', eyebrow: 'Explainable attention', summary: 'One coverage overlap and one learning deadline need attention; no wellbeing traits are inferred.', kind: 'teamSignals', metrics: [{ label: 'Coverage', value: '1 risk' }, { label: 'Learning', value: '1 due' }, { label: 'Check-ins', value: '2 due' }] },
  { key: 'startManagerCheckIn', family: 'team', route: 'team/check-in', title: 'Check-in preparation', eyebrow: 'Review before scheduling', summary: 'Prepare a focused one-to-one with progress, support, and development topics.', kind: 'checkIn', metrics: [{ label: 'Employee', value: 'Lee Gu' }, { label: 'Topics', value: '3' }, { label: 'Duration', value: '30 min' }] },

  { key: 'peopleNetwork', family: 'people', route: 'people/network', title: 'Your people network', eyebrow: 'Relationship context', summary: 'Your closest working network connects customer programs, inclusive design, and People Operations.', kind: 'network', metrics: [{ label: 'Close collaborators', value: '4' }, { label: 'Extended network', value: '18' }, { label: 'Teams connected', value: '5' }] },
  { key: 'prepareForMeeting', family: 'people', route: 'people/meeting', title: 'Meeting preparation', eyebrow: 'Upcoming one-to-one', summary: 'Your career growth one-to-one with Diego is the next important people moment.', kind: 'meeting', metrics: [{ label: 'When', value: 'Tomorrow' }, { label: 'Duration', value: '30 min' }, { label: 'Open topics', value: '3' }] },
  { key: 'organizationSignals', family: 'people', route: 'people/signals', title: 'Organization signals', eyebrow: 'Changes with context', summary: 'One adjacent team is growing and a new accessibility leadership role is opening.', kind: 'orgSignals', metrics: [{ label: 'Team changes', value: '2' }, { label: 'Open roles', value: '3' }, { label: 'Effective soon', value: '1' }] }
];

const dashboardOrder: Readonly<Record<string, ReadonlyArray<string>>> = {
  time: ['leaveBalance', 'vacationUsage', 'requestTimeOff', 'timeOffRequestStatus', 'teamCoverage'],
  money: ['latestPay', 'explainPayChange', 'explainDeductions', 'payHistory', 'payDocuments'],
  benefits: ['currentBenefits', 'compareBenefitPlans', 'dependentCoverage', 'enrollmentChecklist', 'startLifeEvent'],
  support: ['quickHrAnswer', 'myHrCases', 'hrCaseStatus', 'createHrCase', 'hrDeskHealth'],
  learning: ['requiredLearning', 'continueLearning', 'learningProgress', 'learningRecommendations', 'teamLearningStatus'],
  rewards: ['totalRewardsSummary', 'compensationHistory', 'explainRewardsChange', 'equityVesting', 'pensionBenefitsValue'],
  team: ['managerTeamHub', 'approvalInbox', 'teamAbsenceCalendar', 'teamRiskSignals', 'startManagerCheckIn'],
  people: ['peopleNetwork', 'exploreOrganization', 'findExpert', 'prepareForMeeting', 'organizationSignals']
};

export const getFamilyDashboardExperiences = (family: ZavaFamilyId): IFamilyExperienceDefinition[] => {
  const order = dashboardOrder[family];
  if (!order) {
    return getFamilyExperiences(family);
  }
  const experiences = [...getFamilyExperiences(family), ...dashboardOnlyExperiences.filter((item) => item.family === family)];
  return order.map((key) => experiences.find((item) => item.key === key)).filter((item): item is IFamilyExperienceDefinition => Boolean(item));
};

export const getDashboardOnlyExperience = (key: string): IFamilyExperienceDefinition | undefined =>
  dashboardOnlyExperiences.find((item) => item.key === key);

export const getFamilyDashboardDefinition = (family: ZavaFamilyId): IFamilyDashboardDefinition | undefined =>
  dashboardDefinitions[family];