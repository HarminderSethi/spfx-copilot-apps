import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

const propertiesSchema = z.object({
  service: z.string().describe("Optional Microsoft 365 service filter.").optional(),
  region: z.string().describe("Optional region filter.").optional()
});

export type IGetServiceHealthCopilotComponentProperties = z.infer<typeof propertiesSchema>;

export default zodToJsonSchema(propertiesSchema);
