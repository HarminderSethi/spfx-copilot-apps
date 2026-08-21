/**
 * Canned Work IQ responses for `useMock: true`. Full `IWorkIQConversation`
 * objects in the wire shape the live API returns, run through the same
 * extraction as live responses in {@link WorkIQService}.
 *
 * Two citation shapes are represented (see `entityParser.ts`): most scenarios
 * use `[N](url)` markers with a populated `references` map and empty
 * `attributions`, matching live captures. "Contoso proposal" is kept in the
 * documented shape (`<Person>`/`<Event>`/`<File>` tags, `[^n^]` footnotes,
 * populated `attributions`) so that rendering path stays exercised.
 */
import type { IWorkIQConversation, IWorkIQConversationReference, IWorkIQMessage } from './workIQTypes';

const MOCK_CONVERSATION_ID = '0d110e7e-2b7e-4270-a899-fd2af6fde333';

// Matches the real wire shape (explicit nulls, not omitted fields); see workIQTypes.ts.
const UNLABELED_SENSITIVITY = {
  sensitivityLabelId: null,
  displayName: null,
  tooltip: null,
  priority: null,
  color: null,
  isEncrypted: null
};

function meetingUrl(eventId: string, fragment: string): string {
  return `https://teams.microsoft.com/l/meeting/details?eventId=${eventId}#${fragment}`;
}

/**
 * Trimmed, anonymized "how many meetings" answer. Exported so
 * `entityParser.test.ts` and `citations.test.ts` assert against the same text
 * and `references` map the mock demos. A marker's `displayIndex` deliberately
 * doesn't equal its citation's `ordinal` (see `MOCK_MEETINGS_REFERENCES`),
 * proving resolution goes through the URL fragment.
 */
export const MOCK_MEETINGS_ANSWER_TEXT =
  'I found **9 meetings scheduled in the next week**. ' +
  `[1](${meetingUrl('AAMkAGZmMDAxMTk5MDE', 'a10f2c')})` +
  `[2](${meetingUrl('AAMkAGZmMDAxMTk5MDI', 'b21e3d')})` +
  `[3](${meetingUrl('AAMkAGZmMDAxMTk5MDM', 'c3204f')})` +
  `[4](${meetingUrl('AAMkAGZmMDAxMTk5MDQ', 'd43a51')})` +
  `[5](${meetingUrl('AAMkAGZmMDAxMTk5MDU', 'e5480a')})` +
  `[6](${meetingUrl('AAMkAGZmMDAxMTk5MDY', 'f65b12')})` +
  `[7](${meetingUrl('AAMkAGZmMDAxMTk5MDc', '075c93')})` +
  `[8](${meetingUrl('AAMkAGZmMDAxMTk5MDg', '186d74')})` +
  `[9](${meetingUrl('AAMkAGZmMDAxMTk5MDk', '297e15')})` +
  '\n\n' +
  'The meetings returned are:\n\n' +
  '- **BAU Standup** (daily recurring) on Sunday through Friday at 1:00 PM. ' +
  `[1](${meetingUrl('AAMkAGZmMDAxMTk5MDE', 'a10f2c')})` +
  `[2](${meetingUrl('AAMkAGZmMDAxMTk5MDI', 'b21e3d')})` +
  `[3](${meetingUrl('AAMkAGZmMDAxMTk5MDM', 'c3204f')})` +
  `[4](${meetingUrl('AAMkAGZmMDAxMTk5MDQ', 'd43a51')})` +
  `[6](${meetingUrl('AAMkAGZmMDAxMTk5MDY', 'f65b12')})` +
  `[9](${meetingUrl('AAMkAGZmMDAxMTk5MDk', '297e15')})\n` +
  '- **Microsoft 365 Platform - Weekly series** on Tuesday at 4:00 PM. ' +
  `[5](${meetingUrl('AAMkAGZmMDAxMTk5MDU', 'e5480a')})\n` +
  '- **Microsoft 365 and Power Platform community call** on Thursday at 3:00 PM. ' +
  `[8](${meetingUrl('AAMkAGZmMDAxMTk5MDg', '186d74')})\n\n` +
  'Total results reported by your calendar search: **9 meetings**. ' +
  `[7](${meetingUrl('AAMkAGZmMDAxMTk5MDc', '075c93')})\n\n` +
  "If you'd like, I can also summarize your meeting load by day and calculate how many hours you'll spend in meetings next week.";

/** Keyed by the fragment id in each marker above. Insertion order runs 9-down-to-1 against markers' 1-up-to-9. */
export const MOCK_MEETINGS_REFERENCES: { [key: string]: IWorkIQConversationReference } = {
  '297e15': {
    '@odata.type': '#microsoft.graph.copilotConversationReference',
    targetLink: meetingUrl('AAMkAGZmMDAxMTk5MDk', '297e15'),
    isCitedInResponse: true
  },
  '186d74': {
    '@odata.type': '#microsoft.graph.copilotConversationReference',
    targetLink: meetingUrl('AAMkAGZmMDAxMTk5MDg', '186d74'),
    isCitedInResponse: true
  },
  '075c93': {
    '@odata.type': '#microsoft.graph.copilotConversationReference',
    targetLink: meetingUrl('AAMkAGZmMDAxMTk5MDc', '075c93'),
    isCitedInResponse: true
  },
  f65b12: {
    '@odata.type': '#microsoft.graph.copilotConversationReference',
    targetLink: meetingUrl('AAMkAGZmMDAxMTk5MDY', 'f65b12'),
    isCitedInResponse: true
  },
  e5480a: {
    '@odata.type': '#microsoft.graph.copilotConversationReference',
    targetLink: meetingUrl('AAMkAGZmMDAxMTk5MDU', 'e5480a'),
    isCitedInResponse: true
  },
  d43a51: {
    '@odata.type': '#microsoft.graph.copilotConversationReference',
    targetLink: meetingUrl('AAMkAGZmMDAxMTk5MDQ', 'd43a51'),
    isCitedInResponse: true
  },
  c3204f: {
    '@odata.type': '#microsoft.graph.copilotConversationReference',
    targetLink: meetingUrl('AAMkAGZmMDAxMTk5MDM', 'c3204f'),
    isCitedInResponse: true
  },
  b21e3d: {
    '@odata.type': '#microsoft.graph.copilotConversationReference',
    targetLink: meetingUrl('AAMkAGZmMDAxMTk5MDI', 'b21e3d'),
    isCitedInResponse: true
  },
  a10f2c: {
    '@odata.type': '#microsoft.graph.copilotConversationReference',
    targetLink: meetingUrl('AAMkAGZmMDAxMTk5MDE', 'a10f2c'),
    isCitedInResponse: true
  }
};

interface IMockScenario {
  /** Lower-case keywords; first scenario with a match wins. */
  keywords: string[];
  message: Omit<IWorkIQMessage, 'id' | 'createdDateTime'>;
}

const SCENARIOS: IMockScenario[] = [
  {
    keywords: ['how many meeting', 'meetings next week', 'meetings do i have', 'meeting load'],
    message: {
      '@odata.type': '#microsoft.graph.copilotConversationResponseMessage',
      text: MOCK_MEETINGS_ANSWER_TEXT,
      adaptiveCards: [{}],
      attributions: [],
      references: MOCK_MEETINGS_REFERENCES,
      sensitivityLabel: UNLABELED_SENSITIVITY
    }
  },
  {
    keywords: ['q3', 'planning', 'decide', 'decided', 'decision'],
    message: {
      '@odata.type': '#microsoft.graph.copilotConversationResponseMessage',
      text:
        'The **Q3 Planning Review** on 14 August covered three decisions. ' +
        `[1](${meetingUrl('AAMkADg5ZjdjZGNiLWRiMzI', 'qtrreview')})\n\n` +
        '### Decisions\n' +
        '- **Migration date moved to 3 October** — Priya Raman raised that the ' +
        'network freeze overlaps the original date, and the room agreed to shift by two weeks. ' +
        `[1](${meetingUrl('AAMkADg5ZjdjZGNiLWRiMzI', 'qtrreview')})\n` +
        '- **Reporting workstream paused** until the data model is signed off, owned by ' +
        'Daniel Okafor.\n' +
        '- **Budget reforecast approved** at the revised figure in Q3-Reforecast.xlsx. ' +
        '[2](https://contoso.sharepoint.com/sites/Finance/Shared%20Documents/Planning/Q3-Reforecast.xlsx#reforecastxlsx)\n\n' +
        '### Open items\n' +
        '- Priya Raman to confirm the freeze window with the network team. ' +
        '[3](https://www.office.com/search?q=Priya+Raman#priyaraman)\n' +
        '- No owner yet for the customer comms plan.\n\n' +
        'Would you like me to pull the follow-up actions into a list?',
      adaptiveCards: [{}],
      attributions: [],
      references: {
        qtrreview: {
          '@odata.type': '#microsoft.graph.copilotConversationReference',
          targetLink: meetingUrl('AAMkADg5ZjdjZGNiLWRiMzI', 'qtrreview'),
          isCitedInResponse: true
        },
        reforecastxlsx: {
          '@odata.type': '#microsoft.graph.copilotConversationReference',
          targetLink:
            'https://contoso.sharepoint.com/sites/Finance/Shared%20Documents/Planning/Q3-Reforecast.xlsx',
          isCitedInResponse: true
        },
        priyaraman: {
          '@odata.type': '#microsoft.graph.copilotConversationReference',
          targetLink: 'https://www.office.com/search?q=Priya+Raman',
          isCitedInResponse: true
        }
      },
      sensitivityLabel: UNLABELED_SENSITIVITY
    }
  },
  {
    // documented shape, not the real one; see module comment
    keywords: ['contoso', 'proposal', 'who', 'working on'],
    message: {
      '@odata.type': '#microsoft.graph.copilotConversationResponseMessage',
      text:
        'Three people have been active on the Contoso proposal in the last two weeks.\n\n' +
        '- <Person>Daniel Okafor</Person> — owns the commercial section and made the most ' +
        'recent edits to <File>Contoso-Proposal-v4.docx</File>.[^1^]\n' +
        '- <Person>Mei Lin</Person> — leads the solution design, presented at ' +
        '<Event>Contoso Solution Walkthrough</Event>.[^2^]\n' +
        '- <Person>Priya Raman</Person> — reviewing for delivery risk; her comments are ' +
        'unresolved in the document.[^1^]\n\n' +
        'The proposal is **due 29 August** and the pricing annex is still marked draft.',
      adaptiveCards: [{}],
      attributions: [
        {
          attributionType: 'annotation',
          providerDisplayName: '',
          attributionSource: 'model',
          seeMoreWebUrl: 'https://www.office.com/search?q=Daniel+Okafor',
          imageWebUrl: '',
          imageFavIcon: '',
          imageWidth: 0,
          imageHeight: 0
        },
        {
          attributionType: 'citation',
          providerDisplayName: 'Contoso-Proposal-v4.docx',
          attributionSource: 'grounding',
          seeMoreWebUrl:
            'https://contoso.sharepoint.com/sites/Sales/Shared%20Documents/Contoso/Contoso-Proposal-v4.docx',
          imageWebUrl: '',
          imageFavIcon: '',
          imageWidth: 0,
          imageHeight: 0
        },
        {
          attributionType: 'citation',
          providerDisplayName: 'Contoso Solution Walkthrough',
          attributionSource: 'grounding',
          seeMoreWebUrl:
            'https://teams.microsoft.com/l/meeting/details?eventId=BBMkADg5ZjdjZGNiLWRiMzItNDA3MC1iNDNl',
          imageWebUrl: '',
          imageFavIcon: '',
          imageWidth: 0,
          imageHeight: 0
        },
        {
          attributionType: 'citation',
          providerDisplayName: 'Mei Lin',
          attributionSource: 'model',
          seeMoreWebUrl: 'https://www.office.com/search?q=Mei+Lin',
          imageWebUrl: '',
          imageFavIcon: '',
          imageWidth: 0,
          imageHeight: 0
        }
      ],
      sensitivityLabel: {
        sensitivityLabelId: 'f8a9c1e2-4b7d-4a3e-9c15-0d6e2b8f4a71',
        displayName: 'Confidential \\ Customer',
        tooltip: 'This answer draws on content labelled Confidential \\ Customer.',
        priority: 3,
        color: '#B4009E',
        isEncrypted: false
      }
    }
  }
];

/** Fallback when the question matches no scenario. Real shape, like most live traffic. */
const DEFAULT_MESSAGE: Omit<IWorkIQMessage, 'id' | 'createdDateTime'> = {
  '@odata.type': '#microsoft.graph.copilotConversationResponseMessage',
  text:
    'Here is what I found across your recent mail, meetings, and files.\n\n' +
    'The most relevant item is Migration-Runbook.docx, last updated by Daniel Okafor. ' +
    '[1](https://contoso.sharepoint.com/sites/Operations/Shared%20Documents/Migration/Migration-Runbook.docx#runbookdocx) ' +
    'It was walked through at Migration Readiness Check earlier this week. ' +
    `[2](${meetingUrl('CCMkADg5ZjdjZGNiLWRiMzI', 'readinesscheck')})\n\n` +
    '---\n\n' +
    'Ask a follow-up and this component reuses the same conversation, so Work IQ keeps the thread.',
  adaptiveCards: [{}],
  attributions: [],
  references: {
    runbookdocx: {
      '@odata.type': '#microsoft.graph.copilotConversationReference',
      targetLink:
        'https://contoso.sharepoint.com/sites/Operations/Shared%20Documents/Migration/Migration-Runbook.docx',
      isCitedInResponse: true
    },
    readinesscheck: {
      '@odata.type': '#microsoft.graph.copilotConversationReference',
      targetLink: meetingUrl('CCMkADg5ZjdjZGNiLWRiMzI', 'readinesscheck'),
      isCitedInResponse: true
    }
  },
  sensitivityLabel: UNLABELED_SENSITIVITY
};

/** Mirrors the `201 Created` body from `POST /rest/conversations`. */
export function createMockConversation(): IWorkIQConversation {
  return {
    id: MOCK_CONVERSATION_ID,
    createdDateTime: new Date().toISOString(),
    displayName: '',
    status: 'active',
    turnCount: 0
  };
}

/**
 * Mirrors the `200 OK` body from `POST /rest/conversations/{id}/chat`.
 *
 * `turnCount` is passed in by the service so multi-turn behaves like the real
 * API: the counter is server-side state that climbs across the conversation.
 */
export function createMockChatResponse(
  conversationId: string,
  questionText: string,
  turnCount: number
): IWorkIQConversation {
  const normalized = questionText.toLowerCase();
  const scenario = SCENARIOS.filter((candidate) =>
    candidate.keywords.some((keyword) => normalized.indexOf(keyword) !== -1)
  )[0];

  const answer = scenario ? scenario.message : DEFAULT_MESSAGE;
  const now = new Date().toISOString();

  return {
    id: conversationId,
    createdDateTime: now,
    displayName: questionText,
    state: 'active',
    turnCount,
    messages: [
      // Same @odata.type as the answer; the service reads the last message, not by type.
      {
        '@odata.type': '#microsoft.graph.copilotConversationResponseMessage',
        id: `mock-user-${turnCount}`,
        text: questionText,
        createdDateTime: now,
        adaptiveCards: [],
        attributions: [],
        sensitivityLabel: UNLABELED_SENSITIVITY
      },
      {
        ...answer,
        id: `mock-answer-${turnCount}`,
        createdDateTime: now
      }
    ]
  };
}
