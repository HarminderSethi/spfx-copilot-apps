import * as React from 'react';
import {
  Avatar,
  Body1,
  Button,
  Caption1,
  Dropdown,
  Link,
  Option,
  Subtitle2,
  Textarea,
  makeStyles,
  mergeClasses,
  shorthands,
  tokens,
} from '@fluentui/react-components';
import { ArrowRightRegular, CheckmarkRegular, PersonEditRegular } from '@fluentui/react-icons';
import { KudosMarque } from './KudosMarque';
import { ValueChip } from './ValueChip';
import { KUDOS_VALUES, KUDOS_VALUE_ORDER, relativeDate } from './constants/kudosValues';
import type { IKudos, IPerson, KudosValueKey } from './models/kudos.types';

export type InlineCardMode = 'launcher' | 'compose' | 'confirmation';

/** Note length cap, surfaced as a live "n/500" counter. */
const MESSAGE_MAX = 500;

const useStyles = makeStyles({
  card: {
    boxSizing: 'border-box',
    width: '100%',
    maxWidth: '420px',
    display: 'flex',
    flexDirection: 'column',
    rowGap: '14px',
    ...shorthands.padding('16px'),
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    borderRadius: tokens.borderRadiusLarge,
    backgroundColor: tokens.colorNeutralBackground1,
    boxShadow: tokens.shadow4,
    fontFamily: tokens.fontFamilyBase,
    color: tokens.colorNeutralForeground1,
  },
  /** Roomier variant for the fullscreen wall's dialog — same card, more air. */
  cardSpacious: {
    maxWidth: '520px',
    rowGap: '18px',
    ...shorthands.padding('22px', '24px'),
  },
  header: { display: 'flex', alignItems: 'center', columnGap: '9px' },
  headerSpacer: { marginLeft: 'auto' },
  recipientRow: {
    display: 'flex',
    alignItems: 'center',
    columnGap: '10px',
    ...shorthands.padding('9px', '10px'),
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorNeutralBackground2,
  },
  recipientText: { display: 'flex', flexDirection: 'column', minWidth: 0 },
  truncate: { whiteSpace: 'nowrap', overflowX: 'hidden', textOverflow: 'ellipsis' },
  field: { display: 'flex', flexDirection: 'column', rowGap: '7px' },
  fieldLabel: {
    fontSize: '11px',
    letterSpacing: '0.07em',
    textTransform: 'uppercase',
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground3,
  },
  chips: { display: 'flex', flexWrap: 'wrap', columnGap: '8px', rowGap: '8px' },
  chipsSpacious: { columnGap: '10px', rowGap: '10px' },
  counter: { alignSelf: 'flex-end', color: tokens.colorNeutralForeground3 },
  successRow: { display: 'flex', alignItems: 'center', columnGap: '11px' },
  successMark: {
    position: 'relative',
    width: '38px',
    height: '38px',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: tokens.borderRadiusCircular,
    backgroundColor: tokens.colorBrandBackground2,
    color: tokens.colorBrandForeground1,
  },
  divider: { height: '1px', backgroundColor: tokens.colorNeutralStroke2 },
  strip: { display: 'flex', columnGap: '8px' },
  stripCard: {
    flexGrow: 1,
    flexBasis: 0,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    rowGap: '6px',
    ...shorthands.padding('9px'),
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorNeutralBackground2,
  },
  stripMessage: {
    fontSize: tokens.fontSizeBase100,
    lineHeight: '1.4',
    color: tokens.colorNeutralForeground3,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflowY: 'hidden',
  },
  digestRow: {
    display: 'flex',
    alignItems: 'flex-start',
    columnGap: '10px',
    ...shorthands.padding('8px', '10px'),
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorNeutralBackground2,
  },
  digestRowButton: {
    width: '100%',
    textAlign: 'left',
    fontFamily: 'inherit',
    color: 'inherit',
    cursor: 'pointer',
    ':hover': { backgroundColor: tokens.colorNeutralBackground2Hover },
    ':focus-visible': {
      outlineWidth: '2px',
      outlineStyle: 'solid',
      outlineColor: tokens.colorStrokeFocus2,
      outlineOffset: '1px',
    },
  },
  digestText: { display: 'flex', flexDirection: 'column', rowGap: '1px', flexGrow: 1, minWidth: 0 },
  digestTopLine: { display: 'flex', alignItems: 'center', columnGap: '12px' },
  digestName: {
    flexGrow: 1,
    minWidth: 0,
    whiteSpace: 'nowrap',
    overflowX: 'hidden',
    textOverflow: 'ellipsis',
  },
  digestDate: { flexShrink: 0, color: tokens.colorNeutralForeground3 },
  digestMessage: {
    color: tokens.colorNeutralForeground3,
    whiteSpace: 'nowrap',
    overflowX: 'hidden',
    textOverflow: 'ellipsis',
  },
  footer: { display: 'flex', alignItems: 'center', columnGap: '12px' },
  grow: { flexGrow: 1 },
});

export interface IKudosInlineCardProps {
  /** 'launcher' for a generic invocation, 'compose' when the prompt names someone. */
  initialMode?: InlineCardMode;
  /** Pre-filled recipient resolved from the prompt. */
  recipient?: IPerson;
  initialValue?: KudosValueKey;
  initialMessage?: string;
  /** 3 most recent kudos — confirmation strip and launcher digest. */
  recentKudos?: IKudos[];
  totalThisMonth?: number;
  onSend: (input: {
    recipientId: string;
    value: KudosValueKey;
    message: string;
    team?: string;
  }) => Promise<void>;
  /** Controlled team vocabulary (from the Departments list) for the team picker. */
  teams?: string[];
  onChangeRecipient?: () => void;
  onOpenWall?: () => void;
  /** Cancel the compose. Provided by the wall dialog to close it; inline card steps back to the launcher. */
  onCancel?: () => void;
  /** Roomier layout for the fullscreen wall's dialog. Inline chat card stays compact. */
  spacious?: boolean;
}

export const KudosInlineCard: React.FC<IKudosInlineCardProps> = ({
  initialMode = 'compose',
  recipient,
  initialValue = 'teamwork',
  initialMessage = '',
  recentKudos = [],
  totalThisMonth,
  onSend,
  teams,
  onChangeRecipient,
  onOpenWall,
  onCancel,
  spacious = false,
}) => {
  const styles = useStyles();
  const cardClass = mergeClasses(styles.card, spacious && styles.cardSpacious);
  const [mode, setMode] = React.useState<InlineCardMode>(initialMode);
  const [value, setValue] = React.useState<KudosValueKey>(initialValue);
  const [message, setMessage] = React.useState(initialMessage);
  const [team, setTeam] = React.useState<string>('');
  const [busy, setBusy] = React.useState(false);

  const firstName = recipient?.displayName.split(' ')[0] ?? 'your colleague';

  const send = async (): Promise<void> => {
    if (!recipient || !message.trim()) return;
    setBusy(true);
    try {
      await onSend({ recipientId: recipient.id, value, message: message.trim(), team: team || undefined });
      setMode('confirmation');
    } finally {
      setBusy(false);
    }
  };

  const valueGroupRef = React.useRef<HTMLDivElement>(null);

  // Arrow-key navigation for the value radiogroup (WAI-ARIA radio pattern).
  const onValueKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    const forward = event.key === 'ArrowRight' || event.key === 'ArrowDown';
    const back = event.key === 'ArrowLeft' || event.key === 'ArrowUp';
    if (!forward && !back) return;
    event.preventDefault();
    const count = KUDOS_VALUE_ORDER.length;
    const current = KUDOS_VALUE_ORDER.indexOf(value);
    const next = (current + (forward ? 1 : -1) + count) % count;
    setValue(KUDOS_VALUE_ORDER[next]);
    const radios = valueGroupRef.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]');
    radios?.[next]?.focus();
  };

  const cancel = (): void => {
    if (onCancel) {
      onCancel();
      return;
    }
    // Inline card with no host handler — step back to the launcher digest.
    setMessage('');
    setMode('launcher');
  };

  const marque = <KudosMarque />;

  if (mode === 'launcher') {
    return (
      <div className={cardClass}>
        <div className={styles.header}>
          {marque}
          <Subtitle2>Kudos &amp; recognition</Subtitle2>
          {typeof totalThisMonth === 'number' && (
            <Caption1 className={styles.headerSpacer}>{totalThisMonth} this month</Caption1>
          )}
        </div>
        <Body1>
          {recentKudos.length
            ? `${recentKudos.length} colleagues were recognised recently.`
            : 'Nobody has been recognised yet this month.'}
        </Body1>
        <div className={styles.field}>
          {recentKudos.slice(0, 3).map((k) => {
            const borderStyle = { borderLeft: `2.5px solid ${KUDOS_VALUES[k.value].accent}` };
            const inner = (
              <>
                <Avatar
                  size={28}
                  name={k.recipient.displayName}
                  image={k.recipient.photoUrl ? { src: k.recipient.photoUrl } : undefined}
                />
                <div className={styles.digestText}>
                  <div className={styles.digestTopLine}>
                    <Caption1 className={styles.digestName}>
                      <strong>{k.recipient.displayName}</strong>
                    </Caption1>
                    <Caption1 className={styles.digestDate}>{relativeDate(k.createdOn)}</Caption1>
                  </div>
                  <Caption1 className={styles.digestMessage}>{k.message}</Caption1>
                </div>
              </>
            );
            return onOpenWall ? (
              <button
                key={k.id}
                type="button"
                className={mergeClasses(styles.digestRow, styles.digestRowButton)}
                style={borderStyle}
                aria-label={`Read ${k.recipient.displayName}'s recognition on the wall`}
                onClick={onOpenWall}
              >
                {inner}
              </button>
            ) : (
              <div key={k.id} className={styles.digestRow} style={borderStyle}>
                {inner}
              </div>
            );
          })}
        </div>
        <div className={styles.footer}>
          <Button appearance="primary" className={styles.grow} onClick={() => setMode('compose')}>
            Give kudos
          </Button>
          {onOpenWall && (
            <Link onClick={onOpenWall} as="button">
              Open the wall <ArrowRightRegular />
            </Link>
          )}
        </div>
      </div>
    );
  }

  if (mode === 'confirmation') {
    return (
      <div className={cardClass}>
        <div className={styles.successRow}>
          <span className={styles.successMark} aria-hidden="true">
            <CheckmarkRegular fontSize={19} />
          </span>
          <div>
            <Subtitle2 as="h3" block>
              Kudos sent to {firstName}
            </Subtitle2>
            <Caption1>{KUDOS_VALUES[value].label} · now live on the recognition wall</Caption1>
          </div>
        </div>
        <div className={styles.divider} />
        {recentKudos.length > 0 && (
          <div className={styles.field}>
            <span className={styles.fieldLabel}>Latest on the wall</span>
            <div className={styles.strip}>
              {recentKudos.slice(0, 3).map((k) => (
                <div key={k.id} className={styles.stripCard}>
                  <div style={{ display: 'flex', alignItems: 'center', columnGap: 5 }}>
                    <Avatar
                      size={20}
                      name={k.recipient.displayName}
                      image={k.recipient.photoUrl ? { src: k.recipient.photoUrl } : undefined}
                    />
                    <Caption1 className={styles.truncate}>{k.recipient.displayName}</Caption1>
                  </div>
                  <span className={styles.stripMessage}>{k.message}</span>
                  <ValueChip value={k.value} size="small" />
                </div>
              ))}
            </div>
          </div>
        )}
        <div className={styles.footer}>
          {onOpenWall && (
            <Link onClick={onOpenWall} as="button">
              Open the wall <ArrowRightRegular />
            </Link>
          )}
          <Button
            appearance="transparent"
            className={styles.headerSpacer}
            onClick={() => {
              setMessage('');
              setMode('compose');
            }}
          >
            Give another
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cardClass}>
      <div className={styles.header}>
        {marque}
        <Subtitle2 as="h3">Give kudos</Subtitle2>
        <Caption1 className={styles.headerSpacer}>Recognition wall</Caption1>
      </div>

      {/* Recipient — resolved from the prompt, or chosen via the picker. */}
      <div className={styles.recipientRow}>
        {recipient ? (
          <>
            <Avatar
              size={36}
              name={recipient.displayName}
              image={recipient.photoUrl ? { src: recipient.photoUrl } : undefined}
            />
            <div className={styles.recipientText}>
              <Body1>{recipient.displayName}</Body1>
              <Caption1 className={styles.truncate}>{recipient.department}</Caption1>
            </div>
            {onChangeRecipient && (
              <Button
                size="small"
                shape="circular"
                icon={<PersonEditRegular />}
                className={styles.headerSpacer}
                onClick={onChangeRecipient}
              >
                Change
              </Button>
            )}
          </>
        ) : (
          <>
            <Avatar size={36} name="?" color="neutral" />
            <div className={styles.recipientText}>
              <Body1>Choose a colleague</Body1>
              <Caption1 className={styles.truncate}>No one selected yet</Caption1>
            </div>
            {onChangeRecipient && (
              <Button
                size="small"
                shape="circular"
                icon={<PersonEditRegular />}
                className={styles.headerSpacer}
                onClick={onChangeRecipient}
              >
                Choose
              </Button>
            )}
          </>
        )}
      </div>

      {teams && teams.length > 0 && (
        <div className={styles.field}>
          <span className={styles.fieldLabel} id="kudos-team-label">
            Team
          </span>
          <Dropdown
            aria-labelledby="kudos-team-label"
            placeholder="Select a team"
            value={team}
            selectedOptions={team ? [team] : []}
            onOptionSelect={(_, d) => setTeam((d.optionValue as string) ?? '')}
          >
            {teams.map((t) => (
              <Option key={t} value={t}>
                {t}
              </Option>
            ))}
          </Dropdown>
        </div>
      )}

      <div className={styles.field}>
        <span className={styles.fieldLabel} id="kudos-value-label">
          Value recognised
        </span>
        <div
          ref={valueGroupRef}
          className={mergeClasses(styles.chips, spacious && styles.chipsSpacious)}
          role="radiogroup"
          aria-labelledby="kudos-value-label"
          onKeyDown={onValueKeyDown}
        >
          {KUDOS_VALUE_ORDER.map((key) => (
            <ValueChip
              key={key}
              value={key}
              selected={value === key}
              onSelect={setValue}
              tabIndex={value === key ? 0 : -1}
            />
          ))}
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.fieldLabel} htmlFor="kudos-message">
          Message
        </label>
        <Textarea
          id="kudos-message"
          resize="none"
          rows={2}
          value={message}
          maxLength={MESSAGE_MAX}
          placeholder="What did they do?"
          aria-describedby="kudos-message-count"
          onChange={(_, data) => setMessage(data.value)}
        />
        <Caption1 id="kudos-message-count" className={styles.counter} aria-live="polite">
          {message.length}/{MESSAGE_MAX}
        </Caption1>
      </div>

      <div className={styles.footer}>
        <Button
          appearance="primary"
          className={styles.grow}
          disabled={busy || !recipient || !message.trim()}
          onClick={send}
        >
          {busy ? 'Sending…' : 'Send kudos'}
        </Button>
        <Button appearance="secondary" disabled={busy} onClick={cancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
};
