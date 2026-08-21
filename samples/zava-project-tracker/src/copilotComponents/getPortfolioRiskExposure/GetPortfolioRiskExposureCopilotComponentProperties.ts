import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

const propertiesSchema = z.object({
  portfolioId: z.string().optional().describe('Portfolio Id extracted from the user prompt when provided.'),
  period: z.string().optional().describe('Period extracted from the user prompt when provided.'),
  riskType: z.string().optional().describe('Risk Type extracted from the user prompt when provided.'),
  minimumExposure: z.number().optional().describe('Minimum Exposure extracted from the user prompt when provided.'),
  status: z.string().optional().describe('Status extracted from the user prompt when provided.'),
  includeDependencies: z.boolean().optional().describe('Include Dependencies extracted from the user prompt when provided.')
});

export type IGetPortfolioRiskExposureCopilotComponentProperties = z.infer<typeof propertiesSchema>;

export default zodToJsonSchema(propertiesSchema);
