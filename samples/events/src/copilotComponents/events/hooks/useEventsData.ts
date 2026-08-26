import * as React from "react";
import type { MSGraphClientFactory } from "@microsoft/sp-http";

import type { IEventsCopilotComponentProperties } from "../EventsCopilotComponentProperties";
import type { IEventQueryProperties } from "../utils/eventQuery";
import {
  fetchSharePointEventPage,
  type ISharePointEventPage,
} from "../utils/graphEvents";
import { mapEventToFeedItem, type IEventFeedItem } from "../utils/mappers";

const GRAPH_CLIENT_VERSION = "3";
const DEFAULT_ERROR_MESSAGE = "Failed to load events.";

export interface IUseEventsDataResult {
  items: IEventFeedItem[];
  error: string | undefined;
  isLoading: boolean;
  hasMore: boolean;
  loadMore: () => Promise<void>;
}

interface IEventLoadState {
  requestKey: string;
  items: IEventFeedItem[];
  error: string | undefined;
  isLoading: boolean;
  hasMore: boolean;
}

interface ILoadedEventPage {
  items: IEventFeedItem[];
  nextOffset: number;
  hasMore: boolean;
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : DEFAULT_ERROR_MESSAGE;
}

function getEventKey(item: IEventFeedItem): string {
  return item.linkUrl ?? `${item.id}:${item.startDate}`;
}

function mergeEventItems(
  currentItems: IEventFeedItem[],
  page: ISharePointEventPage,
): IEventFeedItem[] {
  const seenKeys = new Set<string>(currentItems.map(getEventKey));
  const uniquePageItems = page.events
    .map(mapEventToFeedItem)
    .filter((item) => {
      const eventKey = getEventKey(item);

      if (seenKeys.has(eventKey)) {
        return false;
      }

      seenKeys.add(eventKey);
      return true;
    });

  return [...currentItems, ...uniquePageItems]
    .sort(
      (left, right) =>
        Date.parse(left.startDate) - Date.parse(right.startDate),
    )
    .slice(0, page.maxEvents);
}

export function useEventsData(
  graphClientFactory: MSGraphClientFactory,
  properties: IEventsCopilotComponentProperties,
): IUseEventsDataResult {
  const {
    endDateTime,
    maxEvents,
    searchQuery,
    siteUrl,
    startDateTime,
  } = properties;
  const queryProperties = React.useMemo<IEventQueryProperties>(
    () => ({
      endDateTime,
      maxEvents,
      searchQuery,
      siteUrl,
      startDateTime,
    }),
    [endDateTime, maxEvents, searchQuery, siteUrl, startDateTime],
  );
  const requestKey = React.useMemo(
    () => JSON.stringify(queryProperties),
    [queryProperties],
  );
  const [state, setState] = React.useState<IEventLoadState>(() => ({
    requestKey,
    items: [],
    error: undefined,
    isLoading: true,
    hasMore: true,
  }));
  const activeRequestKeyRef = React.useRef<string | undefined>();
  const loadingRequestKeyRef = React.useRef<string | undefined>();
  const nextOffsetRef = React.useRef(0);
  const hasMoreRef = React.useRef(true);
  const itemsRef = React.useRef<IEventFeedItem[]>([]);

  const commitLoadedPage = React.useCallback(
    (loadedPage: ILoadedEventPage): void => {
      itemsRef.current = loadedPage.items;
      nextOffsetRef.current = loadedPage.nextOffset;
      hasMoreRef.current = loadedPage.hasMore;
      setState({
        requestKey,
        items: loadedPage.items,
        error: undefined,
        isLoading: false,
        hasMore: loadedPage.hasMore,
      });
    },
    [requestKey],
  );

  const loadPage = React.useCallback(
    async (from: number): Promise<ISharePointEventPage> => {
      const graphClient =
        await graphClientFactory.getClient(GRAPH_CLIENT_VERSION);

      return fetchSharePointEventPage(graphClient, queryProperties, from);
    },
    [graphClientFactory, queryProperties],
  );

  const loadUntilItemsChange = React.useCallback(
    async (
      currentItems: IEventFeedItem[],
      initialOffset: number,
    ): Promise<ILoadedEventPage> => {
      let nextItems = currentItems;
      let nextOffset = initialOffset;
      let hasMore = true;

      do {
        const page = await loadPage(nextOffset);
        nextItems = mergeEventItems(nextItems, page);
        nextOffset = page.nextOffset;
        hasMore = page.hasMore && nextItems.length < page.maxEvents;
      } while (nextItems.length === currentItems.length && hasMore);

      return { items: nextItems, nextOffset, hasMore };
    },
    [loadPage],
  );

  const loadMore = React.useCallback(async (): Promise<void> => {
    if (
      activeRequestKeyRef.current !== requestKey ||
      loadingRequestKeyRef.current === requestKey ||
      !hasMoreRef.current
    ) {
      return;
    }

    loadingRequestKeyRef.current = requestKey;
    setState((currentState) =>
      currentState.requestKey === requestKey
        ? { ...currentState, error: undefined, isLoading: true }
        : currentState,
    );

    try {
      const loadedPage = await loadUntilItemsChange(
        itemsRef.current,
        nextOffsetRef.current,
      );

      if (activeRequestKeyRef.current !== requestKey) {
        return;
      }

      commitLoadedPage(loadedPage);
    } catch (loadError) {
      if (activeRequestKeyRef.current === requestKey) {
        setState((currentState) =>
          currentState.requestKey === requestKey
            ? {
                ...currentState,
                error: getErrorMessage(loadError),
                isLoading: false,
              }
            : currentState,
        );
        console.error("[useEventsData] Failed to load more events:", loadError);
      }
    } finally {
      if (loadingRequestKeyRef.current === requestKey) {
        loadingRequestKeyRef.current = undefined;
      }
    }
  }, [commitLoadedPage, loadUntilItemsChange, requestKey]);

  React.useEffect(() => {
    let disposed = false;
    activeRequestKeyRef.current = requestKey;
    loadingRequestKeyRef.current = undefined;
    nextOffsetRef.current = 0;
    hasMoreRef.current = true;
    itemsRef.current = [];

    setState({
      requestKey,
      items: [],
      error: undefined,
      isLoading: true,
      hasMore: true,
    });

    const loadInitialPage = async (): Promise<void> => {
      try {
        const loadedPage = await loadUntilItemsChange([], 0);

        if (disposed || activeRequestKeyRef.current !== requestKey) {
          return;
        }

        commitLoadedPage(loadedPage);
      } catch (loadError) {
        if (disposed || activeRequestKeyRef.current !== requestKey) {
          return;
        }

        hasMoreRef.current = false;
        setState({
          requestKey,
          items: [],
          error: getErrorMessage(loadError),
          isLoading: false,
          hasMore: false,
        });
        console.error("[useEventsData] Failed to fetch events:", loadError);
      }
    };

    loadInitialPage().catch((): undefined => undefined);

    return () => {
      disposed = true;

      if (activeRequestKeyRef.current === requestKey) {
        activeRequestKeyRef.current = undefined;
      }

      if (loadingRequestKeyRef.current === requestKey) {
        loadingRequestKeyRef.current = undefined;
      }
    };
  }, [commitLoadedPage, loadUntilItemsChange, requestKey]);

  if (state.requestKey !== requestKey) {
    return {
      items: [],
      error: undefined,
      isLoading: true,
      hasMore: true,
      loadMore,
    };
  }

  return {
    items: state.items,
    error: state.error,
    isLoading: state.isLoading,
    hasMore: state.hasMore,
    loadMore,
  };
}
