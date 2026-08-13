import * as React from 'react';

import { Text } from '@fluentui/react-text';
import { makeStyles, mergeClasses } from '@griffel/react';
import { tokens } from '@fluentui/react-theme';
import {
  CalendarLtr20Filled,
  CheckmarkCircle20Filled,
  Person20Filled,
  Trophy20Filled
} from '@fluentui/react-icons';

import type { IZavaEmployeeExperience, IZavaHrSignal, IZavaTimelineItem } from '../../../shared/models/zavaEmployee';
import { fadeInUp } from '../../../shared/utils/motion';
import type { HomePeriod, HomeView } from '../../normalizeHomeProperties';
import { buildHomeSummary } from './homeDataSelectors';
import HomeGreeting from './HomeGreeting';
import HomeSummaryTile from './HomeSummaryTile';

const useStyles = makeStyles({
  root: { display: 'flex', flexDirection: 'column', gap: '12px' },
  summary: { color: tokens.colorNeutralForeground2, lineHeight: tokens.lineHeightBase300 },
  enter: {
    animationName: fadeInUp,
    animationDuration: tokens.durationSlow,
    animationTimingFunction: tokens.curveDecelerateMid,
    animationFillMode: 'both',
    '@media (prefers-reduced-motion: reduce)': { animationName: 'none', animationDuration: '1ms' }
  },
  delay1: { animationDelay: '70ms' },
  delay2: { animationDelay: '140ms' },
  delay3: { animationDelay: '210ms' },
  delay4: { animationDelay: '280ms' }
});

export interface IHomeSummaryProps {
  data: IZavaEmployeeExperience;
  signals: IZavaHrSignal[];
  timeline: IZavaTimelineItem[];
  period: HomePeriod;
  now: Date;
  onNavigate?: (view: HomeView) => void;
  onRequestFullscreen?: () => void;
}

const HomeSummary: React.FunctionComponent<IHomeSummaryProps> = (props) => {
  const styles = useStyles();
  const priorityCount = props.signals.filter(
    (signal) => signal.priority === 'critical' || signal.priority === 'high'
  ).length;
  const nextSignal = props.signals[0];
  const milestone = props.data.milestones[0];
  return (
    <div className={styles.root}>
      <div className={styles.enter}>
        <HomeGreeting
          user={props.data.user}
          now={props.now}
          onRequestFullscreen={props.onRequestFullscreen}
        />
      </div>
      <Text className={mergeClasses(styles.summary, styles.enter, styles.delay1)}>
        {buildHomeSummary(props.signals, props.timeline, props.period)}
      </Text>
      <div className={mergeClasses(styles.enter, styles.delay2)}>
        <HomeSummaryTile
          icon={<CheckmarkCircle20Filled />}
          accent="pink"
          title="What needs you"
          primary={`${priorityCount} priorit${priorityCount === 1 ? 'y' : 'ies'}`}
          secondary={nextSignal?.title || 'You are all caught up'}
          onClick={props.onNavigate ? () => props.onNavigate?.('actions') : undefined}
        />
      </div>
      <div className={mergeClasses(styles.enter, styles.delay3)}>
        <HomeSummaryTile
          icon={<Person20Filled />}
          accent="teal"
          title="Profile health"
          primary="86% complete"
          secondary="One update recommended"
          onClick={props.onNavigate ? () => props.onNavigate?.('profile') : undefined}
        />
      </div>
      <div className={mergeClasses(styles.enter, styles.delay4)}>
        <HomeSummaryTile
          icon={<CalendarLtr20Filled />}
          accent="blue"
          title="Worklife snapshot"
          primary={`${props.timeline.length} upcoming moments`}
          secondary={`${props.data.events.length} connected calendar signals`}
          onClick={props.onNavigate ? () => props.onNavigate?.('timeline') : undefined}
        />
      </div>
      <HomeSummaryTile
        icon={<Trophy20Filled />}
        accent="amber"
        title="Your milestones"
        primary={milestone?.title || 'No milestone due'}
        secondary={milestone?.summary || 'Your next milestone will appear here'}
        onClick={props.onNavigate ? () => props.onNavigate?.('milestones') : undefined}
      />
    </div>
  );
};

export default HomeSummary;