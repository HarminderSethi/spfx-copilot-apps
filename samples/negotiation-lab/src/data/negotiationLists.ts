import type { IList } from '@pnp/sp/lists';
import type { IWeb } from '@pnp/sp/webs';
import '@pnp/sp/lists';

import { NegotiationSchemaMissingError } from './errors';
import {
  NEGOTIATION_LISTS,
  type NegotiationListIdentity
} from './negotiationListIdentity';

function escapeODataText(value: string): string {
  return value.replace(/'/g, "''");
}

export async function findNegotiationList(
  web: IWeb,
  identity: NegotiationListIdentity
): Promise<IList | undefined> {
  const rows = (await web.lists
    .expand('RootFolder')
    .select('Id', 'RootFolder/Name')
    .filter(`RootFolder/Name eq '${escapeODataText(identity.name)}'`)
    .top(1)()) as Array<{ Id: string }>;
  return rows[0]?.Id ? web.lists.getById(rows[0].Id) : undefined;
}

export async function requireNegotiationLists(web: IWeb): Promise<{
  scenarios: IList;
  sessions: IList;
}> {
  const [scenarios, sessions] = await Promise.all([
    findNegotiationList(web, NEGOTIATION_LISTS.scenarios),
    findNegotiationList(web, NEGOTIATION_LISTS.sessions)
  ]);
  if (!scenarios || !sessions) {
    throw new NegotiationSchemaMissingError();
  }
  return { scenarios, sessions };
}
