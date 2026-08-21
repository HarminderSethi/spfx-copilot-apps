import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

const propertiesSchema = z.object({
  title: z.string().optional().describe('Title extracted from the user prompt when provided.'),
  businessProblem: z.string().optional().describe('Business Problem extracted from the user prompt when provided.'),
  sponsorId: z.string().optional().describe('Sponsor Id extracted from the user prompt when provided.'),
  objectiveId: z.string().optional().describe('Objective Id extracted from the user prompt when provided.'),
  targetStartDate: z.string().optional().describe('Target Start Date extracted from the user prompt when provided.'),
  targetEndDate: z.string().optional().describe('Target End Date extracted from the user prompt when provided.'),
  estimatedBudget: z.number().optional().describe('Estimated Budget extracted from the user prompt when provided.'),
  aiEnabled: z.boolean().optional().describe('Ai Enabled extracted from the user prompt when provided.')
});

export type ISubmitProjectRequestCopilotComponentProperties = z.infer<typeof propertiesSchema>;

export default zodToJsonSchema(propertiesSchema);
