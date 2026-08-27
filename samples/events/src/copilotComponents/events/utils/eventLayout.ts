import type { EventFeedLayout } from "@spteck/react-controls-v2";

export const DEFAULT_EXPANDED_EVENT_LAYOUT: EventFeedLayout = "feature";

export type RequestedEventLayout =
  | "feature"
  | "list"
  | "grid"
  | "agenda"
  | "compactList";

export interface IEventLayoutProperties {
  layout?: RequestedEventLayout;
  layoutWasExplicitlyRequested?: boolean;
}

export function resolveExpandedEventLayout(
  properties: IEventLayoutProperties,
): EventFeedLayout {
  if (
    properties.layoutWasExplicitlyRequested !== true ||
    properties.layout === undefined
  ) {
    return DEFAULT_EXPANDED_EVENT_LAYOUT;
  }

  return properties.layout === "compactList" ? "minilist" : properties.layout;
}
