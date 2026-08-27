import * as React from 'react';
import {
  Badge,
  Body1,
  Button,
  Caption1,
  FluentProvider,
  IdPrefixProvider,
  Input,
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
  Skeleton,
  SkeletonItem,
  Spinner,
  Subtitle2,
  Tooltip,
  makeStyles,
  shorthands,
  tokens,
  webDarkTheme,
  webLightTheme
} from '@fluentui/react-components';
import {
  ArrowExpand20Regular,
  ArrowMinimize20Regular,
  ChevronRight16Regular,
  Send20Regular,
  ShieldLock16Regular
} from '@fluentui/react-icons';

import { collectEntities } from '../core/entityParser';
import { fireAndForget } from '../core/promises';
import AnswerText from './AnswerText';
import EntityChip from './EntityChip';
import SourcePanel from './SourcePanel';
import type { IWorkIQAnswersProps } from './IWorkIQAnswersProps';

/**
 * Root UI for Work IQ Answers. inline: answer + source count. fullscreen adds
 * the mentions strip, grouped source panel, and follow-up box.
 */

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap(tokens.spacingVerticalM),
    ...shorthands.padding(tokens.spacingVerticalM, tokens.spacingHorizontalM),
    boxSizing: 'border-box',
    minHeight: '100%',
    backgroundColor: tokens.colorNeutralBackground2
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    ...shorthands.gap(tokens.spacingHorizontalS)
  },
  headerText: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap(tokens.spacingVerticalXXS),
    minWidth: 0
  },
  question: {
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    wordBreak: 'break-word'
  },
  badges: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap(tokens.spacingHorizontalXS),
    flexWrap: 'wrap'
  },
  card: {
    ...shorthands.padding(tokens.spacingVerticalM, tokens.spacingHorizontalM),
    ...shorthands.borderRadius(tokens.borderRadiusLarge),
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    backgroundColor: tokens.colorNeutralBackground1
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap(tokens.spacingVerticalS)
  },
  sectionHeading: {
    color: tokens.colorNeutralForeground2
  },
  mentions: {
    display: 'flex',
    ...shorthands.gap(tokens.spacingHorizontalXS),
    flexWrap: 'wrap',
    alignItems: 'center'
  },
  loading: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap(tokens.spacingVerticalM)
  },
  loadingLabel: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap(tokens.spacingHorizontalS),
    color: tokens.colorNeutralForeground2
  },
  skeletonStack: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap(tokens.spacingVerticalS)
  },
  followUp: {
    display: 'flex',
    ...shorthands.gap(tokens.spacingHorizontalS),
    alignItems: 'center'
  },
  followUpInput: {
    flexGrow: 1
  },
  sourceSummary: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap(tokens.spacingHorizontalXS),
    color: tokens.colorNeutralForeground3,
    flexWrap: 'wrap'
  },
  empty: {
    color: tokens.colorNeutralForeground3
  }
});

const WorkIQAnswers: React.FunctionComponent<IWorkIQAnswersProps> = (props) => {
  const styles = useStyles();
  const {
    question,
    blocks,
    citations,
    sensitivityLabel,
    turnCount,
    isLoading,
    errorMessage,
    isMock,
    onAskFollowUp,
    onRetry,
    hostContext,
    bridge,
    onRequestDisplayMode,
    targetDocument,
    strings
  } = props;

  const [followUpText, setFollowUpText] = React.useState<string>('');

  const theme = hostContext.theme === 'dark' ? webDarkTheme : webLightTheme;
  const isFullscreen = hostContext.displayMode === 'fullscreen';

  // sandboxed iframe: window.open isn't reliable, use the host bridge
  const openLink = React.useCallback(
    (url: string): void => {
      fireAndForget(bridge.openLinkAsync(url));
    },
    [bridge]
  );

  const entities = React.useMemo(() => collectEntities(blocks), [blocks]);

  // unlabelled answers still return the object with every field null
  const hasSensitivityLabel = Boolean(sensitivityLabel && sensitivityLabel.displayName);

  function submitFollowUp(): void {
    const trimmed = followUpText.trim();
    if (trimmed.length === 0 || isLoading) {
      return;
    }

    onAskFollowUp(trimmed);
    setFollowUpText('');
  }

  function renderHeader(): JSX.Element {
    return (
      <div className={styles.header}>
        <div className={styles.headerText}>
          <Body1 className={styles.question}>{question || strings.ComponentTitle}</Body1>

          <div className={styles.badges}>
            {turnCount > 0 ? (
              <Badge appearance="tint" size="small" color="informative">
                {strings.TurnCountLabel.replace('{0}', String(turnCount))}
              </Badge>
            ) : undefined}

            {isMock ? (
              <Tooltip content={strings.MockModeTooltip} relationship="label" withArrow>
                <Badge appearance="tint" size="small" color="warning">
                  {strings.MockModeLabel}
                </Badge>
              </Tooltip>
            ) : undefined}

            {hasSensitivityLabel ? (
              <Tooltip
                content={sensitivityLabel!.tooltip || sensitivityLabel!.displayName!}
                relationship="label"
                withArrow
              >
                <Badge
                  appearance="tint"
                  size="small"
                  color="danger"
                  icon={<ShieldLock16Regular />}
                >
                  {`${strings.SensitivityLabelPrefix} ${sensitivityLabel!.displayName}`}
                </Badge>
              </Tooltip>
            ) : undefined}
          </div>
        </div>

        <Tooltip
          content={isFullscreen ? strings.CollapseToInlineTitle : strings.ExpandToFullscreenTitle}
          relationship="label"
          withArrow
        >
          <Button
            appearance="subtle"
            icon={isFullscreen ? <ArrowMinimize20Regular /> : <ArrowExpand20Regular />}
            aria-label={
              isFullscreen ? strings.CollapseButtonLabel : strings.ExpandButtonLabel
            }
            onClick={() => {
              fireAndForget(onRequestDisplayMode(isFullscreen ? 'inline' : 'fullscreen'));
            }}
          />
        </Tooltip>
      </div>
    );
  }

  function renderLoading(): JSX.Element {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingLabel}>
          <Spinner size="tiny" />
          <Body1>{strings.AskingLabel}</Body1>
        </div>

        <Skeleton className={styles.skeletonStack}>
          <SkeletonItem size={16} />
          <SkeletonItem size={16} />
          <SkeletonItem size={16} style={{ width: '70%' }} />
        </Skeleton>
      </div>
    );
  }

  function renderError(): JSX.Element {
    return (
      <MessageBar intent="error">
        <MessageBarBody>
          <MessageBarTitle>{strings.ErrorHeading}</MessageBarTitle>
          {errorMessage}
        </MessageBarBody>
        <Button appearance="transparent" onClick={onRetry}>
          {strings.RetryButtonLabel}
        </Button>
      </MessageBar>
    );
  }

  function renderSourceSummary(): JSX.Element {
    const label =
      citations.length === 1
        ? strings.SourceCountSingularLabel
        : strings.SourceCountLabel.replace('{0}', String(citations.length));

    return (
      <div className={styles.sourceSummary}>
        <Button
          appearance="subtle"
          size="small"
          icon={<ChevronRight16Regular />}
          iconPosition="after"
          onClick={() => {
            fireAndForget(onRequestDisplayMode('fullscreen'));
          }}
        >
          {label}
        </Button>
      </div>
    );
  }

  // shared by the empty state and the fullscreen follow-up section
  function renderAskBox(): JSX.Element {
    return (
      <div className={styles.followUp}>
        <Input
          className={styles.followUpInput}
          value={followUpText}
          placeholder={strings.FollowUpPlaceholder}
          disabled={isLoading}
          onChange={(_event, data) => setFollowUpText(data.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              submitFollowUp();
            }
          }}
        />
        <Button
          appearance="primary"
          icon={<Send20Regular />}
          disabled={isLoading || followUpText.trim().length === 0}
          onClick={submitFollowUp}
        >
          {strings.FollowUpButtonLabel}
        </Button>
      </div>
    );
  }

  function renderAnswer(): JSX.Element {
    return (
      <>
        <div className={styles.card}>
          <AnswerText
            blocks={blocks}
            citations={citations}
            strings={strings}
            onOpenLink={openLink}
          />
        </div>

        {isFullscreen && entities.length > 0 ? (
          <section className={styles.section}>
            <Subtitle2 className={styles.sectionHeading}>{strings.MentionsHeading}</Subtitle2>
            <div className={styles.mentions}>
              {entities.map((entity, index) => (
                <EntityChip
                  key={`${entity.entity}-${entity.label}-${index}`}
                  entity={entity.entity}
                  label={entity.label}
                  strings={strings}
                />
              ))}
            </div>
          </section>
        ) : undefined}

        {isFullscreen ? (
          <section className={styles.section}>
            <Subtitle2 className={styles.sectionHeading}>{strings.SourcesHeading}</Subtitle2>
            <SourcePanel citations={citations} strings={strings} onOpenLink={openLink} />
          </section>
        ) : (
          citations.length > 0 && renderSourceSummary()
        )}

        {isFullscreen ? (
          <section className={styles.section}>
            <Subtitle2 className={styles.sectionHeading}>
              {strings.FollowUpSectionTitle}
            </Subtitle2>
            {renderAskBox()}
          </section>
        ) : undefined}
      </>
    );
  }

  function renderBody(): React.ReactNode {
    if (errorMessage) {
      return renderError();
    }

    if (isLoading && blocks.length === 0) {
      return renderLoading();
    }

    if (blocks.length === 0) {
      return (
        <section className={styles.section}>
          <Body1 className={styles.empty}>{strings.EmptyQuestionMessage}</Body1>
          {renderAskBox()}
        </section>
      );
    }

    return renderAnswer();
  }

  return (
    <IdPrefixProvider value="work-iq-answers-">
      <FluentProvider
        theme={theme}
        targetDocument={targetDocument}
        style={{ minHeight: '100%' }}
      >
        <div className={styles.root}>
          {renderHeader()}
          {renderBody()}

          {isLoading && blocks.length > 0 ? (
            <div className={styles.loadingLabel}>
              <Spinner size="tiny" />
              <Caption1>{strings.AskingLabel}</Caption1>
            </div>
          ) : undefined}
        </div>
      </FluentProvider>
    </IdPrefixProvider>
  );
};

export default WorkIQAnswers;
