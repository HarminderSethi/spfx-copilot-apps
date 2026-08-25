import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

const propertiesSchema = z.object({
  region: z.string().describe("Optional region filter.").optional(),
  thresholdYears: z.number().describe("Optional refresh threshold in years.").optional()
});

export type IGetDeviceAgeDistributionCopilotComponentProperties = z.infer<typeof propertiesSchema>;

export default zodToJsonSchema(propertiesSchema);
