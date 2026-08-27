import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

const propertiesSchema = z.object({
  deviceId: z.string().describe("Optional asset or device identifier to evaluate.").optional()
});

export type IGetRefreshEligibilityCopilotComponentProperties = z.infer<typeof propertiesSchema>;

export default zodToJsonSchema(propertiesSchema);
