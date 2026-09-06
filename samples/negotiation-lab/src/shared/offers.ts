import type {
  INegotiationScenario,
  NegotiationIssue,
  NegotiationOffer,
  NegotiationValue
} from '../domain/types';
import { validateOffer as validateDomainOffer } from '../domain/negotiation';

export function validateOffer(
  scenario: INegotiationScenario,
  offer: NegotiationOffer
): string[] {
  try {
    validateDomainOffer(scenario, offer);
    return [];
  } catch (error) {
    return [error instanceof Error ? error.message : 'The offer is invalid.'];
  }
}

export function formatValue(
  issue: NegotiationIssue,
  value: NegotiationValue | undefined,
  locale: string
): string {
  if (issue.kind === 'choice') {
    return issue.options.find((option) => option.value === value)?.label ?? '—';
  }
  if (typeof value !== 'number') return '—';
  if (issue.format === 'currency' && issue.currency) {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: issue.currency,
      maximumFractionDigits: 0
    }).format(value);
  }
  return new Intl.NumberFormat(locale).format(value);
}
