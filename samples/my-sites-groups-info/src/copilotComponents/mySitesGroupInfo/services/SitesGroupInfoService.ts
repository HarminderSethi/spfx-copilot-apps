import { SPHttpClient } from '@microsoft/sp-http';
import { CopilotComponentContext } from '@microsoft/sp-copilot-component';

export interface IResourceItem {
    id: string;
    title: string;
    description?: string;
    url?: string;
    kind: 'site' | 'group';
    source: 'followed' | 'accessible' | 'group';
}

interface IGraphResponse<T> {
    value?: T[];
    '@odata.nextLink'?: string;
}
interface IGraphSite { id?: string; name?: string; displayName?: string; description?: string; webUrl?: string; }
interface IGraphGroup { id?: string; displayName?: string; description?: string; mail?: string; webUrl?: string; }
export interface IGroupPerson {
    id: string;
    displayName: string;
    email?: string;
}
export interface IGroupMembership {
    owners: IGroupPerson[];
    members: IGroupPerson[];
    canManageMembership: boolean;
}
type ISearchCollection<T> = { results?: T[] } | T[];
interface ISearchCell { Key?: string; Value?: string; }
interface ISearchRow { Cells?: ISearchCollection<ISearchCell>; }
interface ISearchTable { Rows?: ISearchCollection<ISearchRow>; }
interface ISearchResponse {
    PrimaryQueryResult?: {
        RelevantResults?: {
            Table?: ISearchTable;
            TotalRows?: number;
        };
    };
}
interface IGraphRequestBuilder {
    select(properties: string): IGraphRequestBuilder;
    top(count: number): IGraphRequestBuilder;
    header(name: string, value: string): IGraphRequestBuilder;
    count(isCount?: boolean): IGraphRequestBuilder;
    filter(filterExpression: string): IGraphRequestBuilder;
    get(): Promise<unknown>;
}
interface IGraphClient {
    api(path: string): IGraphRequestBuilder;
}

const GRAPH_PAGE_SIZE = 100;
const SHAREPOINT_SEARCH_PAGE_SIZE = 500;

export class SitesGroupInfoService {
    private readonly context: CopilotComponentContext;

    public constructor(context: CopilotComponentContext) {
        this.context = context;
    }

    public async getFollowedSites(top?: number, query?: string): Promise<IResourceItem[]> {
        const requestedTop = normalizeTop(top);
        const resourceQuery = query?.trim();
        if (requestedTop === 0) return [];
        try {
            const client = await this.context.msGraphClientFactory.getClient('3') as unknown as IGraphClient;
            const graphSites = (await this.getGraphPages<IGraphSite>(
                client,
                '/me/followedSites',
                resourceQuery ? undefined : requestedTop,
                (request) => {
                    const configuredRequest = request.select('id,name,displayName,description,webUrl');
                    if (!resourceQuery && requestedTop !== undefined) {
                        configuredRequest.top(Math.min(requestedTop, GRAPH_PAGE_SIZE));
                    }
                    return configuredRequest;
                }
            ))
                .map((site) => ({
                    id: site.id || site.webUrl || site.displayName || site.name || '',
                    title: site.displayName || site.name || site.webUrl || 'Untitled site',
                    description: site.description,
                    url: site.webUrl,
                    kind: 'site' as const,
                    source: 'followed' as const
                }))
                .filter((item) => Boolean(item.id || item.url));

            if (graphSites.length > 0) {
                return this.filterItems(graphSites, resourceQuery, requestedTop);
            }
        } catch {
            // Fall back to SharePoint Social API if Graph call fails or yields no items
        }

        return this.getFollowedSitesFromSharePoint(requestedTop, resourceQuery);
    }

    public async getFollowedSitesFromSharePoint(top?: number, query?: string): Promise<IResourceItem[]> {
        const requestedTop = normalizeTop(top);
        if (requestedTop === 0) return [];
        try {
            const webUrl = this.context.pageContext.web.absoluteUrl.replace(/\/$/, '');
            const url = `${webUrl}/_api/social.following/my/followed(types=4)`;
            const response = await this.context.spHttpClient.get(url, SPHttpClient.configurations.v1, {
                headers: { Accept: 'application/json;odata=nometadata' }
            });
            if (!response.ok) return [];
            const data = (await response.json()) as { value?: Array<Record<string, string>>; SocialActor?: Array<Record<string, string>>; Followed?: { results?: Array<Record<string, string>> } };
            const items: Array<Record<string, string>> = data.value ?? data.SocialActor ?? data.Followed?.results ?? [];
            const followedSites: IResourceItem[] = items.map((item) => ({
                id: item.Uri || item.Id || item.Name || '',
                title: item.Name || item.Title || item.Uri || 'Untitled site',
                description: item.Description,
                url: item.Uri || item.Url,
                kind: 'site' as const,
                source: 'followed' as const
            }));
            return this.filterItems(followedSites, query?.trim(), requestedTop);
        } catch {
            return [];
        }
    }

    public async getFollowedSiteUrls(): Promise<Set<string>> {
        const followedSites = await this.getFollowedSites();
        return new Set(
            followedSites
                .filter((site) => Boolean(site.url))
                .map((site) => this.normalizeUrl(site.url as string))
        );
    }

    public async getSitesHavingAccess(top?: number, resourceQuery?: string): Promise<IResourceItem[]> {
        const requestedTop = normalizeTop(top);
        const normalizedQuery = resourceQuery?.trim();
        if (requestedTop === 0) return [];
        const webUrl = this.context.pageContext.web.absoluteUrl.replace(/\/$/, '');
        const searchQuery = "(contentclass:STS_Site OR contentclass:STS_Web) AND -WebTemplate:SPSPERS*";
        const selectProperties = 'Title,Description,Path,SPWebUrl,SiteID';
        const rows: ISearchRow[] = [];
        let startRow = 0;
        let hasMoreRows = true;
        const shouldLoadAllRows = Boolean(normalizedQuery) || requestedTop === undefined;

        while (hasMoreRows) {
            if (!shouldLoadAllRows && requestedTop !== undefined && rows.length >= requestedTop) break;
            const remainingRows = requestedTop === undefined || shouldLoadAllRows
                ? SHAREPOINT_SEARCH_PAGE_SIZE
            : Math.min(SHAREPOINT_SEARCH_PAGE_SIZE, requestedTop - rows.length);
            const startRowParameter = startRow > 0 ? `&startrow=${startRow}` : '';
            const url = `${webUrl}/_api/search/query?querytext='${encodeURIComponent(searchQuery)}'&rowlimit=${remainingRows}${startRowParameter}&selectproperties='${selectProperties}'`;
            const response = await this.context.spHttpClient.get(url, SPHttpClient.configurations.v1, {
                headers: { Accept: 'application/json;odata=nometadata' }
            });
            if (!response.ok) throw new Error(`Unable to load sites having access (${response.status}).`);
            const data = (await response.json()) as ISearchResponse;
            const table = data.PrimaryQueryResult?.RelevantResults?.Table;
            const pageRows = getSearchCollectionResults(table?.Rows);
            rows.push(...pageRows);
            startRow += pageRows.length;
            const totalRows = data.PrimaryQueryResult?.RelevantResults?.TotalRows;
            hasMoreRows = pageRows.length > 0 && (
                totalRows === undefined ? pageRows.length === remainingRows : startRow < totalRows
            );
        }

        const sites: IResourceItem[] = rows.map((row) => {
            const cellsArray = getSearchCollectionResults(row.Cells);
            const cells = new Map(cellsArray.map((cell) => [cell.Key ?? '', cell.Value ?? '']));
            const siteUrl = cells.get('Path') || cells.get('SPWebUrl') || '';
            return {
                id: siteUrl || cells.get('SiteID') || cells.get('Title') || '',
                title: cells.get('Title') || siteUrl || 'Untitled site',
                description: cells.get('Description') ?? undefined,
                url: siteUrl || undefined,
                kind: 'site',
                source: 'accessible'
            };
        });
        return this.filterItems(sites, normalizedQuery, requestedTop);
    }

    public async getGroupsHavingAccess(top?: number, query?: string): Promise<IResourceItem[]> {
        const requestedTop = normalizeTop(top);
        if (requestedTop === 0) return [];
        const client = await this.context.msGraphClientFactory.getClient('3') as unknown as IGraphClient;
        const resourceQuery = query?.trim();
        const groupPath = '/me/transitiveMemberOf/microsoft.graph.group';
        const loadGroups = (serverFilter?: string, topLimit = requestedTop): Promise<IGraphGroup[]> => this.getGraphPages<IGraphGroup>(
            client,
            groupPath,
            topLimit,
            (request) => {
                const configuredRequest = request.select('id,displayName,description,mail,webUrl');
                configuredRequest.top(GRAPH_PAGE_SIZE);
                if (serverFilter) {
                    configuredRequest
                        .header('ConsistencyLevel', 'eventual')
                        .count(true)
                        .filter(serverFilter);
                }
                return configuredRequest;
            },
            serverFilter ? (request) => request.header('ConsistencyLevel', 'eventual') : undefined
        );

        const isGuidQuery = resourceQuery ? isGuid(resourceQuery) : false;
        const escapedQuery = resourceQuery ? escapeODataString(resourceQuery) : undefined;
        const serverFilter = escapedQuery
            ? isGuidQuery
                ? `id eq '${escapedQuery}'`
                : `startswith(displayName,'${escapedQuery}')`
            : undefined;
        let groups = await loadGroups(serverFilter);

        if (resourceQuery && !isGuidQuery && groups.length === 0) {
            groups = await loadGroups(undefined, undefined);
            const normalizedQuery = resourceQuery.toLowerCase();
            groups = groups.filter((group) => [group.id, group.displayName, group.description, group.mail, group.webUrl]
                .some((value) => value?.toLowerCase().includes(normalizedQuery)));
            if (requestedTop !== undefined) {
                groups = groups.slice(0, requestedTop);
            }
        }

        return groups.map((group) => ({
            id: group.id ?? group.mail ?? group.displayName ?? '',
            title: group.displayName ?? group.mail ?? 'Untitled group',
            description: group.description || group.mail,
            url: group.webUrl,
            kind: 'group',
            source: 'group'
        }));
    }

    public async searchUsers(query: string, top: number = 10): Promise<IGroupPerson[]> {
        const trimmedQuery = query.trim();
        if (!trimmedQuery) return [];
        let escapedQuery = '';
        for (let index = 0; index < trimmedQuery.length; index += 1) {
            const character = trimmedQuery.charAt(index);
            escapedQuery += character === "'" ? "''" : character;
        }
        const client = await this.context.msGraphClientFactory.getClient('3');
        const response = await client.api('/users')
            .header('ConsistencyLevel', 'eventual')
            .filter(`startswith(displayName,'${escapedQuery}') or startswith(mail,'${escapedQuery}') or startswith(userPrincipalName,'${escapedQuery}')`)
            .select('id,displayName,mail,userPrincipalName')
            .top(top)
            .get() as IGraphResponse<Record<string, string>>;
        return this.mapPeople(response.value ?? []);
    }

    public async followSite(siteUrl: string): Promise<void> {
        const client = await this.context.msGraphClientFactory.getClient('3');
        const siteId = await this.resolveSiteId(siteUrl);
        await client.api('/me/followedSites/add').post({ value: [{ id: siteId }] });
    }

    public async unfollowSite(siteUrl: string): Promise<void> {
        const client = await this.context.msGraphClientFactory.getClient('3');
        const siteId = await this.resolveSiteId(siteUrl);
        await client.api('/me/followedSites/remove').post({ value: [{ id: siteId }] });
    }

    public async getGroupMembership(groupId: string): Promise<IGroupMembership> {
        const client = await this.context.msGraphClientFactory.getClient('3');
        const select = 'id,displayName,mail,userPrincipalName';
        const [ownersResponse, membersResponse, currentUser] = await Promise.all([
            client.api(`/groups/${groupId}/owners/microsoft.graph.user`).select(select).get(),
            client.api(`/groups/${groupId}/members/microsoft.graph.user`).select(select).get(),
            client.api('/me').select(select).get()
        ]);
        const owners = this.mapPeople((ownersResponse as IGraphResponse<Record<string, string>>).value ?? []);
        const members = this.mapPeople((membersResponse as IGraphResponse<Record<string, string>>).value ?? []);
        const currentUserId = String((currentUser as Record<string, string>).id ?? '').toLowerCase();
        return { owners, members, canManageMembership: owners.some((owner) => owner.id.toLowerCase() === currentUserId) };
    }

    public async addGroupMember(groupId: string, userQuery: string): Promise<IGroupPerson> {
        const client = await this.context.msGraphClientFactory.getClient('3');
        const user = await client.api(`/users/${encodeURIComponent(userQuery.trim())}`).select('id,displayName,mail,userPrincipalName').get() as Record<string, string>;
        await client.api(`/groups/${groupId}/members/$ref`).post({
            '@odata.id': `https://graph.microsoft.com/v1.0/directoryObjects/${user.id}`
        });
        return this.mapPerson(user);
    }

    public async removeGroupMember(groupId: string, userId: string): Promise<void> {
        const client = await this.context.msGraphClientFactory.getClient('3');
        await client.api(`/groups/${groupId}/members/${userId}/$ref`).delete();
    }

    private async getGraphPages<T>(
        client: IGraphClient,
        path: string,
        top: number | undefined,
        configureInitialRequest?: (request: IGraphRequestBuilder) => IGraphRequestBuilder,
        configureRequest?: (request: IGraphRequestBuilder) => IGraphRequestBuilder
    ): Promise<T[]> {
        const requestedTop = normalizeTop(top);
        if (requestedTop === 0) return [];

        const items: T[] = [];
        let nextLink: string | undefined = path;
        let isInitialRequest = true;
        while (nextLink) {
            let request = client.api(nextLink);
            if (configureRequest) request = configureRequest(request);
            if (isInitialRequest && configureInitialRequest) request = configureInitialRequest(request);
            const response = await request.get() as IGraphResponse<T>;
            items.push(...(response.value ?? []));
            if (requestedTop !== undefined && items.length >= requestedTop) {
                return items.slice(0, requestedTop);
            }
            nextLink = response['@odata.nextLink'];
            isInitialRequest = false;
        }

        return requestedTop === undefined ? items : items.slice(0, requestedTop);
    }

    private async resolveSiteId(siteUrl: string): Promise<string> {
        const parsedUrl = new URL(siteUrl);
        const client = await this.context.msGraphClientFactory.getClient('3');
        const site = await client.api(`/sites/${parsedUrl.hostname}:${parsedUrl.pathname}`).select('id').get() as { id?: string };
        if (!site.id) throw new Error('The site could not be resolved in Microsoft Graph.');
        return site.id;
    }

    private normalizeUrl(url: string): string {
        return url.replace(/\/$/, '').toLowerCase();
    }

    private mapPeople(people: Array<Record<string, string>>): IGroupPerson[] {
        return people.map((person) => this.mapPerson(person));
    }

    private mapPerson(person: Record<string, string>): IGroupPerson {
        return {
            id: person.id ?? '',
            displayName: person.displayName ?? person.mail ?? person.userPrincipalName ?? 'Unknown user',
            email: person.mail ?? person.userPrincipalName
        };
    }

    private filterItems(items: IResourceItem[], query: string | undefined, top?: number): IResourceItem[] {
        const normalizedQuery = query?.trim().toLowerCase();
        const limitItems = (values: IResourceItem[]): IResourceItem[] => top === undefined ? values : values.slice(0, top);
        if (!normalizedQuery) return limitItems(items);
        return limitItems(items.filter((item) => [item.id, item.title, item.description, item.url]
            .some((value) => value?.toLowerCase().includes(normalizedQuery))));
    }

    public async getAll(top?: number): Promise<{
        followedSites: IResourceItem[]; accessibleSites: IResourceItem[]; groups: IResourceItem[];
    }> {
        const [followedSites, accessibleSites, groups] = await Promise.all([
            this.getFollowedSites(top), this.getSitesHavingAccess(top), this.getGroupsHavingAccess(top)
        ]);
        return { followedSites, accessibleSites, groups };
    }
}

function escapeODataString(value: string): string {
    return value.replace(/'/g, "''");
}

function isGuid(value: string): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function normalizeTop(top: number | undefined): number | undefined {
    if (top === undefined || !Number.isFinite(top)) return undefined;
    return Math.max(0, Math.floor(top));
}

function getSearchCollectionResults<T>(collection: ISearchCollection<T> | undefined): T[] {
    return Array.isArray(collection) ? collection : collection?.results ?? [];
}