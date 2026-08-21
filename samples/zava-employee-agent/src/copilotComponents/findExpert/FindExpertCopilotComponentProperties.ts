import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

const propertiesSchema = z.object({
  expertise: z.string().optional().describe('Skill or expertise to match.'),
  location: z.string().optional().describe('Optional expert location filter.')
});

export type IFindExpertCopilotComponentProperties = z.infer<typeof propertiesSchema>;

export const normalizeFindExpertProperties = (input: unknown): Record<string, string> => {
  const parsed = propertiesSchema.safeParse(input);
  const value = parsed.success ? parsed.data : {};
  return { expertise: value.expertise?.trim() || 'accessibility for a customer keynote', location: value.location?.trim() || 'Europe' };
};

export default zodToJsonSchema(propertiesSchema);
