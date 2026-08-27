import type { IPolicyComparisonCopilotComponentProperties } from './PolicyComparisonCopilotComponentProperties';
import { normalizePolicyComparisonProperties } from './PolicyComparisonCopilotComponentProperties';
import PolicyIntentCopilotComponentBase, { type ResolvedPolicyIntent } from '../policyAnswer/PolicyIntentCopilotComponentBase';

export default class PolicyComparisonCopilotComponent extends PolicyIntentCopilotComponentBase<IPolicyComparisonCopilotComponentProperties> {
  protected resolveIntent(properties: unknown): ResolvedPolicyIntent {
    const normalized = normalizePolicyComparisonProperties(properties);
    return { kind: 'comparison', family: 'policy', route: 'policy/compare', properties: normalized, params: { ...normalized } };
  }
}
