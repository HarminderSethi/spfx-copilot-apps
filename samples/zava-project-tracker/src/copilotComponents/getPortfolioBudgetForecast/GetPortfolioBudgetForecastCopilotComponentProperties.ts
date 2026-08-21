import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

const propertiesSchema = z.object({
  portfolioId: z.string().optional().describe('Portfolio Id extracted from the user prompt when provided.'),
  period: z.string().optional().describe('Period extracted from the user prompt when provided.'),
  costCategory: z.string().optional().describe('Cost Category extracted from the user prompt when provided.'),
  scenario: z.string().optional().describe('Scenario extracted from the user prompt when provided.'),
  groupBy: z.string().optional().describe('Group By extracted from the user prompt when provided.'),
  varianceOnly: z.boolean().optional().describe('Variance Only extracted from the user prompt when provided.')
});

export type IGetPortfolioBudgetForecastCopilotComponentProperties = z.infer<typeof propertiesSchema>;

export default zodToJsonSchema(propertiesSchema);
