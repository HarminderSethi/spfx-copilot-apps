import * as React from "react";
import {
  Body1,
  Button,
  FluentProvider,
  IdPrefixProvider,
  PortalMountNodeProvider,
  Tooltip,
  webDarkTheme,
  webLightTheme,
} from "@fluentui/react-components";
import {
  ArrowExpand24Regular,
  ArrowMinimize24Regular,
} from "@fluentui/react-icons";
import {
  PhotoAlbum,
  type PhotoAlbumClickContext,
  type PhotoAlbumLayout,
  type PhotoAlbumRenderers,
} from "@spteck/react-controls-v2/photo-album";

import type { IPhotosGalleryPhoto, IPhotosProps } from "./IPhotosProps";
import { PhotoRowsSkeleton } from "./PhotoRowsSkeleton";
import { StackV2 } from "@spteck/react-controls-v2";
import { useLockDocumentViewport } from "../hooks/useLockDocumentViewport";
import { usePhotoAlbumScrollAreaHeight } from "../hooks/usePhotoAlbumScrollAreaHeight";
import { useSharePointPhotos } from "../hooks/useSharePointPhotos";
import { useStyles } from "../hooks/useStyles";
import { useUtils } from "../hooks/useUtils";

const INLINE_MAX_PHOTOS: number = 12;
const INLINE_CONTAINER_WIDTH: number = 640;
const FULLSCREEN_CONTAINER_WIDTH: number = 1200;

type PhotoAlbumImageRenderer = NonNullable<
  PhotoAlbumRenderers<IPhotosGalleryPhoto>["image"]
>;

export default function Photos(props: IPhotosProps): React.ReactElement {
  const {
    graphClientFactory,
    searchProperties,
    layout,
    hostContext,
    onRequestDisplayMode,
    targetDocument,
    strings,
  } = props;

  const { photos, loading, error, hasMore, loadMore } = useSharePointPhotos({
    graphClientFactory,
    properties: searchProperties,
  });
  const { getPhotoDescription } = useUtils();
  const description: string = getPhotoDescription(searchProperties);

  const styles = useStyles();
  const theme = hostContext.theme === "dark" ? webDarkTheme : webLightTheme;
  const isFullscreen: boolean = hostContext.displayMode === "fullscreen";
  useLockDocumentViewport(targetDocument, isFullscreen);
  const scrollAreaHeight: string | undefined =
    usePhotoAlbumScrollAreaHeight(targetDocument, isFullscreen);
  const visiblePhotos = isFullscreen
    ? photos
    : photos.slice(0, INLINE_MAX_PHOTOS);
  const remainingPhotos: number = Math.max(
    photos.length - visiblePhotos.length,
    0,
  );
  const effectiveLayout: PhotoAlbumLayout = layout;
  const [lightboxOpen, setLightboxOpen] = React.useState<boolean>(false);
  const [lightboxIndex, setLightboxIndex] = React.useState<number>(0);

  const handleExpand = React.useCallback(async (): Promise<void> => {
    await onRequestDisplayMode("fullscreen");
  }, [onRequestDisplayMode]);

  const handleCompact = React.useCallback(async (): Promise<void> => {
    await onRequestDisplayMode("inline");
  }, [onRequestDisplayMode]);

  const handlePhotoClick = React.useCallback(
    (context: PhotoAlbumClickContext): void => {
      setLightboxIndex(context.index);
      setLightboxOpen(true);
    },
    [],
  );

  const renderPhotoImage = React.useCallback<PhotoAlbumImageRenderer>(
    (imageProps, context) => {
      type ImageErrorEvent = Parameters<
        NonNullable<typeof imageProps.onError>
      >[0];

      const handleError = (event: ImageErrorEvent): void => {
        imageProps.onError?.(event);

        const image: HTMLImageElement = event.currentTarget;
        const fallbackSrc: string | undefined = context.photo.fallbackSrc;

        if (
          !fallbackSrc ||
          fallbackSrc === imageProps.src ||
          image.dataset.photoFallbackApplied === "true"
        ) {
          return;
        }

        image.dataset.photoFallbackApplied = "true";
        image.removeAttribute("srcset");
        image.src = fallbackSrc;
      };

      const nextImageProps = { ...imageProps, onError: handleError };

      // SPFx is pinned to React 17 while the reusable control is published
      // with React 18 declaration types. The DOM image contract is identical
      // at runtime, so keep this adapter at the package boundary.
      return React.createElement(
        "img",
        nextImageProps as unknown as React.ImgHTMLAttributes<HTMLImageElement>,
      ) as unknown as ReturnType<PhotoAlbumImageRenderer>;
    },
    [],
  );

  const portalMountNode: HTMLElement | undefined =
    targetDocument?.body || undefined;
  const expandLabel: string = `${strings.ExpandButtonLabel} ${strings.MorePhotosLabel.replace("{0}", String(remainingPhotos))}`;
  const showInitialLoading: boolean = loading && photos.length === 0;
  const showInitialError: boolean = Boolean(error && photos.length === 0);

  return (
    <PortalMountNodeProvider value={portalMountNode}>
      <IdPrefixProvider value="sharepoint-photos-">
        <FluentProvider
          theme={theme}
          applyStylesToPortals={true}
          targetDocument={targetDocument}
          style={
            isFullscreen
              ? {
                  boxSizing: "border-box",
                  width: "100%",
                  overflow: "hidden",
                }
              : undefined
          }
        >
          {showInitialLoading ? (
            <StackV2
              padding="m"
              className={styles.gallery}
              style={isFullscreen ? { minHeight: 0, overflow: "hidden" } : undefined}
            >
              <div className={styles.header}>
                <Body1 className={styles.description}>{description}</Body1>
              </div>
              <PhotoRowsSkeleton
                fullscreen={isFullscreen}
                ariaLabel={strings.LoadingTitle}
              />
            </StackV2>
          ) : showInitialError ? (
            <Body1>
              <strong>{strings.ErrorTitle}</strong> {error?.message}
            </Body1>
          ) : visiblePhotos.length === 0 ? (
            <Body1>{strings.EmptyTitle}</Body1>
          ) : (
            <StackV2
              padding="m"
              className={styles.gallery}
              style={isFullscreen ? { minHeight: 0, overflow: "hidden" } : { minHeight: 600 }}
            >
              <div className={styles.header}>
                <Body1 className={styles.description}>{description}</Body1>
                {isFullscreen ? (
                  <Tooltip
                    content={strings.CompactButtonLabel}
                    relationship="label"
                  >
                    <Button
                      className={styles.action}
                      appearance="subtle"
                      icon={<ArrowMinimize24Regular />}
                      aria-label={strings.CompactButtonLabel}
                      onClick={handleCompact}
                    />
                  </Tooltip>
                ) : remainingPhotos > 0 ? (
                  <Tooltip content={expandLabel} relationship="label">
                    <Button
                      className={styles.action}
                      appearance="subtle"
                      icon={<ArrowExpand24Regular />}
                      aria-label={expandLabel}
                      onClick={handleExpand}
                    />
                  </Tooltip>
                ) : null}
              </div>

              <PhotoAlbum
                photos={visiblePhotos}
                layout={effectiveLayout}
                infinite={isFullscreen}
                infiniteScrollMode="container"
                scrollAreaHeight={scrollAreaHeight}
                hasMore={isFullscreen ? hasMore : undefined}
                loadMore={loadMore}
                loading={loading}
                error={error}
                loadingContent={
                  <PhotoRowsSkeleton
                    fullscreen={true}
                    ariaLabel={strings.LoadingTitle}
                  />
                }
                errorContent={
                  <Body1>
                    <strong>{strings.ErrorTitle}</strong> {error?.message}
                  </Body1>
                }
                scrollAreaAriaLabel={strings.AlbumAriaLabel}
                lightbox={true}
                open={lightboxOpen}
                index={lightboxIndex}
                onOpenChange={setLightboxOpen}
                onIndexChange={setLightboxIndex}
                onClick={handlePhotoClick}
                render={{ image: renderPhotoImage }}
                defaultContainerWidth={
                  isFullscreen
                    ? FULLSCREEN_CONTAINER_WIDTH
                    : INLINE_CONTAINER_WIDTH
                }
                ariaLabel={strings.AlbumAriaLabel}
                showThumbnails={true}
                showZoom={true}
                showSlideshow={true}
                showFullscreen={true}
              />
            </StackV2>
          )}
        </FluentProvider>
      </IdPrefixProvider>
    </PortalMountNodeProvider>
  );
}
