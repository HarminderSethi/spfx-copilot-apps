import type { ZavaFamilyId } from '../models/families';

export type FamilyExperienceKind =
  | 'balance' | 'request' | 'requestStatus' | 'leaveUsage' | 'coverage'
  | 'latestPay' | 'payChange' | 'deductions' | 'payHistory' | 'payDocuments'
  | 'currentBenefits' | 'benefitCompare' | 'lifeEvent' | 'dependents' | 'enrollment'
  | 'caseCreate' | 'caseStatus' | 'caseBoard' | 'quickAnswer' | 'serviceHealth'
  | 'learning' | 'continueLearning' | 'learningProgress' | 'recommendations' | 'teamLearning'
  | 'rewards' | 'compensationHistory' | 'rewardsChange' | 'equityVesting' | 'pensionValue'
  | 'teamHub' | 'approvals' | 'teamSignals' | 'absence' | 'checkIn'
  | 'experts' | 'organization' | 'network' | 'meeting' | 'orgSignals';

export interface IFamilyExperienceMetric {
  label: string;
  value: string;
}

export interface IFamilyExperienceDefinition {
  key: string;
  family: ZavaFamilyId;
  route: string;
  title: string;
  eyebrow: string;
  summary: string;
  kind: FamilyExperienceKind;
  metrics: IFamilyExperienceMetric[];
}

const definitions: ReadonlyArray<IFamilyExperienceDefinition> = [
  {
    key: 'leaveBalance', family: 'time', route: 'time/balance', title: 'Your leave balance',
    eyebrow: 'Time available', summary: 'You have 18 vacation days available, with 3 carryover days expiring in December.',
    kind: 'balance', metrics: [{ label: 'Vacation', value: '18 days' }, { label: 'Sick leave', value: '10 days' }, { label: 'Carryover', value: '3 days' }]
  },
  {
    key: 'requestTimeOff', family: 'time', route: 'time/request', title: 'Request time off',
    eyebrow: 'Review before sending', summary: 'Your dates are prefilled from the prompt and checked against working days, holidays, and team coverage.',
    kind: 'request', metrics: [{ label: 'Working days', value: '7' }, { label: 'Balance after', value: '11 days' }, { label: 'Coverage', value: 'Healthy' }]
  },
  {
    key: 'latestPay', family: 'money', route: 'money/latest', title: 'Your latest pay',
    eyebrow: 'July 2026 statement', summary: 'Your latest net pay is EUR 5,126 and includes a one-time recognition adjustment.',
    kind: 'latestPay', metrics: [{ label: 'Gross pay', value: 'EUR 7,420' }, { label: 'Deductions', value: 'EUR 2,294' }, { label: 'Net pay', value: 'EUR 5,126' }]
  },
  {
    key: 'explainPayChange', family: 'money', route: 'money/explain-change', title: 'Why your pay changed',
    eyebrow: 'July compared with June', summary: 'Net pay increased EUR 121. A recognition adjustment outweighed higher withholding.',
    kind: 'payChange', metrics: [{ label: 'Previous net', value: 'EUR 5,005' }, { label: 'Change', value: '+EUR 121' }, { label: 'Current net', value: 'EUR 5,126' }]
  },
  {
    key: 'compareBenefitPlans', family: 'benefits', route: 'benefits/compare', title: 'Compare benefit plans',
    eyebrow: 'Weighted for your family', summary: 'Three plans are ranked for two children, prioritizing a low deductible and dental coverage.',
    kind: 'benefitCompare', metrics: [{ label: 'Best fit', value: 'Zava Plus' }, { label: 'Monthly cost', value: 'EUR 248' }, { label: 'Fit score', value: '91%' }]
  },
  {
    key: 'startLifeEvent', family: 'benefits', route: 'benefits/life-event', title: 'Start a life event',
    eyebrow: 'Review your change', summary: 'Tell us what changed, preview coverage and cost impact, then confirm when you are ready.',
    kind: 'lifeEvent', metrics: [{ label: 'Event', value: 'New child' }, { label: 'Window closes', value: '29 days' }, { label: 'Est. impact', value: '+EUR 42/mo' }]
  },
  {
    key: 'createHrCase', family: 'support', route: 'support/create', title: 'Open a private HR case',
    eyebrow: 'Private by design', summary: 'Review exactly what HR will receive. Sensitive details remain confined to this case workflow.',
    kind: 'caseCreate', metrics: [{ label: 'Privacy', value: 'Private' }, { label: 'Response target', value: '4 hours' }, { label: 'Attachments', value: '0' }]
  },
  {
    key: 'requiredLearning', family: 'learning', route: 'learning/required', title: 'Required learning',
    eyebrow: 'Compliance first', summary: 'One required course is due Friday. Finish the remaining 24 minutes to reach full compliance.',
    kind: 'learning', metrics: [{ label: 'Complete', value: '86%' }, { label: 'Required left', value: '1' }, { label: 'Time remaining', value: '24 min' }]
  },
  {
    key: 'totalRewardsSummary', family: 'rewards', route: 'rewards/summary', title: 'Your total rewards',
    eyebrow: 'Annual employment value', summary: 'Your estimated 2026 total rewards value is EUR 184,000 across pay, bonus, equity, pension, and benefits.',
    kind: 'rewards', metrics: [{ label: 'Annual value', value: 'EUR 184K' }, { label: 'Equity this year', value: 'EUR 24K' }, { label: 'Benefits value', value: 'EUR 18K' }]
  },
  {
    key: 'approvalInbox', family: 'team', route: 'team/approvals', title: 'Approvals waiting',
    eyebrow: 'Manager action queue', summary: 'Three approvals need you. One leave request affects customer-support coverage next week.',
    kind: 'approvals', metrics: [{ label: 'Pending', value: '3' }, { label: 'Due today', value: '1' }, { label: 'Coverage risks', value: '1' }]
  },
  {
    key: 'teamAbsenceCalendar', family: 'team', route: 'team/absence', title: 'Team absence calendar',
    eyebrow: 'Coverage at a glance', summary: 'Coverage is healthy this week. Tuesday has the highest overlap with two people away.',
    kind: 'absence', metrics: [{ label: 'People away', value: '3' }, { label: 'Peak overlap', value: '2' }, { label: 'Coverage', value: 'Healthy' }]
  },
  {
    key: 'findExpert', family: 'people', route: 'people/expert', title: 'Find an expert',
    eyebrow: 'Evidence-ranked matches', summary: 'Three accessibility experts match your customer-keynote work and are connected to your extended team.',
    kind: 'experts', metrics: [{ label: 'Strong matches', value: '3' }, { label: 'Closest path', value: '2 hops' }, { label: 'Available today', value: '2' }]
  },
  {
    key: 'exploreOrganization', family: 'people', route: 'people/organization', title: 'Explore the organization',
    eyebrow: 'Reporting context', summary: 'Explore Zava Customer Experience from your team through adjacent design, engineering, and accessibility groups.',
    kind: 'organization', metrics: [{ label: 'Organization', value: '42 people' }, { label: 'Teams', value: '5' }, { label: 'Open roles', value: '3' }]
  }
];

export const getFamilyExperience = (key: string): IFamilyExperienceDefinition => {
  const definition = definitions.find((item) => item.key === key);
  if (!definition) {
    throw new Error(`Unknown family experience: ${key}`);
  }
  return definition;
};

export const getFamilyExperiences = (family: ZavaFamilyId): IFamilyExperienceDefinition[] =>
  definitions.filter((item) => item.family === family);

export interface IFamilyExperienceDataService {
  getExperience(key: string): IFamilyExperienceDefinition;
  getFamilyExperiences(family: ZavaFamilyId): IFamilyExperienceDefinition[];
}

export class MockFamilyExperienceDataService implements IFamilyExperienceDataService {
  public getExperience(key: string): IFamilyExperienceDefinition {
    return getFamilyExperience(key);
  }

  public getFamilyExperiences(family: ZavaFamilyId): IFamilyExperienceDefinition[] {
    return getFamilyExperiences(family);
  }
}