import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { MockZavaEmployeeDataService } from '../../shared/services/MockZavaEmployeeDataService';
import { normalizeHomeProperties } from '../normalizeHomeProperties';
import ZavaDashboardShell from './ZavaDashboardShell';

const currentUser = new MockZavaEmployeeDataService().getEmployeeExperience(
  new Date(2026, 7, 11, 12, 0, 0)
).user;

describe('ZavaDashboardShell', () => {
  const renderShell = (view: 'summary' | 'timeline' = 'summary'): string =>
    renderToStaticMarkup(
      <ZavaDashboardShell
        properties={normalizeHomeProperties({ view, period: 'week' })}
        propertiesVersion={1}
        currentUser={currentUser}
        containerDimensions={{ width: 1440, height: 900 }}
      />
    );

  test('renders the personalized shell, hero metrics, content, and offline footer', () => {
    const markup = renderShell();
    expect(markup).toContain('data-display-mode="fullscreen"');
    expect(markup).toContain('Zava Employee Agent');
    expect(markup).toContain('Megan');
    expect(markup).toContain('Here is what needs attention across work and HR.');
    expect(markup).toContain('Open actions');
    expect(markup).toContain('What needs you');
    expect(markup).toContain('Your month ahead');
    expect(markup).toContain('Learning momentum');
    expect(markup).toContain('People around you');
    expect(markup).toContain('Mock data · Offline');
    expect(markup).toContain('Work IQ-shaped employee experience');
  });

  test('renders Home active with all ten families available on desktop and mobile', () => {
    const markup = renderShell();
    expect(markup).toContain('aria-current="page"');
    expect((markup.match(/data-family-nav=/g) || [])).toHaveLength(10);
    expect(markup).not.toContain('disabled=""');
    expect(markup).toContain('Employee Agent section');
    expect((markup.match(/data-family-option=/g) || [])).toHaveLength(10);
    expect(markup).toContain('Org &amp; People Graph');
  });

  test('preserves normalized prompt state in fullscreen mode', () => {
    expect(renderShell('timeline')).toContain('data-home-view="timeline"');
  });

  test('renders the HR action-plan trigger and settings access', () => {
    const markup = renderShell();
    expect(markup).toContain('Build my HR action plan');
    expect(markup).toContain('Open settings');
  });

  test('records the invoked component family, route, and normalized parameters', () => {
    const markup = renderToStaticMarkup(
      <ZavaDashboardShell
        properties={normalizeHomeProperties({ view: 'actions', period: 'week' })}
        propertiesVersion={2}
        currentUser={currentUser}
        initialFamily="home"
        initialRoute="home/actions"
        initialParams={{ period: 'week' }}
      />
    );
    expect(markup).toContain('data-initial-family="home"');
    expect(markup).toContain('data-initial-route="home/actions"');
    expect(markup).toContain('data-initial-params="{&quot;period&quot;:&quot;week&quot;}"');
  });
});