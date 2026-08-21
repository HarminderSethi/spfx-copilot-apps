import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

const propertiesSchema = z.object({
  projectId: z.string().optional().describe('Project Id extracted from the user prompt when provided.'),
  weekEnding: z.string().optional().describe('Week Ending extracted from the user prompt when provided.'),
  accomplishments: z.array(z.string()).optional().describe('Accomplishments extracted from the user prompt when provided.'),
  nextSteps: z.array(z.string()).optional().describe('Next Steps extracted from the user prompt when provided.'),
  blockers: z.array(z.string()).optional().describe('Blockers extracted from the user prompt when provided.'),
  confidence: z.string().optional().describe('Confidence extracted from the user prompt when provided.')
});

export type ISubmitWeeklyUpdateCopilotComponentProperties = z.infer<typeof propertiesSchema>;

export default zodToJsonSchema(propertiesSchema);
