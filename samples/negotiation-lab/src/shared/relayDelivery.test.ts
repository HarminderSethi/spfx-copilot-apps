import type { CopilotComponentContext } from '@microsoft/sp-copilot-component';
import type { IMockCopilotComponentContextParameters } from '@microsoft/sp-copilot-component/dist/test-api';
import type { INegotiationSession } from '../domain/types';

// The beta.3 test helper reaches SPFx host-only modules that are not shipped
// with the preview package. Keep these virtual surfaces aligned with the
// lifecycle test so this suite still exercises the real component context.
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
const { MockCopilotComponentContext } = jest.requireActual<
  typeof import('@microsoft/sp-copilot-component/dist/test-api')
>('@microsoft/sp-copilot-component/dist/test-api');
const { SAAS_RENEWAL_SCENARIO } = jest.requireActual<
  typeof import('../domain/scenarioCatalog')
>('../domain/scenarioCatalog');
const { deliverNegotiationRelay, deliverPracticeQuestion } = jest.requireActual<
  typeof import('./relayDelivery')
>('./relayDelivery');

const playerMessage =
  'Could we find a balanced package?\nI am ready to discuss a trade.';

const pendingSession: INegotiationSession = {
  itemId: 42,
  revision: '"1"',
  scenarioKey: SAAS_RENEWAL_SCENARIO.key,
  status: 'Active',
  state: {
    draftOffer: { ...SAAS_RENEWAL_SCENARIO.playerOpening },
    counterpartOffer: { ...SAAS_RENEWAL_SCENARIO.counterpartOpening },
    pending: {
      id: 'pending-42-1',
      message: playerMessage,
      offer: { ...SAAS_RENEWAL_SCENARIO.playerOpening }
    },
    exchanges: []
  }
};

function bridgeContext(options?: {
  updateModelContextAsync?: ReturnType<typeof jest.fn>;
  sendFollowUpMessageAsync?: ReturnType<typeof jest.fn>;
}): {
  context: CopilotComponentContext;
  updateModelContextAsync: ReturnType<typeof jest.fn>;
  sendFollowUpMessageAsync: ReturnType<typeof jest.fn>;
} {
  const updateModelContextAsync =
    options?.updateModelContextAsync ?? jest.fn().mockResolvedValue(undefined);
  const sendFollowUpMessageAsync =
    options?.sendFollowUpMessageAsync ?? jest.fn().mockResolvedValue({});
  const context = new MockCopilotComponentContext({
    copilotBridge: {
      updateModelContextAsync,
      sendFollowUpMessageAsync
    } as never
  } as Partial<IMockCopilotComponentContextParameters>) as unknown as
    CopilotComponentContext;
  return { context, updateModelContextAsync, sendFollowUpMessageAsync };
}

function deferred(): { promise: Promise<void>; resolve: () => void } {
  let settle = (): void => undefined;
  const promise = new Promise<void>((resolve) => {
    settle = resolve;
  });
  return { promise, resolve: settle };
}

describe('Negotiation Lab delivery gateway', () => {
  it('asks with Ready context before sending only the question', async () => {
    const readySession: INegotiationSession = {
      ...pendingSession,
      state: { ...pendingSession.state, pending: undefined }
    };
    const { context, updateModelContextAsync, sendFollowUpMessageAsync } =
      bridgeContext();

    await deliverPracticeQuestion(
      context,
      SAAS_RENEWAL_SCENARIO,
      readySession,
      '  What matters most to you?  '
    );

    expect(updateModelContextAsync).toHaveBeenCalledWith({
      structuredContent: expect.objectContaining({
        protocol: 'negotiation-lab/v5',
        interactionState: 'Ready'
      })
    });
    const content = sendFollowUpMessageAsync.mock.calls[0][0] as Array<{
      type?: string;
      text?: string;
    }>;
    expect(content).toHaveLength(1);
    expect(content[0]).toMatchObject({
      type: 'text',
      text: 'What matters most to you?'
    });
    expect(JSON.stringify(content)).not.toMatch(
      /annualFeeChf|contractMonths|supportHours|102000|120000|protocol|session|pending/i
    );
    expect(updateModelContextAsync.mock.invocationCallOrder[0]).toBeLessThan(
      sendFollowUpMessageAsync.mock.invocationCallOrder[0]
    );
  });

  it('does not send a question when Ready context synchronization fails', async () => {
    const { context, sendFollowUpMessageAsync } = bridgeContext({
      updateModelContextAsync: jest.fn().mockRejectedValue(new Error('no context'))
    });
    const readySession: INegotiationSession = {
      ...pendingSession,
      state: { ...pendingSession.state, pending: undefined }
    };

    await expect(
      deliverPracticeQuestion(
        context,
        SAAS_RENEWAL_SCENARIO,
        readySession,
        'What matters most?'
      )
    ).rejects.toThrow(/could not prepare the question/i);
    expect(sendFollowUpMessageAsync).not.toHaveBeenCalled();
  });

  it('awaits protocol v5 context before sending only the player message', async () => {
    const contextGate = deferred();
    const updateModelContextAsync = jest
      .fn()
      .mockReturnValue(contextGate.promise);
    const { context, sendFollowUpMessageAsync } = bridgeContext({
      updateModelContextAsync
    });

    const delivery = deliverNegotiationRelay(
      context,
      SAAS_RENEWAL_SCENARIO,
      pendingSession
    );
    const rejectionGuard = delivery.catch((error: unknown) => error);

    expect(updateModelContextAsync).toHaveBeenCalledTimes(1);
    expect(sendFollowUpMessageAsync).not.toHaveBeenCalled();

    const update = updateModelContextAsync.mock.calls[0][0] as {
      content?: unknown;
      structuredContent?: {
        protocol?: string;
        interactionState?: string;
        binding?: {
          pending?: {
            sessionItemId?: number;
            id?: string;
            playerMessage?: string;
            playerOffer?: Record<string, unknown>;
          };
        };
      };
    };
    expect(update.content).toBeUndefined();
    expect(update.structuredContent).toMatchObject({
      protocol: 'negotiation-lab/v5',
      interactionState: 'AwaitingCounterpart',
      binding: {
        pending: {
          sessionItemId: 42,
          id: 'pending-42-1',
          playerMessage,
          playerOffer: SAAS_RENEWAL_SCENARIO.playerOpening
        }
      }
    });

    contextGate.resolve();
    await delivery;
    await rejectionGuard;

    expect(sendFollowUpMessageAsync).toHaveBeenCalledTimes(1);
    expect(updateModelContextAsync.mock.invocationCallOrder[0]).toBeLessThan(
      sendFollowUpMessageAsync.mock.invocationCallOrder[0]
    );
    const content = sendFollowUpMessageAsync.mock.calls[0][0] as Array<{
      type?: string;
      text?: string;
    }>;
    expect(content).toHaveLength(1);
    expect(content[0]).toMatchObject({
      type: 'text',
      text: playerMessage
    });
    expect(content[0].text).not.toMatch(
      /Negotiation Lab turn|From the practice board|^\s*[#>*]|42|saas-renewal|annualFeeChf|contractMonths|supportHours|102000|120000|csv|protocol|briefing|posture|minimum|maximum|step/im
    );
  });

  it('sends nothing when model-context synchronization fails', async () => {
    const updateModelContextAsync = jest
      .fn()
      .mockRejectedValue(new Error('context transport failed'));
    const { context, sendFollowUpMessageAsync } = bridgeContext({
      updateModelContextAsync
    });

    await expect(
      deliverNegotiationRelay(
        context,
        SAAS_RENEWAL_SCENARIO,
        pendingSession
      )
    ).rejects.toThrow(/could not prepare.*Retry/i);
    expect(sendFollowUpMessageAsync).not.toHaveBeenCalled();
  });

  it('allows the same saved turn to retry after host rejection or throw', async () => {
    const sendFollowUpMessageAsync = jest
      .fn()
      .mockResolvedValueOnce({ isError: true })
      .mockRejectedValueOnce(new Error('delivery transport failed'))
      .mockResolvedValueOnce({});
    const { context, updateModelContextAsync } = bridgeContext({
      sendFollowUpMessageAsync
    });
    const deliver = (): Promise<void> =>
      deliverNegotiationRelay(
        context,
        SAAS_RENEWAL_SCENARIO,
        pendingSession
      );

    await expect(deliver()).rejects.toThrow(/did not accept.*Retry/i);
    await expect(deliver()).rejects.toThrow(/did not accept.*Retry/i);
    await expect(deliver()).resolves.toBeUndefined();

    expect(updateModelContextAsync).toHaveBeenCalledTimes(3);
    expect(sendFollowUpMessageAsync).toHaveBeenCalledTimes(3);
    expect(sendFollowUpMessageAsync.mock.calls[1][0]).toEqual(
      sendFollowUpMessageAsync.mock.calls[0][0]
    );
    expect(sendFollowUpMessageAsync.mock.calls[2][0]).toEqual(
      sendFollowUpMessageAsync.mock.calls[0][0]
    );
  });
});
