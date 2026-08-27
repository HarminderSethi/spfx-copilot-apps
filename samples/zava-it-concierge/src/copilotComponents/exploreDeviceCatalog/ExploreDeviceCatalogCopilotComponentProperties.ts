import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

const propertiesSchema = z.object({
  role: z.string().describe("Optional role used to rank device fit.").optional(),
  workload: z.string().describe("Optional primary workload or scenario.").optional()
});

export type IExploreDeviceCatalogCopilotComponentProperties = z.infer<typeof propertiesSchema>;

export default zodToJsonSchema(propertiesSchema);
