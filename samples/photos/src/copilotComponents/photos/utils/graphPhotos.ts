import type { MSGraphClientV3 } from "@microsoft/sp-http";

import type { IPhotosCopilotComponentProperties } from "../PhotosCopilotComponentProperties";

const DEFAULT_MAX_PHOTOS: number = 1000;
const MAX_MAX_PHOTOS: number = 1000;
const MAX_GRAPH_SEARCH_RESULTS: number = 1000;
const INITIAL_PAGE_SIZE: number = 60;
const SUBSEQUENT_PAGE_SIZE: number = 200;
const MAX_THUMBNAIL_HYDRATIONS: number = 100;
const DEFAULT_IMAGE_WIDTH: number = 4;
const DEFAULT_IMAGE_HEIGHT: number = 3;
const ONEDRIVE_HOST_SUFFIX: string = "-my.sharepoint.com";
const ONEDRIVE_PATH_EXCLUSION_KQL: string =
  'NOT path:"-my.sharepoint.com"';
const UNSUPPORTED_IMAGE_MIME_TYPES: ReadonlySet<string> = new Set<string>([
  "image/heic",
  "image/heif",
  "image/heic-sequence",
  "image/heif-sequence",
]);

const SUPPORTED_IMAGE_EXTENSIONS: ReadonlySet<string> = new Set<string>([
  "avif",
  "bmp",
  "gif",
  "jpeg",
  "jpg",
  "png",
  "svg",
  "tif",
  "tiff",
  "webp",
]);

const SEARCH_QUERY_STOP_WORDS: ReadonlySet<string> = new Set<string>([
  "a",
  "all",
  "an",
  "any",
  "can",
  "could",
  "document",
  "documents",
  "display",
  "event",
  "events",
  "every",
  "find",
  "folder",
  "folders",
  "for",
  "from",
  "get",
  "give",
  "image",
  "images",
  "in",
  "inside",
  "library",
  "libraries",
  "me",
  "my",
  "of",
  "onedrive",
  "on",
  "photo",
  "photos",
  "picture",
  "pictures",
  "please",
  "return",
  "saved",
  "search",
  "show",
  "stored",
  "the",
  "to",
  "with",
  "within",
  "would",
]);

interface IGraphThumbnail {
  url?: string;
  width?: number;
  height?: number;
}

interface IGraphThumbnailSet {
  small?: IGraphThumbnail;
  medium?: IGraphThumbnail;
  large?: IGraphThumbnail;
}

interface IGraphDriveItem {
  id?: string;
  name?: string;
  webUrl?: string;
  size?: number;
  createdDateTime?: string;
  lastModifiedDateTime?: string;
  parentReference?: {
    driveId?: string;
    siteId?: string;
    path?: string;
  };
  file?: {
    mimeType?: string;
  };
  image?: {
    width?: number;
    height?: number;
  };
  photo?: {
    takenDateTime?: string;
  };
  thumbnails?: IGraphThumbnailSet[];
  sharepointIds?: {
    listId?: string;
    listItemId?: string;
    listItemUniqueId?: string;
    siteId?: string;
    webId?: string;
  };
  "@microsoft.graph.downloadUrl"?: string;
}

interface IGraphSearchHit {
  rank?: number;
  resource?: IGraphDriveItem;
}

interface IGraphHitsContainer {
  hits?: IGraphSearchHit[];
  total?: number;
  moreResultsAvailable?: boolean;
}

interface IGraphSearchResponse {
  value?: Array<{
    hitsContainers?: IGraphHitsContainer[];
  }>;
}

interface IGraphThumbnailResponse {
  value?: IGraphThumbnailSet[];
}

interface IGraphSearchRequest {
  entityTypes: string[];
  query: {
    queryString: string;
    queryTemplate: string;
  };
  from: number;
  size: number;
  fields: string[];
}

interface IGraphSearchBody {
  requests: IGraphSearchRequest[];
}

export interface ISharePointPhoto {
  id: string;
  name: string;
  src: string;
  fallbackSrc?: string;
  width: number;
  height: number;
  takenDateTime?: string;
  createdDateTime?: string;
  lastModifiedDateTime?: string;
  relevanceRank: number;
}

export interface ISharePointPhotoPage {
  photos: ISharePointPhoto[];
  from: number;
  nextOffset: number;
  hasMore: boolean;
}

function escapeKqlPhrase(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function escapeSearchPhrase(value: string): string {
  return value.replace(/"/g, '\\"').trim();
}

function getMeaningfulText(value: string | undefined): string | undefined {
  const text: string = value?.trim() || "";
  if (!text || /^(all|all photos|everything|any photos)$/i.test(text)) {
    return undefined;
  }

  return text;
}

function normalizeSearchQuery(value: string | undefined): string | undefined {
  const meaningfulText: string | undefined = getMeaningfulText(value);

  if (!meaningfulText) {
    return undefined;
  }

  const terms: string[] = meaningfulText
    .replace(/[.,!?;:()[\]{}]/g, " ")
    .split(/\s+/)
    .map((term: string) => term.replace(/^['"]|['"]$/g, "").trim())
    .filter((term: string) => term.length > 0)
    .filter((term: string) => !SEARCH_QUERY_STOP_WORDS.has(term.toLowerCase()));

  return terms.length > 0 ? terms.join(" ") : undefined;
}

function normalizeScopeUrl(value: string | undefined): string | undefined {
  const text: string = value?.trim() || "";
  if (!text) {
    return undefined;
  }

  try {
    const url: URL = new URL(text);
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      return undefined;
    }

    url.search = "";
    url.hash = "";

    // Users often paste the library's Forms/AllItems.aspx URL. The path
    // restriction should target the library root instead of that view page.
    url.pathname = url.pathname.replace(/\/Forms\/[^/]+$/i, "");
    return url.toString().replace(/\/$/, "");
  } catch {
    return undefined;
  }
}

function isOneDriveUrl(value: string | undefined): boolean {
  const text: string = value?.trim() || "";
  if (!text) {
    return false;
  }

  try {
    return new URL(text).hostname
      .toLowerCase()
      .endsWith(ONEDRIVE_HOST_SUFFIX);
  } catch {
    return false;
  }
}

function shouldIncludeOneDrivePhotos(
  properties: IPhotosCopilotComponentProperties,
): boolean {
  if (typeof properties.includeOneDrivePhotos === "boolean") {
    return properties.includeOneDrivePhotos;
  }

  if (
    isOneDriveUrl(properties.siteUrl) ||
    isOneDriveUrl(properties.libraryUrl) ||
    isOneDriveUrl(properties.folderPath)
  ) {
    return true;
  }

  return /\b(?:my|onedrive)\b/i.test(
    [properties.searchQuery, properties.libraryName]
      .filter((value: string | undefined): value is string => Boolean(value))
      .join(" "),
  );
}

function getLibraryScopeUrl(
  properties: IPhotosCopilotComponentProperties,
): string | undefined {
  const explicitScope: string | undefined = normalizeScopeUrl(
    properties.folderPath || properties.libraryUrl,
  );

  if (explicitScope) {
    return explicitScope;
  }

  const siteScope: string | undefined = normalizeScopeUrl(properties.siteUrl);
  const libraryName: string | undefined = getMeaningfulText(
    properties.libraryName,
  );

  if (!siteScope || !libraryName) {
    return undefined;
  }

  const libraryUrl: URL = new URL(siteScope + "/");
  libraryUrl.pathname =
    libraryUrl.pathname.replace(/\/$/, "") +
    "/" +
    encodeURIComponent(libraryName);
  return normalizeScopeUrl(libraryUrl.toString());
}

function buildSearchQuery(properties: IPhotosCopilotComponentProperties): {
  queryString: string;
  queryTemplate: string;
} {
  const searchTerms: string[] = [];
  const libraryName: string | undefined = getMeaningfulText(
    properties.libraryName,
  );
  const searchQuery: string | undefined = normalizeSearchQuery(
    properties.searchQuery,
  );

  if (searchQuery) {
    searchTerms.push(searchQuery);
  }

  if (
    !searchQuery &&
    libraryName &&
    !properties.siteUrl &&
    !properties.libraryUrl &&
    !properties.folderPath
  ) {
    searchTerms.push('"' + escapeSearchPhrase(libraryName) + '"');
  }

  const queryString: string =
    searchTerms.length > 0 ? searchTerms.join(" ") : "*";
  const imageTypes: string = Array.from(SUPPORTED_IMAGE_EXTENSIONS)
    .map((extension: string) => "filetype:" + extension)
    .join(" OR ");

  const restrictions: string[] = ["(" + imageTypes + ")"];
  if (!shouldIncludeOneDrivePhotos(properties)) {
    restrictions.push(ONEDRIVE_PATH_EXCLUSION_KQL);
  }

  const scopedPath: string | undefined =
    getLibraryScopeUrl(properties) || normalizeScopeUrl(properties.siteUrl);

  if (scopedPath) {
    restrictions.push('path:"' + escapeKqlPhrase(scopedPath) + '"');
  }

  return {
    queryString,
    queryTemplate: "({searchTerms}) AND " + restrictions.join(" AND "),
  };
}

function getRequestedMaxPhotos(
  properties: IPhotosCopilotComponentProperties,
): number {
  const requested: number = Number.isFinite(properties.maxPhotos)
    ? Math.round(properties.maxPhotos as number)
    : 0;

  if (requested <= 0) {
    return DEFAULT_MAX_PHOTOS;
  }

  return Math.min(Math.max(requested, 1), MAX_MAX_PHOTOS);
}

function getSearchSize(maxPhotos: number, from: number): number {
  const remainingPhotos: number = Math.max(maxPhotos - from, 0);
  const desiredPageSize: number =
    from === 0 ? INITIAL_PAGE_SIZE : SUBSEQUENT_PAGE_SIZE;

  return Math.min(
    desiredPageSize,
    remainingPhotos,
    MAX_GRAPH_SEARCH_RESULTS - from,
  );
}

function getBestThumbnail(item: IGraphDriveItem): IGraphThumbnail | undefined {
  const thumbnailSet: IGraphThumbnailSet | undefined = item.thumbnails?.[0];
  return thumbnailSet?.large || thumbnailSet?.medium || thumbnailSet?.small;
}

function getPositiveDimension(
  value: number | undefined,
  fallback: number,
): number {
  return typeof value === "number" && Number.isFinite(value) && value > 0
    ? value
    : fallback;
}

function getDownloadFallbackUrl(
  value: string | undefined,
  name: string,
): string | undefined {
  if (!value || !name) {
    return undefined;
  }

  try {
    const url: URL = new URL(value);

    // A driveItem.webUrl is not guaranteed to be the file itself. For some
    // SharePoint libraries it is a DispForm.aspx page, which cannot be used
    // as an image source and redirects to a page that returns 401 here.
    const path: string = decodeURIComponent(url.pathname).toLowerCase();
    const extension: string = getFileExtension(name);
    if (
      path.endsWith("/dispform.aspx") ||
      path.endsWith("/_forms/default.aspx") ||
      !SUPPORTED_IMAGE_EXTENSIONS.has(extension) ||
      !path.endsWith("." + extension)
    ) {
      return undefined;
    }

    if (!url.searchParams.has("download")) {
      url.searchParams.set("download", "1");
    }
    return url.toString();
  } catch {
    return undefined;
  }
}

function getFileExtension(name: string): string {
  const lastDot: number = name.lastIndexOf(".");
  return lastDot >= 0 ? name.slice(lastDot + 1).toLowerCase() : "";
}

function isSupportedImage(item: IGraphDriveItem, name: string): boolean {
  const mimeType: string = item.file?.mimeType?.toLowerCase() || "";
  const extension: string = getFileExtension(name);

  if (
    UNSUPPORTED_IMAGE_MIME_TYPES.has(mimeType) ||
    extension === "heic" ||
    extension === "heif"
  ) {
    return false;
  }

  return (
    mimeType.indexOf("image/") === 0 ||
    SUPPORTED_IMAGE_EXTENSIONS.has(extension)
  );
}

function toSharePointPhoto(hit: IGraphSearchHit): ISharePointPhoto | undefined {
  const item: IGraphDriveItem | undefined = hit.resource;
  const name: string = item?.name?.trim() || "";

  if (!item || !name || !isSupportedImage(item, name)) {
    return undefined;
  }

  const thumbnail: IGraphThumbnail | undefined = getBestThumbnail(item);
  const downloadUrl: string | undefined = item["@microsoft.graph.downloadUrl"];
  const safeWebUrl: string | undefined = getDownloadFallbackUrl(
    item.webUrl,
    name,
  );
  const src: string | undefined =
    thumbnail?.url || downloadUrl || safeWebUrl;

  if (!src) {
    return undefined;
  }

  const width: number = getPositiveDimension(
    item.image?.width,
    getPositiveDimension(thumbnail?.width, DEFAULT_IMAGE_WIDTH),
  );
  const height: number = getPositiveDimension(
    item.image?.height,
    getPositiveDimension(thumbnail?.height, DEFAULT_IMAGE_HEIGHT),
  );

  return {
    id: item.id || item.webUrl || name,
    name,
    src,
    fallbackSrc: downloadUrl || safeWebUrl,
    width,
    height,
    takenDateTime: item.photo?.takenDateTime,
    createdDateTime: item.createdDateTime,
    lastModifiedDateTime: item.lastModifiedDateTime,
    relevanceRank: hit.rank || Number.MAX_SAFE_INTEGER,
  };
}

function getPhotoDate(photo: ISharePointPhoto): string | undefined {
  return (
    photo.takenDateTime || photo.createdDateTime || photo.lastModifiedDateTime
  );
}

function isWithinDateRange(
  photo: ISharePointPhoto,
  properties: IPhotosCopilotComponentProperties,
): boolean {
  if (!properties.startDateTime && !properties.endDateTime) {
    return true;
  }

  const photoDate: string | undefined = getPhotoDate(photo);
  const photoTimestamp: number = photoDate ? Date.parse(photoDate) : Number.NaN;

  if (!Number.isFinite(photoTimestamp)) {
    return false;
  }

  if (properties.startDateTime) {
    const startTimestamp: number = Date.parse(properties.startDateTime);
    if (Number.isFinite(startTimestamp) && photoTimestamp < startTimestamp) {
      return false;
    }
  }

  if (properties.endDateTime) {
    const endTimestamp: number = Date.parse(properties.endDateTime);
    if (Number.isFinite(endTimestamp) && photoTimestamp > endTimestamp) {
      return false;
    }
  }

  return true;
}

function sortPhotos(
  photos: ISharePointPhoto[],
  sortBy: IPhotosCopilotComponentProperties["sortBy"],
): ISharePointPhoto[] {
  if (sortBy === "name") {
    return photos.sort((left: ISharePointPhoto, right: ISharePointPhoto) =>
      left.name.localeCompare(right.name, undefined, { sensitivity: "base" }),
    );
  }

  if (sortBy === "modified") {
    return photos.sort((left: ISharePointPhoto, right: ISharePointPhoto) => {
      const leftDate: number = Date.parse(
        left.lastModifiedDateTime || left.createdDateTime || "",
      );
      const rightDate: number = Date.parse(
        right.lastModifiedDateTime || right.createdDateTime || "",
      );
      return (
        (Number.isFinite(rightDate) ? rightDate : 0) -
        (Number.isFinite(leftDate) ? leftDate : 0)
      );
    });
  }

  return photos.sort(
    (left: ISharePointPhoto, right: ISharePointPhoto) =>
      left.relevanceRank - right.relevanceRank,
  );
}

async function hydratePhotoItem(
  graphClient: MSGraphClientV3,
  item: IGraphDriveItem,
): Promise<IGraphDriveItem> {
  if (
    (getBestThumbnail(item) && item["@microsoft.graph.downloadUrl"]) ||
    !item.id ||
    !item.parentReference?.driveId
  ) {
    return item;
  }

  const itemPath: string =
    "/drives/" +
    encodeURIComponent(item.parentReference.driveId) +
    "/items/" +
    encodeURIComponent(item.id);

  let hydratedItem: IGraphDriveItem = item;

  try {
    const hydrated: IGraphDriveItem = await graphClient
      .api(itemPath)
      .version("v1.0")
      .select([
        "id",
        "name",
        "webUrl",
        "size",
        "createdDateTime",
        "lastModifiedDateTime",
        "parentReference",
        "file",
        "image",
        "photo",
        "thumbnails",
        "sharepointIds",
        "@microsoft.graph.downloadUrl",
      ])
      .expand("thumbnails")
      .get();

    hydratedItem = hydrated ? { ...item, ...hydrated } : item;
  } catch (error) {
    console.warn("Could not hydrate SharePoint photo thumbnail.", error);
  }

  if (getBestThumbnail(hydratedItem)) {
    return hydratedItem;
  }

  try {
    const thumbnails: IGraphThumbnailResponse = await graphClient
      .api(itemPath + "/thumbnails")
      .version("v1.0")
      .get();

    if (thumbnails.value?.length) {
      return { ...hydratedItem, thumbnails: thumbnails.value };
    }
  } catch (error) {
    console.warn("Could not retrieve SharePoint photo thumbnails.", error);
  }

  return hydratedItem;
}

export async function fetchSharePointPhotoPage(
  graphClient: MSGraphClientV3,
  properties: IPhotosCopilotComponentProperties,
  from: number,
): Promise<ISharePointPhotoPage> {
  const maxPhotos: number = getRequestedMaxPhotos(properties);
  const pageSize: number = getSearchSize(maxPhotos, from);

  if (pageSize <= 0) {
    return {
      photos: [],
      from,
      nextOffset: from,
      hasMore: false,
    };
  }

  const search: { queryString: string; queryTemplate: string } =
    buildSearchQuery(properties);
  const requestBody: IGraphSearchBody = {
    requests: [
      {
        entityTypes: ["driveItem"],
        query: {
          queryString: search.queryString,
          queryTemplate: search.queryTemplate,
        },
        from,
        size: pageSize,
        fields: [
          "id",
          "name",
          "webUrl",
          "size",
          "createdDateTime",
          "lastModifiedDateTime",
          "parentReference",
          "file",
          "image",
          "photo",
          "thumbnails",
          "sharepointIds",
        ],
      },
    ],
  };

  const response: IGraphSearchResponse = await graphClient
    .api("/search/query")
    .version("v1.0")
    .post(requestBody);

  const containers: IGraphHitsContainer[] = [];
  for (const responseItem of response.value || []) {
    containers.push(...(responseItem.hitsContainers || []));
  }

  const rawHits: IGraphSearchHit[] = [];
  for (const container of containers) {
    rawHits.push(...(container.hits || []));
  }

  const hits: IGraphSearchHit[] = rawHits.filter(
    (hit: IGraphSearchHit) =>
      Boolean(hit.resource) &&
      (shouldIncludeOneDrivePhotos(properties) ||
        !isOneDriveUrl(hit.resource?.webUrl)),
  );
  const nextOffset: number = Math.min(
    from + rawHits.length,
    maxPhotos,
    MAX_GRAPH_SEARCH_RESULTS,
  );
  const moreResultsAvailable: boolean = containers.some(
    (container: IGraphHitsContainer) => container.moreResultsAvailable === true,
  );
  const hasMore: boolean =
    nextOffset > from &&
    nextOffset < maxPhotos &&
    nextOffset < MAX_GRAPH_SEARCH_RESULTS &&
    (moreResultsAvailable || rawHits.length === pageSize);

  if (rawHits.length === 0) {
    return {
      photos: [],
      from,
      nextOffset: from,
      hasMore: false,
    };
  }

  if (hits.length === 0) {
    return {
      photos: [],
      from,
      nextOffset,
      hasMore,
    };
  }

  const hydrationIndexes: Set<number> = new Set<number>();

  for (let index: number = 0; index < hits.length; index += 1) {
    if (hydrationIndexes.size >= MAX_THUMBNAIL_HYDRATIONS) {
      break;
    }

    const resource: IGraphDriveItem = hits[index].resource as IGraphDriveItem;
    if (
      (!getBestThumbnail(resource) ||
        !resource["@microsoft.graph.downloadUrl"]) &&
      resource.id &&
      resource.parentReference?.driveId
    ) {
      hydrationIndexes.add(index);
    }
  }

  const hydratedHits: Array<{
    hit: IGraphSearchHit;
    resource: IGraphDriveItem;
  }> = await Promise.all(
    hits.map(async (hit: IGraphSearchHit, index: number) => ({
      hit,
      resource: hydrationIndexes.has(index)
        ? await hydratePhotoItem(graphClient, hit.resource as IGraphDriveItem)
        : hit.resource as IGraphDriveItem
    })),
  );

  const photos: ISharePointPhoto[] = [];

  for (const { hit, resource } of hydratedHits) {
    const photo: ISharePointPhoto | undefined = toSharePointPhoto({
      rank: hit.rank,
      resource,
    });

    if (photo && isWithinDateRange(photo, properties)) {
      photos.push(photo);
    }
  }

  return {
    photos: sortPhotos(photos, properties.sortBy),
    from,
    nextOffset,
    hasMore,
  };
}

export async function fetchSharePointPhotos(
  graphClient: MSGraphClientV3,
  properties: IPhotosCopilotComponentProperties,
): Promise<ISharePointPhoto[]> {
  const page: ISharePointPhotoPage = await fetchSharePointPhotoPage(
    graphClient,
    properties,
    0,
  );

  return page.photos;
}
