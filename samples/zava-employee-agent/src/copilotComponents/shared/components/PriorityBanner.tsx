import * as React from 'react';

import { Avatar } from '@fluentui/react-avatar';
import { Text } from '@fluentui/react-text';
import { makeStyles } from '@griffel/react';
import { tokens } from '@fluentui/react-theme';

import type { IZavaPerson } from '../models/zavaEmployee';

const useStyles = makeStyles({
  root: { display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', boxSizing: 'border-box', padding: '15px 18px', color: tokens.colorNeutralForegroundOnBrand, backgroundImage: `linear-gradient(112deg, ${tokens.colorBrandBackground} 0%, ${tokens.colorCompoundBrandBackgroundPressed} 62%, ${tokens.colorPaletteBerryBackground3} 140%)`, borderRadius: tokens.borderRadiusXLarge, boxShadow: tokens.shadow8 },
  glyph: { width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: tokens.colorNeutralForegroundOnBrand, backgroundColor: tokens.colorNeutralStrokeAlpha2, borderRadius: tokens.borderRadiusMedium },
  copy: { minWidth: '210px', flexGrow: 1 },
  title: { color: tokens.colorNeutralForegroundOnBrand, fontWeight: tokens.fontWeightSemibold },
  subtitle: { color: tokens.colorNeutralForegroundOnBrand, opacity: 0.88 },
  people: { display: 'flex', alignItems: 'center' },
  avatar: { marginLeft: '-6px', border: `2px solid ${tokens.colorNeutralStrokeOnBrand}` },
  button: { padding: '9px 13px', color: tokens.colorBrandForeground1, backgroundColor: tokens.colorNeutralBackground1, border: 'none', borderRadius: tokens.borderRadiusMedium, cursor: 'pointer', fontWeight: tokens.fontWeightSemibold, ':hover': { backgroundColor: tokens.colorNeutralBackground1Hover }, ':focus-visible': { outlineColor: tokens.colorStrokeFocus2, outlineStyle: 'solid', outlineWidth: '2px' }, '@media (max-width: 620px)': { width: '100%' } }
});

export interface IPriorityBannerProps {
  icon: React.ReactElement;
  title: string;
  subtitle: string;
  people?: IZavaPerson[];
  actionLabel: string;
  triggerRef?: React.RefObject<HTMLButtonElement>;
  onAction: () => void;
}

const PriorityBanner: React.FunctionComponent<IPriorityBannerProps> = (props) => {
  const styles = useStyles();
  return (
    <section className={styles.root}>
      <span className={styles.glyph} aria-hidden="true">{props.icon}</span>
      <div className={styles.copy}>
        <Text size={500} block className={styles.title}>{props.title}</Text>
        <Text size={300} block className={styles.subtitle}>{props.subtitle}</Text>
      </div>
      {props.people && props.people.length > 0 && (
        <div className={styles.people} aria-label="Related people">
          {props.people.slice(0, 3).map((person, index) => (
            <Avatar key={person.id} name={person.displayName} image={{ src: person.photoUrl }} size={32} className={index === 0 ? undefined : styles.avatar} />
          ))}
        </div>
      )}
      <button ref={props.triggerRef} type="button" className={styles.button} onClick={props.onAction}>{props.actionLabel}</button>
    </section>
  );
};

export default PriorityBanner;