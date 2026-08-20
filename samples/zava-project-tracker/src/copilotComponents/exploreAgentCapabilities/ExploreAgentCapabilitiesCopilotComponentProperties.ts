import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

const propertiesSchema = z.object({
  category: z.string().optional().describe('Category extracted from the user prompt when provided.'),
  audience: z.string().optional().describe('Audience extracted from the user prompt when provided.'),
  query: z.string().optional().describe('Query extracted from the user prompt when provided.'),
  scenarioKey: z.string().optional().describe('Scenario Key extracted from the user prompt when provided.'),
  tour: z.string().optional().describe('Tour extracted from the user prompt when provided.')
});

export type IExploreAgentCapabilitiesCopilotComponentProperties = z.infer<typeof propertiesSchema>;

export default zodToJsonSchema(propertiesSchema);
