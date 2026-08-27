import * as React from 'react';
import { Tooltip, makeStyles, shorthands, tokens } from '@fluentui/react-components';
import {
  CalendarLtr16Regular,
  Document16Regular,
  Person16Regular
} from '@fluentui/react-icons';

import type { EntityKind } from '../core/entityParser';
import type { IWorkIQAnswersStrings } from './IWorkIQAnswersProps';

/** Inline chip for a `<Person>` / `<Event>` / `<File>` mention. `<span>`, not a button; there's nothing to click. */

const useStyles = makeStyles({
  chip: {
    display: 'inline-flex',
    alignItems: 'center',
    verticalAlign: 'baseline',
    ...shorthands.gap(tokens.spacingHorizontalXXS),
    ...shorthands.padding('1px', tokens.spacingHorizontalXS),
    // no horizontal margin: punctuation often follows directly after a mention
    ...shorthands.margin('0'),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    backgroundColor: tokens.colorNeutralBackground3,
    fontSize: tokens.fontSizeBase200,
    lineHeight: tokens.lineHeightBase200,
    fontWeight: tokens.fontWeightSemibold,
    whiteSpace: 'nowrap',
    maxWidth: '100%'
  },
  label: {
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  person: {
    backgroundColor: tokens.colorBrandBackground2,
    color: tokens.colorBrandForeground2,
    ...shorthands.borderColor(tokens.colorBrandStroke2)
  },
  event: {
    backgroundColor: tokens.colorPaletteLavenderBackground2,
    color: tokens.colorNeutralForeground1
  },
  file: {
    backgroundColor: tokens.colorPaletteGreenBackground1,
    color: tokens.colorPaletteGreenForeground2
  },
  icon: {
    flexShrink: 0
  }
});

export interface IEntityChipProps {
  entity: EntityKind;
  label: string;
  strings: IWorkIQAnswersStrings;
}

function iconFor(entity: EntityKind): JSX.Element {
  switch (entity) {
    case 'person':
      return <Person16Regular />;
    case 'event':
      return <CalendarLtr16Regular />;
    case 'file':
    default:
      return <Document16Regular />;
  }
}

function tooltipFor(entity: EntityKind, label: string, strings: IWorkIQAnswersStrings): string {
  switch (entity) {
    case 'person':
      return strings.PersonChipTooltip.replace('{0}', label);
    case 'event':
      return strings.EventChipTooltip.replace('{0}', label);
    case 'file':
    default:
      return strings.FileChipTooltip.replace('{0}', label);
  }
}

const EntityChip: React.FunctionComponent<IEntityChipProps> = (props) => {
  const styles = useStyles();
  const { entity, label, strings } = props;

  const className = `${styles.chip} ${styles[entity]}`;

  return (
    <Tooltip content={tooltipFor(entity, label, strings)} relationship="label" withArrow>
      <span className={className} data-entity-kind={entity}>
        <span className={styles.icon} aria-hidden="true">
          {iconFor(entity)}
        </span>
        <span className={styles.label}>{label}</span>
      </span>
    </Tooltip>
  );
};

export default EntityChip;
