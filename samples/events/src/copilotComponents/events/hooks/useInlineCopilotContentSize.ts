import * as React from "react";

export interface IUseInlineCopilotContentSizeOptions {
  enabled: boolean;
  measurementKey: string;
  onRequestSizeChange: (width: number, height: number) => Promise<boolean>;
  targetDocument: Document | undefined;
}

interface IContentSize {
  height: number;
  width: number;
}

function measureContent(element: HTMLElement): IContentSize | undefined {
  const bounds = element.getBoundingClientRect();
  const width = Math.ceil(bounds.width);
  const height = Math.ceil(Math.max(bounds.height, element.scrollHeight));

  if (
    !Number.isFinite(width) ||
    !Number.isFinite(height) ||
    width <= 0 ||
    height <= 0
  ) {
    return undefined;
  }

  return { height, width };
}

/**
 * Keeps the Copilot inline host sized to the component's rendered content.
 *
 * The host iframe can retain its previous height when a view becomes shorter.
 * Measuring the component root avoids using the iframe document height, which
 * already contains that stale host-provided height.
 */
export function useInlineCopilotContentSize(
  options: IUseInlineCopilotContentSizeOptions,
): React.RefObject<HTMLDivElement> {
  const {
    enabled,
    measurementKey,
    onRequestSizeChange,
    targetDocument,
  } = options;
  const contentRef = React.useRef<HTMLDivElement>(null);
  const lastRequestedSizeRef = React.useRef<string>();

  React.useLayoutEffect(() => {
    if (!enabled || !targetDocument) {
      lastRequestedSizeRef.current = undefined;
      return undefined;
    }

    const element = contentRef.current;
    const view = targetDocument.defaultView;
    if (!element || !view) {
      return undefined;
    }

    let animationFrame: number | undefined;
    let disposed = false;

    const updateHostSize = (): void => {
      if (animationFrame !== undefined) {
        view.cancelAnimationFrame(animationFrame);
      }

      animationFrame = view.requestAnimationFrame(() => {
        animationFrame = undefined;

        const size = measureContent(element);
        if (!size || disposed) {
          return;
        }

        const sizeKey = `${size.width}x${size.height}`;
        if (lastRequestedSizeRef.current === sizeKey) {
          return;
        }

        lastRequestedSizeRef.current = sizeKey;
        onRequestSizeChange(size.width, size.height)
          .then((accepted: boolean) => {
            if (
              !accepted &&
              !disposed &&
              lastRequestedSizeRef.current === sizeKey
            ) {
              lastRequestedSizeRef.current = undefined;
              console.error(
                `[Events] Copilot host rejected inline size ${sizeKey}.`,
              );
            }
          })
          .catch((error: unknown) => {
            if (!disposed && lastRequestedSizeRef.current === sizeKey) {
              lastRequestedSizeRef.current = undefined;
            }
            console.error(
              `[Events] Failed to request inline size ${sizeKey}:`,
              error,
            );
          });
      });
    };

    updateHostSize();

    const ResizeObserverConstructor = view.ResizeObserver;
    const resizeObserver = ResizeObserverConstructor
      ? new ResizeObserverConstructor(updateHostSize)
      : undefined;
    resizeObserver?.observe(element);
    view.addEventListener("resize", updateHostSize);

    return () => {
      disposed = true;
      resizeObserver?.disconnect();
      view.removeEventListener("resize", updateHostSize);
      if (animationFrame !== undefined) {
        view.cancelAnimationFrame(animationFrame);
      }
    };
  }, [
    enabled,
    measurementKey,
    onRequestSizeChange,
    targetDocument,
  ]);

  return contentRef;
}
