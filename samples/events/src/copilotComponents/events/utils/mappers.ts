import type { ISharePointEvent } from "./graphEvents";

export interface IEventFeedItem {
  id: string;
  title: string;
  startDate: string;
  endDate?: string;
  isAllDay: boolean;
  location?: string;
  organizer?: string;
  description?: string;
  category?: string;
  imageUrl?: string;
  attendees?: number;
  isVirtual?: boolean;
  joinUrl?: string;
  linkUrl?: string;
}

function htmlToText(html: string | undefined): string | undefined {
  if (!html) return html;
  return (
    new DOMParser().parseFromString(html, "text/html").body.textContent ?? ""
  );
}

export function mapEventToFeedItem(event: ISharePointEvent): IEventFeedItem {
  return {
    id: event.webUrl ?? `${event.Id}:${event.EventDate ?? ""}`,
    title: event.Title ?? "",
    startDate: event.EventDate ?? new Date().toISOString(),
    endDate: event.EndDate,
    isAllDay: event.fAllDayEvent ?? false,
    location: event.Location,
    organizer: event.organizer,
    description: htmlToText(event.Description),
    imageUrl: event.imageUrl,
    linkUrl: event.webUrl,
    category: event.Category,
  };
}
