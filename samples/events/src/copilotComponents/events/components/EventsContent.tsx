import * as React from "react";
import {
  type EventFeedLayout,
  StackV2,
  TypographyControl,
} from "@spteck/react-controls-v2";

import type { IEventFeedItem } from "../utils/mappers";
import type { EventsView } from "../utils/eventView";
import type { FirstDayOfWeek } from "../utils/userRegionalSettings";
import { ErrorBoundary } from "./ErrorBoundary";
import { EventsCalendarView } from "./EventsCalendarView";
import { EventsFeedView } from "./EventsFeedView";
import { EventsSkeleton } from "./EventsSkeleton";

export interface IEventsContentProps {
  dateLocale: string;
  emptyLabel: string;
  error: string | undefined;
  errorLabel: string;
  hasMore: boolean;
  infinite: boolean;
  firstDayOfWeek: FirstDayOfWeek;
  isFullscreen: boolean;
  isLoading: boolean;
  items: IEventFeedItem[];
  layout: EventFeedLayout;
  loadingLabel: string;
  loadMore: () => Promise<void>;
  rootRef: React.RefObject<HTMLDivElement>;
  scrollAreaHeight: string | undefined;
  selectedView: EventsView;
  showDescription: boolean;
  showLocation: boolean;
  showOrganizer: boolean;
  targetDocument: Document | undefined;
  timeZone: string;
  toolbar: React.ReactNode;
}

export function EventsContent(props: IEventsContentProps): React.ReactElement {
  const isInitialLoading = props.isLoading && props.items.length === 0;
  const hasInitialError = props.error !== undefined && props.items.length === 0;

  return (
    <StackV2
      gap="m"
      padding="m"
      ref={props.rootRef}
      width="100%"
      style={
        props.isFullscreen
          ? { boxSizing: "border-box", minHeight: 0, overflow: "hidden" }
          : { boxSizing: "border-box" }
      }
    >
      {props.toolbar}

      {isInitialLoading ? (
        <EventsSkeleton
          label={props.loadingLabel}
          layout={
            props.selectedView === "calendar" ? "calendar" : props.layout
          }
        />
      ) : hasInitialError ? (
        <TypographyControl>
          {props.errorLabel}: {props.error}
        </TypographyControl>
      ) : props.items.length === 0 ? (
        <TypographyControl>{props.emptyLabel}</TypographyControl>
      ) : (
        <ErrorBoundary fallbackTitle={props.errorLabel}>
          {props.selectedView === "calendar" ? (
            <EventsCalendarView
              dateLocale={props.dateLocale}
              error={props.error}
              errorLabel={props.errorLabel}
              firstDayOfWeek={props.firstDayOfWeek}
              isFullscreen={props.isFullscreen}
              isLoading={props.isLoading}
              items={props.items}
              loadingLabel={props.loadingLabel}
              scrollAreaHeight={props.scrollAreaHeight}
              targetDocument={props.targetDocument}
              timeZone={props.timeZone}
            />
          ) : (
            <EventsFeedView
              dateLocale={props.dateLocale}
              error={props.error}
              errorLabel={props.errorLabel}
              hasMore={props.hasMore}
              infinite={props.infinite}
              isLoading={props.isLoading}
              items={props.items}
              layout={props.layout}
              loadingLabel={props.loadingLabel}
              loadMore={props.loadMore}
              scrollAreaHeight={props.scrollAreaHeight}
              showDescription={props.showDescription}
              showLocation={props.showLocation}
              showOrganizer={props.showOrganizer}
              timeZone={props.timeZone}
            />
          )}
        </ErrorBoundary>
      )}
    </StackV2>
  );
}
