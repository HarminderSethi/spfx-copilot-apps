import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

const propertiesSchema = z.object({
  period: z.string().describe("Optional reporting period.").optional(),
  channel: z.string().describe("Optional support channel filter.").optional()
});

export type IGetTicketDeflectionTrendCopilotComponentProperties = z.infer<typeof propertiesSchema>;

export default zodToJsonSchema(propertiesSchema);
