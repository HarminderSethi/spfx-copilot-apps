import { INTENT_CATALOG } from '../intents/intentCatalog';
import type { IIntentDefinition, IntentName } from '../intents/intentCatalog';

export interface ICapabilityFilters {
  readonly query: string;
  readonly lens: string;
  readonly operation: string;
}

export const CAPABILITY_PAGE_SIZE = 6;
export const FEATURED_CAPABILITY_NAMES: readonly IntentName[] = [
  'RunDeviceDiagnostics',
  'ConfigureDeviceRequest',
  'GetApprovalQueue',
  'GetFleetHealth',
  'CorrelateMajorIncident'
];

export function getCapabilityMatches(filters: ICapabilityFilters): readonly IIntentDefinition[] {
  const normalizedQuery = filters.query.trim().toLowerCase();
  return INTENT_CATALOG.filter((intent) => {
    if (intent.operation === 'education') return false;
    if (filters.lens !== 'all' && intent.lens !== filters.lens) return false;
    if (filters.operation !== 'all' && intent.operation !== filters.operation) return false;
    if (!normalizedQuery) return true;

    return [
      intent.title,
      intent.description,
      intent.education.category,
      intent.education.samplePrompt
    ].some((value) => value.toLowerCase().includes(normalizedQuery));
  });
}

export function getCapabilityPage(
  matches: readonly IIntentDefinition[],
  requestedPage: number
): { readonly page: number; readonly pageCount: number; readonly items: readonly IIntentDefinition[] } {
  const pageCount = Math.max(1, Math.ceil(matches.length / CAPABILITY_PAGE_SIZE));
  const page = Math.min(Math.max(0, requestedPage), pageCount - 1);
  const start = page * CAPABILITY_PAGE_SIZE;
  return { page, pageCount, items: matches.slice(start, start + CAPABILITY_PAGE_SIZE) };
}
