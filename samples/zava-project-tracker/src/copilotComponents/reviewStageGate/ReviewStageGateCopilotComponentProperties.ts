import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

const propertiesSchema = z.object({
  approvalId: z.string().optional().describe('Approval Id extracted from the user prompt when provided.'),
  projectId: z.string().optional().describe('Project Id extracted from the user prompt when provided.'),
  gateId: z.string().optional().describe('Gate Id extracted from the user prompt when provided.'),
  focus: z.string().optional().describe('Focus extracted from the user prompt when provided.'),
  decision: z.string().optional().describe('Decision extracted from the user prompt when provided.')
});

export type IReviewStageGateCopilotComponentProperties = z.infer<typeof propertiesSchema>;

export default zodToJsonSchema(propertiesSchema);
