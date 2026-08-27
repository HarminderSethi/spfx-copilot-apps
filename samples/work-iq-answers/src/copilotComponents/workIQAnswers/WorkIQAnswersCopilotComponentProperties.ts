/**
 * Zod schema, exported as JSON Schema via `zod-to-json-schema`. The manifest
 * points at the compiled `.js` default export for the Copilot host to
 * validate tool arguments against.
 */
import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

const propertiesSchema = z.object({
  question: z
    .string()
    .describe(
      "The user's question about their work, in their own words. Pass the question " +
        'as the user phrased it rather than a summary or keywords — Work IQ grounds ' +
        'the answer in the full phrasing. For example: "What did we decide in the Q3 ' +
        'planning meeting?"'
    )
});

export type IWorkIQAnswersCopilotComponentProperties = z.infer<typeof propertiesSchema>;

export default zodToJsonSchema(propertiesSchema);
