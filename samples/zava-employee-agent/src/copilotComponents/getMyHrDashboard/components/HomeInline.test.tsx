import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { MockZavaEmployeeDataService } from '../../shared/services/MockZavaEmployeeDataService';
import { normalizeHomeProperties } from '../normalizeHomeProperties';
import HomeInline from './HomeInline';

const currentUser = new MockZavaEmployeeDataService().getEmployeeExperience(
  new Date(2026, 7, 11, 12, 0, 0)
).user;

const renderView = (
  view: 'summary' | 'profile' | 'actions' | 'timeline' | 'milestones',
  options?: { width?: number; fullscreen?: boolean; fixed?: boolean; focusArea?: 'all' | 'rewards'; period?: 'today' | 'week' }
): string => renderToStaticMarkup(
  <HomeInline
    properties={normalizeHomeProperties({
      view,
      focusArea: options?.focusArea,
      period: options?.period
    })}
    propertiesVersion={1}
    currentUser={currentUser}
    availableDisplayModes={options?.fullscreen ? ['inline', 'fullscreen'] : ['inline']}
    containerDimensions={{ width: options?.width || 480 }}
    onRequestFullscreen={() => undefined}
    fixedView={options?.fixed ? view : undefined}
  />
);

describe('HomeInline', () => {
  test.each([
    ['summary', 'What needs you'],
    ['profile', 'Profile health'],
    ['actions', 'Your next best actions'],
    ['timeline', 'Worklife snapshot'],
    ['milestones', 'Your milestones']
  ] as const)('renders the %s prompt view', (view, expectedText) => {
    const markup = renderView(view);
    expect(markup).toContain(`data-home-view="${view}"`);
    expect(markup).toContain(expectedText);
  });

  test('marks a 320px host container as compact', () => {
    expect(renderView('summary', { width: 320 })).toContain('data-container-size="compact"');
    expect(renderView('summary', { width: 480 })).toContain('data-container-size="standard"');
  });

  test('shows expand only when fullscreen is advertised', () => {
    expect(renderView('summary', { fullscreen: true })).toContain('Open full HR dashboard');
    expect(renderView('summary', { fullscreen: false })).not.toContain('Open full HR dashboard');
  });

  test('keeps a standalone intent fixed with Expand and no sibling Back action', () => {
    const markup = renderView('profile', { fixed: true, fullscreen: true });
    expect(markup).toContain('data-home-intent="profile"');
    expect(markup).toContain('Open Profile health in the full HR dashboard');
    expect(markup).not.toContain('Back to HR summary');
  });

  test('renders a fixed summary without sibling intent buttons', () => {
    const markup = renderView('summary', { fixed: true });
    expect(markup).toContain('data-home-intent="summary"');
    expect(markup).not.toContain('type="button"');
  });

  test('renders Megan in the milestones quick view', () => {
    const markup = renderView('milestones');
    expect(markup).toContain('data:image/jpeg;base64,');
    expect(markup).toContain('Megan Bowen: Five years at Zava');
  });

  test('renders an intentional empty action state', () => {
    expect(renderView('actions', {
      focusArea: 'rewards',
      period: 'today'
    })).toContain('You are all caught up for this focus area.');
  });
});