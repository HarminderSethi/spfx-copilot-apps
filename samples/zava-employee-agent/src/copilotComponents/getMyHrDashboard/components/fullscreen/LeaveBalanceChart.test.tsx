import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import LeaveBalanceChart from './LeaveBalanceChart';

describe('LeaveBalanceChart', () => {
  test('renders an accessible rounded SVG balance visualization', () => {
    const markup = renderToStaticMarkup(<LeaveBalanceChart available={18} total={25} />);
    expect(markup).toContain('aria-label="Vacation balance: 18 of 25 days available, 72 percent"');
    expect(markup).toContain('stroke-linecap="round"');
    expect(markup).toContain('stroke-dasharray="72 28"');
    expect(markup).toContain('72% available');
  });

  test('clamps invalid percentages to the visible range', () => {
    expect(renderToStaticMarkup(<LeaveBalanceChart available={30} total={25} />))
      .toContain('stroke-dasharray="100 0"');
    expect(renderToStaticMarkup(<LeaveBalanceChart available={5} total={0} />))
      .toContain('stroke-dasharray="0 100"');
  });
});