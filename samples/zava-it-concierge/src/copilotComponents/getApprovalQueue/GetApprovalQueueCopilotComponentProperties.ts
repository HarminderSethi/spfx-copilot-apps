import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

const propertiesSchema = z.object({
  requestType: z.string().describe("Optional approval request type filter.").optional(),
  status: z.string().describe("Optional approval status filter.").optional()
});

export type IGetApprovalQueueCopilotComponentProperties = z.infer<typeof propertiesSchema>;

export default zodToJsonSchema(propertiesSchema);
