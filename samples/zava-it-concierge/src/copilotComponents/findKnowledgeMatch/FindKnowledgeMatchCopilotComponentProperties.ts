import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

const propertiesSchema = z.object({
  query: z.string().describe("Optional support question or symptom.").optional(),
  product: z.string().describe("Optional product used to narrow matching.").optional()
});

export type IFindKnowledgeMatchCopilotComponentProperties = z.infer<typeof propertiesSchema>;

export default zodToJsonSchema(propertiesSchema);
