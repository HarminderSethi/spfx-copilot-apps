export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

export interface IZavaGreeting {
  timeOfDay: TimeOfDay;
  text: string;
  subtext: string;
}

export const getGreeting = (date: Date = new Date()): IZavaGreeting => {
  const hour = date.getHours();
  const day = date.getDay();
  const weekend = day === 0 || day === 6;

  if (hour >= 22) {
    return {
      timeOfDay: 'night',
      text: 'Good evening',
      subtext: weekend ? 'Winding down the weekend.' : 'Working late? Here is where things stand.'
    };
  }
  if (hour < 5) {
    return {
      timeOfDay: 'night',
      text: 'Good morning',
      subtext: 'You are up early. Here is what needs attention.'
    };
  }
  if (hour < 12) {
    return {
      timeOfDay: 'morning',
      text: 'Good morning',
      subtext: weekend ? 'Enjoy your weekend.' : 'Start the day with clarity.'
    };
  }
  if (hour < 17) {
    return {
      timeOfDay: 'afternoon',
      text: 'Good afternoon',
      subtext: weekend ? 'Making the most of your weekend.' : 'You are in good shape this afternoon.'
    };
  }
  return {
    timeOfDay: 'evening',
    text: 'Good evening',
    subtext: weekend ? 'Enjoy your evening.' : 'Here is what is left for today.'
  };
};