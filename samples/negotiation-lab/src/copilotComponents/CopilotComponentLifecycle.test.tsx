import type { ICopilotComponentHostContext } from '@microsoft/sp-copilot-component';
import type { IMockCopilotComponentContextParameters } from '@microsoft/sp-copilot-component/dist/test-api';

// The beta.3 test helper reaches SPFx modules whose CommonJS builds name
// host-only packages that are not published with the preview SDK. Keep each
// virtual surface limited to the exports that this lifecycle path imports.
jest.mock(
  '@msinternal/odsp-core-bundle',
  () => ({
    CustomError: class CustomError extends Error {},
    _getVariantWithoutLogging: jest.fn(),
    getErrorMessage: (error: unknown) =>
      error instanceof Error ? error.message : String(error),
    getPrimaryVersionedPath: jest.fn(),
    getQosEndSchemaFromError: jest.fn(),
    getVariantAndLogExposure: jest.fn()
  }),
  { virtual: true }
);
jest.mock(
  '@msinternal/ecs-flight',
  () => ({
    initializeEcsClientFeatures: jest.fn(),
    isEcsFlightEnabled: jest.fn(() => false)
  }),
  { virtual: true }
);
jest.mock(
  '@msinternal/sp-safehtml',
  () => ({
    SafeHtml: {
      clean: (value: string) => value,
      isSafeLinkProtocol: jest.fn(() => true)
    }
  }),
  { virtual: true }
);
jest.mock('@msinternal/sp-telemetry', () => ({}), { virtual: true });
jest.mock(
  '@msinternal/odsp-datasources/lib/interfaces/ISpPageContext',
  () => ({ getSafeWebServerRelativeUrl: jest.fn(() => '') }),
  { virtual: true }
);
jest.mock('@msinternal/ms-graph-v3-bundle', () => ({}), { virtual: true });
jest.mock('@msinternal/sp-client-shared', () => ({}), { virtual: true });
jest.mock(
  '@msinternal/sp-copilot-bridge-internal',
  () => ({ _SPCopilotBridgeInternal: class {} }),
  { virtual: true }
);
jest.mock('@msinternal/utilities-features', () => ({}), { virtual: true });

jest.mock('../components/NegotiationLabApp', () => {
  const ReactRuntime = jest.requireActual<typeof import('react')>('react');
  return {
    __esModule: true,
    default: (props: {
      view: {
        kind: string;
        answer?: { question: string; counterpartMessage: string };
      };
      hostContext: ICopilotComponentHostContext;
      idPrefix: string;
    }) =>
      ReactRuntime.createElement(
        'div',
        {
          'data-answer-message': props.view.answer?.counterpartMessage,
          'data-answer-question': props.view.answer?.question,
          'data-display-mode': props.hostContext.displayMode,
          'data-id-prefix': props.idPrefix,
          'data-theme': props.hostContext.theme,
          'data-view-kind': props.view.kind
        },
        props.view.kind
      )
  };
});

// Leave both asynchronous data loads pending. The lifecycle assertions cover
// the real beta.3 component/context/root integration without a SharePoint call.
jest.mock('../provisioning/provisionNegotiationLabData', () => ({
  inspectNegotiationLabTarget: jest.fn(
    () => new Promise<never>(() => undefined)
  ),
  provisionNegotiationLabData: jest.fn()
}));

const mockControllerInitialize = jest.fn<
  Promise<unknown>,
  [(view: unknown) => void]
>(() => new Promise<never>(() => undefined));

jest.mock('../shared/NegotiationController', () => ({
  NegotiationController: class NegotiationController {
    public constructor(
      _context: unknown,
      private readonly writeView: (view: unknown) => void
    ) {}

    public initialize(): Promise<unknown> {
      return mockControllerInitialize(this.writeView);
    }

    public loadSession(): Promise<never> {
      return new Promise<never>(() => undefined);
    }
  }
}));

Object.assign(
  globalThis as unknown as { DEBUG: boolean; DEPRECATED_UNIT_TEST: boolean },
  { DEBUG: false, DEPRECATED_UNIT_TEST: true }
);
if (typeof globalThis.performance.mark !== 'function') {
  Object.defineProperties(globalThis.performance, {
    mark: { configurable: true, value: jest.fn() },
    measure: { configurable: true, value: jest.fn() }
  });
}

const { act } = jest.requireActual<typeof import('react-dom/test-utils')>(
  'react-dom/test-utils'
);
const { MockCopilotComponentContext } = jest.requireActual<
  typeof import('@microsoft/sp-copilot-component/dist/test-api')
>('@microsoft/sp-copilot-component/dist/test-api');
const OpenPracticeCopilotComponent = jest.requireActual<
  typeof import('./openPractice/OpenPracticeCopilotComponent')
>('./openPractice/OpenPracticeCopilotComponent').default;
const ShowReplyCopilotComponent = jest.requireActual<
  typeof import('./showReply/ShowReplyCopilotComponent')
>('./showReply/ShowReplyCopilotComponent').default;
const { inspectNegotiationLabTarget } = jest.requireMock<
  typeof import('../provisioning/provisionNegotiationLabData')
>('../provisioning/provisionNegotiationLabData');
const { SAAS_RENEWAL_SCENARIO } = jest.requireActual<
  typeof import('../domain/scenarioCatalog')
>('../domain/scenarioCatalog');
const { questionContextIdForSession } = jest.requireActual<
  typeof import('../shared/modelContext')
>('../shared/modelContext');

interface ILifecycleTestComponent {
  _internalHandleTeardownAsync(reason?: string): Promise<void>;
  _internalNotifyHostContextChanged(
    diff: Partial<ICopilotComponentHostContext>
  ): void;
  _internalRender(): void;
}

(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT?: boolean })
  .IS_REACT_ACT_ENVIRONMENT = true;

function createContext(
  domElement: HTMLElement,
  instanceId: string,
  hostContext: ICopilotComponentHostContext,
  requestSizeChange?: (width: number, height: number) => Promise<unknown>
): InstanceType<typeof MockCopilotComponentContext> {
  const parameters: Partial<IMockCopilotComponentContextParameters> = {
    domElement,
    hostContext,
    instanceId
  };
  if (requestSizeChange) {
    parameters.copilotBridge = {
      _requestSizeChangeAsync: requestSizeChange
    } as unknown as IMockCopilotComponentContextParameters['copilotBridge'];
  }
  return new MockCopilotComponentContext(parameters);
}

async function flushLiveResize(): Promise<void> {
  await act(async () => {
    await new Promise<void>((resolve) => {
      if (window.requestAnimationFrame) {
        window.requestAnimationFrame(() => resolve());
      } else {
        setTimeout(resolve, 0);
      }
    });
    await Promise.resolve();
  });
}

describe('beta.3 Copilot component lifecycle', () => {
  beforeEach(() => {
    (inspectNegotiationLabTarget as jest.Mock).mockReset().mockImplementation(
      () => new Promise<never>(() => undefined)
    );
    mockControllerInitialize
      .mockReset()
      .mockImplementation(() => new Promise<never>(() => undefined));
  });

  it('renders a matching question answer as transient board data', async () => {
    const container = document.createElement('div');
    const session = {
      itemId: 42,
      revision: '"1"',
      scenarioKey: SAAS_RENEWAL_SCENARIO.key,
      status: 'Active' as const,
      state: {
        draftOffer: { ...SAAS_RENEWAL_SCENARIO.playerOpening },
        counterpartOffer: { ...SAAS_RENEWAL_SCENARIO.counterpartOpening },
        exchanges: []
      }
    };
    (inspectNegotiationLabTarget as jest.Mock).mockResolvedValue({
      targetSiteUrl: 'https://contoso.sharepoint.com/sites/negotiation-lab',
      status: 'ready'
    });
    mockControllerInitialize.mockImplementation(async (writeView) => {
      writeView({
        kind: 'board',
        scenario: SAAS_RENEWAL_SCENARIO,
        session
      });
      return session;
    });
    const context = createContext(container, 'answer-instance', {
      displayMode: 'inline',
      theme: 'light'
    });
    const component = new OpenPracticeCopilotComponent();
    const lifecycle = component as unknown as ILifecycleTestComponent;

    await context.initializeAsync(component, {
      mode: 'answer',
      scenarioKey: ` ${SAAS_RENEWAL_SCENARIO.key} `,
      questionContextId: ` ${questionContextIdForSession(session)} `,
      playerQuestion: ' What matters most? ',
      counterpartMessage: ' Predictability matters most. '
    });
    act(() => lifecycle._internalRender());
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(container.firstElementChild?.getAttribute('data-view-kind')).toBe(
      'board'
    );
    expect(
      container.firstElementChild?.getAttribute('data-answer-question')
    ).toBe('What matters most?');
    expect(
      container.firstElementChild?.getAttribute('data-answer-message')
    ).toBe('Predictability matters most.');

    component.dispose();
  });

  it('does not attach a stale answer to a different active scenario', async () => {
    const container = document.createElement('div');
    const session = {
      itemId: 43,
      revision: '"1"',
      scenarioKey: SAAS_RENEWAL_SCENARIO.key,
      status: 'Active' as const,
      state: {
        draftOffer: { ...SAAS_RENEWAL_SCENARIO.playerOpening },
        counterpartOffer: { ...SAAS_RENEWAL_SCENARIO.counterpartOpening },
        exchanges: []
      }
    };
    (inspectNegotiationLabTarget as jest.Mock).mockResolvedValue({
      targetSiteUrl: 'https://contoso.sharepoint.com/sites/negotiation-lab',
      status: 'ready'
    });
    mockControllerInitialize.mockImplementation(async (writeView) => {
      writeView({
        kind: 'board',
        scenario: SAAS_RENEWAL_SCENARIO,
        session
      });
      return session;
    });
    const context = createContext(container, 'stale-answer-instance', {
      displayMode: 'inline',
      theme: 'light'
    });
    const component = new OpenPracticeCopilotComponent();
    const lifecycle = component as unknown as ILifecycleTestComponent;

    await context.initializeAsync(component, {
      mode: 'answer',
      scenarioKey: 'service-recovery',
      questionContextId: questionContextIdForSession(session),
      playerQuestion: 'What matters most?',
      counterpartMessage: 'A stale answer.'
    });
    act(() => lifecycle._internalRender());
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(container.firstElementChild?.getAttribute('data-view-kind')).toBe(
      'board'
    );
    expect(
      container.firstElementChild?.getAttribute('data-answer-message')
    ).toBeNull();

    component.dispose();
  });

  it.each([
    ['missing', undefined],
    ['mismatched', 'question-from-an-older-board']
  ])(
    'renders the normal board for a %s question correlation',
    async (_caseName, questionContextId) => {
      const container = document.createElement('div');
      const session = {
        itemId: 44,
        revision: '"1"',
        scenarioKey: SAAS_RENEWAL_SCENARIO.key,
        status: 'Active' as const,
        state: {
          draftOffer: { ...SAAS_RENEWAL_SCENARIO.playerOpening },
          counterpartOffer: { ...SAAS_RENEWAL_SCENARIO.counterpartOpening },
          exchanges: []
        }
      };
      (inspectNegotiationLabTarget as jest.Mock).mockResolvedValue({
        targetSiteUrl: 'https://contoso.sharepoint.com/sites/negotiation-lab',
        status: 'ready'
      });
      mockControllerInitialize.mockImplementation(async (writeView) => {
        writeView({
          kind: 'board',
          scenario: SAAS_RENEWAL_SCENARIO,
          session
        });
        return session;
      });
      const context = createContext(container, `answer-${_caseName}`, {
        displayMode: 'inline',
        theme: 'light'
      });
      const component = new OpenPracticeCopilotComponent();
      const lifecycle = component as unknown as ILifecycleTestComponent;

      await context.initializeAsync(component, {
        mode: 'answer',
        scenarioKey: SAAS_RENEWAL_SCENARIO.key,
        ...(questionContextId ? { questionContextId } : {}),
        playerQuestion: 'What matters most?',
        counterpartMessage: 'This answer must not attach.'
      });
      act(() => lifecycle._internalRender());
      await act(async () => {
        await Promise.resolve();
        await Promise.resolve();
        await Promise.resolve();
      });

      expect(container.firstElementChild?.getAttribute('data-view-kind')).toBe(
        'board'
      );
      expect(
        container.firstElementChild?.getAttribute('data-answer-message')
      ).toBeNull();

      component.dispose();
    }
  );

  it('initializes both entrypoints, rerenders host context, and preserves the newest shared-root owner', async () => {
    const container = document.createElement('div');
    const boundsSpy = jest
      .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
      .mockReturnValue({
        bottom: 360,
        height: 360,
        left: 0,
        right: 480,
        top: 0,
        width: 480,
        x: 0,
        y: 0,
        toJSON: () => ({})
      } as DOMRect);
    const openResize = jest.fn().mockResolvedValue(undefined);
    const openContext = createContext(container, 'open-instance', {
      displayMode: 'inline',
      theme: 'light'
    }, openResize);
    const openComponent = new OpenPracticeCopilotComponent();
    const openLifecycle = openComponent as unknown as ILifecycleTestComponent;

    await openContext.initializeAsync(openComponent, {});
    act(() => openLifecycle._internalRender());

    expect(container.firstElementChild?.getAttribute('data-id-prefix')).toBe(
      'negotiation-lab-open-open-instance-'
    );
    expect(container.firstElementChild?.getAttribute('data-theme')).toBe(
      'light'
    );
    await flushLiveResize();
    expect(openResize).toHaveBeenCalledWith(480, 360);

    const replyResize = jest.fn().mockResolvedValue(undefined);
    const replyContext = createContext(container, 'reply-instance', {
      displayMode: 'inline',
      theme: 'light'
    }, replyResize);
    const replyComponent = new ShowReplyCopilotComponent();
    const replyLifecycle = replyComponent as unknown as ILifecycleTestComponent;
    await replyContext.initializeAsync(replyComponent, {
      sessionItemId: 42,
      replyToPendingId: 'pending-test-1',
      counterpartMessage: 'I can move if the commitment also changes.',
      outcome: 'counter',
      proposedTermsCsv: 'annualFee,112000'
    });
    act(() => replyLifecycle._internalRender());

    expect(container.firstElementChild?.getAttribute('data-id-prefix')).toBe(
      'negotiation-lab-reply-reply-instance-'
    );
    await flushLiveResize();
    expect(replyResize).toHaveBeenCalledWith(480, 360);

    // beta.3 can deliver a late teardown for the card whose container was
    // already reused. It must not archive or unmount the newer reply.
    await act(async () => {
      await openLifecycle._internalHandleTeardownAsync('host-replaced');
    });
    expect(container.firstElementChild?.getAttribute('data-id-prefix')).toBe(
      'negotiation-lab-reply-reply-instance-'
    );
    expect(container.hasAttribute('data-negotiation-lab-archived')).toBe(false);

    act(() => {
      replyLifecycle._internalNotifyHostContextChanged({
        displayMode: 'fullscreen',
        theme: 'dark'
      });
    });
    expect(container.firstElementChild?.getAttribute('data-theme')).toBe(
      'dark'
    );
    expect(
      container.firstElementChild?.getAttribute('data-display-mode')
    ).toBe('fullscreen');
    expect(container.style.minHeight).toBe('100vh');
    expect(document.body.style.backgroundColor).toBe(
      container.style.backgroundColor
    );
    expect(replyResize).toHaveBeenCalledTimes(1);

    act(() => {
      replyLifecycle._internalNotifyHostContextChanged({
        displayMode: 'inline',
        theme: 'light'
      });
    });
    await flushLiveResize();
    expect(replyResize).toHaveBeenCalledTimes(2);
    expect(container.style.minHeight).toBe('0');

    await act(async () => {
      await replyLifecycle._internalHandleTeardownAsync('conversation-ended');
    });
    expect(container.getAttribute('data-negotiation-lab-archived')).toBe('true');
    expect(container.textContent).toContain('Negotiation Lab board archived');

    openComponent.dispose();
    replyComponent.dispose();
    boundsSpy.mockRestore();
  });
});
