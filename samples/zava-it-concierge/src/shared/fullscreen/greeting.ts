export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

export interface ITimeAwareGreeting {
  readonly timeOfDay: TimeOfDay;
  readonly text: string;
}

export function getTimeAwareGreeting(date: Date = new Date()): ITimeAwareGreeting {
  const hour = date.getHours();

  if (hour >= 22) {
    return { timeOfDay: 'night', text: 'Good evening' };
  }
  if (hour < 5) {
    return { timeOfDay: 'night', text: 'Good morning' };
  }
  if (hour < 12) {
    return { timeOfDay: 'morning', text: 'Good morning' };
  }
  if (hour < 17) {
    return { timeOfDay: 'afternoon', text: 'Good afternoon' };
  }
  return { timeOfDay: 'evening', text: 'Good evening' };
}