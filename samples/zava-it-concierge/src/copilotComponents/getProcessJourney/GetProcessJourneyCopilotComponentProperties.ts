import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

const propertiesSchema = z.object({
  processId: z.string().describe("Optional process or request identifier.").optional(),
  processType: z.string().describe("Optional process type.").optional()
});

export type IGetProcessJourneyCopilotComponentProperties = z.infer<typeof propertiesSchema>;

export default zodToJsonSchema(propertiesSchema);
