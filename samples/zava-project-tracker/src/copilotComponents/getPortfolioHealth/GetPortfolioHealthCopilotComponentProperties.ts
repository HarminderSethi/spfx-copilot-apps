import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

const propertiesSchema = z.object({
  portfolioId: z.string().optional().describe('Portfolio Id extracted from the user prompt when provided.'),
  period: z.string().optional().describe('Period extracted from the user prompt when provided.'),
  status: z.string().optional().describe('Status extracted from the user prompt when provided.'),
  phase: z.string().optional().describe('Phase extracted from the user prompt when provided.'),
  sponsorId: z.string().optional().describe('Sponsor Id extracted from the user prompt when provided.'),
  focus: z.string().optional().describe('Focus extracted from the user prompt when provided.')
});

export type IGetPortfolioHealthCopilotComponentProperties = z.infer<typeof propertiesSchema>;

export default zodToJsonSchema(propertiesSchema);
