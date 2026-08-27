import * as React from 'react';

import { Text } from '@fluentui/react-text';
import { makeStyles, mergeClasses, shorthands } from '@griffel/react';
import { tokens } from '@fluentui/react-theme';
import { ChevronRight20Regular } from '@fluentui/react-icons';

export type HomeTileAccent = 'teal' | 'pink' | 'blue' | 'amber';

const useStyles = makeStyles({
  root: {
    width: '100%',
    minWidth: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    boxSizing: 'border-box',
    padding: '13px',
    color: tokens.colorNeutralForeground1,
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusLarge,
    boxShadow: tokens.shadow2,
    cursor: 'pointer',
    textAlign: 'left',
    transitionDuration: tokens.durationFaster,
    transitionProperty: 'background-color, border-color, box-shadow',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
      ...shorthands.borderColor(tokens.colorNeutralStroke1),
      boxShadow: tokens.shadow8
    },
    ':focus-visible': {
      outlineColor: tokens.colorStrokeFocus2,
      outlineStyle: 'solid',
      outlineWidth: '2px'
    }
  },
  icon: {
    width: '38px',
    height: '38px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    borderRadius: tokens.borderRadiusCircular
  },
  teal: { color: tokens.colorPaletteTealForeground2, backgroundColor: tokens.colorPaletteTealBackground2 },
  pink: { color: tokens.colorPaletteBerryForeground2, backgroundColor: tokens.colorPaletteBerryBackground2 },
  blue: { color: tokens.colorPaletteBlueForeground2, backgroundColor: tokens.colorPaletteBlueBackground2 },
  amber: { color: tokens.colorPaletteMarigoldForeground2, backgroundColor: tokens.colorPaletteMarigoldBackground2 },
  copy: { minWidth: 0, flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '2px' },
  title: { color: tokens.colorNeutralForeground3 },
  primary: { fontWeight: tokens.fontWeightSemibold, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  secondary: { color: tokens.colorNeutralForeground3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  chevron: { flexShrink: 0, color: tokens.colorNeutralForeground3 }
});

export interface IHomeSummaryTileProps {
  icon: React.ReactElement;
  accent: HomeTileAccent;
  title: string;
  primary: string;
  secondary: string;
  onClick?: () => void;
}

const HomeSummaryTile: React.FunctionComponent<IHomeSummaryTileProps> = (props) => {
  const styles = useStyles();
  const content = (
    <>
      <span className={mergeClasses(styles.icon, styles[props.accent])}>{props.icon}</span>
      <span className={styles.copy}>
        <Text size={200} className={styles.title}>{props.title}</Text>
        <Text size={300} className={styles.primary}>{props.primary}</Text>
        <Text size={200} className={styles.secondary}>{props.secondary}</Text>
      </span>
      {props.onClick && <ChevronRight20Regular className={styles.chevron} />}
    </>
  );
  return props.onClick ? (
    <button type="button" className={styles.root} onClick={props.onClick}>{content}</button>
  ) : (
    <div className={styles.root}>{content}</div>
  );
};

export default HomeSummaryTile;