import * as React from 'react';
import {
  Avatar,
  Body1,
  Button,
  Caption1,
  Dropdown,
  Option,
  Spinner,
  Subtitle2,
  Title3,
  makeStyles,
  shorthands,
  tokens,
} from '@fluentui/react-components';
import { AddRegular } from '@fluentui/react-icons';
import { KudosMarque } from './KudosMarque';
import { ValueChip } from './ValueChip';
import { Leaderboard } from './Leaderboard';
import { KUDOS_VALUES, KUDOS_VALUE_ORDER, relativeDate } from './constants/kudosValues';
import { ALL_TEAMS } from './constants/kudos.constants';
import type {
  IKudos,
  IKudosFilters,
  ILeaderboardEntry,
  KudosTimeRange,
  KudosValueKey,
} from './models/kudos.types';

const RANGE_LABEL: Record<KudosTimeRange, string> = {
  month: 'This month',
  quarter: 'This quarter',
  all: 'All time',
};

/**
 * Breakpoint is a CONTAINER query, not a viewport query: the web part is sized
 * by the Copilot canvas / SharePoint column, not by the window.
 */
const useStyles = makeStyles({
  root: {
    containerType: 'inline-size',
    containerName: 'kudoswall',
    boxSizing: 'border-box',
    width: '100%',
    height: '100%',
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    rowGap: '16px',
    ...shorthands.padding('20px'),
    backgroundColor: tokens.colorNeutralBackground2,
    color: tokens.colorNeutralForeground1,
    fontFamily: tokens.fontFamilyBase,
  },
  header: { display: 'flex', alignItems: 'center', columnGap: '14px', flexWrap: 'wrap' },
  filters: {
    display: 'flex',
    flexWrap: 'wrap',
    columnGap: '8px',
    rowGap: '8px',
    alignItems: 'center',
    paddingBottom: '14px',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: tokens.colorNeutralStroke2,
  },
  dropdown: { minWidth: '150px' },
  spacer: { marginLeft: 'auto' },

  /* Narrow: the whole column stack scrolls. Wide (container ≥ 800px): the feed
     scrolls on its own beside a fixed rail. The breakpoint is a CONTAINER query,
     nested per-slot as Griffel requires, because the component is sized by its
     canvas column rather than the window. */
  columns: {
    display: 'flex',
    flexWrap: 'wrap',
    columnGap: '18px',
    rowGap: '18px',
    alignItems: 'flex-start',
    flexGrow: 1,
    minHeight: 0,
    overflowY: 'auto',
    overflowX: 'hidden',
    '@container kudoswall (min-width: 800px)': { overflowY: 'hidden' },
  },
  feed: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: '430px',
    minWidth: '300px',
    display: 'flex',
    flexDirection: 'column',
    rowGap: '10px',
    '@container kudoswall (min-width: 800px)': {
      maxHeight: '100%',
      overflowY: 'auto',
      paddingRight: '4px',
    },
  },
  rail: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: '290px',
    minWidth: '260px',
    maxWidth: '340px',
    display: 'flex',
    flexDirection: 'column',
    rowGap: '14px',
  },

  kudosCard: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: '9px',
    ...shorthands.padding('13px', '15px'),
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    borderRadius: tokens.borderRadiusLarge,
    backgroundColor: tokens.colorNeutralBackground1,
    boxShadow: tokens.shadow2,
  },
  kudosHead: { display: 'flex', alignItems: 'center', columnGap: '10px' },
  kudosWho: { display: 'flex', flexDirection: 'column', minWidth: 0, rowGap: '1px' },
  kudosBy: { color: tokens.colorNeutralForeground3 },
  message: { margin: 0, textWrap: 'pretty', color: tokens.colorNeutralForeground2 },
  chipRow: { display: 'flex' },

  empty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    rowGap: '10px',
    textAlign: 'center',
    ...shorthands.padding('44px', '28px'),
    ...shorthands.border('1px', 'dashed', tokens.colorNeutralStroke2),
    borderRadius: tokens.borderRadiusLarge,
    backgroundColor: tokens.colorNeutralBackground1,
  },
  emptyMarque: { position: 'relative', width: '52px', height: '52px' },
  emptyRing: {
    position: 'absolute',
    borderRadius: tokens.borderRadiusCircular,
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
  },
  centre: { display: 'flex', justifyContent: 'center', ...shorthands.padding('40px') },
});

export interface IRecognitionWallProps {
  kudos: IKudos[];
  mostRecognised: ILeaderboardEntry[];
  topGivers: ILeaderboardEntry[];
  departments: string[];
  filters: IKudosFilters;
  loading?: boolean;
  onFiltersChange: (filters: IKudosFilters) => void;
  onGiveKudos: () => void;
}

export const RecognitionWall: React.FC<IRecognitionWallProps> = ({
  kudos,
  mostRecognised,
  topGivers,
  departments,
  filters,
  loading = false,
  onFiltersChange,
  onGiveKudos,
}) => {
  const styles = useStyles();

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <div style={{ marginRight: 'auto', display: 'flex', alignItems: 'center', columnGap: '12px' }}>
          <KudosMarque size={28} />
          <Title3 as="h2" block>
            Kudos &amp; recognition wall
          </Title3>
        </div>
        <Button appearance="primary" icon={<AddRegular />} onClick={onGiveKudos}>
          Give kudos
        </Button>
      </header>

      <div className={styles.filters}>
        <Dropdown
          className={styles.dropdown}
          aria-label="Filter by team"
          value={filters.department}
          selectedOptions={[filters.department]}
          onOptionSelect={(_, d) =>
            onFiltersChange({ ...filters, department: d.optionValue as string })
          }
        >
          <Option value={ALL_TEAMS}>{ALL_TEAMS}</Option>
          {departments.map((d) => (
            <Option key={d} value={d}>
              {d}
            </Option>
          ))}
        </Dropdown>

        <Dropdown
          className={styles.dropdown}
          aria-label="Filter by value"
          value={filters.value === 'all' ? 'All values' : KUDOS_VALUES[filters.value].label}
          selectedOptions={[filters.value]}
          onOptionSelect={(_, d) =>
            onFiltersChange({ ...filters, value: d.optionValue as KudosValueKey | 'all' })
          }
        >
          <Option value="all">All values</Option>
          {KUDOS_VALUE_ORDER.map((k) => (
            <Option key={k} value={k}>
              {KUDOS_VALUES[k].label}
            </Option>
          ))}
        </Dropdown>

        <Dropdown
          className={styles.dropdown}
          aria-label="Filter by time range"
          value={RANGE_LABEL[filters.range]}
          selectedOptions={[filters.range]}
          onOptionSelect={(_, d) =>
            onFiltersChange({ ...filters, range: d.optionValue as KudosTimeRange })
          }
        >
          {(Object.keys(RANGE_LABEL) as KudosTimeRange[]).map((r) => (
            <Option key={r} value={r}>
              {RANGE_LABEL[r]}
            </Option>
          ))}
        </Dropdown>

        <Caption1 className={styles.spacer}>
          {kudos.length ? `${kudos.length} kudos` : 'No kudos yet'}
        </Caption1>
      </div>

      {loading ? (
        <div className={styles.centre}>
          <Spinner label="Loading the wall…" />
        </div>
      ) : (
        <div className={styles.columns}>
          <div className={styles.feed}>
            {kudos.length === 0 ? (
              <div className={styles.empty}>
                <span className={styles.emptyMarque} aria-hidden="true">
                  <span className={styles.emptyRing} style={{ inset: 0 }} />
                  <span className={styles.emptyRing} style={{ inset: 9 }} />
                  <span
                    style={{
                      position: 'absolute',
                      inset: 19,
                      borderRadius: tokens.borderRadiusCircular,
                      backgroundColor: tokens.colorBrandBackground2,
                    }}
                  />
                </span>
                <Subtitle2>Be the first to recognise a colleague</Subtitle2>
                <Caption1 style={{ maxWidth: 300 }}>
                  No kudos match this filter yet. A single sentence about someone&rsquo;s good work
                  goes a long way.
                </Caption1>
                <Button shape="circular" onClick={onGiveKudos}>
                  Give kudos
                </Button>
              </div>
            ) : (
              kudos.map((k) => (
                <article
                  key={k.id}
                  className={styles.kudosCard}
                  style={{ borderLeft: `3px solid ${KUDOS_VALUES[k.value].accent}` }}
                >
                  <div className={styles.kudosHead}>
                    <Avatar
                      size={36}
                      name={k.recipient.displayName}
                      image={k.recipient.photoUrl ? { src: k.recipient.photoUrl } : undefined}
                    />
                    <div className={styles.kudosWho}>
                      <Body1>
                        <strong>{k.recipient.displayName}</strong>
                      </Body1>
                      <Caption1 className={styles.kudosBy}>
                        recognised by {k.giver.displayName}
                      </Caption1>
                    </div>
                    <Caption1 className={styles.spacer}>
                      <time dateTime={k.createdOn}>{relativeDate(k.createdOn)}</time>
                    </Caption1>
                  </div>
                  <Body1 as="p" className={styles.message}>
                    {k.message}
                  </Body1>
                  <div className={styles.chipRow}>
                    <ValueChip value={k.value} />
                  </div>
                </article>
              ))
            )}
          </div>

          <aside className={styles.rail}>
            <Leaderboard
              title="Most recognised"
              eyebrow={RANGE_LABEL[filters.range]}
              entries={mostRecognised}
              showDepartment
            />
            <Leaderboard
              title="Top givers"
              eyebrow={RANGE_LABEL[filters.range]}
              entries={topGivers}
            />
          </aside>
        </div>
      )}
    </div>
  );
};
