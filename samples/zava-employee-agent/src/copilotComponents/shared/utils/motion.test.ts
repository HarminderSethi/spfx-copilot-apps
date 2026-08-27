import { fadeIn, fadeInUp, prefersReducedMotion } from './motion';

describe('motion utilities', () => {
  test('exports stable Fluent-compatible keyframes', () => {
    expect(fadeIn).toEqual({ from: { opacity: 0 }, to: { opacity: 1 } });
    expect(fadeInUp.from.transform).toBe('translateY(10px)');
    expect(fadeInUp.to.transform).toBe('translateY(0)');
  });

  test('reads the reduced-motion media preference when available', () => {
    if (typeof window === 'undefined') {
      expect(prefersReducedMotion()).toBe(false);
      return;
    }

    const original = window.matchMedia;
    window.matchMedia = jest.fn().mockReturnValue({ matches: true }) as typeof window.matchMedia;
    expect(prefersReducedMotion()).toBe(true);
    window.matchMedia = original;
  });
});