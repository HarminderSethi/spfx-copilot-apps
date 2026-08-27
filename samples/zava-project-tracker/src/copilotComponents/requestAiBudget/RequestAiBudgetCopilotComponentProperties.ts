import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

const propertiesSchema = z.object({
  projectId: z.string().optional().describe('Project Id extracted from the user prompt when provided.'),
  amount: z.number().optional().describe('Amount extracted from the user prompt when provided.'),
  currency: z.string().optional().describe('Currency extracted from the user prompt when provided.'),
  neededBy: z.string().optional().describe('Needed By extracted from the user prompt when provided.'),
  budgetCategory: z.string().optional().describe('Budget Category extracted from the user prompt when provided.'),
  justification: z.string().optional().describe('Justification extracted from the user prompt when provided.'),
  model: z.string().optional().describe('Model extracted from the user prompt when provided.'),
  environment: z.string().optional().describe('Environment extracted from the user prompt when provided.')
});

export type IRequestAiBudgetCopilotComponentProperties = z.infer<typeof propertiesSchema>;

export default zodToJsonSchema(propertiesSchema);
