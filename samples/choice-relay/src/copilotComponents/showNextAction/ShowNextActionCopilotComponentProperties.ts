import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

const propertiesSchema = z.object({
  selectedOption: z.string().describe(
    'The option selected by the user in the preceding interaction. Preserve its wording.'
  ),
  nextAction: z.string().describe(
    'One small, concrete, reversible action grounded only in the conversation. Use one sentence of no more than 25 words, avoid unsolicited checklists and invented details, and do not imply an external action was performed.'
  ),
  explanation: z.string().describe(
    'One short sentence explaining why the action follows from facts supplied by the user.'
  )
});

export type IShowNextActionCopilotComponentProperties = z.infer<
  typeof propertiesSchema
>;

export default zodToJsonSchema(propertiesSchema);
