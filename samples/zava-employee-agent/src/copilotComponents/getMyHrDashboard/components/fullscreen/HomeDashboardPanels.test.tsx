import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { MockZavaEmployeeDataService } from '../../../shared/services/MockZavaEmployeeDataService';
import { DEFAULT_ZAVA_SETTINGS } from '../../../shared/utils/settings';
import { buildHrActionPlan } from '../../services/buildHrActionPlan';
import HomeDashboardPanels from './HomeDashboardPanels';

describe('HomeDashboardPanels settings', () => {
  const now = new Date(2026, 7, 11, 12, 0, 0);
  const data = new MockZavaEmployeeDataService().getEmployeeExperience(now);
  const plan = buildHrActionPlan(data.signals, data.user, now, 'standard', false);

  test('renders all three editorial columns by default', () => {
    const markup = renderToStaticMarkup(
      <HomeDashboardPanels
        data={data}
        plan={plan}
        now={now}
        settings={DEFAULT_ZAVA_SETTINGS}
        locale="en-US"
        onNavigate={() => undefined}
      />
    );
    expect(markup).toContain('data-home-column="actions-timeline"');
    expect(markup).toContain('data-home-column="snapshot-learning"');
    expect(markup).toContain('data-home-column="people-milestone"');
    expect(markup).toContain('data:image/jpeg;base64,');
    expect(markup).toContain('Megan Bowen: Five years at Zava');
  });

  test('drops empty columns and formats snapshot values from settings', () => {
    const markup = renderToStaticMarkup(
      <HomeDashboardPanels
        data={data}
        plan={plan}
        now={now}
        settings={{
          ...DEFAULT_ZAVA_SETTINGS,
          currency: 'USD',
          jurisdiction: 'US',
          visibleHomePanels: ['snapshot']
        }}
        locale="en-US"
        onNavigate={() => undefined}
      />
    );
    expect(markup).not.toContain('data-home-column="actions-timeline"');
    expect(markup).toContain('data-home-column="snapshot-learning"');
    expect(markup).not.toContain('data-home-column="people-milestone"');
    expect(markup).toContain('$5,126');
    expect(markup).toContain('United States · US policy');
    expect(markup).not.toContain('Learning momentum');
  });
});