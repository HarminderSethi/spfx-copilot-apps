import type { IMockEventSeed } from '../models/seeds';

export const mockEvents: ReadonlyArray<IMockEventSeed> = [
  {
    id: 'event-one-to-one-diego',
    subject: 'Career growth one-to-one',
    bodyPreview: 'Discuss the keynote, growth goals, and the next employee-experience milestone.',
    startOffsetMin: 2 * 24 * 60,
    durationMin: 45,
    timeZone: 'Europe/Helsinki',
    organizer: { emailAddress: { name: 'Diego Siciliani', address: 'diego.siciliani@zava.example' } },
    attendees: [{ emailAddress: { name: 'Megan Bowen', address: 'megan.bowen@zava.example' } }],
    isOnlineMeeting: true,
    destination: { family: 'people', route: 'people/meeting', params: { meetingId: 'event-one-to-one-diego' } }
  },
  {
    id: 'event-customer-review-conflict',
    subject: 'Customer keynote experience review',
    bodyPreview: 'Review the employee-agent keynote flow with the customer team.',
    startOffsetMin: 8 * 24 * 60,
    durationMin: 60,
    timeZone: 'Europe/Helsinki',
    organizer: { emailAddress: { name: 'Lee Gu', address: 'lee.gu@zava.example' } },
    attendees: [
      { emailAddress: { name: 'Megan Bowen', address: 'megan.bowen@zava.example' } },
      { emailAddress: { name: 'Johanna Lorenz', address: 'johanna.lorenz@zava.example' } }
    ],
    isOnlineMeeting: true,
    destination: { family: 'time', route: 'calendar-conflict', params: { requestId: 'leave-draft-family-trip' } }
  }
];