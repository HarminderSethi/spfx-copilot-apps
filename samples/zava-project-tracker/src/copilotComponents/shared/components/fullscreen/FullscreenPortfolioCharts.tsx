import * as React from 'react';

import { max } from 'd3-array';
import { scaleBand, scaleLinear } from 'd3-scale';
import { area, curveMonotoneX, line } from 'd3-shape';
import { makeStyles } from '@griffel/react';
import { tokens } from '@fluentui/react-theme';

import type { IResolvedProjectRecord } from '../../models/portfolioDomain';

const useStyles = makeStyles({
  chart: {
    display: 'block',
    width: '100%',
    height: '326px',
    overflow: 'visible',
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorNeutralBackground2
  },
  forecastChart: {
    display: 'block',
    width: '100%',
    height: '246px',
    overflow: 'visible',
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorNeutralBackground2
  }
});

const healthColor = (health: IResolvedProjectRecord['health']): string => health === 'red'
  ? tokens.colorPaletteRedBackground3
  : health === 'amber'
    ? tokens.colorPaletteMarigoldBackground3
    : tokens.colorPaletteGreenBackground3;

const compactMillions = (value: number): string => `${value < 0 ? '-' : ''}$${(Math.abs(value) / 1000000).toFixed(Math.abs(value) >= 1000000 ? 1 : 2)}m`;

export const CompanyInvestmentLandscape: React.FunctionComponent<{ projects: IResolvedProjectRecord[] }> = ({ projects }) => {
  const styles = useStyles();
  const ordered = [...projects].sort((left, right) => right.forecastCost - left.forecastCost);
  const labels = ordered.map((project) => project.id);
  const y = scaleBand<string>().domain(labels).range([42, 294]).padding(.26);
  const x = scaleLinear().domain([0, (max(ordered, (project) => Math.max(project.baselineBudget, project.forecastCost)) || 1) * 1.08]).range([226, 690]);

  return <svg className={styles.chart} viewBox="0 0 840 326" role="img" aria-label="Company project investment landscape showing approved and forecast budgets for eight projects">
    <title>Company project investment landscape</title>
    <desc>Each row compares approved budget with forecast cost. Color represents project health. Forecast benefits appear on the right.</desc>
    <text x="226" y="22" fill={tokens.colorNeutralForeground3} fontSize="10">Approved and forecast investment</text>
    <text x="814" y="22" textAnchor="end" fill={tokens.colorNeutralForeground3} fontSize="10">Forecast benefit</text>
    {[0, .25, .5, .75, 1].map((step) => {
      const value = x.domain()[1] * step;
      const position = x(value);
      return <g key={step}><line x1={position} y1="32" x2={position} y2="302" stroke={tokens.colorNeutralStroke2} strokeDasharray="2 5"/><text x={position} y="318" textAnchor="middle" fill={tokens.colorNeutralForeground3} fontSize="9">{compactMillions(value)}</text></g>;
    })}
    {ordered.map((project) => {
      const rowY = y(project.id) || 0;
      const band = y.bandwidth();
      const baselineWidth = x(project.baselineBudget) - x(0);
      const forecastWidth = x(project.forecastCost) - x(0);
      const variance = project.forecastCost - project.baselineBudget;
      return <g key={project.id}>
        <text x="12" y={rowY + 12} fill={tokens.colorNeutralForeground1} fontSize="10" fontWeight="700">{project.title}</text>
        <text x="12" y={rowY + 25} fill={tokens.colorNeutralForeground3} fontSize="9">{project.phase} / {project.health} / {variance > 0 ? '+' : ''}{compactMillions(variance)} variance</text>
        <rect x={x(0)} y={rowY + band * .12} width={baselineWidth} height={band * .76} rx="5" fill={tokens.colorNeutralBackground4}/>
        <rect x={x(0)} y={rowY + band * .28} width={forecastWidth} height={band * .44} rx="4" fill={healthColor(project.health)} opacity=".92"/>
        <circle cx={x(project.forecastCost)} cy={rowY + band / 2} r="4" fill={tokens.colorNeutralBackground1} stroke={healthColor(project.health)} strokeWidth="2"/>
        <text x="814" y={rowY + band / 2 + 3} textAnchor="end" fill={tokens.colorNeutralForeground1} fontSize="10" fontWeight="700">{compactMillions(project.forecastBenefit)}</text>
      </g>;
    })}
  </svg>;
};

const MONTHS = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
const BASELINE = [548, 552, 560, 566, 574, 582, 588, 594, 602, 610, 616, 628];
const FORECAST = [536, 558, 579, 601, 608, 616, 625, 633, 648, 661, 677, 692];

export const CompanyForecastTrajectory: React.FunctionComponent = () => {
  const styles = useStyles();
  const x = scaleLinear().domain([0, MONTHS.length - 1]).range([46, 798]);
  const y = scaleLinear().domain([500, 720]).range([198, 24]);
  const baselineLine = line<number>().x((_value, index) => x(index)).y((value) => y(value)).curve(curveMonotoneX)(BASELINE) || '';
  const forecastLine = line<number>().x((_value, index) => x(index)).y((value) => y(value)).curve(curveMonotoneX)(FORECAST) || '';
  const forecastArea = area<number>().x((_value, index) => x(index)).y0(198).y1((value) => y(value)).curve(curveMonotoneX)(FORECAST) || '';

  return <svg className={styles.forecastChart} viewBox="0 0 840 246" role="img" aria-label="Twelve month company portfolio run-rate forecast compared with baseline">
    <title>Portfolio run-rate forecast</title>
    <desc>Monthly run rate rises from 536 thousand dollars to 692 thousand dollars and crosses baseline in October.</desc>
    {[520, 580, 640, 700].map((value) => <g key={value}><line x1="46" y1={y(value)} x2="798" y2={y(value)} stroke={tokens.colorNeutralStroke2} strokeDasharray="2 5"/><text x="38" y={y(value) + 3} textAnchor="end" fill={tokens.colorNeutralForeground3} fontSize="9">${value}k</text></g>)}
    <path d={forecastArea} fill={tokens.colorPaletteMarigoldBackground2} opacity=".52"/>
    <path d={baselineLine} fill="none" stroke={tokens.colorBrandStroke1} strokeWidth="2" strokeDasharray="7 5"/>
    <path d={forecastLine} fill="none" stroke={tokens.colorPaletteMarigoldBorderActive} strokeWidth="3" strokeLinecap="round"/>
    {FORECAST.map((value, index) => <g key={MONTHS[index]}><circle cx={x(index)} cy={y(value)} r="3.5" fill={tokens.colorNeutralBackground1} stroke={tokens.colorPaletteMarigoldBorderActive} strokeWidth="2"/><text x={x(index)} y="224" textAnchor="middle" fill={tokens.colorNeutralForeground3} fontSize="9">{MONTHS[index]}</text></g>)}
    <g transform="translate(596 12)"><line x1="0" y1="5" x2="22" y2="5" stroke={tokens.colorBrandStroke1} strokeDasharray="7 5"/><text x="28" y="8" fill={tokens.colorNeutralForeground2} fontSize="9">Approved baseline</text><line x1="112" y1="5" x2="134" y2="5" stroke={tokens.colorPaletteMarigoldBorderActive} strokeWidth="3"/><text x="140" y="8" fill={tokens.colorNeutralForeground2} fontSize="9">Current forecast</text></g>
  </svg>;
};
