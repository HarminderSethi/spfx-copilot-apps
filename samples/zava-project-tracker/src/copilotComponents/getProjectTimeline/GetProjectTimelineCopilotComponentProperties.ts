import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

const propertiesSchema = z.object({
  projectId: z.string().optional().describe('Project Id extracted from the user prompt when provided.'),
  startDate: z.string().optional().describe('Start Date extracted from the user prompt when provided.'),
  endDate: z.string().optional().describe('End Date extracted from the user prompt when provided.'),
  workstream: z.string().optional().describe('Workstream extracted from the user prompt when provided.'),
  criticalOnly: z.boolean().optional().describe('Critical Only extracted from the user prompt when provided.'),
  showBaseline: z.boolean().optional().describe('Show Baseline extracted from the user prompt when provided.')
});

export type IGetProjectTimelineCopilotComponentProperties = z.infer<typeof propertiesSchema>;

export default zodToJsonSchema(propertiesSchema);
