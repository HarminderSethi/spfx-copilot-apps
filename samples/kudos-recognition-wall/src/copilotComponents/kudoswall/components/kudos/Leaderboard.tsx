import * as React from 'react';
import {
  Avatar,
  Body1,
  Caption1,
  Subtitle2,
  makeStyles,
  shorthands,
  tokens,
} from '@fluentui/react-components';
import type { ILeaderboardEntry } from './models/kudos.types';

/** Subtle rank accents — gold, silver, bronze; neutral from 4th. */
const RANK_ACCENT = ['#c9a227', '#9aa0a6', '#b08050'];

const useStyles = makeStyles({
  card: {
    ...shorthands.padding('15px', '15px', '8px'),
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    borderRadius: tokens.borderRadiusLarge,
    backgroundColor: tokens.colorNeutralBackground1,
  },
  head: { display: 'flex', flexDirection: 'column', marginBottom: '11px' },
  eyebrow: {
    fontSize: '11px',
    letterSpacing: '0.07em',
    textTransform: 'uppercase',
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground3,
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    columnGap: '10px',
    ...shorthands.padding('7px', 0),
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: tokens.colorNeutralStroke2,
  },
  rank: {
    width: '20px',
    flexShrink: 0,
    textAlign: 'center',
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightBold,
  },
  text: { display: 'flex', flexDirection: 'column', minWidth: 0 },
  truncate: { whiteSpace: 'nowrap', overflowX: 'hidden', textOverflow: 'ellipsis' },
  count: {
    marginLeft: 'auto',
    flexShrink: 0,
    ...shorthands.padding('3px', '9px'),
    borderRadius: tokens.borderRadiusCircular,
    backgroundColor: tokens.colorNeutralBackground3,
    fontWeight: tokens.fontWeightSemibold,
  },
});

export interface ILeaderboardProps {
  title: string;
  eyebrow: string;
  entries: ILeaderboardEntry[];
  showDepartment?: boolean;
}

export const Leaderboard: React.FC<ILeaderboardProps> = ({
  title,
  eyebrow,
  entries,
  showDepartment = false,
}) => {
  const styles = useStyles();
  return (
    <section className={styles.card}>
      <div className={styles.head}>
        <Subtitle2 as="h3">{title}</Subtitle2>
        <span className={styles.eyebrow}>{eyebrow}</span>
      </div>
      <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {entries.map((entry, i) => {
          const accent = RANK_ACCENT[i] ?? tokens.colorNeutralForeground3;
          return (
            <li key={entry.person.id} className={styles.row}>
              <span className={styles.rank} style={{ color: accent }}>
                {i + 1}
              </span>
              <Avatar
                size={showDepartment ? 32 : 28}
                name={entry.person.displayName}
                image={entry.person.photoUrl ? { src: entry.person.photoUrl } : undefined}
                style={
                  i < 3
                    ? { boxShadow: `0 0 0 2px ${tokens.colorNeutralBackground1}, 0 0 0 3.5px ${accent}` }
                    : undefined
                }
              />
              <span className={styles.text}>
                <Body1 className={styles.truncate}>{entry.person.displayName}</Body1>
                {showDepartment && (
                  <Caption1 className={styles.truncate}>{entry.person.department}</Caption1>
                )}
              </span>
              <Caption1 className={styles.count}>{entry.count}</Caption1>
            </li>
          );
        })}
      </ol>
    </section>
  );
};
