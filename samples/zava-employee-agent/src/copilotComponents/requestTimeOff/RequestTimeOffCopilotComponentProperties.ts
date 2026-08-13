import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

const propertiesSchema = z.object({
  leaveType: z.enum(['vacation', 'sick', 'personal']).optional().describe('Leave category to prefill.'),
  startDate: z.string().optional().describe('Inclusive start date in yyyy-mm-dd format.'),
  endDate: z.string().optional().describe('Inclusive end date in yyyy-mm-dd format.'),
  reason: z.string().optional().describe('Short reason to prefill for user review.')
});

export type IRequestTimeOffCopilotComponentProperties = z.infer<typeof propertiesSchema>;

export const normalizeRequestTimeOffProperties = (input: unknown): Record<string, string> => {
  const parsed = propertiesSchema.safeParse(input);
  const value = parsed.success ? parsed.data : {};
  const validDate = (date: string | undefined): string | undefined => /^\d{4}-\d{2}-\d{2}$/.test(date || '') ? date : undefined;
  return { leaveType: value.leaveType || 'vacation', startDate: validDate(value.startDate) || '2027-08-04', endDate: validDate(value.endDate) || '2027-08-12', reason: value.reason?.trim() || 'Family trip' };
};

export default zodToJsonSchema(propertiesSchema);
