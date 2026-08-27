import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

const propertiesSchema = z.object({
  deviceId: z.string().describe("Optional asset or device identifier to diagnose.").optional(),
  symptom: z.string().describe("Optional symptom used to focus diagnostic checks.").optional()
});

export type IRunDeviceDiagnosticsCopilotComponentProperties = z.infer<typeof propertiesSchema>;

export default zodToJsonSchema(propertiesSchema);
