import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

const propertiesSchema = z.object({
  symptom: z.string().describe("Optional issue symptom or summary.").optional(),
  severity: z.string().describe("Optional user-observed severity.").optional()
});

export type IReportItIssueCopilotComponentProperties = z.infer<typeof propertiesSchema>;

export default zodToJsonSchema(propertiesSchema);
