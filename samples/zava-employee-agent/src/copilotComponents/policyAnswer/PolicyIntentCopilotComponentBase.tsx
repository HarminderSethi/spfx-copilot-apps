import * as React from 'react';

import ZavaIntentCopilotComponentBase from '../shared/components/ZavaIntentCopilotComponentBase';
import type { IZavaInlineHost, IZavaResolvedIntent } from '../shared/components/ZavaIntentCopilotComponentBase';
import { PolicyInline, type PolicyIntent } from './PolicyExperience';

export type ResolvedPolicyIntent = IZavaResolvedIntent & PolicyIntent;

abstract class PolicyIntentCopilotComponentBase<TProperties>
  extends ZavaIntentCopilotComponentBase<TProperties, ResolvedPolicyIntent> {
  protected renderInline(intent: ResolvedPolicyIntent, host: IZavaInlineHost): React.ReactElement {
    return <PolicyInline intent={intent} onRequestFullscreen={host.onRequestFullscreen} />;
  }
}

export default PolicyIntentCopilotComponentBase;