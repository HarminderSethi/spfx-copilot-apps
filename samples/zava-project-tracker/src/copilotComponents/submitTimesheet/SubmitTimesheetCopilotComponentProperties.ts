import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

const propertiesSchema = z.object({
  projectId: z.string().optional().describe('Project Id extracted from the user prompt when provided.'),
  workDate: z.string().optional().describe('Work Date extracted from the user prompt when provided.'),
  hours: z.number().optional().describe('Hours extracted from the user prompt when provided.'),
  workCategory: z.string().optional().describe('Work Category extracted from the user prompt when provided.'),
  notes: z.string().optional().describe('Notes extracted from the user prompt when provided.'),
  weekEnding: z.string().optional().describe('Week Ending extracted from the user prompt when provided.')
});

export type ISubmitTimesheetCopilotComponentProperties = z.infer<typeof propertiesSchema>;

export default zodToJsonSchema(propertiesSchema);
