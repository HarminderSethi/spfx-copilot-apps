import type { ITotalRewardsSummaryCopilotComponentProperties } from './TotalRewardsSummaryCopilotComponentProperties';
import { normalizeTotalRewardsSummaryProperties } from './TotalRewardsSummaryCopilotComponentProperties';
import CatalogIntentCopilotComponentBase from '../shared/experiences/CatalogIntentCopilotComponentBase';

export default class TotalRewardsSummaryCopilotComponent extends CatalogIntentCopilotComponentBase<ITotalRewardsSummaryCopilotComponentProperties> {
  protected intentKey = 'totalRewardsSummary';
  protected normalizeProperties(properties: unknown): Record<string, string | number | boolean> { return normalizeTotalRewardsSummaryProperties(properties); }
}
