import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { ConfiguredFamilyDashboard, ConfiguredFamilyInline } from '../shared/experiences/ConfiguredFamilyExperience';
import DashboardSupportingExperience from '../shared/experiences/DashboardSupportingExperience';
import { getDashboardOnlyExperience } from '../shared/experiences/familyDashboardCatalog';
import { embeddedImages } from '../shared/mockData/embeddedImages';
import { MockZavaEmployeeDataService } from '../shared/services/MockZavaEmployeeDataService';
import { normalizeFindExpertProperties } from './FindExpertCopilotComponentProperties';

describe('People experience', () => {
  test('renders evidence-ranked expert matches', () => {
    const params = normalizeFindExpertProperties({ expertise: 'accessibility for a customer keynote' });
    const markup = renderToStaticMarkup(<ConfiguredFamilyInline intentKey="findExpert" params={params} />);
    expect(markup).toContain('Showing evidence-ranked matches for accessibility for a customer keynote in Europe');
    expect(markup).toContain('Johanna Lorenz');
    expect(markup).toContain('96%');
    expect(markup).toContain('Works with Lee Gu');
    expect(markup).toContain('not inferred personal traits');
    expect((markup.match(/data:image\/jpeg;base64/g) || [])).toHaveLength(3);
  });

  test('applies the prompt-derived expert location filter', () => {
    const params = normalizeFindExpertProperties({ expertise: 'assistive technology', location: 'Berlin' });
    const markup = renderToStaticMarkup(<ConfiguredFamilyInline intentKey="findExpert" params={params} />);
    expect(markup).toContain('Nestor Wilke');
    expect(markup).not.toContain('Johanna Lorenz');
  });

  test('renders a native collapsible organization tree', () => {
    const markup = renderToStaticMarkup(<ConfiguredFamilyInline intentKey="exploreOrganization" params={{ depth: 2 }} />);
    expect(markup).toContain('Zava Customer Experience organization tree');
    expect(markup).toContain('Anchored on Megan Bowen · 2 levels');
    expect(markup).toContain('<details');
    expect(markup).toContain('Accessibility practice');
    expect(markup).toContain('8 people');
    expect(markup).toContain('Diego Siciliani');
    expect(markup).toContain('Partner team');
    expect((markup.match(/data:image\/jpeg;base64/g) || []).length).toBeGreaterThanOrEqual(4);
  });

  test('limits the initial organization tree to the requested depth', () => {
    const markup = renderToStaticMarkup(<ConfiguredFamilyInline intentKey="exploreOrganization" params={{ personId: 'lee-gu', depth: 1 }} />);
    expect(markup).toContain('Anchored on lee gu · 1 level');
    expect(markup).not.toContain('Accessibility practice');
  });

  test('renders embedded portraits for every People network person', () => {
    const definition = getDashboardOnlyExperience('peopleNetwork');
    if (!definition) {
      throw new Error('Expected People network dashboard definition');
    }
    const markup = renderToStaticMarkup(<DashboardSupportingExperience definition={definition} />);
    expect(markup).toContain(embeddedImages.leeGu);
    expect(markup).toContain(embeddedImages.pattiFernandez);
    expect(markup).toContain(embeddedImages.johannaLorenz);
    expect((markup.match(/<img/g) || [])).toHaveLength(3);
  });

  test('renders an implemented People dashboard', () => {
    const user = new MockZavaEmployeeDataService().getEmployeeExperience().user;
    const markup = renderToStaticMarkup(<ConfiguredFamilyDashboard family="people" user={user} />);
    expect(markup).toContain('people/expert');
    expect(markup).toContain('people/organization');
    expect(markup).toContain('Your people network');
    expect(markup).toContain('Career growth one-to-one with Diego Siciliani');
    const networkSection = markup.match(/data-family-route="people\/network"[\s\S]*?<\/section>/)?.[0] || '';
    expect(networkSection).toContain(embeddedImages.leeGu);
    expect(networkSection).toContain(embeddedImages.pattiFernandez);
    expect(networkSection).toContain(embeddedImages.johannaLorenz);
    expect((networkSection.match(/<img/g) || [])).toHaveLength(3);
  });
});