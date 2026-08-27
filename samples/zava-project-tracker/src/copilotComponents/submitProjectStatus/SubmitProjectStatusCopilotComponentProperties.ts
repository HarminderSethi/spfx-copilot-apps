import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

const propertiesSchema = z.object({
  projectId: z.string().optional().describe('Project Id extracted from the user prompt when provided.'),
  reportingDate: z.string().optional().describe('Reporting Date extracted from the user prompt when provided.'),
  overallStatus: z.string().optional().describe('Overall Status extracted from the user prompt when provided.'),
  summary: z.string().optional().describe('Summary extracted from the user prompt when provided.'),
  accomplishments: z.array(z.string()).optional().describe('Accomplishments extracted from the user prompt when provided.'),
  nextSteps: z.array(z.string()).optional().describe('Next Steps extracted from the user prompt when provided.'),
  helpNeeded: z.string().optional().describe('Help Needed extracted from the user prompt when provided.')
});

export type ISubmitProjectStatusCopilotComponentProperties = z.infer<typeof propertiesSchema>;

export default zodToJsonSchema(propertiesSchema);
