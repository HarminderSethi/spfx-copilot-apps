import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

const propertiesSchema = z.object({
  approvalId: z.string().optional().describe('Approval Id extracted from the user prompt when provided.'),
  projectId: z.string().optional().describe('Project Id extracted from the user prompt when provided.'),
  personId: z.string().optional().describe('Person Id extracted from the user prompt when provided.'),
  allocationPercent: z.number().optional().describe('Allocation Percent extracted from the user prompt when provided.'),
  startDate: z.string().optional().describe('Start Date extracted from the user prompt when provided.'),
  endDate: z.string().optional().describe('End Date extracted from the user prompt when provided.'),
  role: z.string().optional().describe('Role extracted from the user prompt when provided.'),
  decision: z.string().optional().describe('Decision extracted from the user prompt when provided.')
});

export type IReviewResourceAssignmentCopilotComponentProperties = z.infer<typeof propertiesSchema>;

export default zodToJsonSchema(propertiesSchema);
