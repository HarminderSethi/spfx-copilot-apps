import * as React from 'react';
import { act } from 'react-dom/test-utils';

import {
  archiveSharedRoot,
  renderInSharedRoot,
  unmountSharedRoot
} from './sharedReactRoot';

(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

function rect(width: number, height: number): DOMRect {
  return {
    bottom: height,
    height,
    left: 0,
    right: width,
    top: 0,
    width,
    x: 0,
    y: 0,
    toJSON: () => ({})
  } as DOMRect;
}

function installAnimationFrameQueue(): {
  flush(): void;
  pending(): number;
  restore(): void;
} {
  const requestDescriptor = Object.getOwnPropertyDescriptor(
    window,
    'requestAnimationFrame'
  );
  const cancelDescriptor = Object.getOwnPropertyDescriptor(
    window,
    'cancelAnimationFrame'
  );
  let nextId = 1;
  const callbacks = new Map<number, FrameRequestCallback>();
  Object.defineProperty(window, 'requestAnimationFrame', {
    configurable: true,
    value: (callback: FrameRequestCallback): number => {
      const id = nextId++;
      callbacks.set(id, callback);
      return id;
    }
  });
  Object.defineProperty(window, 'cancelAnimationFrame', {
    configurable: true,
    value: (id: number): void => {
      callbacks.delete(id);
    }
  });
  return {
    flush: () => {
      const pending = Array.from(callbacks.values());
      callbacks.clear();
      pending.forEach((callback) => callback(0));
    },
    pending: () => callbacks.size,
    restore: () => {
      if (requestDescriptor) {
        Object.defineProperty(window, 'requestAnimationFrame', requestDescriptor);
      } else {
        delete (window as unknown as Record<string, unknown>)
          .requestAnimationFrame;
      }
      if (cancelDescriptor) {
        Object.defineProperty(window, 'cancelAnimationFrame', cancelDescriptor);
      } else {
        delete (window as unknown as Record<string, unknown>)
          .cancelAnimationFrame;
      }
    }
  };
}

async function flushResizeQueue(frames: { flush(): void }): Promise<void> {
  await act(async () => {
    frames.flush();
    await Promise.resolve();
    await Promise.resolve();
  });
}

describe('shared React root across host component instances', () => {
  it('shares ownership across independently loaded bundles and preserves live input', async () => {
    let secondBundle: typeof import('./sharedReactRoot') | undefined;
    jest.isolateModules(() => {
      secondBundle = jest.requireActual<typeof import('./sharedReactRoot')>('./sharedReactRoot');
    });
    if (!secondBundle) throw new Error('The second bundle must be loaded.');
    const container = document.createElement('div');
    const firstOwner = {};
    const secondOwner = {};
    act(() => {
      renderInSharedRoot(firstOwner, container, <input defaultValue="initial" />);
    });
    const input = container.querySelector('input') as HTMLInputElement;
    input.value = 'unsent draft';
    act(() => {
      secondBundle?.renderInSharedRoot(secondOwner, container, <input defaultValue="initial" />);
    });
    expect(container.querySelector('input')).toBe(input);
    expect(input.value).toBe('unsent draft');
    await act(async () => {
      expect(await archiveSharedRoot(firstOwner, container)).toBe(false);
    });
    expect(container.querySelector('input')).toBe(input);
    act(() => {
      expect(renderInSharedRoot(firstOwner, container, <span>stale</span>)).toBe(false);
      secondBundle?.unmountSharedRoot(secondOwner, container);
    });
    expect(container.textContent).toBe('');
  });

  it('does not remount an archived owner when an asynchronous callback arrives', async () => {
    const container = document.createElement('div');
    const owner = {};
    act(() => { renderInSharedRoot(owner, container, <span>live</span>); });
    await act(async () => { await archiveSharedRoot(owner, container); });
    act(() => {
      expect(renderInSharedRoot(owner, container, <span>late response</span>)).toBe(false);
    });
    expect(container.textContent).toContain('Negotiation Lab board archived');
  });

  it('coalesces committed inline renders and requests a shorter current height', async () => {
    const frames = installAnimationFrameQueue();
    const container = document.createElement('div');
    const owner = {};
    const requestSizeChange = jest.fn().mockResolvedValue(true);
    let contentHeight = 720;
    const boundsSpy = jest
      .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
      .mockImplementation(() => rect(480, contentHeight));

    try {
      act(() => {
        renderInSharedRoot(owner, container, <span>loading</span>, {
          displayMode: 'inline',
          theme: 'light',
          requestSizeChange
        });
        renderInSharedRoot(owner, container, <span>active board</span>, {
          displayMode: 'inline',
          theme: 'light',
          requestSizeChange
        });
      });

      expect(frames.pending()).toBe(1);
      expect(requestSizeChange).not.toHaveBeenCalled();
      await flushResizeQueue(frames);
      expect(container.textContent).toBe('active board');
      expect(requestSizeChange).toHaveBeenLastCalledWith(480, 720);

      act(() => {
        renderInSharedRoot(owner, container, <span>active board</span>, {
          displayMode: 'inline',
          theme: 'dark',
          requestSizeChange
        });
      });
      await flushResizeQueue(frames);
      expect(requestSizeChange).toHaveBeenCalledTimes(1);

      contentHeight = 320;
      act(() => {
        renderInSharedRoot(owner, container, <span>practice completed</span>, {
          displayMode: 'inline',
          theme: 'dark',
          requestSizeChange
        });
      });
      await flushResizeQueue(frames);

      expect(requestSizeChange).toHaveBeenLastCalledWith(480, 320);
      expect(requestSizeChange).toHaveBeenCalledTimes(2);
      expect(container.style.height).toBe('auto');
      expect(container.style.minHeight).toBe('0');
      expect(container.style.backgroundColor).toBe(
        document.body.style.backgroundColor
      );
      expect(document.documentElement.style.backgroundColor).toBe(
        document.body.style.backgroundColor
      );
      expect(document.body.style.backgroundColor).not.toBe('transparent');
      expect(document.documentElement.style.colorScheme).toBe('dark');
      expect(document.body.style.margin).toBe('0px');
      expect(document.body.style.padding).toBe('0px');
    } finally {
      act(() => unmountSharedRoot(owner, container));
      boundsSpy.mockRestore();
      frames.restore();
    }
  });

  it('fills fullscreen with the theme and resumes measured sizing on return to inline', async () => {
    const frames = installAnimationFrameQueue();
    const container = document.createElement('div');
    const owner = {};
    const requestSizeChange = jest.fn().mockResolvedValue(true);
    const contentHeight = 600;
    const boundsSpy = jest
      .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
      .mockImplementation(() => rect(900, contentHeight));

    try {
      act(() => {
        renderInSharedRoot(owner, container, <span>inline board</span>, {
          displayMode: 'inline',
          theme: 'dark',
          requestSizeChange
        });
      });
      await flushResizeQueue(frames);
      expect(requestSizeChange).toHaveBeenCalledWith(900, 600);

      act(() => {
        renderInSharedRoot(owner, container, <span>fullscreen board</span>, {
          displayMode: 'fullscreen',
          theme: 'dark',
          requestSizeChange
        });
      });
      expect(frames.pending()).toBe(0);
      expect(requestSizeChange).toHaveBeenCalledTimes(1);
      expect(container.style.minHeight).toBe('100vh');
      expect(document.body.style.minHeight).toBe('100vh');
      expect(container.style.backgroundColor).toBe(
        document.documentElement.style.backgroundColor
      );
      const fullscreenSurface = container.style.backgroundColor;
      expect(fullscreenSurface).not.toBe('transparent');

      act(() => {
        renderInSharedRoot(owner, container, <span>scenario picker</span>, {
          displayMode: 'inline',
          theme: 'light',
          requestSizeChange
        });
      });
      expect(container.style.minHeight).toBe('0');
      expect(document.body.style.minHeight).toBe('0');
      await flushResizeQueue(frames);
      expect(requestSizeChange).toHaveBeenLastCalledWith(900, 600);
      expect(requestSizeChange).toHaveBeenCalledTimes(2);
      expect(document.documentElement.style.colorScheme).toBe('light');
      expect(container.style.backgroundColor).not.toBe(fullscreenSurface);
    } finally {
      act(() => unmountSharedRoot(owner, container));
      boundsSpy.mockRestore();
      frames.restore();
    }
  });

  it('cancels a queued resize when its owner is replaced or unmounted', async () => {
    const frames = installAnimationFrameQueue();
    const container = document.createElement('div');
    const firstOwner = {};
    const secondOwner = {};
    const firstResize = jest.fn().mockResolvedValue(true);
    const secondResize = jest.fn().mockResolvedValue(true);
    const boundsSpy = jest
      .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
      .mockReturnValue(rect(480, 360));

    try {
      act(() => {
        renderInSharedRoot(firstOwner, container, <span>first</span>, {
          displayMode: 'inline',
          requestSizeChange: firstResize
        });
        renderInSharedRoot(secondOwner, container, <span>second</span>, {
          displayMode: 'inline',
          requestSizeChange: secondResize
        });
      });
      await flushResizeQueue(frames);
      expect(firstResize).not.toHaveBeenCalled();
      expect(secondResize).toHaveBeenCalledWith(480, 360);

      act(() => {
        renderInSharedRoot(secondOwner, container, <span>shorter</span>, {
          displayMode: 'inline',
          requestSizeChange: secondResize
        });
        unmountSharedRoot(secondOwner, container);
      });
      await flushResizeQueue(frames);
      expect(secondResize).toHaveBeenCalledTimes(1);
    } finally {
      boundsSpy.mockRestore();
      frames.restore();
    }
  });

  it('lets the latest owner correct an older resize that was already in flight', async () => {
    const frames = installAnimationFrameQueue();
    const container = document.createElement('div');
    const firstOwner = {};
    const secondOwner = {};
    let resolveFirst: ((value: boolean) => void) | undefined;
    const firstResize = jest.fn(
      () =>
        new Promise<boolean>((resolve) => {
          resolveFirst = resolve;
        })
    );
    const archivedResize = jest.fn().mockResolvedValue(true);
    const secondResize = jest.fn().mockResolvedValue(true);
    let contentHeight = 700;
    const boundsSpy = jest
      .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
      .mockImplementation(() => rect(480, contentHeight));

    try {
      act(() => {
        renderInSharedRoot(firstOwner, container, <span>first</span>, {
          displayMode: 'inline',
          requestSizeChange: firstResize
        });
      });
      await flushResizeQueue(frames);
      expect(firstResize).toHaveBeenCalledWith(480, 700);

      let archivePromise: Promise<boolean> | undefined;
      act(() => {
        archivePromise = archiveSharedRoot(firstOwner, container, {
          requestSizeChange: archivedResize
        });
      });

      contentHeight = 300;
      act(() => {
        renderInSharedRoot(secondOwner, container, <span>second</span>, {
          displayMode: 'inline',
          requestSizeChange: secondResize
        });
      });
      await flushResizeQueue(frames);
      expect(secondResize).not.toHaveBeenCalled();

      await act(async () => {
        resolveFirst?.(true);
        await archivePromise;
        await Promise.resolve();
        await Promise.resolve();
      });

      expect(archivedResize).not.toHaveBeenCalled();
      expect(secondResize).toHaveBeenCalledWith(480, 300);
      expect(container.textContent).toBe('second');
    } finally {
      act(() => unmountSharedRoot(secondOwner, container));
      boundsSpy.mockRestore();
      frames.restore();
    }
  });

  it('lets a second instance take over the container the host double-mounted', () => {
    // The Copilot host can initialize a second component instance on the same
    // DOM node without tearing down the first ("second ui/initialize"). The
    // newer instance must win and the container must never go blank.
    const container = document.createElement('div');
    const firstInstance = {};
    const secondInstance = {};

    act(() => {
      renderInSharedRoot(firstInstance, container, <span>first</span>);
    });
    expect(container.textContent).toBe('first');

    act(() => {
      renderInSharedRoot(secondInstance, container, <span>second</span>);
    });
    expect(container.textContent).toBe('second');

    // The stale instance's late teardown must not unmount the live instance.
    act(() => {
      unmountSharedRoot(firstInstance, container);
    });
    expect(container.textContent).toBe('second');

    act(() => {
      unmountSharedRoot(secondInstance, container);
    });
    expect(container.textContent).toBe('');
  });

  it('renders again on a container whose root was unmounted', () => {
    const container = document.createElement('div');
    const firstInstance = {};

    act(() => {
      renderInSharedRoot(firstInstance, container, <span>one</span>);
    });
    act(() => {
      unmountSharedRoot(firstInstance, container);
    });
    expect(container.textContent).toBe('');

    const secondInstance = {};
    act(() => {
      renderInSharedRoot(secondInstance, container, <span>two</span>);
    });
    expect(container.textContent).toBe('two');

    act(() => {
      unmountSharedRoot(secondInstance, container);
    });
  });

  it('archives the current owner as inert copy and measures a compact resize', async () => {
    const container = document.createElement('div');
    const owner = {};
    const requestSizeChange = jest.fn().mockResolvedValue(true);
    const bounds = {
      bottom: 64,
      height: 64,
      left: 0,
      right: 480,
      top: 0,
      width: 480,
      x: 0,
      y: 0,
      toJSON: () => ({})
    } as DOMRect;
    const boundsSpy = jest
      .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
      .mockReturnValue(bounds);

    try {
      act(() => {
        renderInSharedRoot(
          owner,
          container,
          <button type="button">Live action</button>,
          {
            displayMode: 'inline',
            requestSizeChange
          }
        );
      });

      await act(async () => {
        await archiveSharedRoot(owner, container, {
          theme: 'dark',
          requestSizeChange
        });
      });

      expect(container.querySelector('button')).toBeNull();
      expect(
        container.querySelector('[data-negotiation-lab-archived="true"]')
      ).not.toBeNull();
      expect(container.textContent).toContain('Negotiation Lab board archived');
      expect(container.textContent).toContain(
        'say “show my practice” to reopen it'
      );
      expect(container.textContent).not.toContain('session');
      expect(requestSizeChange).toHaveBeenCalledWith(480, 64);
      expect(requestSizeChange).toHaveBeenCalledTimes(1);
      expect(document.body.style.backgroundColor).toBe('transparent');
      expect(document.body.style.margin).toBe('0px');
      expect(document.body.style.padding).toBe('0px');

      const replacement = {};
      act(() => {
        renderInSharedRoot(replacement, container, <span>live again</span>);
      });
      expect(container.textContent).toBe('live again');
      expect(container.hasAttribute('data-negotiation-lab-archived')).toBe(
        false
      );
      act(() => {
        unmountSharedRoot(replacement, container);
      });
    } finally {
      boundsSpy.mockRestore();
    }
  });

  it('does not let a stale owner archive the live replacement', async () => {
    const container = document.createElement('div');
    const firstInstance = {};
    const secondInstance = {};
    const requestSizeChange = jest.fn().mockResolvedValue(true);

    act(() => {
      renderInSharedRoot(firstInstance, container, <span>first</span>);
      renderInSharedRoot(secondInstance, container, <span>second</span>);
    });

    let archived = true;
    await act(async () => {
      archived = await archiveSharedRoot(firstInstance, container, {
        requestSizeChange
      });
    });

    expect(archived).toBe(false);
    expect(container.textContent).toBe('second');
    expect(requestSizeChange).not.toHaveBeenCalled();
    act(() => {
      unmountSharedRoot(secondInstance, container);
    });
  });

  it('does not let a displaced owner steal the container back on a late rerender', async () => {
    const container = document.createElement('div');
    const firstInstance = {};
    const secondInstance = {};

    act(() => {
      renderInSharedRoot(firstInstance, container, <span>first</span>);
      renderInSharedRoot(secondInstance, container, <span>second</span>);
    });

    let rendered = true;
    act(() => {
      rendered = renderInSharedRoot(
        firstInstance,
        container,
        <span>stale first</span>
      );
    });
    expect(rendered).toBe(false);
    expect(container.textContent).toBe('second');

    let archived = true;
    await act(async () => {
      archived = await archiveSharedRoot(firstInstance, container);
    });
    expect(archived).toBe(false);
    expect(container.textContent).toBe('second');

    act(() => {
      unmountSharedRoot(secondInstance, container);
    });
  });
});
