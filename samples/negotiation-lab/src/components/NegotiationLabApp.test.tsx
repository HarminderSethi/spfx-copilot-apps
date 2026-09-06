import * as React from 'react';
import { act } from 'react-dom/test-utils';
import { createRoot, type Root } from 'react-dom/client';

import type {
  INegotiationReply,
  INegotiationSession,
  NegotiationOffer
} from '../domain/types';
import {
  JOB_OFFER_SCENARIO,
  NEGOTIATION_SCENARIOS,
  SAAS_RENEWAL_SCENARIO
} from '../domain/scenarioCatalog';
import { formatValue } from '../shared/offers';
import { NEGOTIATOR_STYLES } from '../domain/negotiatorStyle';
import NegotiationLabApp, {
  type INegotiationLabActions,
  type NegotiationLabView
} from './NegotiationLabApp';

(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT?: boolean })
  .IS_REACT_ACT_ENVIRONMENT = true;

const scenario = SAAS_RENEWAL_SCENARIO;
const session: INegotiationSession = {
  itemId: 42,
  revision: '"1"',
  scenarioKey: scenario.key,
  status: 'Active',
  state: {
    draftOffer: { ...scenario.playerOpening },
    counterpartOffer: { ...scenario.counterpartOpening },
    exchanges: []
  }
};
const pendingSession: INegotiationSession = {
  ...session,
  state: {
    ...session.state,
    pending: {
      id: 'pending-test-1',
      message: 'Please review this package.',
      offer: { ...scenario.playerOpening }
    }
  }
};
const counterReply: INegotiationReply = {
  sessionItemId: session.itemId,
  replyToPendingId: 'pending-test-1',
  counterpartMessage:
    'I can match your price and support for the longer commitment.',
  outcome: 'counter',
  proposedTermsCsv:
    'annualFeeChf,102000\ncontractMonths,36\nsupportHours,16'
};

type TestActions = jest.Mocked<INegotiationLabActions>;

function createActions(): TestActions {
  return {
    provision: jest.fn().mockResolvedValue(undefined),
    reload: jest.fn().mockResolvedValue(undefined),
    start: jest.fn().mockResolvedValue(undefined),
    ask: jest.fn().mockResolvedValue(undefined),
    send: jest.fn().mockResolvedValue(undefined),
    retry: jest.fn().mockResolvedValue(undefined),
    editPending: jest.fn().mockResolvedValue(undefined),
    applyReply: jest.fn().mockResolvedValue(undefined),
    acceptCounterProposal: jest.fn().mockResolvedValue(undefined),
    endPractice: jest.fn().mockResolvedValue(undefined),
    chooseAnother: jest.fn().mockResolvedValue(undefined)
  };
}

interface IRenderedView {
  actions: TestActions;
  container: HTMLDivElement;
}

const mountedRoots: Root[] = [];

function renderView(
  view: NegotiationLabView,
  actions: TestActions = createActions()
): IRenderedView {
  const container = document.createElement('div');
  const root = createRoot(container);
  mountedRoots.push(root);
  act(() => {
    root.render(
      <NegotiationLabApp
        view={view}
        actions={actions}
        hostContext={{
          theme: 'dark',
          displayMode: 'inline',
          availableDisplayModes: ['inline', 'fullscreen']
        }}
        locale="en-US"
        idPrefix="test-"
        onRequestFullscreen={jest.fn().mockResolvedValue(undefined)}
      />
    );
  });
  return { actions, container };
}

afterEach(() => {
  act(() => mountedRoots.splice(0).forEach((root) => root.unmount()));
});

function accessibleName(element: Element): string {
  return (element.getAttribute('aria-label') ?? element.textContent ?? '').trim();
}

function button(container: HTMLElement, name: string): HTMLButtonElement {
  const match = Array.from(container.querySelectorAll('button')).find(
    (candidate) => accessibleName(candidate) === name
  );
  if (!match) throw new Error(`Button “${name}” was not rendered.`);
  return match;
}

function group(container: HTMLElement, name: string): HTMLElement {
  const match = Array.from(container.querySelectorAll('[role="group"]')).find(
    (candidate) => accessibleName(candidate) === name
  );
  if (!match) throw new Error(`Group “${name}” was not rendered.`);
  return match as HTMLElement;
}

function activePanel(container: HTMLElement): HTMLElement {
  const panel = container.querySelector<HTMLElement>('[role="tabpanel"]:not([hidden])');
  if (!panel) throw new Error('No active tab panel was rendered.');
  return panel;
}

async function click(element: HTMLElement): Promise<void> {
  await act(async () => {
    element.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await Promise.resolve();
    await Promise.resolve();
  });
}

function typeMessage(textarea: HTMLTextAreaElement, value: string): void {
  act(() => {
    Object.getOwnPropertyDescriptor(
      HTMLTextAreaElement.prototype,
      'value'
    )?.set?.call(textarea, value);
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
  });
}

function completedSession(agreement?: NegotiationOffer): INegotiationSession {
  return {
    ...session,
    status: 'Completed',
    state: {
      draftOffer: { ...(agreement ?? scenario.playerOpening) },
      counterpartOffer: { ...(agreement ?? scenario.counterpartOpening) },
      exchanges: [
        {
          playerMessage: pendingSession.state.pending?.message ?? '',
          playerOffer: { ...scenario.playerOpening },
          counterpartMessage: agreement ? 'We have a deal.' : 'No agreement.',
          outcome: agreement ? 'counter' : 'decline',
          ...(agreement ? { counterpartOffer: { ...agreement } } : {})
        }
      ],
      ...(agreement ? { agreement: { ...agreement } } : {}),
      completionReason: agreement ? 'agreement' : 'counterpart-declined'
    }
  };
}

describe('Negotiation Lab participant contract', () => {
  it.each(NEGOTIATOR_STYLES)('starts with $label and shows the saved style on every session view', async (style) => {
    const { container, actions } = renderView({ kind: 'picker', scenarios: [scenario] });
    const select = container.querySelector('select') as HTMLSelectElement;
    expect(select.value).toBe('medium');
    act(() => { select.value = style.id; select.dispatchEvent(new Event('change', { bubbles: true })); });
    expect(container.textContent).toContain(style.approach);
    await click(button(container, 'Start practice'));
    expect(actions.start).toHaveBeenCalledWith(scenario.key, style.id);
    const saved = { ...pendingSession, state: { ...pendingSession.state, negotiatorStyle: style.id } };
    const views: NegotiationLabView[] = [
      { kind: 'board', scenario, session: { ...saved, state: { ...saved.state, pending: undefined } } },
      { kind: 'pending', scenario, session: saved },
      { kind: 'reply', scenario, session: saved, reply: counterReply },
      { kind: 'completed', scenario, session: { ...saved, status: 'Completed', state: { ...saved.state, pending: undefined, completionReason: 'player-ended' } } }
    ];
    for (const view of views) {
      const rendered = renderView(view).container;
      expect(rendered.textContent).toContain(`Negotiator: ${style.label}`);
      expect(rendered.querySelector('select')).toBeNull();
    }
    expect(renderView({ kind: 'board', scenario, session }).container.textContent).toContain('Negotiator: Medium');
  });
  it('keeps the two-list setup actionable', async () => {
    const { actions, container } = renderView({
      kind: 'setup',
      targetSiteUrl: 'https://contoso.sharepoint.com/sites/practice',
      canProvision: true
    });

    expect(container.textContent).toContain('two small lists');
    await click(button(container, 'Create the two lists'));
    expect(actions.provision).toHaveBeenCalledTimes(1);
  });

  it('starts the scenario selected on the picker', async () => {
    const { actions, container } = renderView({
      kind: 'picker',
      scenarios: [scenario, JOB_OFFER_SCENARIO]
    });
    const choices = container.querySelectorAll<HTMLElement>('[role="radio"]');

    expect(choices).toHaveLength(2);
    await click(choices[1]);
    await click(button(container, 'Start practice'));
    expect(actions.start).toHaveBeenCalledWith(JOB_OFFER_SCENARIO.key, 'medium');
  });

  it('separates a question from an offer and preserves both drafts between tabs', async () => {
    const { actions, container } = renderView({ kind: 'board', scenario, session });
    const tabs = container.querySelectorAll<HTMLElement>('[role="tab"]');

    expect(Array.from(tabs).map(accessibleName)).toEqual(['Ask a question', 'Make an offer']);
    expect(tabs[0].getAttribute('aria-selected')).toBe('true');
    expect(activePanel(container).textContent).toContain('This does not change your terms or use a round.');
    expect(activePanel(container).textContent).not.toContain('Your draft — not sent');
    expect(container.querySelectorAll('[role="tabpanel"]')).toHaveLength(2);
    expect(container.querySelector('#test-offer-panel')?.hasAttribute('hidden')).toBe(true);

    const question = container.querySelector('#test-question') as HTMLTextAreaElement;
    typeMessage(question, '  What matters most to you?  ');
    await click(button(container, 'Make an offer'));
    expect(container.textContent).toContain('Your draft — not sent');
    await click(button(group(container, 'Annual fee'), 'Increase Annual fee'));
    expect(container.querySelector('.nl-positions')?.textContent).toContain('CHF\u00a0114,000');
    expect(container.querySelector('.nl-positions')?.textContent).not.toContain('CHF\u00a0102,000');
    expect(container.querySelector('.nl-positions')?.textContent).not.toContain('CHF\u00a0105,000');
    const offerMessage = container.querySelector('#test-offer-message') as HTMLTextAreaElement;
    typeMessage(offerMessage, '  I can trade term for price.  ');

    await click(button(container, 'Ask a question'));
    expect((container.querySelector('#test-question') as HTMLTextAreaElement).value).toBe('  What matters most to you?  ');
    expect(activePanel(container).textContent).toContain('Unsent offer changes will reset when the answer opens.');
    await click(button(container, 'Ask counterpart'));
    expect(actions.ask).toHaveBeenCalledWith('What matters most to you?');
    expect(actions.send).not.toHaveBeenCalled();

    await click(button(container, 'Make an offer'));
    expect((container.querySelector('#test-offer-message') as HTMLTextAreaElement).value).toBe('  I can trade term for price.  ');
    expect(group(container, 'Annual fee').querySelector('[aria-live="polite"]')?.textContent).toBe('CHF\u00a0105,000');
  });

  it.each(NEGOTIATION_SCENARIOS)('shows only their opening terms before a first offer and labels the editable draft for $title', async (current) => {
    const { container } = renderView({
      kind: 'board', scenario: current,
      session: { ...session, scenarioKey: current.key, state: {
        draftOffer: { ...current.playerOpening }, counterpartOffer: { ...current.counterpartOpening }, exchanges: []
      } }
    });
    const comparison = container.querySelector('.nl-positions') as HTMLTableElement;
    expect(comparison.caption?.textContent).toBe('Their opening terms');
    expect(comparison.textContent).not.toContain('Your last offer');
    current.issues.forEach((issue, index) => {
      const cells = comparison.tBodies[0].rows[index].cells;
      expect(cells).toHaveLength(2);
      expect(cells[1].textContent).toBe(formatValue(issue, current.counterpartOpening[issue.key], 'en-US'));
    });
    await click(button(container, 'Make an offer'));
    expect(activePanel(container).textContent).toContain('Your draft — not sent');
    expect(comparison.closest('[role="tabpanel"]')).toBeNull();
    current.issues.forEach((issue) => {
      const field = group(container, issue.label);
      expect(field.querySelector('.nl-term-help')?.textContent).toBe(issue.description);
      expect(field.getAttribute('aria-describedby')).toBe(field.querySelector('.nl-term-help')?.id);
    });
  });

  it('shows recorded offers after a round without presenting a local draft as agreed terms', () => {
    const { container } = renderView({ kind: 'board', scenario, session: {
      ...session, state: { ...session.state,
        draftOffer: { ...scenario.playerOpening, annualFeeChf: 99000 },
        counterpartOffer: { ...scenario.counterpartOpening, annualFeeChf: 114000 },
        exchanges: [{ playerMessage: 'My offer', playerOffer: scenario.playerOpening,
          counterpartMessage: 'My counter', outcome: 'counter' }]
      }
    } });
    const comparison = container.querySelector('.nl-positions');
    expect(comparison?.textContent).toContain('Last recorded offers');
    expect(comparison?.textContent).toContain('Your last offer');
    expect(comparison?.textContent).toContain('Their counteroffer');
    expect(comparison?.textContent).toContain('CHF\u00a0102,000');
    expect(comparison?.textContent).toContain('CHF\u00a0114,000');
    expect(comparison?.textContent).not.toContain('CHF\u00a099,000');
  });

  it('opens an edited offer directly and sends only that offer draft', async () => {
    const { actions, container } = renderView({
      kind: 'board',
      scenario,
      session,
      initialOfferMessage: '  Here is my offer.  '
    });
    const textarea = container.querySelector('#test-offer-message') as HTMLTextAreaElement;

    expect(button(container, 'Make an offer').getAttribute('aria-selected')).toBe('true');
    expect(textarea.value).toBe('  Here is my offer.  ');
    scenario.issues.forEach((issue) => expect(group(container, issue.label)).toBeTruthy());

    await click(button(group(container, 'Annual fee'), 'Increase Annual fee'));
    await click(button(container, 'Send offer'));
    expect(actions.send).toHaveBeenCalledWith('Here is my offer.', {
      annualFeeChf: 105000,
      contractMonths: 12,
      supportHours: 16
    });
    expect(actions.ask).not.toHaveBeenCalled();
  });

  it('returns an answer on the question tab while the offer remains available', async () => {
    const { container } = renderView({
      kind: 'board',
      scenario,
      session,
      answer: {
        question: 'What matters most?',
        counterpartMessage: 'Predictability matters most.'
      }
    });

    const answer = container.querySelector('[aria-label="Counterpart answer"]');
    expect(answer?.textContent).toContain('What matters most?');
    expect(answer?.textContent).toContain('Predictability matters most.');
    expect(button(container, 'Ask counterpart')).toBeTruthy();
    expect(activePanel(container).textContent).not.toContain('Your draft — not sent');
    await click(button(container, 'Make an offer'));
    expect(button(container, 'Send offer')).toBeTruthy();
    await click(button(group(container, 'Contract term (months)'), 'Increase Contract term (months)'));
    expect(
      group(container, 'Contract term (months)').querySelector('[aria-live="polite"]')?.textContent
    ).toBe('24');
  });

  it('keeps a pending offer recoverable through Retry or Edit', async () => {
    const { actions, container } = renderView({
      kind: 'pending',
      scenario,
      session: pendingSession,
      problem: 'Copilot could not answer.'
    });

    expect(container.textContent).toContain('Your turn is saved');
    expect(container.textContent).toContain('Please review this package.');
    expect(container.textContent).toContain('never creates a second exchange');
    await click(button(container, 'Retry'));
    await click(button(container, 'Edit message and terms'));
    expect(actions.retry).toHaveBeenCalledTimes(1);
    expect(actions.editPending).toHaveBeenCalledTimes(1);
    expect(actions.send).not.toHaveBeenCalled();
  });

  it('shows one valid counteroffer with explicit accept or continue decisions', async () => {
    const accepted = renderView({
      kind: 'reply',
      scenario,
      session: pendingSession,
      reply: counterReply
    });
    const actionNames = Array.from(
      accepted.container.querySelectorAll('.nl-actions button')
    ).map(accessibleName);

    expect(accepted.container.textContent).toContain('Preview — not saved');
    expect(accepted.container.textContent).toContain('Matches your offer');
    expect(accepted.container.textContent).toContain('They moved from');
    expect(actionNames).toEqual(['Accept and finish', 'Make another offer']);
    await click(button(accepted.container, 'Accept and finish'));
    expect(accepted.actions.acceptCounterProposal).toHaveBeenCalledTimes(1);

    const continued = renderView({
      kind: 'reply',
      scenario,
      session: pendingSession,
      reply: counterReply
    });
    await click(button(continued.container, 'Make another offer'));
    expect(continued.actions.applyReply).toHaveBeenCalledTimes(1);
  });

  it('fails closed when a proposed counter does not concede anything', async () => {
    const { actions, container } = renderView({
      kind: 'reply',
      scenario,
      session: pendingSession,
      reply: {
        ...counterReply,
        proposedTermsCsv:
          'annualFeeChf,120000\ncontractMonths,36\nsupportHours,8'
      }
    });

    expect(container.querySelector('[role="alert"]')?.textContent).toContain(
      'did not improve any term'
    );
    expect(
      Array.from(container.querySelectorAll('.nl-actions button')).map(accessibleName)
    ).toEqual(['Edit my offer']);
    await click(button(container, 'Edit my offer'));
    expect(actions.editPending).toHaveBeenCalledTimes(1);
    expect(actions.applyReply).not.toHaveBeenCalled();
    expect(actions.acceptCounterProposal).not.toHaveBeenCalled();
  });

  it.each(['accept', 'decline'] as const)('keeps %s with conflicting terms recoverable instead of enabling confirmation', async (outcome) => {
    const { actions, container } = renderView({
      kind: 'reply',
      scenario,
      session: pendingSession,
      reply: { ...counterReply, outcome }
    });
    expect(container.querySelector('[role="alert"]')?.textContent).toContain('acceptance or decline');
    expect(Array.from(container.querySelectorAll('.nl-actions button')).map(accessibleName)).toEqual(['Edit my offer']);
    expect(container.querySelector('.nl-summary')).toBeNull();
    await click(button(container, 'Edit my offer'));
    expect(actions.editPending).toHaveBeenCalledTimes(1);
    expect(actions.applyReply).not.toHaveBeenCalled();
    expect(actions.acceptCounterProposal).not.toHaveBeenCalled();
  });

  it('confirms an accepted player offer and renders the saved agreement', async () => {
    const confirmation = renderView({
      kind: 'reply',
      scenario,
      session: pendingSession,
      reply: {
        ...counterReply,
        counterpartMessage: 'I accept your package.',
        outcome: 'accept',
        proposedTermsCsv: ''
      }
    });
    await click(button(confirmation.container, 'Accept and finish'));
    expect(confirmation.actions.applyReply).toHaveBeenCalledTimes(1);

    const agreement = { ...scenario.playerOpening };
    const completed = renderView({
      kind: 'completed',
      scenario,
      session: completedSession(agreement)
    });
    expect(completed.container.textContent).toContain('Agreement recorded');
    expect(completed.container.textContent).toContain('There is no hidden score');
    scenario.issues.forEach((issue) =>
      expect(completed.container.textContent).toContain(
        formatValue(issue, agreement[issue.key], 'en-US')
      )
    );
    await click(button(completed.container, 'Try another scenario'));
    expect(completed.actions.chooseAnother).toHaveBeenCalledTimes(1);
  });

  it('never renders internal IDs, field keys, or raw tool data', () => {
    const agreement = { ...scenario.playerOpening };
    const views: NegotiationLabView[] = [
      { kind: 'picker', scenarios: [scenario] },
      { kind: 'board', scenario, session },
      {
        kind: 'pending',
        scenario,
        session: pendingSession,
        problem: 'Update itemId 42 failed in the relay protocol.'
      },
      { kind: 'reply', scenario, session: pendingSession, reply: counterReply },
      { kind: 'completed', scenario, session: completedSession(agreement) },
      {
        kind: 'error',
        message: 'SharePoint returned an OData error for session ID 42.'
      }
    ];
    const rendered = views
      .map((view) => renderView(view).container.textContent ?? '')
      .join('\n');

    expect(rendered).not.toMatch(
      /\b(binding|correlation|revision|event|handoff|payload|protocol|relay)\b|session\s+id/i
    );
    expect(rendered).not.toContain(String(session.itemId));
    expect(rendered).not.toContain(scenario.key);
    expect(rendered).not.toContain('annualFeeChf');
    expect(rendered).not.toContain(counterReply.replyToPendingId);
    expect(rendered).not.toContain(counterReply.proposedTermsCsv);
  });
});
