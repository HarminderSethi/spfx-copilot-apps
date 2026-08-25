import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

const propertiesSchema = z.object({
  incidentId: z.string().describe("Optional incident identifier to focus.").optional(),
  service: z.string().describe("Optional service used to narrow signals.").optional()
});

export type ICorrelateMajorIncidentCopilotComponentProperties = z.infer<typeof propertiesSchema>;

export default zodToJsonSchema(propertiesSchema);
