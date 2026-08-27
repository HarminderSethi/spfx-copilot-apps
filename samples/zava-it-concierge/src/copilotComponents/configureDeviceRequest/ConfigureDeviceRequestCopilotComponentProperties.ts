import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

const propertiesSchema = z.object({
  model: z.string().describe("Optional preferred Surface model.").optional(),
  memoryGb: z.number().describe("Optional requested memory in gigabytes.").optional(),
  storageGb: z.number().describe("Optional requested storage in gigabytes.").optional()
});

export type IConfigureDeviceRequestCopilotComponentProperties = z.infer<typeof propertiesSchema>;

export default zodToJsonSchema(propertiesSchema);
