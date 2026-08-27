import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

const propertiesSchema = z.object({
  period: z.string().optional().describe('Period extracted from the user prompt when provided.'),
  projectId: z.string().optional().describe('Project Id extracted from the user prompt when provided.'),
  focus: z.string().optional().describe('Focus extracted from the user prompt when provided.'),
  includeCompleted: z.boolean().optional().describe('Include Completed extracted from the user prompt when provided.')
});

export type IGetMyWorkSummaryCopilotComponentProperties = z.infer<typeof propertiesSchema>;

export default zodToJsonSchema(propertiesSchema);
