import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { ZAVA_FAMILIES } from '../../../shared/models/families';
import type { ZavaFamilyId } from '../../../shared/models/families';
import { MockZavaEmployeeDataService } from '../../../shared/services/MockZavaEmployeeDataService';
import FamilyPlaceholderView from './FamilyPlaceholderView';

const now = new Date(2026, 7, 11, 12, 0, 0);
const user = new MockZavaEmployeeDataService().getEmployeeExperience(now).user;
const placeholderFamilies = ZAVA_FAMILIES.filter((family) => family.id !== 'home');

describe('FamilyPlaceholderView', () => {
  test.each(placeholderFamilies)('renders the $label title-only placeholder', (family) => {
    const markup = renderToStaticMarkup(
      <FamilyPlaceholderView
        family={family.id as ZavaFamilyId}
        user={user}
        now={now}
        viewRef={React.createRef<HTMLDivElement>()}
      />
    );

    expect(markup).toContain(`data-family-placeholder="${family.id}"`);
    expect(markup).toContain(`data-family-theme="${family.themeVariant}"`);
    expect(markup).toContain('color-mix(in srgb');
    expect(markup).toContain(family.label.replace('&', '&amp;'));
    expect(markup).toContain(family.placeholderSummary);
    expect(markup).not.toContain('implementation');
    expect(markup).not.toContain('coming later');
    expect(markup).not.toContain('What needs you');
    expect(markup).not.toContain('Your month ahead');
  });
});