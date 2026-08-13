import { formatDateRange, formatTimeUntil } from './datetime';

describe('datetime utilities', () => {
  const now = new Date(2026, 7, 11, 12, 0, 0);

  test.each([
    [30 * 1000, 'now'],
    [15 * 60 * 1000, 'in 15 min'],
    [2 * 60 * 60 * 1000, 'in 2 h'],
    [3 * 24 * 60 * 60 * 1000, 'in 3 d'],
    [-20 * 60 * 1000, '20 min ago']
  ])('formats a relative offset of %i milliseconds', (offset, expected) => {
    expect(formatTimeUntil(new Date(now.getTime() + (offset as number)), now)).toBe(expected);
  });

  test('formats an inclusive date range with the requested locale', () => {
    expect(formatDateRange(
      new Date(2027, 7, 4, 12, 0, 0),
      new Date(2027, 7, 12, 12, 0, 0),
      'en-US'
    )).toBe('Aug 4 - Aug 12');
  });
});