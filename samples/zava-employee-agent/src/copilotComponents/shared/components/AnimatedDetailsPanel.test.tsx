import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';

import AnimatedDetailsPanel from './AnimatedDetailsPanel';

const items = [
  { id: 'latest', eyebrow: 'Latest statement', title: 'Your latest pay', summary: 'Net pay is EUR 5,126.' },
  { id: 'change', eyebrow: 'Change drivers', title: 'Why your pay changed', summary: 'Recognition outweighed withholding.' },
  { id: 'deductions', eyebrow: 'Allocation', title: 'Where deductions go', summary: 'Tax, pension, and benefits.' }
];

const renderPanel = (container: HTMLDivElement): void => {
  ReactDOM.render(
    <AnimatedDetailsPanel
      title="Your pay explanation"
      reviewingText="Reviewing your pay details..."
      headline="Three details explain your latest pay."
      readyText="Your pay details are ready."
      items={items}
      footnote="Generated locally from sample data."
      onDismiss={() => undefined}
    />,
    container
  );
};

describe('AnimatedDetailsPanel', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    act(() => { ReactDOM.unmountComponentAtNode(container); });
    container.remove();
    jest.useRealTimers();
  });

  test('thinks before revealing details one at a time', () => {
    jest.useFakeTimers();
    act(() => renderPanel(container));
    expect(container.textContent).toContain('Reviewing your pay details...');
    expect(container.textContent).not.toContain('Your latest pay');

    act(() => jest.advanceTimersByTime(800));
    expect(container.textContent).toContain('Three details explain your latest pay.');
    expect(container.textContent).not.toContain('Your latest pay');

    act(() => jest.advanceTimersByTime(220));
    expect(container.textContent).toContain('Your latest pay');
    expect(container.textContent).not.toContain('Why your pay changed');

    act(() => jest.advanceTimersByTime(220));
    act(() => jest.advanceTimersByTime(220));
    expect(container.textContent).toContain('Where deductions go');
    expect(container.textContent).toContain('Your pay details are ready.');
  });

  test('reveals every detail immediately when reduced motion is requested', () => {
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = jest.fn().mockReturnValue({ matches: true }) as typeof window.matchMedia;
    act(() => renderPanel(container));
    expect(container.textContent).toContain('Your pay details are ready.');
    expect(container.textContent).toContain('Your latest pay');
    expect(container.textContent).toContain('Why your pay changed');
    expect(container.textContent).toContain('Where deductions go');
    window.matchMedia = originalMatchMedia;
  });
});