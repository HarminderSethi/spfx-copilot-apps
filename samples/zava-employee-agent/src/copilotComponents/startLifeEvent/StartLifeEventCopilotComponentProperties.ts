import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

const propertiesSchema = z.object({
  lifeEvent: z.enum(['marriage', 'birth', 'adoption', 'relocation', 'lossOfCoverage']).optional().describe('Life event to prefill.'),
  effectiveDate: z.string().optional().describe('Effective date in yyyy-mm-dd format.'),
  dependentCount: z.number().int().optional().describe('Number of dependents after the event.')
});

export type IStartLifeEventCopilotComponentProperties = z.infer<typeof propertiesSchema>;

export const normalizeStartLifeEventProperties = (input: unknown): Record<string, string | number> => {
  const parsed = propertiesSchema.safeParse(input);
  const value = parsed.success ? parsed.data : {};
  const dependentCount = Math.min(12, Math.max(0, value.dependentCount ?? 1));
  return { lifeEvent: value.lifeEvent || 'birth', effectiveDate: /^\d{4}-\d{2}-\d{2}$/.test(value.effectiveDate || '') ? value.effectiveDate as string : '2026-08-01', dependentCount };
};

export default zodToJsonSchema(propertiesSchema);
