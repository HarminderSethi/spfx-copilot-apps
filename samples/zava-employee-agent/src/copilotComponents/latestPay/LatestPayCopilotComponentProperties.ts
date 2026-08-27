import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

const propertiesSchema = z.object({
  period: z.string().optional().describe('Pay period to display, such as latest or 2026-07.')
});

export type ILatestPayCopilotComponentProperties = z.infer<typeof propertiesSchema>;

export const normalizeLatestPayProperties = (input: unknown): Record<string, string> => {
  const parsed = propertiesSchema.safeParse(input);
  return { period: parsed.success && parsed.data.period?.trim() ? parsed.data.period.trim() : 'latest' };
};

export default zodToJsonSchema(propertiesSchema);
