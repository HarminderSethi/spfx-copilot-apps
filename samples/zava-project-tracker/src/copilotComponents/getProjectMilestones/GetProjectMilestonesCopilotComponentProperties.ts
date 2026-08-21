import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

const propertiesSchema = z.object({
  projectId: z.string().optional().describe('Project Id extracted from the user prompt when provided.'),
  period: z.string().optional().describe('Period extracted from the user prompt when provided.'),
  status: z.string().optional().describe('Status extracted from the user prompt when provided.'),
  milestoneId: z.string().optional().describe('Milestone Id extracted from the user prompt when provided.'),
  includeCompleted: z.boolean().optional().describe('Include Completed extracted from the user prompt when provided.')
});

export type IGetProjectMilestonesCopilotComponentProperties = z.infer<typeof propertiesSchema>;

export default zodToJsonSchema(propertiesSchema);
