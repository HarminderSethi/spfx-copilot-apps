import * as React from 'react';

import { Avatar } from '@fluentui/react-avatar';
import { Text } from '@fluentui/react-text';
import { makeStyles } from '@griffel/react';
import { tokens } from '@fluentui/react-theme';
import { CalendarLtr20Regular, CheckmarkCircle20Filled, Warning20Regular } from '@fluentui/react-icons';

import AnimatedDetailsPanel from '../components/AnimatedDetailsPanel';
import InlineDetailHeader from '../components/InlineDetailHeader';
import { embeddedImages } from '../mockData/embeddedImages';
import { getZavaFamily } from '../models/families';
import type { ZavaFamilyId } from '../models/families';
import type { IZavaUser } from '../models/zavaEmployee';
import { getZavaFamilyTheme } from '../theme/familyThemes';
import { isZavaManager } from '../utils/roles';
import ApprovalDecisionWorkflow from './ApprovalDecisionWorkflow';
import DashboardSupportingExperience from './DashboardSupportingExperience';
import { getDashboardOnlyExperience, getFamilyDashboardDefinition, getFamilyDashboardExperiences } from './familyDashboardCatalog';
import { MockFamilyExperienceDataService } from './familyExperienceCatalog';
import HrCaseWorkflow from './HrCaseWorkflow';
import RequestTimeOffWorkflow from './RequestTimeOffWorkflow';

const experienceService = new MockFamilyExperienceDataService();

const useStyles = makeStyles({
  inline: { width: '100%', minWidth: 0, boxSizing: 'border-box', padding: '12px', backgroundColor: tokens.colorNeutralBackground2 },
  card: { display: 'flex', flexDirection: 'column', gap: '12px', minWidth: 0, padding: '14px', backgroundColor: tokens.colorNeutralBackground1, border: `1px solid ${tokens.colorNeutralStroke2}`, borderRadius: tokens.borderRadiusMedium, boxShadow: tokens.shadow4 },
  eyebrow: { color: tokens.colorPaletteTealForeground2, fontWeight: tokens.fontWeightSemibold, textTransform: 'uppercase' },
  muted: { color: tokens.colorNeutralForeground3 },
  metrics: { display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '8px', '@media (max-width: 420px)': { gridTemplateColumns: '1fr' } },
  metric: { padding: '9px', backgroundColor: tokens.colorNeutralBackground3, borderRadius: tokens.borderRadiusMedium },
  track: { display: 'flex', height: '18px', overflow: 'hidden', borderRadius: tokens.borderRadiusCircular, backgroundColor: tokens.colorNeutralBackground4 },
  vacation: { width: '58%', backgroundColor: tokens.colorPaletteTealBorderActive },
  sick: { width: '32%', backgroundColor: tokens.colorPaletteBlueBorderActive },
  carry: { width: '10%', backgroundColor: tokens.colorPaletteMarigoldBackground3 },
  payTrack: { display: 'grid', gridTemplateColumns: '69fr 31fr', height: '28px', overflow: 'hidden', borderRadius: tokens.borderRadiusMedium },
  netPay: { display: 'flex', alignItems: 'center', paddingLeft: '8px', color: tokens.colorNeutralForegroundInverted, backgroundColor: tokens.colorPaletteGreenForeground1 },
  deductions: { display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: tokens.colorPaletteMarigoldBackground2 },
  waterfall: { display: 'grid', gridTemplateColumns: 'repeat(4, minmax(60px, 1fr))', alignItems: 'end', gap: '8px', minHeight: '142px' },
  waterColumn: { display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: '5px', height: '100%', textAlign: 'center' },
  priorBar: { height: '82px', backgroundColor: tokens.colorNeutralBackground4, borderRadius: tokens.borderRadiusMedium },
  positiveBar: { height: '54px', backgroundColor: tokens.colorPaletteGreenBackground2, border: `2px solid ${tokens.colorPaletteGreenBorderActive}`, borderRadius: tokens.borderRadiusMedium },
  negativeBar: { height: '24px', backgroundColor: tokens.colorPaletteRedBackground2, border: `2px solid ${tokens.colorPaletteRedBorderActive}`, borderRadius: tokens.borderRadiusMedium },
  currentBar: { height: '94px', backgroundColor: tokens.colorBrandBackground2, border: `2px solid ${tokens.colorBrandStroke1}`, borderRadius: tokens.borderRadiusMedium },
  matrixWrap: { overflowX: 'auto' },
  matrix: { width: '100%', minWidth: '430px', borderCollapse: 'collapse' },
  matrixCell: { padding: '8px', textAlign: 'left', borderBottom: `1px solid ${tokens.colorNeutralStroke2}` },
  bestCell: { color: tokens.colorPaletteGreenForeground1, backgroundColor: tokens.colorPaletteGreenBackground2, fontWeight: tokens.fontWeightSemibold },
  priorities: { display: 'flex', flexWrap: 'wrap', gap: '6px' },
  priorityChip: { padding: '4px 7px', color: tokens.colorPaletteBlueForeground2, backgroundColor: tokens.colorPaletteBlueBackground2, borderRadius: tokens.borderRadiusMedium },
  steps: { display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '8px', '@media (max-width: 460px)': { gridTemplateColumns: '1fr' } },
  step: { padding: '9px', backgroundColor: tokens.colorNeutralBackground3, borderTop: `3px solid ${tokens.colorBrandStroke1}`, borderRadius: tokens.borderRadiusMedium },
  privacy: { display: 'grid', gridTemplateColumns: '24px minmax(0, 1fr)', gap: '8px', padding: '10px', color: tokens.colorPaletteCranberryForeground2, backgroundColor: tokens.colorPaletteCranberryBackground2, borderRadius: tokens.borderRadiusMedium },
  learningLayout: { display: 'grid', gridTemplateColumns: '112px minmax(0, 1fr)', gap: '14px', alignItems: 'center', '@media (max-width: 420px)': { gridTemplateColumns: '1fr' } },
  ring: { width: '104px', height: '104px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: tokens.borderRadiusCircular, backgroundImage: `conic-gradient(${tokens.colorPaletteCornflowerBorderActive} 0 86%, ${tokens.colorNeutralBackground4} 86% 100%)` },
  ringCenter: { width: '76px', height: '76px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: tokens.colorNeutralBackground1, borderRadius: tokens.borderRadiusCircular },
  queue: { display: 'flex', flexDirection: 'column', gap: '8px' },
  queueItem: { display: 'grid', gridTemplateColumns: '10px minmax(0, 1fr) auto', gap: '8px', alignItems: 'center', padding: '8px', borderBottom: `1px solid ${tokens.colorNeutralStroke2}` },
  urgentDot: { width: '10px', height: '10px', backgroundColor: tokens.colorPaletteRedBorderActive, borderRadius: tokens.borderRadiusCircular },
  doneDot: { width: '10px', height: '10px', backgroundColor: tokens.colorPaletteGreenBorderActive, borderRadius: tokens.borderRadiusCircular },
  rewardStack: { display: 'grid', gridTemplateColumns: '55fr 8fr 13fr 10fr 14fr', height: '42px', overflow: 'hidden', borderRadius: tokens.borderRadiusMedium },
  rewardBase: { backgroundColor: tokens.colorPaletteGoldBorderActive },
  rewardBonus: { backgroundColor: tokens.colorPaletteGreenBorderActive },
  rewardEquity: { backgroundColor: tokens.colorPaletteBlueBorderActive },
  rewardPension: { backgroundColor: tokens.colorPalettePurpleBorderActive },
  rewardBenefits: { backgroundColor: tokens.colorPaletteTealBorderActive },
  rewardRows: { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '8px', '@media (max-width: 420px)': { gridTemplateColumns: '1fr' } },
  rewardRow: { display: 'flex', justifyContent: 'space-between', gap: '8px', padding: '8px', borderBottom: `1px solid ${tokens.colorNeutralStroke2}` },
  approval: { display: 'grid', gridTemplateColumns: '10px minmax(0, 1fr) auto', gap: '9px', alignItems: 'center', padding: '10px', borderBottom: `1px solid ${tokens.colorNeutralStroke2}` },
  priorityDot: { width: '10px', height: '10px', backgroundColor: tokens.colorPaletteRedBorderActive, borderRadius: tokens.borderRadiusCircular },
  normalDot: { width: '10px', height: '10px', backgroundColor: tokens.colorPaletteBlueBorderActive, borderRadius: tokens.borderRadiusCircular },
  heatmap: { display: 'grid', gridTemplateColumns: '88px repeat(5, minmax(38px, 1fr))', gap: '5px', alignItems: 'center', overflowX: 'auto' },
  heatHeader: { padding: '5px', color: tokens.colorNeutralForeground3, textAlign: 'center' },
  heatName: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  heatAvailable: { height: '34px', backgroundColor: tokens.colorNeutralBackground3, borderRadius: tokens.borderRadiusSmall },
  heatAway: { height: '34px', backgroundColor: tokens.colorPalettePumpkinBackground2, border: `1px solid ${tokens.colorPalettePumpkinBorderActive}`, borderRadius: tokens.borderRadiusSmall },
  heatRisk: { height: '34px', backgroundColor: tokens.colorPaletteRedBackground2, border: `1px solid ${tokens.colorPaletteRedBorderActive}`, borderRadius: tokens.borderRadiusSmall },
  expertGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '8px', '@media (max-width: 620px)': { gridTemplateColumns: '1fr' } },
  expert: { display: 'flex', flexDirection: 'column', gap: '7px', padding: '10px', backgroundColor: tokens.colorNeutralBackground3, borderTop: `3px solid ${tokens.colorPaletteBerryBorderActive}`, borderRadius: tokens.borderRadiusMedium },
  expertTop: { display: 'flex', justifyContent: 'space-between', gap: '8px', alignItems: 'center' },
  expertIdentity: { display: 'flex', alignItems: 'center', gap: '9px', minWidth: 0 },
  score: { color: tokens.colorPaletteGreenForeground1, fontWeight: tokens.fontWeightBold },
  tags: { display: 'flex', flexWrap: 'wrap', gap: '4px' },
  tag: { padding: '3px 5px', backgroundColor: tokens.colorPaletteBerryBackground2, borderRadius: tokens.borderRadiusSmall },
  tree: { display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '520px' },
  treeViewport: { overflowX: 'auto', padding: '4px 2px 8px' },
  managerNode: { width: 'min(360px, 100%)', display: 'grid', gridTemplateColumns: '44px minmax(0, 1fr) auto', gap: '10px', alignItems: 'center', boxSizing: 'border-box', padding: '10px 12px', backgroundColor: tokens.colorNeutralBackground3, border: `1px solid ${tokens.colorNeutralStroke2}`, borderRadius: tokens.borderRadiusMedium },
  connector: { width: '2px', height: '20px', marginLeft: '32px', backgroundColor: tokens.colorPaletteBerryBorderActive },
  treeNode: { backgroundColor: tokens.colorNeutralBackground1, border: `1px solid ${tokens.colorNeutralStroke2}`, borderLeft: `3px solid ${tokens.colorPaletteBerryBorderActive}`, borderRadius: tokens.borderRadiusMedium, boxShadow: tokens.shadow2 },
  treeSummary: { display: 'grid', gridTemplateColumns: '44px minmax(0, 1fr) auto', gap: '10px', alignItems: 'center', padding: '10px 12px', cursor: 'pointer' },
  treeCopy: { minWidth: 0 },
  treeRole: { color: tokens.colorNeutralForeground3 },
  relationship: { padding: '3px 7px', color: tokens.colorPaletteBerryForeground2, backgroundColor: tokens.colorPaletteBerryBackground2, borderRadius: tokens.borderRadiusCircular, whiteSpace: 'nowrap' },
  treeBranches: { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(240px, 1fr))', gap: '10px', padding: '0 12px 12px 28px' },
  treeChildren: { display: 'flex', flexDirection: 'column', gap: '6px', padding: '0 10px 10px 28px' },
  teamLeaf: { display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', gap: '8px', alignItems: 'center', padding: '8px 10px', backgroundColor: tokens.colorNeutralBackground3, borderRadius: tokens.borderRadiusSmall },
  personLeaf: { display: 'grid', gridTemplateColumns: '32px minmax(0, 1fr)', gap: '8px', alignItems: 'center', padding: '8px 10px', backgroundColor: tokens.colorPaletteBerryBackground2, borderRadius: tokens.borderRadiusSmall },
  legend: { display: 'flex', flexWrap: 'wrap', gap: '12px' },
  form: { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '10px', '@media (max-width: 460px)': { gridTemplateColumns: '1fr' } },
  field: { display: 'flex', flexDirection: 'column', gap: '4px' },
  span: { gridColumn: '1 / -1' },
  input: { minWidth: 0, padding: '8px', color: tokens.colorNeutralForeground1, backgroundColor: tokens.colorNeutralBackground1, border: `1px solid ${tokens.colorNeutralStroke1}`, borderRadius: tokens.borderRadiusMedium },
  alert: { display: 'grid', gridTemplateColumns: '24px minmax(0, 1fr)', gap: '8px', padding: '9px', color: tokens.colorPaletteMarigoldForeground2, backgroundColor: tokens.colorPaletteMarigoldBackground2, borderRadius: tokens.borderRadiusMedium },
  success: { color: tokens.colorPaletteGreenForeground1 },
  button: { alignSelf: 'flex-start', padding: '8px 12px', color: tokens.colorNeutralForegroundOnBrand, backgroundColor: tokens.colorBrandBackground, border: 'none', borderRadius: tokens.borderRadiusMedium, cursor: 'pointer', fontWeight: tokens.fontWeightSemibold },
  dashboardRoot: { display: 'flex', flexDirection: 'column', gap: '18px' },
  hero: { display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'center', padding: '20px', color: tokens.colorNeutralForegroundOnBrand, backgroundColor: tokens.colorPaletteTealForeground2, borderRadius: tokens.borderRadiusMedium, '@media (max-width: 680px)': { alignItems: 'flex-start', flexDirection: 'column' } },
  identity: { display: 'flex', alignItems: 'center', gap: '12px' },
  heroMetrics: { display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '8px', '@media (max-width: 760px)': { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }, '@media (max-width: 420px)': { gridTemplateColumns: '1fr' } },
  heroMetric: { minWidth: 0, padding: '11px 12px', backgroundColor: tokens.colorNeutralBackground1, border: `1px solid ${tokens.colorNeutralStroke2}`, borderRadius: tokens.borderRadiusMedium, boxShadow: tokens.shadow2 },
  dashboard: { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '14px', '@media (max-width: 900px)': { gridTemplateColumns: '1fr' } }
  ,priority: { display: 'flex', justifyContent: 'space-between', gap: '14px', alignItems: 'center', padding: '15px 18px', backgroundColor: tokens.colorNeutralBackground1, border: `1px solid ${tokens.colorNeutralStroke2}`, borderRadius: tokens.borderRadiusMedium, '@media (max-width: 560px)': { alignItems: 'flex-start', flexDirection: 'column' } }
  ,priorityCopy: { display: 'flex', flexDirection: 'column', gap: '3px' }
});

export interface IConfiguredFamilyInlineProps {
  intentKey: string;
  params: Record<string, string | number | boolean | string[]>;
  currentUser?: IZavaUser;
  onRequestFullscreen?: () => void;
}

const ExpertSearchBody: React.FunctionComponent<{ params: Record<string, string | number | boolean | string[]> }> = ({ params }) => {
  const styles = useStyles();
  const promptExpertise = String(params.expertise || 'accessibility for a customer keynote');
  const promptLocation = String(params.location || 'Europe');
  const [expertise, setExpertise] = React.useState(promptExpertise);
  const [location, setLocation] = React.useState(promptLocation);
  React.useEffect(() => setExpertise(promptExpertise), [promptExpertise]);
  React.useEffect(() => setLocation(promptLocation), [promptLocation]);
  const experts = [
    { name: 'Johanna Lorenz', photoUrl: embeddedImages.johannaLorenz, role: 'Principal Accessibility Lead', score: '96%', path: 'Works with Lee Gu', location: 'Helsinki', tags: ['WCAG', 'Keynotes'] },
    { name: 'Pradeep Gupta', photoUrl: embeddedImages.pradeepGupta, role: 'Inclusive Design Director', score: '91%', path: 'Shared customer program', location: 'London', tags: ['Inclusive design', 'Research'] },
    { name: 'Nestor Wilke', photoUrl: embeddedImages.nestorWilke, role: 'Assistive Technology Specialist', score: '87%', path: '2 mutual collaborators', location: 'Berlin', tags: ['Screen readers', 'Demos'] }
  ];
  const normalizedLocation = location.trim().toLowerCase();
  const visibleExperts = !normalizedLocation || normalizedLocation === 'europe'
    ? experts
    : experts.filter((expert) => expert.location.toLowerCase().includes(normalizedLocation));
  return <><div className={styles.form} aria-label="Expert search filters"><label className={styles.field}><Text size={200}>Expertise</Text><input className={styles.input} value={expertise} onChange={(event) => setExpertise(event.currentTarget.value)} /></label><label className={styles.field}><Text size={200}>Location</Text><input className={styles.input} value={location} onChange={(event) => setLocation(event.currentTarget.value)} /></label></div><Text size={200} className={styles.muted}>Showing evidence-ranked matches for {expertise || 'any expertise'} in {location || 'all locations'}.</Text>{visibleExperts.length > 0 ? <div className={styles.expertGrid}>{visibleExperts.map((expert) => <article className={styles.expert} key={expert.name}><div className={styles.expertTop}><div className={styles.expertIdentity}><Avatar name={expert.name} image={{ src: expert.photoUrl }} size={40} /><span><Text block weight="semibold">{expert.name}</Text><Text size={200}>{expert.role}</Text></span></div><Text className={styles.score}>{expert.score}</Text></div><Text size={200} className={styles.muted}>{expert.location} · {expert.path}</Text><div className={styles.tags}>{expert.tags.map((tag) => <span className={styles.tag} key={tag}><Text size={100}>{tag}</Text></span>)}</div><button type="button" className={styles.button}>View profile</button></article>)}</div> : <div className={styles.alert}><Warning20Regular /><Text size={200}>No experts match {location}. Clear the location to see all evidence-ranked matches.</Text></div>}<div className={styles.alert}><CheckmarkCircle20Filled /><Text size={200}>Matches are ranked from mocked role, skill, and collaboration evidence, not inferred personal traits.</Text></div></>;
};

const OrganizationBody: React.FunctionComponent<{ params: Record<string, string | number | boolean | string[]> }> = ({ params }) => {
  const styles = useStyles();
  const promptPersonId = String(params.personId || 'megan-bowen');
  const promptOrganizationId = String(params.organizationId || 'customer-experience');
  const promptDepth = typeof params.depth === 'number' ? params.depth : 2;
  const [personId, setPersonId] = React.useState(promptPersonId);
  const [organizationId, setOrganizationId] = React.useState(promptOrganizationId);
  const [depth, setDepth] = React.useState(promptDepth);
  React.useEffect(() => setPersonId(promptPersonId), [promptPersonId]);
  React.useEffect(() => setOrganizationId(promptOrganizationId), [promptOrganizationId]);
  React.useEffect(() => setDepth(promptDepth), [promptDepth]);
  const anchorName = personId === 'megan-bowen' ? 'Megan Bowen' : personId.replace(/-/g, ' ');
  const organizationName = organizationId === 'customer-experience' ? 'Zava Customer Experience' : organizationId.replace(/-/g, ' ');
  return <><div className={styles.form} aria-label="Organization explorer controls"><label className={styles.field}><Text size={200}>Person anchor</Text><input className={styles.input} value={personId} onChange={(event) => setPersonId(event.currentTarget.value)} /></label><label className={styles.field}><Text size={200}>Organization</Text><input className={styles.input} value={organizationId} onChange={(event) => setOrganizationId(event.currentTarget.value)} /></label><label className={styles.field}><Text size={200}>Levels</Text><select className={styles.input} value={depth} onChange={(event) => setDepth(Number(event.currentTarget.value))}><option value={1}>1 level</option><option value={2}>2 levels</option><option value={3}>3 levels</option><option value={4}>4 levels</option></select></label></div><Text size={200} className={styles.muted}>Anchored on {anchorName} · {depth} {depth === 1 ? 'level' : 'levels'}</Text><div className={styles.treeViewport}><div className={styles.tree} aria-label={`${organizationName} organization tree`}><div className={styles.managerNode}><Avatar name="Diego Siciliani" image={{ src: embeddedImages.diegoSiciliani }} size={40} /><span className={styles.treeCopy}><Text block weight="semibold">Diego Siciliani</Text><Text size={200} block className={styles.treeRole}>Director, Employee Products</Text></span><Text size={100} className={styles.relationship}>Manager</Text></div><div className={styles.connector} /><details className={styles.treeNode} open><summary className={styles.treeSummary}><Avatar name="Megan Bowen" image={{ src: embeddedImages.meganBowen }} size={40} /><span className={styles.treeCopy}><Text block weight="semibold">Megan Bowen</Text><Text size={200} block className={styles.treeRole}>Product Design Lead · Customer Experience</Text></span><Text size={100} className={styles.relationship}>Anchor</Text></summary>{depth > 1 && <div className={styles.treeBranches}><details className={styles.treeNode} open><summary className={styles.treeSummary}><Avatar name="Lee Gu" image={{ src: embeddedImages.leeGu }} size={40} /><span className={styles.treeCopy}><Text block weight="semibold">Lee Gu</Text><Text size={200} block className={styles.treeRole}>Principal Product Manager</Text></span><Text size={100} className={styles.relationship}>Partner team</Text></summary><div className={styles.treeChildren}><div className={styles.teamLeaf}><Text weight="semibold">Keynote delivery</Text><Text size={200}>7 people</Text></div><div className={styles.teamLeaf}><Text weight="semibold">Customer success</Text><Text size={200}>9 people</Text></div>{depth > 2 && <div className={styles.personLeaf}><Avatar name="Patti Fernandez" image={{ src: embeddedImages.pattiFernandez }} size={28} /><span><Text block weight="semibold">Patti Fernandez</Text><Text size={200}>HR partner</Text></span></div>}</div></details><details className={styles.treeNode} open><summary className={styles.treeSummary}><Avatar name="Pradeep Gupta" image={{ src: embeddedImages.pradeepGupta }} size={40} /><span className={styles.treeCopy}><Text block weight="semibold">Pradeep Gupta</Text><Text size={200} block className={styles.treeRole}>Inclusive Design Director</Text></span><Text size={100} className={styles.relationship}>Adjacent org</Text></summary><div className={styles.treeChildren}><div className={styles.teamLeaf}><Text weight="semibold">Accessibility practice</Text><Text size={200}>8 people</Text></div><div className={styles.teamLeaf}><Text weight="semibold">Design research</Text><Text size={200}>6 people</Text></div>{depth > 2 && <div className={styles.personLeaf}><Avatar name="Johanna Lorenz" image={{ src: embeddedImages.johannaLorenz }} size={28} /><span><Text block weight="semibold">Johanna Lorenz</Text><Text size={200}>Accessibility Program Lead</Text></span></div>}</div></details></div>}</details></div></div><Text size={200} className={styles.muted}>Use the disclosure controls to expand or collapse portrait-led teams with keyboard or pointer.</Text></>;
};

const ExperienceBody: React.FunctionComponent<{ intentKey: string; params: Record<string, string | number | boolean | string[]> }> = ({ intentKey, params }) => {
  const styles = useStyles();
  const definition = getDashboardOnlyExperience(intentKey) || experienceService.getExperience(intentKey);
  if (definition.kind === 'balance') {
    return <><div className={styles.track} role="img" aria-label="18 vacation days, 10 sick days, and 3 carryover days"><span className={styles.vacation} /><span className={styles.sick} /><span className={styles.carry} /></div><div className={styles.legend}><Text size={200}>Vacation 58%</Text><Text size={200}>Sick 32%</Text><Text size={200}>Carryover 10%</Text></div><div className={styles.alert}><CalendarLtr20Regular /><Text size={200}>Three carryover days expire on December 31. Your next booked leave starts August 4.</Text></div></>;
  }
  if (definition.kind === 'latestPay') {
    return <><div className={styles.payTrack} role="img" aria-label="Net pay EUR 5,126 and deductions EUR 2,294"><span className={styles.netPay}>Net 69%</span><span className={styles.deductions}>31%</span></div><div className={styles.legend}><Text size={200}>Base earnings EUR 6,900</Text><Text size={200}>Recognition EUR 520</Text><Text size={200}>Tax and benefits EUR 2,294</Text></div><div className={styles.alert}><CheckmarkCircle20Filled /><Text size={200}>Statement issued on time. Sensitive amounts stay inside this Money surface.</Text></div></>;
  }
  if (definition.kind === 'payChange') {
    return <><div className={styles.waterfall} role="img" aria-label="Pay change waterfall from EUR 5,005 to EUR 5,126"><div className={styles.waterColumn}><Text size={200}>5,005</Text><span className={styles.priorBar} /><Text size={200}>June</Text></div><div className={styles.waterColumn}><Text size={200}>+260</Text><span className={styles.positiveBar} /><Text size={200}>Recognition</Text></div><div className={styles.waterColumn}><Text size={200}>-139</Text><span className={styles.negativeBar} /><Text size={200}>Withholding</Text></div><div className={styles.waterColumn}><Text size={200}>5,126</Text><span className={styles.currentBar} /><Text size={200}>July</Text></div></div><div className={styles.alert}><Warning20Regular /><Text size={200}>The adjustment is one-time and will not repeat in August.</Text></div></>;
  }
  if (definition.kind === 'benefitCompare') {
    return <><div className={styles.priorities}><span className={styles.priorityChip}>Low deductible · 40%</span><span className={styles.priorityChip}>Dental · 35%</span><span className={styles.priorityChip}>Monthly cost · 25%</span></div><div className={styles.matrixWrap}><table className={styles.matrix} aria-label="Benefit plan comparison for a family with two children"><thead><tr><th className={styles.matrixCell}>Plan detail</th><th className={`${styles.matrixCell} ${styles.bestCell}`}>Zava Plus</th><th className={styles.matrixCell}>Zava Core</th><th className={styles.matrixCell}>Zava Flex</th></tr></thead><tbody><tr><th className={styles.matrixCell}>Deductible</th><td className={`${styles.matrixCell} ${styles.bestCell}`}>EUR 500</td><td className={styles.matrixCell}>EUR 1,100</td><td className={styles.matrixCell}>EUR 750</td></tr><tr><th className={styles.matrixCell}>Dental</th><td className={`${styles.matrixCell} ${styles.bestCell}`}>90%</td><td className={styles.matrixCell}>70%</td><td className={styles.matrixCell}>80%</td></tr><tr><th className={styles.matrixCell}>Fit score</th><td className={`${styles.matrixCell} ${styles.bestCell}`}>91%</td><td className={styles.matrixCell}>72%</td><td className={styles.matrixCell}>84%</td></tr></tbody></table></div><button type="button" className={styles.button}>Adjust priorities</button></>;
  }
  if (definition.kind === 'lifeEvent') {
    return <><div className={styles.steps}><div className={styles.step}><Text size={100} block>1 · Event</Text><Text weight="semibold">Birth or adoption</Text></div><div className={styles.step}><Text size={100} block>2 · Impact</Text><Text weight="semibold">Add one dependent</Text></div><div className={styles.step}><Text size={100} block>3 · Review</Text><Text weight="semibold">Confirm documents</Text></div></div><div className={styles.form}><label className={styles.field}><Text size={200}>Life event</Text><select className={styles.input} defaultValue={String(params.lifeEvent || 'birth')}><option value="birth">Birth</option><option value="adoption">Adoption</option><option value="marriage">Marriage</option><option value="relocation">Relocation</option></select></label><label className={styles.field}><Text size={200}>Effective date</Text><input className={styles.input} type="date" defaultValue={String(params.effectiveDate || '2026-08-01')} /></label></div><div className={styles.alert}><CheckmarkCircle20Filled /><Text size={200}>Estimated employee cost increases EUR 42/month. Medical and dental coverage begin on the effective date.</Text></div><button type="button" className={styles.button}>Review life event</button></>;
  }
  if (definition.kind === 'caseCreate') {
    return <HrCaseWorkflow params={params} />;
  }
  if (definition.kind === 'learning') {
    return <><div className={styles.learningLayout}><div className={styles.ring} role="img" aria-label="Learning compliance 86 percent"><div className={styles.ringCenter}><Text size={600} weight="bold">86%</Text><Text size={100}>complete</Text></div></div><div className={styles.queue}><div className={styles.queueItem}><span className={styles.urgentDot} /><span><Text block weight="semibold">Privacy foundations</Text><Text size={200}>Due Friday · 24 minutes left</Text></span><button type="button" className={styles.button}>Resume</button></div><div className={styles.queueItem}><span className={styles.doneDot} /><span><Text block weight="semibold">Secure collaboration</Text><Text size={200}>Completed yesterday</Text></span><CheckmarkCircle20Filled /></div></div></div><div className={styles.alert}><CalendarLtr20Regular /><Text size={200}>Completing Privacy foundations raises your compliance to 100%. No optional courses are included.</Text></div></>;
  }
  if (definition.kind === 'rewards') {
    return <><div className={styles.rewardStack} role="img" aria-label="Annual rewards composition: salary 55 percent, bonus 8 percent, equity 13 percent, pension 10 percent, benefits 14 percent"><span className={styles.rewardBase} /><span className={styles.rewardBonus} /><span className={styles.rewardEquity} /><span className={styles.rewardPension} /><span className={styles.rewardBenefits} /></div><div className={styles.rewardRows}><div className={styles.rewardRow}><Text>Base salary</Text><Text weight="semibold">EUR 102K</Text></div><div className={styles.rewardRow}><Text>Bonus</Text><Text weight="semibold">EUR 15K</Text></div><div className={styles.rewardRow}><Text>Equity</Text><Text weight="semibold">EUR 24K</Text></div><div className={styles.rewardRow}><Text>Pension</Text><Text weight="semibold">EUR 25K</Text></div><div className={styles.rewardRow}><Text>Benefits</Text><Text weight="semibold">EUR 18K</Text></div></div><div className={styles.alert}><CheckmarkCircle20Filled /><Text size={200}>This is annual employment value, not a payslip. Equity uses the current mocked grant value.</Text></div></>;
  }
  if (definition.kind === 'approvals') {
    return <ApprovalDecisionWorkflow />;
  }
  if (definition.kind === 'absence') {
    const rows = [
      { name: 'Lee', days: ['away', 'away', 'available', 'available', 'available'] },
      { name: 'Patti', days: ['available', 'risk', 'away', 'available', 'available'] },
      { name: 'Nestor', days: ['available', 'risk', 'available', 'available', 'away'] }
    ];
    return <><div className={styles.heatmap} role="img" aria-label="Team absence heatmap. Tuesday has two people away and the highest coverage risk"><span /><Text size={100} className={styles.heatHeader}>Mon</Text><Text size={100} className={styles.heatHeader}>Tue</Text><Text size={100} className={styles.heatHeader}>Wed</Text><Text size={100} className={styles.heatHeader}>Thu</Text><Text size={100} className={styles.heatHeader}>Fri</Text>{rows.map((row) => <React.Fragment key={row.name}><Text size={200} className={styles.heatName}>{row.name}</Text>{row.days.map((day, index) => <span key={`${row.name}-${index}`} className={day === 'risk' ? styles.heatRisk : day === 'away' ? styles.heatAway : styles.heatAvailable} title={`${row.name}: ${day}`} />)}</React.Fragment>)}</div><div className={styles.legend}><Text size={200}>Available</Text><Text size={200}>Away</Text><Text size={200}>Overlap risk</Text></div><div className={styles.alert}><CheckmarkCircle20Filled /><Text size={200}>At least four team members remain available each day.</Text></div></>;
  }
  if (definition.kind === 'experts') {
    return <ExpertSearchBody params={params} />;
  }
  if (definition.kind === 'organization') {
    return <OrganizationBody params={params} />;
  }
  if (definition.kind === 'request') {
    return <RequestTimeOffWorkflow params={params} />;
  }
  return <DashboardSupportingExperience definition={definition} />;
};

export const ConfiguredFamilyInline: React.FunctionComponent<IConfiguredFamilyInlineProps> = (props) => {
  const styles = useStyles();
  const definition = experienceService.getExperience(props.intentKey);
  const theme = getZavaFamilyTheme(definition.family);
  if (definition.family === 'team' && props.currentUser && !isZavaManager(props.currentUser)) {
    return <section className={styles.inline} data-family-intent={definition.key} data-role-state="not-manager"><InlineDetailHeader title={definition.title} onRequestFullscreen={props.onRequestFullscreen} /><div className={styles.card}><Text weight="semibold">Manager access required</Text><Text size={200}>This experience appears only for people with a manager role.</Text></div></section>;
  }
  return <section className={styles.inline} data-family-intent={definition.key}><InlineDetailHeader title={definition.title} onRequestFullscreen={props.onRequestFullscreen} /><div className={styles.card}><Text size={100} className={styles.eyebrow} style={{ color: theme.accentColor }}>{definition.eyebrow}</Text><Text size={400} weight="semibold">{definition.summary}</Text><div className={styles.metrics}>{definition.metrics.map((metric) => <div className={styles.metric} key={metric.label}><Text size={400} block weight="bold">{metric.value}</Text><Text size={200} className={styles.muted}>{metric.label}</Text></div>)}</div><ExperienceBody intentKey={definition.key} params={props.params} /></div></section>;
};

export interface IConfiguredFamilyDashboardProps {
  family: ZavaFamilyId;
  user: IZavaUser;
  initialParams?: Record<string, string | number | boolean | string[]>;
  viewRef?: React.RefObject<HTMLDivElement>;
}

export const ConfiguredFamilyDashboard: React.FunctionComponent<IConfiguredFamilyDashboardProps> = ({ family, user, initialParams = {}, viewRef }) => {
  const styles = useStyles();
  const metadata = getZavaFamily(family);
  const theme = getZavaFamilyTheme(metadata.themeVariant);
  const experiences = getFamilyDashboardExperiences(family);
  const dashboardDefinition = getFamilyDashboardDefinition(family);
  const [planOpen, setPlanOpen] = React.useState(false);
  if (family === 'team' && !isZavaManager(user)) {
    return <div ref={viewRef} tabIndex={-1} className={styles.dashboardRoot} data-family-view={family} data-role-state="not-manager"><section className={styles.hero} style={{ backgroundImage: theme.heroGradient }}><div className={styles.identity}><Avatar name={user.displayName} image={{ src: user.photoUrl }} size={56} /><span><Text as="h1" size={700} block>{metadata.label}</Text><Text block>Manager access is required for approvals and team absence details.</Text></span></div></section><section className={styles.card}><Text size={500} weight="semibold">No manager workspace assigned</Text><Text className={styles.muted}>Your employee experiences remain available from the other Zava tabs.</Text></section></div>;
  }
  return (
    <div ref={viewRef} tabIndex={-1} className={styles.dashboardRoot} data-family-view={family} data-family-implemented="true">
      <section className={styles.hero} style={{ backgroundImage: theme.heroGradient }}>
        <div className={styles.identity}>
          <Avatar name={user.displayName} image={{ src: user.photoUrl }} size={56} />
          <span><Text as="h1" size={700} block>{metadata.label}</Text><Text block>{dashboardDefinition?.heroState || metadata.placeholderSummary}</Text></span>
        </div>
        <CalendarLtr20Regular fontSize={32} />
      </section>
      {dashboardDefinition && (
        <section className={styles.heroMetrics} aria-label={`${metadata.railLabel} metrics`}>
          {dashboardDefinition.metrics.map((metric) => (
            <div className={styles.heroMetric} key={metric.label}><Text size={500} block weight="bold">{metric.value}</Text><Text size={200} className={styles.muted}>{metric.label}</Text></div>
          ))}
        </section>
      )}
      <section className={styles.priority}>
        <div className={styles.priorityCopy}><Text size={100} className={styles.eyebrow} style={{ color: theme.accentColor }}>{dashboardDefinition?.priorityLabel || `Your ${metadata.railLabel.toLowerCase()} priorities`}</Text><Text weight="semibold">{experiences[0]?.summary}</Text></div>
        <button type="button" className={styles.button} onClick={() => setPlanOpen(true)}>{dashboardDefinition?.actionLabel || `Build my ${metadata.railLabel.toLowerCase()} plan`}</button>
      </section>
      <div className={styles.dashboard}>
        {experiences.map((experience) => (
          <section className={styles.card} key={experience.key} data-family-route={experience.route}>
            <Text size={500} block weight="semibold">{experience.title}</Text>
            <Text className={styles.muted}>{experience.summary}</Text>
            <div className={styles.metrics}>{experience.metrics.map((metric) => <div className={styles.metric} key={metric.label}><Text size={400} block weight="bold">{metric.value}</Text><Text size={200}>{metric.label}</Text></div>)}</div>
            <ExperienceBody intentKey={experience.key} params={initialParams} />
          </section>
        ))}
      </div>
      {planOpen && (
        <AnimatedDetailsPanel
          title={dashboardDefinition?.panelTitle || `Your ${metadata.railLabel.toLowerCase()} plan`}
          reviewingText={`Reviewing your ${metadata.railLabel.toLowerCase()} details...`}
          headline={`Here are the ${experiences.length} details shaping your ${metadata.railLabel.toLowerCase()} picture.`}
          readyText={`Your ${metadata.railLabel.toLowerCase()} details are ready.`}
          items={experiences.map((experience) => ({ id: experience.key, eyebrow: experience.eyebrow, title: experience.title, summary: experience.summary }))}
          footnote="AI-style details are generated locally from deterministic sample data. No AI service is called, and changes are not saved."
          onDismiss={() => setPlanOpen(false)}
        />
      )}
    </div>
  );
};