import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

const propertiesSchema = z.object({
  projectId: z.string().optional().describe('Project Id extracted from the user prompt when provided.'),
  startDate: z.string().optional().describe('Start Date extracted from the user prompt when provided.'),
  endDate: z.string().optional().describe('End Date extracted from the user prompt when provided.'),
  role: z.string().optional().describe('Role extracted from the user prompt when provided.'),
  personId: z.string().optional().describe('Person Id extracted from the user prompt when provided.'),
  scenario: z.string().optional().describe('Scenario extracted from the user prompt when provided.'),
  showSkillGaps: z.boolean().optional().describe('Show Skill Gaps extracted from the user prompt when provided.')
});

export type IGetProjectTeamCapacityCopilotComponentProperties = z.infer<typeof propertiesSchema>;

export default zodToJsonSchema(propertiesSchema);
