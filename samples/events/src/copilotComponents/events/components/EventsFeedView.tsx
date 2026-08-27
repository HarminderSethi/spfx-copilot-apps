import * as React from "react";
import {
  EventFeed,
  type EventFeedLayout,
  StackV2,
} from "@spteck/react-controls-v2";

import {
  EVENT_FEED_SCROLL_AREA_CLASS,
  useInfiniteEventFeed,
} from "../hooks/useInfiniteEventFeed";
import type { IEventFeedItem } from "../utils/mappers";
import { EventsAsyncStatus } from "./EventsAsyncStatus";

export interface IEventsFeedViewProps {
  dateLocale: string;
  error: string | undefined;
  errorLabel: string;
  hasMore: boolean;
  infinite: boolean;
  isLoading: boolean;
  items: IEventFeedItem[];
  layout: EventFeedLayout;
  loadingLabel: string;
  loadMore: () => Promise<void>;
  scrollAreaHeight: string | undefined;
  showDescription: boolean;
  showLocation: boolean;
  showOrganizer: boolean;
  timeZone: string;
}

export function EventsFeedView(
  props: IEventsFeedViewProps,
): React.ReactElement {
  const containerRef = useInfiniteEventFeed({
    enabled: props.infinite,
    error: props.error,
    hasMore: props.hasMore,
    isLoading: props.isLoading,
    itemCount: props.items.length,
    loadMore: props.loadMore,
    scrollAreaHeight: props.scrollAreaHeight,
  });

  return (
    <StackV2
      ref={containerRef}
      aria-busy={props.isLoading}
      style={{ position: "relative" }}
      width="100%"
    >
      <EventFeed
        className={EVENT_FEED_SCROLL_AREA_CLASS}
        height={props.scrollAreaHeight}
        items={props.items}
        key={props.layout}
        layout={props.layout}
        locale={props.dateLocale}
        showDescription={props.showDescription}
        showLocation={props.showLocation}
        showOrganizer={props.showOrganizer}
        timeZone={props.timeZone}
      />
      {(props.error || (props.isLoading && props.items.length > 0)) && (
        <EventsAsyncStatus
          error={props.error}
          errorLabel={props.errorLabel}
          isLoading={props.isLoading}
          loadingLabel={props.loadingLabel}
        />
      )}
    </StackV2>
  );
}
