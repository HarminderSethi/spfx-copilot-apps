import { validateOffer } from '../domain/negotiation';
import { NEGOTIATION_SCENARIOS } from '../domain/scenarioCatalog';
import type {
  INegotiationScenario,
  NegotiationScenarioTerms
} from '../domain/types';
import { NegotiationDataError } from './errors';

export interface INegotiationScenarioRow {
  Id?: number;
  Title: string;
  ScenarioKey: string;
  Briefing: string;
  TermsJson: string;
  Enabled: boolean;
}

export const SCENARIO_SELECT_FIELDS = [
  'Id',
  'Title',
  'ScenarioKey',
  'Briefing',
  'TermsJson',
  'Enabled'
] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function scenarioToListValues(
  scenario: INegotiationScenario
): INegotiationScenarioRow {
  const terms: NegotiationScenarioTerms = {
    objective: scenario.objective,
    playerRole: scenario.playerRole,
    counterpartRole: scenario.counterpartRole,
    counterpartBrief: scenario.counterpartBrief,
    issues: scenario.issues,
    playerOpening: scenario.playerOpening,
    counterpartOpening: scenario.counterpartOpening
  };
  return {
    Title: scenario.title,
    ScenarioKey: scenario.key,
    Briefing: scenario.briefing,
    TermsJson: JSON.stringify(terms),
    Enabled: true
  };
}

export function scenarioFromListRow(
  row: INegotiationScenarioRow
): INegotiationScenario {
  let parsed: unknown;
  try {
    parsed = JSON.parse(row.TermsJson) as unknown;
  } catch {
    throw new NegotiationDataError(
      `Scenario ${row.ScenarioKey} has invalid TermsJson.`
    );
  }
  if (
    !isRecord(parsed) ||
    typeof parsed.objective !== 'string' ||
    typeof parsed.playerRole !== 'string' ||
    typeof parsed.counterpartRole !== 'string' ||
    typeof parsed.counterpartBrief !== 'string' ||
    !Array.isArray(parsed.issues) ||
    !isRecord(parsed.playerOpening) ||
    !isRecord(parsed.counterpartOpening)
  ) {
    throw new NegotiationDataError(
      `Scenario ${row.ScenarioKey} has an incomplete TermsJson value.`
    );
  }
  const scenario = {
    key: row.ScenarioKey,
    title: row.Title,
    briefing: row.Briefing,
    objective: parsed.objective,
    playerRole: parsed.playerRole,
    counterpartRole: parsed.counterpartRole,
    counterpartBrief: parsed.counterpartBrief,
    issues: parsed.issues,
    playerOpening: parsed.playerOpening,
    counterpartOpening: parsed.counterpartOpening
  } as INegotiationScenario;
  try {
    validateOffer(scenario, scenario.playerOpening);
    validateOffer(scenario, scenario.counterpartOpening);
  } catch (error) {
    throw new NegotiationDataError(
      `Scenario ${row.ScenarioKey} is invalid: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
  // Existing lists gain the packaged help text without a write or reprovisioning.
  const packaged = NEGOTIATION_SCENARIOS.find(({ key }) => key === scenario.key);
  return {
    ...scenario,
    issues: scenario.issues.map((issue) => ({
      ...issue,
      description: issue.description ?? packaged?.issues.find(({ key }) => key === issue.key)?.description
    }))
  };
}
