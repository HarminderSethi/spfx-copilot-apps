import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

const propertiesSchema = z.object({
  projectIds: z.array(z.string()).optional().describe('Project Ids extracted from the user prompt when provided.'),
  period: z.string().optional().describe('Period extracted from the user prompt when provided.'),
  compareOn: z.string().optional().describe('Compare On extracted from the user prompt when provided.'),
  includeForecast: z.boolean().optional().describe('Include Forecast extracted from the user prompt when provided.'),
  highlightDifferences: z.boolean().optional().describe('Highlight Differences extracted from the user prompt when provided.')
});

export type ICompareProjectsCopilotComponentProperties = z.infer<typeof propertiesSchema>;

export default zodToJsonSchema(propertiesSchema);
