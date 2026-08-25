import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

const propertiesSchema = z.object({
  period: z.string().describe("Optional fiscal period to summarize.").optional(),
  includePending: z.boolean().describe("Whether to include pending requests in the forecast.").optional()
});

export type IGetTeamBudgetCopilotComponentProperties = z.infer<typeof propertiesSchema>;

export default zodToJsonSchema(propertiesSchema);
