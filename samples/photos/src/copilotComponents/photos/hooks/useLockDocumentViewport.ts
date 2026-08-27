import * as React from "react";

const LOCK_DOCUMENT_VIEWPORT_STYLES = `
  html,
  body {
    width: 100%;
    overflow: hidden !important;
  }

  body {
    margin: 0;
  }
`;

export function useLockDocumentViewport(
  targetDocument: Document | undefined,
  enabled: boolean,
): void {
  React.useLayoutEffect(() => {
    if (!enabled || !targetDocument?.head) {
      return undefined;
    }

    const styleElement: HTMLStyleElement = targetDocument.createElement("style");
    styleElement.setAttribute(
      "data-sharepoint-photos-scroll-owner",
      "photo-album",
    );
    styleElement.textContent = LOCK_DOCUMENT_VIEWPORT_STYLES;
    targetDocument.head.appendChild(styleElement);

    return () => styleElement.remove();
  }, [enabled, targetDocument]);
}
