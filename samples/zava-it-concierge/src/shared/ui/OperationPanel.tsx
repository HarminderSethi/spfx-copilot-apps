import * as React from 'react';
import { Button } from '@fluentui/react-components';
import { CheckmarkCircle24Filled, Dismiss24Regular, Edit24Regular } from '@fluentui/react-icons';

import type { IIntentDefinition } from '../intents/intentCatalog';
import type { OperationAction } from '../operations/operationState';
import { appendReceipt, createInitialOperationState, operationReducer } from '../operations/operationState';
import { ApprovalQueuePanel } from './ApprovalQueuePanel';
import { ReviewOperationFields, SubmitOperationFields } from './PurposeOperationFields';

import styles from './IntentCanvasApp.module.scss';

export interface IOperationPanelProps {
  readonly compact?: boolean;
  readonly isDark: boolean;
  readonly intent: IIntentDefinition;
  readonly onExpandedChange?: (expanded: boolean) => void;
  readonly ownerWindow: Window | undefined;
  readonly properties?: Readonly<Record<string, unknown>>;
}

function createReceiptId(intentName: string): string {
  const prefix = intentName.replace(/[^A-Z]/g, '').slice(0, 4) || 'ZAVA';
  return `ZVA-${prefix}-0822`;
}

function getActionLabel(intentName: string, action: OperationAction | undefined): string {
  if (action === 'submit') return 'Submit request';
  if (action === 'defer') return 'Defer selected';
  if (action === 'use-alternative') return 'Use standard alternative';
  if (action === 'decline') return intentName === 'ReviewDeviceApproval' ? 'Reject request' : 'Decline exception';
  return intentName === 'ReviewPolicyException' ? 'Approve exception' : intentName === 'GetApprovalQueue' ? 'Approve selected' : 'Approve request';
}

function getReceiptLabel(action: OperationAction | undefined): string {
  if (action === 'approve') return 'Approved';
  if (action === 'decline') return 'Declined';
  if (action === 'defer') return 'Deferred';
  if (action === 'use-alternative') return 'Alternative selected';
  return 'Request confirmed';
}

function SingleOperationPanel(props: IOperationPanelProps): React.ReactElement {
  const [state, dispatch] = React.useReducer(operationReducer, props.intent.operation, createInitialOperationState);
  const [confirmationSummary, setConfirmationSummary] = React.useState('');

  if (props.intent.operation !== 'submit' && props.intent.operation !== 'review') {
    return <></>;
  }

  if (state.phase === 'receipt') {
    return (
      <section className={styles.receipt} aria-live="polite">
        <CheckmarkCircle24Filled aria-hidden="true" />
        <div>
          <strong>{getReceiptLabel(state.action)}</strong>
          <span>Receipt {state.receiptId} is recorded for this demo session.</span>
        </div>
      </section>
    );
  }

  const chooseAction = (action: OperationAction, summary: string): void => {
    setConfirmationSummary(summary);
    dispatch({ type: 'set-rationale', value: summary });
    dispatch({ type: 'choose', action });
  };
  const reviewSubmission = (summary: string): void => {
    setConfirmationSummary(summary);
    dispatch({ type: 'set-rationale', value: summary });
    dispatch({ type: 'review' });
  };
  const selectedActionLabel = getActionLabel(props.intent.name, state.action);

  return (
    <>
      <div className={props.compact ? styles.compactOperationPanel : undefined} hidden={state.phase === 'confirm'}>
        {props.intent.operation === 'submit'
          ? <SubmitOperationFields intent={props.intent} isDark={props.isDark} properties={props.properties ?? {}} onReview={reviewSubmission} />
          : <ReviewOperationFields intent={props.intent} isDark={props.isDark} onChoose={chooseAction} />}
      </div>
      {state.phase === 'confirm' && (
        <section className={styles.confirmation} aria-labelledby="zava-confirm-heading">
          <p className={styles.insightLabel}>Confirmation required</p>
          <h3 id="zava-confirm-heading">Confirm {selectedActionLabel.toLowerCase()}</h3>
          <p>{confirmationSummary}</p>
          <p>This changes the session-only demo record. No tenant action will be sent.</p>
          <div className={styles.actionRow}>
            <Button className={styles.actionButton} icon={<Edit24Regular />} onClick={() => dispatch({ type: 'edit' })}>Edit</Button>
            <Button
              appearance="primary"
              className={`${styles.actionButton} ${styles.actionButtonPrimary}`}
              icon={state.action === 'decline' ? <Dismiss24Regular /> : <CheckmarkCircle24Filled />}
              onClick={() => {
                const receiptId = createReceiptId(props.intent.name);
                if (state.action) {
                  appendReceipt(props.ownerWindow?.sessionStorage, { id: receiptId, intentName: props.intent.name, action: state.action, confirmedAtIso: '2026-08-22T09:00:00.000Z' });
                }
                dispatch({ type: 'confirm', receiptId });
              }}
            >
              {selectedActionLabel}
            </Button>
          </div>
        </section>
      )}
    </>
  );
}

export function OperationPanel(props: IOperationPanelProps): React.ReactElement {
  if (props.intent.name === 'GetApprovalQueue') {
    return <ApprovalQueuePanel compact={props.compact} isDark={props.isDark} onExpandedChange={props.onExpandedChange} ownerWindow={props.ownerWindow} />;
  }
  return <SingleOperationPanel {...props} />;
}