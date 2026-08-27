import {
  getSessionActionReceipts,
  recordSessionAction,
  resetSessionActions,
  resetSessionActionStoreForTests,
  subscribeToSessionActions
} from './SessionActionStore';

describe('SessionActionStore', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    resetSessionActionStoreForTests();
  });

  test('records immutable session receipts and reloads them from storage', () => {
    const receipt = recordSessionAction({
      intentKey: 'SubmitWeeklyUpdate',
      recordId: 'WSU-2601',
      kind: 'submission',
      status: 'submitted',
      summary: 'Weekly update submitted'
    });
    expect(receipt.id).toBe('ZAVA-SUB-0001');
    expect(receipt.actor).toBe('Megan Bowen');
    expect(getSessionActionReceipts()).toHaveLength(1);

    resetSessionActionStoreForTests();
    expect(getSessionActionReceipts()).toEqual([receipt]);
  });

  test('notifies subscribers and reset restores the empty baseline', () => {
    const listener = jest.fn();
    const unsubscribe = subscribeToSessionActions(listener);
    recordSessionAction({ intentKey: 'ReviewProjectRequest', recordId: 'PRQ-2601', kind: 'decision', status: 'approved', summary: 'Project request approved' });
    expect(listener).toHaveBeenCalledTimes(1);
    resetSessionActions();
    expect(listener).toHaveBeenCalledTimes(2);
    expect(getSessionActionReceipts()).toEqual([]);
    unsubscribe();
  });
});