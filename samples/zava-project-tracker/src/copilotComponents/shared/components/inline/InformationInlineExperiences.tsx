import * as React from 'react';

import { Avatar } from '@fluentui/react-avatar';
import { Text } from '@fluentui/react-text';
import { makeStyles, mergeClasses } from '@griffel/react';
import { tokens } from '@fluentui/react-theme';
import { CheckmarkCircle20Filled, Warning20Regular } from '@fluentui/react-icons';

import { EMBEDDED_FACES } from '../../mockData/embeddedFaces';
import type { IIntentDefinition, IProjectIntentProperties } from '../../models/projectPortfolio';
import type { IIntentTransientState } from '../../models/intentInvocation';
import { CapacityBarChart, PortfolioBubbleChart, PortfolioCapacitySankey, PortfolioTreemapChart, ProgressPieChart, TrendChart, WaterfallChart } from '../charts/InlineCharts';

const useStyles = makeStyles({
  stack: { display: 'flex', flexDirection: 'column', gap: '12px' },
  toolbar: { display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' },
  select: { minHeight: '32px', padding: '5px 8px', color: tokens.colorNeutralForeground1, backgroundColor: tokens.colorNeutralBackground1, border: `1px solid ${tokens.colorNeutralStroke1}`, borderRadius: tokens.borderRadiusMedium },
  toggle: { minHeight: '32px', padding: '5px 9px', color: tokens.colorNeutralForeground2, backgroundColor: tokens.colorNeutralBackground1, border: `1px solid ${tokens.colorNeutralStroke1}`, borderRadius: tokens.borderRadiusMedium, cursor: 'pointer' },
  toggleActive: { color: tokens.colorNeutralForegroundOnBrand, backgroundColor: tokens.colorBrandBackground },
  muted: { color: tokens.colorNeutralForeground3 },
  grid2: { display: 'grid', gridTemplateColumns: 'minmax(0, 1.25fr) minmax(180px, .75fr)', gap: '12px' },
  compact: { gridTemplateColumns: 'minmax(0, 1fr)' },
  panel: { padding: '10px', backgroundColor: tokens.colorNeutralBackground2, borderRadius: tokens.borderRadiusMedium },
  list: { display: 'flex', flexDirection: 'column', borderTop: `1px solid ${tokens.colorNeutralStroke2}` },
  row: { display: 'grid', gridTemplateColumns: '28px minmax(0, 1fr) auto', gap: '8px', alignItems: 'center', padding: '9px 4px', borderBottom: `1px solid ${tokens.colorNeutralStroke2}` },
  rowSelected: { backgroundColor: tokens.colorBrandBackground2 },
  rowButton: { width: '100%', padding: 0, border: 'none', color: 'inherit', backgroundColor: 'transparent', textAlign: 'left', cursor: 'pointer' },
  badge: { padding: '2px 6px', borderRadius: tokens.borderRadiusCircular, color: tokens.colorPaletteMarigoldForeground2, backgroundColor: tokens.colorPaletteMarigoldBackground2, fontSize: tokens.fontSizeBase100 },
  dangerBadge: { color: tokens.colorPaletteRedForeground1, backgroundColor: tokens.colorPaletteRedBackground2 },
  successBadge: { color: tokens.colorPaletteGreenForeground1, backgroundColor: tokens.colorPaletteGreenBackground2 },
  chart: { width: '100%', height: '176px' },
  shortChart: { height: '128px' },
  bars: { display: 'grid', gridTemplateColumns: 'repeat(6, minmax(22px, 1fr))', gap: '8px', alignItems: 'end', minHeight: '142px', padding: '8px 4px 0' },
  barGroup: { display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: '2px', height: '130px' },
  bar: { width: '100%', backgroundColor: tokens.colorBrandBackground, borderRadius: `${tokens.borderRadiusSmall} ${tokens.borderRadiusSmall} 0 0` },
  barWarning: { backgroundColor: tokens.colorPaletteRedBackground3 },
  h68: { height: '68px' }, h72: { height: '72px' }, h74: { height: '74px' }, h76: { height: '76px' },
  h84: { height: '84px' }, h88: { height: '88px' }, h91: { height: '91px' }, h93: { height: '93px' },
  h96: { height: '96px' }, h104: { height: '104px' }, h112: { height: '112px' }, h118: { height: '118px' },
  matrix: { display: 'grid', gridTemplateColumns: 'repeat(5, minmax(35px, 1fr))', gap: '4px' },
  cell: { minHeight: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: tokens.borderRadiusSmall, backgroundColor: tokens.colorNeutralBackground3 },
  cellWarning: { backgroundColor: tokens.colorPaletteMarigoldBackground2 },
  cellDanger: { color: tokens.colorNeutralForegroundOnBrand, backgroundColor: tokens.colorPaletteRedBackground3 },
  timeline: { position: 'relative', display: 'flex', flexDirection: 'column', gap: '8px', padding: '10px 0' },
  timelineRow: { display: 'grid', gridTemplateColumns: '110px minmax(0, 1fr) 42px', gap: '8px', alignItems: 'center' },
  track: { position: 'relative', height: '16px', backgroundColor: tokens.colorNeutralBackground4, borderRadius: tokens.borderRadiusSmall },
  trackFill: { height: '100%', borderRadius: tokens.borderRadiusSmall, backgroundColor: tokens.colorBrandBackground },
  trackRisk: { backgroundColor: tokens.colorPaletteRedBackground3 },
  w31: { width: '31%' }, w35: { width: '35%' }, w43: { width: '43%' }, w57: { width: '57%' },
  w58: { width: '58%' }, w74: { width: '74%' }, w75: { width: '75%' }, w76: { width: '76%' },
  w82: { width: '82%' }, w88: { width: '88%' }, w92: { width: '92%' },
  flow: { display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '18px', alignItems: 'center' },
  flowColumn: { display: 'flex', flexDirection: 'column', gap: '7px' },
  taskColumns: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px', alignItems: 'start' },
  taskCard: { display: 'grid', gridTemplateColumns: '28px minmax(0, 1fr)', gap: '7px', padding: '8px', borderLeft: `3px solid ${tokens.colorBrandStroke1}`, backgroundColor: tokens.colorNeutralBackground2 },
  taskMeta: { display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap' },
  goalGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '12px' },
  pieGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '8px' },
  pieCard: { minWidth: 0, padding: '8px', textAlign: 'center', border: `1px solid ${tokens.colorNeutralStroke2}`, borderRadius: tokens.borderRadiusMedium, backgroundColor: tokens.colorNeutralBackground2 },
  node: { padding: '8px', borderLeft: `3px solid ${tokens.colorBrandStroke1}`, backgroundColor: tokens.colorNeutralBackground2 },
  bubbleArea: { position: 'relative', minHeight: '190px', overflow: 'hidden', backgroundColor: tokens.colorNeutralBackground2, borderRadius: tokens.borderRadiusMedium },
  bubble: { position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid ${tokens.colorNeutralBackground1}`, borderRadius: tokens.borderRadiusCircular, color: tokens.colorNeutralForegroundOnBrand, backgroundColor: tokens.colorBrandBackground, fontSize: tokens.fontSizeBase100, cursor: 'pointer' },
  bubbleAmber: { backgroundColor: tokens.colorPaletteMarigoldBackground3 },
  bubbleRed: { backgroundColor: tokens.colorPaletteRedBackground3 },
  bubble1: { width: '72px', height: '72px', left: '9%', top: '18%' },
  bubble2: { width: '58px', height: '58px', left: '40%', top: '48%' },
  bubble3: { width: '88px', height: '88px', right: '8%', top: '12%' },
  heatmap: { display: 'grid', gridTemplateColumns: '100px repeat(5, minmax(35px, 1fr))', gap: '4px', alignItems: 'center' },
  heat: { minHeight: '30px', borderRadius: tokens.borderRadiusSmall, backgroundColor: tokens.colorPaletteGreenBackground2 },
  heatWarn: { backgroundColor: tokens.colorPaletteMarigoldBackground2 },
  heatDanger: { backgroundColor: tokens.colorPaletteRedBackground2 },
  compare: { display: 'grid', gridTemplateColumns: '120px repeat(2, minmax(0, 1fr))', gap: '5px', alignItems: 'center' },
  compareHeader: { padding: '8px', backgroundColor: tokens.colorNeutralBackground2, borderRadius: tokens.borderRadiusMedium },
  progress: { height: '8px', overflow: 'hidden', backgroundColor: tokens.colorNeutralBackground4, borderRadius: tokens.borderRadiusCircular },
  progressFill: { height: '100%', backgroundColor: tokens.colorBrandBackground },
  radialWrap: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '180px' },
  detail: { padding: '10px', borderLeft: `3px solid ${tokens.colorBrandStroke1}`, backgroundColor: tokens.colorNeutralBackground2 },
  insight: { display: 'grid', gridTemplateColumns: '22px minmax(0, 1fr)', gap: '8px', padding: '9px', color: tokens.colorPaletteMarigoldForeground2, backgroundColor: tokens.colorPaletteMarigoldBackground2, borderRadius: tokens.borderRadiusMedium }
});

const peopleImages: Record<string, string> = {
  Megan: EMBEDDED_FACES['Megan-Bowen'], Pradeep: EMBEDDED_FACES['Pradeep-Gupta'], Joni: EMBEDDED_FACES['Joni-Sherman'], Diego: EMBEDDED_FACES['Diego-Siciliani']
};

export interface IInformationExperienceProps {
  definition: IIntentDefinition;
  properties: IProjectIntentProperties;
  compact: boolean;
  transientState?: IIntentTransientState;
  onTransientStateChange?: (state: IIntentTransientState) => void;
}

const trackWidthClass = (styles: ReturnType<typeof useStyles>, value: number): string => value === 31 ? styles.w31 : value === 35 ? styles.w35 : value === 43 ? styles.w43 : value === 57 ? styles.w57 : value === 58 ? styles.w58 : value === 74 ? styles.w74 : value === 75 ? styles.w75 : value === 76 ? styles.w76 : value === 82 ? styles.w82 : value === 88 ? styles.w88 : styles.w92;

const AttentionList: React.FunctionComponent<IInformationExperienceProps> = ({ compact, transientState, onTransientStateChange }) => {
  const styles = useStyles();
  const [focus, setFocus] = React.useState(transientState?.information?.filter || 'all');
  const [selected, setSelected] = React.useState(transientState?.information?.selectedId || 'Evaluation review');
  const items = [
    ['Evaluation review', 'Customer Service Copilot', 'Due Wed', 'Pradeep', 'critical'],
    ['Weekly status', 'Customer Service Copilot', 'Due Fri', 'Megan', 'warning'],
    ['Time entry', 'Contract Intelligence', '6.5h open', 'Megan', 'normal']
  ].filter((item) => focus === 'all' || item[4] === focus);
  return <div className={styles.stack} data-layout="attention-stack"><div className={styles.toolbar}><select aria-label="Priority filter" className={styles.select} value={focus} onChange={(event) => { const nextFocus=event.currentTarget.value; setFocus(nextFocus); onTransientStateChange?.({ ...transientState, information: { filter: nextFocus, selectedId: selected } }); }}><option value="all">All priorities</option><option value="critical">Critical</option><option value="warning">Due soon</option></select></div><div className={mergeClasses(styles.grid2, compact && styles.compact)}><div className={styles.list}>{items.map((item, index) => <button type="button" key={item[0]} className={styles.rowButton} onClick={() => { setSelected(item[0]); onTransientStateChange?.({ ...transientState, information: { filter: focus, selectedId: item[0] } }); }}><span className={mergeClasses(styles.row, selected === item[0] && styles.rowSelected)}><Avatar name={item[3]} image={{ src: peopleImages[item[3]] }} size={28} /><span><Text block weight="semibold">{index + 1}. {item[0]}</Text><Text size={200}>{item[1]} / reason grounded in delivery impact</Text></span><span className={mergeClasses(styles.badge, item[4] === 'critical' && styles.dangerBadge)}>{item[2]}</span></span></button>)}</div><div className={styles.panel}><Text weight="semibold" block>{selected}</Text><Text size={200} block className={styles.muted}>Selected evidence and the next action stay inline.</Text><TrendChart values={[42, 55, 61, 76, 92, 88]} /></div></div></div>;
};

const TaskBoard: React.FunctionComponent<IInformationExperienceProps> = ({ compact }) => {
  const styles = useStyles(); const [group, setGroup] = React.useState('status'); const [blockedOnly,setBlockedOnly]=React.useState(false);
  const tasks=[
    {id:'T-101',title:'Resolve evaluation dataset quality',project:'Customer Service Copilot',status:'Blocked',due:'Overdue',person:'Pradeep Gupta',imageKey:'Pradeep-Gupta'},
    {id:'T-102',title:'Draft pilot exit narrative',project:'Customer Service Copilot',status:'In progress',due:'Today',person:'Megan Bowen',imageKey:'Megan-Bowen'},
    {id:'T-103',title:'Complete Responsible AI evidence',project:'Customer Service Copilot',status:'Ready',due:'This week',person:'Joni Sherman',imageKey:'Joni-Sherman'},
    {id:'T-104',title:'Benchmark supplier clauses',project:'Contract Intelligence',status:'In progress',due:'Today',person:'Diego Siciliani',imageKey:'Diego-Siciliani'},
    {id:'T-105',title:'Close security exception',project:'Contract Intelligence',status:'Blocked',due:'This week',person:'Megan Bowen',imageKey:'Megan-Bowen'},
    {id:'T-106',title:'Review embedding unit cost',project:'Knowledge Discovery',status:'Ready',due:'Next week',person:'Lee Gu',imageKey:'Lee-Gu'}
  ];
  const visibleTasks=blockedOnly?tasks.filter((task)=>task.status==='Blocked'):tasks;
  const groupKey=(task:typeof tasks[number]):string=>group==='project'?task.project:group==='due'?task.due:task.status;
  const groupOrder=group==='project'?['Customer Service Copilot','Contract Intelligence','Knowledge Discovery']:group==='due'?['Overdue','Today','This week','Next week']:['Blocked','In progress','Ready'];
  const groups=groupOrder.map((name)=>({name,tasks:visibleTasks.filter((task)=>groupKey(task)===name)})).filter((item)=>item.tasks.length>0);
  return <div className={styles.stack} data-layout="task-board"><div className={styles.toolbar}><select aria-label="Task grouping" className={styles.select} value={group} onChange={(event) => setGroup(event.currentTarget.value)}><option value="status">Group by status</option><option value="project">Group by project</option><option value="due">Group by due date</option></select><button type="button" aria-pressed={blockedOnly} className={mergeClasses(styles.toggle,blockedOnly&&styles.toggleActive)} onClick={()=>setBlockedOnly((current)=>!current)}>Blocked only</button><Text size={200} className={styles.muted}>{visibleTasks.length} assignments / {groups.length} {groups.length===1?'group':'groups'}</Text></div><div className={mergeClasses(styles.taskColumns,compact&&styles.compact)}>{groups.map((taskGroup)=><section className={styles.flowColumn} data-task-group={taskGroup.name} key={taskGroup.name}><Text weight="semibold">{taskGroup.name} / {taskGroup.tasks.length}</Text>{taskGroup.tasks.map((task)=><div className={styles.taskCard} data-task-id={task.id} key={task.id}><Avatar name={task.person} image={{src:EMBEDDED_FACES[task.imageKey]}} size={28}/><span><Text block weight="semibold">{task.title}</Text><Text size={100} block className={styles.muted}>{task.project}</Text><span className={styles.taskMeta}><Text size={100}>{task.person}</Text><span className={mergeClasses(styles.badge,task.status==='Blocked'&&styles.dangerBadge,task.status==='Ready'&&styles.successBadge)}>{task.status}</span><Text size={100}>{task.due}</Text></span></span></div>)}</section>)}</div></div>;
};

const CapacityHorizon: React.FunctionComponent<IInformationExperienceProps> = ({ compact }) => {
  const styles = useStyles(); const [scenario, setScenario] = React.useState('committed'); const values = scenario === 'committed' ? [72, 88, 112, 96, 84, 68] : [76, 93, 118, 104, 91, 74];
  return <div className={styles.stack} data-layout="capacity-horizon"><div className={styles.toolbar}><button className={mergeClasses(styles.toggle, scenario === 'committed' && styles.toggleActive)} onClick={() => setScenario('committed')}>Committed</button><button className={mergeClasses(styles.toggle, scenario === 'forecast' && styles.toggleActive)} onClick={() => setScenario('forecast')}>Forecast</button><Text size={200} className={styles.muted}>90% warning band</Text></div><div className={mergeClasses(styles.grid2, compact && styles.compact)}><CapacityBarChart values={values} threshold={90} /><div className={styles.insight}><Warning20Regular /><Text size={200}>Week 3 exceeds capacity. Shift 20% from Contract Intelligence to restore 92% load.</Text></div></div></div>;
};

const GoalFlow: React.FunctionComponent<IInformationExperienceProps> = ({ compact }) => { const styles = useStyles(); const [objective,setObjective]=React.useState('responsible'); const [includeIndirect,setIncludeIndirect]=React.useState(false); const responsible=objective==='responsible'; const keyResults=responsible?[['Production experiences',63],['Controls complete',82]]:[['Resolution time',74],['Adoption target',58]]; const directAssignments=responsible?[['Pilot exit evidence',68],['Evaluation review',24]]:[['Journey analysis',81],['Adoption review',46]]; const assignments=includeIndirect?directAssignments.concat(responsible?[['Control mentoring',37]]:[['Support readiness',33]]):directAssignments; return <div className={styles.stack} data-layout="goal-flow"><div className={styles.toolbar}><select aria-label="Strategic objective" className={styles.select} value={objective} onChange={(event)=>setObjective(event.currentTarget.value)}><option value="responsible">Responsible AI adoption</option><option value="productivity">Customer productivity</option></select><button aria-pressed={includeIndirect} className={mergeClasses(styles.toggle,includeIndirect&&styles.toggleActive)} onClick={()=>setIncludeIndirect((current)=>!current)}>Include indirect</button></div><div className={styles.node}><Text size={100} className={styles.muted} block>Objective</Text><Text weight="semibold">{responsible?'Scale responsible AI':'Improve customer productivity'}</Text></div><div className={mergeClasses(styles.goalGrid,compact&&styles.compact)}><div className={styles.flowColumn}><Text weight="semibold">Key results</Text><div className={mergeClasses(styles.pieGrid,compact&&styles.compact)}>{keyResults.map((item,index)=><div className={styles.pieCard} key={String(item[0])}><ProgressPieChart label={String(item[0])} value={Number(item[1])} tone={index===0?'brand':'green'}/><Text size={200} weight="semibold">{item[0]}</Text></div>)}</div></div><div className={styles.flowColumn}><Text weight="semibold">Your assignments</Text><div className={mergeClasses(styles.pieGrid,compact&&styles.compact)}>{assignments.map((item,index)=><div className={styles.pieCard} key={String(item[0])}><ProgressPieChart label={String(item[0])} value={Number(item[1])} tone={index===0?'marigold':'brand'}/><Text size={200} weight="semibold">{item[0]}</Text></div>)}</div></div></div></div>; };

const HealthRing: React.FunctionComponent<IInformationExperienceProps> = ({ compact }) => { const styles = useStyles(); const [focus, setFocus] = React.useState('delivery'); return <div className={styles.stack} data-layout="health-ring"><div className={styles.toolbar}>{['delivery','financials','value','risk'].map((item)=><button key={item} className={mergeClasses(styles.toggle,focus===item&&styles.toggleActive)} onClick={()=>setFocus(item)}>{item}</button>)}</div><div className={mergeClasses(styles.grid2,compact&&styles.compact)}><div className={styles.radialWrap}><svg width="190" height="190" role="img" aria-label="Project health 76 amber"><circle cx="95" cy="95" r="66" fill="none" stroke={tokens.colorNeutralStroke2} strokeWidth="18"/><circle cx="95" cy="95" r="66" fill="none" stroke={tokens.colorPaletteMarigoldBorderActive} strokeWidth="18" strokeDasharray="315 415" transform="rotate(-90 95 95)"/><text x="95" y="101" textAnchor="middle" fill={tokens.colorNeutralForeground1} fontSize="28">76</text></svg></div><div className={styles.list}>{[['Schedule','-8 days'],['Budget','74% consumed'],['Scope','Stable'],['Value','On plan'],['Risk','3 high']].map((item)=><div className={styles.row} key={item[0]}><span/><Text>{item[0]}</Text><Text weight="semibold">{item[1]}</Text></div>)}<div className={styles.detail}><Text size={200}>{focus}: evaluation readiness drives the current health score.</Text></div></div></div></div>; };

const TimelineView: React.FunctionComponent<IInformationExperienceProps> = ({ compact, definition }) => { const styles=useStyles(); const [criticalOnly,setCriticalOnly]=React.useState(false); const rows=definition.key==='GetProjectMilestones'?[['Pilot exit gate',82,43,true],['RAI evidence',68,31,true],['Production launch',74,57,false]]:[['Evaluation sign-off',66,35,true],['RAI review',78,58,true],['Pilot exit',82,75,false],['Production launch',70,92,false]]; const visibleRows=criticalOnly?rows.filter((row)=>Boolean(row[3])):rows; return <div className={styles.stack} data-layout={definition.key==='GetProjectMilestones'?'milestone-rail':'critical-path-gantt'}><div className={styles.toolbar}><button aria-pressed={criticalOnly} className={mergeClasses(styles.toggle,criticalOnly&&styles.toggleActive)} onClick={()=>setCriticalOnly((current)=>!current)}>Critical only</button></div><div className={styles.timeline}>{visibleRows.map((row,index)=><div className={styles.timelineRow} key={String(row[0])}><Text size={200}>{row[0]}</Text><div className={styles.track}><div className={mergeClasses(styles.trackFill,index===0&&styles.trackRisk,trackWidthClass(styles,Number(row[2])))}/></div><Text size={100}>{row[1]}%</Text></div>)}</div><div className={styles.insight}><Warning20Regular/><Text size={200}>Evaluation sign-off is the predecessor controlling the launch date.</Text></div></div>; };

const RiskMatrix: React.FunctionComponent<IInformationExperienceProps> = ({ compact }) => { const styles=useStyles(); const [selected,setSelected]=React.useState('Evaluation data quality'); return <div className={styles.stack} data-layout="risk-matrix"><div className={mergeClasses(styles.grid2,compact&&styles.compact)}><div className={styles.matrix}>{Array.from({length:25},(_,index)=><button type="button" aria-label={`Risk cell ${index+1}`} key={index} className={mergeClasses(styles.cell,index>13&&styles.cellWarning,index>20&&styles.cellDanger)} onClick={()=>setSelected(index>20?'Evaluation data quality':'Platform dependency')}>{index===24?'20':index===18?'12':''}</button>)}</div><div className={styles.detail}><Text weight="semibold" block>{selected}</Text><Text size={200}>Owner: Pradeep Gupta / mitigation due in 5 days / trend worsening.</Text></div></div></div>; };

const BudgetView: React.FunctionComponent<IInformationExperienceProps> = ({ compact, definition }) => { const styles=useStyles(); const portfolio=definition.key==='GetPortfolioBudgetForecast'; const [scenario,setScenario]=React.useState('forecast'); const [varianceOnly,setVarianceOnly]=React.useState(false); const scenarioValues:Record<string,[number,number,number]>={forecast:[42,-65,897],baseline:[18,-32,906],proposed:[74,-80,914]}; const values=scenarioValues[scenario]; const allSteps=[{label:portfolio?'Funding':'Approved',value:920,total:true},{label:'AI',value:values[0]},{label:'Services',value:values[1]},{label:portfolio?'Outcomes':'EAC',value:values[2],total:true}]; const steps=varianceOnly?allSteps.slice(1,3):allSteps; return <div className={styles.stack} data-layout={portfolio?'portfolio-budget-flow':'budget-waterfall'}><div className={styles.toolbar}><select aria-label="Budget scenario" className={styles.select} value={scenario} onChange={(event)=>setScenario(event.currentTarget.value)}><option value="forecast">Current forecast</option><option value="baseline">Baseline</option><option value="proposed">Proposed</option></select><button aria-pressed={varianceOnly} className={mergeClasses(styles.toggle,varianceOnly&&styles.toggleActive)} onClick={()=>setVarianceOnly((current)=>!current)}>Variance only</button></div><div className={mergeClasses(styles.grid2,compact&&styles.compact)}><div className={styles.panel}><Text size={200}>{scenario} / approved, drivers, and outcome</Text><WaterfallChart steps={steps}/></div><div className={styles.flowColumn}><div className={styles.node}>{portfolio?'Portfolio funding':'Approved'} / $920k</div><div className={styles.node}>AI pressure / +${values[0]}k</div><div className={styles.node}>Services saving / {values[1]}k</div><div className={styles.node}>{portfolio?'Outcomes':'EAC'} / ${values[2]}k</div></div></div></div>; };

const TeamHeatmap: React.FunctionComponent<IInformationExperienceProps> = ({ compact }) => { const styles=useStyles(); const people=['Pradeep','Megan','Diego']; const values=[[118,112,96,84,72],[92,98,88,76,68],[74,82,91,86,78]]; return <div className={styles.stack} data-layout="team-capacity-heatmap"><div className={styles.heatmap}>{people.map((person,row)=><React.Fragment key={person}><Text size={200}>{person}</Text>{values[row].map((value,index)=><div key={index} title={`${person} ${value}%`} className={mergeClasses(styles.heat,value>90&&styles.heatWarn,value>105&&styles.heatDanger)}/>)}</React.Fragment>)}</div><div className={styles.detail}><Text size={200}>Pradeep is overallocated across three projects. Start a non-applied assignment scenario.</Text></div></div>; };

const CompareView: React.FunctionComponent<IInformationExperienceProps> = ({ compact }) => { const styles=useStyles(); const [dimension,setDimension]=React.useState('delivery'); return <div className={styles.stack} data-layout="project-comparison"><div className={styles.toolbar}><Text weight="semibold">Customer Service Copilot</Text><Text>vs</Text><Text weight="semibold">Contract Intelligence</Text></div><div className={styles.toolbar}>{['delivery','financials','value','risk','capacity'].map((item)=><button key={item} aria-pressed={dimension===item} className={mergeClasses(styles.toggle,dimension===item&&styles.toggleActive)} onClick={()=>setDimension(item)}>{item}</button>)}</div><div className={styles.compare}><Text/><div className={styles.compareHeader}><Text weight="semibold">Customer Service</Text></div><div className={styles.compareHeader}><Text weight="semibold">Contract Intelligence</Text></div>{[['Health','Amber','Red'],['Schedule','+8d','+19d'],['Value','$2.8m','$1.9m'],['Capacity','94%','103%']].map((row)=><React.Fragment key={row[0]}><Text size={200}>{row[0]}</Text><div className={styles.panel}>{row[1]}</div><div className={styles.panel}>{row[2]}</div></React.Fragment>)}</div><Text size={200} className={styles.muted}>Highlighted dimension: {dimension}</Text></div>; };

const BubblePortfolio: React.FunctionComponent<IInformationExperienceProps> = ({ compact }) => { const styles=useStyles(); const data=[{id:'CS',label:'Customer Service Copilot',x:82,y:58,value:72,status:'amber' as const,phase:'pilot'},{id:'KD',label:'Knowledge Discovery',x:61,y:34,value:48,status:'green' as const,phase:'execute'},{id:'CI',label:'Contract Intelligence',x:72,y:82,value:92,status:'red' as const,phase:'pilot'}]; const [phase,setPhase]=React.useState('all'); const [atRiskOnly,setAtRiskOnly]=React.useState(false); const [selectedId,setSelectedId]=React.useState('CS'); const visible=data.filter((datum)=>(phase==='all'||datum.phase===phase)&&(!atRiskOnly||datum.status==='red')); const selected=visible.find((datum)=>datum.id===selectedId) || visible[0]; return <div className={styles.stack} data-layout="portfolio-value-risk-bubbles"><div className={styles.toolbar}><select aria-label="Portfolio phase" className={styles.select} value={phase} onChange={(event)=>setPhase(event.currentTarget.value)}><option value="all">All phases</option><option value="pilot">Pilot</option><option value="execute">Execute</option><option value="discover">Discover</option></select><button aria-pressed={atRiskOnly} className={mergeClasses(styles.toggle,atRiskOnly&&styles.toggleActive)} onClick={()=>setAtRiskOnly((current)=>!current)}>At risk only</button></div>{visible.length===0?<div className={styles.panel} role="status"><Text weight="semibold" block>No projects match</Text><Text size={200}>Change the phase or risk filter to restore portfolio results.</Text></div>:<div className={mergeClasses(styles.grid2,compact&&styles.compact)}><PortfolioBubbleChart data={visible} selectedId={selected.id} onSelect={setSelectedId}/><div className={styles.detail}><Text weight="semibold" block>{selected.label}</Text><Text size={200}>Investment, value, risk, sponsor, and top exception synchronized with bubble selection.</Text></div></div>}</div>; };

const StrategicFlow: React.FunctionComponent<IInformationExperienceProps> = ({ compact, definition }) => { const styles=useStyles(); const capacity=definition.key==='GetPortfolioCapacity'; const [includeUnaligned,setIncludeUnaligned]=React.useState(false); if(capacity) return <div className={styles.stack} data-layout="portfolio-capacity-flow"><div className={styles.toolbar}><Text size={200} className={styles.muted}>AI platform / 8.4 FTE available</Text></div><PortfolioCapacitySankey/><div className={styles.insight}><Warning20Regular/><Text size={200}>AI review demand consumes 4.2 FTE; Contract Intelligence carries the tightest data-capacity constraint.</Text></div></div>; return <div className={styles.stack} data-layout="strategic-alignment-flow"><div className={styles.toolbar}><button aria-pressed={includeUnaligned} className={mergeClasses(styles.toggle,includeUnaligned&&styles.toggleActive)} onClick={()=>setIncludeUnaligned((current)=>!current)}>Include unaligned</button></div><div className={mergeClasses(styles.flow,compact&&styles.compact)}><div className={styles.flowColumn}><Text weight="semibold">Objectives</Text><div className={styles.node}>Scale responsible AI</div></div><div className={styles.flowColumn}><Text weight="semibold">Key results</Text><div className={styles.node}>82% controls</div><div className={styles.node}>5 production agents</div></div><div className={styles.flowColumn}><Text weight="semibold">Projects</Text><div className={styles.node}>Customer Service</div><div className={styles.node}>Contract Intelligence</div>{includeUnaligned&&<div className={styles.node}>Supplier Insights / unaligned</div>}</div></div></div>; };

const Roadmap: React.FunctionComponent<IInformationExperienceProps> = ({ compact }) => { const styles=useStyles(); return <div className={styles.stack} data-layout="portfolio-roadmap"><Text size={200} className={styles.muted}>Next two quarters / dependencies and stage gates included</Text><div className={styles.timeline}>{[['Customer Service',82,74],['Contract Intelligence',58,88],['Knowledge Platform',92,61],['Responsible AI',76,48]].map((row,index)=><div className={styles.timelineRow} key={row[0]}><Text size={200}>{row[0]}</Text><div className={styles.track}><div className={mergeClasses(styles.trackFill,index===1&&styles.trackRisk,trackWidthClass(styles,Number(row[1])))}/></div><Text size={100}>Q{index%2+3}</Text></div>)}</div><div className={styles.insight}><Warning20Regular/><Text size={200}>Two launches collide with the shared platform release and review capacity.</Text></div></div>; };

const Treemap: React.FunctionComponent<IInformationExperienceProps> = ({ compact }) => { const styles=useStyles(); const [metric,setMetric]=React.useState('cost'); const [byModel,setByModel]=React.useState(false); const colors=[tokens.colorBrandBackground,tokens.colorPaletteBerryBackground3,tokens.colorPaletteLightTealBackground2,tokens.colorPaletteMarigoldBackground3]; const configs:Record<string,{shares:number[];trend:number[];label:string;narrative:string}>={cost:{shares:[31,24,18,27],trend:[34,42,48,55,67,79],label:'Cost',narrative:'Evaluation workloads grow fastest; production unit economics improve.'},tokens:{shares:[38,18,29,15],trend:[420,510,620,760,910,1080],label:'Token volume',narrative:'Customer Service drives token volume while Knowledge Discovery accelerates.'},unit:{shares:[22,35,18,25],trend:[58,54,49,46,43,42],label:'Unit cost',narrative:'Contract Intelligence has the highest unit-cost share; portfolio unit cost is falling.'}}; const config=configs[metric]; const projectNames=['Customer Service','Contract Intelligence','Knowledge Discovery','Evaluation']; const modelNames=['GPT-5','GPT-5 mini','Embedding','Other']; const modelShares:Record<string,number[]>={cost:[42,28,17,13],tokens:[35,41,16,8],unit:[48,22,19,11]}; const names=byModel?modelNames:projectNames; const shares=byModel?modelShares[metric]:config.shares; const data=names.map((name,index)=>({name,value:shares[index],color:colors[index]})); return <div className={styles.stack} data-layout="portfolio-ai-treemap"><div className={styles.toolbar}><select aria-label="AI spend metric" className={styles.select} value={metric} onChange={(event)=>setMetric(event.currentTarget.value)}><option value="cost">Cost</option><option value="tokens">Tokens</option><option value="unit">Unit cost</option></select><button aria-pressed={byModel} className={mergeClasses(styles.toggle,byModel&&styles.toggleActive)} onClick={()=>setByModel((current)=>!current)}>By model</button></div><div className={mergeClasses(styles.grid2,compact&&styles.compact)}><PortfolioTreemapChart data={data} ariaLabel={`${config.label} treemap by ${byModel?'model':'project'}`}/><div className={styles.detail}><Text weight="semibold" block>{config.label} concentration</Text><Text size={200}>{config.narrative}</Text><TrendChart values={config.trend} ariaLabel={`${config.label} trend`}/></div></div></div>; };

const RiskNetwork: React.FunctionComponent<IInformationExperienceProps> = ({ compact }) => { const styles=useStyles(); const [showDependencies,setShowDependencies]=React.useState(true); return <div className={styles.stack} data-layout="portfolio-risk-network"><div className={styles.toolbar}><button aria-pressed={showDependencies} className={mergeClasses(styles.toggle,showDependencies&&styles.toggleActive)} onClick={()=>setShowDependencies((current)=>!current)}>Dependencies</button></div><div className={mergeClasses(styles.grid2,compact&&styles.compact)}><div className={styles.radialWrap}><svg width="210" height="190" role="img" aria-label="Systemic project risk network">{showDependencies&&<><line x1="105" y1="95" x2="45" y2="38" stroke={tokens.colorPaletteRedBorderActive} strokeWidth="5"/><line x1="105" y1="95" x2="168" y2="42" stroke={tokens.colorPaletteMarigoldBorderActive} strokeWidth="3"/><line x1="105" y1="95" x2="174" y2="145" stroke={tokens.colorBrandStroke1} strokeWidth="2"/></>}<circle cx="105" cy="95" r="30" fill={tokens.colorPaletteRedBackground3}/><circle cx="45" cy="38" r="20" fill={tokens.colorPaletteMarigoldBackground3}/><circle cx="168" cy="42" r="24" fill={tokens.colorBrandBackground}/><circle cx="174" cy="145" r="18" fill={tokens.colorPaletteLightTealBackground2}/></svg></div><div className={styles.list}><div className={styles.row}><span/><Text>Shared platform release</Text><span className={styles.dangerBadge}>3 projects</span></div><div className={styles.row}><span/><Text>AI review capacity</Text><span className={styles.badge}>2 projects</span></div><div className={styles.row}><span/><Text>Supplier security</Text><span className={styles.badge}>1 project</span></div></div></div></div>; };

const MyVisualDispatcher: React.FunctionComponent<IInformationExperienceProps> = (props) => {
  const styles = useStyles();
  switch(props.definition.key){
    case 'GetMyWorkSummary': return <AttentionList {...props}/>;
    case 'GetMyTasks': return <TaskBoard {...props}/>;
    case 'GetMyCapacity': return <CapacityHorizon {...props}/>;
    case 'GetMyGoalContributions': return <GoalFlow {...props}/>;
    case 'GetProjectHealth': return <HealthRing {...props}/>;
    case 'GetProjectTimeline': case 'GetProjectMilestones': return <TimelineView {...props}/>;
    case 'GetProjectRisks': return <RiskMatrix {...props}/>;
    case 'GetProjectBudget': case 'GetPortfolioBudgetForecast': return <BudgetView {...props}/>;
    case 'GetProjectTeamCapacity': return <TeamHeatmap {...props}/>;
    case 'CompareProjects': return <CompareView {...props}/>;
    case 'GetPortfolioHealth': return <BubblePortfolio {...props}/>;
    case 'GetStrategicAlignment': case 'GetPortfolioCapacity': return <StrategicFlow {...props}/>;
    case 'GetPortfolioRoadmap': return <Roadmap {...props}/>;
    case 'GetPortfolioAiSpend': return <Treemap {...props}/>;
    case 'GetPortfolioRiskExposure': return <RiskNetwork {...props}/>;
    default: return <div className={styles.panel}><CheckmarkCircle20Filled/> Information experience ready.</div>;
  }
};

interface IInformationErrorBoundaryState { hasError: boolean }

export class InformationErrorBoundary extends React.Component<{ children: React.ReactNode }, IInformationErrorBoundaryState> {
  public state: IInformationErrorBoundaryState = { hasError: false };

  public static getDerivedStateFromError(): IInformationErrorBoundaryState {
    return { hasError: true };
  }

  public render(): React.ReactNode {
    if (this.state.hasError) {
      return <div data-layout="information-error" role="alert"><Text weight="semibold" block>Unable to render this view</Text><Text size={200} block>The mocked portfolio data could not be visualized.</Text><button type="button" onClick={() => this.setState({ hasError: false })}>Try again</button></div>;
    }
    return this.props.children;
  }
}

const InformationInlineExperiences: React.FunctionComponent<IInformationExperienceProps> = (props) => <InformationErrorBoundary><MyVisualDispatcher {...props}/></InformationErrorBoundary>;

export default InformationInlineExperiences;
