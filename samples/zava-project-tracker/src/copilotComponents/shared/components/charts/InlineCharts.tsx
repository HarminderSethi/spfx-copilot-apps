import * as React from 'react';

import { max, min } from 'd3-array';
import { hierarchy, treemap } from 'd3-hierarchy';
import { scaleBand, scaleLinear, scaleSqrt } from 'd3-scale';
import { sankey, sankeyLinkHorizontal } from 'd3-sankey';
import { arc, area, curveMonotoneX, line, pie } from 'd3-shape';
import { makeStyles } from '@griffel/react';
import { tokens } from '@fluentui/react-theme';

const useStyles = makeStyles({
  chart: {
    display: 'block',
    width: '100%',
    height: '176px',
    overflow: 'visible',
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorNeutralBackground2
  },
  shortChart: { height: '142px' },
  progressPie: { display: 'block', width: '100%', height: '112px', overflow: 'visible' },
  bubble: { cursor: 'pointer', ':focus': { outline: 'none' } }
});

const GRID_LINES = [0, 1, 2, 3];

export interface IProgressPieChartProps {
  label: string;
  value: number;
  tone?: 'brand' | 'green' | 'marigold';
}

export const ProgressPieChart: React.FunctionComponent<IProgressPieChartProps> = ({ label, value, tone = 'brand' }) => {
  const styles = useStyles();
  const progress = Math.max(0, Math.min(100, value));
  const slices = pie<number>().sort(null).value((slice) => slice)([progress, 100 - progress]);
  const segment = arc<typeof slices[number]>().innerRadius(32).outerRadius(47).cornerRadius(5);
  const progressColor = tone === 'green' ? tokens.colorPaletteGreenBackground3 : tone === 'marigold' ? tokens.colorPaletteMarigoldBackground3 : tokens.colorBrandBackground;

  return <svg className={styles.progressPie} viewBox="0 0 116 112" role="img" aria-label={`${label}: ${progress}% complete`}>
    <title>{label}</title><desc>{progress} percent complete and {100 - progress} percent remaining.</desc>
    <g transform="translate(58 54)">
      {slices.map((slice, index) => <path key={index} d={segment(slice) || ''} fill={index === 0 ? progressColor : tokens.colorNeutralBackground4} stroke={tokens.colorNeutralBackground1} strokeWidth="2" />)}
      <circle r="26" fill={tokens.colorNeutralBackground1} />
      <text y="2" textAnchor="middle" fill={tokens.colorNeutralForeground1} fontSize="18" fontWeight="700">{progress}%</text>
      <text y="17" textAnchor="middle" fill={tokens.colorNeutralForeground3} fontSize="8">complete</text>
    </g>
  </svg>;
};

export interface ITrendChartProps {
  values: number[];
  labels?: string[];
  forecast?: boolean;
  ariaLabel?: string;
}

export const TrendChart: React.FunctionComponent<ITrendChartProps> = ({ values, labels = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'], forecast, ariaLabel = 'Trend over six periods' }) => {
  const styles = useStyles();
  const lower = Math.max(0, (min(values) || 0) - 12);
  const upper = (max(values) || 100) + 12;
  const x = scaleLinear().domain([0, Math.max(values.length - 1, 1)]).range([24, 292]);
  const y = scaleLinear().domain([lower, upper]).range([145, 18]);
  const trendLine = line<number>().x((_value, index) => x(index)).y((value) => y(value)).curve(curveMonotoneX)(values) || '';
  const trendArea = area<number>().x((_value, index) => x(index)).y0(145).y1((value) => y(value)).curve(curveMonotoneX)(values) || '';
  const stroke = forecast ? tokens.colorPaletteMarigoldBorderActive : tokens.colorBrandStroke1;

  return <svg className={styles.chart} viewBox="0 0 316 176" role="img" aria-label={ariaLabel}>
    <title>{ariaLabel}</title><desc>Values move from {values[0]} to {values[values.length - 1]} over {values.length} periods.</desc>
    {GRID_LINES.map((gridLine) => { const gridY = 18 + gridLine * 42; return <line key={gridLine} x1="24" y1={gridY} x2="292" y2={gridY} stroke={tokens.colorNeutralStroke2} strokeDasharray="2 5" />; })}
    <path d={trendArea} fill={stroke} opacity=".11" />
    <path d={trendLine} fill="none" stroke={stroke} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={forecast ? '7 5' : undefined} />
    {values.map((value, index) => <g key={index}><circle cx={x(index)} cy={y(value)} r="4" fill={tokens.colorNeutralBackground1} stroke={stroke} strokeWidth="2" /><text x={x(index)} y={y(value) - 9} textAnchor="middle" fill={tokens.colorNeutralForeground2} fontSize="9">{value}</text><text x={x(index)} y="163" textAnchor="middle" fill={tokens.colorNeutralForeground3} fontSize="9">{labels[index] || `P${index + 1}`}</text></g>)}
  </svg>;
};

export const CapacityBarChart: React.FunctionComponent<{ values: number[]; threshold?: number }> = ({ values, threshold = 90 }) => {
  const styles = useStyles();
  const labels = values.map((_value, index) => `W${index + 1}`);
  const x = scaleBand<string>().domain(labels).range([26, 294]).padding(.28);
  const y = scaleLinear().domain([0, Math.max(125, (max(values) || 100) + 5)]).range([148, 18]);
  const thresholdY = y(threshold);
  return <svg className={styles.chart} viewBox="0 0 316 176" role="img" aria-label={`Capacity by week with a ${threshold}% warning threshold`}>
    <title>Capacity horizon</title><desc>Weekly capacity peaks at {max(values)} percent.</desc>
    <rect x="26" y="18" width="268" height={Math.max(0, thresholdY - 18)} fill={tokens.colorPaletteMarigoldBackground2} opacity=".42" />
    <line x1="26" y1={thresholdY} x2="294" y2={thresholdY} stroke={tokens.colorPaletteMarigoldBorderActive} strokeDasharray="5 4" />
    <text x="292" y={thresholdY - 5} textAnchor="end" fill={tokens.colorPaletteMarigoldForeground2} fontSize="9">{threshold}% threshold</text>
    {values.map((value, index) => { const barX = x(labels[index]) || 0; const barY = y(value); const fill = value > 100 ? tokens.colorPaletteRedBackground3 : value > threshold ? tokens.colorPaletteMarigoldBackground3 : tokens.colorBrandBackground; return <g key={labels[index]}><rect x={barX} y={barY} width={x.bandwidth()} height={148 - barY} rx="4" fill={fill} /><text x={barX + x.bandwidth() / 2} y={barY - 6} textAnchor="middle" fill={tokens.colorNeutralForeground2} fontSize="9">{value}%</text><text x={barX + x.bandwidth() / 2} y="163" textAnchor="middle" fill={tokens.colorNeutralForeground3} fontSize="9">{labels[index]}</text></g>; })}
  </svg>;
};

interface IWaterfallStep { label: string; value: number; total?: boolean }

export const WaterfallChart: React.FunctionComponent<{ steps: IWaterfallStep[] }> = ({ steps }) => {
  const styles = useStyles();
  let running = 0;
  const positioned = steps.map((step) => { const start = step.total ? 0 : running; const end = step.total ? step.value : running + step.value; running = end; return { ...step, start, end }; });
  const extents = positioned.reduce<number[]>((values, step) => values.concat(step.start, step.end), []);
  const upper = (max(extents) || 100) * 1.12;
  const lower = Math.min(0, min(extents) || 0);
  const x = scaleBand<string>().domain(steps.map((step) => step.label)).range([18, 300]).padding(.3);
  const y = scaleLinear().domain([lower, upper]).range([118, 14]);
  return <svg className={`${styles.chart} ${styles.shortChart}`} viewBox="0 0 316 142" role="img" aria-label="Budget waterfall from approved funding to forecast">
    <title>Budget waterfall</title><desc>Budget changes from {steps[0].value} to {steps[steps.length - 1].value} thousand dollars.</desc>
    <line x1="18" y1={y(0)} x2="300" y2={y(0)} stroke={tokens.colorNeutralStroke1} />
    {positioned.map((step, index) => { const barX = x(step.label) || 0; const top = y(Math.max(step.start, step.end)); const bottom = y(Math.min(step.start, step.end)); const fill = step.total ? tokens.colorBrandBackground : step.value < 0 ? tokens.colorPaletteGreenBackground3 : tokens.colorPaletteMarigoldBackground3; return <g key={step.label}>{index > 0 && <line x1={(x(positioned[index - 1].label) || 0) + x.bandwidth()} y1={y(step.start)} x2={barX} y2={y(step.start)} stroke={tokens.colorNeutralStroke1} strokeDasharray="2 3" />}<rect x={barX} y={top} width={x.bandwidth()} height={Math.max(3, bottom - top)} rx="3" fill={fill} /><text x={barX + x.bandwidth() / 2} y={top - 5} textAnchor="middle" fill={tokens.colorNeutralForeground2} fontSize="9">{step.value > 0 && !step.total ? '+' : ''}{step.value}</text><text x={barX + x.bandwidth() / 2} y="134" textAnchor="middle" fill={tokens.colorNeutralForeground3} fontSize="8">{step.label}</text></g>; })}
  </svg>;
};

export interface IBubbleDatum { id: string; label: string; x: number; y: number; value: number; status: 'green' | 'amber' | 'red' }

export const PortfolioBubbleChart: React.FunctionComponent<{ data: IBubbleDatum[]; selectedId: string; onSelect: (id: string) => void }> = ({ data, selectedId, onSelect }) => {
  const styles = useStyles();
  const x = scaleLinear().domain([0, 100]).range([42, 282]);
  const y = scaleLinear().domain([0, 100]).range([145, 24]);
  const radius = scaleSqrt().domain([0, max(data, (datum) => datum.value) || 1]).range([14, 34]);
  return <svg className={styles.chart} viewBox="0 0 316 176" role="img" aria-label="Portfolio value and risk bubble chart">
    <title>Portfolio value and risk</title><desc>Bubble size represents investment. Horizontal position represents expected value and vertical position represents risk.</desc>
    {GRID_LINES.slice(1).map((gridLine) => <React.Fragment key={gridLine}><line x1={42 + gridLine * 60} y1="20" x2={42 + gridLine * 60} y2="148" stroke={tokens.colorNeutralStroke2} strokeDasharray="2 5" /><line x1="38" y1={24 + gridLine * 35} x2="288" y2={24 + gridLine * 35} stroke={tokens.colorNeutralStroke2} strokeDasharray="2 5" /></React.Fragment>)}
    <text x="286" y="166" textAnchor="end" fill={tokens.colorNeutralForeground3} fontSize="9">Higher value</text><text x="9" y="23" fill={tokens.colorNeutralForeground3} fontSize="9">Risk</text>
    {data.map((datum) => { const fill = datum.status === 'red' ? tokens.colorPaletteRedBackground3 : datum.status === 'amber' ? tokens.colorPaletteMarigoldBackground3 : tokens.colorBrandBackground; const selected = datum.id === selectedId; return <g key={datum.id} className={styles.bubble} role="button" tabIndex={0} aria-label={`${datum.label}, value ${datum.x}, risk ${datum.y}`} onClick={() => onSelect(datum.id)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') onSelect(datum.id); }}><circle cx={x(datum.x)} cy={y(datum.y)} r={radius(datum.value)} fill={fill} opacity={selected ? 1 : .78} stroke={selected ? tokens.colorNeutralForeground1 : tokens.colorNeutralBackground1} strokeWidth={selected ? 3 : 2} /><text x={x(datum.x)} y={y(datum.y) + 3} textAnchor="middle" fill={tokens.colorNeutralForegroundOnBrand} fontSize="9" fontWeight="700">{datum.id}</text></g>; })}
  </svg>;
};

interface ITreemapDatum { name: string; value: number; color: string }
interface ITreemapNode { name: string; value?: number; color?: string; children?: ITreemapNode[] }

export const PortfolioTreemapChart: React.FunctionComponent<{ data: ITreemapDatum[]; ariaLabel?: string }> = ({ data, ariaLabel = 'AI spend treemap by project' }) => {
  const styles = useStyles();
  const rootData: ITreemapNode = { name: 'portfolio', children: data };
  const root = treemap<ITreemapNode>().size([308, 168]).paddingInner(4).paddingOuter(4).round(true)(hierarchy(rootData).sum((datum) => Number(datum.value || 0)));
  return <svg className={styles.chart} viewBox="0 0 316 176" role="img" aria-label={ariaLabel}>
    <title>{ariaLabel}</title><desc>Rectangle size represents each project's share of the selected metric.</desc>
    {root.leaves().map((leaf) => { const datum = leaf.data; const width = leaf.x1 - leaf.x0; return <g key={datum.name}><rect x={leaf.x0} y={leaf.y0} width={width} height={leaf.y1 - leaf.y0} rx="5" fill={datum.color} /><text x={leaf.x0 + 7} y={leaf.y0 + 17} fill={tokens.colorNeutralForegroundOnBrand} fontSize="9" fontWeight="700">{width > 74 ? datum.name : datum.name.slice(0, 3)}</text><text x={leaf.x0 + 7} y={leaf.y0 + 31} fill={tokens.colorNeutralForegroundOnBrand} fontSize="9">{datum.value}%</text></g>; })}
  </svg>;
};

interface ISankeyNode { name: string; tone: 'supply' | 'gap' | 'project' }
interface ISankeyLink { source: string; target: string; value: number }

export const PortfolioCapacitySankey: React.FunctionComponent = () => {
  const styles = useStyles();
  const graph = sankey<ISankeyNode, ISankeyLink>()
    .nodeId((node) => node.name)
    .nodeWidth(13)
    .nodePadding(15)
    .extent([[12, 12], [304, 164]])({
      nodes: [
        { name: 'Available', tone: 'supply' },
        { name: 'AI review', tone: 'gap' },
        { name: 'Data', tone: 'gap' },
        { name: 'Customer Service', tone: 'project' },
        { name: 'Contract Intel', tone: 'project' }
      ],
      links: [
        { source: 'Available', target: 'AI review', value: 4.2 },
        { source: 'Available', target: 'Data', value: 1.3 },
        { source: 'AI review', target: 'Customer Service', value: 2.7 },
        { source: 'AI review', target: 'Contract Intel', value: 1.5 },
        { source: 'Data', target: 'Customer Service', value: .5 },
        { source: 'Data', target: 'Contract Intel', value: .8 }
      ]
    });
  const linkPath = sankeyLinkHorizontal<ISankeyNode, ISankeyLink>();

  return <svg className={styles.chart} viewBox="0 0 316 176" role="img" aria-label="Portfolio capacity Sankey from available supply through role demand to projects">
    <title>Portfolio capacity flow</title><desc>Available capacity flows through AI review and data roles into Customer Service and Contract Intelligence.</desc>
    {graph.links.map((link, index) => <path key={index} d={linkPath(link) || ''} fill="none" stroke={index < 2 ? tokens.colorPaletteMarigoldBorderActive : tokens.colorBrandStroke1} strokeWidth={Math.max(2, link.width || 0)} opacity=".42" />)}
    {graph.nodes.map((node) => { const fill = node.tone === 'supply' ? tokens.colorPaletteGreenBackground3 : node.tone === 'gap' ? tokens.colorPaletteMarigoldBackground3 : tokens.colorBrandBackground; const labelX = (node.x0 || 0) < 150 ? (node.x1 || 0) + 5 : (node.x0 || 0) - 5; const anchor = (node.x0 || 0) < 150 ? 'start' : 'end'; return <g key={node.name}><rect x={node.x0} y={node.y0} width={(node.x1 || 0) - (node.x0 || 0)} height={(node.y1 || 0) - (node.y0 || 0)} rx="4" fill={fill} /><text x={labelX} y={((node.y0 || 0) + (node.y1 || 0)) / 2 + 3} textAnchor={anchor} fill={tokens.colorNeutralForeground2} fontSize="8">{node.name}</text></g>; })}
  </svg>;
};