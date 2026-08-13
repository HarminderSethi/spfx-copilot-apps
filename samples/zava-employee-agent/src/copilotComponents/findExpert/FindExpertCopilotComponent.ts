import type { IFindExpertCopilotComponentProperties } from './FindExpertCopilotComponentProperties';
import { normalizeFindExpertProperties } from './FindExpertCopilotComponentProperties';
import CatalogIntentCopilotComponentBase from '../shared/experiences/CatalogIntentCopilotComponentBase';

export default class FindExpertCopilotComponent extends CatalogIntentCopilotComponentBase<IFindExpertCopilotComponentProperties> {
  protected intentKey = 'findExpert';
  protected normalizeProperties(properties: unknown): Record<string, string> { return normalizeFindExpertProperties(properties); }
}
