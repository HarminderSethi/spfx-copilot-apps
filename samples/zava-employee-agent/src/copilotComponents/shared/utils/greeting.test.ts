import { getGreeting } from './greeting';

describe('getGreeting', () => {
  test.each([
    [4, 'night', 'Good morning'],
    [9, 'morning', 'Good morning'],
    [14, 'afternoon', 'Good afternoon'],
    [19, 'evening', 'Good evening'],
    [23, 'night', 'Good evening']
  ])('maps hour %i to %s', (hour, timeOfDay, text) => {
    const date = new Date(2026, 7, 11, hour as number, 0, 0);
    expect(getGreeting(date)).toMatchObject({ timeOfDay, text });
  });
});