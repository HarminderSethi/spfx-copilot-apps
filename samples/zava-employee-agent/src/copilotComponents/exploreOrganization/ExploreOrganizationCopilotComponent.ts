import type { IExploreOrganizationCopilotComponentProperties } from './ExploreOrganizationCopilotComponentProperties';
import { normalizeExploreOrganizationProperties } from './ExploreOrganizationCopilotComponentProperties';
import CatalogIntentCopilotComponentBase from '../shared/experiences/CatalogIntentCopilotComponentBase';

export default class ExploreOrganizationCopilotComponent extends CatalogIntentCopilotComponentBase<IExploreOrganizationCopilotComponentProperties> {
  protected intentKey = 'exploreOrganization';
  protected normalizeProperties(properties: unknown): Record<string, string | number> { return normalizeExploreOrganizationProperties(properties); }
}
