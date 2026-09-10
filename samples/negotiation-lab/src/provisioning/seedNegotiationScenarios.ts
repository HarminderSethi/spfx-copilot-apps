import type { IList } from '@pnp/sp/lists';
import type { IWeb } from '@pnp/sp/webs';
import '@pnp/sp/items';
import '@pnp/sp/lists';

import { NEGOTIATION_SCENARIOS } from '../domain/scenarioCatalog';
import { NEGOTIATION_LISTS } from '../data/negotiationListIdentity';
import { findNegotiationList } from '../data/negotiationLists';
import {
  SCENARIO_SELECT_FIELDS,
  scenarioToListValues,
  type INegotiationScenarioRow
} from '../data/scenarioListCodec';
import { NegotiationSchemaMissingError } from '../data/errors';

function escapeODataText(value: string): string {
  return value.replace(/'/g, "''");
}

function sameScenarioRow(
  current: INegotiationScenarioRow,
  expected: INegotiationScenarioRow
): boolean {
  return (
    current.Title === expected.Title &&
    current.ScenarioKey === expected.ScenarioKey &&
    current.Briefing === expected.Briefing &&
    current.TermsJson === expected.TermsJson &&
    current.Enabled === expected.Enabled
  );
}

async function findScenarioRow(
  list: IList,
  scenarioKey: string
): Promise<INegotiationScenarioRow | undefined> {
  const rows = (await list.items
    .select(...SCENARIO_SELECT_FIELDS)
    .filter(`ScenarioKey eq '${escapeODataText(scenarioKey)}'`)
    .top(2)()) as INegotiationScenarioRow[];
  if (rows.length > 1) {
    throw new Error(`More than one scenario uses key ${scenarioKey}.`);
  }
  return rows[0];
}

async function upsertScenario(
  list: IList,
  values: INegotiationScenarioRow
): Promise<void> {
  const existing = await findScenarioRow(list, values.ScenarioKey);
  if (existing) {
    if (sameScenarioRow(existing, values)) {
      return;
    }
    if (!existing.Id) {
      throw new Error(`Scenario ${values.ScenarioKey} is missing its item ID.`);
    }
    await list.items.getById(existing.Id).update(values);
    return;
  }
  try {
    await list.items.add(values);
    return;
  } catch (error) {
    const raced = await findScenarioRow(list, values.ScenarioKey);
    if (!raced) {
      throw error;
    }
    if (sameScenarioRow(raced, values)) {
      return;
    }
    if (!raced.Id) {
      throw new Error(`Scenario ${values.ScenarioKey} is missing its item ID.`);
    }
    await list.items.getById(raced.Id).update(values);
    return;
  }
}

export async function seedNegotiationScenarios(
  web: IWeb
): Promise<void> {
  const list = await findNegotiationList(web, NEGOTIATION_LISTS.scenarios);
  if (!list) {
    throw new NegotiationSchemaMissingError();
  }
  for (const scenario of NEGOTIATION_SCENARIOS) {
    await upsertScenario(list, scenarioToListValues(scenario));
  }
}
