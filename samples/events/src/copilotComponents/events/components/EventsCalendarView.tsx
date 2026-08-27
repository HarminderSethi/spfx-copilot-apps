import * as React from "react";
import {
  CalendarControl,
  CompactCalendar,
  ECalendarViews,
  type IEvent,
  StackV2,
} from "@spteck/react-controls-v2";

import {
  getInitialCalendarDate,
  mapFeedItemToCalendarEvent,
} from "../utils/calendarEvents";
import type { IEventFeedItem } from "../utils/mappers";
import { EventsAsyncStatus } from "./EventsAsyncStatus";
import type { FirstDayOfWeek } from "../utils/userRegionalSettings";

export interface IEventsCalendarViewProps {
  dateLocale: string;
  error: string | undefined;
  errorLabel: string;
  firstDayOfWeek: FirstDayOfWeek;
  isFullscreen: boolean;
  isLoading: boolean;
  items: IEventFeedItem[];
  loadingLabel: string;
  scrollAreaHeight: string | undefined;
  targetDocument: Document | undefined;
  timeZone: string;
}

export function EventsCalendarView(
  props: IEventsCalendarViewProps,
): React.ReactElement {
  const initialDate = React.useMemo(
    () => getInitialCalendarDate(props.items),
    [props.items],
  );
  const [displayedDate, setDisplayedDate] = React.useState(initialDate);
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(
    initialDate,
  );
  const calendarEvents = React.useMemo<IEvent[]>(
    () => props.items.map(mapFeedItemToCalendarEvent),
    [props.items],
  );

  const handleEventClick = React.useCallback(
    (event: IEvent): void => {
      if (event.weblink) {
        props.targetDocument?.defaultView?.open(
          event.weblink,
          "_blank",
          "noopener,noreferrer",
        );
      }
    },
    [props.targetDocument],
  );

  return (
    <StackV2 style={{ position: "relative" }} width="100%">
      {props.isFullscreen ? (
        <CalendarControl
          defaultDate={initialDate}
          defaultView={ECalendarViews.Month}
          events={calendarEvents}
          firstDayOfWeek={props.firstDayOfWeek}
          height={800}
          locale={props.dateLocale}
          timeZone={props.timeZone}
        />
      ) : (
        <CompactCalendar
          date={displayedDate}
          events={calendarEvents}
          firstDayOfWeek={props.firstDayOfWeek}
          height="auto"
          highlightToday={true}
          onDateChange={setDisplayedDate}
          onEventClick={handleEventClick}
          onSelectedDateChange={setSelectedDate}
          selectedDate={selectedDate}
          showToolbar={true}
          locale={props.dateLocale}
          withOutsideDays={true}
        />
      )}
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
