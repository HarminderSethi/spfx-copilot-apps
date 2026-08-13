import type { IRequestTimeOffCopilotComponentProperties } from './RequestTimeOffCopilotComponentProperties';
import { normalizeRequestTimeOffProperties } from './RequestTimeOffCopilotComponentProperties';
import CatalogIntentCopilotComponentBase from '../shared/experiences/CatalogIntentCopilotComponentBase';

export default class RequestTimeOffCopilotComponent extends CatalogIntentCopilotComponentBase<IRequestTimeOffCopilotComponentProperties> {
  protected intentKey = 'requestTimeOff';
  protected normalizeProperties(properties: unknown): Record<string, string> { return normalizeRequestTimeOffProperties(properties); }
}
