import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

const propertiesSchema = z.object({
  query: z.string().describe("Optional capability search query.").optional(),
  lens: z.string().describe("Optional Me, Team, or Company lens filter.").optional()
});

export type IExploreAgentCapabilitiesCopilotComponentProperties = z.infer<typeof propertiesSchema>;

export default zodToJsonSchema(propertiesSchema);
