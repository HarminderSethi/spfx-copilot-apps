import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

const propertiesSchema = z.object({
  projectId: z.string().optional().describe('Project Id extracted from the user prompt when provided.'),
  riskType: z.string().optional().describe('Risk Type extracted from the user prompt when provided.'),
  minimumExposure: z.number().optional().describe('Minimum Exposure extracted from the user prompt when provided.'),
  status: z.string().optional().describe('Status extracted from the user prompt when provided.'),
  ownerId: z.string().optional().describe('Owner Id extracted from the user prompt when provided.'),
  includeIssues: z.boolean().optional().describe('Include Issues extracted from the user prompt when provided.')
});

export type IGetProjectRisksCopilotComponentProperties = z.infer<typeof propertiesSchema>;

export default zodToJsonSchema(propertiesSchema);
