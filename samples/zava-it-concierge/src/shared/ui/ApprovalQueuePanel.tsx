import * as React from 'react';
import { Button, Field, Textarea } from '@fluentui/react-components';
import { ArrowLeft20Regular, CheckmarkCircle24Filled, Dismiss24Regular, Edit24Regular } from '@fluentui/react-icons';

import { PERSONA_MEDIA_BY_NAME } from '../assets/mediaCatalog';
import {
  APPROVAL_QUEUE_ITEMS,
  applyApprovalQueueDecision,
  filterApprovalQueue,
  restoreApprovalQueueDecisions,
  summarizeApprovalQueue,
  type ApprovalQueueFilter,
  type ApprovalQueueStatus,
  type IApprovalQueueItem
} from '../operations/approvalQueue';
import { appendReceipt, readReceipts, type OperationAction } from '../operations/operationState';
import { FormDropdown } from './PurposeOperationFields';

import styles from './IntentCanvasApp.module.scss';

interface IApprovalQueuePanelProps {
  readonly compact?: boolean;
  readonly isDark: boolean;
  readonly ownerWindow: Window | undefined;
  readonly onExpandedChange?: (expanded: boolean) => void;
}

type QueueView = 'list' | 'detail' | 'confirm';
type QueueDecision = Extract<OperationAction, 'approve' | 'decline'>;

const QUEUE_FILTERS: readonly ApprovalQueueFilter[] = ['pending', 'approved', 'declined', 'all'];

function money(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
}

function statusLabel(status: ApprovalQueueStatus): string {
  if (status === 'approved') return 'Approved';
  if (status === 'declined') return 'Declined';
  return 'Pending';
}

function filterLabel(filter: ApprovalQueueFilter): string {
  return filter === 'all' ? 'All' : statusLabel(filter);
}

function initials(name: string): string {
  return name.split(' ').map((part) => part[0]).join('').slice(0, 2);
}

function RequesterAvatar(props: { readonly item: IApprovalQueueItem }): React.ReactElement {
  const media = PERSONA_MEDIA_BY_NAME[props.item.requesterName];
  return media
    ? <img className={styles.queueAvatar} src={media.src} alt={media.alt} />
    : <span className={styles.queueAvatarFallback} aria-hidden="true">{initials(props.item.requesterName)}</span>;
}

export function ApprovalQueuePanel(props: IApprovalQueuePanelProps): React.ReactElement {
  const [items, setItems] = React.useState<readonly IApprovalQueueItem[]>(() => restoreApprovalQueueDecisions(
    APPROVAL_QUEUE_ITEMS,
    readReceipts(props.ownerWindow?.sessionStorage)
      .filter((receipt) => receipt.intentName === 'GetApprovalQueue' && receipt.targetId && (receipt.action === 'approve' || receipt.action === 'decline'))
      .map((receipt) => ({
        itemId: receipt.targetId as string,
        status: receipt.action === 'approve' ? 'approved' : 'declined',
        rationale: receipt.rationale ?? ''
      }))
  ));
  const [selectedId, setSelectedId] = React.useState(APPROVAL_QUEUE_ITEMS[0].id);
  const [view, setView] = React.useState<QueueView>('list');
  const [filter, setFilter] = React.useState<ApprovalQueueFilter>('pending');
  const [decision, setDecision] = React.useState<QueueDecision>();
  const [approvalCondition, setApprovalCondition] = React.useState('Standard approval');
  const [rationale, setRationale] = React.useState('');
  const [notice, setNotice] = React.useState('');
  const selectedItem = items.find((item) => item.id === selectedId) ?? items[0];
  const counts = summarizeApprovalQueue(items);
  const visibleItems = filterApprovalQueue(items, filter);
  const canDecide = rationale.trim().length > 0;

  const filterCount = (candidate: ApprovalQueueFilter): number => {
    if (candidate === 'pending') return counts.pending;
    if (candidate === 'approved') return counts.approved;
    if (candidate === 'declined') return counts.declined;
    return items.length;
  };

  const openItem = (item: IApprovalQueueItem): void => {
    setSelectedId(item.id);
    setRationale(item.decisionRationale ?? '');
    setDecision(undefined);
    setView('detail');
    props.onExpandedChange?.(true);
  };

  const returnToList = (): void => {
    setView('list');
    props.onExpandedChange?.(false);
  };

  const chooseDecision = (nextDecision: QueueDecision): void => {
    if (!canDecide) return;
    setDecision(nextDecision);
    setView('confirm');
  };

  const confirmDecision = (): void => {
    if (!decision) return;
    const nextStatus = decision === 'approve' ? 'approved' : 'declined';
    const decisionSummary = decision === 'approve' ? `${approvalCondition}. ${rationale}` : rationale;
    setItems((current) => applyApprovalQueueDecision(current, selectedItem.id, nextStatus, decisionSummary));
    appendReceipt(props.ownerWindow?.sessionStorage, {
      id: `ZVA-APQ-${selectedItem.id.replace('REQ-', '')}`,
      intentName: 'GetApprovalQueue',
      action: decision,
      confirmedAtIso: '2026-08-22T09:00:00.000Z',
      targetId: selectedItem.id,
      rationale: decisionSummary
    });
    setNotice(`${selectedItem.id} was ${nextStatus} for this demo session.`);
    setRationale('');
    setDecision(undefined);
    setView('list');
    props.onExpandedChange?.(false);
  };

  if (view === 'list') {
    return (
      <section className={`${styles.approvalQueuePanel} ${props.compact ? styles.approvalQueuePanelCompact : ''}`} aria-label="Approval queue">
        <div className={styles.queueViewHeader}>
          <div className={styles.queueViewHeading}>
            <strong>{filter === 'pending' ? 'Action items' : `${filterLabel(filter)} submissions`}</strong>
            <span>{visibleItems.length} {visibleItems.length === 1 ? 'item' : 'items'}</span>
          </div>
          <div className={styles.queueViewTabs} aria-label="Filter approval queue" role="group">
            {QUEUE_FILTERS.map((candidate) => (
              <Button
                aria-pressed={filter === candidate}
                className={styles.queueViewTab}
                key={candidate}
                onClick={() => { setFilter(candidate); setNotice(''); }}
                size="small"
              >
                <span className={styles.queueViewTabLabel}>{filterLabel(candidate)}</span><b>{filterCount(candidate)}</b>
              </Button>
            ))}
          </div>
        </div>
        {notice && <p className={styles.queueNotice} aria-live="polite">{notice}</p>}
        {visibleItems.length > 0 ? <ul className={styles.approvalQueueList}>
          {visibleItems.map((item) => (
            <li className={styles.approvalQueueItem} data-status={item.status} key={item.id}>
              <div className={styles.queueRequester}>
                <RequesterAvatar item={item} />
                <span>
                  <strong>{item.requesterName} / {item.requestTitle}</strong>
                  <small><b className={styles.queueItemState} data-status={item.status}>{statusLabel(item.status)}</b> / {item.status === 'pending' ? item.dueLabel : item.submittedLabel}</small>
                </span>
              </div>
              <Button aria-label={`${item.status === 'pending' ? 'Review' : 'View'} ${item.requesterName} ${item.requestTitle}`} className={styles.queueReviewButton} onClick={() => openItem(item)}>{item.status === 'pending' ? 'Review' : 'View'}</Button>
            </li>
          ))}
        </ul> : <p className={styles.queueEmpty}>No {filterLabel(filter).toLowerCase()} submissions.</p>}
      </section>
    );
  }

  if (view === 'confirm') {
    const actionLabel = decision === 'approve' ? 'Approve request' : 'Decline request';
    return (
      <section className={styles.confirmation} aria-labelledby="zava-queue-confirm-heading">
        <p className={styles.insightLabel}>Confirmation required</p>
        <h3 id="zava-queue-confirm-heading">Confirm {actionLabel.toLowerCase()}</h3>
        <p><strong>{selectedItem.id} / {selectedItem.requesterName}</strong></p>
        <p>{decision === 'approve' ? `${approvalCondition}. ` : ''}{rationale}</p>
        <p>This changes the session-only demo record. No tenant action will be sent.</p>
        <div className={styles.actionRow}>
          <Button className={styles.actionButton} icon={<Edit24Regular />} onClick={() => setView('detail')}>Edit</Button>
          <Button appearance="primary" className={`${styles.actionButton} ${decision === 'approve' ? styles.actionButtonPrimary : styles.actionButtonDanger}`} icon={decision === 'approve' ? <CheckmarkCircle24Filled /> : <Dismiss24Regular />} onClick={confirmDecision}>{actionLabel}</Button>
        </div>
      </section>
    );
  }

  return (
    <section className={`${styles.queueDetail} ${props.compact ? styles.queueDetailCompact : ''}`} aria-label={`Review ${selectedItem.id}`}>
      <Button appearance="subtle" className={styles.queueBackButton} icon={<ArrowLeft20Regular />} onClick={returnToList}>Back to approvals</Button>
      <div className={styles.queueDetailIdentity}>
        <RequesterAvatar item={selectedItem} />
        <div><span className={styles.queueStatus} data-status={selectedItem.status}>{statusLabel(selectedItem.status)}</span><h3>{selectedItem.requesterName} / {selectedItem.requestTitle}</h3><p>{selectedItem.requestDetail}</p></div>
      </div>
      <p className={styles.queueJustification}>{selectedItem.justification}</p>
      <dl className={styles.queueDetailGrid}>
        <div><dt>Submission</dt><dd>{selectedItem.id}<small>{selectedItem.submittedLabel} / {selectedItem.region}</small></dd></div>
        <div><dt>Request cost</dt><dd>{money(selectedItem.cost)}<small>{selectedItem.budgetSummary}</small></dd></div>
        <div><dt>Policy fit</dt><dd>{selectedItem.policySummary}<small>{selectedItem.dueLabel}</small></dd></div>
        <div><dt>Evidence</dt><dd>{selectedItem.evidenceSummary}<small>Budget, policy, age, and business need</small></dd></div>
      </dl>
      {selectedItem.status === 'pending' ? (
        <div className={styles.queueDecisionForm}>
          <Field className={styles.formField} label="Approval condition" required><FormDropdown ariaLabel="Approval condition" isDark={props.isDark} value={approvalCondition} onChange={setApprovalCondition} options={['Standard approval', 'Approve after old device return', 'Charge alternate cost center'].map((value) => ({ value, label: value }))} /></Field>
          <Field className={styles.formField} hint="Document the evidence and consequence behind this decision." label="Decision rationale" required><Textarea className={styles.editableControl} id="zava-queue-rationale" resize="vertical" value={rationale} onChange={(_event, data) => setRationale(data.value)} /></Field>
          <div className={styles.actionRow}>
            <Button appearance="primary" className={`${styles.actionButton} ${styles.actionButtonPrimary}`} disabled={!canDecide} icon={<CheckmarkCircle24Filled />} onClick={() => chooseDecision('approve')}>Approve request</Button>
            <Button className={`${styles.actionButton} ${styles.actionButtonDanger}`} disabled={!canDecide} icon={<Dismiss24Regular />} onClick={() => chooseDecision('decline')}>Decline request</Button>
          </div>
        </div>
      ) : (
        <div className={styles.queueDecisionRecord} data-status={selectedItem.status}>
          <strong>{statusLabel(selectedItem.status)}</strong>
          <span>{selectedItem.decisionRationale}</span>
        </div>
      )}
    </section>
  );
}