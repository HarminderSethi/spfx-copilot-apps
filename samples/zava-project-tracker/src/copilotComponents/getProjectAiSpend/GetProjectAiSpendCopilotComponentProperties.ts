import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

const propertiesSchema = z.object({
  projectId: z.string().optional().describe('Project Id extracted from the user prompt when provided.'),
  period: z.string().optional().describe('Period extracted from the user prompt when provided.'),
  model: z.string().optional().describe('Model extracted from the user prompt when provided.'),
  environment: z.string().optional().describe('Environment extracted from the user prompt when provided.'),
  costType: z.string().optional().describe('Cost Type extracted from the user prompt when provided.'),
  groupBy: z.string().optional().describe('Group By extracted from the user prompt when provided.'),
  forecastThrough: z.string().optional().describe('Forecast Through extracted from the user prompt when provided.')
});

export type IGetProjectAiSpendCopilotComponentProperties = z.infer<typeof propertiesSchema>;

export default zodToJsonSchema(propertiesSchema);
