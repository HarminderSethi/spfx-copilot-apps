import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

const propertiesSchema = z.object({
  department: z.string().describe("Optional department to inspect.").optional(),
  risk: z.string().describe("Optional refresh-risk filter.").optional()
});

export type IGetTeamAssetsCopilotComponentProperties = z.infer<typeof propertiesSchema>;

export default zodToJsonSchema(propertiesSchema);
