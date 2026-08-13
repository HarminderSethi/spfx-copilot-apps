import type { IRequiredLearningCopilotComponentProperties } from './RequiredLearningCopilotComponentProperties';
import { normalizeRequiredLearningProperties } from './RequiredLearningCopilotComponentProperties';
import CatalogIntentCopilotComponentBase from '../shared/experiences/CatalogIntentCopilotComponentBase';

export default class RequiredLearningCopilotComponent extends CatalogIntentCopilotComponentBase<IRequiredLearningCopilotComponentProperties> {
  protected intentKey = 'requiredLearning';
  protected normalizeProperties(properties: unknown): Record<string, number | boolean> { return normalizeRequiredLearningProperties(properties); }
}
