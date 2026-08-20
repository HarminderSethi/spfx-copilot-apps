import * as React from 'react';

import { Text } from '@fluentui/react-text';
import { makeStyles } from '@griffel/react';
import { tokens } from '@fluentui/react-theme';
import { Info20Regular } from '@fluentui/react-icons';

import type { IIntentDefinition, IProjectIntentProperties } from '../models/projectPortfolio';
import { getInlineOperation } from '../models/intentOperations';
import InformationInlineExperiences from '../components/inline/InformationInlineExperiences';
import { AiBudgetRequestForm, AiSpendControlTower } from '../components/inline/PilotInlineExperiences';
import ReviewInlineExperiences from '../components/inline/ReviewInlineExperiences';
import SubmissionInlineExperiences from '../components/inline/SubmissionInlineExperiences';

const useStyles = makeStyles({
  stack: { display: 'flex', flexDirection: 'column', gap: '8px', minWidth: 0 },
  notice: { display: 'grid', gridTemplateColumns: '20px minmax(0, 1fr)', gap: '7px', padding: '8px', color: tokens.colorBrandForeground1, backgroundColor: tokens.colorBrandBackground2, borderRadius: tokens.borderRadiusMedium },
  preview: { minWidth: 0, maxHeight: '440px', overflowY: 'auto', padding: '10px', border: `1px solid ${tokens.colorNeutralStroke2}`, borderRadius: tokens.borderRadiusMedium, backgroundColor: tokens.colorNeutralBackground1 }
});

export interface ICapabilityPreviewProps {
  definition: IIntentDefinition;
  properties: IProjectIntentProperties;
  compact: boolean;
}

const PreviewBody: React.FunctionComponent<ICapabilityPreviewProps> = (props) => {
  if (props.definition.key === 'GetProjectAiSpend') {
    return <AiSpendControlTower properties={props.properties} compact={props.compact}/>;
  }
  if (props.definition.key === 'RequestAiBudget') {
    return <AiBudgetRequestForm properties={props.properties} compact={props.compact}/>;
  }
  const operation = getInlineOperation(props.definition.key);
  if (operation === 'review') {
    return <ReviewInlineExperiences definition={props.definition} properties={props.properties} compact={props.compact}/>;
  }
  if (operation === 'submit') {
    return <SubmissionInlineExperiences definition={props.definition} properties={props.properties} compact={props.compact}/>;
  }
  return <InformationInlineExperiences definition={props.definition} properties={props.properties} compact={props.compact}/>;
};

const CapabilityPreview: React.FunctionComponent<ICapabilityPreviewProps> = (props) => {
  const styles = useStyles();
  const stopInteraction = (event: React.SyntheticEvent): void => {
    event.preventDefault();
    event.stopPropagation();
  };
  return <div className={styles.stack} data-layout="capability-preview">
    <div className={styles.notice}><Info20Regular/><Text size={200}>Demo preview - no action applied. Use the prompt in chat to open the full experience.</Text></div>
    <div className={styles.preview} aria-label={`${props.definition.title} safe preview`} onClickCapture={stopInteraction} onSubmitCapture={stopInteraction} onKeyDownCapture={(event) => { if (event.key === 'Enter' || event.key === ' ') stopInteraction(event); }}>
      <PreviewBody {...props}/>
    </div>
  </div>;
};

export default CapabilityPreview;
