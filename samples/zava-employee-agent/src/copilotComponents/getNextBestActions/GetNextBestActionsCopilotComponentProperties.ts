import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

const periods = ['today', 'week', 'month'] as const;
const focusAreas = ['all', 'time', 'money', 'benefits', 'rewards', 'policy', 'support', 'learning', 'team', 'people'] as const;

const propertiesSchema = z.object({
  period: z.enum(periods).optional().describe('Optional period for action ranking: today, week, or month.'),
  focusArea: z.enum(focusAreas).optional().describe('Optional HR family to emphasize. Omit to rank actions across all families.'),
  includeSensitive: z.boolean().optional().describe('Whether explicitly requested sensitive actions may be included. Defaults to false.')
});

const runtimeSchema = z.object({
  period: z.enum(periods).optional().catch(undefined),
  focusArea: z.enum(focusAreas).optional().catch(undefined),
  includeSensitive: z.boolean().optional().catch(undefined)
}).catch({});

export type IGetNextBestActionsCopilotComponentProperties = z.infer<typeof propertiesSchema>;

export const normalizeGetNextBestActionsProperties = (
  input: unknown
): IGetNextBestActionsCopilotComponentProperties => runtimeSchema.parse(input);

export default zodToJsonSchema(propertiesSchema);
