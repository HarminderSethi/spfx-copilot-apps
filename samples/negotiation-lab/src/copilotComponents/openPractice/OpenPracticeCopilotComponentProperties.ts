import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

export const MAX_COUNTERPART_ANSWER_LENGTH = 1600;
export const MAX_PLAYER_QUESTION_LENGTH = 800;
export const MAX_SCENARIO_KEY_LENGTH = 100;
export const MAX_QUESTION_CONTEXT_ID_LENGTH = 100;

function boundedText(maximumLength: number): z.ZodEffects<z.ZodString, string> {
  return z.string().transform((value) => value.trim().slice(0, maximumLength));
}

export const openPracticePropertiesSchema = z
  .object({
    mode: z
      .enum(['open', 'answer'])
      .optional()
      .describe(
        'Open or resume the board, or show a counterpart answer inside it.'
      ),
    scenarioKey: z
      .string()
      .transform((value) => value.trim().slice(0, MAX_SCENARIO_KEY_LENGTH))
      .optional()
      .describe(
        'In answer mode, copy the current scenario key from Negotiation Lab model context.'
      ),
    questionContextId: boundedText(MAX_QUESTION_CONTEXT_ID_LENGTH)
      .optional()
      .describe(
        'In answer mode, copy the opaque question context value from Negotiation Lab model context.'
      ),
    playerQuestion: boundedText(MAX_PLAYER_QUESTION_LENGTH)
      .optional()
      .describe('In answer mode, copy the player question verbatim.'),
    counterpartMessage: boundedText(MAX_COUNTERPART_ANSWER_LENGTH)
      .optional()
      .describe(
        'In answer mode, provide a concise answer in the current counterpart persona.'
      )
  })
  .strip();

export type IOpenPracticeCopilotComponentProperties = z.infer<
  typeof openPracticePropertiesSchema
>;

export default zodToJsonSchema(openPracticePropertiesSchema);
