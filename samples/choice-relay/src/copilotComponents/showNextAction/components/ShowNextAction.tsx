import * as React from 'react';
import {
  Badge,
  Button,
  Card,
  Divider,
  Field,
  FluentProvider,
  IdPrefixProvider,
  Textarea,
  makeStyles,
  tokens,
  webDarkTheme,
  webLightTheme
} from '@fluentui/react-components';
import { Chat24Regular } from '@fluentui/react-icons';

import { createChoiceSelectionMessage } from '../../../shared/choiceSelectionMessage';
import { createGroundedRevisionRequest } from '../../../shared/nextActionPrompts';
import type { IShowNextActionProps } from './IShowNextActionProps';

const TOOL_NAME = 'ChoiceRelayShowNextAction';

const useStyles = makeStyles({
  root: {
    padding: tokens.spacingHorizontalM,
    color: tokens.colorNeutralForeground1
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '920px',
    margin: '0 auto'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: tokens.spacingHorizontalM,
    padding: tokens.spacingVerticalM,
    flexWrap: 'wrap'
  },
  headerText: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXXS
  },
  title: {
    margin: 0,
    fontSize: tokens.fontSizeBase500,
    lineHeight: tokens.lineHeightBase500
  },
  subtitle: {
    margin: 0,
    color: tokens.colorNeutralForeground2,
    fontSize: tokens.fontSizeBase200,
    lineHeight: tokens.lineHeightBase200
  },
  direction: {
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace'
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    minHeight: 0,
    gap: tokens.spacingVerticalM,
    padding: tokens.spacingVerticalM
  },
  result: {
    display: 'grid',
    gridTemplateColumns: 'minmax(150px, 0.7fr) minmax(260px, 1.3fr)',
    gap: tokens.spacingHorizontalM,
    alignItems: 'stretch',
    '@media (max-width: 620px)': {
      gridTemplateColumns: '1fr'
    }
  },
  selection: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXS,
    padding: tokens.spacingVerticalM,
    borderRadius: tokens.borderRadiusLarge,
    backgroundColor: tokens.colorNeutralBackground2
  },
  response: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXS,
    padding: tokens.spacingVerticalM,
    borderRadius: tokens.borderRadiusLarge,
    borderLeftWidth: tokens.strokeWidthThick,
    borderLeftStyle: 'solid',
    borderLeftColor: tokens.colorBrandStroke1,
    backgroundColor: tokens.colorBrandBackground2
  },
  label: {
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase200,
    fontWeight: 700,
    letterSpacing: '0.06em',
    textTransform: 'uppercase'
  },
  selectedOption: {
    margin: 0,
    fontSize: tokens.fontSizeBase400,
    lineHeight: tokens.lineHeightBase400,
    fontWeight: 600,
    overflowWrap: 'anywhere'
  },
  nextAction: {
    margin: 0,
    fontSize: tokens.fontSizeBase500,
    lineHeight: tokens.lineHeightBase500,
    fontWeight: 600,
    overflowWrap: 'anywhere'
  },
  explanation: {
    margin: 0,
    color: tokens.colorNeutralForeground2,
    lineHeight: tokens.lineHeightBase300,
    overflowWrap: 'anywhere'
  },
  flow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
    gap: tokens.spacingHorizontalS,
    alignItems: 'center',
    '@media (max-width: 620px)': {
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))'
    }
  },
  flowStep: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXXS,
    minWidth: 0,
    padding: tokens.spacingVerticalS,
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorNeutralBackground2
  },
  flowValue: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  adjustment: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr) minmax(210px, 280px)',
    gap: tokens.spacingHorizontalM,
    alignItems: 'end',
    '@media (max-width: 620px)': {
      gridTemplateColumns: '1fr'
    }
  },
  actions: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXS,
    alignItems: 'flex-start'
  },
  status: {
    color: tokens.colorNeutralForeground2,
    fontSize: tokens.fontSizeBase200,
    lineHeight: tokens.lineHeightBase200
  },
  details: {
    padding: tokens.spacingVerticalS,
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorNeutralBackground2
  },
  detailsSummary: {
    cursor: 'pointer',
    color: tokens.colorBrandForeground1,
    fontWeight: 600
  },
  inspector: {
    display: 'grid',
    gridTemplateColumns: 'minmax(110px, auto) minmax(0, 1fr)',
    gap: tokens.spacingHorizontalM,
    rowGap: tokens.spacingVerticalXS,
    marginTop: tokens.spacingVerticalM
  },
  inspectorLabel: {
    color: tokens.colorNeutralForeground3,
    fontWeight: 600
  },
  inspectorValue: {
    minWidth: 0,
    overflowWrap: 'anywhere'
  },
  inspectorHeading: {
    gridColumn: '1 / -1',
    margin: 0,
    fontSize: tokens.fontSizeBase300,
    lineHeight: tokens.lineHeightBase300
  },
  outbound: {
    gridColumn: '1 / -1',
    margin: 0,
    padding: tokens.spacingVerticalS,
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorNeutralBackground3,
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
    fontSize: tokens.fontSizeBase200,
    lineHeight: tokens.lineHeightBase200,
    whiteSpace: 'pre-wrap',
    overflowWrap: 'anywhere'
  }
});

type SendStatus = 'ready' | 'sending' | 'sent' | 'rejected' | 'failed';

const statusText: Record<SendStatus, string> = {
  ready: 'Your adjustment stays local until you send it.',
  sending: 'Sending the adjustment to Copilot…',
  sent: 'The host accepted the message. Copilot decides how to revise the action.',
  rejected: 'The host rejected the message. Edit the adjustment and try again.',
  failed: 'The message could not be sent. Edit the adjustment and try again.'
};

export default function ShowNextAction(
  props: IShowNextActionProps
): React.ReactElement {
  const {
    selectedOption,
    nextAction,
    explanation,
    hostContext,
    onSendFollowUp
  } = props;
  const styles = useStyles();
  const sendLockedRef = React.useRef<boolean>(false);
  const [adjustment, setAdjustment] = React.useState<string>('');
  const [sendStatus, setSendStatus] = React.useState<SendStatus>('ready');
  const [outboundText, setOutboundText] = React.useState<string>('');
  const theme = hostContext.theme === 'dark' ? webDarkTheme : webLightTheme;
  const mode = hostContext.displayMode || 'inline';
  const hostModes = hostContext.availableDisplayModes
    ? hostContext.availableDisplayModes.join(' / ')
    : 'Not reported';
  const canSend = Boolean(
    selectedOption.trim() && nextAction.trim() && adjustment.trim()
  );

  const unlockSend = React.useCallback((): void => {
    sendLockedRef.current = false;
  }, []);

  React.useEffect(() => {
    setAdjustment('');
    setSendStatus('ready');
    setOutboundText('');
    unlockSend();
  }, [explanation, nextAction, selectedOption, unlockSend]);

  const resetSendAfterEdit = React.useCallback((): void => {
    unlockSend();
    setSendStatus('ready');
  }, [unlockSend]);

  const handleSend = React.useCallback(async (): Promise<void> => {
    const trimmedAdjustment = adjustment.trim();
    if (!canSend || sendLockedRef.current) {
      return;
    }

    sendLockedRef.current = true;
    const message = createChoiceSelectionMessage({
      selectedOption,
      instruction: createGroundedRevisionRequest(
        trimmedAdjustment,
        nextAction
      )
    });

    setOutboundText(message);
    setSendStatus('sending');

    try {
      const accepted = await onSendFollowUp(message);
      if (!accepted) {
        unlockSend();
      }
      setSendStatus(accepted ? 'sent' : 'rejected');
    } catch {
      unlockSend();
      setSendStatus('failed');
    }
  }, [
    adjustment,
    canSend,
    nextAction,
    onSendFollowUp,
    selectedOption,
    unlockSend
  ]);

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
            <div className={styles.header}>
              <div className={styles.headerText}>
                <h2 className={styles.title}>
                  Choice Relay
                </h2>
                <p className={styles.subtitle}>
                  One selected option, one proposed next action, and a visible return path.
                </p>
              </div>
              <Badge appearance="outline" className={styles.direction}>
                Selection → Copilot → SPFx
              </Badge>
            </div>

            <Divider />

            <div className={styles.content}>
              <div className={styles.result}>
                <section className={styles.selection}>
                  <span className={styles.label}>Selected option</span>
                  <p className={styles.selectedOption}>{selectedOption}</p>
                </section>
                <section className={styles.response}>
                  <span className={styles.label}>Next action</span>
                  <p className={styles.nextAction}>{nextAction}</p>
                  <p className={styles.explanation}>{explanation}</p>
                </section>
              </div>

              <div role="group" aria-label="Prompt to response flow">
                <div className={styles.flow}>
                  <div className={styles.flowStep}>
                    <span className={styles.label}>1 · Prompt</span>
                    <span className={styles.flowValue}>User request</span>
                  </div>
                  <div className={styles.flowStep}>
                    <span className={styles.label}>2 · Tool</span>
                    <span className={styles.flowValue}>{TOOL_NAME}</span>
                  </div>
                  <div className={styles.flowStep}>
                    <span className={styles.label}>3 · Selection</span>
                    <span className={styles.flowValue}>{selectedOption}</span>
                  </div>
                  <div className={styles.flowStep}>
                    <span className={styles.label}>4 · Response</span>
                    <span className={styles.flowValue}>{nextAction}</span>
                  </div>
                </div>
              </div>

              <Divider />

              <div className={styles.adjustment}>
                <Field label="Adjust the next action">
                  <Textarea
                    value={adjustment}
                    rows={2}
                    resize="vertical"
                    maxLength={400}
                    placeholder="For example: Make this one five-minute drafting step."
                    disabled={sendStatus === 'sending'}
                    onChange={(_event, data) => {
                      setAdjustment(data.value);
                      resetSendAfterEdit();
                    }}
                  />
                </Field>
                <div className={styles.actions}>
                  <Button
                    appearance="primary"
                    icon={<Chat24Regular />}
                    disabled={
                      !canSend ||
                      sendStatus === 'sending' ||
                      sendStatus === 'sent'
                    }
                    onClick={handleSendClick}
                  >
                    {sendStatus === 'sending'
                      ? 'Sending…'
                      : sendStatus === 'sent'
                        ? 'Sent to Copilot'
                        : 'Revise with Copilot'}
                  </Button>
                  <span className={styles.status} aria-live="polite">
                    {statusText[sendStatus]}
                  </span>
                </div>
              </div>

              <details className={styles.details}>
                <summary className={styles.detailsSummary}>
                  Under the hood
                </summary>
                <div className={styles.inspector}>
                  <h3 className={styles.inspectorHeading}>Tool arguments</h3>
                  <span className={styles.inspectorLabel}>selectedOption</span>
                  <span className={styles.inspectorValue}>{selectedOption}</span>
                  <span className={styles.inspectorLabel}>nextAction</span>
                  <span className={styles.inspectorValue}>{nextAction}</span>
                  <span className={styles.inspectorLabel}>explanation</span>
                  <span className={styles.inspectorValue}>{explanation}</span>

                  <h3 className={styles.inspectorHeading}>Host</h3>
                  <span className={styles.inspectorLabel}>Display mode</span>
                  <span className={styles.inspectorValue}>{mode}</span>
                  <span className={styles.inspectorLabel}>Theme</span>
                  <span className={styles.inspectorValue}>
                    {hostContext.theme || 'light'}
                  </span>
                  <span className={styles.inspectorLabel}>Available modes</span>
                  <span className={styles.inspectorValue}>{hostModes}</span>

                  <h3 className={styles.inspectorHeading}>Outbound message</h3>
                  <pre className={styles.outbound}>
                    {outboundText || 'Nothing has been sent from this component yet.'}
                  </pre>
                </div>
              </details>
            </div>
          </Card>
        </div>
      </FluentProvider>
    </IdPrefixProvider>
  );
}
