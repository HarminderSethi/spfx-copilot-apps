import * as React from 'react';
import { scaleBand, scaleLinear, scalePoint } from 'd3-scale';
import { arc, area, curveMonotoneX, line } from 'd3-shape';

import type { IBabylonChartModel, IBabylonMark } from '../babylon/chartModels';

import styles from './D3InlineChart.module.scss';

const WIDTH = 760;
const HEIGHT = 330;

export interface ID3InlineChartProps {
  readonly isDark: boolean;
  readonly model: IBabylonChartModel;
  readonly selectedId?: string;
  readonly onSelect: (markId: string) => void;
}

function safeId(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

function displayValue(mark: IBabylonMark, model: IBabylonChartModel): string {
  if (model.valueFormat === 'percent') return `${mark.value}%`;
  if (model.valueFormat === 'currency') return `$${Math.round(mark.value).toLocaleString('en-US')}`;
  return Math.round(mark.value).toLocaleString('en-US');
}

function SelectableMark(props: { readonly mark: IBabylonMark; readonly selected: boolean; readonly onSelect: (id: string) => void; readonly children: React.ReactNode }): React.ReactElement {
  return (
    <g
      aria-label={`${props.mark.label}: ${props.mark.value}`}
      className={styles.selectable}
      data-selected={props.selected}
      onClick={() => props.onSelect(props.mark.id)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          props.onSelect(props.mark.id);
        }
      }}
      role="button"
      tabIndex={0}
    >
      <title>{props.mark.label}: {props.mark.value}</title>
      {props.children}
    </g>
  );
}

function RingChart(props: ID3InlineChartProps): React.ReactElement {
  const centerX = 238;
  const centerY = 164;
  const selected = props.model.marks.find((mark) => mark.id === props.selectedId) ?? props.model.marks[0];
  return (
    <>
      <defs><filter id="ring-shadow" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#18353d" floodOpacity="0.16" /></filter></defs>
      <g transform={`translate(${centerX} ${centerY})`} filter="url(#ring-shadow)">
        {props.model.marks.slice(0, 4).map((mark, index) => {
          const outerRadius = 114 - index * 22;
          const innerRadius = outerRadius - 10;
          const trackPath = arc()({ innerRadius, outerRadius, startAngle: -Math.PI / 2, endAngle: Math.PI * 1.5 });
          const valuePath = arc().cornerRadius(5)({ innerRadius, outerRadius, startAngle: -Math.PI / 2, endAngle: -Math.PI / 2 + Math.PI * 2 * Math.min(mark.value, 100) / 100 });
          return <SelectableMark key={mark.id} mark={mark} selected={props.selectedId === mark.id} onSelect={props.onSelect}><path className={styles.ringTrack} d={trackPath ?? ''} /><path className={styles.ringValue} d={valuePath ?? ''} fill={mark.color} /></SelectableMark>;
        })}
        <text className={styles.ringMainValue} textAnchor="middle" y="-2">{displayValue(selected, props.model)}</text>
        <text className={styles.ringMainLabel} textAnchor="middle" y="19">{selected.label}</text>
      </g>
      <g transform="translate(430 74)">
        {props.model.marks.slice(0, 4).map((mark, index) => <g key={mark.id} transform={`translate(0 ${index * 50})`}><circle cx="6" cy="5" fill={mark.color} r="6" /><text className={styles.legendLabel} x="22" y="1">{mark.label}</text><text className={styles.legendValue} x="22" y="19">{displayValue(mark, props.model)}</text></g>)}
      </g>
    </>
  );
}

function LineChart(props: ID3InlineChartProps): React.ReactElement {
  const x = scalePoint<string>().domain(props.model.marks.map((mark) => mark.id)).range([66, WIDTH - 44]).padding(0.45);
  const maximum = Math.max(...props.model.marks.map((mark) => mark.value), 1);
  const y = scaleLinear().domain([0, maximum * 1.18]).nice().range([HEIGHT - 54, 38]);
  const points = props.model.marks.map((mark) => [x(mark.id) ?? 0, y(mark.value)] as [number, number]);
  const linePath = line<[number, number]>().x((point) => point[0]).y((point) => point[1]).curve(curveMonotoneX)(points) ?? '';
  const areaPath = area<[number, number]>().x((point) => point[0]).y0(HEIGHT - 54).y1((point) => point[1]).curve(curveMonotoneX)(points) ?? '';
  const ticks = y.ticks(4);
  return (
    <>
      <defs><linearGradient id="trend-area" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#00a6b2" stopOpacity="0.32" /><stop offset="100%" stopColor="#00a6b2" stopOpacity="0.02" /></linearGradient><linearGradient id="trend-line" x1="0" x2="1"><stop offset="0%" stopColor="#1678c2" /><stop offset="100%" stopColor="#00a6b2" /></linearGradient></defs>
      {ticks.map((tick) => <g key={tick}><line className={styles.gridLine} x1="66" x2={WIDTH - 44} y1={y(tick)} y2={y(tick)} /><text className={styles.axisLabel} textAnchor="end" x="56" y={y(tick) + 4}>{tick}</text></g>)}
      <path d={areaPath} fill="url(#trend-area)" />
      <path className={styles.trendLine} d={linePath} stroke="url(#trend-line)" />
      {props.model.marks.map((mark) => <SelectableMark key={mark.id} mark={mark} selected={props.selectedId === mark.id} onSelect={props.onSelect}><circle className={styles.pointHalo} cx={x(mark.id)} cy={y(mark.value)} r="9" /><circle className={styles.linePoint} cx={x(mark.id)} cy={y(mark.value)} fill={mark.color} r="5" /><text className={styles.pointValue} textAnchor="middle" x={x(mark.id)} y={y(mark.value) - 14}>{displayValue(mark, props.model)}</text><text className={styles.axisLabel} textAnchor="middle" x={x(mark.id)} y={HEIGHT - 30}>{mark.label}</text></SelectableMark>)}
    </>
  );
}

function BarChart(props: ID3InlineChartProps): React.ReactElement {
  const left = 154;
  const right = WIDTH - 70;
  const y = scaleBand<string>().domain(props.model.marks.map((mark) => mark.id)).range([38, HEIGHT - 34]).padding(0.3);
  const maximum = Math.max(...props.model.marks.map((mark) => mark.value), 1);
  const x = scaleLinear().domain([0, maximum * 1.08]).range([left, right]);
  return (
    <>
      <defs>{props.model.marks.map((mark) => <linearGradient id={`bar-${safeId(mark.id)}`} key={mark.id} x1="0" x2="1"><stop offset="0%" stopColor={mark.color} stopOpacity="0.78" /><stop offset="100%" stopColor={mark.color} /></linearGradient>)}</defs>
      {props.model.marks.slice(0, 7).map((mark) => {
        const top = y(mark.id) ?? 0;
        const height = y.bandwidth();
        const width = x(mark.value) - left;
        const depth = 7;
        return <SelectableMark key={mark.id} mark={mark} selected={props.selectedId === mark.id} onSelect={props.onSelect}><text className={styles.barLabel} textAnchor="end" x={left - 12} y={top + height / 2 + 4}>{mark.label}</text><rect className={styles.barTrack} x={left} y={top} width={right - left} height={height} rx="4" /><rect className={styles.barFace} fill={`url(#bar-${safeId(mark.id)})`} x={left} y={top} width={Math.max(2, width)} height={height} rx="4" /><path className={styles.barTop} d={`M${left},${top} l${depth},-${depth} h${Math.max(0, width - depth)} l0,${depth} z`} fill={mark.color} /><path className={styles.barSide} d={`M${left + width},${top} l${depth},-${depth} v${height} l-${depth},${depth} z`} fill={mark.color} /><text className={styles.barValue} x={Math.min(right - 4, left + width + 13)} y={top + height / 2 + 4}>{displayValue(mark, props.model)}</text></SelectableMark>;
      })}
    </>
  );
}

function CapacityChart(props: ID3InlineChartProps): React.ReactElement {
  const x = scaleBand<string>().domain(props.model.marks.map((mark) => mark.id)).range([52, WIDTH - 36]).padding(0.28);
  const maximum = Math.max(...props.model.marks.map((mark) => Math.max(mark.value, mark.secondaryValue ?? 0)), 1);
  const y = scaleLinear().domain([0, maximum * 1.12]).nice().range([HEIGHT - 54, 36]);
  return (
    <>
      {y.ticks(4).map((tick) => <line className={styles.gridLine} key={tick} x1="52" x2={WIDTH - 36} y1={y(tick)} y2={y(tick)} />)}
      {props.model.marks.slice(0, 8).map((mark) => { const bandX = x(mark.id) ?? 0; const width = x.bandwidth(); const actualTop = y(mark.value); const capacityTop = y(mark.secondaryValue ?? 0); const parts = mark.label.split(' / '); const quarter = parts[0]?.replace('FY', '') ?? mark.label; const region = ({ 'North America': 'NA', Europe: 'EU', 'Asia Pacific': 'APAC', 'Latin America': 'LATAM' } as Readonly<Record<string, string>>)[parts[1]] ?? parts[1] ?? ''; return <SelectableMark key={mark.id} mark={mark} selected={props.selectedId === mark.id} onSelect={props.onSelect}><rect className={styles.capacityTrack} x={bandX} y={capacityTop} width={width} height={HEIGHT - 54 - capacityTop} rx="3" /><rect className={styles.capacityActual} fill={mark.color} x={bandX + 4} y={actualTop} width={width - 8} height={HEIGHT - 54 - actualTop} rx="3" /><text className={styles.pointValue} textAnchor="middle" x={bandX + width / 2} y={actualTop - 8}>{mark.value}</text><text className={styles.capacityAxisLabel} textAnchor="middle" x={bandX + width / 2} y={HEIGHT - 39}><tspan x={bandX + width / 2}>{quarter}</tspan><tspan x={bandX + width / 2} dy="11">{region}</tspan></text></SelectableMark>; })}
      <g transform="translate(560 18)"><rect className={styles.capacityTrack} width="13" height="9" /><text className={styles.legendLabel} x="19" y="8">Capacity</text><rect fill="#1678c2" x="88" width="13" height="9" /><text className={styles.legendLabel} x="107" y="8">Planned</text></g>
    </>
  );
}

function ParetoChart(props: ID3InlineChartProps): React.ReactElement {
  const x = scaleBand<string>().domain(props.model.marks.map((mark) => mark.id)).range([58, WIDTH - 40]).padding(0.28);
  const maximum = Math.max(...props.model.marks.map((mark) => mark.value), 1);
  const yValue = scaleLinear().domain([0, maximum * 1.2]).nice().range([HEIGHT - 58, 38]);
  const yPercent = scaleLinear().domain([0, 100]).range([HEIGHT - 58, 38]);
  const points = props.model.marks.map((mark) => [(x(mark.id) ?? 0) + x.bandwidth() / 2, yPercent(mark.secondaryValue ?? 0)] as [number, number]);
  const cumulative = line<[number, number]>().x((point) => point[0]).y((point) => point[1]).curve(curveMonotoneX)(points) ?? '';
  return <>{props.model.marks.map((mark) => { const bandX = x(mark.id) ?? 0; const top = yValue(mark.value); return <SelectableMark key={mark.id} mark={mark} selected={props.selectedId === mark.id} onSelect={props.onSelect}><rect className={styles.paretoBar} fill={mark.color} x={bandX} y={top} width={x.bandwidth()} height={HEIGHT - 58 - top} rx="3" /><text className={styles.pointValue} textAnchor="middle" x={bandX + x.bandwidth() / 2} y={top - 8}>{mark.value}</text><text className={styles.axisLabel} textAnchor="middle" x={bandX + x.bandwidth() / 2} y={HEIGHT - 35}>{mark.label}</text></SelectableMark>; })}<line className={styles.thresholdLine} x1="58" x2={WIDTH - 40} y1={yPercent(80)} y2={yPercent(80)} /><text className={styles.thresholdLabel} x={WIDTH - 42} y={yPercent(80) - 5} textAnchor="end">80% threshold</text><path className={styles.paretoLine} d={cumulative} />{points.map((point, index) => <circle className={styles.paretoPoint} key={props.model.marks[index].id} cx={point[0]} cy={point[1]} r="4" />)}</>;
}

function WaterfallChart(props: ID3InlineChartProps): React.ReactElement {
  const x = scaleBand<string>().domain(props.model.marks.map((mark) => mark.id)).range([54, WIDTH - 38]).padding(0.32);
  const maximum = Math.max(...props.model.marks.map((mark) => mark.value), 1);
  const y = scaleLinear().domain([0, maximum * 1.18]).range([HEIGHT - 58, 38]);
  let running = props.model.marks[0]?.value ?? 0;
  const steps = props.model.marks.map((mark, index) => {
    if (index === 0 || mark.id === 'remaining') return { mark, start: 0, end: mark.value, total: true };
    const start = running;
    running = Math.max(0, running - mark.value);
    return { mark, start, end: running, total: false };
  });
  return <>{steps.map((step, index) => { const bandX = x(step.mark.id) ?? 0; const top = y(Math.max(step.start, step.end)); const bottom = y(Math.min(step.start, step.end)); const height = Math.max(3, bottom - top); const depth = 7; const next = steps[index + 1]; const connectorY = y(step.end); return <React.Fragment key={step.mark.id}><SelectableMark mark={step.mark} selected={props.selectedId === step.mark.id} onSelect={props.onSelect}><rect className={styles.waterfallBar} fill={step.mark.id === 'remaining' ? '#107c10' : step.mark.id === 'budget' ? '#1678c2' : '#d96c22'} x={bandX} y={top} width={x.bandwidth()} height={height} rx="3" /><path className={styles.waterfallTop} d={`M${bandX},${top} l${depth},-${depth} h${x.bandwidth() - depth} l0,${depth} z`} /><text className={styles.pointValue} textAnchor="middle" x={bandX + x.bandwidth() / 2} y={top - 11}>{displayValue(step.mark, props.model)}</text><text className={styles.axisLabel} textAnchor="middle" x={bandX + x.bandwidth() / 2} y={HEIGHT - 35}>{step.mark.label}</text></SelectableMark>{next && <line className={styles.waterfallConnector} x1={bandX + x.bandwidth()} x2={x(next.mark.id)} y1={connectorY} y2={connectorY} />}</React.Fragment>; })}</>;
}

function NetworkChart(props: ID3InlineChartProps): React.ReactElement {
  const positions = new Map<string, [number, number]>();
  const signalPositions: readonly [number, number][] = [[110, 76], [640, 82], [126, 250], [252, 54], [654, 245], [92, 166], [525, 52], [430, 270]];
  props.model.marks.forEach((mark) => {
    if (mark.group === 'incident') positions.set(mark.id, [390, 150]);
    else if (mark.group === 'service') positions.set(mark.id, [236, 184]);
    else if (mark.group === 'region') positions.set(mark.id, mark.id.endsWith('0') ? [390, 62] : [510, 220]);
    else {
      const signalIndex = Number(mark.id.replace('signal-', '')) || 0;
      positions.set(mark.id, signalPositions[signalIndex % signalPositions.length]);
    }
  });
  return <>{props.model.marks.map((mark) => mark.parentId && positions.has(mark.parentId) ? <line className={styles.networkLink} key={`link-${mark.id}`} x1={positions.get(mark.parentId)?.[0]} y1={positions.get(mark.parentId)?.[1]} x2={positions.get(mark.id)?.[0]} y2={positions.get(mark.id)?.[1]} /> : null)}{props.model.marks.map((mark) => { const position = positions.get(mark.id) ?? [WIDTH / 2, HEIGHT / 2]; const radius = 7 + mark.value / 18; return <SelectableMark key={mark.id} mark={mark} selected={props.selectedId === mark.id} onSelect={props.onSelect}><circle className={styles.networkHalo} cx={position[0]} cy={position[1]} r={radius + 7} /><circle className={styles.networkNode} fill={mark.color} cx={position[0]} cy={position[1]} r={radius} /><text className={styles.networkLabel} textAnchor="middle" x={position[0]} y={position[1] + radius + 16}>{mark.label}</text></SelectableMark>; })}</>;
}

function ChartBody(props: ID3InlineChartProps): React.ReactElement {
  if (props.model.kind === 'ring') return <RingChart {...props} />;
  if (props.model.kind === 'line') return <LineChart {...props} />;
  if (props.model.kind === 'pareto') return <ParetoChart {...props} />;
  if (props.model.kind === 'waterfall') return <WaterfallChart {...props} />;
  if (props.model.kind === 'horizon') return <CapacityChart {...props} />;
  if (props.model.kind === 'network') return <NetworkChart {...props} />;
  return <BarChart {...props} />;
}

export function D3InlineChart(props: ID3InlineChartProps): React.ReactElement {
  return (
    <div className={`${styles.root} ${props.isDark ? styles.dark : ''}`}>
      <svg className={styles.chart} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-labelledby={`chart-${safeId(props.model.title)}-title chart-${safeId(props.model.title)}-description`}>
        <title id={`chart-${safeId(props.model.title)}-title`}>{props.model.title}</title>
        <desc id={`chart-${safeId(props.model.title)}-description`}>{props.model.ariaLabel}. Select a mark for exact detail.</desc>
        <ChartBody {...props} />
      </svg>
      <div className={styles.dataRail} aria-label={`${props.model.title} data`}>
        {props.model.marks.map((mark) => <button aria-pressed={props.selectedId === mark.id} key={mark.id} onClick={() => props.onSelect(mark.id)} type="button"><i style={{ background: mark.color }} /><span>{mark.label}</span><strong>{displayValue(mark, props.model)}</strong></button>)}
      </div>
    </div>
  );
}