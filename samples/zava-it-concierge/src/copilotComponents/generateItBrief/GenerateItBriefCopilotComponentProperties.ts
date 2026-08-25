import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

const propertiesSchema = z.object({
  scope: z.string().describe("Optional personal, team, or company scope.").optional(),
  focus: z.string().describe("Optional topic to emphasize.").optional()
});

export type IGenerateItBriefCopilotComponentProperties = z.infer<typeof propertiesSchema>;

export default zodToJsonSchema(propertiesSchema);
