import * as React from 'react';
import { Tooltip, makeStyles, shorthands, tokens } from '@fluentui/react-components';

import { resolveCitationLink, resolveFootnote, type ICitation } from '../core/citations';
import type { IAnswerBlock, IAnswerSegment } from '../core/entityParser';
import EntityChip from './EntityChip';
import type { IWorkIQAnswersStrings } from './IWorkIQAnswersProps';

/**
 * Renders parsed answer blocks as plain React elements. No markdown lib, no
 * `dangerouslySetInnerHTML`. `footnote` and `citationLink` render the same way
 * but resolve differently, see `core/citations.ts`.
 */

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap(tokens.spacingVerticalS)
  },
  paragraph: {
    ...shorthands.margin('0'),
    fontSize: tokens.fontSizeBase300,
    lineHeight: tokens.lineHeightBase300,
    color: tokens.colorNeutralForeground1
  },
  heading: {
    ...shorthands.margin(tokens.spacingVerticalS, '0', '0', '0'),
    fontSize: tokens.fontSizeBase400,
    lineHeight: tokens.lineHeightBase400,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1
  },
  listItem: {
    display: 'flex',
    ...shorthands.gap(tokens.spacingHorizontalS),
    fontSize: tokens.fontSizeBase300,
    lineHeight: tokens.lineHeightBase300,
    color: tokens.colorNeutralForeground1
  },
  bullet: {
    color: tokens.colorNeutralForeground3,
    flexShrink: 0,
    userSelect: 'none'
  },
  divider: {
    height: '1px',
    backgroundColor: tokens.colorNeutralStroke2,
    ...shorthands.border('0'),
    ...shorthands.margin(tokens.spacingVerticalXS, '0'),
    width: '100%'
  },
  bold: {
    fontWeight: tokens.fontWeightSemibold
  },
  link: {
    color: tokens.colorBrandForegroundLink,
    ':hover': {
      color: tokens.colorBrandForegroundLinkHover
    }
  },
  footnote: {
    fontSize: tokens.fontSizeBase100,
    verticalAlign: 'super',
    lineHeight: '1',
    color: tokens.colorBrandForeground1,
    ...shorthands.padding('0', '1px'),
    // gap so adjacent markers ("[1](url)[2](url)") don't run together
    marginInlineStart: '2px',
    cursor: 'pointer'
  },
  footnoteInert: {
    fontSize: tokens.fontSizeBase100,
    verticalAlign: 'super',
    lineHeight: '1',
    color: tokens.colorNeutralForeground4,
    marginInlineStart: '2px'
  }
});

export interface IAnswerTextProps {
  blocks: IAnswerBlock[];
  citations: ICitation[];
  strings: IWorkIQAnswersStrings;
  /** Opens a URL through the Copilot host bridge rather than `window.open`. */
  onOpenLink: (url: string) => void;
}

const AnswerText: React.FunctionComponent<IAnswerTextProps> = (props) => {
  const styles = useStyles();
  const { blocks, citations, strings, onOpenLink } = props;

  function renderSegment(segment: IAnswerSegment, key: number): React.ReactNode {
    switch (segment.kind) {
      case 'text':
        return <React.Fragment key={key}>{segment.text}</React.Fragment>;

      case 'bold':
        return (
          <strong key={key} className={styles.bold}>
            {segment.text}
          </strong>
        );

      case 'entity':
        return (
          <EntityChip
            key={key}
            entity={segment.entity}
            label={segment.label}
            strings={strings}
          />
        );

      case 'link':
        return (
          <a
            key={key}
            href={segment.url}
            className={styles.link}
            onClick={(event) => {
              event.preventDefault();
              onOpenLink(segment.url);
            }}
          >
            {segment.text}
          </a>
        );

      case 'footnote': {
        const citation = resolveFootnote(citations, segment.index);

        if (!citation) {
          return (
            <sup key={key} className={styles.footnoteInert}>
              {segment.index}
            </sup>
          );
        }

        return (
          <Tooltip
            key={key}
            relationship="label"
            withArrow
            content={strings.FootnoteTooltip.replace('{0}', String(segment.index)).replace(
              '{1}',
              citation.title
            )}
          >
            <sup
              className={styles.footnote}
              role="button"
              tabIndex={0}
              onClick={() => onOpenLink(citation.url)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onOpenLink(citation.url);
                }
              }}
            >
              {segment.index}
            </sup>
          </Tooltip>
        );
      }

      case 'citationLink': {
        const citation = resolveCitationLink(citations, segment.url);

        // always clickable via segment.url; unresolved just means a plain tooltip
        const tooltip = citation
          ? strings.FootnoteTooltip.replace('{0}', String(segment.displayIndex)).replace(
              '{1}',
              citation.title
            )
          : String(segment.displayIndex);

        return (
          <Tooltip key={key} relationship="label" withArrow content={tooltip}>
            <sup
              className={styles.footnote}
              role="button"
              tabIndex={0}
              onClick={() => onOpenLink(segment.url)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onOpenLink(segment.url);
                }
              }}
            >
              {segment.displayIndex}
            </sup>
          </Tooltip>
        );
      }

      default:
        return undefined;
    }
  }

  function renderBlock(block: IAnswerBlock, index: number): React.ReactNode {
    const children = block.segments.map(renderSegment);

    switch (block.kind) {
      case 'heading':
        return (
          <div key={index} className={styles.heading} role="heading" aria-level={block.level}>
            {children}
          </div>
        );

      case 'listItem':
        return (
          <div key={index} className={styles.listItem}>
            <span className={styles.bullet} aria-hidden="true">
              •
            </span>
            <span>{children}</span>
          </div>
        );

      case 'divider':
        return <hr key={index} className={styles.divider} />;

      case 'paragraph':
      default:
        return (
          <p key={index} className={styles.paragraph}>
            {children}
          </p>
        );
    }
  }

  return <div className={styles.root}>{blocks.map(renderBlock)}</div>;
};

export default AnswerText;
