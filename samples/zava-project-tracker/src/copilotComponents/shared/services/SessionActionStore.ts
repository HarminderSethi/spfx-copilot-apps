export type SessionActionKind = 'decision' | 'submission';
export type SessionActionStatus = 'approved' | 'returned' | 'rejected' | 'submitted';

export interface ISessionActionReceipt {
  id: string;
  intentKey: string;
  recordId: string;
  kind: SessionActionKind;
  status: SessionActionStatus;
  summary: string;
  actor: string;
  timestamp: string;
}

export interface IRecordSessionAction {
  intentKey: string;
  recordId: string;
  kind: SessionActionKind;
  status: SessionActionStatus;
  summary: string;
  actor?: string;
}

const storageKey = 'zava-project-tracker.session-actions.v1';
let receipts: ISessionActionReceipt[] | undefined;
const listeners = new Set<() => void>();

const getSessionStorage = (): Storage | undefined => {
  try {
    return typeof window !== 'undefined' ? window.sessionStorage : undefined;
  } catch {
    return undefined;
  }
};

const loadReceipts = (): ISessionActionReceipt[] => {
  if (receipts) return receipts;
  try {
    const stored = getSessionStorage()?.getItem(storageKey);
    const parsed = stored ? JSON.parse(stored) : [];
    receipts = Array.isArray(parsed) ? parsed : [];
  } catch {
    receipts = [];
  }
  return receipts;
};

const persist = (): void => {
  try {
    getSessionStorage()?.setItem(storageKey, JSON.stringify(loadReceipts()));
  } catch {
    // Sandboxed hosts may deny storage; the in-memory session remains authoritative.
  }
};

const notify = (): void => listeners.forEach((listener) => listener());

export const getSessionActionReceipts = (): ReadonlyArray<ISessionActionReceipt> => [...loadReceipts()];

export const recordSessionAction = (action: IRecordSessionAction): ISessionActionReceipt => {
  const sequence = loadReceipts().length + 1;
  const receipt: ISessionActionReceipt = {
    ...action,
    actor: action.actor || 'Megan Bowen',
    id: `ZAVA-${action.kind === 'decision' ? 'DEC' : 'SUB'}-${(`0000${sequence}`).slice(-4)}`,
    timestamp: new Date().toISOString()
  };
  receipts = [...loadReceipts(), receipt];
  persist();
  notify();
  return receipt;
};

export const subscribeToSessionActions = (listener: () => void): (() => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const resetSessionActions = (): void => {
  receipts = [];
  try {
    getSessionStorage()?.removeItem(storageKey);
  } catch {
    // Reset still succeeds for the in-memory session.
  }
  notify();
};

export const resetSessionActionStoreForTests = (): void => {
  receipts = undefined;
  listeners.clear();
};