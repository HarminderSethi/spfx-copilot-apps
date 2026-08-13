import * as React from 'react';

import { Avatar } from '@fluentui/react-avatar';
import { Text } from '@fluentui/react-text';
import { makeStyles } from '@griffel/react';
import { tokens } from '@fluentui/react-theme';
import { Sparkle20Filled } from '@fluentui/react-icons';

import type {
  IZavaMetric,
  IZavaUser
} from '../models/zavaEmployee';
import { formatFullDate } from '../utils/datetime';
import { getGreeting } from '../utils/greeting';
import MetricTile from './MetricTile';

const useStyles = makeStyles({
  root: { display: 'flex', flexDirection: 'column', gap: '18px' },
  top: {
    minHeight: '72px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '20px',
    '@media (max-width: 680px)': { alignItems: 'flex-start', flexDirection: 'column' }
  },
  identity: { display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 },
  avatarFrame: {
    padding: '3px',
    flexShrink: 0,
    backgroundImage: `linear-gradient(135deg, ${tokens.colorBrandBackground}, ${tokens.colorPaletteBerryBackground3})`,
    borderRadius: tokens.borderRadiusCircular
  },
  copy: { minWidth: 0 },
  date: { color: tokens.colorNeutralForeground3 },
  greeting: { fontWeight: tokens.fontWeightSemibold, lineHeight: tokens.lineHeightHero700 },
  subtext: { color: tokens.colorNeutralForeground2 },
  pulse: {
    minWidth: '224px',
    display: 'grid',
    gridTemplateColumns: '36px minmax(0, 1fr)',
    alignItems: 'center',
    gap: '9px',
    padding: '9px 11px',
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusLarge,
    '@media (max-width: 680px)': { width: '100%', boxSizing: 'border-box' }
  },
  pulseIcon: {
    width: '34px',
    height: '34px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: tokens.colorPaletteBlueForeground2,
    backgroundColor: tokens.colorPaletteBlueBackground2,
    border: `1px solid ${tokens.colorPaletteBlueBorderActive}`,
    borderRadius: tokens.borderRadiusMedium
  },
  pulseLabel: { color: tokens.colorNeutralForeground3, textTransform: 'uppercase' },
  pulseValue: { fontWeight: tokens.fontWeightSemibold },
  metrics: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
    gap: '10px',
    '@media (max-width: 760px)': { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }
  },
});

export interface IPersonalizedHeroProps {
  user: IZavaUser;
  metrics: IZavaMetric[];
  now: Date;
  nextMoment: string;
}

const PersonalizedHero: React.FunctionComponent<IPersonalizedHeroProps> = (props) => {
  const styles = useStyles();
  const greeting = getGreeting(props.now);
  return (
    <section
      className={styles.root}
      aria-labelledby="home-dashboard-heading"
      data-home-route="home/summary"
      tabIndex={-1}
    >
      <div className={styles.top}>
        <div className={styles.identity}>
          <div className={styles.avatarFrame}>
            <Avatar name={props.user.displayName} image={{ src: props.user.photoUrl }} size={64} />
          </div>
          <div className={styles.copy}>
            <Text size={200} block className={styles.date}>{formatFullDate(props.now)}</Text>
            <Text id="home-dashboard-heading" as="h1" size={800} block className={styles.greeting}>
              {greeting.text}, {props.user.firstName}
            </Text>
            <Text size={300} block className={styles.subtext}>
              You are in good shape. Here is what needs attention across work and HR.
            </Text>
          </div>
        </div>
        <div className={styles.pulse}>
          <span className={styles.pulseIcon} aria-hidden="true"><Sparkle20Filled /></span>
          <span>
            <Text size={100} block className={styles.pulseLabel}>Next important moment</Text>
            <Text size={300} block className={styles.pulseValue}>{props.nextMoment}</Text>
          </span>
        </div>
      </div>
      <div className={styles.metrics} aria-label="Home metrics">
        {props.metrics.map((metric) => (
          <MetricTile key={metric.id} metric={metric} />
        ))}
      </div>
    </section>
  );
};

export default PersonalizedHero;