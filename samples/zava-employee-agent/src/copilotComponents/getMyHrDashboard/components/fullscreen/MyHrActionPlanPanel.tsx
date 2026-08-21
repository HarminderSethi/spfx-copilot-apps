import * as React from 'react';

import { Text } from '@fluentui/react-text';
import { makeStyles, mergeClasses } from '@griffel/react';
import { tokens } from '@fluentui/react-theme';
import { Sparkle24Filled } from '@fluentui/react-icons';

import { formatTimeUntil } from '../../../shared/utils/datetime';
import { prefersReducedMotion } from '../../../shared/utils/motion';
import type { IZavaDestination } from '../../../shared/models/zavaEmployee';
import type { IHrActionItem, IHrActionPlan } from '../../models/hrActionPlan';
import RightPanel from '../../../shared/components/RightPanel';
import FamilyBadge from '../../../shared/components/FamilyBadge';

const useStyles = makeStyles({
  shimmer: {
    height: '3px',
    marginBottom: '14px',
    backgroundImage: `linear-gradient(90deg, ${tokens.colorNeutralBackground3}, ${tokens.colorBrandBackground}, ${tokens.colorPaletteBerryBackground3}, ${tokens.colorNeutralBackground3})`,
    backgroundSize: '220% 100%',
    animationName: {
      from: { backgroundPositionX: '100%' },
      to: { backgroundPositionX: '-120%' }
    },
    animationDuration: '1.3s',
    animationIterationCount: 'infinite',
    '@media (prefers-reduced-motion: reduce)': { animationName: 'none' }
  },
  thinking: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    paddingTop: '18px',
    paddingBottom: '18px',
    color: tokens.colorNeutralForeground2
  },
  spinner: {
    width: '22px',
    height: '22px',
    border: `3px solid ${tokens.colorNeutralStroke2}`,
    borderTopColor: tokens.colorBrandStroke1,
    borderRadius: tokens.borderRadiusCircular,
    animationName: { to: { transform: 'rotate(360deg)' } },
    animationDuration: '800ms',
    animationIterationCount: 'infinite',
    animationTimingFunction: 'linear',
    '@media (prefers-reduced-motion: reduce)': { animationName: 'none' }
  },
  headline: {
    display: 'block',
    marginBottom: '8px',
    color: tokens.colorNeutralForeground2,
    lineHeight: tokens.lineHeightBase300
  },
  live: { position: 'absolute', width: '1px', height: '1px', overflow: 'hidden' },
  list: { display: 'flex', flexDirection: 'column' },
  item: {
    display: 'grid',
    gridTemplateColumns: '34px minmax(0, 1fr)',
    gap: '10px',
    paddingTop: '13px',
    paddingBottom: '13px',
    borderTop: `1px solid ${tokens.colorNeutralStroke3}`,
    animationName: {
      from: { opacity: 0, transform: 'translateY(8px)' },
      to: { opacity: 1, transform: 'translateY(0)' }
    },
    animationDuration: tokens.durationNormal,
    '@media (prefers-reduced-motion: reduce)': { animationName: 'none' }
  },
  firstItem: { borderTop: 'none' },
  badge: {
    width: '34px',
    height: '34px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: tokens.colorBrandForeground1,
    backgroundColor: tokens.colorBrandBackground2,
    borderRadius: tokens.borderRadiusMedium,
    fontWeight: tokens.fontWeightBold
  },
  title: { fontWeight: tokens.fontWeightSemibold },
  reason: { color: tokens.colorNeutralForeground3, lineHeight: tokens.lineHeightBase200 },
  time: {
    display: 'inline-block',
    marginTop: '5px',
    padding: '3px 7px',
    color: tokens.colorPaletteMarigoldForeground2,
    backgroundColor: tokens.colorPaletteMarigoldBackground2,
    borderRadius: tokens.borderRadiusCircular
  },
  action: {
    display: 'inline-flex',
    marginTop: '8px',
    padding: '7px 10px',
    color: tokens.colorNeutralForegroundOnBrand,
    backgroundColor: tokens.colorBrandBackground,
    border: 'none',
    borderRadius: tokens.borderRadiusMedium,
    cursor: 'pointer',
    fontWeight: tokens.fontWeightSemibold,
    ':hover': { backgroundColor: tokens.colorBrandBackgroundHover },
    ':focus-visible': {
      outlineColor: tokens.colorStrokeFocus2,
      outlineStyle: 'solid',
      outlineWidth: '2px'
    }
  }
});

export interface IMyHrActionPlanPanelProps {
  plan: IHrActionPlan;
  isModal?: boolean;
  onDismiss: () => void;
  onNavigate: (destination: IZavaDestination) => void;
}

const MyHrActionPlanPanel: React.FunctionComponent<IMyHrActionPlanPanelProps> = (props) => {
  const styles = useStyles();
  const [phase, setPhase] = React.useState<'thinking' | 'streaming' | 'done'>('thinking');
  const [revealed, setRevealed] = React.useState(0);

  React.useEffect(() => {
    setPhase('thinking');
    setRevealed(0);
    if (prefersReducedMotion()) {
      setRevealed(props.plan.items.length);
      setPhase('done');
      return;
    }
    const handle = window.setTimeout(() => setPhase('streaming'), 800);
    return () => window.clearTimeout(handle);
  }, [props.plan]);

  React.useEffect(() => {
    if (phase !== 'streaming') {
      return;
    }
    if (revealed >= props.plan.items.length) {
      setPhase('done');
      return;
    }
    const handle = window.setTimeout(() => setRevealed((count) => count + 1), 220);
    return () => window.clearTimeout(handle);
  }, [phase, props.plan.items.length, revealed]);

  return (
    <RightPanel
      title="My HR action plan"
      icon={<Sparkle24Filled />}
      isModal={props.isModal}
      onDismiss={props.onDismiss}
      footnote="AI-style suggestions are generated locally from sample data. No AI service is called, and changes are not saved."
    >
      {phase !== 'done' && <div className={styles.shimmer} aria-hidden="true" />}
      <div className={styles.live} role="status" aria-live="polite">
        {phase === 'thinking' ? 'Reviewing your HR signals.' : phase === 'done' ? 'Your HR action plan is ready.' : `Added ${revealed} of ${props.plan.items.length} recommendations.`}
      </div>
      {phase === 'thinking' ? (
        <div className={styles.thinking}>
          <span className={styles.spinner} aria-hidden="true" />
          <Text>Reviewing your HR signals...</Text>
        </div>
      ) : (
        <>
          <Text className={styles.headline}>{props.plan.headline}</Text>
          <div className={styles.list}>
            {props.plan.items.slice(0, revealed).map((item: IHrActionItem, index) => (
              <div key={item.id} className={mergeClasses(styles.item, index === 0 && styles.firstItem)}>
                <span className={styles.badge} aria-hidden="true">{index + 1}</span>
                <div>
                  <FamilyBadge family={item.family} compact />
                  <Text size={300} block className={styles.title}>{item.title}</Text>
                  <Text size={200} block className={styles.reason}>{item.reason}</Text>
                  {item.dueAt && <Text size={200} className={styles.time}>{formatTimeUntil(item.dueAt, props.plan.generatedAt)}</Text>}
                  <br />
                  <button type="button" className={styles.action} onClick={() => props.onNavigate(item.destination)}>
                    {item.actionLabel}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </RightPanel>
  );
};

export default MyHrActionPlanPanel;