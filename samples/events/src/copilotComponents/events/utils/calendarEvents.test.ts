import {
  getInitialCalendarDate,
  mapFeedItemToCalendarEvent,
} from "./calendarEvents";
import type { IEventFeedItem } from "./mappers";

const feedItem: IEventFeedItem = {
  category: "Training",
  description: "Architecture workshop",
  endDate: "2026-09-11T11:00:00Z",
  id: "event-1",
  imageUrl: "https://contoso.sharepoint.com/event.jpg",
  isAllDay: false,
  isVirtual: true,
  linkUrl: "https://contoso.sharepoint.com/events/1",
  location: "Microsoft Teams",
  startDate: "2026-09-11T10:00:00Z",
  title: "Serverless Architecture",
};

describe("mapFeedItemToCalendarEvent", () => {
  it("maps the feed model to the calendar control model", () => {
    expect(mapFeedItemToCalendarEvent(feedItem)).toEqual({
      category: "Training",
      description: "Architecture workshop",
      enableOnHouver: true,
      end: "2026-09-11T11:00:00Z",
      hexColor: "#2DC653",
      id: "event-1",
      imageUrl: "https://contoso.sharepoint.com/event.jpg",
      isFullDay: false,
      isOnlineMeeting: true,
      location: "Microsoft Teams",
      start: "2026-09-11T10:00:00Z",
      title: "Serverless Architecture",
      weblink: "https://contoso.sharepoint.com/events/1",
    });
  });

  it("uses the start date when an event has no end date", () => {
    expect(
      mapFeedItemToCalendarEvent({ ...feedItem, endDate: undefined }).end,
    ).toBe(feedItem.startDate);
  });

  it("assigns a stable custom hex color for calendar indicators", () => {
    const firstColor = mapFeedItemToCalendarEvent(feedItem).hexColor;
    const secondColor = mapFeedItemToCalendarEvent(feedItem).hexColor;

    expect(firstColor).toMatch(/^#[0-9A-F]{6}$/);
    expect(secondColor).toBe(firstColor);
  });
});

describe("getInitialCalendarDate", () => {
  it("uses the first available event date", () => {
    expect(getInitialCalendarDate([feedItem]).getTime()).toBe(
      Date.parse(feedItem.startDate),
    );
  });

  it("uses the fallback when the first event date is unavailable", () => {
    const fallbackDate = new Date("2026-08-26T12:00:00Z");

    expect(getInitialCalendarDate([], fallbackDate).getTime()).toBe(
      fallbackDate.getTime(),
    );
  });
});
