import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

const propertiesSchema = z.object({
  period: z.string().optional().describe('Current pay period, such as 2026-07.'),
  compareTo: z.string().optional().describe('Prior pay period to compare, such as 2026-06.'),
  includeDeductions: z.boolean().optional().describe('Whether deduction drivers should appear in the explanation.')
});

export type IExplainPayChangeCopilotComponentProperties = z.infer<typeof propertiesSchema>;

export const normalizeExplainPayChangeProperties = (input: unknown): Record<string, string | boolean> => {
  const parsed = propertiesSchema.safeParse(input);
  const value = parsed.success ? parsed.data : {};
  return { period: value.period?.trim() || '2026-07', compareTo: value.compareTo?.trim() || '2026-06', includeDeductions: value.includeDeductions !== false };
};

export default zodToJsonSchema(propertiesSchema);
