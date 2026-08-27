import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

const propertiesSchema = z.object({
  quarter: z.string().describe("Optional fiscal quarter.").optional(),
  department: z.string().describe("Optional department filter.").optional()
});

export type IGetItSpendBridgeCopilotComponentProperties = z.infer<typeof propertiesSchema>;

export default zodToJsonSchema(propertiesSchema);
