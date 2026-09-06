import type { CopilotComponentContext } from '@microsoft/sp-copilot-component';

import { negotiationLabDeploymentConfig } from '../config/negotiationLabDeploymentConfig';

export const DEFAULT_NEGOTIATION_LAB_SITE_PATH =
  negotiationLabDeploymentConfig.targetSiteUrl;

export function resolveNegotiationLabTargetSiteUrlFromAmbient(
  ambientWebUrl: string,
  configuredPath: string = DEFAULT_NEGOTIATION_LAB_SITE_PATH
): string {
  const ambient = new URL(ambientWebUrl);
  const candidate = configuredPath.trim();
  if (!candidate) {
    throw new Error('Negotiation Lab data-site configuration is empty.');
  }
  const target = new URL(candidate, `${ambient.origin}/`);
  if (target.origin !== ambient.origin) {
    throw new Error('Negotiation Lab data site must belong to the current SharePoint tenant.');
  }
  if (target.username || target.password || target.search || target.hash) {
    throw new Error('Negotiation Lab data-site configuration may contain only a site URL or path.');
  }
  return target.href.replace(/\/$/, '');
}

export function resolveNegotiationLabTargetSiteUrl(
  context: CopilotComponentContext,
  configuredPath: string = DEFAULT_NEGOTIATION_LAB_SITE_PATH
): string {
  return resolveNegotiationLabTargetSiteUrlFromAmbient(
    context.pageContext.web.absoluteUrl,
    configuredPath
  );
}
