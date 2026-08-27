import { APPROVAL_QUEUE_ITEMS, applyApprovalQueueDecision, filterApprovalQueue, restoreApprovalQueueDecisions, summarizeApprovalQueue } from './approvalQueue';

describe('approval queue', () => {
  it('summarizes pending and completed submissions', () => {
    expect(summarizeApprovalQueue(APPROVAL_QUEUE_ITEMS)).toEqual({ pending: 4, approved: 2, declined: 1 });
  });

  it('filters the default action view to pending submissions', () => {
    expect(filterApprovalQueue(APPROVAL_QUEUE_ITEMS, 'pending').map((item) => item.id)).toEqual(['REQ-2048', 'REQ-2051', 'REQ-2053', 'REQ-2058']);
    expect(filterApprovalQueue(APPROVAL_QUEUE_ITEMS, 'approved')).toHaveLength(2);
    expect(filterApprovalQueue(APPROVAL_QUEUE_ITEMS, 'declined')).toHaveLength(1);
    expect(filterApprovalQueue(APPROVAL_QUEUE_ITEMS, 'all')).toBe(APPROVAL_QUEUE_ITEMS);
  });

  it('records a decision without mutating the source queue', () => {
    const updated = applyApprovalQueueDecision(APPROVAL_QUEUE_ITEMS, 'REQ-2048', 'approved', ' Within policy and budget. ');

    expect(updated).not.toBe(APPROVAL_QUEUE_ITEMS);
    expect(updated.find((item) => item.id === 'REQ-2048')).toMatchObject({ status: 'approved', decisionRationale: 'Within policy and budget.' });
    expect(APPROVAL_QUEUE_ITEMS.find((item) => item.id === 'REQ-2048')).toMatchObject({ status: 'pending' });
  });

  it('does not replace an existing decision', () => {
    const updated = applyApprovalQueueDecision(APPROVAL_QUEUE_ITEMS, 'REQ-2042', 'approved', 'Changed decision.');

    expect(updated.find((item) => item.id === 'REQ-2042')).toEqual(APPROVAL_QUEUE_ITEMS.find((item) => item.id === 'REQ-2042'));
  });

  it('restores session decisions when the queue remounts', () => {
    const restored = restoreApprovalQueueDecisions(APPROVAL_QUEUE_ITEMS, [
      { itemId: 'REQ-2048', status: 'approved', rationale: 'Within policy.' },
      { itemId: 'REQ-2051', status: 'declined', rationale: 'Use the standard option.' }
    ]);

    expect(summarizeApprovalQueue(restored)).toEqual({ pending: 2, approved: 3, declined: 2 });
    expect(restored.find((item) => item.id === 'REQ-2051')?.decisionRationale).toBe('Use the standard option.');
  });
});