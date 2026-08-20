import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

const propertiesSchema = z.object({
  projectId: z.string().optional().describe('Project Id extracted from the user prompt when provided.'),
  usageDate: z.string().optional().describe('Usage Date extracted from the user prompt when provided.'),
  model: z.string().optional().describe('Model extracted from the user prompt when provided.'),
  environment: z.string().optional().describe('Environment extracted from the user prompt when provided.'),
  feature: z.string().optional().describe('Feature extracted from the user prompt when provided.'),
  inputTokens: z.number().optional().describe('Input Tokens extracted from the user prompt when provided.'),
  outputTokens: z.number().optional().describe('Output Tokens extracted from the user prompt when provided.'),
  requests: z.number().optional().describe('Requests extracted from the user prompt when provided.'),
  purpose: z.string().optional().describe('Purpose extracted from the user prompt when provided.')
});

export type ISubmitAiUsageCopilotComponentProperties = z.infer<typeof propertiesSchema>;

export default zodToJsonSchema(propertiesSchema);
