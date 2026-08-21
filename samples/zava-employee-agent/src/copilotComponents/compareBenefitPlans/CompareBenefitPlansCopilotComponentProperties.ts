import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

const propertiesSchema = z.object({
  coverageTier: z.enum(['employee', 'employeePartner', 'employeeChildren', 'family']).optional().describe('Coverage tier to compare.'),
  dependentCount: z.number().int().optional().describe('Number of dependents to include.'),
  priorities: z.array(z.enum(['cost', 'network', 'deductible', 'dental', 'vision', 'mentalHealth'])).optional().describe('Plan attributes to prioritize in ranking.')
});

export type ICompareBenefitPlansCopilotComponentProperties = z.infer<typeof propertiesSchema>;

export const normalizeCompareBenefitPlansProperties = (input: unknown): Record<string, string | number | string[]> => {
  const parsed = propertiesSchema.safeParse(input);
  const value = parsed.success ? parsed.data : {};
  const dependentCount = Math.min(12, Math.max(0, value.dependentCount ?? 2));
  return { coverageTier: value.coverageTier || 'employeeChildren', dependentCount, priorities: value.priorities?.length ? value.priorities : ['deductible', 'dental'] };
};

export default zodToJsonSchema(propertiesSchema);
