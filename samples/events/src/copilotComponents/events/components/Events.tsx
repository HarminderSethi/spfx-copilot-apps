import * as React from "react";
import type { SPCopilotDisplayMode } from "@microsoft/sp-copilot-component";
import {
  FluentProvider,
  IdPrefixProvider,
  PortalMountNodeProvider,
  webDarkTheme,
  webLightTheme,
} from "@fluentui/react-components";
import {
  LocalizationProvider,
  type EventFeedLayout,
} from "@spteck/react-controls-v2";

import { useEventFeedScrollAreaHeight } from "../hooks/useEventFeedScrollAreaHeight";
import { useEventsData } from "../hooks/useEventsData";
import { useInlineCopilotContentSize } from "../hooks/useInlineCopilotContentSize";
import { useLockDocumentViewport } from "../hooks/useLockDocumentViewport";
import { resolveExpandedEventLayout } from "../utils/eventLayout";
import type { EventsView } from "../utils/eventView";
import { EventsContent } from "./EventsContent";
import { EventsDisplayModeButton } from "./EventsDisplayModeButton";
import { EventsToolbar } from "./EventsToolbar";
import type { IEventsProps } from "./IEventsProps";

const INLINE_EVENT_LIMIT = 4;

function supportsDisplayMode(
  availableDisplayModes: readonly SPCopilotDisplayMode[] | undefined,
  displayMode: SPCopilotDisplayMode,
): boolean {
  return (
    availableDisplayModes === undefined ||
    availableDisplayModes.indexOf(displayMode) >= 0
  );
}

export default function Events(props: IEventsProps): React.ReactElement {
  const {
    graphClientFactory,
    hostContext,
    onRequestDisplayMode,
    onRequestSizeChange,
    properties,
    strings,
    targetDocument,
    dateLocale,
    firstDayOfWeek,
    timeZone,
    uiLocale,
  } = props;
  const { items, error, isLoading, hasMore, loadMore } = useEventsData(
    graphClientFactory,
    properties,
  );
  const [selectedView, setSelectedView] =
    React.useState<EventsView>("events");
  const isFullscreen = hostContext.displayMode === "fullscreen";
  const layout: EventFeedLayout = isFullscreen
    ? resolveExpandedEventLayout(properties)
    : "agenda";
  const visibleItems = selectedView === "calendar" || isFullscreen
    ? items
    : items.slice(0, INLINE_EVENT_LIMIT);
  const scrollAreaHeight = useEventFeedScrollAreaHeight(
    targetDocument,
    isFullscreen,
  );
  const contentRef = useInlineCopilotContentSize({
    enabled: !isFullscreen,
    measurementKey: selectedView,
    onRequestSizeChange,
    targetDocument,
  });

  useLockDocumentViewport(targetDocument, isFullscreen);

  React.useEffect(() => {
    if (
      selectedView !== "calendar" ||
      error !== undefined ||
      isLoading ||
      !hasMore
    ) {
      return;
    }

    loadMore().catch((loadError: unknown) => {
      console.error(
        "[Events] Failed to load calendar events:",
        loadError,
      );
    });
  }, [error, hasMore, isLoading, loadMore, selectedView]);

  const requestDisplayMode = React.useCallback(
    async (displayMode: SPCopilotDisplayMode): Promise<void> => {
      try {
        await onRequestDisplayMode(displayMode);
      } catch (displayModeError) {
        console.error(
          `[Events] Failed to request ${displayMode} mode:`,
          displayModeError,
        );
      }
    },
    [onRequestDisplayMode],
  );

  const nextDisplayMode: SPCopilotDisplayMode = isFullscreen
    ? "inline"
    : "fullscreen";
  const displayModeAction = supportsDisplayMode(
    hostContext.availableDisplayModes,
    nextDisplayMode,
  ) ? (
    <EventsDisplayModeButton
      label={
        isFullscreen
          ? strings.CompactButtonLabel
          : strings.ExpandButtonLabel
      }
      mode={nextDisplayMode}
      onRequestDisplayMode={requestDisplayMode}
    />
  ) : undefined;
  const theme = hostContext.theme === "dark" ? webDarkTheme : webLightTheme;
  const portalMountNode = targetDocument?.body;

  return (
    <LocalizationProvider locale={uiLocale}>
      <PortalMountNodeProvider value={portalMountNode}>
        <IdPrefixProvider value="sharepoint-events-">
          <FluentProvider
            applyStylesToPortals={true}
            targetDocument={targetDocument}
            theme={theme}
            style={{
              height: isFullscreen ? scrollAreaHeight : "fit-content",
              overflow: "hidden",
            }}
          >
            <EventsContent
              dateLocale={dateLocale}
              emptyLabel={strings.EmptyTitle}
              error={error}
              errorLabel={strings.ErrorTitle}
              hasMore={
                selectedView === "events" && isFullscreen && hasMore
              }
              infinite={selectedView === "events" && isFullscreen}
              isFullscreen={isFullscreen}
              isLoading={isLoading}
              firstDayOfWeek={firstDayOfWeek}
              items={visibleItems}
              layout={layout}
              loadingLabel={strings.LoadingLabel}
              loadMore={loadMore}
              rootRef={contentRef}
              scrollAreaHeight={
                isFullscreen ? scrollAreaHeight : "fit-content"
              }
              selectedView={selectedView}
              showDescription={properties.showDescription ?? false}
              showLocation={properties.showLocation ?? true}
              showOrganizer={properties.showOrganizer ?? true}
              targetDocument={targetDocument}
              timeZone={timeZone}
              toolbar={
                <EventsToolbar
                  action={displayModeAction}
                  calendarViewLabel={strings.CalendarViewLabel}
                  eventsViewLabel={strings.EventsViewLabel}
                  onViewChange={setSelectedView}
                  selectedView={selectedView}
                  viewLabel={strings.ViewLabel}
                />
              }
            />
          </FluentProvider>
        </IdPrefixProvider>
      </PortalMountNodeProvider>
    </LocalizationProvider>
  );
}
