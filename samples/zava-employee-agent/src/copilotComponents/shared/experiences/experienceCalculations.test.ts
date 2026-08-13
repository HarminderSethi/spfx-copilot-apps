import { calculateBusinessDays } from './experienceCalculations';

describe('experience calculations', () => {
  test('counts inclusive weekdays and excludes weekends', () => {
    expect(calculateBusinessDays('2027-08-04', '2027-08-12')).toBe(7);
  });

  test('returns zero for invalid or reversed ranges', () => {
    expect(calculateBusinessDays('invalid', '2027-08-12')).toBe(0);
    expect(calculateBusinessDays('2027-08-12', '2027-08-04')).toBe(0);
  });
});