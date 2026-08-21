import { canRequestFullscreen, resolveInlineViewForVersion } from './inlineViewState';

describe('inline view state', () => {
  test('preserves a local drill-down during passive host rerenders', () => {
    expect(resolveInlineViewForVersion('actions', 'summary', 2, 2)).toBe('actions');
  });

  test('resets to the prompt-requested view for a fresh invocation', () => {
    expect(resolveInlineViewForVersion('actions', 'profile', 2, 3)).toBe('profile');
  });

  test('offers expand only when fullscreen is advertised', () => {
    expect(canRequestFullscreen(['inline', 'fullscreen'])).toBe(true);
    expect(canRequestFullscreen(['inline'])).toBe(false);
    expect(canRequestFullscreen(undefined)).toBe(false);
  });
});