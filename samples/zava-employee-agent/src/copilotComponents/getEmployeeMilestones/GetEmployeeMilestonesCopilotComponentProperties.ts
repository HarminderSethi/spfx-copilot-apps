import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

const periods = ['month', 'quarter', 'year'] as const;

const propertiesSchema = z.object({
  period: z.enum(periods).optional().describe('Optional milestone horizon: month, quarter, or year.'),
  milestoneId: z.string().optional().describe('Optional milestone ID when the user asks about a specific known milestone.')
});

const runtimeSchema = z.object({
  period: z.enum(periods).optional().catch(undefined),
  milestoneId: z.string().optional().catch(undefined)
}).catch({});

export type IGetEmployeeMilestonesCopilotComponentProperties = z.infer<typeof propertiesSchema>;

export const normalizeGetEmployeeMilestonesProperties = (
  input: unknown
): IGetEmployeeMilestonesCopilotComponentProperties => {
  const value = runtimeSchema.parse(input);
  const milestoneId = value.milestoneId?.trim();
  return {
    ...(value.period ? { period: value.period } : {}),
    ...(milestoneId ? { milestoneId } : {})
  };
};

export default zodToJsonSchema(propertiesSchema);
