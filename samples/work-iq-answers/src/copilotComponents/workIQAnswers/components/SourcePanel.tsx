import * as React from 'react';
import { Badge, Body1, Caption1, makeStyles, shorthands, tokens } from '@fluentui/react-components';
import {
  CalendarLtr20Regular,
  Document20Regular,
  Link20Regular,
  Person20Regular
} from '@fluentui/react-icons';

import { groupCitations, type CitationGroupKind, type ICitation } from '../core/citations';
import type { IWorkIQAnswersStrings } from './IWorkIQAnswersProps';

/** Grouped citation panel. Filtering happens upstream in `core/citations.ts`. */

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap(tokens.spacingVerticalM)
  },
  group: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap(tokens.spacingVerticalXS)
  },
  groupHeader: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap(tokens.spacingHorizontalXS),
    color: tokens.colorNeutralForeground3,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    fontWeight: tokens.fontWeightSemibold
  },
  row: {
    display: 'flex',
    alignItems: 'flex-start',
    ...shorthands.gap(tokens.spacingHorizontalS),
    ...shorthands.padding(tokens.spacingVerticalS, tokens.spacingHorizontalS),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    backgroundColor: tokens.colorNeutralBackground1,
    textDecorationLine: 'none',
    color: tokens.colorNeutralForeground1,
    cursor: 'pointer',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
      ...shorthands.borderColor(tokens.colorNeutralStroke1)
    },
    ':focus-visible': {
      outlineWidth: '2px',
      outlineStyle: 'solid',
      outlineColor: tokens.colorStrokeFocus2
    }
  },
  rowIcon: {
    flexShrink: 0,
    color: tokens.colorNeutralForeground3,
    marginTop: '2px'
  },
  rowBody: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('2px'),
    minWidth: 0,
    flexGrow: 1
  },
  rowTitle: {
    fontWeight: tokens.fontWeightSemibold,
    wordBreak: 'break-word'
  },
  rowMeta: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap(tokens.spacingHorizontalXS),
    flexWrap: 'wrap',
    color: tokens.colorNeutralForeground3
  },
  ordinal: {
    flexShrink: 0,
    minWidth: '20px',
    textAlign: 'center',
    color: tokens.colorNeutralForeground3,
    fontVariantNumeric: 'tabular-nums'
  },
  empty: {
    color: tokens.colorNeutralForeground3
  }
});

export interface ISourcePanelProps {
  citations: ICitation[];
  strings: IWorkIQAnswersStrings;
  onOpenLink: (url: string) => void;
}

function groupIcon(kind: CitationGroupKind): JSX.Element {
  switch (kind) {
    case 'meeting':
      return <CalendarLtr20Regular />;
    case 'file':
      return <Document20Regular />;
    case 'person':
      return <Person20Regular />;
    case 'other':
    default:
      return <Link20Regular />;
  }
}

function groupLabel(kind: CitationGroupKind, strings: IWorkIQAnswersStrings): string {
  switch (kind) {
    case 'meeting':
      return strings.SourceGroupMeeting;
    case 'file':
      return strings.SourceGroupFile;
    case 'person':
      return strings.SourceGroupPerson;
    case 'other':
    default:
      return strings.SourceGroupOther;
  }
}

const SourcePanel: React.FunctionComponent<ISourcePanelProps> = (props) => {
  const styles = useStyles();
  const { citations, strings, onOpenLink } = props;

  if (citations.length === 0) {
    return (
      <Body1 className={styles.empty} role="status">
        {strings.NoSourcesMessage}
      </Body1>
    );
  }

  const groups = groupCitations(citations);

  return (
    <div className={styles.root}>
      {groups.map((group) => (
        <section key={group.kind} className={styles.group}>
          <Caption1 as="h3" className={styles.groupHeader}>
            <span aria-hidden="true">{groupIcon(group.kind)}</span>
            {groupLabel(group.kind, strings)}
          </Caption1>

          {group.citations.map((citation) => (
            <a
              key={`${citation.ordinal}-${citation.url}`}
              href={citation.url}
              className={styles.row}
              aria-label={strings.OpenSourceLabel.replace('{0}', citation.title)}
              onClick={(event) => {
                event.preventDefault();
                onOpenLink(citation.url);
              }}
            >
              <Caption1 className={styles.ordinal} aria-hidden="true">
                {citation.ordinal}
              </Caption1>

              <span className={styles.rowIcon} aria-hidden="true">
                {groupIcon(citation.group)}
              </span>

              <span className={styles.rowBody}>
                <Body1 className={styles.rowTitle}>{citation.title}</Body1>

                <span className={styles.rowMeta}>
                  {/* omitted when the source data carries no grounding signal */}
                  {citation.isGrounded !== undefined ? (
                    <Badge
                      appearance="outline"
                      size="small"
                      color={citation.isGrounded ? 'brand' : 'informative'}
                    >
                      {citation.isGrounded ? strings.GroundedLabel : strings.ModelLabel}
                    </Badge>
                  ) : undefined}

                  {citation.extension ? (
                    <Caption1>{citation.extension.toUpperCase()}</Caption1>
                  ) : undefined}
                </span>
              </span>
            </a>
          ))}
        </section>
      ))}
    </div>
  );
};

export default SourcePanel;
