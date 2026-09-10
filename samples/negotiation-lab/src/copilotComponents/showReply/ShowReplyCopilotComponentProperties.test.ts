import { showReplyPropertiesSchema } from './ShowReplyCopilotComponentProperties';

const valid = {
  sessionItemId: 42,
  replyToPendingId: 'pending-42-example',
  counterpartMessage: 'I can move if the commitment grows.',
  outcome: 'counter' as const,
  proposedTermsCsv: 'price,110\nterm,24'
};

describe('NegotiationLabShowReply properties', () => {
  it('accepts the exact lean reply contract', () => {
    expect(showReplyPropertiesSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects player-message and player-terms fields outside the reply contract', () => {
    expect(
      showReplyPropertiesSchema.safeParse({
        ...valid,
        playerMessage: 'Can we improve the price?',
        playerTermsCsv: 'price,100\nterm,24'
      }).success
    ).toBe(false);
  });

  it('rejects empty messages and invalid SharePoint item numbers', () => {
    expect(
      showReplyPropertiesSchema.safeParse({
        ...valid,
        sessionItemId: 0,
        counterpartMessage: ' '
      }).success
    ).toBe(false);
  });

  it('requires the pending turn correlation value', () => {
    expect(
      showReplyPropertiesSchema.safeParse({
        ...valid,
        replyToPendingId: ' '
      }).success
    ).toBe(false);
  });

  it.each(['answer', 'end', 'agreement'])('rejects the unsupported outcome %s', (outcome) => {
    expect(showReplyPropertiesSchema.safeParse({ ...valid, outcome }).success).toBe(
      false
    );
  });
});
