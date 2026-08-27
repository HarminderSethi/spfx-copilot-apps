export type EventsView = "events" | "calendar";

export function isEventsView(value: string): value is EventsView {
  return value === "events" || value === "calendar";
}
