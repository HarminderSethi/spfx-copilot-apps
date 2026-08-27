import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

const propertiesSchema = z.object({
  approvalId: z.string().optional().describe('Approval Id extracted from the user prompt when provided.'),
  projectId: z.string().optional().describe('Project Id extracted from the user prompt when provided.'),
  budgetType: z.string().optional().describe('Budget Type extracted from the user prompt when provided.'),
  period: z.string().optional().describe('Period extracted from the user prompt when provided.'),
  decision: z.string().optional().describe('Decision extracted from the user prompt when provided.'),
  showSensitiveCosts: z.boolean().optional().describe('Show Sensitive Costs extracted from the user prompt when provided.')
});

export type IReviewProjectBudgetCopilotComponentProperties = z.infer<typeof propertiesSchema>;

export default zodToJsonSchema(propertiesSchema);
