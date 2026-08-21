import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

const propertiesSchema = z.object({
  question: z.string().optional().describe('Policy question to answer in the inline receipt.'),
  jurisdiction: z.string().optional().describe('Country or region whose policy applies.'),
  effectiveOn: z.string().optional().describe('Optional policy effective date in yyyy-mm-dd format.'),
  includeSources: z.boolean().optional().describe('Whether to show source receipts with the answer.')
});

export type IPolicyAnswerCopilotComponentProperties = z.infer<typeof propertiesSchema>;

export interface INormalizedPolicyAnswerProperties {
  question: string;
  jurisdiction: string;
  effectiveOn: string;
  includeSources: boolean;
}

export const normalizePolicyAnswerProperties = (input: unknown): INormalizedPolicyAnswerProperties => {
  const parsed = propertiesSchema.safeParse(input);
  const value = parsed.success ? parsed.data : {};
  return {
    question: value.question?.trim() || 'What parental leave applies to me?',
    jurisdiction: value.jurisdiction?.trim() || 'Finland and Sweden',
    effectiveOn: /^\d{4}-\d{2}-\d{2}$/.test(value.effectiveOn || '') ? value.effectiveOn as string : '2026-08-01',
    includeSources: value.includeSources !== false
  };
};

export default zodToJsonSchema(propertiesSchema);
