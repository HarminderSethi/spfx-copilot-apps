import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

const propertiesSchema = z.object({
  projectId: z.string().optional().describe('Project Id extracted from the user prompt when provided.'),
  asOfDate: z.string().optional().describe('As Of Date extracted from the user prompt when provided.'),
  period: z.string().optional().describe('Period extracted from the user prompt when provided.'),
  focus: z.string().optional().describe('Focus extracted from the user prompt when provided.'),
  compareToBaseline: z.boolean().optional().describe('Compare To Baseline extracted from the user prompt when provided.')
});

export type IGetProjectHealthCopilotComponentProperties = z.infer<typeof propertiesSchema>;

export default zodToJsonSchema(propertiesSchema);
