import {
  CHOICE_SELECTION_TITLE,
  createChoiceSelectionMessage
} from './choiceSelectionMessage';

describe('Choice Relay selection message', () => {
  it('creates a short readable user turn', () => {
    const text = createChoiceSelectionMessage({
      selectedOption: 'Draft the participant briefing',
      instruction:
        'Suggest one small, reversible next action grounded in this conversation.'
    });

    expect(text).toContain('## ' + CHOICE_SELECTION_TITLE);
    expect(text).toContain(
      '**I selected**\n> Draft the participant briefing'
    );
    expect(text).toContain(
      '**Please**\n> Suggest one small, reversible next action grounded in this conversation.'
    );
    expect(text).toContain(
      'Show the response in the Choice Relay result component.'
    );
    expect(text).not.toContain('schemaVersion');
    expect(text).not.toContain('Reference:');
    expect(text).not.toContain('Turn:');
  });

  it('keeps multiline instructions readable', () => {
    const text = createChoiceSelectionMessage({
      selectedOption: 'Review the open findings',
      instruction: 'Make it practical.\nKeep it short.'
    });

    expect(text).toContain('> Make it practical.\n> Keep it short.');
  });

  it('rejects an empty selection or instruction', () => {
    expect(() =>
      createChoiceSelectionMessage({
        selectedOption: ' ',
        instruction: 'Suggest a next action.'
      })
    ).toThrow('A selected option is required.');

    expect(() =>
      createChoiceSelectionMessage({
        selectedOption: 'Prepare the briefing',
        instruction: ' '
      })
    ).toThrow('An instruction is required.');
  });
});
