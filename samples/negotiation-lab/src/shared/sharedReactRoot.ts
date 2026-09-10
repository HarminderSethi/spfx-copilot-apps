import * as React from 'react';
import { createRoot, type Root } from 'react-dom/client';

// Both production bundles must see the same owner when beta.3 reuses a container.
const containerStateKey = Symbol.for('negotiation-lab.react-root.v1');
const claimedContainerByOwner = new WeakMap<object, Element>();

interface IResizeCoordinator {
  root?: Root;
  owner?: object;
  generation: number;
  cancelScheduled?: () => void;
  lastRequestedHeight?: number;
  lastRequestedOwner?: object;
  lastRequestedWidth?: number;
  observer?: ResizeObserver;
  queue: Promise<void>;
}

export interface ILiveSharedRootOptions {
  theme?: 'light' | 'dark';
  displayMode?: 'inline' | 'fullscreen';
  isActive?: () => boolean;
  requestSizeChange?: (width: number, height: number) => Promise<unknown>;
}

export interface IArchiveSharedRootOptions {
  theme?: 'light' | 'dark';
  requestSizeChange?: (width: number, height: number) => Promise<unknown>;
}

function coordinatorFor(container: Element): IResizeCoordinator {
  const sharedContainer = container as Element & {
    [containerStateKey]?: IResizeCoordinator;
  };
  let coordinator = sharedContainer[containerStateKey];
  if (!coordinator) {
    coordinator = { generation: 0, queue: Promise.resolve() };
    Object.defineProperty(sharedContainer, containerStateKey, { value: coordinator });
  }
  return coordinator;
}

function invalidateScheduledResize(container: Element): number {
  const coordinator = coordinatorFor(container);
  coordinator.generation += 1;
  coordinator.cancelScheduled?.();
  coordinator.cancelScheduled = undefined;
  coordinator.observer?.disconnect();
  coordinator.observer = undefined;
  return coordinator.generation;
}

function liveSurfaceColor(theme?: 'light' | 'dark'): string {
  if (theme === 'dark') return '#242424';
  if (theme === 'light') return '#ffffff';
  return 'transparent';
}

function prepareLiveSurface(
  container: Element,
  options: ILiveSharedRootOptions
): void {
  container.removeAttribute('data-negotiation-lab-archived');
  const fullscreen = options.displayMode === 'fullscreen';
  const colorScheme = options.theme ?? 'light dark';
  const backgroundColor = liveSurfaceColor(options.theme);
  if (container instanceof HTMLElement) {
    container.style.backgroundColor = backgroundColor;
    container.style.colorScheme = colorScheme;
    container.style.height = 'auto';
    container.style.minHeight = fullscreen ? '100vh' : '0';
  }
  const document = container.ownerDocument;
  document.documentElement.style.colorScheme = colorScheme;
  document.documentElement.style.backgroundColor = backgroundColor;
  if (document.body) {
    document.body.style.colorScheme = colorScheme;
    document.body.style.backgroundColor = backgroundColor;
    document.body.style.margin = '0';
    document.body.style.minHeight = fullscreen ? '100vh' : '0';
    document.body.style.padding = '0';
  }
}

function scheduleAfterCommit(
  container: Element,
  callback: () => void
): () => void {
  const view = container.ownerDocument.defaultView;
  if (view?.requestAnimationFrame) {
    const frame = view.requestAnimationFrame(callback);
    return () => view.cancelAnimationFrame(frame);
  }
  const timeout = setTimeout(callback, 0);
  return () => clearTimeout(timeout);
}

function boundsFor(element: Element | undefined): DOMRect | undefined {
  if (!element) return undefined;
  try {
    return element.getBoundingClientRect();
  } catch {
    return undefined;
  }
}

function measuredLiveSize(
  container: Element
): { width: number; height: number } | undefined {
  const document = container.ownerDocument;
  const content =
    container.firstElementChild instanceof HTMLElement
      ? container.firstElementChild
      : undefined;
  const containerBounds = boundsFor(container);
  const contentBounds = boundsFor(content);
  const width = Math.ceil(
    containerBounds?.width ||
      document.documentElement.clientWidth ||
      document.body?.clientWidth ||
      contentBounds?.width ||
      0
  );
  const height = Math.ceil(
    Math.max(
      contentBounds?.height ?? 0,
      content?.scrollHeight ?? 0,
      container.scrollHeight
    )
  );
  return width > 0 && height > 0 ? { width, height } : undefined;
}

function enqueueResize(
  container: Element,
  isCurrent: () => boolean,
  requestSizeChange: (width: number, height: number) => Promise<unknown>,
  width: number,
  height: number,
  dedupeOwner?: object
): Promise<void> {
  const coordinator = coordinatorFor(container);
  const request = coordinator.queue
    .catch(() => undefined)
    .then(async () => {
      if (!isCurrent()) return;
      if (
        dedupeOwner &&
        coordinator.lastRequestedOwner === dedupeOwner &&
        coordinator.lastRequestedWidth === width &&
        coordinator.lastRequestedHeight === height
      ) {
        return;
      }
      if (dedupeOwner) {
        coordinator.lastRequestedOwner = dedupeOwner;
        coordinator.lastRequestedWidth = width;
        coordinator.lastRequestedHeight = height;
      }
      try {
        const accepted = await requestSizeChange(width, height);
        if (accepted === false && coordinator.lastRequestedOwner === dedupeOwner) {
          coordinator.lastRequestedOwner = undefined;
          coordinator.lastRequestedWidth = undefined;
          coordinator.lastRequestedHeight = undefined;
        }
      } catch {
        if (coordinator.lastRequestedOwner === dedupeOwner) {
          coordinator.lastRequestedOwner = undefined;
          coordinator.lastRequestedWidth = undefined;
          coordinator.lastRequestedHeight = undefined;
        }
        // Sizing is progressive enhancement; the themed surface stays usable.
      }
    });
  coordinator.queue = request;
  return request;
}

function scheduleLiveResize(
  owner: object,
  container: Element,
  options: ILiveSharedRootOptions
): void {
  const generation = invalidateScheduledResize(container);
  if (
    options.displayMode === 'fullscreen' ||
    !options.requestSizeChange
  ) {
    if (options.displayMode === 'fullscreen') {
      coordinatorFor(container).lastRequestedOwner = undefined;
      coordinatorFor(container).lastRequestedWidth = undefined;
      coordinatorFor(container).lastRequestedHeight = undefined;
    }
    return;
  }

  const coordinator = coordinatorFor(container);
  const isCurrent = (): boolean =>
    coordinator.generation === generation &&
    coordinator.owner === owner &&
    options.isActive?.() !== false;
  const requestMeasuredSize = (): void => {
    if (!isCurrent()) return;
    const size = measuredLiveSize(container);
    if (!size || !isCurrent()) return;
    enqueueResize(
      container,
      isCurrent,
      options.requestSizeChange as (
        width: number,
        height: number
      ) => Promise<unknown>,
      size.width,
      size.height,
      owner
    ).catch(() => undefined);
  };
  coordinator.cancelScheduled = scheduleAfterCommit(container, () => {
    coordinator.cancelScheduled = undefined;
    if (!isCurrent()) return;
    requestMeasuredSize();
    const ResizeObserverConstructor =
      container.ownerDocument.defaultView?.ResizeObserver;
    const content = container.firstElementChild;
    if (ResizeObserverConstructor && content && isCurrent()) {
      coordinator.observer = new ResizeObserverConstructor(requestMeasuredSize);
      coordinator.observer.observe(content);
    }
  });
}

export function renderInSharedRoot(
  owner: object,
  container: Element,
  element: React.ReactElement,
  options: ILiveSharedRootOptions = {}
): boolean {
  if (options.isActive?.() === false) return false;
  const coordinator = coordinatorFor(container);
  const claimedContainer = claimedContainerByOwner.get(owner);
  if (
    (claimedContainer && claimedContainer !== container) ||
    (claimedContainer === container && coordinator.owner !== owner)
  ) {
    return false;
  }
  if (!claimedContainer) {
    claimedContainerByOwner.set(owner, container);
  }
  prepareLiveSurface(container, options);
  let root = coordinator.root;
  if (!root) {
    container.replaceChildren();
    root = createRoot(container);
    coordinator.root = root;
  }
  coordinator.owner = owner;
  root.render(element);
  scheduleLiveResize(owner, container, options);
  return true;
}

export function unmountSharedRoot(owner: object, container: Element): void {
  if (coordinatorFor(container).owner !== owner) {
    return;
  }
  invalidateScheduledResize(container);
  const resizeCoordinator = coordinatorFor(container);
  resizeCoordinator.lastRequestedOwner = undefined;
  resizeCoordinator.lastRequestedWidth = undefined;
  resizeCoordinator.lastRequestedHeight = undefined;
  const root = resizeCoordinator.root;
  resizeCoordinator.root = undefined;
  resizeCoordinator.owner = undefined;
  // Retain the weak owner claim so a late callback cannot remount after teardown.
  root?.unmount();
}

/** Release React while leaving a compact, non-blank card in chat history. */
export async function archiveSharedRoot(
  owner: object,
  container: Element,
  options: IArchiveSharedRootOptions = {}
): Promise<boolean> {
  if (coordinatorFor(container).owner !== owner) {
    return false;
  }

  const archiveGeneration = invalidateScheduledResize(container);
  const resizeCoordinator = coordinatorFor(container);
  resizeCoordinator.lastRequestedOwner = undefined;
  resizeCoordinator.lastRequestedWidth = undefined;
  resizeCoordinator.lastRequestedHeight = undefined;
  const root = resizeCoordinator.root;
  resizeCoordinator.root = undefined;
  resizeCoordinator.owner = undefined;
  root?.unmount();

  const document = container.ownerDocument;
  const archived = document.createElement('section');
  archived.setAttribute('data-negotiation-lab-archived', 'true');
  archived.setAttribute('aria-label', 'Archived Negotiation Lab board');
  archived.style.boxSizing = 'border-box';
  archived.style.display = 'flex';
  archived.style.flexDirection = 'column';
  archived.style.gap = '4px';
  archived.style.width = '100%';
  archived.style.padding = '12px 16px';
  archived.style.border = '1px solid GrayText';
  archived.style.borderRadius = '8px';
  archived.style.colorScheme = options.theme ?? 'light dark';
  archived.style.color = 'CanvasText';
  archived.style.backgroundColor = 'Canvas';
  archived.style.fontFamily = 'inherit';
  archived.style.fontSize = '14px';
  archived.style.lineHeight = '20px';

  const title = document.createElement('strong');
  title.textContent = 'Negotiation Lab board archived';
  const explanation = document.createElement('span');
  explanation.textContent =
    'Continue in the newest board, or say “show my practice” to reopen it.';
  archived.append(title, explanation);

  container.replaceChildren(archived);
  container.setAttribute('data-negotiation-lab-archived', 'true');
  if (container instanceof HTMLElement) {
    container.style.backgroundColor = 'transparent';
    container.style.height = 'auto';
    container.style.minHeight = '0';
  }
  document.documentElement.style.colorScheme = options.theme ?? 'light dark';
  document.documentElement.style.backgroundColor = 'transparent';
  if (document.body) {
    document.body.style.colorScheme = options.theme ?? 'light dark';
    document.body.style.backgroundColor = 'transparent';
    document.body.style.margin = '0';
    document.body.style.minHeight = '0';
    document.body.style.padding = '0';
  }

  if (options.requestSizeChange) {
    const archivedBounds = archived.getBoundingClientRect();
    const containerBounds = container.getBoundingClientRect();
    const width = Math.ceil(
      archivedBounds.width ||
        containerBounds.width ||
        document.documentElement.clientWidth ||
        document.body?.clientWidth ||
        0
    );
    const height = Math.ceil(
      archivedBounds.height ||
        archived.scrollHeight ||
        container.scrollHeight ||
        0
    );
    if (width > 0 && height > 0) {
      await enqueueResize(
        container,
        () =>
          resizeCoordinator.generation === archiveGeneration &&
          resizeCoordinator.owner === undefined &&
          container.getAttribute('data-negotiation-lab-archived') === 'true',
        options.requestSizeChange,
        width,
        height
      );
    }
  }

  return true;
}
