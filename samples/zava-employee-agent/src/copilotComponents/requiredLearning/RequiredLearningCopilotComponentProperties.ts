import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

const propertiesSchema = z.object({
  dueWithinDays: z.number().int().optional().describe('Show required learning due within this many days.'),
  includeOptional: z.boolean().optional().describe('Whether optional learning should appear after required items.')
});

export type IRequiredLearningCopilotComponentProperties = z.infer<typeof propertiesSchema>;

export const normalizeRequiredLearningProperties = (input: unknown): Record<string, number | boolean> => {
  const parsed = propertiesSchema.safeParse(input);
  const value = parsed.success ? parsed.data : {};
  const dueWithinDays = Math.min(365, Math.max(1, value.dueWithinDays ?? 14));
  return { dueWithinDays, includeOptional: value.includeOptional === true };
};

export default zodToJsonSchema(propertiesSchema);
