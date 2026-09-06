import { AadHttpClient } from '@microsoft/sp-http';
import type { CopilotComponentContext } from '@microsoft/sp-copilot-component';

// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface ICopilotAgent {
  /** Dataverse bot GUID */
  cdsBotId: string;
  name: string;
  owner: string;
  ownerId: string;
  schemaName: string;
  configuration?: string;
  authenticationTrigger?: number;
  stateCode?: number;
  statusCode?: number;
  createdOn?: string;
  botModifiedOn?: string;
  botModifiedBy: string;
  solutionId?: string;
  isManaged?: boolean;
  versionNumber?: number;
  timezoneRuleVersionNumber?: number;
  applicationManifestInformation?: string;
  authenticationMode: number;
  componentIdUnique?: string;
  componentState?: number;
  overwriteTime?: string;
  publishedOn?: string;
  synchronizationStatus?: string;
  accessControlPolicy?: number;
  iconBase64?: string;
  /** Source Dataverse environment URL this agent was retrieved from */
  environmentUrl: string;
  /** Power Platform environment ID (GUID or name) */
  environmentId: string;
}

// Internal shape returned by the Dataverse FetchXML OData response.
// Property names match the FetchXML `alias` values so dot-notation is safe.
interface IDataverseBotValue {
  cdsBotId?: string;
  name?: string;
  owner?: string;
  ownerId?: string;
  schemaName?: string;
  configuration?: string;
  authenticationTrigger?: number;
  stateCode?: number;
  createdOn?: string;
  botModifiedOn?: string;
  botModifiedBy?: string;
  solutionId?: string;
  isManaged?: boolean;
  versionNumber?: number;
  timezoneRuleVersionNumber?: number;
  statusCode?: number;
  applicationManifestInformation?: string;
  authenticationMode?: number;
  componentIdUnique?: string;
  componentState?: number;
  overwriteTime?: string;
  publishedOn?: string;
  synchronizationStatus?: string;
  accessControlPolicy?: number;
  iconBase64?: string;
}

interface IDataverseBotsResponse {
  value?: IDataverseBotValue[];
}

interface IPowerAppsEnvironment {
  name?: string;
  properties?: {
    linkedEnvironmentMetadata?: {
      instanceUrl?: string;
    };
    runtimeEndpoints?: {
      microsoftDataverse?: string;
    };
  };
}

interface IPowerAppsEnvironmentsResponse {
  value?: IPowerAppsEnvironment[];
}

interface IDataverseEnvironment {
  url: string;
  id: string;
}

// ─── Service ─────────────────────────────────────────────────────────────────

/**
 * Retrieves the Copilot Agents (Dataverse bots) the current user can access
 * across every Power Platform environment visible to them. Runs entirely
 * through brokered AAD calls made available on the Copilot Component context,
 * mirroring how `aadHttpClientFactory` is used from a `WebPartContext`.
 */
export default class AgentsExplorerService {
  private _context: CopilotComponentContext;

  constructor(context: CopilotComponentContext) {
    this._context = context;
  }

  /**
   * Returns all Copilot Agents (bots) the current user has access to,
   * across all Power Platform environments visible to them.
   */
  public async getCopilotAgents(): Promise<ICopilotAgent[]> {
    const environments = await this._getDataverseEnvironments();
    if (environments.length === 0) {
      return [];
    }

    const results = await Promise.all(
      environments.map(async (env) => {
        try {
          return await this._getBotsFromEnvironment(env.url, env.id);
        } catch (error) {
          console.warn(`Failed to retrieve Copilot agents from ${env.url}`, error);
          return [] as ICopilotAgent[];
        }
      })
    );

    return results.reduce((acc: ICopilotAgent[], current) => acc.concat(current), []);
  }

  // ─── Private helpers ───────────────────────────────────────────────────────

  /** Discovers every Dataverse environment (URL + environment id) the user can reach. */
  private async _getDataverseEnvironments(): Promise<IDataverseEnvironment[]> {
    const client = await this._context.aadHttpClientFactory.getClient('https://service.powerapps.com/');

    const response = await client.get(
      'https://api.powerapps.com/providers/Microsoft.PowerApps/environments?api-version=2016-11-01',
      AadHttpClient.configurations.v1
    );

    if (!response.ok) {
      console.warn(`Power Platform environments request failed with status ${response.status}`);
      return [];
    }

    const data = (await response.json()) as IPowerAppsEnvironmentsResponse;

    return (data.value ?? [])
      .map((env) => {
        const url = this._normalizeUrl(
          env.properties?.linkedEnvironmentMetadata?.instanceUrl ?? env.properties?.runtimeEndpoints?.microsoftDataverse
        );
        const id = env.name;
        return url && id ? { url, id } : undefined;
      })
      .filter((env): env is IDataverseEnvironment => !!env);
  }

  /**
   * Queries the Dataverse `bots` entity in a single environment using FetchXML
   * and returns the agents the current user has access to.
   */
  private async _getBotsFromEnvironment(dataverseUrl: string, environmentId: string): Promise<ICopilotAgent[]> {
    const resource = new URL(dataverseUrl).origin;
    const client = await this._context.aadHttpClientFactory.getClient(resource);

    const fetchXml = `
      <fetch mapping='logical' version='1.0'>
        <entity name='bot'>
            <attribute name='accesscontrolpolicy' alias='accessControlPolicy' />
            <attribute name='applicationmanifestinformation' alias='applicationManifestInformation' />
            <attribute name='authenticationmode' alias='authenticationMode' />
            <attribute name='authenticationtrigger' alias='authenticationTrigger' />
            <attribute name='componentidunique' alias='componentIdUnique' />
            <attribute name='componentstate' alias='componentState' />
            <attribute name='configuration' alias='configuration' />
            <attribute name='createdon' alias='createdOn' />
            <attribute name='ismanaged' alias='isManaged' />
            <attribute name='modifiedon' alias='botModifiedOn' />
            <attribute name='overwritetime' alias='overwriteTime' />
            <attribute name='iconbase64' alias='iconBase64' />
            <attribute name='publishedon' alias='publishedOn' />
            <attribute name='schemaname' alias='schemaName' />
            <attribute name='solutionid' alias='solutionId' />
            <attribute name='statecode' alias='stateCode' />
            <attribute name='statuscode' alias='statusCode' />
            <attribute name='timezoneruleversionnumber' alias='timezoneRuleVersionNumber' />
            <attribute name='versionnumber' alias='versionNumber' />
            <attribute name='name' alias='name' />
            <attribute name='botid' alias='cdsBotId' />
            <attribute name='ownerid' alias='ownerId' />
            <attribute name='synchronizationstatus' alias='synchronizationStatus' />
            <link-entity name='systemuser' to='ownerid' from='systemuserid' link-type='inner'>
                <attribute name='fullname' alias='owner' />
            </link-entity>
            <link-entity name='systemuser' to='modifiedby' from='systemuserid' link-type='inner'>
                <attribute name='fullname' alias='botModifiedBy' />
            </link-entity>
        </entity>
    </fetch>`;

    const encodedFetchXml = encodeURIComponent(fetchXml);
    const requestUrl = `${dataverseUrl}/api/data/v9.1/bots?fetchXml=${encodedFetchXml}`;

    const response = await client.get(requestUrl, AadHttpClient.configurations.v1);

    if (!response.ok) {
      throw new Error(`Dataverse bots request failed with status ${response.status} for ${dataverseUrl}`);
    }

    const data = (await response.json()) as IDataverseBotsResponse;

    return (data.value ?? []).map((bot) => this._mapBot(bot, dataverseUrl, environmentId));
  }

  /** Maps a raw Dataverse bot record (FetchXML aliases) to `ICopilotAgent`. */
  private _mapBot(bot: IDataverseBotValue, environmentUrl: string, environmentId: string): ICopilotAgent {
    return {
      cdsBotId: bot.cdsBotId ?? '',
      name: bot.name ?? '',
      owner: bot.owner ?? '',
      ownerId: bot.ownerId ?? '',
      schemaName: bot.schemaName ?? '',
      configuration: bot.configuration,
      authenticationTrigger: bot.authenticationTrigger,
      stateCode: bot.stateCode,
      statusCode: bot.statusCode,
      createdOn: bot.createdOn,
      botModifiedOn: bot.botModifiedOn,
      botModifiedBy: bot.botModifiedBy ?? '',
      solutionId: bot.solutionId,
      isManaged: bot.isManaged,
      versionNumber: bot.versionNumber,
      timezoneRuleVersionNumber: bot.timezoneRuleVersionNumber,
      applicationManifestInformation: bot.applicationManifestInformation,
      authenticationMode: bot.authenticationMode ?? 0,
      componentIdUnique: bot.componentIdUnique,
      componentState: bot.componentState,
      overwriteTime: bot.overwriteTime,
      publishedOn: bot.publishedOn,
      synchronizationStatus: bot.synchronizationStatus,
      accessControlPolicy: bot.accessControlPolicy,
      iconBase64: bot.iconBase64,
      environmentUrl,
      environmentId,
    };
  }

  /** Trims and strips trailing slash from a URL. Returns undefined for blanks. */
  private _normalizeUrl(url?: string): string | undefined {
    if (!url) return undefined;
    const trimmed = url.trim();
    if (!trimmed) return undefined;
    return trimmed.endsWith('/') ? trimmed.slice(0, -1) : trimmed;
  }
}
