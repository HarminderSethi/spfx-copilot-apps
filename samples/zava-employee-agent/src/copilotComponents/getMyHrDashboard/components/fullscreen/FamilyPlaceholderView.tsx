import * as React from 'react';

import { Text } from '@fluentui/react-text';
import { makeStyles } from '@griffel/react';
import { tokens } from '@fluentui/react-theme';

import FamilyIcon from '../../../shared/components/FamilyIcon';
import { getZavaFamily } from '../../../shared/models/families';
import type { ZavaFamilyId } from '../../../shared/models/families';
import type { IZavaUser } from '../../../shared/models/zavaEmployee';
import { getZavaFamilyTheme } from '../../../shared/theme/familyThemes';
import { getGreeting } from '../../../shared/utils/greeting';
import { fadeInUp } from '../../../shared/utils/motion';

const useStyles = makeStyles({
  root: {
    width: '100%',
    minHeight: '520px',
    display: 'flex',
    flexDirection: 'column',
    gap: '0',
    boxSizing: 'border-box',
    outlineStyle: 'none',
    animationName: fadeInUp,
    animationDuration: tokens.durationSlow,
    animationTimingFunction: tokens.curveDecelerateMid,
    animationFillMode: 'both',
    '@media (prefers-reduced-motion: reduce)': {
      animationName: 'none',
      animationDuration: '1ms'
    }
  },
  hero: {
    minHeight: '154px',
    display: 'flex',
    alignItems: 'center',
    gap: '18px',
    boxSizing: 'border-box',
    padding: '26px 30px',
    borderRadius: tokens.borderRadiusXLarge,
    boxShadow: tokens.shadow8,
    '@media (max-width: 560px)': {
      alignItems: 'flex-start',
      padding: '22px 18px'
    }
  },
  icon: {
    width: '64px',
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    color: tokens.colorNeutralForegroundStaticInverted,
    backgroundColor: tokens.colorNeutralStrokeAlpha2,
    borderRadius: tokens.borderRadiusXLarge,
    fontSize: '30px'
  },
  copy: { minWidth: 0 },
  greeting: { color: tokens.colorNeutralForegroundStaticInverted, opacity: 0.86 },
  title: { color: tokens.colorNeutralForegroundStaticInverted, fontWeight: tokens.fontWeightSemibold },
  summary: { color: tokens.colorNeutralForegroundStaticInverted, opacity: 0.9, lineHeight: tokens.lineHeightBase300 },
  empty: {
    minHeight: '290px',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`
  }
});

export interface IFamilyPlaceholderViewProps {
  family: ZavaFamilyId;
  user: IZavaUser;
  now: Date;
  viewRef: React.RefObject<HTMLDivElement>;
}

const FamilyPlaceholderView: React.FunctionComponent<IFamilyPlaceholderViewProps> = (props) => {
  const styles = useStyles();
  const metadata = getZavaFamily(props.family);
  const theme = getZavaFamilyTheme(metadata.themeVariant);
  const greeting = getGreeting(props.now);
  return (
    <div
      ref={props.viewRef}
      key={props.family}
      className={styles.root}
      data-family-placeholder={props.family}
      data-family-theme={metadata.themeVariant}
      tabIndex={-1}
      aria-labelledby={`${props.family}-placeholder-heading`}
    >
      <section className={styles.hero} style={{ backgroundImage: theme.heroGradient }}>
        <span className={styles.icon} aria-hidden="true"><FamilyIcon family={props.family} /></span>
        <div className={styles.copy}>
          <Text size={300} block className={styles.greeting}>{greeting.text}, {props.user.firstName}</Text>
          <Text id={`${props.family}-placeholder-heading`} as="h1" size={800} block className={styles.title}>
            {metadata.label}
          </Text>
          <Text size={300} block className={styles.summary}>{metadata.placeholderSummary}</Text>
        </div>
      </section>
      <section className={styles.empty} aria-hidden="true" />
    </div>
  );
};

export default FamilyPlaceholderView;