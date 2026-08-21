import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

const propertiesSchema = z.object({
  leaveType: z.enum(['vacation', 'sick', 'personal']).optional().describe('Leave category to highlight.'),
  asOfDate: z.string().optional().describe('Balance date in yyyy-mm-dd format.')
});

export type ILeaveBalanceCopilotComponentProperties = z.infer<typeof propertiesSchema>;

export const normalizeLeaveBalanceProperties = (input: unknown): Record<string, string> => {
  const parsed = propertiesSchema.safeParse(input);
  const value = parsed.success ? parsed.data : {};
  return { leaveType: value.leaveType || 'vacation', asOfDate: /^\d{4}-\d{2}-\d{2}$/.test(value.asOfDate || '') ? value.asOfDate as string : '2026-08-13' };
};

export default zodToJsonSchema(propertiesSchema);
