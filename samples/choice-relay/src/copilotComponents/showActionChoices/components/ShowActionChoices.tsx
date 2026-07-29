import * as React from 'react';
import {
  Badge,
  Button,
  Card,
  FluentProvider,
  IdPrefixProvider,
  Radio,
  RadioGroup,
  makeStyles,
  mergeClasses,
  tokens,
  webDarkTheme,
  webLightTheme
} from '@fluentui/react-components';
import { Chat24Regular } from '@fluentui/react-icons';

import { createChoiceSelectionMessage } from '../../../shared/choiceSelectionMessage';
import { GROUNDED_NEXT_ACTION_REQUEST } from '../../../shared/nextActionPrompts';
import type { IShowActionChoicesProps } from './IShowActionChoicesProps';

const TOOL_NAME = 'ChoiceRelayShowChoices';

type SendStatus = 'ready' | 'sending' | 'sent' | 'rejected' | 'failed';
type FlowState = 'complete' | 'active' | 'pending';

interface IFlowStage {
  label: string;
  state: FlowState;
}

const useStyles = makeStyles({
  root: {
    boxSizing: 'border-box',
    width: '100%',
    maxWidth: '760px',
    margin: '0 auto',
    padding: tokens.spacingVerticalS,
    color: tokens.colorNeutralForeground1
  },
  card: {
    gap: 0,
    overflow: 'hidden'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: tokens.spacingHorizontalM,
    padding: tokens.spacingVerticalM,
    paddingBottom: tokens.spacingVerticalS,
    borderBottom: '1px solid ' + tokens.colorNeutralStroke2
  },
  brand: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXXS,
    minWidth: 0
  },
  labName: {
    margin: 0,
    fontSize: tokens.fontSizeBase400,
    lineHeight: tokens.lineHeightBase400,
    fontWeight: 700
  },
  headerHint: {
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase200,
    lineHeight: tokens.lineHeightBase200
  },
  flow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
    gap: tokens.spacingHorizontalXS,
    margin: 0,
    padding: tokens.spacingVerticalS + ' ' + tokens.spacingHorizontalM,
    listStyleType: 'none',
    backgroundColor: tokens.colorNeutralBackground2
  },
  flowStage: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: tokens.spacingVerticalXXS,
    minWidth: 0,
    paddingTop: tokens.spacingVerticalXS,
    borderTopWidth: tokens.strokeWidthThick,
    borderTopStyle: 'solid',
    textAlign: 'center'
  },
  flowComplete: {
    borderTopColor: tokens.colorPaletteGreenBorderActive,
    color: tokens.colorNeutralForeground1
  },
  flowActive: {
    borderTopColor: tokens.colorBrandStroke1,
    color: tokens.colorBrandForeground1
  },
  flowPending: {
    borderTopColor: tokens.colorNeutralStroke2,
    color: tokens.colorNeutralForeground3
  },
  flowNumber: {
    fontSize: tokens.fontSizeBase100,
    fontWeight: 700
  },
  flowLabel: {
    minWidth: 0,
    overflow: 'hidden',
    fontSize: tokens.fontSizeBase200,
    fontWeight: 600,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    padding: tokens.spacingVerticalM
  },
  question: {
    margin: 0,
    fontSize: tokens.fontSizeBase500,
    lineHeight: tokens.lineHeightBase500,
    overflowWrap: 'anywhere'
  },
  choices: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXXS
  },
  choice: {
    boxSizing: 'border-box',
    width: '100%',
    minHeight: '36px',
    padding: tokens.spacingVerticalXS + ' ' + tokens.spacingHorizontalS,
    borderRadius: tokens.borderRadiusMedium,
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground2
    }
  },
  empty: {
    margin: 0,
    padding: tokens.spacingVerticalM,
    border: '1px dashed ' + tokens.colorNeutralStroke2,
    borderRadius: tokens.borderRadiusMedium,
    color: tokens.colorNeutralForeground3
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: tokens.spacingHorizontalM,
    flexWrap: 'wrap'
  },
  status: {
    flex: '1 1 260px',
    margin: 0,
    color: tokens.colorNeutralForeground2,
    fontSize: tokens.fontSizeBase200,
    lineHeight: tokens.lineHeightBase200
  },
  advisory: {
    margin: 0,
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase100,
    lineHeight: tokens.lineHeightBase100
  },
  inspector: {
    borderTop: '1px solid ' + tokens.colorNeutralStroke2
  },
  inspectorSummary: {
    padding: tokens.spacingVerticalS + ' ' + tokens.spacingHorizontalM,
    cursor: 'pointer',
    color: tokens.colorBrandForeground1,
    fontSize: tokens.fontSizeBase200,
    fontWeight: 700
  },
  inspectorBody: {
    display: 'grid',
    gridTemplateColumns: 'minmax(108px, auto) minmax(0, 1fr)',
    gap: tokens.spacingVerticalS + ' ' + tokens.spacingHorizontalM,
    maxHeight: '240px',
    overflowY: 'auto',
    padding: '0 ' + tokens.spacingHorizontalM + ' ' + tokens.spacingVerticalM,
    '@media (max-width: 480px)': {
      gridTemplateColumns: '1fr',
      rowGap: tokens.spacingVerticalXXS
    }
  },
  inspectorHeading: {
    gridColumn: '1 / -1',
    margin: 0,
    fontSize: tokens.fontSizeBase300,
    fontWeight: 700
  },
  inspectorLabel: {
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase200,
    fontWeight: 600
  },
  inspectorValue: {
    minWidth: 0,
    margin: 0,
    overflowWrap: 'anywhere',
    fontSize: tokens.fontSizeBase200
  },
  optionList: {
    margin: 0,
    paddingLeft: tokens.spacingHorizontalXL
  },
  outbound: {
    gridColumn: '1 / -1',
    margin: 0,
    maxHeight: '132px',
    overflow: 'auto',
    padding: tokens.spacingVerticalS,
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorNeutralBackground3,
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
    fontSize: tokens.fontSizeBase100,
    lineHeight: tokens.lineHeightBase200,
    whiteSpace: 'pre-wrap',
    overflowWrap: 'anywhere'
  }
});

function getStatusText(
  sendStatus: SendStatus,
  hasSelection: boolean
): string {
  switch (sendStatus) {
    case 'sending':
      return 'Sending your selection to the Copilot host…';
    case 'sent':
      return 'The host accepted the message. Copilot can now respond.';
    case 'rejected':
      return 'The host did not accept the message. You can retry.';
    case 'failed':
      return 'The message could not be sent. Your selection is unchanged.';
    default:
      return hasSelection
        ? 'Ready to send this selection.'
        : 'Choose one option to continue.';
  }
}

export default function ShowActionChoices(
  props: IShowActionChoicesProps
): React.ReactElement {
  const { question, options, hostContext, onSendFollowUp } = props;
  const styles = useStyles();
  const sendLockedRef = React.useRef<boolean>(false);
  const [selectedIndex, setSelectedIndex] = React.useState<string>('');
  const [sendStatus, setSendStatus] = React.useState<SendStatus>('ready');
  const [lastOutboundMessage, setLastOutboundMessage] = React.useState<string>(
    ''
  );
  const theme = hostContext.theme === 'dark' ? webDarkTheme : webLightTheme;
  const mode = hostContext.displayMode || 'inline';
  const questionId = props.idPrefix + 'question';
  const choices = options.filter((option) => option.trim());
  const hasValidChoiceSet = Boolean(
    question.trim() && choices.length >= 2 && choices.length <= 4
  );
  const selectedOption =
    selectedIndex === '' ? undefined : choices[Number(selectedIndex)];
  const hasSelection = Boolean(
    hasValidChoiceSet && selectedOption && selectedOption.trim()
  );
  const validOptionCount = choices.length;
  const flowStages: IFlowStage[] = [
    { label: 'Prompt', state: 'complete' },
    { label: 'Tool', state: 'complete' },
    {
      label: 'Selection',
      state:
        sendStatus === 'sending' || sendStatus === 'sent'
          ? 'complete'
          : 'active'
    },
    {
      label: 'Response',
      state:
        sendStatus === 'sending' || sendStatus === 'sent'
          ? 'active'
          : 'pending'
    }
  ];

  React.useEffect(() => {
    sendLockedRef.current = false;
    setSelectedIndex('');
    setSendStatus('ready');
    setLastOutboundMessage('');
  }, [question, options]);

  const resetAfterSelection = React.useCallback((): void => {
    sendLockedRef.current = false;
    setSendStatus('ready');
    setLastOutboundMessage('');
  }, []);

  const unlockSend = React.useCallback((): void => {
    sendLockedRef.current = false;
  }, []);

  const handleSend = React.useCallback(async (): Promise<void> => {
    if (
      !hasValidChoiceSet ||
      !selectedOption ||
      !selectedOption.trim() ||
      sendLockedRef.current
    ) {
      return;
    }

    sendLockedRef.current = true;
    setSendStatus('sending');
    const outboundMessage = createChoiceSelectionMessage({
      selectedOption,
      instruction: GROUNDED_NEXT_ACTION_REQUEST
    });
    setLastOutboundMessage(outboundMessage);

    try {
      const accepted = await onSendFollowUp(outboundMessage);
      if (!accepted) {
        unlockSend();
      }
      setSendStatus(accepted ? 'sent' : 'rejected');
    } catch {
      unlockSend();
      setSendStatus('failed');
    }
  }, [hasValidChoiceSet, onSendFollowUp, selectedOption, unlockSend]);

  const handleSendClick = React.useCallback((): void => {
    handleSend().catch(() => {
      unlockSend();
      setSendStatus('failed');
    });
  }, [handleSend, unlockSend]);

  return (
    <IdPrefixProvider value={props.idPrefix}>
      <FluentProvider
        theme={theme}
        targetDocument={props.targetDocument}
        style={{ minHeight: '100%' }}
      >
        <div className={styles.root}>
          <Card className={styles.card}>
            <header className={styles.header}>
              <div className={styles.brand}>
                <span className={styles.labName}>
                  Choice Relay
                </span>
                <span className={styles.headerHint}>
                  Review the choices, then send one selection.
                </span>
              </div>
              <Badge appearance="outline">SPFx</Badge>
            </header>

            <ol className={styles.flow} aria-label="Copilot interaction flow">
              {flowStages.map((stage, index) => (
                <li
                  key={stage.label}
                  className={mergeClasses(
                    styles.flowStage,
                    stage.state === 'complete'
                      ? styles.flowComplete
                      : stage.state === 'active'
                        ? styles.flowActive
                        : styles.flowPending
                  )}
                  aria-current={stage.state === 'active' ? 'step' : undefined}
                >
                  <span className={styles.flowNumber}>{index + 1}</span>
                  <span className={styles.flowLabel}>{stage.label}</span>
                </li>
              ))}
            </ol>

            <section className={styles.content} aria-labelledby={questionId}>
              <h2 className={styles.question} id={questionId}>
                {question}
              </h2>

              {hasValidChoiceSet ? (
                <RadioGroup
                  className={styles.choices}
                  value={selectedIndex}
                  aria-labelledby={questionId}
                  disabled={sendStatus === 'sending'}
                  onChange={(_event, data) => {
                    setSelectedIndex(data.value);
                    resetAfterSelection();
                  }}
                >
                  {choices.map((option, index) => (
                    <Radio
                      className={styles.choice}
                      key={index}
                      value={String(index)}
                      label={option || '(Empty option)'}
                      disabled={!option.trim() || sendStatus === 'sending'}
                    />
                  ))}
                </RadioGroup>
              ) : (
                <p className={styles.empty} role="status">
                  Copilot must provide one question and two to four non-empty choices.
                </p>
              )}

              <div className={styles.actions}>
                <p className={styles.status} aria-live="polite">
                  {getStatusText(sendStatus, hasSelection)}
                </p>
                <Button
                  appearance="primary"
                  icon={<Chat24Regular />}
                  disabled={
                    !hasSelection ||
                    sendStatus === 'sending' ||
                    sendStatus === 'sent'
                  }
                  onClick={handleSendClick}
                >
                  Continue with Copilot
                </Button>
              </div>

              <p className={styles.advisory}>
                Only the option you select is sent back to the conversation.
              </p>
            </section>

            <details className={styles.inspector}>
              <summary className={styles.inspectorSummary}>
                Under the hood
              </summary>
              <div className={styles.inspectorBody}>
                <h3 className={styles.inspectorHeading}>
                  Original tool arguments
                </h3>
                <span className={styles.inspectorLabel}>Tool</span>
                <p className={styles.inspectorValue}>{TOOL_NAME}</p>
                <span className={styles.inspectorLabel}>question</span>
                <p className={styles.inspectorValue}>{question}</p>
                <span className={styles.inspectorLabel}>options</span>
                <ol className={mergeClasses(styles.inspectorValue, styles.optionList)}>
                  {options.map((option, index) => (
                    <li key={index}>{option || '(empty string)'}</li>
                  ))}
                </ol>

                <h3 className={styles.inspectorHeading}>Host details</h3>
                <span className={styles.inspectorLabel}>Display mode</span>
                <p className={styles.inspectorValue}>{mode}</p>
                <span className={styles.inspectorLabel}>Theme</span>
                <p className={styles.inspectorValue}>
                  {hostContext.theme || 'light'}
                </p>
                <span className={styles.inspectorLabel}>Available modes</span>
                <p className={styles.inspectorValue}>
                  {hostContext.availableDisplayModes
                    ? hostContext.availableDisplayModes.join(', ')
                    : 'Not reported by the host'}
                </p>
                <span className={styles.inspectorLabel}>Valid options</span>
                <p className={styles.inspectorValue}>{validOptionCount}</p>

                {lastOutboundMessage ? (
                  <>
                    <h3 className={styles.inspectorHeading}>
                      Exact outbound message
                    </h3>
                    <pre className={styles.outbound}>{lastOutboundMessage}</pre>
                  </>
                ) : undefined}
              </div>
            </details>
          </Card>
        </div>
      </FluentProvider>
    </IdPrefixProvider>
  );
}
