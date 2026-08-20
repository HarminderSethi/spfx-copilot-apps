import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

const propertiesSchema = z.object({
  startDate: z.string().optional().describe('Start Date extracted from the user prompt when provided.'),
  endDate: z.string().optional().describe('End Date extracted from the user prompt when provided.'),
  projectId: z.string().optional().describe('Project Id extracted from the user prompt when provided.'),
  includeOperationalWork: z.boolean().optional().describe('Include Operational Work extracted from the user prompt when provided.'),
  scenario: z.string().optional().describe('Scenario extracted from the user prompt when provided.')
});

export type IGetMyCapacityCopilotComponentProperties = z.infer<typeof propertiesSchema>;

export default zodToJsonSchema(propertiesSchema);
