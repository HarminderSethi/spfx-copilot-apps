import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

const propertiesSchema = z.object({
  projectId: z.string().optional().describe('Project Id extracted from the user prompt when provided.'),
  period: z.string().optional().describe('Period extracted from the user prompt when provided.'),
  costCategory: z.string().optional().describe('Cost Category extracted from the user prompt when provided.'),
  scenario: z.string().optional().describe('Scenario extracted from the user prompt when provided.'),
  includeCommitments: z.boolean().optional().describe('Include Commitments extracted from the user prompt when provided.')
});

export type IGetProjectBudgetCopilotComponentProperties = z.infer<typeof propertiesSchema>;

export default zodToJsonSchema(propertiesSchema);
