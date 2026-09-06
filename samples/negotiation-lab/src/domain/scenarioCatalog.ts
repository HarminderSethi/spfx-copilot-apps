import type { INegotiationScenario } from './types';

export const SAAS_RENEWAL_SCENARIO: INegotiationScenario = {
  key: 'saas-renewal',
  title: 'SaaS renewal',
  briefing:
    'You are renewing a fictional software subscription. Explore a balanced package across annual price, commitment length and monthly support.',
  objective:
    'Trade a longer commitment for a lower annual fee or more included support.',
  playerRole: 'Buyer responsible for the renewal',
  counterpartRole: 'Vendor account executive',
  counterpartBrief:
    'Priorities: predictable revenue. Trade preference: price or support in exchange for a longer commitment. Concessions: reciprocal.',
  issues: [
    {
      key: 'annualFeeChf',
      label: 'Annual fee',
      description: 'The subscription price you pay each year.',
      kind: 'number',
      minimum: 90000,
      maximum: 120000,
      step: 3000,
      format: 'currency',
      currency: 'CHF'
    },
    {
      key: 'contractMonths',
      label: 'Contract term (months)',
      description: 'How long you commit to renewing the subscription.',
      kind: 'number',
      minimum: 12,
      maximum: 36,
      step: 12,
      format: 'number'
    },
    {
      key: 'supportHours',
      label: 'Monthly support (hours)',
      description: 'Support time included each month, at no extra charge.',
      kind: 'number',
      minimum: 8,
      maximum: 24,
      step: 4,
      format: 'number'
    }
  ],
  playerOpening: {
    annualFeeChf: 102000,
    contractMonths: 12,
    supportHours: 16
  },
  counterpartOpening: {
    annualFeeChf: 114000,
    contractMonths: 24,
    supportHours: 12
  }
};

export const JOB_OFFER_SCENARIO: INegotiationScenario = {
  key: 'job-offer',
  title: 'Total job offer',
  briefing:
    'You have received a fictional offer for a senior role. Negotiate the whole package while keeping the relationship constructive.',
  objective:
    'Trade an earlier start for a higher salary or more remote-working days.',
  playerRole: 'Candidate receiving the offer',
  counterpartRole: 'Hiring manager',
  counterpartBrief:
    'Priorities: fill the role soon and protect internal equity. Flexibility: the package mix offers more room than base salary alone.',
  issues: [
    {
      key: 'baseSalaryChf',
      label: 'Base salary',
      description: 'Your annual salary before bonuses.',
      kind: 'number',
      minimum: 120000,
      maximum: 150000,
      step: 5000,
      format: 'currency',
      currency: 'CHF'
    },
    {
      key: 'remoteDays',
      label: 'Remote days per week',
      description: 'How many working days you can work from home each week.',
      kind: 'number',
      minimum: 1,
      maximum: 4,
      step: 1,
      format: 'number'
    },
    {
      key: 'startTiming',
      label: 'Start timing',
      description: 'How soon you would start the new role.',
      kind: 'choice',
      options: [
        { value: 'immediate', label: 'Immediately' },
        { value: 'two-weeks', label: 'In two weeks' },
        { value: 'four-weeks', label: 'In four weeks' }
      ]
    }
  ],
  playerOpening: {
    baseSalaryChf: 140000,
    remoteDays: 3,
    startTiming: 'four-weeks'
  },
  counterpartOpening: {
    baseSalaryChf: 130000,
    remoteDays: 2,
    startTiming: 'two-weeks'
  }
};

export const SERVICE_RECOVERY_SCENARIO: INegotiationScenario = {
  key: 'service-recovery',
  title: 'Service recovery',
  briefing:
    'A fictional service failure affected a key customer. Negotiate a temporary recovery package without changing contractual rights.',
  objective:
    'Trade a faster first response or more management reviews for a smaller goodwill credit.',
  playerRole: 'Account manager leading the recovery',
  counterpartRole: 'Customer operations director',
  counterpartBrief:
    'Priorities: visible accountability, a faster temporary response and meaningful goodwill. Flexibility: a credible balanced temporary package.',
  issues: [
    {
      key: 'creditPercent',
      label: 'Goodwill credit (% of monthly fee)',
      description: 'A one-off credit to the customer, as a percentage of one monthly bill.',
      kind: 'number',
      minimum: 0,
      maximum: 20,
      step: 5,
      format: 'number'
    },
    {
      key: 'responseTarget',
      label: 'Temporary response target',
      description: 'How quickly your team first responds to an incident, not the time to fix it.',
      kind: 'choice',
      options: [
        { value: '30-minutes', label: '30 minutes' },
        { value: '60-minutes', label: '60 minutes' },
        { value: '120-minutes', label: '120 minutes' }
      ]
    },
    {
      key: 'reviewMonths',
      label: 'Monthly executive reviews',
      description: 'One management review each month for this many months; 2 means two meetings.',
      kind: 'number',
      minimum: 1,
      maximum: 6,
      step: 1,
      format: 'number'
    }
  ],
  playerOpening: {
    creditPercent: 5,
    responseTarget: '120-minutes',
    reviewMonths: 2
  },
  counterpartOpening: {
    creditPercent: 15,
    responseTarget: '60-minutes',
    reviewMonths: 4
  }
};

export const NEGOTIATION_SCENARIOS: readonly INegotiationScenario[] = [
  SAAS_RENEWAL_SCENARIO,
  JOB_OFFER_SCENARIO,
  SERVICE_RECOVERY_SCENARIO
];
