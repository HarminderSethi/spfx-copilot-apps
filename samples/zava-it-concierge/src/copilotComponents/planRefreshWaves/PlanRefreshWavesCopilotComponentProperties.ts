import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

const propertiesSchema = z.object({
  region: z.string().describe("Optional region filter.").optional(),
  maxDevicesPerWeek: z.number().describe("Optional weekly deployment capacity.").optional()
});

export type IPlanRefreshWavesCopilotComponentProperties = z.infer<typeof propertiesSchema>;

export default zodToJsonSchema(propertiesSchema);
