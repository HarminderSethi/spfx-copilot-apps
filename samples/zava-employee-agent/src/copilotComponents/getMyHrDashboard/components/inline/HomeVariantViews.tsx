import * as React from 'react';

import { Avatar } from '@fluentui/react-avatar';
import { Text } from '@fluentui/react-text';
import {
  makeStyles,
  mergeClasses
} from '@griffel/react';
import { tokens } from '@fluentui/react-theme';
import {
  CalendarLtr20Regular,
  CheckmarkCircle20Filled,
  Clock20Regular,
  Heart20Regular,
  ShieldCheckmark20Regular
} from '@fluentui/react-icons';

import type {
  IZavaEmployeeExperience,
  IZavaHrSignal,
  IZavaTimelineItem
} from '../../../shared/models/zavaEmployee';
import { formatShortDate, formatTimeUntil } from '../../../shared/utils/datetime';
import InlineDetailHeader from '../../../shared/components/InlineDetailHeader';
import EmptyState from '../../../shared/components/EmptyState';
import StatusBadge from '../../../shared/components/StatusBadge';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  panel: {
    padding: '14px',
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusLarge,
    boxShadow: tokens.shadow2
  },
  profile: { display: 'grid', gridTemplateColumns: '72px minmax(0, 1fr)', gap: '14px', alignItems: 'center' },
  score: { fontWeight: tokens.fontWeightBold },
  muted: { color: tokens.colorNeutralForeground3 },
  list: { display: 'flex', flexDirection: 'column' },
  row: {
    display: 'grid',
    gridTemplateColumns: '32px minmax(0, 1fr) auto',
    gap: '10px',
    alignItems: 'center',
    minHeight: '54px',
    paddingTop: '8px',
    paddingBottom: '8px',
    borderTop: `1px solid ${tokens.colorNeutralStroke3}`
  },
  firstRow: { borderTop: 'none' },
  icon: {
    width: '30px',
    height: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: tokens.colorBrandForeground1,
    backgroundColor: tokens.colorBrandBackground2,
    borderRadius: tokens.borderRadiusMedium
  },
  rowTitle: { fontWeight: tokens.fontWeightSemibold },
  metricGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '8px' },
  metric: { padding: '12px', backgroundColor: tokens.colorNeutralBackground3, borderRadius: tokens.borderRadiusMedium },
  metricValue: { fontWeight: tokens.fontWeightBold },
  people: { display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px', flexWrap: 'wrap' },
  milestoneImage: { display: 'block', width: '100%', aspectRatio: '3 / 2', objectFit: 'cover', objectPosition: 'center center', borderRadius: tokens.borderRadiusMedium },
});

interface IBaseViewProps {
  data: IZavaEmployeeExperience;
  onBack?: () => void;
  onRequestFullscreen?: () => void;
}

export interface IActionsViewProps extends IBaseViewProps {
  signals: IZavaHrSignal[];
  now: Date;
}

export const ActionsView: React.FunctionComponent<IActionsViewProps> = (props) => {
  const styles = useStyles();
  return (
    <div className={styles.root}>
      <InlineDetailHeader title="Your next best actions" onBack={props.onBack} onRequestFullscreen={props.onRequestFullscreen} />
      <div className={styles.panel}>
        {props.signals.length === 0 ? (
          <EmptyState message="You are all caught up for this focus area." />
        ) : (
          <div className={styles.list}>
            {props.signals.slice(0, 5).map((signal, index) => (
              <div key={signal.id} className={mergeClasses(styles.row, index === 0 && styles.firstRow)}>
                <span className={styles.icon}><CheckmarkCircle20Filled /></span>
                <span>
                  <Text block className={styles.rowTitle}>{signal.title}</Text>
                  <Text size={200} block className={styles.muted}>{signal.summary}</Text>
                </span>
                <StatusBadge label={signal.dueAt ? formatTimeUntil(signal.dueAt, props.now) : signal.status} intent="attention" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const ProfileView: React.FunctionComponent<IBaseViewProps> = (props) => {
  const styles = useStyles();
  return (
    <div className={styles.root}>
      <InlineDetailHeader title="Profile health" onBack={props.onBack} onRequestFullscreen={props.onRequestFullscreen} />
      <div className={mergeClasses(styles.panel, styles.profile)}>
        <Avatar name={props.data.user.displayName} image={{ src: props.data.user.photoUrl }} size={72} />
        <div>
          <Text size={600} block className={styles.score}>86%</Text>
          <Text size={300} block>{props.data.user.displayName}</Text>
          <Text size={200} block className={styles.muted}>{props.data.user.jobTitle}</Text>
        </div>
      </div>
      <div className={styles.panel}>
        <div className={styles.list}>
          <div className={mergeClasses(styles.row, styles.firstRow)}><span className={styles.icon}><ShieldCheckmark20Regular /></span><span><Text block className={styles.rowTitle}>Contact details verified</Text><Text size={200} className={styles.muted}>Email and office location are current</Text></span><Text size={200}>Done</Text></div>
          <div className={styles.row}><span className={styles.icon}><Heart20Regular /></span><span><Text block className={styles.rowTitle}>Emergency contact added</Text><Text size={200} className={styles.muted}>Your primary contact is available</Text></span><Text size={200}>Done</Text></div>
          <div className={styles.row}><span className={styles.icon}><CheckmarkCircle20Filled /></span><span><Text block className={styles.rowTitle}>Skills need review</Text><Text size={200} className={styles.muted}>Accessibility and design systems were last reviewed six months ago</Text></span><StatusBadge label="Update" intent="attention" /></div>
        </div>
      </div>
    </div>
  );
};

export interface ITimelineViewProps extends IBaseViewProps {
  timeline: IZavaTimelineItem[];
  locale?: string;
}

export const TimelineView: React.FunctionComponent<ITimelineViewProps> = (props) => {
  const styles = useStyles();
  return (
    <div className={styles.root}>
      <InlineDetailHeader title="Worklife snapshot" onBack={props.onBack} onRequestFullscreen={props.onRequestFullscreen} />
      <div className={styles.panel}>
        <div className={styles.metricGrid}>
          {props.data.metrics.map((metric) => (
            <div key={metric.id} className={styles.metric}>
              <Text size={500} block className={styles.metricValue}>{metric.value}</Text>
              <Text size={200} block className={styles.muted}>{metric.label}</Text>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.panel}>
        {props.timeline.length === 0 ? (
          <EmptyState message="No upcoming moments in this period." />
        ) : props.timeline.map((item, index) => (
          <div key={item.id} className={mergeClasses(styles.row, index === 0 && styles.firstRow)}>
            <span className={styles.icon}><CalendarLtr20Regular /></span>
            <span><Text block className={styles.rowTitle}>{item.title}</Text><Text size={200} block className={styles.muted}>{item.summary}</Text></span>
            <Text size={200}>{formatShortDate(item.occursAt, props.locale)}</Text>
          </div>
        ))}
      </div>
    </div>
  );
};

export const MilestonesView: React.FunctionComponent<IBaseViewProps> = (props) => {
  const styles = useStyles();
  const milestone = props.data.milestones[0];
  return (
    <div className={styles.root}>
      <InlineDetailHeader title="Your milestones" onBack={props.onBack} onRequestFullscreen={props.onRequestFullscreen} />
      {milestone ? (
        <div className={styles.panel}>
          <img
            className={styles.milestoneImage}
            src={milestone.imageUrl}
            alt={`Megan Bowen: ${milestone.title}`}
          />
          <Text size={500} block className={styles.rowTitle}>{milestone.title}</Text>
          <Text size={300} block>{milestone.summary}</Text>
          <Text size={200} block className={styles.muted}>
            <Clock20Regular /> {formatShortDate(milestone.occursAt)}
          </Text>
          <div className={styles.people}>
            {props.data.people.filter((person) => person.relationship !== 'self').slice(0, 3).map((person) => (
              <Avatar key={person.id} name={person.displayName} image={{ src: person.photoUrl }} size={32} />
            ))}
          </div>
        </div>
      ) : (
        <EmptyState message="Your next milestone will appear here." />
      )}
    </div>
  );
};