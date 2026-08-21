import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

const propertiesSchema = z.object({
  period: z
    .enum(['today', 'week', 'month', 'year'])
    .optional()
    .describe(
      'Optional period for the Home experience: today, week, month, or year. ' +
        'Use the period explicitly requested by the user.'
    ),
  focusArea: z
    .enum(['all', 'time', 'money', 'benefits', 'rewards', 'policy', 'support', 'learning', 'team', 'people'])
    .optional()
    .describe(
      'Optional HR family to emphasize in the cross-family Home summary. Use all when no family is specified.'
    ),
  includeSensitive: z
    .boolean()
    .optional()
    .describe(
      'Whether sensitive payroll, rewards, or case details may appear. Default to false unless the user explicitly requests sensitive details.'
    ),
  locale: z
    .string()
    .optional()
    .describe('Optional BCP 47 locale such as en-US or fi-FI for dates and numbers.'),
  privacyLevel: z
    .enum(['standard', 'private', 'sensitive'])
    .optional()
    .describe('Optional privacy level requested by the user: standard, private, or sensitive.')
});

export type IGetMyHrDashboardCopilotComponentProperties = z.infer<typeof propertiesSchema>;

export default zodToJsonSchema(propertiesSchema);
