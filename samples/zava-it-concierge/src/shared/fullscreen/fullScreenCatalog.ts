import { INTENT_CATALOG } from '../intents/intentCatalog';
import type { IIntentDefinition, IntentName } from '../intents/intentCatalog';

export type FullScreenLens = 'personal' | 'team' | 'portfolio';

export interface IFullScreenMetric {
  readonly label: string;
  readonly value: string;
  readonly detail: string;
  readonly tone: 'positive' | 'attention' | 'neutral';
}

export interface IFullScreenLensDefinition {
  readonly id: FullScreenLens;
  readonly label: string;
  readonly title: string;
  readonly outcome: string;
  readonly businessQuestion: string;
  readonly defaultIntent: IntentName;
  readonly metrics: readonly IFullScreenMetric[];
}

export const FULL_SCREEN_LENSES: Readonly<Record<FullScreenLens, IFullScreenLensDefinition>> = {
  personal: {
    id: 'personal',
    label: 'Personal',
    title: 'My IT workspace',
    outcome: 'Keep work moving by connecting device health, support, requests, knowledge, and next-device choices.',
    businessQuestion: 'What needs attention before it interrupts Megan\'s next customer workshop?',
    defaultIntent: 'MyDeviceStatus',
    metrics: [
      { label: 'Device health', value: '76%', detail: 'Battery is the only constrained dimension', tone: 'attention' },
      { label: 'Open work', value: '3', detail: 'One request needs manager review', tone: 'neutral' },
      { label: 'Next milestone', value: '2 days', detail: 'USB4 Dock expected Aug 24', tone: 'positive' }
    ]
  },
  team: {
    id: 'team',
    label: 'Team',
    title: 'Team operations',
    outcome: 'Help Diego make fast, defensible people and spend decisions without losing policy or delivery context.',
    businessQuestion: 'Which decision removes the most team friction while protecting budget and policy?',
    defaultIntent: 'GetApprovalQueue',
    metrics: [
      { label: 'Awaiting review', value: '7', detail: 'Two exceed the review target', tone: 'attention' },
      { label: 'Budget available', value: '$36.4K', detail: '29% remains after commitments', tone: 'positive' },
      { label: 'Refresh risk', value: '18%', detail: 'Three Product devices need planning', tone: 'neutral' }
    ]
  },
  portfolio: {
    id: 'portfolio',
    label: 'IT portfolio',
    title: 'IT portfolio command center',
    outcome: 'Give Lee one operating picture for estate health, service risk, spend, licenses, and refresh capacity.',
    businessQuestion: 'Where should IT intervene now to protect service continuity and investment value?',
    defaultIntent: 'GetFleetHealth',
    metrics: [
      { label: 'Fleet health', value: '77%', detail: 'Europe Engineering is the risk pocket', tone: 'attention' },
      { label: 'Services healthy', value: '3 / 5', detail: 'Teams and Intune are degraded', tone: 'attention' },
      { label: 'Forecast remaining', value: '$128K', detail: 'Positive after planned refresh waves', tone: 'positive' }
    ]
  }
};

export function resolveFullScreenLens(intent: IIntentDefinition): FullScreenLens {
  if (intent.lens === 'team') return 'team';
  if (intent.lens === 'company' || intent.name === 'GenerateItBrief') return 'portfolio';
  return 'personal';
}

export function getFullScreenLensIntents(lens: FullScreenLens): readonly IIntentDefinition[] {
  return INTENT_CATALOG.filter((intent) => resolveFullScreenLens(intent) === lens);
}

export function getDefaultFullScreenIntent(lens: FullScreenLens): IIntentDefinition {
  const name = FULL_SCREEN_LENSES[lens].defaultIntent;
  return INTENT_CATALOG.find((intent) => intent.name === name) as IIntentDefinition;
}