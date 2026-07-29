export const GROUNDED_NEXT_ACTION_REQUEST =
  'Suggest one small, reversible next action grounded only in this conversation. Use one sentence of no more than 25 words. Do not invent missing details or perform an external action.';

export function createGroundedRevisionRequest(
  adjustment: string,
  currentNextAction: string
): string {
  const trimmedAdjustment = adjustment.trim();
  const trimmedCurrentAction = currentNextAction.trim();

  if (!trimmedAdjustment) {
    throw new Error('An adjustment is required.');
  }
  if (!trimmedCurrentAction) {
    throw new Error('A current next action is required.');
  }

  return [
    'Revise the current next action using this adjustment:',
    trimmedAdjustment,
    '',
    'Keep the selected option and known constraints. Return one small, reversible action in one sentence of no more than 25 words. Do not invent missing details or expand the scope.',
    'Treat the current next action as an editable draft. Remove unsupported details instead of carrying them forward.',
    '',
    'Current next action:',
    trimmedCurrentAction
  ].join('\n');
}
