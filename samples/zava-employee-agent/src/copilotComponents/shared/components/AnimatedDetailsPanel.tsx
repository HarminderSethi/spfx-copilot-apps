import * as React from 'react';

import { Text } from '@fluentui/react-text';
import { makeStyles, mergeClasses } from '@griffel/react';
import { tokens } from '@fluentui/react-theme';
import { Dismiss20Regular, Sparkle24Filled } from '@fluentui/react-icons';

import { prefersReducedMotion } from '../utils/motion';

export interface IAnimatedDetailItem {
  id: string;
  eyebrow?: string;
  title: string;
  summary: string;
}

const useStyles = makeStyles({
  panel: {
    position: 'fixed',
    top: '52px',
    right: 0,
    bottom: 0,
    zIndex: 20,
    width: 'min(408px, 100%)',
    minHeight: 0,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: tokens.colorNeutralBackground1,
    borderLeft: `1px solid ${tokens.colorNeutralStroke2}`,
    boxShadow: tokens.shadow28,
    animationName: {
      from: { transform: 'translateX(24px)', opacity: 0 },
      to: { transform: 'translateX(0)', opacity: 1 }
    },
    animationDuration: tokens.durationGentle,
    animationTimingFunction: tokens.curveDecelerateMid,
    '@media (prefers-reduced-motion: reduce)': { animationName: 'none', animationDuration: '1ms' }
  },
  accent: { height: '5px', flexShrink: 0, backgroundImage: `linear-gradient(90deg, ${tokens.colorBrandBackground}, ${tokens.colorPaletteBlueBackground2}, ${tokens.colorPaletteBerryBackground3})` },
  header: { display: 'flex', alignItems: 'center', gap: '10px', padding: '16px 18px 13px', borderBottom: `1px solid ${tokens.colorNeutralStroke2}` },
  icon: { width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: tokens.colorNeutralForegroundOnBrand, backgroundImage: `linear-gradient(135deg, ${tokens.colorBrandBackground}, ${tokens.colorPaletteBerryBackground3})`, borderRadius: tokens.borderRadiusMedium },
  title: { minWidth: 0, flexGrow: 1, fontWeight: tokens.fontWeightSemibold },
  close: { width: '34px', height: '34px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, padding: 0, color: tokens.colorNeutralForeground2, backgroundColor: 'transparent', border: 'none', borderRadius: tokens.borderRadiusMedium, cursor: 'pointer', ':hover': { backgroundColor: tokens.colorSubtleBackgroundHover }, ':focus-visible': { outlineColor: tokens.colorStrokeFocus2, outlineStyle: 'solid', outlineWidth: '2px' } },
  body: { minHeight: 0, flexGrow: 1, overflowY: 'auto', padding: '16px 18px' },
  shimmer: { height: '3px', marginBottom: '14px', backgroundImage: `linear-gradient(90deg, ${tokens.colorNeutralBackground3}, ${tokens.colorBrandBackground}, ${tokens.colorPaletteBerryBackground3}, ${tokens.colorNeutralBackground3})`, backgroundSize: '220% 100%', animationName: { from: { backgroundPositionX: '100%' }, to: { backgroundPositionX: '-120%' } }, animationDuration: '1.3s', animationIterationCount: 'infinite', '@media (prefers-reduced-motion: reduce)': { animationName: 'none' } },
  thinking: { display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '18px', paddingBottom: '18px', color: tokens.colorNeutralForeground2 },
  spinner: { width: '22px', height: '22px', border: `3px solid ${tokens.colorNeutralStroke2}`, borderTopColor: tokens.colorBrandStroke1, borderRadius: tokens.borderRadiusCircular, animationName: { to: { transform: 'rotate(360deg)' } }, animationDuration: '800ms', animationIterationCount: 'infinite', animationTimingFunction: 'linear', '@media (prefers-reduced-motion: reduce)': { animationName: 'none' } },
  headline: { display: 'block', marginBottom: '8px', color: tokens.colorNeutralForeground2, lineHeight: tokens.lineHeightBase300 },
  live: { position: 'absolute', width: '1px', height: '1px', overflow: 'hidden' },
  list: { display: 'flex', flexDirection: 'column' },
  item: { display: 'grid', gridTemplateColumns: '34px minmax(0, 1fr)', gap: '10px', paddingTop: '13px', paddingBottom: '13px', borderTop: `1px solid ${tokens.colorNeutralStroke3}`, animationName: { from: { opacity: 0, transform: 'translateY(8px)' }, to: { opacity: 1, transform: 'translateY(0)' } }, animationDuration: tokens.durationNormal, '@media (prefers-reduced-motion: reduce)': { animationName: 'none' } },
  firstItem: { borderTop: 'none' },
  badge: { width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: tokens.colorBrandForeground1, backgroundColor: tokens.colorBrandBackground2, borderRadius: tokens.borderRadiusMedium, fontWeight: tokens.fontWeightBold },
  eyebrow: { color: tokens.colorBrandForeground1, textTransform: 'uppercase' },
  itemTitle: { fontWeight: tokens.fontWeightSemibold },
  summary: { color: tokens.colorNeutralForeground3, lineHeight: tokens.lineHeightBase200 },
  footnote: { padding: '10px 18px', color: tokens.colorNeutralForeground3, backgroundColor: tokens.colorNeutralBackground2, borderTop: `1px solid ${tokens.colorNeutralStroke2}` }
});

export interface IAnimatedDetailsPanelProps {
  title: string;
  reviewingText: string;
  headline: string;
  readyText: string;
  items: ReadonlyArray<IAnimatedDetailItem>;
  footnote: string;
  onDismiss: () => void;
}

const AnimatedDetailsPanel: React.FunctionComponent<IAnimatedDetailsPanelProps> = (props) => {
  const styles = useStyles();
  const panelRef = React.useRef<HTMLElement>(null);
  const [phase, setPhase] = React.useState<'thinking' | 'streaming' | 'done'>('thinking');
  const [revealed, setRevealed] = React.useState(0);

  React.useEffect(() => {
    panelRef.current?.focus();
    setPhase('thinking');
    setRevealed(0);
    if (prefersReducedMotion()) {
      setRevealed(props.items.length);
      setPhase('done');
      return;
    }
    const handle = window.setTimeout(() => setPhase('streaming'), 800);
    return () => window.clearTimeout(handle);
  }, [props.items.length]);

  React.useEffect(() => {
    if (phase !== 'streaming') {
      return;
    }
    if (revealed >= props.items.length) {
      setPhase('done');
      return;
    }
    const handle = window.setTimeout(() => setRevealed((count) => count + 1), 220);
    return () => window.clearTimeout(handle);
  }, [phase, props.items.length, revealed]);

  return (
    <aside ref={panelRef} className={styles.panel} role="dialog" aria-modal="false" aria-label={props.title} tabIndex={-1} onKeyDown={(event) => { if (event.key === 'Escape') { event.preventDefault(); props.onDismiss(); } }}>
      <div className={styles.accent} />
      <div className={styles.header}>
        <span className={styles.icon} aria-hidden="true"><Sparkle24Filled /></span>
        <Text size={500} className={styles.title}>{props.title}</Text>
        <button type="button" className={styles.close} aria-label={`Close ${props.title}`} onClick={props.onDismiss}><Dismiss20Regular /></button>
      </div>
      <div className={styles.body}>
        {phase !== 'done' && <div className={styles.shimmer} aria-hidden="true" />}
        <div className={styles.live} role="status" aria-live="polite">{phase === 'thinking' ? props.reviewingText : phase === 'done' ? props.readyText : `Added ${revealed} of ${props.items.length} details.`}</div>
        {phase === 'thinking' ? (
          <div className={styles.thinking}><span className={styles.spinner} aria-hidden="true" /><Text>{props.reviewingText}</Text></div>
        ) : (
          <><Text className={styles.headline}>{props.headline}</Text><div className={styles.list}>{props.items.slice(0, revealed).map((item, index) => <div className={mergeClasses(styles.item, index === 0 && styles.firstItem)} key={item.id}><span className={styles.badge} aria-hidden="true">{index + 1}</span><div>{item.eyebrow && <Text size={100} block className={styles.eyebrow}>{item.eyebrow}</Text>}<Text size={300} block className={styles.itemTitle}>{item.title}</Text><Text size={200} block className={styles.summary}>{item.summary}</Text></div></div>)}</div></>
        )}
      </div>
      <Text size={200} className={styles.footnote}>{props.footnote}</Text>
    </aside>
  );
};

export default AnimatedDetailsPanel;