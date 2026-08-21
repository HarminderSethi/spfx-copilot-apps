import * as React from 'react';

import { Text } from '@fluentui/react-text';
import { makeStyles } from '@griffel/react';
import { tokens } from '@fluentui/react-theme';
import type { ISPCopilotContainerDimensions } from '@microsoft/sp-copilot-component';

import type {
  IZavaDestination,
  IZavaUser
} from '../../shared/models/zavaEmployee';
import type { ZavaFamilyId } from '../../shared/models/families';
import { MockZavaEmployeeDataService } from '../../shared/services/MockZavaEmployeeDataService';
import { useZavaSettings } from '../../shared/hooks/useZavaSettings';
import type { INormalizedHomeProperties } from '../normalizeHomeProperties';
import { buildHrActionPlan } from '../services/buildHrActionPlan';
import { selectVisibleSignals } from './inline/homeDataSelectors';
import DestinationDetail from './fullscreen/DestinationDetail';
import PersonalizedHero from '../../shared/components/PersonalizedHero';
import HomeDashboardPanels from './fullscreen/HomeDashboardPanels';
import MyHrActionPlanPanel from './fullscreen/MyHrActionPlanPanel';
import PriorityBanner from './fullscreen/PriorityBanner';
import {
  ChromeBody,
  FamilyNavigation,
  ProductBar
} from './fullscreen/ProductChrome';
import SettingsSummaryPanel from './fullscreen/SettingsSummaryPanel';
import FamilyPlaceholderView from './fullscreen/FamilyPlaceholderView';
import { getHomeRouteSelector } from '../homeIntentRoutes';
import { isZavaManager } from '../../shared/utils/roles';
import { PolicyDashboard } from '../../policyAnswer/PolicyExperience';
import { ConfiguredFamilyDashboard } from '../../shared/experiences/ConfiguredFamilyExperience';

const dataService = new MockZavaEmployeeDataService();

type OpenPanel = 'none' | 'plan' | 'settings';

const useStyles = makeStyles({
  root: {
    width: '100%',
    height: '100%',
    minHeight: 0,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: tokens.colorNeutralBackground2,
    fontFamily: tokens.fontFamilyBase
  },
  workspace: {
    position: 'relative',
    minWidth: 0,
    minHeight: 0,
    display: 'flex',
    overflow: 'hidden'
  },
  main: {
    minWidth: 0,
    minHeight: 0,
    flexGrow: 1,
    overflowY: 'auto'
  },
  canvas: {
    width: '100%',
    maxWidth: '1370px',
    margin: '0 auto',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
    padding: '24px 26px 18px',
    '@media (min-width: 1728px)': { maxWidth: '1500px' },
    '@media (min-width: 2160px)': { maxWidth: '1740px' },
    '@media (max-width: 760px)': { padding: '18px 12px 14px' }
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    flexWrap: 'wrap',
    color: tokens.colorNeutralForeground3,
    textAlign: 'center'
  },
  footerDot: { color: tokens.colorNeutralForeground4 }
});

export interface IZavaDashboardShellProps {
  properties: INormalizedHomeProperties;
  propertiesVersion: number;
  currentUser: IZavaUser;
  containerDimensions?: ISPCopilotContainerDimensions;
  initialFamily?: ZavaFamilyId;
  initialRoute?: string;
  initialParams?: Record<string, string | number | boolean | string[]>;
}

const ZavaDashboardShell: React.FunctionComponent<IZavaDashboardShellProps> = (props) => {
  const styles = useStyles();
  const [openPanel, setOpenPanel] = React.useState<OpenPanel>('none');
  const [destination, setDestination] = React.useState<IZavaDestination | undefined>();
  const [activeFamily, setActiveFamily] = React.useState<ZavaFamilyId>(props.initialFamily || 'home');
  const { settings, updateSettings, toggleHomePanel } = useZavaSettings();
  const now = React.useMemo(() => new Date(), [props.propertiesVersion]);
  const data = React.useMemo(() => ({
    ...dataService.getEmployeeExperience(now),
    user: props.currentUser
  }), [now, props.currentUser]);
  const effectiveProperties = React.useMemo(() => ({
    ...props.properties,
    privacyLevel: props.properties.privacyLevel === 'standard'
      ? settings.privacyLevel
      : props.properties.privacyLevel
  }), [props.properties, settings.privacyLevel]);
  const visibleSignals = React.useMemo(
    () => selectVisibleSignals(data.signals, effectiveProperties, now)
      .filter((signal) => signal.family !== 'team' || isZavaManager(data.user)),
    [data.signals, data.user, effectiveProperties, now]
  );
  const plan = React.useMemo(
    () => buildHrActionPlan(
      visibleSignals,
      data.user,
      now,
      effectiveProperties.privacyLevel,
      effectiveProperties.includeSensitive
    ),
    [data.user, effectiveProperties.includeSensitive, effectiveProperties.privacyLevel, now, visibleSignals]
  );
  const planButtonRef = React.useRef<HTMLButtonElement>(null);
  const settingsButtonRef = React.useRef<HTMLButtonElement>(null);
  const returnFocusRef = React.useRef<HTMLButtonElement | null>(null);
  const destinationReturnFocusRef = React.useRef<HTMLButtonElement | null>(null);
  const detailRef = React.useRef<HTMLDivElement>(null);
  const familyViewRef = React.useRef<HTMLDivElement>(null);
  const mainRef = React.useRef<HTMLElement>(null);
  const previousPropertiesVersion = React.useRef(props.propertiesVersion);

  React.useEffect(() => {
    if (previousPropertiesVersion.current !== props.propertiesVersion) {
      setActiveFamily(props.initialFamily || 'home');
      setDestination(undefined);
      setOpenPanel('none');
      previousPropertiesVersion.current = props.propertiesVersion;
    }
  }, [props.initialFamily, props.propertiesVersion]);

  React.useEffect(() => {
    if ((props.initialFamily || 'home') !== 'home') {
      return;
    }
    const selector = getHomeRouteSelector(props.initialRoute);
    if (selector) {
      window.setTimeout(() => mainRef.current?.querySelector<HTMLElement>(selector)?.focus(), 0);
    }
  }, [props.initialFamily, props.initialRoute, props.propertiesVersion]);

  const open = (panel: Exclude<OpenPanel, 'none'>, trigger: HTMLButtonElement | null): void => {
    returnFocusRef.current = trigger;
    setOpenPanel(panel);
  };

  const closePanel = (): void => {
    setOpenPanel('none');
    window.setTimeout(() => returnFocusRef.current?.focus(), 0);
  };

  const navigate = (
    nextDestination: IZavaDestination,
    trigger?: HTMLButtonElement | null
  ): void => {
    if (nextDestination.family !== 'home') {
      setDestination(undefined);
      setOpenPanel('none');
      setActiveFamily(nextDestination.family);
      window.setTimeout(() => familyViewRef.current?.focus(), 0);
      return;
    }
    destinationReturnFocusRef.current = trigger ||
      (openPanel === 'plan' ? planButtonRef.current : null);
    setDestination(nextDestination);
    setOpenPanel('none');
    window.setTimeout(() => detailRef.current?.focus(), 0);
  };

  const nextMoment = plan.items[0]?.title || 'You are all caught up';
  const panelWidth = props.containerDimensions?.width || props.containerDimensions?.maxWidth;
  const modalPanel = panelWidth !== undefined && panelWidth <= 860;

  const closeDestination = (): void => {
    setDestination(undefined);
    window.setTimeout(() => destinationReturnFocusRef.current?.focus(), 0);
  };

  const selectFamily = (family: ZavaFamilyId, trigger?: HTMLElement): void => {
    setOpenPanel('none');
    setDestination(undefined);
    setActiveFamily(family);
    if (family !== 'home') {
      window.setTimeout(() => familyViewRef.current?.focus(), 0);
    } else if (trigger instanceof HTMLElement) {
      window.setTimeout(() => trigger.focus(), 0);
    }
  };

  return (
    <div
      className={styles.root}
      data-display-mode="fullscreen"
      data-home-view={props.properties.view}
      data-container-width={props.containerDimensions?.width}
      data-initial-family={props.initialFamily || 'home'}
      data-initial-route={props.initialRoute}
      data-initial-params={props.initialParams ? JSON.stringify(props.initialParams) : undefined}
    >
      <ProductBar
        activeFamily={activeFamily}
        settingsButtonRef={settingsButtonRef}
        onOpenSettings={() => open('settings', settingsButtonRef.current)}
      />
      <ChromeBody>
        <FamilyNavigation activeFamily={activeFamily} onSelectFamily={selectFamily} />
        <div className={styles.workspace}>
          <main ref={mainRef} className={styles.main}>
            <div className={styles.canvas} data-active-family={activeFamily}>
              {activeFamily === 'home' ? (
                <>
              <PersonalizedHero
                user={data.user}
                metrics={data.metrics}
                now={now}
                nextMoment={nextMoment}
              />
              <PriorityBanner
                plan={plan}
                people={data.people.filter((person) => person.relationship !== 'self')}
                triggerRef={planButtonRef}
                onOpen={() => open('plan', planButtonRef.current)}
              />
              {destination && (
                <DestinationDetail
                  destination={destination}
                  data={data}
                  detailRef={detailRef}
                  onDismiss={closeDestination}
                />
              )}
              <HomeDashboardPanels
                data={data}
                plan={plan}
                now={now}
                settings={settings}
                locale={props.properties.locale}
                onNavigate={navigate}
              />
              <footer className={styles.footer}>
                <Text size={200}>Zava Employee Agent</Text>
                <span className={styles.footerDot}>·</span>
                <Text size={200}>Mock data · Offline</Text>
                <span className={styles.footerDot}>·</span>
                <Text size={200}>Work IQ-shaped employee experience</Text>
              </footer>
                </>
              ) : activeFamily === 'policy' ? (
                <PolicyDashboard user={data.user} viewRef={familyViewRef} />
              ) : activeFamily === 'time' ? (
                <ConfiguredFamilyDashboard family="time" user={data.user} initialParams={props.initialParams} viewRef={familyViewRef} />
              ) : activeFamily === 'money' ? (
                <ConfiguredFamilyDashboard family="money" user={data.user} initialParams={props.initialParams} viewRef={familyViewRef} />
              ) : activeFamily === 'benefits' ? (
                <ConfiguredFamilyDashboard family="benefits" user={data.user} initialParams={props.initialParams} viewRef={familyViewRef} />
              ) : activeFamily === 'support' ? (
                <ConfiguredFamilyDashboard family="support" user={data.user} initialParams={props.initialParams} viewRef={familyViewRef} />
              ) : activeFamily === 'learning' ? (
                <ConfiguredFamilyDashboard family="learning" user={data.user} initialParams={props.initialParams} viewRef={familyViewRef} />
              ) : activeFamily === 'rewards' ? (
                <ConfiguredFamilyDashboard family="rewards" user={data.user} initialParams={props.initialParams} viewRef={familyViewRef} />
              ) : activeFamily === 'team' ? (
                <ConfiguredFamilyDashboard family="team" user={data.user} initialParams={props.initialParams} viewRef={familyViewRef} />
              ) : activeFamily === 'people' ? (
                <ConfiguredFamilyDashboard family="people" user={data.user} initialParams={props.initialParams} viewRef={familyViewRef} />
              ) : (
                <FamilyPlaceholderView
                  family={activeFamily}
                  user={data.user}
                  now={now}
                  viewRef={familyViewRef}
                />
              )}
            </div>
          </main>
          {openPanel === 'plan' && (
            <MyHrActionPlanPanel
              plan={plan}
              isModal={modalPanel}
              onDismiss={closePanel}
              onNavigate={(nextDestination) => navigate(nextDestination, planButtonRef.current)}
            />
          )}
          {openPanel === 'settings' && (
            <SettingsSummaryPanel
              settings={settings}
              onSettingsChange={updateSettings}
              onToggleHomePanel={toggleHomePanel}
              isModal={modalPanel}
              onDismiss={closePanel}
            />
          )}
        </div>
      </ChromeBody>
    </div>
  );
};

export default ZavaDashboardShell;