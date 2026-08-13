import type { IExplainPayChangeCopilotComponentProperties } from './ExplainPayChangeCopilotComponentProperties';
import { normalizeExplainPayChangeProperties } from './ExplainPayChangeCopilotComponentProperties';
import CatalogIntentCopilotComponentBase from '../shared/experiences/CatalogIntentCopilotComponentBase';

export default class ExplainPayChangeCopilotComponent extends CatalogIntentCopilotComponentBase<IExplainPayChangeCopilotComponentProperties> {
  protected intentKey = 'explainPayChange';
  protected normalizeProperties(properties: unknown): Record<string, string | boolean> { return normalizeExplainPayChangeProperties(properties); }
}
