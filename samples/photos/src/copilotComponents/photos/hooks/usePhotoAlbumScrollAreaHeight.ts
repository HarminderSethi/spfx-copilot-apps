import * as React from "react";

const PHOTO_ALBUM_COPILOT_CHROME_OFFSET = 300;

function getVisibleDocumentHeight(targetDocument: Document): number {
  const view: Window | null = targetDocument.defaultView;
  if (!view) {
    return 0;
  }

  return Math.max(
    view.visualViewport?.height ?? 0,
    targetDocument.documentElement.clientHeight,
    view.innerHeight,
    view.outerHeight,
    view.screen.availHeight,
  );
}

export function usePhotoAlbumScrollAreaHeight(
  targetDocument: Document | undefined,
  enabled: boolean,
): string | undefined {
  const [height, setHeight] = React.useState<number | undefined>(() => {
    if (!enabled || !targetDocument) {
      return undefined;
    }

    return Math.max(
      getVisibleDocumentHeight(targetDocument)
        - PHOTO_ALBUM_COPILOT_CHROME_OFFSET,
      1,
    );
  });

  React.useLayoutEffect(() => {
    if (!enabled || !targetDocument) {
      setHeight(undefined);
      return undefined;
    }

    const view: Window | null = targetDocument.defaultView;
    if (!view) {
      return undefined;
    }

    const updateHeight = (): void => {
      setHeight(
        Math.max(
          getVisibleDocumentHeight(targetDocument),
          PHOTO_ALBUM_COPILOT_CHROME_OFFSET + 1,
        ) - PHOTO_ALBUM_COPILOT_CHROME_OFFSET,
      );
    };

    updateHeight();
    view.addEventListener("resize", updateHeight);
    view.visualViewport?.addEventListener("resize", updateHeight);

    return () => {
      view.removeEventListener("resize", updateHeight);
      view.visualViewport?.removeEventListener("resize", updateHeight);
    };
  }, [enabled, targetDocument]);

  return enabled && height !== undefined ? `${height}px` : undefined;
}
