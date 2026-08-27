import * as React from 'react';
import { geoGraticule10, geoNaturalEarth1, geoPath } from 'd3-geo';
import { feature, mesh } from 'topojson-client';
import worldTopology from 'world-atlas/countries-110m.json';

import type { IBabylonChartModel, IBabylonMark } from '../ui/babylon/chartModels';

import styles from './D3EstateRiskMap.module.scss';

const worldCountries = feature(worldTopology, worldTopology.objects.countries);
const countryBorders = mesh(worldTopology, worldTopology.objects.countries, (left, right) => left !== right);

const VIEW_WIDTH = 960;
const VIEW_HEIGHT = 470;
const MARKER_OFFSETS: readonly (readonly [number, number])[] = [[-18, -8], [-6, -17], [10, -13], [-16, 10], [2, 12], [17, 5]];

export interface ID3EstateRiskMapProps {
  readonly isDark: boolean;
  readonly model: IBabylonChartModel;
  readonly selectedId?: string;
  readonly onSelect: (markId: string) => void;
}

interface IProjectedMark {
  readonly mark: IBabylonMark;
  readonly x: number;
  readonly y: number;
}

function markerLabel(mark: IBabylonMark): string {
  return `${mark.label}: ${mark.value}% health, ${mark.secondaryValue ?? 0} devices, ${mark.riskCount ?? 0} critical`;
}

export function D3EstateRiskMap(props: ID3EstateRiskMapProps): React.ReactElement {
  const projection = React.useMemo(() => geoNaturalEarth1().fitExtent([[18, 18], [VIEW_WIDTH - 18, VIEW_HEIGHT - 18]], worldCountries), []);
  const path = React.useMemo(() => geoPath(projection), [projection]);
  const countryPath = path(worldCountries) ?? '';
  const borderPath = path(countryBorders) ?? '';
  const graticulePath = path(geoGraticule10()) ?? '';
  const regionIndexes = new Map<string, number>();
  const marks: readonly IProjectedMark[] = props.model.marks.map((mark) => {
    const group = mark.group ?? '';
    const index = regionIndexes.get(group) ?? 0;
    regionIndexes.set(group, index + 1);
    const projected = projection([mark.longitude ?? 0, mark.latitude ?? 0]) ?? [VIEW_WIDTH / 2, VIEW_HEIGHT / 2];
    const offset = MARKER_OFFSETS[index % MARKER_OFFSETS.length];
    return { mark, x: projected[0] + offset[0], y: projected[1] + offset[1] };
  });
  const regionLabels = ['North America', 'Latin America', 'Europe', 'Asia Pacific'].map((region) => {
    const regionMark = props.model.marks.find((mark) => mark.group === region);
    const projected = projection([regionMark?.longitude ?? 0, regionMark?.latitude ?? 0]) ?? [0, 0];
    return { region, x: projected[0], y: projected[1] - 31 };
  });

  return (
    <div className={`${styles.root} ${props.isDark ? styles.dark : ''}`}>
      <svg className={styles.map} viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`} role="img" aria-labelledby="estate-map-title estate-map-description">
        <title id="estate-map-title">Global estate device risk map</title>
        <desc id="estate-map-description">Country map with selectable department cohorts in North America, Latin America, Europe, and Asia Pacific. Color shows health, marker size shows device count, and the outer ring shows critical-device count.</desc>
        <rect className={styles.ocean} width={VIEW_WIDTH} height={VIEW_HEIGHT} />
        <path className={styles.graticule} d={graticulePath} />
        <path className={styles.land} d={countryPath} />
        <path className={styles.borders} d={borderPath} />
        {regionLabels.map((label) => <text className={styles.regionLabel} key={label.region} x={label.x} y={label.y} textAnchor="middle">{label.region}</text>)}
        {marks.map(({ mark, x, y }) => {
          const radius = 5 + Math.sqrt(mark.secondaryValue ?? 1) * 1.4;
          const criticalRadius = radius + Math.min(8, (mark.riskCount ?? 0) * 1.35);
          const selected = props.selectedId === mark.id;
          return (
            <g
              aria-label={markerLabel(mark)}
              className={styles.marker}
              data-selected={selected}
              key={mark.id}
              onClick={() => props.onSelect(mark.id)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  props.onSelect(mark.id);
                }
              }}
              role="button"
              tabIndex={0}
              transform={`translate(${x} ${y})`}
            >
              <circle className={styles.criticalRing} r={criticalRadius} />
              <circle className={styles.healthMarker} fill={mark.color} r={radius} />
              <circle className={styles.markerCore} r="2.2" />
            </g>
          );
        })}
      </svg>
      <div className={styles.legend} aria-label="Map legend">
        <span><i data-tone="healthy" />80+ healthy</span>
        <span><i data-tone="watch" />75-79 watch</span>
        <span><i data-tone="attention" />70-74 attention</span>
        <span><b>Circle</b> device volume</span>
        <span><b>Ring</b> critical devices</span>
      </div>
    </div>
  );
}