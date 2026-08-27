import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

const propertiesSchema = z.object({
  portfolioId: z.string().optional().describe('Portfolio Id extracted from the user prompt when provided.'),
  startDate: z.string().optional().describe('Start Date extracted from the user prompt when provided.'),
  endDate: z.string().optional().describe('End Date extracted from the user prompt when provided.'),
  phase: z.string().optional().describe('Phase extracted from the user prompt when provided.'),
  projectIds: z.array(z.string()).optional().describe('Project Ids extracted from the user prompt when provided.'),
  milestoneType: z.string().optional().describe('Milestone Type extracted from the user prompt when provided.'),
  showDependencies: z.boolean().optional().describe('Show Dependencies extracted from the user prompt when provided.')
});

export type IGetPortfolioRoadmapCopilotComponentProperties = z.infer<typeof propertiesSchema>;

export default zodToJsonSchema(propertiesSchema);
