import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

const propertiesSchema = z.object({
  projectId: z.string().optional().describe('Project Id extracted from the user prompt when provided.'),
  status: z.string().optional().describe('Status extracted from the user prompt when provided.'),
  due: z.string().optional().describe('Due extracted from the user prompt when provided.'),
  priority: z.string().optional().describe('Priority extracted from the user prompt when provided.'),
  groupBy: z.string().optional().describe('Group By extracted from the user prompt when provided.')
});

export type IGetMyTasksCopilotComponentProperties = z.infer<typeof propertiesSchema>;

export default zodToJsonSchema(propertiesSchema);
