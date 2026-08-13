import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

const propertiesSchema = z.object({
  personId: z.string().optional().describe('Person whose organization context anchors the tree.'),
  organizationId: z.string().optional().describe('Organization subtree to explore.'),
  depth: z.number().int().optional().describe('Number of reporting levels to show initially.')
});

export type IExploreOrganizationCopilotComponentProperties = z.infer<typeof propertiesSchema>;

export const normalizeExploreOrganizationProperties = (input: unknown): Record<string, string | number> => {
  const parsed = propertiesSchema.safeParse(input);
  const value = parsed.success ? parsed.data : {};
  const depth = Math.min(4, Math.max(1, value.depth ?? 2));
  return { personId: value.personId?.trim() || 'megan-bowen', organizationId: value.organizationId?.trim() || 'customer-experience', depth };
};

export default zodToJsonSchema(propertiesSchema);
