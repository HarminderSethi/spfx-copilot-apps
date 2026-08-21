import * as React from 'react';

import type { IProjectIntentAppProps } from '../ProjectIntentApp';
import CapabilityExplorer from '../../capabilityExplorer/CapabilityExplorer';
import { getInlineOperation } from '../../models/intentOperations';
import InformationInlineExperiences from './InformationInlineExperiences';
import { AiBudgetRequestForm, AiSpendControlTower } from './PilotInlineExperiences';
import ReviewInlineExperiences from './ReviewInlineExperiences';
import SubmissionInlineExperiences from './SubmissionInlineExperiences';

export interface IInlineExperienceRouterProps extends IProjectIntentAppProps {
  compact: boolean;
}

const InlineExperienceRouter: React.FunctionComponent<IInlineExperienceRouterProps> = (props) => {
  if (getInlineOperation(props.definition.key) === 'education') {
    return <CapabilityExplorer properties={props.properties} compact={props.compact} fullscreen={props.displayMode === 'fullscreen'}/>;
  }
  switch (props.definition.key) {
    case 'GetProjectAiSpend':
      return <AiSpendControlTower properties={props.properties} compact={props.compact} />;
    case 'RequestAiBudget':
      return <AiBudgetRequestForm properties={props.properties} compact={props.compact} />;
    default: {
      const operation = getInlineOperation(props.definition.key);
      if (operation === 'review') {
        return <ReviewInlineExperiences definition={props.definition} properties={props.properties} compact={props.compact} fullscreen={props.displayMode === 'fullscreen'} transientState={props.transientState} onTransientStateChange={props.onTransientStateChange} />;
      }
      if (operation === 'submit') {
        return <SubmissionInlineExperiences definition={props.definition} properties={props.properties} compact={props.compact} transientState={props.transientState} onTransientStateChange={props.onTransientStateChange} />;
      }
      return <InformationInlineExperiences definition={props.definition} properties={props.properties} compact={props.compact} transientState={props.transientState} onTransientStateChange={props.onTransientStateChange} />;
    }
  }
};

export default InlineExperienceRouter;