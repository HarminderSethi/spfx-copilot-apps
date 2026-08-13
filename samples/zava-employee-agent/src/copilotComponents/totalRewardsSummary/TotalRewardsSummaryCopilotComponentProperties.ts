import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

const propertiesSchema = z.object({
  year: z.number().int().optional().describe('Rewards year to summarize.'),
  currency: z.string().optional().describe('ISO currency code for displayed values.'),
  includeEquity: z.boolean().optional().describe('Whether equity value is included.'),
  includeBenefitsValue: z.boolean().optional().describe('Whether employer-funded benefits value is included.')
});

export type ITotalRewardsSummaryCopilotComponentProperties = z.infer<typeof propertiesSchema>;

export const normalizeTotalRewardsSummaryProperties = (input: unknown): Record<string, string | number | boolean> => {
  const parsed = propertiesSchema.safeParse(input);
  const value = parsed.success ? parsed.data : {};
  const year = Math.min(2100, Math.max(2020, value.year ?? 2026));
  return { year, currency: value.currency?.toUpperCase() || 'EUR', includeEquity: value.includeEquity !== false, includeBenefitsValue: value.includeBenefitsValue !== false };
};

export default zodToJsonSchema(propertiesSchema);
