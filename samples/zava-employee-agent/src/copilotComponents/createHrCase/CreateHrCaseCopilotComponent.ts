import type { ICreateHrCaseCopilotComponentProperties } from './CreateHrCaseCopilotComponentProperties';
import { normalizeCreateHrCaseProperties } from './CreateHrCaseCopilotComponentProperties';
import CatalogIntentCopilotComponentBase from '../shared/experiences/CatalogIntentCopilotComponentBase';

export default class CreateHrCaseCopilotComponent extends CatalogIntentCopilotComponentBase<ICreateHrCaseCopilotComponentProperties> {
  protected intentKey = 'createHrCase';
  protected normalizeProperties(properties: unknown): Record<string, string> { return normalizeCreateHrCaseProperties(properties); }
}
