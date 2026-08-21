import type { ILatestPayCopilotComponentProperties } from './LatestPayCopilotComponentProperties';
import { normalizeLatestPayProperties } from './LatestPayCopilotComponentProperties';
import CatalogIntentCopilotComponentBase from '../shared/experiences/CatalogIntentCopilotComponentBase';

export default class LatestPayCopilotComponent extends CatalogIntentCopilotComponentBase<ILatestPayCopilotComponentProperties> {
  protected intentKey = 'latestPay';
  protected normalizeProperties(properties: unknown): Record<string, string> { return normalizeLatestPayProperties(properties); }
}
