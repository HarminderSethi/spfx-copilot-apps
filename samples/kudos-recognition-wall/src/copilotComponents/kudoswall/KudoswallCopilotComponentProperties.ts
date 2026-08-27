/**
 * Properties schema for the Kudos & Recognition Wall Copilot Component.
 *
 * Defined with Zod and exported as JSON Schema via `zod-to-json-schema`. The
 * manifest references the compiled `.js` default export; the Copilot host uses
 * it to validate and describe the tool arguments Copilot passes when invoking
 * the component.
 *
 * - `recipient` present  → the compose card, pre-filled with that colleague.
 * - `recipient` absent   → the launcher digest.
 */
import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

const propertiesSchema = z.object({
  recipient: z
    .string()
    .optional()
    .describe('Name or email of the colleague to recognise, if the user named one.'),
  message: z
    .string()
    .optional()
    .describe('The recognition message text, if the user provided one.'),
});

export type IKudoswallCopilotComponentProperties = z.infer<typeof propertiesSchema>;

export default zodToJsonSchema(propertiesSchema);
