import * as React from 'react';
import { makeStyles, mergeClasses, shorthands, tokens } from '@fluentui/react-components';
import { KUDOS_VALUES } from './constants/kudosValues';
import type { KudosValueKey } from './models/kudos.types';

/**
 * Emoji glyph per value for the compose pills. NB: this deliberately overrides
 * the brief's "no emoji" brand rule at the product owner's explicit request —
 * swap back to Fluent line icons if the brand rule is reinstated.
 */
const VALUE_EMOJI: Record<KudosValueKey, string> = {
  teamwork: '🤝',
  clientImpact: '🎯',
  innovation: '💡',
  extraMile: '🚀',
};

const useStyles = makeStyles({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    columnGap: '8px',
    ...shorthands.border('0'),
    borderRadius: tokens.borderRadiusCircular,
    fontFamily: tokens.fontFamilyBase,
    fontWeight: tokens.fontWeightSemibold,
    lineHeight: '1.35',
    whiteSpace: 'nowrap',
    transitionDuration: tokens.durationNormal,
    transitionTimingFunction: 'cubic-bezier(0.2, 0, 0, 1)',
    transitionProperty: 'box-shadow, background-color',
    ':focus-visible': {
      outlineWidth: '2px',
      outlineStyle: 'solid',
      outlineColor: tokens.colorStrokeFocus2,
      outlineOffset: '2px',
    },
  },
  /** Interactive selector pill (compose) — white pill, leading icon, label. */
  pill: {
    ...shorthands.padding('8px', '14px'),
    fontSize: tokens.fontSizeBase300,
    cursor: 'pointer',
    color: tokens.colorNeutralForeground1,
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke1),
    boxShadow: tokens.shadow2,
    ':hover': { backgroundColor: tokens.colorNeutralBackground1Hover },
    ':active': { transform: 'scale(0.98)' },
  },
  /** Emoji glyph in the compose pills. */
  emoji: { fontSize: '18px', lineHeight: 1, flexShrink: 0 },
  /** Static label (feed / confirmation) — compact coloured tag. */
  tag: {
    ...shorthands.padding('6px', '12px'),
    fontSize: tokens.fontSizeBase200,
  },
  small: { ...shorthands.padding('2px', '8px'), fontSize: '10px' },
});

export interface IValueChipProps {
  value: KudosValueKey;
  selected?: boolean;
  /** Omit to render a non-interactive label (feed cards, confirmation strip). */
  onSelect?: (value: KudosValueKey) => void;
  size?: 'medium' | 'small';
  className?: string;
  /** Roving tabindex for radiogroup keyboard support (0 for the checked chip, -1 otherwise). */
  tabIndex?: number;
}

export const ValueChip: React.FC<IValueChipProps> = ({
  value,
  selected = false,
  onSelect,
  size = 'medium',
  className,
  tabIndex,
}) => {
  const styles = useStyles();
  const meta = KUDOS_VALUES[value];

  if (onSelect) {
    return (
      <button
        type="button"
        role="radio"
        aria-checked={selected}
        aria-label={`Recognise ${meta.label}`}
        tabIndex={tabIndex}
        onClick={() => onSelect(value)}
        className={mergeClasses(styles.base, styles.pill, className)}
        style={
          selected
            ? { boxShadow: `0 0 0 2px ${meta.accent}`, borderColor: 'transparent', fontWeight: tokens.fontWeightBold }
            : undefined
        }
      >
        <span className={styles.emoji} aria-hidden>
          {VALUE_EMOJI[value]}
        </span>
        {meta.label}
      </button>
    );
  }

  return (
    <span
      className={mergeClasses(styles.base, styles.tag, size === 'small' && styles.small, className)}
      style={{ color: meta.foreground, backgroundColor: meta.background }}
    >
      {meta.label}
    </span>
  );
};
