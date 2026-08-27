import { createInitialOperationState, operationReducer } from './operationState';

describe('operation state', () => {
  it('guards submit behind matched review and confirmation', () => {
    const editing = createInitialOperationState('submit');
    expect(operationReducer(editing, { type: 'confirm', receiptId: 'RCP-1' })).toBe(editing);
    expect(operationReducer(editing, { type: 'review' })).toBe(editing);

    const withRationale = operationReducer(editing, { type: 'set-rationale', value: 'Required for customer workshops.' });
    const confirming = operationReducer(withRationale, { type: 'review' });
    expect(confirming).toMatchObject({ phase: 'confirm', action: 'submit' });
    expect(operationReducer(confirming, { type: 'confirm', receiptId: 'RCP-1' })).toMatchObject({ phase: 'receipt', receiptId: 'RCP-1' });
  });

  it('guards decisions behind explicit choice and preserves rationale', () => {
    const decision = operationReducer(createInitialOperationState('review'), { type: 'set-rationale', value: 'Within policy and budget.' });
    const confirming = operationReducer(decision, { type: 'choose', action: 'approve' });

    expect(confirming).toMatchObject({ phase: 'confirm', action: 'approve', rationale: 'Within policy and budget.' });
    expect(operationReducer(confirming, { type: 'edit' })).toMatchObject({ phase: 'decision', action: undefined });
  });

  it('keeps receipts immutable', () => {
    const decision = operationReducer(createInitialOperationState('review'), { type: 'set-rationale', value: 'Outside policy.' });
    const receipt = operationReducer(
      operationReducer(decision, { type: 'choose', action: 'decline' }),
      { type: 'confirm', receiptId: 'RCP-2' }
    );

    expect(operationReducer(receipt, { type: 'edit' })).toBe(receipt);
    expect(operationReducer(receipt, { type: 'set-rationale', value: 'changed' })).toBe(receipt);
  });

  it('records queue deferral and policy alternatives as explicit decisions', () => {
    const decision = operationReducer(createInitialOperationState('review'), { type: 'set-rationale', value: 'Evidence reviewed.' });

    expect(operationReducer(decision, { type: 'choose', action: 'defer' })).toMatchObject({ phase: 'confirm', action: 'defer' });
    expect(operationReducer(decision, { type: 'choose', action: 'use-alternative' })).toMatchObject({ phase: 'confirm', action: 'use-alternative' });
  });
});