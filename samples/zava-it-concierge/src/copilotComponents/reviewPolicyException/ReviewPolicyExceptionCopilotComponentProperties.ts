import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

const propertiesSchema = z.object({
  exceptionId: z.string().describe("Optional policy exception identifier to review.").optional()
});

export type IReviewPolicyExceptionCopilotComponentProperties = z.infer<typeof propertiesSchema>;

export default zodToJsonSchema(propertiesSchema);
