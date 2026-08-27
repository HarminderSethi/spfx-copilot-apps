import type { IntentOperation } from '../intents/intentCatalog';

export type OperationPhase = 'view' | 'edit' | 'decision' | 'confirm' | 'receipt';
export type OperationAction = 'submit' | 'approve' | 'decline' | 'defer' | 'use-alternative';

export interface IOperationState {
  readonly phase: OperationPhase;
  readonly action?: OperationAction;
  readonly rationale: string;
  readonly receiptId?: string;
}

export type OperationEvent =
  | { readonly type: 'edit' }
  | { readonly type: 'set-rationale'; readonly value: string }
  | { readonly type: 'review' }
  | { readonly type: 'choose'; readonly action: OperationAction }
  | { readonly type: 'confirm'; readonly receiptId: string };

export function createInitialOperationState(operation: IntentOperation): IOperationState {
  if (operation === 'submit') {
    return { phase: 'edit', rationale: '' };
  }
  if (operation === 'review') {
    return { phase: 'decision', rationale: '' };
  }
  return { phase: 'view', rationale: '' };
}

export function operationReducer(state: IOperationState, event: OperationEvent): IOperationState {
  if (event.type === 'edit' && state.phase !== 'receipt') {
    return { ...state, phase: state.action === 'submit' ? 'edit' : 'decision', action: undefined };
  }
  if (event.type === 'set-rationale' && state.phase !== 'receipt') {
    return { ...state, rationale: event.value };
  }
  if (event.type === 'review' && state.phase === 'edit' && state.rationale.trim().length > 0) {
    return { ...state, phase: 'confirm', action: 'submit' };
  }
  if (event.type === 'choose' && state.phase === 'decision' && state.rationale.trim().length > 0) {
    return { ...state, phase: 'confirm', action: event.action };
  }
  if (event.type === 'confirm' && state.phase === 'confirm' && state.action) {
    return { ...state, phase: 'receipt', receiptId: event.receiptId };
  }
  return state;
}

export interface IOperationReceipt {
  readonly id: string;
  readonly intentName: string;
  readonly action: OperationAction;
  readonly confirmedAtIso: string;
  readonly targetId?: string;
  readonly rationale?: string;
}

const RECEIPT_STORAGE_KEY = 'zava-it-concierge.receipts.v1';

export function readReceipts(storage: Storage | undefined): readonly IOperationReceipt[] {
  if (!storage) {
    return [];
  }
  try {
    return JSON.parse(storage.getItem(RECEIPT_STORAGE_KEY) ?? '[]') as IOperationReceipt[];
  } catch {
    return [];
  }
}

export function appendReceipt(storage: Storage | undefined, receipt: IOperationReceipt): void {
  if (!storage) {
    return;
  }
  try {
    const existing = readReceipts(storage);
    storage.setItem(RECEIPT_STORAGE_KEY, JSON.stringify([...existing, receipt]));
  } catch {
    // Session persistence is best effort; the confirmed state remains visible in memory.
  }
}