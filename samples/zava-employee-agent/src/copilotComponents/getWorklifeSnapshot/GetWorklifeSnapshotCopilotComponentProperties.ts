import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

const periods = ['today', 'week', 'month', 'year'] as const;

const propertiesSchema = z.object({
  period: z.enum(periods).optional().describe('Optional period for the worklife snapshot: today, week, month, or year.')
});

const runtimeSchema = z.object({
  period: z.enum(periods).optional().catch(undefined)
}).catch({});

export type IGetWorklifeSnapshotCopilotComponentProperties = z.infer<typeof propertiesSchema>;

export const normalizeGetWorklifeSnapshotProperties = (
  input: unknown
): IGetWorklifeSnapshotCopilotComponentProperties => runtimeSchema.parse(input);

export default zodToJsonSchema(propertiesSchema);
