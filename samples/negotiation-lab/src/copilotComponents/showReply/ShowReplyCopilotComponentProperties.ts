import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

export const showReplyPropertiesSchema = z
  .object({
    sessionItemId: z
      .number()
      .int()
      .refine((value) => value > 0, 'Session item ID must be positive.')
      .describe('Session item number from the Negotiation Lab model context.'),
    replyToPendingId: z
      .string()
      .trim()
      .refine((value) => value.length > 0, 'Pending turn ID is required.')
      .describe(
        'Pending turn correlation value copied from the Negotiation Lab model context.'
      ),
    counterpartMessage: z
      .string()
      .trim()
      .refine((value) => value.length > 0, 'Counterpart message is required.')
      .describe('A concise, in-character reply grounded in the model context.'),
    outcome: z
      .enum(['counter', 'accept', 'decline'])
      .describe('Whether the counterpart counters, accepts, or declines.'),
    proposedTermsCsv: z
      .string()
      .describe(
        'For a counter, absolute terms as one issueKey,value row per line. Empty for accept or decline.'
      )
  })
  .strict();

export type IShowReplyCopilotComponentProperties = z.infer<
  typeof showReplyPropertiesSchema
>;

export default zodToJsonSchema(showReplyPropertiesSchema);
