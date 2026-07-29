export const CHOICE_SELECTION_TITLE =
  'Choice Relay selection';

export interface IChoiceSelectionRequest {
  selectedOption: string;
  instruction: string;
}

function toMarkdownQuote(value: string): string {
  return value
    .split(/\r?\n/)
    .map((line) => '> ' + line)
    .join('\n');
}

export function createChoiceSelectionMessage(
  request: IChoiceSelectionRequest
): string {
  const selectedOption = request.selectedOption.trim();
  const instruction = request.instruction.trim();

  if (!selectedOption) {
    throw new Error('A selected option is required.');
  }
  if (!instruction) {
    throw new Error('An instruction is required.');
  }

  return [
    '## ' + CHOICE_SELECTION_TITLE,
    '',
    '**I selected**',
    toMarkdownQuote(selectedOption),
    '',
    '**Please**',
    toMarkdownQuote(instruction),
    '',
    'Show the response in the Choice Relay result component.'
  ].join('\n');
}
