import type { CopilotComponentContext } from '@microsoft/sp-copilot-component';
import { SPFx, spfi } from '@pnp/sp';
import { Web } from '@pnp/sp/webs';
import '@pnp/sp/webs';

import { resolveNegotiationLabTargetSiteUrl } from './negotiationLabTargetSite';
import { NegotiationRepository } from './NegotiationRepository';

export async function createNegotiationRepository(
  context: CopilotComponentContext,
  configuredPath?: string
): Promise<NegotiationRepository> {
  const targetSiteUrl = resolveNegotiationLabTargetSiteUrl(context, configuredPath);
  const ambientSp = spfi().using(SPFx(context));
  return NegotiationRepository.create(Web([ambientSp.web, targetSiteUrl]));
}
