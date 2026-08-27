import type { IEvent } from "@spteck/react-controls-v2";

import type { IEventFeedItem } from "./mappers";

const CALENDAR_EVENT_COLORS = [
  "#6B3FA0",
  "#00B4D8",
  "#2DC653",
  "#FF6B35",
] as const;

function getCalendarEventColor(item: IEventFeedItem): string {
  const colorKey = `${item.category ?? ""}:${item.id}`;
  let hash = 0;

  for (let index = 0; index < colorKey.length; index += 1) {
    hash = (hash * 31 + colorKey.charCodeAt(index)) >>> 0;
  }

  return CALENDAR_EVENT_COLORS[hash % CALENDAR_EVENT_COLORS.length];
}

export function getInitialCalendarDate(
  items: readonly IEventFeedItem[],
  fallbackDate: Date = new Date(),
): Date {
  const firstEventTime = Date.parse(items[0]?.startDate ?? "");

  return Number.isFinite(firstEventTime)
    ? new Date(firstEventTime)
    : new Date(fallbackDate.getTime());
}

export function mapFeedItemToCalendarEvent(
  item: IEventFeedItem,
): IEvent {
  return {
    category: item.category,
    description: item.description,
    enableOnHouver: true,
    end: item.endDate ?? item.startDate,
    hexColor: getCalendarEventColor(item),
    id: item.id,
    imageUrl: item.imageUrl,
    isFullDay: item.isAllDay,
    isOnlineMeeting: item.isVirtual,
    location: item.location,
    start: item.startDate,
    title: item.title,
    weblink: item.linkUrl,
  };
}
