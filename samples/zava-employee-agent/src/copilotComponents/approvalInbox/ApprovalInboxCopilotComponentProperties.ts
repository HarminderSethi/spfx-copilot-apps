import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

const propertiesSchema = z.object({
  teamId: z.string().optional().describe('Manager team identifier to scope approvals.'),
  approvalType: z.enum(['leave', 'learning', 'schedule', 'peopleAction']).optional().describe('Approval category to filter.')
});

export type IApprovalInboxCopilotComponentProperties = z.infer<typeof propertiesSchema>;

export const normalizeApprovalInboxProperties = (input: unknown): Record<string, string> => {
  const parsed = propertiesSchema.safeParse(input);
  const value = parsed.success ? parsed.data : {};
  return { teamId: value.teamId?.trim() || 'team-megan', approvalType: value.approvalType || 'leave' };
};

export default zodToJsonSchema(propertiesSchema);
