import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import type { IZavaMetric } from '../models/zavaEmployee';
import DashboardCard from './DashboardCard';
import EmptyState from './EmptyState';
import FamilyBadge from './FamilyBadge';
import GroundingSource from './GroundingSource';
import MetricTile from './MetricTile';
import StatusBadge from './StatusBadge';

describe('shared UI primitives', () => {
  test('renders metric, status, family, and grounding semantics', () => {
    const metric: IZavaMetric = {
      id: 'test',
      label: 'Open actions',
      value: '4',
      intent: 'attention'
    };
    const markup = renderToStaticMarkup(
      <DashboardCard title="Shared card">
        <MetricTile metric={metric} />
        <StatusBadge label="Due soon" intent="attention" />
        <FamilyBadge family="learning" />
        <GroundingSource source={{
          id: 'source',
          title: 'Learning assignment',
          sourceType: 'mockLearning'
        }} />
      </DashboardCard>
    );
    expect(markup).toContain('Shared card');
    expect(markup).toContain('data-metric-id="test"');
    expect(markup).toContain('Due soon');
    expect(markup).toContain('Learning &amp; Compliance');
    expect(markup).toContain('Grounded in Learning assignment');
  });

  test('announces an intentional empty state', () => {
    const markup = renderToStaticMarkup(<EmptyState message="Nothing due." />);
    expect(markup).toContain('role="status"');
    expect(markup).toContain('aria-live="polite"');
    expect(markup).toContain('Nothing due.');
  });
});