import * as React from "react";
import {
  CalendarMonth20Regular,
  TextBulletListLtr20Regular,
} from "@fluentui/react-icons";
import {
  type IButtonMenuOption,
  SelectView,
  StackV2,
} from "@spteck/react-controls-v2";

import { isEventsView, type EventsView } from "../utils/eventView";

export interface IEventsToolbarProps {
  action: React.ReactNode;
  calendarViewLabel: string;
  eventsViewLabel: string;
  onViewChange: (view: EventsView) => void;
  selectedView: EventsView;
  viewLabel: string;
}

export function EventsToolbar(
  props: IEventsToolbarProps,
): React.ReactElement {
  const options = React.useMemo<IButtonMenuOption[]>(
    () => [
      {
        icon: <TextBulletListLtr20Regular />,
        key: "events",
        text: props.eventsViewLabel,
      },
      {
        icon: <CalendarMonth20Regular />,
        key: "calendar",
        text: props.calendarViewLabel,
      },
    ],
    [props.calendarViewLabel, props.eventsViewLabel],
  );

  const handleViewChange = React.useCallback(
    (value: string): void => {
      if (isEventsView(value)) {
        props.onViewChange(value);
      }
    },
    [props.onViewChange],
  );

  return (
    <StackV2
      alignItems="flex-end"
      direction="horizontal"
      gap="m"
      justifyContent="space-between"
      width="100%"
    >
      <SelectView
        defaultKey={props.selectedView}

        minWidth={140}
        onChange={handleViewChange}
        options={options}
      />
      {props.action}
    </StackV2>
  );
}
