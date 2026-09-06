import schema, {
  MAX_COUNTERPART_ANSWER_LENGTH,
  MAX_PLAYER_QUESTION_LENGTH,
  openPracticePropertiesSchema
} from './OpenPracticeCopilotComponentProperties';

describe('NegotiationLabOpenPractice properties', () => {
  it('keeps empty and explicit open calls compatible', () => {
    expect(openPracticePropertiesSchema.safeParse({}).success).toBe(true);
    expect(
      openPracticePropertiesSchema.safeParse({ mode: 'open' }).success
    ).toBe(true);
    expect(
      openPracticePropertiesSchema.safeParse({ mode: 'resume' }).success
    ).toBe(false);
  });

  it('accepts a bounded answer payload and trims its display strings', () => {
    const parsed = openPracticePropertiesSchema.safeParse({
      mode: 'answer',
      scenarioKey: '  saas-renewal  ',
      questionContextId: '  question-abc123-def456  ',
      playerQuestion: '  What matters most?  ',
      counterpartMessage: '  Predictability matters most.  '
    });

    expect(parsed.success).toBe(true);
    if (parsed.success && parsed.data.mode === 'answer') {
      expect(parsed.data).toEqual({
        mode: 'answer',
        scenarioKey: 'saas-renewal',
        questionContextId: 'question-abc123-def456',
        playerQuestion: 'What matters most?',
        counterpartMessage: 'Predictability matters most.'
      });
    }
    expect(schema).toMatchObject({
      type: 'object',
      additionalProperties: false,
      properties: {
        mode: { enum: ['open', 'answer'] },
        scenarioKey: { type: 'string' },
        questionContextId: { type: 'string' },
        playerQuestion: { type: 'string' },
        counterpartMessage: { type: 'string' }
      }
    });
  });

  it('accepts incomplete calls, bounds text, and strips unknown input', () => {
    const incomplete = openPracticePropertiesSchema.safeParse({
      mode: 'answer',
      scenarioKey: 'saas-renewal'
    });
    expect(incomplete.success).toBe(true);

    const parsed = openPracticePropertiesSchema.safeParse({
      mode: 'answer',
      scenarioKey: 'saas-renewal',
      playerQuestion: 'q'.repeat(MAX_PLAYER_QUESTION_LENGTH + 50),
      counterpartMessage: 'x'.repeat(MAX_COUNTERPART_ANSWER_LENGTH + 50),
      sessionItemId: 42
    });
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.playerQuestion).toHaveLength(MAX_PLAYER_QUESTION_LENGTH);
      expect(parsed.data.counterpartMessage).toHaveLength(
        MAX_COUNTERPART_ANSWER_LENGTH
      );
      expect(parsed.data).not.toHaveProperty('sessionItemId');
    }
  });
});
