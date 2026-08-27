import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

const propertiesSchema = z.object({
  region: z.string().describe("Optional region filter.").optional(),
  department: z.string().describe("Optional department filter.").optional()
});

export type IGetFleetHealthCopilotComponentProperties = z.infer<typeof propertiesSchema>;

export default zodToJsonSchema(propertiesSchema);
