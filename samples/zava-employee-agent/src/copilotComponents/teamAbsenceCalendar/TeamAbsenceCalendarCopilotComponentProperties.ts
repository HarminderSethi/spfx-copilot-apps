import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

const propertiesSchema = z.object({
  teamId: z.string().optional().describe('Manager team identifier for the calendar.'),
  startDate: z.string().optional().describe('Calendar start date in yyyy-mm-dd format.'),
  endDate: z.string().optional().describe('Calendar end date in yyyy-mm-dd format.')
});

export type ITeamAbsenceCalendarCopilotComponentProperties = z.infer<typeof propertiesSchema>;

export const normalizeTeamAbsenceCalendarProperties = (input: unknown): Record<string, string> => {
  const parsed = propertiesSchema.safeParse(input);
  const value = parsed.success ? parsed.data : {};
  const date = (candidate: string | undefined, fallback: string): string => /^\d{4}-\d{2}-\d{2}$/.test(candidate || '') ? candidate as string : fallback;
  return { teamId: value.teamId?.trim() || 'team-megan', startDate: date(value.startDate, '2026-08-17'), endDate: date(value.endDate, '2026-08-21') };
};

export default zodToJsonSchema(propertiesSchema);
