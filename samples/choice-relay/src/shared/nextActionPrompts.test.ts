import {
  GROUNDED_NEXT_ACTION_REQUEST,
  createGroundedRevisionRequest
} from './nextActionPrompts';

describe('Choice Relay follow-up prompts', () => {
  it('asks for one grounded and reversible next action', () => {
    expect(GROUNDED_NEXT_ACTION_REQUEST).toContain('one small, reversible');
    expect(GROUNDED_NEXT_ACTION_REQUEST).toContain(
      'Do not invent missing details'
    );
    expect(GROUNDED_NEXT_ACTION_REQUEST).toContain('no more than 25 words');
  });

  it('keeps a revision scoped to the adjustment and current action', () => {
    const text = createGroundedRevisionRequest(
      'Make it possible in five minutes.',
      'Draft three briefing bullets.'
    );

    expect(text).toContain('Make it possible in five minutes.');
    expect(text).toContain('Draft three briefing bullets.');
    expect(text).toContain('Do not invent missing details or expand the scope.');
    expect(text).toContain('editable draft');
    expect(text).toContain('Remove unsupported details');
  });

  it('rejects an empty adjustment or current action', () => {
    expect(() =>
      createGroundedRevisionRequest(' ', 'Draft three bullets.')
    ).toThrow('An adjustment is required.');
    expect(() =>
      createGroundedRevisionRequest('Make it shorter.', ' ')
    ).toThrow('A current next action is required.');
  });
});
