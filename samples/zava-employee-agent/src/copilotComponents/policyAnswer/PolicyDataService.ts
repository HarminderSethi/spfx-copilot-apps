export interface IPolicySource {
  id: string;
  title: string;
  section: string;
  effectiveOn: string;
}

export interface IPolicyComparisonRow {
  label: string;
  finland: string;
  sweden: string;
  emphasis?: 'finland' | 'sweden';
}

export interface IPolicyExperienceData {
  question: string;
  topic: string;
  answer: string;
  applicability: string;
  confidence: number;
  sources: IPolicySource[];
  comparison: IPolicyComparisonRow[];
  changedClause: string;
}

export interface IPolicyDataService {
  getPolicyExperience(question?: string, topic?: string, effectiveOn?: string): IPolicyExperienceData;
}

export class MockPolicyDataService implements IPolicyDataService {
  public getPolicyExperience(
    question = 'What parental leave applies to me?',
    topic = 'Parental leave',
    effectiveOn = '2026-08-01'
  ): IPolicyExperienceData {
    return {
      question,
      topic,
      answer: 'You can combine Zava paid parental leave with statutory leave. Eligibility and paid weeks depend on your employing country and caregiver role.',
      applicability: `Applies to active employees in Finland or Sweden as of ${effectiveOn}.`,
      confidence: 92,
      sources: [
        { id: 'family-leave', title: 'Zava Family Leave Standard', section: 'Sections 3.2-3.6', effectiveOn: '2026-07-01' },
        { id: 'nordic-addendum', title: 'Nordic Leave Addendum', section: 'Finland and Sweden', effectiveOn: '2026-08-01' }
      ],
      comparison: [
        { label: 'Zava paid leave', finland: '16 weeks', sweden: '16 weeks' },
        { label: 'Statutory allowance', finland: '160 weekdays', sweden: '480 shared days', emphasis: 'sweden' },
        { label: 'Notice requested', finland: '2 months', sweden: '2 months' },
        { label: 'Flexible use', finland: 'Up to 4 blocks', sweden: 'Up to 3 periods/year', emphasis: 'finland' }
      ],
      changedClause: 'The Nordic addendum now recognizes partial-day statutory leave in the return-to-work plan.'
    };
  }
}