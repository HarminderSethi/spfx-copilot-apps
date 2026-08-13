import * as React from 'react';

import { makeStyles, mergeClasses } from '@griffel/react';
import { tokens } from '@fluentui/react-theme';
import type {
  ISPCopilotContainerDimensions,
  SPCopilotDisplayMode
} from '@microsoft/sp-copilot-component';

import type { IZavaUser } from '../../shared/models/zavaEmployee';
import { MockZavaEmployeeDataService } from '../../shared/services/MockZavaEmployeeDataService';
import { fadeIn } from '../../shared/utils/motion';
import { isZavaManager } from '../../shared/utils/roles';
import type { HomeView, INormalizedHomeProperties } from '../normalizeHomeProperties';
import {
  selectTimelineForPeriod,
  selectVisibleSignals
} from './inline/homeDataSelectors';
import HomeSummary from './inline/HomeSummary';
import {
  ActionsView,
  MilestonesView,
  ProfileView,
  TimelineView
} from './inline/HomeVariantViews';
import { canRequestFullscreen, resolveInlineViewForVersion } from './inline/inlineViewState';

const dataService = new MockZavaEmployeeDataService();

const useStyles = makeStyles({
  surface: {
    width: '100%',
    minWidth: 0,
    boxSizing: 'border-box',
    padding: '12px',
    backgroundColor: tokens.colorNeutralBackground2,
    fontFamily: tokens.fontFamilyBase
  },
  compact: { padding: '8px' },
  enter: {
    animationName: fadeIn,
    animationDuration: tokens.durationSlow,
    animationTimingFunction: tokens.curveDecelerateMid,
    animationFillMode: 'both',
    '@media (prefers-reduced-motion: reduce)': { animationName: 'none', animationDuration: '1ms' }
  }
});

export interface IHomeInlineProps {
  properties: INormalizedHomeProperties;
  propertiesVersion: number;
  currentUser: IZavaUser;
  availableDisplayModes?: SPCopilotDisplayMode[];
  containerDimensions?: ISPCopilotContainerDimensions;
  onRequestFullscreen?: () => void;
  fixedView?: HomeView;
}

const HomeInline: React.FunctionComponent<IHomeInlineProps> = (props) => {
  const styles = useStyles();
  const requestedView = props.fixedView || props.properties.view;
  const [view, setView] = React.useState<HomeView>(requestedView);
  const previousVersion = React.useRef(props.propertiesVersion);

  React.useEffect(() => {
    setView((currentView) => resolveInlineViewForVersion(
      currentView,
      requestedView,
      previousVersion.current,
      props.propertiesVersion
    ));
    previousVersion.current = props.propertiesVersion;
  }, [props.propertiesVersion, requestedView]);

  const now = React.useMemo(() => new Date(), [props.propertiesVersion]);
  const data = React.useMemo(() => ({
    ...dataService.getEmployeeExperience(now),
    user: props.currentUser
  }), [now, props.currentUser]);
  const signals = React.useMemo(
    () => selectVisibleSignals(data.signals, props.properties, now)
      .filter((signal) => signal.family !== 'team' || isZavaManager(data.user)),
    [data.signals, data.user, now, props.properties]
  );
  const timeline = React.useMemo(
    () => selectTimelineForPeriod(
      data.timeline,
      props.properties.period,
      now,
      props.properties.focusArea
    ),
    [data.timeline, now, props.properties.focusArea, props.properties.period]
  );
  const supportsFullscreen = canRequestFullscreen(props.availableDisplayModes);
  const width = props.containerDimensions?.width || props.containerDimensions?.maxWidth;
  const compact = width !== undefined && width < 360;
  const back = props.fixedView ? undefined : (): void => setView('summary');
  const expand = supportsFullscreen ? props.onRequestFullscreen : undefined;

  let content: React.ReactNode;
  switch (view) {
    case 'profile':
      content = <ProfileView data={data} onBack={back} onRequestFullscreen={expand} />;
      break;
    case 'actions':
      content = <ActionsView data={data} signals={signals} now={now} onBack={back} onRequestFullscreen={expand} />;
      break;
    case 'timeline':
      content = <TimelineView data={data} timeline={timeline} locale={props.properties.locale} onBack={back} onRequestFullscreen={expand} />;
      break;
    case 'milestones':
      content = <MilestonesView data={data} onBack={back} onRequestFullscreen={expand} />;
      break;
    default:
      content = (
        <HomeSummary
          data={data}
          signals={signals}
          timeline={timeline}
          period={props.properties.period}
          now={now}
          onNavigate={props.fixedView ? undefined : setView}
          onRequestFullscreen={expand}
        />
      );
      break;
  }

  return (
    <div
      className={mergeClasses(styles.surface, compact && styles.compact)}
      data-display-mode="inline"
      data-home-view={view}
      data-home-intent={props.fixedView || undefined}
      data-container-size={compact ? 'compact' : 'standard'}
    >
      {view === 'summary' ? content : <div key={view} className={styles.enter}>{content}</div>}
    </div>
  );
};

export default HomeInline;