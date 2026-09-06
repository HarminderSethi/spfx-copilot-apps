export const NEGOTIATION_LISTS = {
  scenarios: {
    name: 'NegotiationScenarios',
    title: 'Negotiation scenarios'
  },
  sessions: {
    name: 'NegotiationSessions',
    title: 'Negotiation sessions'
  }
} as const;

export type NegotiationListIdentity =
  (typeof NEGOTIATION_LISTS)[keyof typeof NEGOTIATION_LISTS];
