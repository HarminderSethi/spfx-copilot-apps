import type { ITeamAbsenceCalendarCopilotComponentProperties } from './TeamAbsenceCalendarCopilotComponentProperties';
import { normalizeTeamAbsenceCalendarProperties } from './TeamAbsenceCalendarCopilotComponentProperties';
import CatalogIntentCopilotComponentBase from '../shared/experiences/CatalogIntentCopilotComponentBase';

export default class TeamAbsenceCalendarCopilotComponent extends CatalogIntentCopilotComponentBase<ITeamAbsenceCalendarCopilotComponentProperties> {
  protected intentKey = 'teamAbsenceCalendar';
  protected normalizeProperties(properties: unknown): Record<string, string> { return normalizeTeamAbsenceCalendarProperties(properties); }
}
