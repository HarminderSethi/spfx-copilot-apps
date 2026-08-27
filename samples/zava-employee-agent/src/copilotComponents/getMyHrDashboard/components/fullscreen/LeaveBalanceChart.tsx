import * as React from 'react';

import { Text } from '@fluentui/react-text';
import { makeStyles } from '@griffel/react';
import { tokens } from '@fluentui/react-theme';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '7px',
    minWidth: 0
  },
  chart: {
    position: 'relative',
    width: '112px',
    height: '112px',
    flexShrink: 0,
    '@media (max-width: 360px)': {
      width: '92px',
      height: '92px'
    }
  },
  svg: {
    display: 'block',
    width: '100%',
    height: '100%',
    overflow: 'visible',
    filter: `drop-shadow(0 3px 6px ${tokens.colorNeutralShadowAmbient})`
  },
  center: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none'
  },
  value: {
    fontWeight: tokens.fontWeightBold,
    lineHeight: tokens.lineHeightHero700
  },
  unit: {
    marginTop: '-2px',
    color: tokens.colorNeutralForeground3
  },
  caption: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    color: tokens.colorNeutralForeground2,
    whiteSpace: 'nowrap'
  },
  dot: {
    width: '7px',
    height: '7px',
    flexShrink: 0,
    backgroundColor: tokens.colorPaletteTealForeground2,
    borderRadius: tokens.borderRadiusCircular
  }
});

export interface ILeaveBalanceChartProps {
  available: number;
  total: number;
}

const LeaveBalanceChart: React.FunctionComponent<ILeaveBalanceChartProps> = ({ available, total }) => {
  const styles = useStyles();
  const percentage = total > 0 ? Math.max(0, Math.min(100, Math.round((available / total) * 100))) : 0;

  return (
    <div className={styles.root}>
      <div
        className={styles.chart}
        role="img"
        aria-label={`Vacation balance: ${available} of ${total} days available, ${percentage} percent`}
      >
        <svg className={styles.svg} viewBox="0 0 120 120" aria-hidden="true" focusable="false">
          <defs>
            <linearGradient id="zava-leave-balance-gradient" x1="18" y1="18" x2="102" y2="102" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor={tokens.colorBrandBackground} />
              <stop offset="0.55" stopColor={tokens.colorPaletteTealForeground2} />
              <stop offset="1" stopColor={tokens.colorPaletteBerryForeground2} />
            </linearGradient>
          </defs>
          <circle
            cx="60"
            cy="60"
            r="45"
            fill={tokens.colorNeutralBackground1}
            stroke={tokens.colorNeutralStroke2}
            strokeWidth="1"
          />
          <circle
            cx="60"
            cy="60"
            r="39"
            fill="none"
            stroke={tokens.colorNeutralBackground3}
            strokeWidth="11"
          />
          <circle
            cx="60"
            cy="60"
            r="39"
            pathLength="100"
            fill="none"
            stroke="url(#zava-leave-balance-gradient)"
            strokeWidth="11"
            strokeLinecap="round"
            strokeDasharray={`${percentage} ${100 - percentage}`}
            transform="rotate(-90 60 60)"
          />
          <circle
            cx="60"
            cy="60"
            r="29"
            fill={tokens.colorNeutralBackground1}
          />
        </svg>
        <span className={styles.center}>
          <Text size={700} block className={styles.value}>{available}</Text>
          <Text size={100} block className={styles.unit}>of {total} days</Text>
        </span>
      </div>
      <span className={styles.caption}>
        <span className={styles.dot} aria-hidden="true" />
        <Text size={100}>{percentage}% available</Text>
      </span>
    </div>
  );
};

export default LeaveBalanceChart;