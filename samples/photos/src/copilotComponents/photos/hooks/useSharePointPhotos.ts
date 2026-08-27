import * as React from "react";
import { useIndexedDBCache } from "@spteck/m365-hooks";
import type { MSGraphClientFactory } from "@microsoft/sp-http";

import type { IPhotosCopilotComponentProperties } from "../PhotosCopilotComponentProperties";
import type { IPhotosGalleryPhoto } from "../components/IPhotosProps";
import {
  fetchSharePointPhotoPage,
  type ISharePointPhotoPage,
} from "../utils/graphPhotos";
import { useUtils } from "./useUtils";

const GRAPH_CLIENT_VERSION: "3" = "3";
const PHOTO_CACHE_MAX_AGE: number = 10 * 60 * 1000;
const PHOTO_CACHE_DATABASE: string = "spfx-copilot-photos-cache";
// v5 invalidates pages cached before HEIC/HEIF filtering was added.
const PHOTO_CACHE_KEY_PREFIX: string = "sharepoint-photos:v5:";

export type IPhotoSearchProperties = Omit<
  IPhotosCopilotComponentProperties,
  "layout"
>;

export interface IUseSharePointPhotosOptions {
  graphClientFactory: MSGraphClientFactory;
  properties: IPhotoSearchProperties;
}

export interface IUseSharePointPhotosResult {
  photos: readonly IPhotosGalleryPhoto[];
  loading: boolean;
  error?: Error;
  hasMore: boolean;
  loadMore: () => Promise<void>;
}

interface IPhotoLoadState {
  requestKey: string;
  photos: readonly IPhotosGalleryPhoto[];
  loading: boolean;
  error?: Error;
  hasMore: boolean;
}

function applyPagePosition(
  nextOffsetRef: React.MutableRefObject<number>,
  hasMoreRef: React.MutableRefObject<boolean>,
  page: ISharePointPhotoPage,
): void {
  nextOffsetRef.current = page.nextOffset;
  hasMoreRef.current = page.hasMore;
}

export function useSharePointPhotos({
  graphClientFactory,
  properties,
}: IUseSharePointPhotosOptions): IUseSharePointPhotosResult {
  const { getErrorMessage, mapPhotoResults } = useUtils();
  const photoCache = useIndexedDBCache<ISharePointPhotoPage>(
    PHOTO_CACHE_MAX_AGE,
    PHOTO_CACHE_DATABASE,
  );
  const photoCacheRef = React.useRef(photoCache);
  photoCacheRef.current = photoCache;
  const {
    searchQuery,
    siteUrl,
    libraryName,
    libraryUrl,
    folderPath,
    includeOneDrivePhotos,
    startDateTime,
    endDateTime,
    maxPhotos,
    sortBy,
  } = properties;

  const queryProperties: IPhotoSearchProperties = React.useMemo(
    () => ({
      searchQuery,
      siteUrl,
      libraryName,
      libraryUrl,
      folderPath,
      includeOneDrivePhotos,
      startDateTime,
      endDateTime,
      maxPhotos,
      sortBy,
    }),
    [
      searchQuery,
      siteUrl,
      libraryName,
      libraryUrl,
      folderPath,
      includeOneDrivePhotos,
      startDateTime,
      endDateTime,
      maxPhotos,
      sortBy,
    ],
  );

  const requestKey: string = React.useMemo(
    () => JSON.stringify(queryProperties),
    [queryProperties],
  );
  const cacheKey: string = `${PHOTO_CACHE_KEY_PREFIX}${requestKey}`;
  const [state, setState] = React.useState<IPhotoLoadState>(() => ({
    requestKey,
    photos: [],
    loading: true,
    hasMore: true,
  }));
  const activeRequestKeyRef = React.useRef<string | undefined>();
  const loadingRequestKeyRef = React.useRef<string | undefined>();
  const nextOffsetRef = React.useRef<number>(0);
  const hasMoreRef = React.useRef<boolean>(true);

  const loadPage = React.useCallback(
    async (from: number): Promise<ISharePointPhotoPage> => {
      const pageCacheKey: string = `${cacheKey}:${from}`;

      try {
        const cachedPage: ISharePointPhotoPage | undefined =
          await photoCacheRef.current.getData(pageCacheKey);

        if (cachedPage) {
          return cachedPage;
        }
      } catch (cacheError) {
        console.warn("SharePoint photo page cache read skipped.", cacheError);
      }

      const graphClient =
        await graphClientFactory.getClient(GRAPH_CLIENT_VERSION);
      const page: ISharePointPhotoPage = await fetchSharePointPhotoPage(
        graphClient,
        queryProperties,
        from,
      );

      try {
        await photoCacheRef.current.setData(pageCacheKey, page);
      } catch (cacheError) {
        console.warn("SharePoint photo page cache write skipped.", cacheError);
      }

      return page;
    },
    [cacheKey, graphClientFactory, queryProperties],
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
    setState((previous: IPhotoLoadState) =>
      previous.requestKey === requestKey
        ? { ...previous, loading: true, error: undefined }
        : previous,
    );

    try {
      const page: ISharePointPhotoPage = await loadPage(nextOffsetRef.current);

      if (activeRequestKeyRef.current !== requestKey) {
        return;
      }

      const nextPhotos: readonly IPhotosGalleryPhoto[] = mapPhotoResults(
        page.photos,
      );

      setState((previous: IPhotoLoadState) => {
        if (previous.requestKey !== requestKey) {
          return previous;
        }

        const seenPhotoKeys: Set<string> = new Set<string>(
          previous.photos.map(
            (photo: IPhotosGalleryPhoto) => photo.key || photo.src,
          ),
        );
        const uniqueNextPhotos: IPhotosGalleryPhoto[] = nextPhotos.filter(
          (photo: IPhotosGalleryPhoto) => {
            const photoKey: string = photo.key || photo.src;

            if (seenPhotoKeys.has(photoKey)) {
              return false;
            }

            seenPhotoKeys.add(photoKey);
            return true;
          },
        );

        return {
          ...previous,
          photos: [...previous.photos, ...uniqueNextPhotos],
          loading: false,
          error: undefined,
          hasMore: page.hasMore,
        };
      });

      applyPagePosition(nextOffsetRef, hasMoreRef, page);
    } catch (error) {
      if (activeRequestKeyRef.current === requestKey) {
        setState((previous: IPhotoLoadState) =>
          previous.requestKey === requestKey
            ? {
                ...previous,
                loading: false,
                error: new Error(getErrorMessage(error)),
              }
            : previous,
        );
        console.error("SharePoint photo page load failed.", error);
      }
    } finally {
      if (loadingRequestKeyRef.current === requestKey) {
        loadingRequestKeyRef.current = undefined;
      }
    }
  }, [getErrorMessage, loadPage, mapPhotoResults, requestKey]);

  React.useEffect(() => {
    let disposed: boolean = false;
    activeRequestKeyRef.current = requestKey;
    loadingRequestKeyRef.current = undefined;
    nextOffsetRef.current = 0;
    hasMoreRef.current = true;

    setState({
      requestKey,
      photos: [],
      loading: true,
      hasMore: true,
    });

    const loadInitialPage = async (): Promise<void> => {
      try {
        const page: ISharePointPhotoPage = await loadPage(0);

        if (disposed || activeRequestKeyRef.current !== requestKey) {
          return;
        }

        applyPagePosition(nextOffsetRef, hasMoreRef, page);
        setState({
          requestKey,
          photos: mapPhotoResults(page.photos),
          loading: false,
          hasMore: page.hasMore,
        });
      } catch (error) {
        if (disposed || activeRequestKeyRef.current !== requestKey) {
          return;
        }

        hasMoreRef.current = false;
        setState({
          requestKey,
          photos: [],
          loading: false,
          error: new Error(getErrorMessage(error)),
          hasMore: false,
        });
        console.error("SharePoint photo search failed.", error);
      }
    };

    loadInitialPage().catch((): undefined => undefined);

    return (): void => {
      disposed = true;

      if (activeRequestKeyRef.current === requestKey) {
        activeRequestKeyRef.current = undefined;
      }

      if (loadingRequestKeyRef.current === requestKey) {
        loadingRequestKeyRef.current = undefined;
      }
    };
  }, [getErrorMessage, loadPage, mapPhotoResults, requestKey]);

  if (state.requestKey !== requestKey) {
    return {
      photos: [],
      loading: true,
      hasMore: true,
      loadMore,
    };
  }

  return {
    photos: state.photos,
    loading: state.loading,
    error: state.error,
    hasMore: state.hasMore,
    loadMore,
  };
}
