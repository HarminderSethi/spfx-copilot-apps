import * as React from 'react';

import { Avatar } from '@fluentui/react-avatar';
import { Text } from '@fluentui/react-text';
import { makeStyles } from '@griffel/react';
import { tokens } from '@fluentui/react-theme';
import { ArrowLeft20Regular } from '@fluentui/react-icons';

import type {
  IZavaDestination,
  IZavaEmployeeExperience
} from '../../../shared/models/zavaEmployee';
import FamilyBadge from '../../../shared/components/FamilyBadge';
import GroundingSource from '../../../shared/components/GroundingSource';

const useStyles = makeStyles({
  root: {
    display: 'grid',
    gridTemplateColumns: '36px minmax(0, 1fr) auto',
    gap: '12px',
    alignItems: 'start',
    padding: '14px 16px',
    backgroundColor: tokens.colorNeutralBackground1,
    borderLeft: `4px solid ${tokens.colorBrandStroke1}`,
    borderRadius: tokens.borderRadiusLarge,
    boxShadow: tokens.shadow4
  },
  back: {
    width: '34px',
    height: '34px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    color: tokens.colorNeutralForeground2,
    backgroundColor: tokens.colorNeutralBackground3,
    border: 'none',
    borderRadius: tokens.borderRadiusMedium,
    cursor: 'pointer'
  },
  title: { fontWeight: tokens.fontWeightSemibold },
  summary: { color: tokens.colorNeutralForeground2, lineHeight: tokens.lineHeightBase300 },
  grounding: { marginTop: '8px' },
  people: { display: 'flex', alignItems: 'center', gap: '4px' }
});

export interface IDestinationDetailProps {
  destination: IZavaDestination;
  data: IZavaEmployeeExperience;
  detailRef: React.RefObject<HTMLDivElement>;
  onDismiss: () => void;
}

const DestinationDetail: React.FunctionComponent<IDestinationDetailProps> = (props) => {
  const styles = useStyles();
  const signal = props.data.signals.find((candidate) =>
    candidate.destination.family === props.destination.family &&
    candidate.destination.route === props.destination.route
  );
  return (
    <div ref={props.detailRef} className={styles.root} tabIndex={-1} role="region" aria-label="Selected HR detail">
      <button type="button" className={styles.back} aria-label="Back to Home dashboard" onClick={props.onDismiss}>
        <ArrowLeft20Regular />
      </button>
      <div>
        <FamilyBadge family={props.destination.family} />
        <Text size={500} block className={styles.title}>{signal?.title || props.destination.route}</Text>
        <Text size={300} block className={styles.summary}>
          {signal?.summary || 'This destination is ready for its owning family experience.'}
        </Text>
        {signal?.grounding[0] && (
          <div className={styles.grounding}><GroundingSource source={signal.grounding[0]} /></div>
        )}
      </div>
      <div className={styles.people} aria-label="Related people">
        {signal?.relatedPeople.slice(0, 3).map((person) => (
          <Avatar key={person.id} name={person.displayName} image={{ src: person.photoUrl }} size={32} />
        ))}
      </div>
    </div>
  );
};

export default DestinationDetail;