import * as React from 'react';
import { Badge, Button, Select } from '@fluentui/react-components';
import { CheckmarkCircle20Filled, Warning20Regular } from '@fluentui/react-icons';

import { PERSONA_MEDIA, PERSONA_MEDIA_BY_NAME, SURFACE_PRODUCT_MEDIA } from '../assets/mediaCatalog';
import { buildAgeCohorts, buildFleetCells, buildSpendBridge, buildTicketTrend, buildTopIssues, getDeviceHealth } from '../data/analytics';
import { DEPARTMENTS, MOCK_GRAPH, REGIONS } from '../data/mockData';
import type { IMetricPoint } from '../data/models';
import { getIntentDefinition } from '../intents/intentCatalog';
import type { IIntentDefinition } from '../intents/intentCatalog';
import { BabylonChart } from '../ui/babylon/BabylonChart';
import { buildChartModel } from '../ui/babylon/chartModels';
import { OperationPanel } from '../ui/OperationPanel';
import { EstateRiskMap } from './EstateRiskMap';
import { getTimeAwareGreeting } from './greeting';

import styles from './DashboardViews.module.scss';

export interface IDashboardViewProps {
  readonly isDark: boolean;
  readonly ownerWindow: Window | undefined;
  readonly originIntent: IIntentDefinition;
  readonly properties: Readonly<Record<string, unknown>>;
}

function money(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
}

function DashboardKpis(props: { readonly items: readonly { readonly label: string; readonly value: string; readonly detail: string; readonly tone?: string }[] }): React.ReactElement {
  return <div className={styles.kpiRow}>{props.items.map((item) => <div data-tone={item.tone} key={item.label}><span>{item.label}</span><strong>{item.value}</strong><small>{item.detail}</small></div>)}</div>;
}

function HorizontalBars(props: { readonly ariaLabel: string; readonly points: readonly IMetricPoint[]; readonly valueSuffix?: string }): React.ReactElement {
  const maximum = Math.max(...props.points.map((point) => point.value), 1);
  return (
    <div className={styles.horizontalBars} role="img" aria-label={props.ariaLabel}>
      {props.points.map((point) => <div key={point.id}><span>{point.label}</span><i><b style={{ width: `${Math.max(4, point.value / maximum * 100)}%` }} /></i><strong>{point.value}{props.valueSuffix}</strong></div>)}
    </div>
  );
}

function TicketColumns(): React.ReactElement {
  const points = buildTicketTrend(MOCK_GRAPH);
  const maximum = Math.max(...points.map((point) => point.value), 1);
  return (
    <div className={styles.ticketColumns} role="img" aria-label="Six-month IT ticket volume and deflection trend">
      {points.map((point) => <div key={point.id}><span><i style={{ height: `${Math.max(12, point.value / maximum * 100)}%` }} /></span><strong>{point.value}</strong><small>{point.label}</small><b aria-label={`${point.secondaryValue}% deflected`} title={`${point.secondaryValue}% deflected`}>{point.secondaryValue}%</b></div>)}
    </div>
  );
}

function OriginContext(props: IDashboardViewProps): React.ReactElement {
  const propertyKeys = Object.keys(props.properties).filter((key) => props.properties[key] !== undefined);
  return (
    <div className={styles.originContext}>
      <span>Opened from conversation</span>
      <strong>{props.originIntent.title}</strong>
      {propertyKeys.length > 0 && <small>{propertyKeys.map((key) => `${key}: ${String(props.properties[key])}`).join(' / ')}</small>}
    </div>
  );
}

export function PersonalDashboard(props: IDashboardViewProps): React.ReactElement {
  const graph = MOCK_GRAPH;
  const device = graph.devices.find((item) => item.ownerId === 'megan') ?? graph.devices[0];
  const sku = graph.surfaceCatalog.find((item) => item.id === device.skuId) ?? graph.surfaceCatalog[0];
  const laptopMedia = SURFACE_PRODUCT_MEDIA[sku.id];
  const proMedia = SURFACE_PRODUCT_MEDIA['surface-pro-13'];
  const chartModel = React.useMemo(() => buildChartModel(getIntentDefinition('MyDeviceStatus')), []);
  const [selectedId, setSelectedId] = React.useState(chartModel.marks[0]?.id);
  const [showIssueForm, setShowIssueForm] = React.useState(props.originIntent.name === 'ReportItIssue');
  const activeRequests = graph.requests.filter((request) => request.requesterId === 'megan');
  const greeting = getTimeAwareGreeting();

  return (
    <div className={styles.dashboard} data-dashboard="personal">
      <section className={styles.dashboardLead}>
        <div className={styles.heroIdentity}><img src={PERSONA_MEDIA.megan.src} alt={PERSONA_MEDIA.megan.alt} /><div><span>Personal IT</span><h1>{greeting.text}, Megan. Your work setup is ready, with one battery risk to plan around.</h1><p>Device health, support, requests, and next-device options in one workspace.</p></div></div>
        <OriginContext {...props} />
      </section>
      <DashboardKpis items={[
        { label: 'Overall health', value: `${getDeviceHealth(device)}%`, detail: 'Battery is below target', tone: 'attention' },
        { label: 'Compliance', value: device.compliant ? 'Current' : 'Action needed', detail: 'Checked today at 8:20 AM', tone: 'positive' },
        { label: 'Open requests', value: '3', detail: 'One awaiting manager review' },
        { label: 'Refresh eligibility', value: 'Nov 5', detail: '74 days remaining' }
      ]} />

      <section className={styles.personalHero}>
        <div className={styles.deviceOverview}>
          <div className={styles.deviceImage}>{laptopMedia && <img src={laptopMedia.src} alt={laptopMedia.alt} />}</div>
          <div className={styles.deviceIdentity}><span>Your primary device</span><h2>{sku.name}</h2><p>{device.id} / {sku.memoryGb} GB / {sku.storageGb} GB / Windows 11 Enterprise</p><div><Badge appearance="tint" className={`${styles.deviceBadge} ${styles.deviceBadgeSuccess}`} color="success">Compliant</Badge><Badge appearance="outline" className={styles.deviceBadge}>Warranty active</Badge></div></div>
          <div className={styles.personalChart}><BabylonChart model={chartModel} isDark={props.isDark} selectedId={selectedId} onSelect={setSelectedId} /></div>
        </div>
        <aside className={styles.supportHub}>
          <span>Support center</span><h2>How can IT help?</h2><p>Start with the right path. Nothing is submitted until you review and confirm.</p>
          <div className={styles.supportActions}><Button appearance="primary" aria-pressed={showIssueForm} className={`${styles.supportAction} ${showIssueForm ? styles.supportActionActive : ''}`} onClick={() => setShowIssueForm(true)}>Report an issue</Button><Button aria-pressed={!showIssueForm} className={`${styles.supportAction} ${!showIssueForm ? styles.supportActionActive : ''}`} onClick={() => setShowIssueForm(false)}>Run diagnostics</Button></div>
          {showIssueForm
            ? <OperationPanel compact key="personal-issue" intent={getIntentDefinition('ReportItIssue')} isDark={props.isDark} ownerWindow={props.ownerWindow} properties={props.properties} />
            : <div className={styles.diagnosticSummary}><CheckmarkCircle20Filled /><span><strong>3 of 4 checks healthy</strong><small>Battery capacity is the only finding. No self-heal runs without review.</small></span></div>}
        </aside>
      </section>

      <section className={styles.personalGrid}>
        <div className={styles.dashboardSection}><div className={styles.sectionHeading}><div><span>Work in motion</span><h2>Requests and delivery</h2></div><b>3 active</b></div><ol className={styles.timeline}><li data-state="complete"><span>Device configured</span><b>32 GB / 512 GB</b></li><li data-state="active"><span>Manager review</span><b>Diego Siciliani</b></li><li><span>Fulfillment</span><b>Starts after approval</b></li><li><span>USB4 Dock delivery</span><b>Expected in 2 days</b></li></ol>{activeRequests.length > 0 && <small className={styles.dataNote}>Request {activeRequests[0].id} carries four evidence sources and remains within policy.</small>}</div>
        <div className={styles.dashboardSection}><div className={styles.sectionHeading}><div><span>Continuity</span><h2>Device health detail</h2></div><b>1 attention</b></div><HorizontalBars ariaLabel="Device health dimensions" valueSuffix="%" points={[{ id: 'battery', label: 'Battery', value: device.batteryScore }, { id: 'storage', label: 'Storage', value: device.storageScore }, { id: 'performance', label: 'Performance', value: device.performanceScore }, { id: 'patch', label: 'Patch', value: device.patchScore }]} /><p className={styles.insightLine}><Warning20Regular />Estimated runtime is 2 h 15 m. Stay docked for today’s customer workshop.</p></div>
        <div className={styles.dashboardSection}><div className={styles.sectionHeading}><div><span>Next device</span><h2>Role-aligned Surface options</h2></div><b>Policy approved</b></div><div className={styles.productPair}><div>{laptopMedia && <img src={laptopMedia.src} alt="" />}<span><strong>Surface Laptop 13.8-inch</strong><small>Best hybrid fit / {money(1699)}</small></span></div><div>{proMedia && <img src={proMedia.src} alt="" />}<span><strong>Surface Pro 13-inch</strong><small>Premium mobility / {money(1899)}</small></span></div></div></div>
      </section>
    </div>
  );
}

export function TeamDashboard(props: IDashboardViewProps): React.ReactElement {
  const graph = MOCK_GRAPH;
  const productPeople = graph.employees.filter((employee) => employee.department === 'Product').slice(0, 6);
  const productBudget = graph.budgets.find((budget) => budget.department === 'Product' && budget.quarter === 'FY26 Q3') ?? graph.budgets[0];
  const available = productBudget.allocated - productBudget.spent - productBudget.committed;
  const [showQueueDecision, setShowQueueDecision] = React.useState(props.originIntent.operation === 'review');
  const [queueIsExpanded, setQueueIsExpanded] = React.useState(false);

  return (
    <div className={styles.dashboard} data-dashboard="team">
      <section className={styles.dashboardLead}><div className={styles.heroIdentity}><img src={PERSONA_MEDIA.diego.src} alt={PERSONA_MEDIA.diego.alt} /><div><span>Team IT</span><h1>Product team operations: people, devices, approvals, and budget in one daily cockpit.</h1><p>Prioritize employee impact while keeping policy and spend consequences visible.</p></div></div><OriginContext {...props} /></section>
      <DashboardKpis items={[
        { label: 'Team members', value: '24', detail: '18 assigned Surface devices' },
        { label: 'Awaiting review', value: '4', detail: 'One due today', tone: 'attention' },
        { label: 'Available budget', value: money(available), detail: 'FY26 Q3 hardware', tone: 'positive' },
        { label: 'Refresh risk', value: '18%', detail: 'Three devices need planning' }
      ]} />

      <section className={`${styles.teamMain} ${queueIsExpanded ? styles.teamMainExpanded : ''}`}>
        <div className={styles.dashboardSection}><div className={styles.sectionHeading}><div><span>People and devices</span><h2>Product team readiness</h2></div><b>6 shown</b></div><div className={styles.teamRoster}>{productPeople.map((employee) => { const device = graph.devices.find((item) => item.ownerId === employee.id); const surface = graph.surfaceCatalog.find((item) => item.id === device?.skuId); const personaMedia = PERSONA_MEDIA_BY_NAME[employee.name]; const readiness = device?.status === 'critical' ? 'Critical' : device?.status === 'attention' ? 'Attention' : 'Ready'; return <div key={employee.id}>{personaMedia ? <img src={personaMedia.src} alt={personaMedia.alt} /> : <span className={styles.personInitials}>{employee.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</span>}<span><strong>{employee.name}</strong><small>{employee.role}</small></span><span><b>{surface?.name ?? 'Surface device'}</b><small>{device?.ageMonths ?? 0} months / {device?.status ?? 'healthy'}</small></span><Badge appearance="tint" className={styles.readinessBadge} data-tone={device?.status ?? 'healthy'}>{readiness}</Badge></div>; })}</div></div>
        <aside className={styles.dashboardSection}><div className={styles.sectionHeading}><div><span>Decision queue</span><h2>Approvals requiring attention</h2></div><Button appearance="subtle" aria-pressed={showQueueDecision} className={styles.queueToggle} onClick={() => { setShowQueueDecision((current) => !current); setQueueIsExpanded(false); }}>{showQueueDecision ? 'Hide decision' : 'Review queue'}</Button></div>{showQueueDecision ? <OperationPanel compact key="team-queue" intent={getIntentDefinition('GetApprovalQueue')} isDark={props.isDark} onExpandedChange={setQueueIsExpanded} ownerWindow={props.ownerWindow} /> : <div className={styles.approvalList}><div data-tone="ready"><img src={PERSONA_MEDIA.megan.src} alt="" /><span><strong>Megan Bowen</strong><small>Device / complete evidence</small></span><b>$2,069</b></div><div data-tone="attention"><span className={styles.personInitials}>AV</span><span><strong>Adele Vance</strong><small>Policy exception / 5 days</small></span><b>$2,399</b></div><div data-tone="danger"><span className={styles.personInitials}>AW</span><span><strong>Alex Wilber</strong><small>Device / overdue</small></span><b>$1,899</b></div></div>}</aside>
      </section>

      <section className={styles.teamLower}>
        <div className={styles.dashboardSection}><div className={styles.sectionHeading}><div><span>Spend control</span><h2>Product hardware budget</h2></div><b>{money(available)} available</b></div><div className={styles.budgetComposition}><i style={{ width: `${productBudget.spent / productBudget.allocated * 100}%` }} /><i style={{ width: `${productBudget.committed / productBudget.allocated * 100}%` }} /><i /></div><div className={styles.budgetLegend}><span><i data-part="spent" />Spent {money(productBudget.spent)}</span><span><i data-part="committed" />Committed {money(productBudget.committed)}</span><span><i data-part="available" />Available {money(available)}</span></div></div>
        <div className={styles.dashboardSection}><div className={styles.sectionHeading}><div><span>Support load</span><h2>Ticket volume and self-service</h2></div><b>6 months</b></div><TicketColumns /></div>
        <div className={styles.dashboardSection}><div className={styles.sectionHeading}><div><span>Lifecycle</span><h2>Refresh priorities</h2></div><b>3 people</b></div><div className={styles.riskList}><div><span>Megan Bowen</span><b>Battery 62% / 42 months</b></div><div><span>Adele Vance</span><b>49 months / eligible</b></div><div><span>Alex Wilber</span><b>Warranty in 93 days</b></div></div></div>
      </section>
    </div>
  );
}

export function PortfolioDashboard(props: IDashboardViewProps): React.ReactElement {
  const graph = MOCK_GRAPH;
  const [region, setRegion] = React.useState('all');
  const [department, setDepartment] = React.useState('all');
  const baseModel = React.useMemo(() => buildChartModel(getIntentDefinition('GetFleetHealth')), []);
  const filteredModel = React.useMemo(() => ({ ...baseModel, marks: baseModel.marks.filter((mark) => (region === 'all' || mark.group === region) && (department === 'all' || mark.label.indexOf(` / ${department}`) >= 0)) }), [baseModel, department, region]);
  const [selectedId, setSelectedId] = React.useState(filteredModel.marks[0]?.id);
  const fleetCells = buildFleetCells(graph);
  const selectedCell = fleetCells.find((cell) => cell.id === selectedId) ?? fleetCells.slice().sort((left, right) => left.health - right.health)[0];
  const regionExposure = REGIONS.map((regionName) => {
    const cells = fleetCells.filter((cell) => cell.region === regionName);
    const devices = cells.reduce((sum, cell) => sum + cell.devices, 0);
    const critical = cells.reduce((sum, cell) => sum + cell.critical, 0);
    const health = Math.round(cells.reduce((sum, cell) => sum + cell.health * cell.devices, 0) / Math.max(devices, 1));
    return { region: regionName, devices, critical, health };
  }).sort((left, right) => left.health - right.health);
  const openTickets = graph.tickets.filter((ticket) => ticket.status === 'open').length;
  const spend = buildSpendBridge(graph);
  const remaining = spend.find((point) => point.id === 'remaining')?.value ?? 0;
  const reclaimValue = graph.licenses.reduce((sum, license) => sum + license.annualValue, 0);
  const incident = graph.incidents[0];

  React.useEffect(() => setSelectedId(filteredModel.marks[0]?.id), [filteredModel]);

  return (
    <div className={styles.dashboard} data-dashboard="portfolio">
      <section className={styles.commandLead}><div className={styles.heroIdentity}><img src={PERSONA_MEDIA.lee.src} alt={PERSONA_MEDIA.lee.alt} /><div><span>IT control center</span><h1>Enterprise technology health, service continuity, and investment value.</h1><p>One operating picture for Lee Gu and the IT leadership team.</p></div></div><div className={styles.commandMeta}><span>Last refreshed</span><strong>Today, 9:00 AM</strong><small>Deterministic showcase data</small></div></section>
      <DashboardKpis items={[
        { label: 'Fleet health', value: '77%', detail: '180 managed devices', tone: 'attention' },
        { label: 'Open tickets', value: String(openTickets), detail: 'Across 8 categories' },
        { label: 'Services healthy', value: '3 / 5', detail: 'Teams and Intune degraded', tone: 'attention' },
        { label: 'Forecast remaining', value: money(remaining), detail: 'After commitments and forecast', tone: 'positive' },
        { label: 'License opportunity', value: money(reclaimValue), detail: 'Annual reclaim value', tone: 'positive' }
      ]} />

      <section className={styles.controlGrid}>
        <div className={styles.estatePanel}>
          <div className={styles.sectionHeading}><div><span>Global estate risk map</span><h2>Where is device risk concentrated?</h2></div><div className={styles.filterRow}><Select aria-label="Filter fleet by region" className={styles.estateFilter} value={region} onChange={(event) => setRegion(event.target.value)}><option value="all">All regions</option>{REGIONS.map((item) => <option key={item}>{item}</option>)}</Select><Select aria-label="Filter fleet by department" className={styles.estateFilter} value={department} onChange={(event) => setDepartment(event.target.value)}><option value="all">All departments</option>{DEPARTMENTS.map((item) => <option key={item}>{item}</option>)}</Select></div></div>
          <div className={styles.estateCanvas}><EstateRiskMap isDark={props.isDark} model={filteredModel} selectedId={selectedId} onSelect={setSelectedId} /><div className={styles.selectedEstate}><span>Selected cohort</span><strong>{selectedCell.region} / {selectedCell.department}</strong><b>{selectedCell.health}% health</b><small>{selectedCell.devices} devices / {selectedCell.critical} critical</small></div></div>
          <div className={styles.regionExposure}><div className={styles.sectionHeading}><div><span>Regional exposure</span><h2>Estate posture by geography</h2></div><b>Weighted health</b></div>{regionExposure.map((item) => <div key={item.region}><span><strong>{item.region}</strong><small>{item.devices} managed devices</small></span><i><b style={{ width: `${item.health}%` }} /></i><strong>{item.health}%</strong><small>{item.critical} critical</small></div>)}</div>
        </div>
        <aside className={styles.commandRail}>
          <div className={styles.incidentPanel}><span>Major incident</span><div><Badge appearance="filled" className={styles.incidentStatus} color="danger">Investigating</Badge><small>{incident.id}</small></div><h2>{incident.title}</h2><p>{incident.signalCount} signals and {incident.ticketIds.length} tickets converge across {incident.affectedRegions.join(' and ')}.</p><div className={styles.ownerLine}><img src={PERSONA_MEDIA.lee.src} alt={PERSONA_MEDIA.lee.alt} /><span><strong>Lee Gu</strong><small>Incident commander</small></span></div></div>
          <div className={styles.serviceStatus}><div className={styles.sectionHeading}><div><span>Microsoft 365</span><h2>Service health</h2></div><b>3 healthy</b></div>{graph.services.map((service) => <div key={service.id}><span>{service.name}</span><b data-tone={service.status}>{service.status === 'healthy' ? 'Healthy' : 'Degraded'}</b><small>{service.incidentCount === 0 ? 'No incidents' : `${service.incidentCount} active`}</small></div>)}</div>
          <div className={styles.peopleImpact}><div className={styles.sectionHeading}><div><span>People impact</span><h2>Accountability and reach</h2></div><b>82 affected</b></div><div><img src={PERSONA_MEDIA.lee.src} alt={PERSONA_MEDIA.lee.alt} /><span><strong>Lee Gu</strong><small>Incident command / Europe</small></span><b>Owner</b></div><div><img src={PERSONA_MEDIA.diego.src} alt={PERSONA_MEDIA.diego.alt} /><span><strong>Diego Siciliani</strong><small>Business approvals / Product</small></span><b>7 pending</b></div><div><img src={PERSONA_MEDIA.megan.src} alt={PERSONA_MEDIA.megan.alt} /><span><strong>Megan Bowen</strong><small>Impacted user / North America</small></span><b>2 cases</b></div></div>
        </aside>
      </section>

      <section className={styles.portfolioCharts}>
        <div className={styles.dashboardSection}><div className={styles.sectionHeading}><div><span>Demand</span><h2>Ticket volume and deflection</h2></div><b>{openTickets} open</b></div><TicketColumns /></div>
        <div className={styles.dashboardSection}><div className={styles.sectionHeading}><div><span>Investment</span><h2>Budget to forecast bridge</h2></div><b>{money(remaining)} remaining</b></div><div className={styles.spendBridge}>{spend.map((point) => <div key={point.id}><span>{point.label}</span><i data-direction={point.value < 0 ? 'down' : 'up'} style={{ height: `${Math.max(12, Math.abs(point.value) / Math.max(...spend.map((item) => Math.abs(item.value))) * 100)}%` }} /><strong>{money(Math.abs(point.value))}</strong></div>)}</div></div>
        <div className={styles.dashboardSection}><div className={styles.sectionHeading}><div><span>Support drivers</span><h2>Top issue categories</h2></div><b>80% focus</b></div><HorizontalBars ariaLabel="Top IT issue categories" points={buildTopIssues(graph).slice(0, 6)} /></div>
      </section>

      <section className={styles.portfolioBottom}>
        <div className={styles.dashboardSection}><div className={styles.sectionHeading}><div><span>Lifecycle outlook</span><h2>Device age distribution</h2></div><b>34 past threshold</b></div><HorizontalBars ariaLabel="Device age distribution" points={buildAgeCohorts(graph)} /></div>
        <div className={styles.dashboardSection}><div className={styles.sectionHeading}><div><span>Capacity plan</span><h2>Refresh waves</h2></div><b>1 over capacity</b></div><div className={styles.waveTable}>{graph.refreshWaves.slice(0, 6).map((wave) => <div key={wave.id}><span>{wave.quarter}<small>{wave.region}</small></span><b>{wave.devices} devices</b><i data-over={wave.devices > wave.capacity} style={{ width: `${Math.min(100, wave.devices / wave.capacity * 100)}%` }} /><strong>{money(wave.cost)}</strong></div>)}</div></div>
        <div className={styles.dashboardSection}><div className={styles.sectionHeading}><div><span>Value recovery</span><h2>License reclaim</h2></div><b>{money(reclaimValue)} / year</b></div><div className={styles.licenseList}>{graph.licenses.map((license) => <div key={license.product}><span><strong>{license.product}</strong><small>{license.active} active of {license.assigned}</small></span><b>{license.reclaimable} reclaimable</b><strong>{money(license.annualValue)}</strong></div>)}</div></div>
      </section>
    </div>
  );
}