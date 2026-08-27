import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

const propertiesSchema = z.object({
  category: z.enum(['payroll', 'benefits', 'leave', 'workplace', 'learning', 'other']).optional().describe('HR case category to prefill.'),
  subject: z.string().optional().describe('Short case subject for user review.'),
  description: z.string().optional().describe('Private case detail shown only inside the intake.'),
  privacyLevel: z.enum(['standard', 'private', 'sensitive']).optional().describe('Privacy boundary for the case.')
});

export type ICreateHrCaseCopilotComponentProperties = z.infer<typeof propertiesSchema>;

export const normalizeCreateHrCaseProperties = (input: unknown): Record<string, string> => {
  const parsed = propertiesSchema.safeParse(input);
  const value = parsed.success ? parsed.data : {};
  return { category: value.category || 'payroll', subject: value.subject?.trim() || 'Unexplained payroll deduction', description: value.description?.trim() || 'Please help me understand a deduction on my latest statement.', privacyLevel: value.privacyLevel || 'private' };
};

export default zodToJsonSchema(propertiesSchema);
