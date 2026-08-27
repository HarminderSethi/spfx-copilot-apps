import type { ICompareBenefitPlansCopilotComponentProperties } from './CompareBenefitPlansCopilotComponentProperties';
import { normalizeCompareBenefitPlansProperties } from './CompareBenefitPlansCopilotComponentProperties';
import CatalogIntentCopilotComponentBase from '../shared/experiences/CatalogIntentCopilotComponentBase';

export default class CompareBenefitPlansCopilotComponent extends CatalogIntentCopilotComponentBase<ICompareBenefitPlansCopilotComponentProperties> {
  protected intentKey = 'compareBenefitPlans';
  protected normalizeProperties(properties: unknown): Record<string, string | number | string[]> { return normalizeCompareBenefitPlansProperties(properties); }
}
