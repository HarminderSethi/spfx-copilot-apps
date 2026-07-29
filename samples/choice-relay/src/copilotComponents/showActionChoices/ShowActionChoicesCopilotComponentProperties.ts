import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

const propertiesSchema = z.object({
  question: z.string().describe(
    'A short, neutral question grounded in the user request. It must not recommend an option.'
  ),
  options: z
    .array(z.string())
    .describe(
      'Two to four distinct, concise choices. They may be user-supplied or Copilot-generated, but each must be one reversible action grounded in the conversation without invented details or combined actions.'
    )
});

export type IShowActionChoicesCopilotComponentProperties = z.infer<
  typeof propertiesSchema
>;

export default zodToJsonSchema(propertiesSchema);
