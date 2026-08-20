import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

const propertiesSchema = z.object({
  portfolioId: z.string().optional().describe('Portfolio Id extracted from the user prompt when provided.'),
  period: z.string().optional().describe('Period extracted from the user prompt when provided.'),
  projectIds: z.array(z.string()).optional().describe('Project Ids extracted from the user prompt when provided.'),
  model: z.string().optional().describe('Model extracted from the user prompt when provided.'),
  environment: z.string().optional().describe('Environment extracted from the user prompt when provided.'),
  groupBy: z.string().optional().describe('Group By extracted from the user prompt when provided.'),
  metric: z.string().optional().describe('Metric extracted from the user prompt when provided.')
});

export type IGetPortfolioAiSpendCopilotComponentProperties = z.infer<typeof propertiesSchema>;

export default zodToJsonSchema(propertiesSchema);
