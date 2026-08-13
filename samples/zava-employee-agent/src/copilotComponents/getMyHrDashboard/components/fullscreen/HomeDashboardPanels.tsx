import * as React from 'react';

import { Avatar } from '@fluentui/react-avatar';
import { Text } from '@fluentui/react-text';
import { makeStyles, mergeClasses } from '@griffel/react';
import { tokens } from '@fluentui/react-theme';
import {
  CalendarLtr20Regular,
  CheckmarkCircle20Filled,
  Clock20Regular,
  LearningApp20Regular,
  Organization20Regular,
  Person20Regular
} from '@fluentui/react-icons';

import type {
  HomePanelId,
  IZavaDestination,
  IZavaEmployeeExperience,
  IZavaSettings
} from '../../../shared/models/zavaEmployee';
import { formatShortDate, formatTimeUntil } from '../../../shared/utils/datetime';
import { formatZavaCurrency, getJurisdictionLabel } from '../../../shared/utils/formatSettings';
import type { IHrActionPlan } from '../../models/hrActionPlan';
import DashboardCard from '../../../shared/components/DashboardCard';
import LeaveBalanceChart from './LeaveBalanceChart';
import StatusBadge from '../../../shared/components/StatusBadge';
import type { StatusIntent } from '../../../shared/components/StatusBadge';

const useStyles = makeStyles({
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '16px',
    alignItems: 'start'
  },
  column: { minWidth: 0, display: 'flex', flexDirection: 'column', gap: '16px' },
  list: { paddingLeft: '14px', paddingRight: '14px', paddingBottom: '8px' },
  rowButton: {
    width: '100%',
    minHeight: '58px',
    display: 'grid',
    gridTemplateColumns: '28px minmax(0, 1fr) auto',
    alignItems: 'center',
    gap: '9px',
    paddingTop: '8px',
    paddingBottom: '8px',
    color: tokens.colorNeutralForeground1,
    backgroundColor: 'transparent',
    borderTop: `1px solid ${tokens.colorNeutralStroke3}`,
    borderRight: 'none',
    borderBottom: 'none',
    borderLeft: 'none',
    textAlign: 'left',
    cursor: 'pointer',
    ':hover': { backgroundColor: tokens.colorSubtleBackgroundHover },
    ':focus-visible': {
      outlineColor: tokens.colorStrokeFocus2,
      outlineStyle: 'solid',
      outlineWidth: '2px'
    }
  },
  firstRow: { borderTop: 'none' },
  rowIcon: {
    width: '26px',
    height: '26px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: tokens.colorBrandForeground1,
    backgroundColor: tokens.colorBrandBackground2,
    borderRadius: tokens.borderRadiusCircular
  },
  rowTitle: { fontWeight: tokens.fontWeightSemibold },
  rowSummary: { color: tokens.colorNeutralForeground3, lineHeight: tokens.lineHeightBase200 },
  snapshot: {
    display: 'grid',
    gridTemplateColumns: '104px minmax(0, 1fr)',
    gap: '14px',
    alignItems: 'center',
    padding: '16px',
    '@media (max-width: 360px)': { gridTemplateColumns: '88px minmax(0, 1fr)', padding: '12px' }
  },
  muted: { color: tokens.colorNeutralForeground3 },
  snapshotLines: { display: 'flex', flexDirection: 'column' },
  snapshotLine: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '8px',
    paddingTop: '8px',
    paddingBottom: '8px',
    borderBottom: `1px solid ${tokens.colorNeutralStroke3}`
  },
  learning: { padding: '14px' },
  learningTop: { display: 'flex', justifyContent: 'space-between', gap: '12px' },
  percentage: { fontWeight: tokens.fontWeightBold },
  progress: {
    height: '7px',
    marginTop: '11px',
    overflow: 'hidden',
    backgroundColor: tokens.colorNeutralBackground3,
    borderRadius: tokens.borderRadiusCircular
  },
  progressBar: { width: '86%', height: '100%', backgroundImage: `linear-gradient(90deg, ${tokens.colorBrandBackground}, ${tokens.colorPaletteGreenBackground3})` },
  course: {
    display: 'grid',
    gridTemplateColumns: '32px minmax(0, 1fr) auto',
    alignItems: 'center',
    gap: '9px',
    marginTop: '12px',
    paddingTop: '11px',
    borderTop: `1px solid ${tokens.colorNeutralStroke3}`
  },
  people: { padding: '14px' },
  peopleIntro: { color: tokens.colorNeutralForeground2, lineHeight: tokens.lineHeightBase200 },
  peopleGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '8px', marginTop: '12px' },
  person: { minWidth: 0, textAlign: 'center' },
  personName: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: tokens.fontWeightSemibold },
  oneToOne: {
    display: 'grid',
    gridTemplateColumns: '38px minmax(0, 1fr) auto',
    alignItems: 'center',
    gap: '9px',
    marginTop: '13px',
    paddingTop: '12px',
    borderTop: `1px solid ${tokens.colorNeutralStroke3}`
  },
  milestone: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr) 168px',
    minHeight: '168px',
    overflow: 'hidden',
    backgroundImage: `linear-gradient(135deg, ${tokens.colorNeutralBackground1} 0%, ${tokens.colorPaletteBerryBackground2} 150%)`,
    '@media (max-width: 360px)': { gridTemplateColumns: 'minmax(0, 1fr) 140px' }
  },
  milestoneCopy: { padding: '16px 8px 16px 16px' },
  milestoneKicker: { color: tokens.colorPaletteBerryForeground2, textTransform: 'uppercase', fontWeight: tokens.fontWeightSemibold },
  milestoneTitle: { fontWeight: tokens.fontWeightSemibold },
  milestoneImage: { width: '100%', height: '168px', objectFit: 'cover', objectPosition: 'center center', alignSelf: 'end' }
});

export interface IHomeDashboardPanelsProps {
  data: IZavaEmployeeExperience;
  plan: IHrActionPlan;
  now: Date;
  settings: IZavaSettings;
  locale?: string;
  onNavigate: (destination: IZavaDestination, trigger?: HTMLButtonElement) => void;
}

const statusIntentFor = (priority: IHrActionPlan['items'][number]['priority']): StatusIntent => {
  switch (priority) {
    case 'critical': return 'critical';
    case 'high': return 'attention';
    case 'optional': return 'positive';
    default: return 'neutral';
  }
};

const HomeDashboardPanels: React.FunctionComponent<IHomeDashboardPanelsProps> = (props) => {
  const styles = useStyles();
  const learning = props.data.signals.find((signal) => signal.family === 'learning');
  const milestone = props.data.milestones[0];
  const closePeople = props.data.people.filter((person) =>
    person.relationship === 'manager' || person.relationship === 'hrPartner' || person.relationship === 'collaborator'
  );
  const oneToOne = props.data.events.find((event) => event.id === 'event-one-to-one-diego');
  const isVisible = (panel: HomePanelId): boolean =>
    props.settings.visibleHomePanels.indexOf(panel) !== -1;
  const firstColumnVisible = isVisible('actions') || isVisible('timeline');
  const secondColumnVisible = isVisible('snapshot') || isVisible('learning');
  const thirdColumnVisible = isVisible('people') || isVisible('milestone');

  return (
    <div className={styles.grid}>
      {firstColumnVisible && <div className={styles.column} data-home-column="actions-timeline">
        {isVisible('actions') && (
        <div data-home-route="home/actions" tabIndex={-1}>
        <DashboardCard title="What needs you" icon={<CheckmarkCircle20Filled />}>
          <div className={styles.list}>
            {props.plan.items.slice(0, 4).map((item, index) => (
              <button
                key={item.id}
                type="button"
                className={mergeClasses(styles.rowButton, index === 0 && styles.firstRow)}
                onClick={(event) => props.onNavigate(item.destination, event.currentTarget)}
              >
                <span className={styles.rowIcon} aria-hidden="true">{index + 1}</span>
                <span>
                  <Text block className={styles.rowTitle}>{item.title}</Text>
                  <Text size={200} block className={styles.rowSummary}>{item.reason}</Text>
                </span>
                <StatusBadge
                  label={item.dueAt ? formatTimeUntil(item.dueAt, props.now) : item.sourceLabel}
                  intent={statusIntentFor(item.priority)}
                />
              </button>
            ))}
          </div>
        </DashboardCard>
        </div>
        )}

        {isVisible('timeline') && (
        <div data-home-route="home/timeline" tabIndex={-1}>
        <DashboardCard title="Your month ahead" icon={<CalendarLtr20Regular />}>
          <div className={styles.list}>
            {props.data.timeline.slice(0, 4).map((item, index) => (
              <button
                key={item.id}
                type="button"
                className={mergeClasses(styles.rowButton, index === 0 && styles.firstRow)}
                onClick={(event) => props.onNavigate(item.destination, event.currentTarget)}
              >
                <span className={styles.rowIcon} aria-hidden="true"><Clock20Regular /></span>
                <span><Text block className={styles.rowTitle}>{item.title}</Text><Text size={200} block className={styles.rowSummary}>{item.summary}</Text></span>
                <Text size={200}>{formatShortDate(item.occursAt)}</Text>
              </button>
            ))}
          </div>
        </DashboardCard>
        </div>
        )}
      </div>}

      {secondColumnVisible && <div className={styles.column} data-home-column="snapshot-learning">
        {isVisible('snapshot') && (
        <div data-home-route="home/profile" tabIndex={-1}>
        <DashboardCard title="Your HR snapshot" icon={<Person20Regular />}>
          <div className={styles.snapshot}>
            <LeaveBalanceChart available={18} total={25} />
            <div className={styles.snapshotLines}>
              <div className={styles.snapshotLine}><Text>Benefits</Text><Text weight="semibold">3 active</Text></div>
              <div className={styles.snapshotLine}><Text>Latest pay</Text><Text weight="semibold">{formatZavaCurrency(5126, props.settings.currency, props.locale)}</Text></div>
              <div className={styles.snapshotLine}><Text>Policy set</Text><Text weight="semibold">{getJurisdictionLabel(props.settings.jurisdiction)}</Text></div>
            </div>
          </div>
        </DashboardCard>
        </div>
        )}

        {isVisible('learning') && (
        <DashboardCard title="Learning momentum" icon={<LearningApp20Regular />}>
          <div className={styles.learning}>
            <div className={styles.learningTop}>
              <span><Text block className={styles.rowTitle}>Required learning</Text><Text size={200} className={styles.muted}>6 of 7 complete</Text></span>
              <Text size={600} className={styles.percentage}>86%</Text>
            </div>
            <div className={styles.progress} aria-label="Learning progress 86 percent"><div className={styles.progressBar} /></div>
            {learning && (
              <button type="button" className={mergeClasses(styles.rowButton, styles.course, styles.firstRow)} onClick={(event) => props.onNavigate(learning.destination, event.currentTarget)}>
                <span className={styles.rowIcon} aria-hidden="true"><LearningApp20Regular /></span>
                <span><Text block className={styles.rowTitle}>{learning.title}</Text><Text size={200} block className={styles.rowSummary}>24 minutes · {learning.status}</Text></span>
                <Text size={200}>Continue</Text>
              </button>
            )}
          </div>
        </DashboardCard>
        )}
      </div>}

      {thirdColumnVisible && <div className={styles.column} data-home-column="people-milestone">
        {isVisible('people') && (
        <DashboardCard title="People around you" icon={<Organization20Regular />}>
          <div className={styles.people}>
            <Text size={200} block className={styles.peopleIntro}>Your manager, HR partner, and closest collaborator are one step away.</Text>
            <div className={styles.peopleGrid}>
              {closePeople.slice(0, 3).map((person) => (
                <div key={person.id} className={styles.person}>
                  <Avatar name={person.displayName} image={{ src: person.photoUrl }} size={48} />
                  <Text size={200} block className={styles.personName}>{person.firstName}</Text>
                  <Text size={100} block className={styles.muted}>{person.relationship}</Text>
                </div>
              ))}
            </div>
            {oneToOne && (
              <button type="button" className={mergeClasses(styles.rowButton, styles.oneToOne, styles.firstRow)} onClick={(event) => props.onNavigate(oneToOne.destination, event.currentTarget)}>
                <Avatar name={oneToOne.organizer.displayName} image={{ src: oneToOne.organizer.photoUrl }} size={36} />
                <span><Text block className={styles.rowTitle}>Your next one-to-one</Text><Text size={200} block className={styles.rowSummary}>{formatShortDate(oneToOne.start)} · {oneToOne.title}</Text></span>
                <Text size={200}>Prepare</Text>
              </button>
            )}
          </div>
        </DashboardCard>
        )}

        {isVisible('milestone') && milestone && (
          <section
            className={styles.milestone}
            aria-labelledby="milestone-heading"
            data-home-route="home/milestones"
            tabIndex={-1}
          >
            <div className={styles.milestoneCopy}>
              <Text size={100} block className={styles.milestoneKicker}>A moment worth celebrating</Text>
              <Text id="milestone-heading" size={500} block className={styles.milestoneTitle}>{milestone.title}</Text>
              <Text size={200} block className={styles.rowSummary}>{milestone.summary}</Text>
              <button type="button" className={styles.rowButton} onClick={(event) => props.onNavigate(milestone.destination, event.currentTarget)}>
                <span className={styles.rowIcon} aria-hidden="true"><Person20Regular /></span>
                <span><Text block className={styles.rowTitle}>View your story</Text><Text size={200} className={styles.rowSummary}>{formatShortDate(milestone.occursAt)}</Text></span>
              </button>
            </div>
            <img className={styles.milestoneImage} src={milestone.imageUrl} alt={`Megan Bowen: ${milestone.title}`} />
          </section>
        )}
      </div>}
    </div>
  );
};

export default HomeDashboardPanels;