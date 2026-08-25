import * as React from "react";

import type { IPhotosCopilotComponentProperties } from "../PhotosCopilotComponentProperties";
import type { IPhotosGalleryPhoto } from "../components/IPhotosProps";
import type { ISharePointPhoto } from "../utils/graphPhotos";

const GRAPH_ERROR_MESSAGE: string =
  "Microsoft Graph could not complete the SharePoint photo search.";

export interface IUseUtilsResult {
  getPhotoDescription: (
    properties: IPhotosCopilotComponentProperties,
  ) => string;
  getErrorMessage: (error: unknown) => string;
  mapPhotoResults: (
    results: readonly ISharePointPhoto[],
  ) => readonly IPhotosGalleryPhoto[];
}

export function useUtils(): IUseUtilsResult {
  const getPathLabel = React.useCallback(
    (value: string | undefined): string | undefined => {
      const text: string = value?.trim() || "";

      if (!text) {
        return undefined;
      }

      try {
        const url: URL = new URL(text);
        const segments: string[] = url.pathname
          .split("/")
          .filter((segment: string) => segment.length > 0)
          .map((segment: string) => decodeURIComponent(segment));

        return segments[segments.length - 1] || url.hostname;
      } catch {
        return text;
      }
    },
    [],
  );

  const getPhotoDescription = React.useCallback(
    (properties: IPhotosCopilotComponentProperties): string => {
      const searchQuery: string = properties.searchQuery?.trim() || "";
      const scope: string | undefined =
        properties.libraryName?.trim() ||
        getPathLabel(
          properties.folderPath || properties.libraryUrl || properties.siteUrl,
        );

      if (searchQuery && scope) {
        return `Photos matching “${searchQuery}” in ${scope}`;
      }

      if (searchQuery) {
        return `Photos matching “${searchQuery}”`;
      }

      if (scope) {
        return `Photos from ${scope}`;
      }

      return "SharePoint photo results";
    },
    [getPathLabel],
  );

  const getErrorMessage = React.useCallback((error: unknown): string => {
    if (error instanceof Error && error.message) {
      return error.message;
    }

    return GRAPH_ERROR_MESSAGE;
  }, []);

  const mapPhotoResults = React.useCallback(
    (results: readonly ISharePointPhoto[]): readonly IPhotosGalleryPhoto[] =>
      results.map((photo) => ({
        key: photo.id,
        src: photo.src,
        fallbackSrc: photo.fallbackSrc,
        width: photo.width,
        height: photo.height,
        alt: photo.name,
        title: photo.name,
        label: photo.name,
      })),
    [],
  );

  return React.useMemo(
    () => ({
      getPhotoDescription,
      getErrorMessage,
      mapPhotoResults,
    }),
    [getPhotoDescription, getErrorMessage, mapPhotoResults],
  );
}
