import * as React from 'react';

import { Text } from '@fluentui/react-text';
import { makeStyles } from '@griffel/react';
import { tokens } from '@fluentui/react-theme';
import { ArrowLeft20Regular, FullScreenMaximize20Regular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    minWidth: 0,
    paddingBottom: '8px'
  },
  title: {
    flexGrow: 1,
    fontWeight: tokens.fontWeightSemibold,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  back: {
    width: '32px',
    height: '32px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    padding: 0,
    color: tokens.colorNeutralForeground2,
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: tokens.borderRadiusMedium,
    cursor: 'pointer',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover
    },
    ':focus-visible': {
      outlineColor: tokens.colorStrokeFocus2,
      outlineStyle: 'solid',
      outlineWidth: '2px'
    }
  }
});

export interface IInlineDetailHeaderProps {
  title: string;
  onBack?: () => void;
  onRequestFullscreen?: () => void;
}

const InlineDetailHeader: React.FunctionComponent<IInlineDetailHeaderProps> = ({
  title,
  onBack,
  onRequestFullscreen
}) => {
  const styles = useStyles();
  return (
    <div className={styles.root}>
      {onBack && (
        <button
          type="button"
          className={styles.back}
          aria-label="Back to HR summary"
          onClick={onBack}
        >
          <ArrowLeft20Regular />
        </button>
      )}
      <Text size={400} className={styles.title}>{title}</Text>
      {onRequestFullscreen && (
        <button
          type="button"
          className={styles.back}
          aria-label={`Open ${title} in the full HR dashboard`}
          title="Open full HR dashboard"
          onClick={onRequestFullscreen}
        >
          <FullScreenMaximize20Regular />
        </button>
      )}
    </div>
  );
};

export default InlineDetailHeader;