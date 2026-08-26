import * as React from "react";
import {
  Skeleton,
  SkeletonItem,
  tokens,
} from "@fluentui/react-components";
import {
  type EventFeedLayout,
  StackV2,
} from "@spteck/react-controls-v2";

const AGENDA_GROUP_EVENT_COUNTS: readonly number[] = [2, 1];
const FEATURE_CARD_COUNT = 6;
const GRID_CARD_COUNT = 3;
const LIST_ROW_COUNT = 3;
const MINI_LIST_ROW_COUNT = 4;
const CALENDAR_WEEK_COUNT = 6;
const CALENDAR_DAYS_PER_WEEK = 7;

const FULL_WIDTH = "100%";
const AGENDA_MEDIA_WIDTH = "20%";
const FEATURE_CARD_WIDTH = "28%";
const FEATURE_PRIMARY_CARD_WIDTH = "40%";
const GRID_CARD_WIDTH = "30%";

const flexibleContentStyle: React.CSSProperties = {
  flex: 1,
  minWidth: 0,
};

const agendaGroupStyle: React.CSSProperties = {
  border: `1px solid ${tokens.colorNeutralStroke2}`,
  borderRadius: tokens.borderRadiusMedium,
  overflow: "hidden",
};

const agendaMediaStyle: React.CSSProperties = {
  flexShrink: 0,
  width: AGENDA_MEDIA_WIDTH,
};

export type EventsSkeletonLayout = EventFeedLayout | "calendar";

export interface IEventsSkeletonProps {
  label: string;
  layout: EventsSkeletonLayout;
}

interface IAgendaEventRowSkeletonProps {
  hasDivider: boolean;
}

interface IFeatureCardSkeletonProps {
  primary?: boolean;
}

function EventDetailsSkeleton(): React.ReactElement {
  return (
    <StackV2 gap="s" width={FULL_WIDTH} style={flexibleContentStyle}>
      <SkeletonItem size={16} style={{ width: "22%" }} />
      <SkeletonItem size={20} style={{ width: "62%" }} />
      <StackV2 gap="xs" paddingTop="s" width={FULL_WIDTH}>
        <SkeletonItem size={14} style={{ width: "48%" }} />
        <SkeletonItem size={14} style={{ width: "38%" }} />
        <SkeletonItem size={14} style={{ width: "30%" }} />
      </StackV2>
    </StackV2>
  );
}

function AgendaGroupHeaderSkeleton(): React.ReactElement {
  return (
    <StackV2
      direction="horizontal"
      alignItems="center"
      gap="m"
      paddingLeft="m"
      paddingTop="xs"
      paddingBottom="xs"
      width={FULL_WIDTH}
    >
      <SkeletonItem shape="circle" size={36} />
      <StackV2 gap="xs" width={FULL_WIDTH} style={flexibleContentStyle}>
        <StackV2 direction="horizontal" alignItems="center" gap="s">
          <SkeletonItem size={20} style={{ width: "24%" }} />
          <SkeletonItem size={16} style={{ width: "8%" }} />
        </StackV2>
        <SkeletonItem size={12} style={{ width: "7%" }} />
      </StackV2>
    </StackV2>
  );
}

function AgendaEventRowSkeleton(
  props: IAgendaEventRowSkeletonProps,
): React.ReactElement {
  return (
    <StackV2
      direction="horizontal"
      alignItems="center"
      gap="m"
      width={FULL_WIDTH}
      style={{
        borderBottom: props.hasDivider
          ? `1px solid ${tokens.colorNeutralStroke2}`
          : undefined,
      }}
    >
      <SkeletonItem
        shape="rectangle"
        size={128}
        style={agendaMediaStyle}
      />
      <EventDetailsSkeleton />
      <StackV2 paddingRight="m">
        <SkeletonItem shape="circle" size={36} />
      </StackV2>
    </StackV2>
  );
}

function AgendaGroupSkeleton(props: {
  eventCount: number;
}): React.ReactElement {
  return (
    <StackV2 gap="s" width={FULL_WIDTH}>
      <AgendaGroupHeaderSkeleton />
      <StackV2 width={FULL_WIDTH} style={agendaGroupStyle}>
        {Array.from({ length: props.eventCount }, (_, index) => (
          <AgendaEventRowSkeleton
            key={index}
            hasDivider={index < props.eventCount - 1}
          />
        ))}
      </StackV2>
    </StackV2>
  );
}

function AgendaSkeleton(): React.ReactElement {
  return (
    <StackV2 gap="xl" width={FULL_WIDTH}>
      {AGENDA_GROUP_EVENT_COUNTS.map((eventCount, index) => (
        <AgendaGroupSkeleton key={index} eventCount={eventCount} />
      ))}
    </StackV2>
  );
}

function FeatureCardSkeleton(
  props: IFeatureCardSkeletonProps,
): React.ReactElement {
  return (
    <StackV2
      gap="s"
      width={props.primary ? FEATURE_PRIMARY_CARD_WIDTH : FEATURE_CARD_WIDTH}
      style={flexibleContentStyle}
    >
      <SkeletonItem
        shape="rectangle"
        size={128}
        style={{ width: FULL_WIDTH }}
      />
      <SkeletonItem size={16} style={{ width: "78%" }} />
      <SkeletonItem size={14} style={{ width: "58%" }} />
      <SkeletonItem size={12} style={{ width: "88%" }} />
    </StackV2>
  );
}

function FeatureSkeleton(): React.ReactElement {
  return (
    <StackV2 gap="m" width={FULL_WIDTH}>
      <StackV2 direction="horizontal" gap="m" width={FULL_WIDTH}>
        {Array.from({ length: FEATURE_CARD_COUNT / 2 }, (_, index) => (
          <FeatureCardSkeleton key={index} primary={index === 0} />
        ))}
      </StackV2>
      <StackV2 direction="horizontal" gap="m" width={FULL_WIDTH}>
        {Array.from({ length: FEATURE_CARD_COUNT / 2 }, (_, index) => (
          <FeatureCardSkeleton key={index} primary={index === 2} />
        ))}
      </StackV2>
    </StackV2>
  );
}

function CompactEventRowSkeleton(props: {
  mediaSize: 56 | 128;
}): React.ReactElement {
  return (
    <StackV2
      direction="horizontal"
      alignItems="center"
      gap="m"
      width={FULL_WIDTH}
    >
      <SkeletonItem shape="square" size={props.mediaSize} />
      <StackV2 gap="s" width={FULL_WIDTH} style={flexibleContentStyle}>
        <SkeletonItem size={16} style={{ width: "64%" }} />
        <SkeletonItem size={12} style={{ width: "42%" }} />
        {props.mediaSize === 128 && (
          <SkeletonItem size={12} style={{ width: "82%" }} />
        )}
      </StackV2>
    </StackV2>
  );
}

function ListSkeleton(): React.ReactElement {
  return (
    <StackV2 gap="s" width={FULL_WIDTH}>
      {Array.from({ length: LIST_ROW_COUNT }, (_, index) => (
        <CompactEventRowSkeleton key={index} mediaSize={128} />
      ))}
    </StackV2>
  );
}

function MiniListSkeleton(): React.ReactElement {
  return (
    <StackV2 gap="s" width={FULL_WIDTH}>
      {Array.from({ length: MINI_LIST_ROW_COUNT }, (_, index) => (
        <CompactEventRowSkeleton key={index} mediaSize={56} />
      ))}
    </StackV2>
  );
}

function GridCardSkeleton(): React.ReactElement {
  return (
    <StackV2 gap="s" width={GRID_CARD_WIDTH} style={flexibleContentStyle}>
      <SkeletonItem
        shape="rectangle"
        size={128}
        style={{ width: FULL_WIDTH }}
      />
      <SkeletonItem size={16} style={{ width: "76%" }} />
      <SkeletonItem size={12} style={{ width: "58%" }} />
      <SkeletonItem size={12} style={{ width: "88%" }} />
    </StackV2>
  );
}

function GridSkeleton(): React.ReactElement {
  return (
    <StackV2 direction="horizontal" gap="m" width={FULL_WIDTH} wrap>
      {Array.from({ length: GRID_CARD_COUNT }, (_, index) => (
        <GridCardSkeleton key={index} />
      ))}
    </StackV2>
  );
}

function CalendarSkeleton(): React.ReactElement {
  return (
    <StackV2 gap="m" width={FULL_WIDTH}>
      <StackV2
        alignItems="center"
        direction="horizontal"
        justifyContent="space-between"
        width={FULL_WIDTH}
      >
        <SkeletonItem size={32} style={{ width: "18%" }} />
        <SkeletonItem size={32} style={{ width: "24%" }} />
        <SkeletonItem size={32} style={{ width: "18%" }} />
      </StackV2>
      <StackV2 gap="xs" width={FULL_WIDTH}>
        {Array.from({ length: CALENDAR_WEEK_COUNT }, (_, weekIndex) => (
          <StackV2
            direction="horizontal"
            gap="xs"
            key={weekIndex}
            width={FULL_WIDTH}
          >
            {Array.from(
              { length: CALENDAR_DAYS_PER_WEEK },
              (_, dayIndex) => (
                <SkeletonItem
                  key={dayIndex}
                  shape="rectangle"
                  size={48}
                  style={flexibleContentStyle}
                />
              ),
            )}
          </StackV2>
        ))}
      </StackV2>
      <ListSkeleton />
    </StackV2>
  );
}

function SkeletonLayout(props: {
  layout: EventsSkeletonLayout;
}): React.ReactElement {
  switch (props.layout) {
    case "calendar":
      return <CalendarSkeleton />;
    case "agenda":
      return <AgendaSkeleton />;
    case "feature":
      return <FeatureSkeleton />;
    case "grid":
      return <GridSkeleton />;
    case "minilist":
      return <MiniListSkeleton />;
    default:
      return <ListSkeleton />;
  }
}

export function EventsSkeleton(
  props: IEventsSkeletonProps,
): React.ReactElement {
  return (
    <StackV2
      role="status"
      aria-label={props.label}
      aria-busy="true"
      aria-live="polite"
      width={FULL_WIDTH}
    >
      <Skeleton animation="wave">
        <SkeletonLayout layout={props.layout} />
      </Skeleton>
    </StackV2>
  );
}
