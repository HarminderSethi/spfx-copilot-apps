import * as React from 'react';

import { Avatar } from '@fluentui/react-avatar';
import { Text } from '@fluentui/react-text';
import { makeStyles } from '@griffel/react';
import { tokens } from '@fluentui/react-theme';
import { FullScreenMaximize20Regular } from '@fluentui/react-icons';

import type { IZavaUser } from '../models/zavaEmployee';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    width: '100%',
    minWidth: 0,
    boxSizing: 'border-box',
    padding: '16px',
    color: tokens.colorNeutralForegroundOnBrand,
    backgroundImage: `linear-gradient(135deg, ${tokens.colorBrandBackground} 0%, ${tokens.colorPaletteBerryBackground3} 100%)`,
    borderRadius: tokens.borderRadiusXLarge,
    boxShadow: tokens.shadow8
  },
  glyph: { width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: tokens.colorNeutralForegroundOnBrand, backgroundColor: tokens.colorNeutralStrokeAlpha2, borderRadius: tokens.borderRadiusCircular },
  copy: { minWidth: 0, flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '2px' },
  title: { color: tokens.colorNeutralForegroundOnBrand, fontWeight: tokens.fontWeightSemibold, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  subtitle: { color: tokens.colorNeutralForegroundOnBrand, opacity: 0.88 },
  expand: { width: '32px', height: '32px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, padding: 0, color: tokens.colorNeutralForegroundOnBrand, backgroundColor: tokens.colorNeutralStrokeAlpha2, border: 'none', borderRadius: tokens.borderRadiusCircular, cursor: 'pointer', transitionDuration: tokens.durationFaster, transitionProperty: 'background-color', ':hover': { backgroundColor: tokens.colorNeutralBackgroundAlpha }, ':active': { backgroundColor: tokens.colorNeutralStencil1Alpha }, ':focus-visible': { outlineColor: tokens.colorStrokeFocus2, outlineStyle: 'solid', outlineWidth: '2px' } }
});

export interface IInlineHeaderProps {
  user: IZavaUser;
  icon: React.ReactElement;
  title: string;
  subtitle: string;
  expandLabel?: string;
  onRequestFullscreen?: () => void;
}

const InlineHeader: React.FunctionComponent<IInlineHeaderProps> = (props) => {
  const styles = useStyles();
  return (
    <div className={styles.root}>
      <span className={styles.glyph} aria-hidden="true">{props.icon}</span>
      <div className={styles.copy}>
        <Text size={500} className={styles.title}>{props.title}</Text>
        <Text size={200} className={styles.subtitle}>{props.subtitle}</Text>
      </div>
      <Avatar name={props.user.displayName} image={{ src: props.user.photoUrl }} size={40} />
      {props.onRequestFullscreen && (
        <button type="button" className={styles.expand} onClick={props.onRequestFullscreen} title={props.expandLabel} aria-label={props.expandLabel}>
          <FullScreenMaximize20Regular />
        </button>
      )}
    </div>
  );
};

export default InlineHeader;