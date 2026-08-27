import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

const propertiesSchema = z.object({
  period: z.string().describe("Optional reporting period.").optional(),
  category: z.string().describe("Optional ticket category filter.").optional()
});

export type IGetTeamTicketTrendCopilotComponentProperties = z.infer<typeof propertiesSchema>;

export default zodToJsonSchema(propertiesSchema);
