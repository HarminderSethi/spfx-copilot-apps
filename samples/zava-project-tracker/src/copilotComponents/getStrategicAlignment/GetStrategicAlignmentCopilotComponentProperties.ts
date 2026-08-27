import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

const propertiesSchema = z.object({
  portfolioId: z.string().optional().describe('Portfolio Id extracted from the user prompt when provided.'),
  objectiveId: z.string().optional().describe('Objective Id extracted from the user prompt when provided.'),
  projectId: z.string().optional().describe('Project Id extracted from the user prompt when provided.'),
  period: z.string().optional().describe('Period extracted from the user prompt when provided.'),
  minimumContribution: z.number().optional().describe('Minimum Contribution extracted from the user prompt when provided.'),
  includeUnaligned: z.boolean().optional().describe('Include Unaligned extracted from the user prompt when provided.')
});

export type IGetStrategicAlignmentCopilotComponentProperties = z.infer<typeof propertiesSchema>;

export default zodToJsonSchema(propertiesSchema);
