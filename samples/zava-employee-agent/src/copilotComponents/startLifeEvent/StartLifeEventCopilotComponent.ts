import type { IStartLifeEventCopilotComponentProperties } from './StartLifeEventCopilotComponentProperties';
import { normalizeStartLifeEventProperties } from './StartLifeEventCopilotComponentProperties';
import CatalogIntentCopilotComponentBase from '../shared/experiences/CatalogIntentCopilotComponentBase';

export default class StartLifeEventCopilotComponent extends CatalogIntentCopilotComponentBase<IStartLifeEventCopilotComponentProperties> {
  protected intentKey = 'startLifeEvent';
  protected normalizeProperties(properties: unknown): Record<string, string | number> { return normalizeStartLifeEventProperties(properties); }
}
