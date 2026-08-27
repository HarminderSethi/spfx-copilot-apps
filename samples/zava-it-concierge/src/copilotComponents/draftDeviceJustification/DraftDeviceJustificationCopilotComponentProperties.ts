import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

const propertiesSchema = z.object({
  requestId: z.string().describe("Optional request identifier to justify.").optional(),
  emphasis: z.string().describe("Optional business outcome to emphasize.").optional()
});

export type IDraftDeviceJustificationCopilotComponentProperties = z.infer<typeof propertiesSchema>;

export default zodToJsonSchema(propertiesSchema);
