import type { IPolicyAnswerCopilotComponentProperties } from './PolicyAnswerCopilotComponentProperties';
import { normalizePolicyAnswerProperties } from './PolicyAnswerCopilotComponentProperties';
import PolicyIntentCopilotComponentBase, { type ResolvedPolicyIntent } from './PolicyIntentCopilotComponentBase';

export default class PolicyAnswerCopilotComponent extends PolicyIntentCopilotComponentBase<IPolicyAnswerCopilotComponentProperties> {
  protected resolveIntent(properties: unknown): ResolvedPolicyIntent {
    const normalized = normalizePolicyAnswerProperties(properties);
    return { kind: 'answer', family: 'policy', route: 'policy/answer', properties: normalized, params: { ...normalized } };
  }
}
