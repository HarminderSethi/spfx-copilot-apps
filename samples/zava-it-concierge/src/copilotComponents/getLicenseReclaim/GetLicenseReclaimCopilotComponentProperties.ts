import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

const propertiesSchema = z.object({
  inactivityDays: z.number().describe("Optional inactivity threshold in days.").optional(),
  department: z.string().describe("Optional department filter.").optional()
});

export type IGetLicenseReclaimCopilotComponentProperties = z.infer<typeof propertiesSchema>;

export default zodToJsonSchema(propertiesSchema);
