import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

const propertiesSchema = z.object({
  requestId: z.string().optional().describe('Request Id extracted from the user prompt when provided.'),
  focus: z.string().optional().describe('Focus extracted from the user prompt when provided.'),
  compareProjectId: z.string().optional().describe('Compare Project Id extracted from the user prompt when provided.'),
  decision: z.string().optional().describe('Decision extracted from the user prompt when provided.')
});

export type IReviewProjectRequestCopilotComponentProperties = z.infer<typeof propertiesSchema>;

export default zodToJsonSchema(propertiesSchema);
