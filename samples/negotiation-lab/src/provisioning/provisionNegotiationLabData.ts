import type { CopilotComponentContext } from '@microsoft/sp-copilot-component';
import type { IList } from '@pnp/sp/lists';
import { PermissionKind } from '@pnp/sp/security';
import '@pnp/sp/fields';
import '@pnp/sp/items';
import '@pnp/sp/security/list';
import '@pnp/sp/security/web';

import { NEGOTIATION_LISTS } from '../data/negotiationListIdentity';
import { findNegotiationList } from '../data/negotiationLists';
import { NEGOTIATION_SCENARIOS } from '../domain/scenarioCatalog';
import { createNegotiationLabProvisioningEngine } from './createNegotiationLabProvisioningEngine';
import { enforceNegotiationListSecurity } from './enforceNegotiationListSecurity';
import { seedNegotiationScenarios } from './seedNegotiationScenarios';

export type NegotiationLabTargetStatus =
  | 'ready'
  | 'ready-to-provision'
  | 'permission-required'
  | 'player-permission-required'
  | 'site-unavailable';

export interface INegotiationLabTargetInspection {
  targetSiteUrl: string;
  status: NegotiationLabTargetStatus;
}

export interface INegotiationProvisioningProgress {
  phase: 'schema' | 'security' | 'seed' | 'complete';
  message: string;
}

const REQUIRED_FIELDS = {
  scenarios: ['ScenarioKey', 'Briefing', 'TermsJson', 'Enabled'],
  sessions: ['ScenarioKey', 'Status', 'StateJson']
} as const;

async function isSchemaMissing(
  scenarios: IList,
  sessions: IList
): Promise<boolean> {
  const [scenarioFields, sessionFields] = await Promise.all([
    scenarios.fields.select('InternalName')() as Promise<Array<{ InternalName: string }>>,
    sessions.fields.select('InternalName')() as Promise<Array<{ InternalName: string }>>
  ]);
  const scenarioNames = new Set(scenarioFields.map(({ InternalName }) => InternalName));
  const sessionNames = new Set(sessionFields.map(({ InternalName }) => InternalName));
  const fieldsMissing =
    REQUIRED_FIELDS.scenarios.some((field) => !scenarioNames.has(field)) ||
    REQUIRED_FIELDS.sessions.some((field) => !sessionNames.has(field));
  if (fieldsMissing) {
    return true;
  }

  const [scenarioSettings, sessionSettings, enabledScenarios] = await Promise.all([
    scenarios.select('ReadSecurity', 'WriteSecurity', 'NoCrawl')() as Promise<{
      ReadSecurity: number;
      WriteSecurity: number;
      NoCrawl: boolean;
    }>,
    sessions.select('ReadSecurity', 'WriteSecurity', 'NoCrawl')() as Promise<{
      ReadSecurity: number;
      WriteSecurity: number;
      NoCrawl: boolean;
    }>,
    scenarios.items
      .select('ScenarioKey')
      .filter('Enabled eq 1')
      .top(10)() as Promise<Array<{ ScenarioKey: string }>>
  ]);
  const seededKeys = new Set(enabledScenarios.map(({ ScenarioKey }) => ScenarioKey));
  return (
    scenarioSettings.ReadSecurity !== 1 ||
    scenarioSettings.WriteSecurity !== 4 ||
    !scenarioSettings.NoCrawl ||
    sessionSettings.ReadSecurity !== 2 ||
    sessionSettings.WriteSecurity !== 2 ||
    !sessionSettings.NoCrawl ||
    NEGOTIATION_SCENARIOS.some(({ key }) => !seededKeys.has(key))
  );
}

async function readNegotiationListPermissions(
  scenarios: IList,
  sessions: IList
): Promise<{ canInspect: boolean; canUse: boolean }> {
  try {
    const [viewScenarios, viewSessions, addSessions, editSessions] =
      await Promise.all([
        scenarios.currentUserHasPermissions(PermissionKind.ViewListItems),
        sessions.currentUserHasPermissions(PermissionKind.ViewListItems),
        sessions.currentUserHasPermissions(PermissionKind.AddListItems),
        sessions.currentUserHasPermissions(PermissionKind.EditListItems)
      ]);
    return {
      canInspect: viewScenarios && viewSessions,
      canUse: viewScenarios && viewSessions && addSessions && editSessions
    };
  } catch {
    return { canInspect: false, canUse: false };
  }
}

export async function inspectNegotiationLabTarget(
  context: CopilotComponentContext,
  configuredPath?: string
): Promise<INegotiationLabTargetInspection> {
  const session = createNegotiationLabProvisioningEngine(context, configuredPath);
  const { targetSiteUrl } = session;
  try {
    await session.targetWeb.select('Id')();
  } catch {
    return {
      targetSiteUrl,
      status: 'site-unavailable'
    };
  }
  let canManageLists = false;
  try {
    canManageLists = await session.targetWeb.currentUserHasPermissions(
      PermissionKind.ManageLists
    );
  } catch {
    // The setup action remains unavailable unless SharePoint confirms permission.
  }
  const [scenarios, sessions] = await Promise.all([
    findNegotiationList(session.targetWeb, NEGOTIATION_LISTS.scenarios),
    findNegotiationList(session.targetWeb, NEGOTIATION_LISTS.sessions)
  ]);
  if (!scenarios || !sessions) {
    return {
      targetSiteUrl,
      status: canManageLists ? 'ready-to-provision' : 'permission-required'
    };
  }

  const permissions = await readNegotiationListPermissions(scenarios, sessions);
  if (!permissions.canInspect) {
    return {
      targetSiteUrl,
      status: canManageLists
        ? 'ready-to-provision'
        : 'player-permission-required'
    };
  }

  const missingSchema = await isSchemaMissing(scenarios, sessions);
  const canUseLists = !missingSchema && permissions.canUse;
  return {
    targetSiteUrl,
    status: missingSchema
      ? canManageLists
        ? 'ready-to-provision'
        : 'permission-required'
      : canUseLists
        ? 'ready'
        : 'player-permission-required'
  };
}

export async function provisionNegotiationLabData(
  context: CopilotComponentContext,
  configuredPath?: string,
  onProgress?: (progress: INegotiationProvisioningProgress) => void
): Promise<void> {
  const session = createNegotiationLabProvisioningEngine(context, configuredPath);
  onProgress?.({ phase: 'schema', message: 'Creating or updating two lists…' });
  const snapshot = await session.engine.run();
  if (snapshot.status !== 'completed') {
    throw new Error('APVEE could not complete the Negotiation Lab list plan.');
  }
  onProgress?.({ phase: 'security', message: 'Applying per-player list security…' });
  await enforceNegotiationListSecurity(session.targetWeb);
  onProgress?.({ phase: 'seed', message: 'Adding the three practice scenarios…' });
  await seedNegotiationScenarios(session.targetWeb);
  onProgress?.({ phase: 'complete', message: 'Negotiation Lab lists are ready.' });
}
