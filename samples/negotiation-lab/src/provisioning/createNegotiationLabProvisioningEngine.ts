import type { CopilotComponentContext } from '@microsoft/sp-copilot-component';
import { SPFx, spfi } from '@pnp/sp';
import { Web, type IWeb } from '@pnp/sp/webs';
import '@pnp/sp/webs';

import {
  consoleSink,
  createLogger,
  createM365ProvisioningEngine,
  type Logger,
  type M365Clients,
  type M365Scope,
  type ProvisioningEngine,
  type ProvisioningResultLight
} from '@apvee/m365-actionable-provisioning';

import { resolveNegotiationLabTargetSiteUrl } from '../data/negotiationLabTargetSite';
import { negotiationLabProvisioningPlan } from './negotiationLabProvisioningPlan';

export interface INegotiationLabProvisioningSession {
  engine: ProvisioningEngine<M365Scope, ProvisioningResultLight, M365Clients>;
  targetSiteUrl: string;
  targetWeb: IWeb;
}

export function createNegotiationLabProvisioningEngine(
  context: CopilotComponentContext,
  configuredPath?: string,
  logger?: Logger
): INegotiationLabProvisioningSession {
  const targetSiteUrl = resolveNegotiationLabTargetSiteUrl(context, configuredPath);
  const ambientSp = spfi().using(SPFx(context));
  const targetWeb = Web([ambientSp.web, targetSiteUrl]);
  const effectiveLogger =
    logger ?? createLogger({ level: 'info', sink: consoleSink });
  const engine = createM365ProvisioningEngine({
    clients: { spfi: ambientSp },
    initialScope: {
      web: targetWeb,
      siteUrl: targetSiteUrl,
      webUrl: targetSiteUrl
    },
    planTemplate: negotiationLabProvisioningPlan,
    logger: effectiveLogger,
    options: { failFast: true },
    validateEngineContext: ({ initialScope, clients }) => {
      if (!clients.spfi || !initialScope.web) {
        throw new Error('Negotiation Lab provisioning requires an SPFI client and target web.');
      }
    }
  });
  return { engine, targetSiteUrl, targetWeb };
}
