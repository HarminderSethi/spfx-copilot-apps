import { getTimeAwareGreeting } from './greeting';

function atHour(hour: number): Date {
  return new Date(2026, 7, 24, hour, 0, 0);
}

describe('time-aware fullscreen greeting', () => {
  it.each([
    [0, 'night', 'Good morning'],
    [4, 'night', 'Good morning'],
    [5, 'morning', 'Good morning'],
    [11, 'morning', 'Good morning'],
    [12, 'afternoon', 'Good afternoon'],
    [16, 'afternoon', 'Good afternoon'],
    [17, 'evening', 'Good evening'],
    [21, 'evening', 'Good evening'],
    [22, 'night', 'Good evening']
  ])('maps hour %i to %s', (hour, timeOfDay, text) => {
    expect(getTimeAwareGreeting(atHour(hour))).toEqual({ timeOfDay, text });
  });
});