import type { IWeb } from '@pnp/sp/webs';
import '@pnp/sp/lists';

import { requireNegotiationLists } from '../data/negotiationLists';

/**
 * APVEE enforces the schema and mutable list settings. Its modify-list action
 * does not currently expose item-level read/write security, so this tiny SPFx
 * adapter keeps those two settings idempotent as well.
 */
export async function enforceNegotiationListSecurity(web: IWeb): Promise<void> {
  const lists = await requireNegotiationLists(web);
  await Promise.all([
    lists.scenarios.update({ ReadSecurity: 1, WriteSecurity: 4, NoCrawl: true }),
    lists.sessions.update({ ReadSecurity: 2, WriteSecurity: 2, NoCrawl: true })
  ]);
}
