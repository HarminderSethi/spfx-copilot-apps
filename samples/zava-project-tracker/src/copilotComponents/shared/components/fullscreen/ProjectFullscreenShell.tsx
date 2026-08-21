import * as React from 'react';

import { Text } from '@fluentui/react-text';
import {
  CheckmarkCircle20Filled,
  Dismiss20Regular,
  Settings20Regular
} from '@fluentui/react-icons';
import { makeStyles, mergeClasses } from '@griffel/react';
import { tokens } from '@fluentui/react-theme';

import { EMBEDDED_FACES } from '../../mockData/embeddedFaces';
import { PROJECT_INTENT_CATALOG } from '../../mockData/intentCatalog';
import { SCENARIOS } from '../../mockData/portfolioSeeds';
import type { ScenarioId } from '../../models/portfolioDomain';
import type { IIntentTransientState } from '../../models/intentInvocation';
import type { IIntentDefinition, IProjectIntentProperties, ProjectWorkspace } from '../../models/projectPortfolio';
import { MockProjectPortfolioDataService } from '../../services/MockProjectPortfolioDataService';
import FullscreenWorkspaceDashboard, { ContinuedContext } from './FullscreenWorkspaceDashboard';

export type OperationalWorkspace = Exclude<ProjectWorkspace, 'education'>;

export interface IProjectDestination {
  workspace: OperationalWorkspace;
  route: string;
  params?: IProjectIntentProperties;
}

const workspaceLabels: Readonly<Record<OperationalWorkspace, string>> = {
  'my-work': 'My Work',
  project: 'Project',
  portfolio: 'Portfolio',
  approvals: 'Decisions'
};

const workspaceOrder: ReadonlyArray<OperationalWorkspace> = ['my-work', 'project', 'portfolio', 'approvals'];
const defaultIntentByWorkspace: Readonly<Record<OperationalWorkspace, string>> = {
  'my-work': 'GetMyWorkSummary',
  project: 'GetProjectHealth',
  portfolio: 'GetPortfolioHealth',
  approvals: 'GetApprovalInbox'
};
const dataService = new MockProjectPortfolioDataService();

const useStyles = makeStyles({
  root: {
    width: '100%',
    minWidth: 0,
    minHeight: '640px',
    boxSizing: 'border-box',
    color: tokens.colorNeutralForeground1,
    backgroundColor: tokens.colorNeutralBackground2,
    fontFamily: tokens.fontFamilyBase
  },
  topAccent: {
    height: '5px',
    backgroundImage: `linear-gradient(90deg, ${tokens.colorBrandBackground} 0%, ${tokens.colorPaletteGreenBackground3} 58%, ${tokens.colorPaletteMarigoldBackground3} 100%)`
  },
  productBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    minHeight: '58px',
    boxSizing: 'border-box',
    padding: '12px 24px',
    backgroundColor: tokens.colorNeutralBackground1
  },
  productBarCompact: { padding: '10px 12px' },
  brand: { display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 },
  brandMark: {
    width: '32px',
    height: '32px',
    display: 'grid',
    placeItems: 'center',
    color: tokens.colorNeutralForegroundOnBrand,
    backgroundColor: tokens.colorBrandBackground,
    borderRadius: tokens.borderRadiusMedium,
    fontWeight: tokens.fontWeightBold
  },
  brandCopy: { display: 'flex', flexDirection: 'column', gap: '1px', minWidth: 0 },
  productActions: { display: 'flex', alignItems: 'center', gap: '8px' },
  iconButton: {
    width: '36px', height: '36px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    border: `1px solid ${tokens.colorNeutralStroke2}`, borderRadius: tokens.borderRadiusMedium,
    color: tokens.colorNeutralForeground2, backgroundColor: tokens.colorNeutralBackground1, cursor: 'pointer'
  },
  user: { display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '4px' },
  avatar: { width: '32px', height: '32px', borderRadius: tokens.borderRadiusCircular, objectFit: 'cover' },
  overline: { color: tokens.colorBrandForeground1, fontSize: tokens.fontSizeBase100, fontWeight: tokens.fontWeightBold },
  tabs: {
    display: 'flex',
    gap: '4px',
    padding: '0 24px',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    overflowX: 'auto',
    backgroundColor: tokens.colorNeutralBackground1
  },
  tabsCompact: { paddingLeft: '12px', paddingRight: '12px' },
  tab: {
    flexShrink: 0,
    padding: '11px 14px',
    border: 'none',
    borderBottom: '3px solid transparent',
    color: tokens.colorNeutralForeground2,
    backgroundColor: 'transparent',
    fontWeight: tokens.fontWeightSemibold,
    cursor: 'pointer'
  },
  tabSelected: { color: tokens.colorBrandForeground1, borderBottomColor: tokens.colorBrandStroke1 },
  contextGroup: { display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' },
  select: {
    minHeight: '34px', maxWidth: '260px', padding: '5px 30px 5px 9px', border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusMedium, color: tokens.colorNeutralForeground1, backgroundColor: tokens.colorNeutralBackground1
  },
  quietBadge: {
    display: 'inline-flex', alignItems: 'center', gap: '5px', minHeight: '28px', boxSizing: 'border-box',
    padding: '4px 8px', borderRadius: tokens.borderRadiusMedium, color: tokens.colorPaletteGreenForeground1,
    backgroundColor: tokens.colorPaletteGreenBackground2, fontSize: tokens.fontSizeBase100, fontWeight: tokens.fontWeightSemibold
  },
  canvas: { padding: '22px 24px 28px' },
  canvasDense: { paddingTop: '14px', paddingBottom: '18px' },
  routeHeading: { display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '16px' },
  heroLine: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' },
  title: { letterSpacing: '0', lineHeight: '1.12' },
  summary: { maxWidth: '720px', color: tokens.colorNeutralForeground2 },
  metricStrip: {
    display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '1px', marginBottom: '16px',
    overflow: 'hidden', border: `1px solid ${tokens.colorNeutralStroke2}`, borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorNeutralStroke2
  },
  metricStripCompact: { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' },
  metric: { minWidth: 0, padding: '11px 12px', backgroundColor: tokens.colorNeutralBackground1 },
  metricLabel: { color: tokens.colorNeutralForeground3 },
  metricValue: { marginTop: '3px', fontSize: tokens.fontSizeBase500, lineHeight: '24px', fontWeight: tokens.fontWeightSemibold },
  metricWarning: { color: tokens.colorPaletteDarkOrangeForeground1 },
  metricDanger: { color: tokens.colorPaletteRedForeground1 },
  metricPositive: { color: tokens.colorPaletteGreenForeground1 },
  mainGrid: { display: 'grid', gridTemplateColumns: 'minmax(0, 1.72fr) minmax(250px, .72fr)', gap: '16px', alignItems: 'start' },
  mainGridNarrow: { gridTemplateColumns: 'minmax(0, 1fr)' },
  focusSurface: {
    minWidth: 0, padding: '16px', border: `1px solid ${tokens.colorNeutralStroke2}`, borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorNeutralBackground1, boxShadow: tokens.shadow2
  },
  surfaceHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '12px' },
  content: { minWidth: 0 },
  decisionPanel: {
    minWidth: 0, overflow: 'hidden', border: `1px solid ${tokens.colorNeutralStroke2}`, borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorNeutralBackground1, boxShadow: tokens.shadow2
  },
  decisionHeader: {
    display: 'flex', gap: '8px', alignItems: 'flex-start', padding: '14px', color: tokens.colorNeutralForegroundOnBrand,
    backgroundColor: tokens.colorBrandBackground
  },
  decisionCopy: { display: 'flex', flexDirection: 'column', gap: '3px', minWidth: 0 },
  decisionBody: { display: 'flex', flexDirection: 'column', padding: '8px 14px 14px' },
  threadStep: {
    width: '100%', display: 'grid', gridTemplateColumns: '22px minmax(0, 1fr) 20px', gap: '8px', alignItems: 'center',
    padding: '10px 0', border: 'none', borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    textAlign: 'left', color: tokens.colorNeutralForeground1, backgroundColor: 'transparent', cursor: 'pointer'
  },
  threadIndex: {
    width: '22px', height: '22px', display: 'grid', placeItems: 'center', borderRadius: tokens.borderRadiusCircular,
    color: tokens.colorBrandForeground1, backgroundColor: tokens.colorBrandBackground2, fontSize: tokens.fontSizeBase100, fontWeight: tokens.fontWeightBold
  },
  threadActive: { color: tokens.colorNeutralForegroundOnBrand, backgroundColor: tokens.colorBrandBackground },
  threadText: { display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 },
  consequence: {
    display: 'grid', gridTemplateColumns: '20px minmax(0, 1fr)', gap: '7px', marginTop: '12px', padding: '10px',
    color: tokens.colorPaletteDarkOrangeForeground1, backgroundColor: tokens.colorPaletteMarigoldBackground2, borderRadius: tokens.borderRadiusMedium
  },
  settingsOverlay: { position: 'fixed', inset: 0, zIndex: 20, backgroundColor: 'rgba(0, 0, 0, .32)' },
  settingsPanel: {
    position: 'absolute', top: 0, right: 0, width: 'min(360px, 92vw)', height: '100%', boxSizing: 'border-box',
    display: 'flex', flexDirection: 'column', gap: '18px', padding: '22px', color: tokens.colorNeutralForeground1,
    backgroundColor: tokens.colorNeutralBackground1, boxShadow: tokens.shadow64
  },
  settingsHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  checkField: { display: 'flex', alignItems: 'center', gap: '8px' },
  footer: {
    display: 'flex', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap', padding: '12px 24px',
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`, color: tokens.colorNeutralForeground3, backgroundColor: tokens.colorNeutralBackground1
  }
});

export interface IProjectFullscreenShellProps {
  initialDefinition: IIntentDefinition;
  initialProperties: IProjectIntentProperties;
  propertiesVersion?: number;
  transientState?: IIntentTransientState;
  currentUserName: string;
  currentUserImageUrl?: string;
  containerWidth?: number;
}

const ProjectFullscreenShell: React.FunctionComponent<IProjectFullscreenShellProps> = (props) => {
  const styles = useStyles();
  const initialWorkspace = props.initialDefinition.workspace as OperationalWorkspace;
  const [activeWorkspace, setActiveWorkspace] = React.useState<OperationalWorkspace>(initialWorkspace);
  const [activeDefinition, setActiveDefinition] = React.useState<IIntentDefinition>(props.initialDefinition);
  const requestedScenario = String(props.initialProperties.scenario || 'leadership-demo') as ScenarioId;
  const [scenarioId, setScenarioId] = React.useState<ScenarioId>(SCENARIOS.some((item) => item.id === requestedScenario) ? requestedScenario : 'leadership-demo');
  const [currency, setCurrency] = React.useState('USD');
  const [dense, setDense] = React.useState(false);
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const settingsHeadingRef = React.useRef<HTMLHeadingElement>(null);
  const settingsButtonRef = React.useRef<HTMLButtonElement>(null);
  const dashboardRef = React.useRef<HTMLElement>(null);
  const tabRefs = React.useRef<Partial<Record<OperationalWorkspace, HTMLButtonElement | null>>>({});
  const compact = props.containerWidth !== undefined && props.containerWidth <= 520;
  const experience = React.useMemo(() => dataService.getExperience(new Date(), scenarioId), [scenarioId]);
  const avatarUrl = props.currentUserImageUrl || EMBEDDED_FACES['Megan-Bowen'];

  React.useEffect(() => {
    if (settingsOpen) settingsHeadingRef.current?.focus();
  }, [settingsOpen]);

  React.useEffect(() => {
    setActiveWorkspace(props.initialDefinition.workspace as OperationalWorkspace);
    setActiveDefinition(props.initialDefinition);
  }, [props.initialDefinition, props.propertiesVersion]);

  const selectIntent = (intentKey: string, focusHeading = true): void => {
    const nextDefinition = PROJECT_INTENT_CATALOG.find((definition) => definition.key === intentKey);
    if (!nextDefinition) return;
    setActiveWorkspace(nextDefinition.workspace as OperationalWorkspace);
    setActiveDefinition(nextDefinition);
    if (focusHeading) setTimeout(() => dashboardRef.current?.focus(), 0);
  };
  const selectWorkspace = (workspace: OperationalWorkspace): void => {
    if (workspace === initialWorkspace) {
      selectIntent(props.initialDefinition.key);
      return;
    }
    selectIntent(defaultIntentByWorkspace[workspace]);
  };
  const closeSettings = (): void => {
    setSettingsOpen(false);
    settingsButtonRef.current?.focus();
  };
  const handleTabKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, workspace: OperationalWorkspace): void => {
    const currentIndex = workspaceOrder.indexOf(workspace);
    let nextIndex: number | undefined;
    if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % workspaceOrder.length;
    if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + workspaceOrder.length) % workspaceOrder.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = workspaceOrder.length - 1;
    if (nextIndex === undefined) return;
    event.preventDefault();
    const nextWorkspace = workspaceOrder[nextIndex];
    selectWorkspace(nextWorkspace);
    tabRefs.current[nextWorkspace]?.focus();
  };

  return <section className={styles.root} data-layout="project-fullscreen-shell" data-workspace={activeWorkspace} data-route={activeDefinition.route} data-properties-version={props.propertiesVersion || 0} data-has-transient-state={Object.keys(props.transientState || {}).length > 0 ? 'true' : 'false'}>
    <div className={styles.topAccent} aria-hidden="true"/>
    <header className={mergeClasses(styles.productBar, compact && styles.productBarCompact)}>
      <div className={styles.brand}><span className={styles.brandMark}>Z</span><div className={styles.brandCopy}><Text size={400} weight="semibold">{compact ? 'Zava AI Portfolio' : 'Zava AI Project Portfolio'}</Text>{!compact && <Text size={100}>Leadership decision workspace</Text>}</div></div>
      <div className={styles.productActions}>
        <span className={styles.quietBadge} aria-label="Mock data / offline" title="Mock data / offline"><CheckmarkCircle20Filled aria-hidden="true"/>{!compact && 'Mock data / offline'}</span>
        <button ref={settingsButtonRef} className={styles.iconButton} type="button" aria-label="Settings" title="Settings" onClick={() => setSettingsOpen(true)}><Settings20Regular aria-hidden="true"/></button>
        <div className={styles.user} title={props.currentUserName}><img className={styles.avatar} src={avatarUrl} alt=""/>{!compact && <Text size={200}>{props.currentUserName}</Text>}</div>
      </div>
    </header>
    <nav className={mergeClasses(styles.tabs, compact && styles.tabsCompact)} role="tablist" aria-label="Project portfolio workspaces">
      {workspaceOrder.map((workspace) => <button ref={(element) => { tabRefs.current[workspace] = element; }} type="button" role="tab" aria-selected={activeWorkspace === workspace} tabIndex={activeWorkspace === workspace ? 0 : -1} className={mergeClasses(styles.tab, activeWorkspace === workspace && styles.tabSelected)} key={workspace} onClick={() => selectWorkspace(workspace)} onKeyDown={(event) => handleTabKeyDown(event, workspace)}>{workspaceLabels[workspace]}</button>)}
    </nav>
    <main ref={dashboardRef} tabIndex={-1} aria-label={`${workspaceLabels[activeWorkspace]} dashboard`} className={mergeClasses(styles.canvas, dense && styles.canvasDense)}>
      <ContinuedContext state={props.transientState}/><FullscreenWorkspaceDashboard key={`${props.initialDefinition.key}:${props.propertiesVersion || 0}`} workspace={activeWorkspace} activeDefinition={props.initialDefinition} initialProperties={props.initialProperties} currentUserName={props.currentUserName} containerWidth={props.containerWidth} experience={experience} currency={currency} onSelectIntent={selectIntent} transientState={props.transientState}/>
    </main>
    <footer className={styles.footer}><Text size={100}>Sample data / no external writes / updated from a deterministic project portfolio model</Text><Text size={100}>As of {experience.asOf.toLocaleDateString()}</Text></footer>
    {settingsOpen && <div className={styles.settingsOverlay} role="presentation" onKeyDown={(event) => { if (event.key === 'Escape') closeSettings(); }} onMouseDown={(event) => { if (event.target === event.currentTarget) closeSettings(); }}><section className={styles.settingsPanel} role="dialog" aria-modal="true" aria-labelledby="settings-title"><div className={styles.settingsHeader}><Text ref={settingsHeadingRef} tabIndex={-1} as="h2" id="settings-title" size={600} weight="semibold">Workspace settings</Text><button className={styles.iconButton} type="button" aria-label="Close settings" onClick={closeSettings}><Dismiss20Regular aria-hidden="true"/></button></div><label className={styles.field}><Text size={200} weight="semibold">Demo scenario</Text><select className={styles.select} aria-label="Demo scenario" value={scenarioId} onChange={(event) => setScenarioId(event.currentTarget.value as ScenarioId)}>{SCENARIOS.map((scenario) => <option key={scenario.id} value={scenario.id}>{scenario.title}</option>)}</select></label><label className={styles.field}><Text size={200} weight="semibold">Currency</Text><select className={styles.select} value={currency} onChange={(event) => setCurrency(event.currentTarget.value)}><option value="USD">USD</option><option value="EUR">EUR</option><option value="JPY">JPY</option></select></label><label className={styles.checkField}><input type="checkbox" checked={dense} onChange={(event) => setDense(event.currentTarget.checked)}/><Text size={200}>Compact workspace density</Text></label><Text size={100}>Settings apply to this browser session only. Scenario controls never write to the approved baseline.</Text></section></div>}
  </section>;
};

export default ProjectFullscreenShell;