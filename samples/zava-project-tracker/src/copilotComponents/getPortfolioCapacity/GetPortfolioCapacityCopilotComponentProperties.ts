import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

const propertiesSchema = z.object({
  portfolioId: z.string().optional().describe('Portfolio Id extracted from the user prompt when provided.'),
  startDate: z.string().optional().describe('Start Date extracted from the user prompt when provided.'),
  endDate: z.string().optional().describe('End Date extracted from the user prompt when provided.'),
  role: z.string().optional().describe('Role extracted from the user prompt when provided.'),
  skill: z.string().optional().describe('Skill extracted from the user prompt when provided.'),
  location: z.string().optional().describe('Location extracted from the user prompt when provided.'),
  scenario: z.string().optional().describe('Scenario extracted from the user prompt when provided.'),
  includeOpenRoles: z.boolean().optional().describe('Include Open Roles extracted from the user prompt when provided.')
});

export type IGetPortfolioCapacityCopilotComponentProperties = z.infer<typeof propertiesSchema>;

export default zodToJsonSchema(propertiesSchema);
