import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

const propertiesSchema = z.object({
  topic: z.string().optional().describe('Policy topic to compare.'),
  jurisdictions: z.array(z.string()).optional().describe('Countries or regions to compare.'),
  effectiveOn: z.string().optional().describe('Optional policy effective date in yyyy-mm-dd format.')
});

export type IPolicyComparisonCopilotComponentProperties = z.infer<typeof propertiesSchema>;

export interface INormalizedPolicyComparisonProperties {
  topic: string;
  jurisdictions: string[];
  effectiveOn: string;
}

export const normalizePolicyComparisonProperties = (input: unknown): INormalizedPolicyComparisonProperties => {
  const parsed = propertiesSchema.safeParse(input);
  const value = parsed.success ? parsed.data : {};
  const jurisdictions = value.jurisdictions?.map((item) => item.trim()).filter(Boolean) || [];
  return {
    topic: value.topic?.trim() || 'Parental leave',
    jurisdictions: jurisdictions.length >= 2 ? jurisdictions : ['Finland', 'Sweden'],
    effectiveOn: /^\d{4}-\d{2}-\d{2}$/.test(value.effectiveOn || '') ? value.effectiveOn as string : '2026-08-01'
  };
};

export default zodToJsonSchema(propertiesSchema);
