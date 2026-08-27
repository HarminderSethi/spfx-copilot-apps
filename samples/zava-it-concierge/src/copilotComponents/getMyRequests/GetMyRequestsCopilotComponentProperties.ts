import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

const propertiesSchema = z.object({
  status: z.string().describe("Optional request status filter.").optional(),
  requestType: z.string().describe("Optional request type filter.").optional()
});

export type IGetMyRequestsCopilotComponentProperties = z.infer<typeof propertiesSchema>;

export default zodToJsonSchema(propertiesSchema);
