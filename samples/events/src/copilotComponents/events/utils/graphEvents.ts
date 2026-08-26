import type { MSGraphClientV3 } from '@microsoft/sp-http';
import {
  type IEventQueryProperties,
  type IValidatedEventQuery,
  validateEventQuery,
} from './eventQuery';

const MAX_SEARCH_RESULTS = 500;
const INITIAL_SEARCH_PAGE_SIZE = 20;
const SUBSEQUENT_SEARCH_PAGE_SIZE = 50;

export interface ISharePointEvent {
  Id: number;
  Title?: string;
  EventDate?: string;
  EndDate?: string;
  fAllDayEvent?: boolean;
  Location?: string;
  Description?: string;
  Category?: string;
  imageUrl?: string;
  organizer?: string;
  webUrl?: string;
}

export interface ISharePointEventPage {
  events: ISharePointEvent[];
  from: number;
  nextOffset: number;
  hasMore: boolean;
  maxEvents: number;
}

interface ISharePointIds {
  listId?: string;
  listItemId?: string;
}

interface IGraphListItem {
  id?: string;
  webUrl?: string;
  createdBy?: { user?: { displayName?: string } };
  parentReference?: {
    siteId?: string;
    sharepointIds?: ISharePointIds;
  };
  sharepointIds?: ISharePointIds;
  fields?: Record<string, unknown>;
}

interface IGraphSearchHit {
  resource?: IGraphListItem;
}

interface IGraphHitsContainer {
  hits?: IGraphSearchHit[];
  total?: number;
  moreResultsAvailable?: boolean;
}

interface ISearchResponse {
  value?: Array<{
    hitsContainers?: IGraphHitsContainer[];
  }>;
}

interface IGraphSearchQuery {
  queryString: string;
  queryTemplate: string;
}

function escapeKqlPhrase(value: string): string {
  return `"${value.replace(/"/g, '\\"')}"`;
}

function buildSearchQuery(query: IValidatedEventQuery): IGraphSearchQuery {
  const restrictions = ['contentclass:STS_ListItem_Events'];

  if (query.siteUrl) {
    restrictions.push(`path:${escapeKqlPhrase(query.siteUrl)}`);
  }

  return {
    queryString: query.searchQuery ?? '*',
    queryTemplate: `({searchTerms}) AND ${restrictions.join(' AND ')}`,
  };
}

function getString(fields: Record<string, unknown>, name: string): string | undefined {
  const key = Object.keys(fields).find(
    (fieldName) => fieldName.toLowerCase() === name.toLowerCase()
  );
  const value = key ? fields[key] : undefined;
  return typeof value === 'string' ? value : undefined;
}

function getField(fields: Record<string, unknown>, name: string): unknown {
  const key = Object.keys(fields).find(
    (fieldName) => fieldName.toLowerCase() === name.toLowerCase()
  );
  return key ? fields[key] : undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function parseImageUrl(value: unknown): string | undefined {
  if (typeof value === 'string') {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      return undefined;
    }

    if (trimmedValue.startsWith('{')) {
      try {
        return parseImageUrl(JSON.parse(trimmedValue));
      } catch {
        return undefined;
      }
    }

    return trimmedValue;
  }

  if (!isRecord(value)) {
    return undefined;
  }

  const url = value.Url ?? value.url;

  if (typeof url === 'string' && url.trim()) {
    return url.trim();
  }

  const serverUrl = value.serverUrl;
  const serverRelativeUrl = value.serverRelativeUrl;

  if (typeof serverUrl === 'string' && typeof serverRelativeUrl === 'string') {
    return `${serverUrl.replace(/\/$/, '')}/${serverRelativeUrl.replace(/^\//, '')}`;
  }

  return undefined;
}

function toSharePointEvent(item: IGraphListItem): ISharePointEvent | undefined {
  const fields = item.fields;
  const sharepointIds = item.sharepointIds ?? item.parentReference?.sharepointIds;
  const id = Number(sharepointIds?.listItemId ?? item.id);

  if (!fields || !Number.isInteger(id)) {
    return undefined;
  }

  const allDayValue = getField(fields, 'fAllDayEvent');

  return {
    Id: id,
    Title: getString(fields, 'Title'),
    EventDate: getString(fields, 'EventDate'),
    EndDate: getString(fields, 'EndDate'),
    fAllDayEvent: allDayValue === true || allDayValue === 1 || allDayValue === '1',
    Location: getString(fields, 'Location'),
    Description: getString(fields, 'Description'),
    Category: getString(fields, 'Category'),
    imageUrl: parseImageUrl(getField(fields, 'BannerUrl')) ??
      parseImageUrl(getField(fields, 'BannerImageUrl')),
    organizer: item.createdBy?.user?.displayName,
    webUrl: item.webUrl,
  };
}

async function hydrateSearchHit(
  graphClient: MSGraphClientV3,
  hit: IGraphListItem
): Promise<ISharePointEvent | undefined> {
  const searchEvent = toSharePointEvent(hit);

  if (searchEvent?.EventDate) {
    return searchEvent;
  }

  const siteId = hit.parentReference?.siteId;
  const sharepointIds = hit.sharepointIds ?? hit.parentReference?.sharepointIds;
  const listId = sharepointIds?.listId;
  const itemId = sharepointIds?.listItemId ?? hit.id;

  if (!siteId || !listId || !itemId) {
    return searchEvent;
  }

  const item: IGraphListItem = await graphClient
    .api(`/sites/${siteId}/lists/${listId}/items/${itemId}`)
    .version('v1.0')
    .expand('fields($select=Title,EventDate,EndDate,fAllDayEvent,Location,Description,Category,BannerUrl,BannerImageUrl)')
    .get();

  return toSharePointEvent(item);
}

function isInDateRange(
  event: ISharePointEvent,
  query: IValidatedEventQuery
): boolean {
  const eventStart = event.EventDate ? Date.parse(event.EventDate) : Number.NaN;
  const eventEnd = event.EndDate ? Date.parse(event.EndDate) : eventStart;

  if (!Number.isFinite(eventStart) || !Number.isFinite(eventEnd)) {
    return false;
  }

  return (query.rangeStart === undefined || eventEnd >= query.rangeStart) &&
    (query.rangeEnd === undefined || eventStart <= query.rangeEnd);
}

export async function fetchSharePointEventPage(
  graphClient: MSGraphClientV3,
  props: IEventQueryProperties,
  from: number,
): Promise<ISharePointEventPage> {
  const query = validateEventQuery(props);
  const searchQuery = buildSearchQuery(query);
  const requestedPageSize =
    from === 0 ? INITIAL_SEARCH_PAGE_SIZE : SUBSEQUENT_SEARCH_PAGE_SIZE;
  const searchSize = Math.min(
    requestedPageSize,
    Math.max(MAX_SEARCH_RESULTS - from, 0),
  );

  if (searchSize === 0) {
    return {
      events: [],
      from,
      nextOffset: from,
      hasMore: false,
      maxEvents: query.maxEvents,
    };
  }

  const response: ISearchResponse = await graphClient
    .api('/search/query')
    .version('v1.0')
    .post({
      requests: [{
        entityTypes: ['listItem'],
        query: searchQuery,
        from,
        size: searchSize,
      }],
    });
  const hitsContainers: IGraphHitsContainer[] = [];
  const hits: IGraphSearchHit[] = [];

  for (const responseValue of response.value ?? []) {
    hitsContainers.push(...(responseValue.hitsContainers ?? []));
  }

  for (const hitsContainer of hitsContainers) {
    hits.push(...(hitsContainer.hits ?? []));
  }
  const events = await Promise.all(
    hits
      .map((hit) => hit.resource)
      .filter((resource): resource is IGraphListItem => resource !== undefined)
      .map((resource) => hydrateSearchHit(graphClient, resource))
  );
  const normalizedEvents = events.filter(
    (event): event is ISharePointEvent => event !== undefined
  );
  const eventsInRange = normalizedEvents.filter(
    (event) => isInDateRange(event, query)
  );
  const nextOffset = Math.min(from + hits.length, MAX_SEARCH_RESULTS);
  const moreResultsAvailable = hitsContainers.some(
    (container) => container.moreResultsAvailable === true,
  );
  const hasMore =
    nextOffset > from &&
    nextOffset < MAX_SEARCH_RESULTS &&
    (moreResultsAvailable || hits.length === searchSize);

  return {
    events: eventsInRange.sort(
      (left, right) =>
        Date.parse(left.EventDate ?? '') - Date.parse(right.EventDate ?? ''),
    ),
    from,
    nextOffset,
    hasMore,
    maxEvents: query.maxEvents,
  };
}
