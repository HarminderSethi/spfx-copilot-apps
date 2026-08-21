import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

const propertiesSchema = z.object({
  approvalType: z.string().optional().describe('Approval Type extracted from the user prompt when provided.'),
  projectId: z.string().optional().describe('Project Id extracted from the user prompt when provided.'),
  due: z.string().optional().describe('Due extracted from the user prompt when provided.'),
  minimumAmount: z.number().optional().describe('Minimum Amount extracted from the user prompt when provided.'),
  requesterId: z.string().optional().describe('Requester Id extracted from the user prompt when provided.'),
  status: z.string().optional().describe('Status extracted from the user prompt when provided.')
});

export type IGetApprovalInboxCopilotComponentProperties = z.infer<typeof propertiesSchema>;

export default zodToJsonSchema(propertiesSchema);
