import type { IEventsCopilotComponentProperties } from "../EventsCopilotComponentProperties";

export const DEFAULT_MAX_EVENTS = 20;
export const MIN_EVENTS = 1;
export const MAX_EVENTS = 50;

const DEFAULT_DATE_RANGE_MONTHS = 3;
const SHAREPOINT_HOST_SUFFIXES = [
  ".sharepoint.com",
  ".sharepoint.us",
  ".sharepoint.de",
  ".sharepoint.cn",
  ".sharepoint-mil.us",
] as const;
const UTC_ISO_DATE_TIME_PATTERN =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,3}))?Z$/;

type DatePropertyName = "startDateTime" | "endDateTime";

export type IEventQueryProperties = Pick<
  IEventsCopilotComponentProperties,
  | "startDateTime"
  | "endDateTime"
  | "searchQuery"
  | "siteUrl"
  | "maxEvents"
>;

export interface IValidatedEventQuery {
  rangeStart: number | undefined;
  rangeEnd: number | undefined;
  searchQuery: string | undefined;
  siteUrl: string | undefined;
  maxEvents: number;
}

function parseUtcDateTime(
  value: string | undefined,
  propertyName: DatePropertyName,
): number | undefined {
  if (value === undefined) {
    return undefined;
  }

  const normalizedValue = value.trim();
  const match = UTC_ISO_DATE_TIME_PATTERN.exec(normalizedValue);

  if (!match) {
    throw new Error(
      `${propertyName} must be a UTC ISO 8601 date-time ending in Z.`,
    );
  }

  const timestamp = Date.parse(normalizedValue);
  const parsedDate = new Date(timestamp);
  const [, year, month, day, hour, minute, second] = match;
  const hasValidCalendarValues =
    Number.isFinite(timestamp) &&
    parsedDate.getUTCFullYear() === Number(year) &&
    parsedDate.getUTCMonth() + 1 === Number(month) &&
    parsedDate.getUTCDate() === Number(day) &&
    parsedDate.getUTCHours() === Number(hour) &&
    parsedDate.getUTCMinutes() === Number(minute) &&
    parsedDate.getUTCSeconds() === Number(second);

  if (!hasValidCalendarValues) {
    throw new Error(`${propertyName} contains an invalid UTC date-time.`);
  }

  return timestamp;
}

function getDefaultDateRange(): Pick<
  IValidatedEventQuery,
  "rangeStart" | "rangeEnd"
> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const rangeEnd = new Date(today);
  rangeEnd.setMonth(rangeEnd.getMonth() + DEFAULT_DATE_RANGE_MONTHS);
  rangeEnd.setHours(23, 59, 59, 999);

  return {
    rangeStart: today.getTime(),
    rangeEnd: rangeEnd.getTime(),
  };
}

function validateSiteUrl(siteUrl: string | undefined): string | undefined {
  if (siteUrl === undefined) {
    return undefined;
  }

  const normalizedSiteUrl = siteUrl.trim();
  let parsedSiteUrl: URL;

  try {
    parsedSiteUrl = new URL(normalizedSiteUrl);
  } catch {
    throw new Error("siteUrl must be an absolute HTTPS URL.");
  }

  if (
    parsedSiteUrl.protocol !== "https:" ||
    parsedSiteUrl.username ||
    parsedSiteUrl.password ||
    parsedSiteUrl.search ||
    parsedSiteUrl.hash
  ) {
    throw new Error(
      "siteUrl must be an absolute HTTPS URL without credentials, query parameters, or a fragment.",
    );
  }

  const normalizedHostname = parsedSiteUrl.hostname.toLowerCase();
  const isSharePointHostname = SHAREPOINT_HOST_SUFFIXES.some(
    (suffix) => normalizedHostname.slice(-suffix.length) === suffix,
  );

  if (!isSharePointHostname) {
    throw new Error("siteUrl must use a SharePoint Online hostname.");
  }

  return parsedSiteUrl.href.replace(/\/$/, "");
}

function validateMaxEvents(maxEvents: number | undefined): number {
  if (maxEvents === undefined) {
    return DEFAULT_MAX_EVENTS;
  }

  if (
    !Number.isInteger(maxEvents) ||
    maxEvents < MIN_EVENTS ||
    maxEvents > MAX_EVENTS
  ) {
    throw new Error(
      `maxEvents must be an integer from ${MIN_EVENTS} through ${MAX_EVENTS}.`,
    );
  }

  return maxEvents;
}

export function validateEventQuery(
  properties: IEventQueryProperties,
): IValidatedEventQuery {
  let rangeStart = parseUtcDateTime(
    properties.startDateTime,
    "startDateTime",
  );
  let rangeEnd = parseUtcDateTime(properties.endDateTime, "endDateTime");

  if (rangeStart === undefined && rangeEnd === undefined) {
    const defaultDateRange = getDefaultDateRange();
    rangeStart = defaultDateRange.rangeStart;
    rangeEnd = defaultDateRange.rangeEnd;
  }

  if (
    rangeStart !== undefined &&
    rangeEnd !== undefined &&
    rangeEnd < rangeStart
  ) {
    throw new Error("endDateTime must not be earlier than startDateTime.");
  }

  const normalizedSearchQuery = properties.searchQuery?.trim();

  return {
    rangeStart,
    rangeEnd,
    searchQuery:
      normalizedSearchQuery?.toLowerCase() === "all"
        ? undefined
        : normalizedSearchQuery || undefined,
    siteUrl: validateSiteUrl(properties.siteUrl),
    maxEvents: validateMaxEvents(properties.maxEvents),
  };
}
