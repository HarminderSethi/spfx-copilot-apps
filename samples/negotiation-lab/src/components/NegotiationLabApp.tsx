import * as React from 'react';
import type { ICopilotComponentHostContext } from '@microsoft/sp-copilot-component';

import type {
  INegotiationReply,
  INegotiationScenario,
  INegotiationSession,
  NegotiationIssue,
  NegotiationOffer,
  NegotiationValue
} from '../domain/types';
import {
  type CounterProposalProblem,
  inspectCounterProposal,
  replyTermsProblem,
  MAX_PLAYER_MESSAGE_LENGTH
} from '../domain/negotiation';
import { formatValue, validateOffer } from '../shared/offers';
import { NEGOTIATOR_STYLES, getNegotiatorStyle, type NegotiatorStyle } from '../domain/negotiatorStyle';

export type NegotiationLabView =
  | { kind: 'loading' }
  | {
      kind: 'setup';
      targetSiteUrl: string;
      canProvision: boolean;
      problem?: string;
      progress?: string;
    }
  | { kind: 'picker'; scenarios: INegotiationScenario[] }
  | {
      kind: 'board';
      scenario: INegotiationScenario;
      session: INegotiationSession;
      answer?: {
        question: string;
        counterpartMessage: string;
      };
      initialOfferMessage?: string;
      notice?: string;
    }
  | {
      kind: 'pending';
      scenario: INegotiationScenario;
      session: INegotiationSession;
      problem?: string;
    }
  | {
      kind: 'reply';
      scenario: INegotiationScenario;
      session: INegotiationSession;
      reply: INegotiationReply;
    }
  | {
      kind: 'completed';
      scenario: INegotiationScenario;
      session: INegotiationSession;
    }
  | { kind: 'error'; message: string };

export interface INegotiationLabActions {
  provision(): Promise<void>;
  reload(): Promise<void>;
  start(scenarioKey: string, style: NegotiatorStyle): Promise<void>;
  ask(question: string): Promise<void>;
  send(message: string, offer: NegotiationOffer): Promise<void>;
  retry(): Promise<void>;
  editPending(): Promise<void>;
  applyReply(): Promise<void>;
  acceptCounterProposal(): Promise<void>;
  endPractice(): Promise<void>;
  chooseAnother(): Promise<void>;
}

export interface INegotiationLabAppProps {
  view: NegotiationLabView;
  actions: INegotiationLabActions;
  hostContext: ICopilotComponentHostContext;
  locale: string;
  idPrefix: string;
  onRequestFullscreen(): Promise<void>;
}

const css = `
.nl-positions{width:100%;table-layout:fixed;border-collapse:collapse;margin:12px 0;color:var(--nl-text1);font-size:12px}.nl-positions caption{text-align:left;font-size:14px;font-weight:600;margin-bottom:6px}.nl-positions th,.nl-positions td{padding:6px 4px;border-bottom:1px solid var(--nl-stroke2);text-align:right;vertical-align:top;overflow-wrap:anywhere}.nl-positions th:first-child{width:44%;padding-left:0;text-align:left;font-weight:400;color:var(--nl-text2)}.nl-positions thead th{font-weight:600;color:var(--nl-text3)}.nl-term-help{display:block;margin-top:4px;color:var(--nl-text3);font-size:12px;line-height:1.4;font-weight:400}
.nl-shell{box-sizing:border-box;width:100%;min-height:280px;padding:16px;container-type:inline-size;color:var(--nl-text1);background:var(--nl-page);font:14px/1.5 Segoe UI,system-ui,-apple-system,BlinkMacSystemFont,sans-serif}
.nl-shell *{box-sizing:border-box}.nl-card{position:relative;width:100%;max-width:560px;margin:0 auto;padding:24px;border:1px solid var(--nl-stroke2);border-radius:8px;background:var(--nl-card);box-shadow:var(--nl-shadow)}
.nl-fullscreen .nl-card:not(.nl-board-card){max-width:560px}.nl-fullscreen .nl-board-card{max-width:960px}
.nl-top{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}.nl-eyebrow{margin:0;color:var(--nl-text3);font-size:12px;line-height:1.5;font-weight:600;letter-spacing:.05em;text-transform:uppercase;overflow-wrap:anywhere}.nl-title{margin:8px 0 12px;font-size:20px;line-height:1.25;font-weight:600;overflow-wrap:anywhere}
.nl-body{margin:0 0 16px;color:var(--nl-text2)}.nl-caption{margin:8px 0;color:var(--nl-text3);font-size:12px;overflow-wrap:anywhere}.nl-label{display:block;margin:16px 0 8px;color:var(--nl-text1);font-size:14px;font-weight:600}.nl-alert{margin:12px 0;color:var(--nl-error)}.nl-status-line{margin:12px 0;color:var(--nl-text2)}
.nl-button{min-height:36px;padding:8px 16px;border-radius:4px;font:inherit;font-weight:600;white-space:normal;overflow-wrap:anywhere;cursor:pointer}.nl-button:disabled{cursor:default;opacity:.55}.nl-primary{border:1px solid var(--nl-brand);color:#fff;background:var(--nl-brand)}.nl-primary:hover:not(:disabled){background:var(--nl-brand-hover)}.nl-secondary{border:1px solid var(--nl-stroke1);color:var(--nl-text1);background:transparent}.nl-subtle{padding:6px 4px;border:0;color:var(--nl-text2);background:transparent}.nl-interactive:focus-visible{outline:2px solid var(--nl-brand);outline-offset:2px}.nl-full-action{width:100%;margin-top:20px}
.nl-status-pill{display:inline-flex;align-items:center;gap:8px;max-width:100%;padding:4px 12px;border:1px solid;border-radius:999px;font-size:12px;font-weight:600;overflow-wrap:anywhere}.nl-status-pill::before{width:8px;height:8px;flex:0 0 8px;border-radius:50%;background:currentColor;content:''}.nl-saved{color:var(--nl-saved-fg);border-color:var(--nl-saved-border);background:var(--nl-saved-bg)}.nl-waiting{color:var(--nl-wait-fg);border-color:var(--nl-wait-border);background:var(--nl-wait-bg)}
.nl-radio-group{display:grid;gap:8px;margin:16px 0}.nl-radio{width:100%;min-height:44px;padding:12px;border:1px solid var(--nl-stroke1);border-radius:6px;color:var(--nl-text1);background:transparent;text-align:left;font:inherit;cursor:pointer}.nl-radio[aria-checked=true]{padding:11px;border:2px solid var(--nl-brand)}.nl-radio-title,.nl-radio-line,.nl-radio-detail{display:block;overflow-wrap:anywhere}.nl-radio-title{font-weight:600}.nl-radio-line{margin-top:2px;color:var(--nl-text3);font-size:12px}.nl-radio-detail{margin-top:8px;color:var(--nl-text2);font-size:13px;line-height:1.45}
.nl-textarea{display:block;width:100%;min-height:84px;padding:8px 10px;border:1px solid var(--nl-stroke1);border-radius:4px;color:var(--nl-text1);background:var(--nl-subtle);font:inherit;resize:vertical}.nl-textarea::placeholder{color:var(--nl-text3);opacity:1}.nl-textarea:focus{border-color:var(--nl-brand);outline:2px solid var(--nl-brand);outline-offset:2px}.nl-field-help{margin:6px 0 0;color:var(--nl-text2);font-size:12px}.nl-terms-grid{display:grid;gap:8px}.nl-stepper{display:flex;align-items:center;justify-content:space-between;gap:12px;min-width:0;flex-wrap:wrap;color:var(--nl-text2)}.nl-stepper-label{flex:1 1 140px;overflow-wrap:anywhere}.nl-stepper-control{display:flex;align-items:stretch;max-width:100%;border:1px solid var(--nl-stroke1);border-radius:4px;overflow:visible}.nl-stepper-button{width:36px;min-height:36px;padding:0;border:0;color:var(--nl-text1);background:transparent;font:20px/1 Segoe UI,sans-serif;cursor:pointer}.nl-stepper-button:disabled{cursor:default;opacity:.35}.nl-stepper-value{display:flex;min-width:92px;min-height:36px;align-items:center;justify-content:center;padding:4px 8px;border-right:1px solid var(--nl-stroke1);border-left:1px solid var(--nl-stroke1);color:var(--nl-text1);font-weight:600;text-align:center;overflow-wrap:anywhere}
.nl-tabs{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));margin:20px 0 0;border-bottom:1px solid var(--nl-stroke1)}.nl-tab{min-height:40px;padding:8px 12px;border:0;border-bottom:3px solid transparent;color:var(--nl-text2);background:transparent;font:inherit;font-weight:600;cursor:pointer}.nl-tab[aria-selected=true]{border-bottom-color:var(--nl-brand);color:var(--nl-text1)}.nl-tab:disabled{cursor:default;opacity:.55}.nl-tab-panel{padding-top:4px}.nl-tab-panel[hidden]{display:none}
.nl-footer,.nl-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.nl-footer{justify-content:space-between;margin-top:16px}.nl-actions{margin-top:20px}.nl-transcript{margin-top:12px}.nl-transcript-entry{margin-top:12px}.nl-speaker{display:block;color:var(--nl-text3);font-size:12px;font-weight:600}.nl-transcript-message{margin:2px 0;color:var(--nl-text2);font-size:13px}.nl-transcript-rail{display:none}.nl-quote-box,.nl-answer{margin:16px 0;padding:12px;border-radius:6px;background:var(--nl-subtle)}.nl-quote{margin:0;color:var(--nl-text1);font-style:italic}.nl-quote-terms{margin:8px 0 0;color:var(--nl-text3);font-size:12px;overflow-wrap:anywhere}.nl-answer-question{margin:2px 0 8px;color:var(--nl-text3);font-size:12px}.nl-answer-message{margin:0;color:var(--nl-text1);font-size:14px;line-height:1.5}
.nl-summary{margin:8px 0 0}.nl-summary-row{display:flex;justify-content:space-between;gap:16px;padding:6px 0}.nl-summary dt{color:var(--nl-text2);overflow-wrap:anywhere}.nl-summary dd{margin:0;color:var(--nl-text1);font-weight:600;text-align:right;overflow-wrap:anywhere}.nl-delta{display:block;color:var(--nl-text3);font-size:12px;font-weight:400}.nl-reply{margin:12px 0 16px;color:var(--nl-text1);font-size:15px;line-height:1.55}.nl-section-title{margin:16px 0 6px;font-size:14px;font-weight:600}
@container (max-width:359px){.nl-card{padding:20px}.nl-stepper{align-items:flex-start}.nl-stepper-control{width:100%}.nl-stepper-value{flex:1}}
@container (min-width:640px){.nl-fullscreen .nl-board-layout{display:grid;grid-template-columns:minmax(0,1fr) minmax(240px,320px);gap:24px}.nl-fullscreen .nl-board-footer{justify-content:flex-end}.nl-fullscreen .nl-transcript-disclosure{display:none}.nl-fullscreen .nl-transcript-rail{display:block;padding-left:24px;border-left:1px solid var(--nl-stroke2)}.nl-fullscreen .nl-stepper{align-items:flex-start}.nl-fullscreen .nl-stepper-control{width:100%}.nl-fullscreen .nl-stepper-value{min-width:0;flex:1}}
@container (min-width:900px){.nl-fullscreen .nl-terms-grid{grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}}
`;

const baseVariables = {
  '--nl-brand': '#0f6cbd', '--nl-brand-hover': '#115ea3',
  '--nl-text1': '#242424', '--nl-text2': '#424242', '--nl-text3': '#616161',
  '--nl-page': '#ffffff', '--nl-card': '#ffffff', '--nl-subtle': '#fafafa',
  '--nl-stroke1': '#d1d1d1', '--nl-stroke2': '#e0e0e0',
  '--nl-saved-fg': '#0e700e', '--nl-saved-bg': '#f1faf1', '--nl-saved-border': '#9fd89f',
  '--nl-wait-fg': '#6d4c00', '--nl-wait-bg': '#fdf6e2', '--nl-wait-border': '#e8d197',
  '--nl-error': '#c50f1f', '--nl-shadow': '0 1px 2px rgba(0,0,0,.06)'
};

const darkVariables = {
  '--nl-brand': '#115ea3', '--nl-brand-hover': '#0f6cbd',
  '--nl-text1': '#ffffff', '--nl-text2': '#d6d6d6', '--nl-text3': '#adadad',
  '--nl-page': '#242424', '--nl-card': '#292929', '--nl-subtle': '#333333',
  '--nl-stroke1': '#5c5c5c', '--nl-stroke2': '#4a4a4a',
  '--nl-saved-fg': '#6ccb5f', '--nl-saved-bg': '#1d2f1d', '--nl-saved-border': '#3a5a3a',
  '--nl-wait-fg': '#f0c862', '--nl-wait-bg': '#3a3115', '--nl-wait-border': '#6d5a1e',
  '--nl-error': '#f1707b', '--nl-shadow': 'none'
};

type Run = (action: () => Promise<void>) => void;

interface ICardOptions {
  eyebrow?: string; status?: React.ReactNode;
  title?: string; board?: boolean;
  allowFullscreen?: boolean;
}

function errorText(error: unknown): string {
  return error instanceof Error ? error.message : 'Something went wrong.';
}

function safeMessage(message: string, fallback: string): string {
  const containsInternalDetail =
    /\b(?:binding|correlation|revision|event|handoff|payload|protocol|relay|csv|sharepoint|odata|etag|session\s*id|item\s*id|scenario\s*key|statejson|termsjson)\b/i
      .test(message) ||
    /\b[a-z][A-Za-z0-9]*[A-Z][A-Za-z0-9]*\b/.test(message) ||
    /\b[0-9a-f]{8}-[0-9a-f-]{27,}\b/i.test(message) ||
    /https?:\/\//i.test(message);
  return containsInternalDetail
    ? fallback
    : message;
}

function displayRole(role: string): string {
  return role.toLocaleLowerCase();
}

function ActionButton(props: {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'subtle';
  full?: boolean;
  busy?: boolean;
  disabled?: boolean;
  className?: string;
  expanded?: boolean;
  onClick(): void;
}): React.ReactElement {
  const variant = props.variant ?? 'primary';
  return (
    <button
      type="button"
      className={`nl-button nl-interactive nl-${variant}${props.full ? ' nl-full-action' : ''}${props.className ? ` ${props.className}` : ''}`}
      disabled={props.busy || props.disabled}
      aria-expanded={props.expanded}
      onClick={props.onClick}
    >
      {props.children}{props.busy && variant === 'primary' ? '…' : null}
    </button>
  );
}

function StatusPill(props: { children: React.ReactNode; saved?: boolean }): React.ReactElement {
  return <span role="status" className={`nl-status-pill ${props.saved ? 'nl-saved' : 'nl-waiting'}`}>{props.children}</span>;
}

function CardShell(props: {
  hostContext: ICopilotComponentHostContext;
  onRequestFullscreen(): Promise<void>;
  run: Run; busy: boolean; localError?: string;
  eyebrow?: string; status?: React.ReactNode; title?: string;
  board?: boolean; allowFullscreen?: boolean;
  children: React.ReactNode;
}): React.ReactElement {
  const canFullscreen = props.allowFullscreen !== false &&
    props.hostContext.displayMode !== 'fullscreen' &&
    (props.hostContext.availableDisplayModes?.indexOf('fullscreen') ?? -1) >= 0;
  return (
    <section className={`nl-card${props.board ? ' nl-board-card' : ''}`}>
      {props.status || props.eyebrow || canFullscreen ? (
        <div className="nl-top">
          <div>{props.status ?? (props.title ? <div className="nl-eyebrow">{props.eyebrow}</div> : <h1 className="nl-eyebrow">{props.eyebrow}</h1>)}</div>
          {canFullscreen ? <ActionButton variant="subtle" busy={props.busy} onClick={() => props.run(props.onRequestFullscreen)}>Open full screen</ActionButton> : null}
        </div>
      ) : null}
      {props.status && props.eyebrow ? <h1 className="nl-eyebrow" style={{ marginTop: 12 }}>{props.eyebrow}</h1> : null}
      {props.title ? <h1 className="nl-title">{props.title}</h1> : null}
      {props.localError ? (
        <p role="alert" className="nl-alert">
          {safeMessage(
            props.localError,
            'The practice could not complete that action.'
          )}{' '}
          Nothing was lost — your saved practice is safe.
        </p>
      ) : null}
      {props.children}
    </section>
  );
}

function StepperField(props: {
  issue: NegotiationIssue;
  value: NegotiationValue | undefined; locale: string; disabled: boolean;
  onChange(value: NegotiationValue): void;
}): React.ReactElement {
  const issue = props.issue;
  const helpId = React.useId();
  const numberValue = typeof props.value === 'number' ? props.value : issue.kind === 'number' ? issue.minimum : 0;
  const choiceIndex = issue.kind === 'choice' ? issue.options.findIndex(({ value }) => value === props.value) : -1;
  const atMinimum = issue.kind === 'number' ? numberValue <= issue.minimum : choiceIndex <= 0;
  const atMaximum = issue.kind === 'number' ? numberValue >= issue.maximum : choiceIndex >= issue.options.length - 1;
  const move = (direction: -1 | 1): void => {
    if (issue.kind === 'number') {
      props.onChange(Math.max(issue.minimum, Math.min(issue.maximum, numberValue + direction * issue.step)));
    } else {
      const next = Math.max(0, Math.min(issue.options.length - 1, choiceIndex + direction));
      props.onChange(issue.options[next].value);
    }
  };
  return (
    <div role="group" aria-label={issue.label} aria-describedby={issue.description ? helpId : undefined} className="nl-stepper">
      <span className="nl-stepper-label">
        {issue.label}
        {issue.description ? <span id={helpId} className="nl-term-help">{issue.description}</span> : null}
      </span>
      <span className="nl-stepper-control">
        <button
          type="button"
          className="nl-stepper-button nl-interactive"
          aria-label={`Decrease ${issue.label}`}
          disabled={props.disabled || atMinimum}
          onClick={() => move(-1)}
        >
          −
        </button>
        <span className="nl-stepper-value" aria-live="polite">
          {formatValue(issue, props.value, props.locale)}
        </span>
        <button
          type="button"
          className="nl-stepper-button nl-interactive"
          aria-label={`Increase ${issue.label}`}
          disabled={props.disabled || atMaximum}
          onClick={() => move(1)}
        >
          +
        </button>
      </span>
    </div>
  );
}

function TermsSummary(props: {
  scenario: INegotiationScenario;
  offer: NegotiationOffer; locale: string;
  playerOffer?: NegotiationOffer;
  priorCounterpartOffer?: NegotiationOffer;
}): React.ReactElement {
  return (
    <dl className="nl-summary">
      {props.scenario.issues.map((issue) => {
        const proposedValue = props.offer[issue.key];
        const playerValue = props.playerOffer?.[issue.key];
        const priorCounterpartValue = props.priorCounterpartOffer?.[issue.key];
        return (
          <div className="nl-summary-row" key={issue.key}>
            <dt>{issue.label}</dt>
            <dd>
              {formatValue(issue, proposedValue, props.locale)}
              {props.playerOffer ? (
                <span className="nl-delta">
                  {proposedValue === playerValue
                    ? 'Matches your offer'
                    : `Your offer: ${formatValue(issue, playerValue, props.locale)}`}
                </span>
              ) : null}
              {props.priorCounterpartOffer ? (
                <span className="nl-delta">
                  {proposedValue === priorCounterpartValue
                    ? 'Unchanged from their previous position'
                    : `They moved from ${formatValue(issue, priorCounterpartValue, props.locale)}`}
                </span>
              ) : null}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}

function PositionsSummary(props: {
  scenario: INegotiationScenario; session: INegotiationSession; locale: string;
}): React.ReactElement {
  const exchanges = props.session.state.exchanges;
  const latest = exchanges[exchanges.length - 1];
  return (
    <table className="nl-positions">
      <caption>{latest ? 'Last recorded offers' : 'Their opening terms'}</caption>
      <thead><tr><th scope="col">Term</th>{latest ? <th scope="col">Your last offer</th> : null}<th scope="col">{latest ? 'Their counteroffer' : 'Opening terms'}</th></tr></thead>
      <tbody>
        {props.scenario.issues.map((issue) => (
          <tr key={issue.key}>
            <th scope="row">{issue.label}</th>
            {latest ? <td>{formatValue(issue, latest.playerOffer[issue.key], props.locale)}</td> : null}
            <td>{formatValue(issue, props.session.state.counterpartOffer[issue.key], props.locale)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Transcript(props: { scenario: INegotiationScenario; session: INegotiationSession }): React.ReactElement {
  const exchanges = props.session.state.exchanges.slice(-3);
  return (
    <div className="nl-transcript">
      {exchanges.length ? exchanges.map((exchange, index) => (
        <div className="nl-transcript-entry" key={`${exchange.playerMessage}-${index}`}>
          <span className="nl-speaker">YOU</span>
          <p className="nl-transcript-message">{exchange.playerMessage}</p>
          <span className="nl-speaker">
            {displayRole(props.scenario.counterpartRole).toLocaleUpperCase()}
          </span>
          <p className="nl-transcript-message">{exchange.counterpartMessage}</p>
        </div>
      )) : <p className="nl-caption">No exchanges yet.</p>}
    </div>
  );
}

function ScenarioPicker(props: {
  scenarios: INegotiationScenario[];
  idPrefix: string; busy: boolean; run: Run;
  start(scenarioKey: string, style: NegotiatorStyle): Promise<void>;
  reload(): Promise<void>;
}): React.ReactElement {
  const [selected, setSelected] = React.useState(props.scenarios[0]?.key ?? '');
  const [style, setStyle] = React.useState<NegotiatorStyle>('medium');
  React.useEffect(() => {
    if (!props.scenarios.some(({ key }) => key === selected)) setSelected(props.scenarios[0]?.key ?? '');
  }, [props.scenarios, selected]);
  const onArrow = (event: React.KeyboardEvent<HTMLButtonElement>, index: number): void => {
    const direction = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 0;
    if (!direction) return;
    event.preventDefault();
    const next = (index + direction + props.scenarios.length) % props.scenarios.length;
    setSelected(props.scenarios[next].key);
    event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="radio"]')[next]?.focus();
  };
  if (!props.scenarios.length) {
    return <><p className="nl-body">No scenarios are available yet.</p><ActionButton busy={props.busy} onClick={() => props.run(props.reload)}>Check again</ActionButton></>;
  }
  return (
    <>
      <div role="radiogroup" aria-label="Practice scenarios" className="nl-radio-group">
        {props.scenarios.map((scenario, index) => {
          const active = scenario.key === selected;
          return (
            <button
              key={scenario.key}
              id={`${props.idPrefix}scenario-${index}`}
              type="button"
              role="radio"
              aria-checked={active}
              tabIndex={active ? 0 : -1}
              className="nl-radio nl-interactive"
              disabled={props.busy}
              onClick={() => setSelected(scenario.key)}
              onKeyDown={(event) => onArrow(event, index)}
            >
              <span className="nl-radio-title">{scenario.title}</span>
              <span className="nl-radio-line">You are the {displayRole(scenario.playerRole)} · they are the {displayRole(scenario.counterpartRole)}</span>
              {active ? <span className="nl-radio-detail">{scenario.briefing} {scenario.objective}</span> : null}
            </button>
          );
        })}
      </div>
      <label className="nl-label" htmlFor={`${props.idPrefix}style`}>Negotiator style</label>
      <select id={`${props.idPrefix}style`} className="nl-button nl-secondary nl-interactive" value={style} disabled={props.busy} aria-describedby={`${props.idPrefix}style-help`} onChange={(event) => setStyle(event.currentTarget.value as NegotiatorStyle)}>
        {NEGOTIATOR_STYLES.map(({ id, label }) => <option key={id} value={id}>{label}</option>)}
      </select>
      <p id={`${props.idPrefix}style-help`} className="nl-caption">{getNegotiatorStyle(style).approach} Applies throughout this practice.</p>
      <ActionButton full busy={props.busy} disabled={!selected} onClick={() => props.run(() => props.start(selected, style))}>Start practice</ActionButton>
    </>
  );
}

function ActiveBoard(props: {
  scenario: INegotiationScenario; session: INegotiationSession;
  answer?: { question: string; counterpartMessage: string };
  initialOfferMessage?: string; notice?: string;
  locale: string; idPrefix: string; busy: boolean; run: Run;
  ask(question: string): Promise<void>;
  send(message: string, offer: NegotiationOffer): Promise<void>;
  endPractice(): Promise<void>;
}): React.ReactElement {
  type ComposerTab = 'ask' | 'offer';
  const initialTab: ComposerTab = props.initialOfferMessage !== undefined ? 'offer' : 'ask';
  const [activeTab, setActiveTab] = React.useState<ComposerTab>(initialTab);
  const [question, setQuestion] = React.useState('');
  const [offerMessage, setOfferMessage] = React.useState(props.initialOfferMessage ?? '');
  const [offer, setOffer] = React.useState<NegotiationOffer>({ ...props.session.state.draftOffer });
  const [expanded, setExpanded] = React.useState(false);
  React.useEffect(() => {
    setActiveTab(props.initialOfferMessage !== undefined ? 'offer' : 'ask');
    setQuestion('');
    setOfferMessage(props.initialOfferMessage ?? '');
    setOffer({ ...props.session.state.draftOffer });
  }, [
    props.answer,
    props.initialOfferMessage,
    props.session.itemId,
    props.session.revision
  ]);
  const problems = validateOffer(props.scenario, offer);
  const offerDirty =
    !!offerMessage.trim() ||
    props.scenario.issues.some(
      (issue) => offer[issue.key] !== props.session.state.draftOffer[issue.key]
    );
  const count = props.session.state.exchanges.length;
  const tabs: ComposerTab[] = ['ask', 'offer'];
  const selectTab = (tab: ComposerTab): void => setActiveTab(tab);
  const onTabKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number): void => {
    let next = index;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % tabs.length;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = tabs.length - 1;
    else return;
    event.preventDefault();
    selectTab(tabs[next]);
    event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
  };
  return (
    <>
      <p className="nl-body">You are the {props.scenario.playerRole}, talking with the {props.scenario.counterpartRole}.</p>
      <p className="nl-caption">Aim: {props.scenario.objective}</p>
      <div className="nl-board-layout">
        <div>
          <PositionsSummary scenario={props.scenario} session={props.session} locale={props.locale} />
          {props.answer ? (
            <section className="nl-answer" aria-label="Counterpart answer">
              <span className="nl-speaker">{displayRole(props.scenario.counterpartRole).toLocaleUpperCase()}</span>
              <p className="nl-answer-question">You asked: {props.answer.question}</p>
              <p className="nl-answer-message">{props.answer.counterpartMessage}</p>
            </section>
          ) : null}
          <div role="tablist" aria-label="Choose how to continue" className="nl-tabs">
            {tabs.map((tab, index) => {
              const selected = activeTab === tab;
              const label = tab === 'ask' ? 'Ask a question' : 'Make an offer';
              return (
                <button
                  key={tab}
                  id={`${props.idPrefix}${tab}-tab`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls={`${props.idPrefix}${tab}-panel`}
                  tabIndex={selected ? 0 : -1}
                  className="nl-tab nl-interactive"
                  disabled={props.busy}
                  onClick={() => selectTab(tab)}
                  onKeyDown={(event) => onTabKeyDown(event, index)}
                >
                  {label}
                </button>
              );
            })}
          </div>
          <section
            id={`${props.idPrefix}ask-panel`}
            role="tabpanel"
            aria-labelledby={`${props.idPrefix}ask-tab`}
            className="nl-tab-panel"
            hidden={activeTab !== 'ask'}
          >
            <p className="nl-caption">Ask about priorities or constraints. This does not change your terms or use a round.</p>
            {offerDirty && activeTab === 'ask' ? (
              <p className="nl-caption">Unsent offer changes will reset when the answer opens.</p>
            ) : null}
            <label className="nl-label" htmlFor={`${props.idPrefix}question`}>Your question</label>
            <textarea
              id={`${props.idPrefix}question`}
              className="nl-textarea"
              rows={3}
              maxLength={MAX_PLAYER_MESSAGE_LENGTH}
              value={question}
              placeholder="What matters most to you?"
              disabled={props.busy || activeTab !== 'ask'}
              aria-describedby={!question.trim() ? `${props.idPrefix}question-help` : undefined}
              onChange={(event) => setQuestion(event.currentTarget.value)}
            />
            {!question.trim() ? <p id={`${props.idPrefix}question-help`} className="nl-field-help">Enter a question to enable asking.</p> : null}
            <div className="nl-actions">
              <ActionButton
                busy={props.busy}
                disabled={!question.trim() || activeTab !== 'ask'}
                onClick={() => props.run(() => props.ask(question.trim()))}
              >
                Ask counterpart
              </ActionButton>
            </div>
          </section>
          <section
            id={`${props.idPrefix}offer-panel`}
            role="tabpanel"
            aria-labelledby={`${props.idPrefix}offer-tab`}
            className="nl-tab-panel"
            hidden={activeTab !== 'offer'}
          >
            <p className="nl-caption">Adjust the terms and explain the trade. Sending records one negotiation round.</p>
            <label className="nl-label" htmlFor={`${props.idPrefix}offer-message`}>Message with your offer</label>
            <textarea
              id={`${props.idPrefix}offer-message`}
              className="nl-textarea"
              rows={3}
              maxLength={MAX_PLAYER_MESSAGE_LENGTH}
              value={offerMessage}
              placeholder="Explain the package you are proposing…"
              disabled={props.busy || activeTab !== 'offer'}
              aria-describedby={!offerMessage.trim() ? `${props.idPrefix}offer-message-help` : undefined}
              onChange={(event) => setOfferMessage(event.currentTarget.value)}
            />
            {!offerMessage.trim() ? <p id={`${props.idPrefix}offer-message-help`} className="nl-field-help">Enter a message to enable sending.</p> : null}
            <section aria-labelledby={`${props.idPrefix}terms-heading`}>
              <h2 id={`${props.idPrefix}terms-heading`} className="nl-label">Your draft — not sent</h2>
              <div className="nl-terms-grid">
                {props.scenario.issues.map((issue) => (
                  <StepperField
                    key={issue.key}
                    issue={issue}
                    value={offer[issue.key]}
                    locale={props.locale}
                    disabled={props.busy || activeTab !== 'offer'}
                    onChange={(value) => setOffer((current) => ({ ...current, [issue.key]: value }))}
                  />
                ))}
              </div>
            </section>
            {problems.length ? <p role="alert" className="nl-alert">{problems[0]}</p> : null}
            <div className="nl-actions">
              <ActionButton
                busy={props.busy}
                disabled={!offerMessage.trim() || !!problems.length || activeTab !== 'offer'}
                onClick={() => props.run(() => props.send(offerMessage.trim(), { ...offer }))}
              >
                Send offer
              </ActionButton>
            </div>
          </section>
          {props.notice ? <p role="status" className="nl-status-line">{safeMessage(props.notice, 'The practice was refreshed.')}</p> : null}
          <div className="nl-footer nl-board-footer">
            {count ? (
              <ActionButton
                variant="subtle"
                busy={props.busy}
                expanded={expanded}
                className="nl-transcript-disclosure"
                onClick={() => setExpanded((value) => !value)}
              >
                Recent exchanges ({count}) {expanded ? '⌃' : '⌄'}
              </ActionButton>
            ) : (
              <span />
            )}
            <ActionButton
              variant="subtle"
              busy={props.busy}
              onClick={() => props.run(props.endPractice)}
            >
              End practice
            </ActionButton>
          </div>
          {expanded && count ? <div className="nl-transcript-disclosure"><Transcript scenario={props.scenario} session={props.session} /></div> : null}
        </div>
        <aside className="nl-transcript-rail" aria-label="Recent exchanges">
          <div className="nl-eyebrow">RECENT EXCHANGES</div>
          <Transcript scenario={props.scenario} session={props.session} />
        </aside>
      </div>
    </>
  );
}

function PendingExchange(props: {
  scenario: INegotiationScenario; session: INegotiationSession;
  locale: string; problem?: string; busy: boolean; run: Run;
  retry(): Promise<void>;
  edit(): Promise<void>;
}): React.ReactElement {
  const pending = props.session.state.pending;
  if (!pending) throw new Error('A saved turn is required.');
  const terms = props.scenario.issues.map((issue) => formatValue(issue, pending.offer[issue.key], props.locale)).join(' · ');
  return (
    <>
      <p className="nl-body">Copilot has not answered yet. Retry sends the same turn again — it never creates a second exchange.</p>
      <div className="nl-quote-box"><p className="nl-quote">{pending.message}</p><p className="nl-quote-terms">{terms}</p></div>
      {props.problem ? (
        <p role="alert" className="nl-alert">
          {safeMessage(
            props.problem,
            'Copilot could not receive the saved turn.'
          )}{' '}
          Your message and terms stayed saved.
        </p>
      ) : null}
      <div className="nl-actions">
        <ActionButton busy={props.busy} onClick={() => props.run(props.retry)}>
          Retry
        </ActionButton>
        <ActionButton
          variant="secondary"
          busy={props.busy}
          onClick={() => props.run(props.edit)}
        >
          Edit message and terms
        </ActionButton>
      </div>
    </>
  );
}

const counterProblemCopy: Record<CounterProposalProblem, string> = {
  'invalid-terms':
    'Copilot proposed terms outside this scenario. Edit your offer and send again.',
  'repeats-player':
    'Copilot repeated your offer as a counteroffer. It must accept it or change at least one term.',
  'no-concession':
    'Copilot did not improve any term from its previous position. Edit your offer and try again.'
};

function ReplyPreview(props: {
  scenario: INegotiationScenario; session: INegotiationSession;
  reply: INegotiationReply; locale: string; busy: boolean; run: Run;
  apply(): Promise<void>;
  acceptCounterProposal(): Promise<void>;
  edit(): Promise<void>;
}): React.ReactElement {
  const pending = props.session.state.pending;
  const termsProblem = replyTermsProblem(props.reply);
  const counterInspection = props.reply.outcome === 'counter'
    ? inspectCounterProposal(props.scenario, props.session.state, props.reply)
    : undefined;
  const offer = props.reply.outcome === 'accept'
    ? pending?.offer
    : counterInspection?.offer;
  const counterProblem = counterInspection && !counterInspection.valid
    ? counterInspection.problem
    : undefined;
  const problem = termsProblem ?? (counterProblem ? counterProblemCopy[counterProblem] : undefined);
  const applyLabel = props.reply.outcome === 'accept'
    ? 'Accept and finish'
    : props.reply.outcome === 'decline'
      ? 'Finish practice'
      : 'Make another offer';
  return (
    <>
      <blockquote className="nl-reply">{props.reply.counterpartMessage}</blockquote>
      {offer && !termsProblem ? (
        <>
          <h2 className="nl-section-title">Their proposal</h2>
          <TermsSummary
            scenario={props.scenario}
            offer={offer}
            locale={props.locale}
            playerOffer={
              props.reply.outcome === 'counter' ? pending?.offer : undefined
            }
            priorCounterpartOffer={
              props.reply.outcome === 'counter'
                ? props.session.state.counterpartOffer
                : undefined
            }
          />
        </>
      ) : null}
      {problem ? (
        <p role="alert" className="nl-alert">
          {problem}
        </p>
      ) : null}
      <div className="nl-actions">
        {problem ? (
          <ActionButton variant="secondary" busy={props.busy} onClick={() => props.run(props.edit)}>
            Edit my offer
          </ActionButton>
        ) : (
          <>
            {props.reply.outcome === 'counter' ? (
              <ActionButton busy={props.busy} onClick={() => props.run(props.acceptCounterProposal)}>
                Accept and finish
              </ActionButton>
            ) : null}
            <ActionButton
              variant={props.reply.outcome === 'counter' ? 'secondary' : 'primary'}
              busy={props.busy}
              onClick={() => props.run(props.apply)}
            >
              {applyLabel}
            </ActionButton>
          </>
        )}
      </div>
      <p className="nl-caption">
        {problem
          ? 'Your offer is still saved. Return to it and try again.'
          : props.reply.outcome === 'counter'
            ? 'Accept and finish records these terms. Make another offer returns to the board.'
            : 'This reply is not saved until you confirm.'}
      </p>
    </>
  );
}

function Completed(props: {
  scenario: INegotiationScenario; session: INegotiationSession;
  locale: string; busy: boolean; run: Run;
  chooseAnother(): Promise<void>;
}): React.ReactElement {
  const agreement = props.session.state.agreement;
  const count = props.session.state.exchanges.length;
  return (
    <>
      <p className="nl-body">
        {agreement
          ? `You reached a package in ${count} exchange${count === 1 ? '' : 's'}. There is no hidden score — these terms are the result.`
          : 'The practice ended without an agreement. Start another scenario whenever you are ready.'}
      </p>
      {agreement ? (
        <TermsSummary
          scenario={props.scenario}
          offer={agreement}
          locale={props.locale}
        />
      ) : null}
      <ActionButton
        busy={props.busy}
        onClick={() => props.run(props.chooseAnother)}
      >
        Try another scenario
      </ActionButton>
    </>
  );
}

export default function NegotiationLabApp(props: INegotiationLabAppProps): React.ReactElement {
  const [busy, setBusy] = React.useState(false);
  const [localError, setLocalError] = React.useState<string>();
  const run = React.useCallback<Run>((action) => {
    setBusy(true);
    setLocalError(undefined);
    Promise.resolve().then(action).then(
      () => setBusy(false),
      (error: unknown) => {
        setLocalError(errorText(error));
        setBusy(false);
      }
    );
  }, []);
  const fullscreen = props.hostContext.displayMode === 'fullscreen';
  const shell = (content: React.ReactNode, options: ICardOptions = {}): React.ReactElement => (
    <CardShell
      hostContext={props.hostContext}
      onRequestFullscreen={props.onRequestFullscreen}
      run={run} busy={busy} localError={localError} {...options}
    >
      {'session' in props.view ? <p className="nl-caption">Negotiator: <strong>{getNegotiatorStyle(props.view.session.state.negotiatorStyle).label}</strong></p> : null}
      {content}
    </CardShell>
  );
  const content = (() => {
    switch (props.view.kind) {
      case 'loading':
        return shell(<p role="status" className="nl-status-line">Loading the practice…</p>, { allowFullscreen: false });
      case 'setup': {
        const view = props.view;
        const setupAction = view.canProvision ? props.actions.provision : props.actions.reload;
        return shell(
          <>
            <p className="nl-body">
              Practice needs two small lists on this site to store scenarios and your sessions. Creating them takes a moment and happens once.
            </p>
            <p className="nl-caption" style={{ wordBreak: 'break-word' }}>{view.targetSiteUrl}</p>
            {view.progress ? (
              <p role="status" className="nl-status-line">{safeMessage(view.progress, 'Preparing the two lists…')}</p>
            ) : null}
            {view.problem ? (
              <p role="alert" className="nl-alert">{safeMessage(view.problem, 'The two lists could not be prepared.')}</p>
            ) : null}
            <ActionButton busy={busy} onClick={() => run(setupAction)}>
              {view.canProvision ? 'Create the two lists' : 'Check access again'}
            </ActionButton>
          </>,
          { eyebrow: 'NEGOTIATION LAB', title: 'Set up practice' }
        );
      }
      case 'picker':
        return shell(
          <ScenarioPicker
            scenarios={props.view.scenarios}
            idPrefix={props.idPrefix} busy={busy} run={run}
            start={props.actions.start} reload={props.actions.reload}
          />,
          { eyebrow: 'NEGOTIATION LAB', title: 'Choose a scenario' }
        );
      case 'board': {
        const view = props.view;
        return shell(
          <ActiveBoard
            scenario={view.scenario} session={view.session}
            answer={view.answer} initialOfferMessage={view.initialOfferMessage}
            notice={view.notice}
            locale={props.locale} idPrefix={props.idPrefix} busy={busy} run={run}
            ask={props.actions.ask} send={props.actions.send}
            endPractice={props.actions.endPractice}
          />,
          { eyebrow: view.scenario.title.toLocaleUpperCase(), board: true }
        );
      }
      case 'pending': {
        const view = props.view;
        return shell(
          <PendingExchange
            scenario={view.scenario} session={view.session} locale={props.locale}
            problem={view.problem} busy={busy} run={run}
            retry={props.actions.retry} edit={props.actions.editPending}
          />,
          { status: <StatusPill>Waiting for Copilot</StatusPill>, title: 'Your turn is saved' }
        );
      }
      case 'reply':
        return shell(
          <ReplyPreview
            scenario={props.view.scenario} session={props.view.session} reply={props.view.reply}
            locale={props.locale} busy={busy} run={run}
            apply={props.actions.applyReply}
            acceptCounterProposal={props.actions.acceptCounterProposal}
            edit={props.actions.editPending}
          />,
          {
            status: <StatusPill>Preview — not saved</StatusPill>,
            eyebrow: `THE ${displayRole(props.view.scenario.counterpartRole).toLocaleUpperCase()} REPLIES`
          }
        );
      case 'completed': {
        const agreement = !!props.view.session.state.agreement;
        return shell(
          <Completed
            scenario={props.view.scenario} session={props.view.session}
            locale={props.locale} busy={busy} run={run}
            chooseAnother={props.actions.chooseAnother}
          />,
          { status: <StatusPill saved>Saved</StatusPill>, title: agreement ? 'Agreement recorded' : 'Practice ended' }
        );
      }
      case 'error':
        return shell(
          <>
            <p role="alert" className="nl-alert">
              {safeMessage(props.view.message, 'The practice could not open.')}{' '}
              Nothing was lost — your saved practice is safe.
            </p>
            <ActionButton busy={busy} onClick={() => run(props.actions.reload)}>
              Try again
            </ActionButton>
          </>,
          { title: 'Something went wrong' }
        );
      }
  })();
  const dark = props.hostContext.theme === 'dark';
  const themeVariables = dark ? darkVariables : baseVariables;
  return (
    <main
      className={`nl-shell${fullscreen ? ' nl-fullscreen' : ''}`}
      style={{ ...themeVariables, colorScheme: dark ? 'dark' : 'light' } as React.CSSProperties}
    >
      <style>{css}</style>
      {content}
    </main>
  );
}
