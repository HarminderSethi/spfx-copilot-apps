import * as React from "react";

const LOAD_MORE_SCROLL_THRESHOLD = 200;

export const EVENT_FEED_SCROLL_AREA_CLASS = "events-feed-scroll-area";

export interface IUseInfiniteEventFeedOptions {
  enabled: boolean;
  error: string | undefined;
  hasMore: boolean;
  isLoading: boolean;
  itemCount: number;
  loadMore: () => Promise<void>;
  scrollAreaHeight: string | undefined;
}

export function useInfiniteEventFeed(
  options: IUseInfiniteEventFeedOptions,
): React.RefObject<HTMLDivElement> {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (
      !options.enabled ||
      options.error !== undefined ||
      !options.hasMore ||
      options.isLoading ||
      !options.scrollAreaHeight
    ) {
      return undefined;
    }

    const scrollArea = containerRef.current?.querySelector<HTMLElement>(
      `.${EVENT_FEED_SCROLL_AREA_CLASS}`,
    );

    if (!scrollArea) {
      return undefined;
    }

    const requestMoreIfNeeded = (): void => {
      const remainingScrollDistance =
        scrollArea.scrollHeight -
        scrollArea.scrollTop -
        scrollArea.clientHeight;

      if (remainingScrollDistance <= LOAD_MORE_SCROLL_THRESHOLD) {
        options.loadMore().catch((loadError: unknown) => {
          console.error(
            "[useInfiniteEventFeed] Failed to load more events:",
            loadError,
          );
        });
      }
    };

    requestMoreIfNeeded();
    scrollArea.addEventListener("scroll", requestMoreIfNeeded, {
      passive: true,
    });

    return () => {
      scrollArea.removeEventListener("scroll", requestMoreIfNeeded);
    };
  }, [
    options.enabled,
    options.error,
    options.hasMore,
    options.isLoading,
    options.itemCount,
    options.loadMore,
    options.scrollAreaHeight,
  ]);

  return containerRef;
}
