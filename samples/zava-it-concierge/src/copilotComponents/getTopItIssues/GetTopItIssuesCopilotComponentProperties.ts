import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

const propertiesSchema = z.object({
  period: z.string().describe("Optional reporting period.").optional(),
  region: z.string().describe("Optional region filter.").optional()
});

export type IGetTopItIssuesCopilotComponentProperties = z.infer<typeof propertiesSchema>;

export default zodToJsonSchema(propertiesSchema);
