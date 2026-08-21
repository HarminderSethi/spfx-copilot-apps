// Unit tests for citation filtering, classification, and grouping: documented-shape
// fixtures via attribution(), plus real-shape fixtures shared with the mock.

import {
  classifyCitationUrl,
  groupCitations,
  resolveCitationLink,
  resolveFootnote,
  toCitations,
  toCitationsFromReferences
} from './citations';
import { parseInline } from './entityParser';
import { MOCK_MEETINGS_ANSWER_TEXT, MOCK_MEETINGS_REFERENCES } from './mockResponses';
import type { IWorkIQAttribution, IWorkIQConversationReference } from './workIQTypes';

const MEETING_URL =
  'https://teams.microsoft.com/l/meeting/details?eventId=AAMkADg5ZjdjZGNi';
const FILE_URL =
  'https://contoso.sharepoint.com/sites/Finance/Shared%20Documents/Q3-Reforecast.xlsx';
const PERSON_URL = 'https://www.office.com/search?q=John+Doe';

function attribution(partial: Partial<IWorkIQAttribution>): IWorkIQAttribution {
  return {
    attributionType: partial.attributionType ?? 'citation',
    providerDisplayName: partial.providerDisplayName ?? 'A source',
    attributionSource: partial.attributionSource ?? 'grounding',
    seeMoreWebUrl: partial.seeMoreWebUrl ?? FILE_URL
  };
}

describe('classifyCitationUrl', () => {
  it('classifies Teams meeting deep links as meetings', () => {
    expect(classifyCitationUrl(MEETING_URL)).toBe('meeting');
  });

  it('classifies Office people search links as people', () => {
    expect(classifyCitationUrl(PERSON_URL)).toBe('person');
  });

  it('classifies SharePoint document links as files', () => {
    expect(classifyCitationUrl(FILE_URL)).toBe('file');
  });

  it('classifies OneDrive links as files', () => {
    expect(
      classifyCitationUrl('https://contoso-my.sharepoint.com/personal/x/Doc.docx')
    ).toBe('file');
  });

  it('prefers meeting over file when a meeting link carries a query string', () => {
    expect(
      classifyCitationUrl(
        'https://teams.microsoft.com/l/meeting/details?eventId=abc&file=notes.docx'
      )
    ).toBe('meeting');
  });

  it('falls back to other for an unrecognised host', () => {
    expect(classifyCitationUrl('https://example.com/some/page')).toBe('other');
  });

  it('returns other for an empty url', () => {
    expect(classifyCitationUrl('')).toBe('other');
  });
});

describe('toCitations', () => {
  it('keeps citations and discards annotations', () => {
    const citations = toCitations([
      attribution({
        attributionType: 'annotation',
        providerDisplayName: '',
        seeMoreWebUrl: MEETING_URL
      }),
      attribution({
        attributionType: 'citation',
        providerDisplayName: 'Contoso Engineering Standup',
        seeMoreWebUrl: MEETING_URL
      })
    ]);

    expect(citations.length).toBe(1);
    expect(citations[0].title).toBe('Contoso Engineering Standup');
  });

  it('numbers surviving citations from one, ignoring filtered annotations', () => {
    const citations = toCitations([
      attribution({ attributionType: 'annotation', providerDisplayName: '' }),
      attribution({ providerDisplayName: 'First' }),
      attribution({ providerDisplayName: 'Second' })
    ]);

    expect(citations.map((c) => c.ordinal)).toEqual([1, 2]);
    expect(citations.map((c) => c.title)).toEqual(['First', 'Second']);
  });

  it('drops citations with no link, since the row would not be clickable', () => {
    expect(toCitations([attribution({ seeMoreWebUrl: '' })])).toEqual([]);
  });

  it('flags grounding sources and leaves model ones unflagged', () => {
    const citations = toCitations([
      attribution({ attributionSource: 'grounding' }),
      attribution({ attributionSource: 'model', seeMoreWebUrl: PERSON_URL })
    ]);

    expect(citations.map((c) => c.isGrounded)).toEqual([true, false]);
  });

  it('captures the file extension for file citations only', () => {
    const citations = toCitations([
      attribution({ seeMoreWebUrl: FILE_URL }),
      attribution({ seeMoreWebUrl: MEETING_URL })
    ]);

    expect(citations[0].extension).toBe('xlsx');
    expect(citations[1].extension).toBeUndefined();
  });

  it('falls back to the decoded last path segment when there is no display name', () => {
    const citations = toCitations([
      attribution({ providerDisplayName: '', seeMoreWebUrl: FILE_URL })
    ]);

    expect(citations[0].title).toBe('Q3-Reforecast.xlsx');
  });

  it('tolerates an empty attributions array', () => {
    expect(toCitations([])).toEqual([]);
  });
});

describe('groupCitations', () => {
  it('groups by kind in meeting, file, person order', () => {
    const groups = groupCitations(
      toCitations([
        attribution({ seeMoreWebUrl: PERSON_URL }),
        attribution({ seeMoreWebUrl: FILE_URL }),
        attribution({ seeMoreWebUrl: MEETING_URL })
      ])
    );

    expect(groups.map((g) => g.kind)).toEqual(['meeting', 'file', 'person']);
  });

  it('omits groups that have no citations', () => {
    const groups = groupCitations(toCitations([attribution({ seeMoreWebUrl: FILE_URL })]));
    expect(groups.map((g) => g.kind)).toEqual(['file']);
  });
});

describe('resolveFootnote', () => {
  it('matches a marker to the citation at that ordinal', () => {
    const citations = toCitations([
      attribution({ providerDisplayName: 'First' }),
      attribution({ providerDisplayName: 'Second' })
    ]);

    expect(resolveFootnote(citations, 2)!.title).toBe('Second');
  });

  it('returns undefined when the marker points past the citation list', () => {
    const citations = toCitations([attribution({ providerDisplayName: 'Only' })]);
    expect(resolveFootnote(citations, 4)).toBeUndefined();
  });
});

function reference(partial: Partial<IWorkIQConversationReference>): IWorkIQConversationReference {
  return {
    '@odata.type': '#microsoft.graph.copilotConversationReference',
    targetLink: partial.targetLink ?? FILE_URL,
    isCitedInResponse: partial.isCitedInResponse ?? true
  };
}

describe('toCitationsFromReferences', () => {
  it('builds a citation per cited reference', () => {
    const citations = toCitationsFromReferences({
      a: reference({ targetLink: MEETING_URL }),
      b: reference({ targetLink: FILE_URL })
    });

    expect(citations.length).toBe(2);
    expect(citations.map((c) => c.url)).toEqual([MEETING_URL, FILE_URL]);
  });

  it('excludes entries with isCitedInResponse: false, same as annotations are excluded', () => {
    const citations = toCitationsFromReferences({
      a: reference({ isCitedInResponse: false }),
      b: reference({ isCitedInResponse: true })
    });

    expect(citations.length).toBe(1);
  });

  it('does not assert isGrounded, since references carries no such signal', () => {
    const citations = toCitationsFromReferences({ a: reference({}) });
    expect(citations[0].isGrounded).toBeUndefined();
  });

  it('records the map key so inline markers can resolve back to this citation', () => {
    const citations = toCitationsFromReferences({ myFragment: reference({}) });
    expect(citations[0].key).toBe('myFragment');
  });

  it('gives meeting citations a generic ordinal title, since references has no display name', () => {
    const citations = toCitationsFromReferences({
      a: reference({ targetLink: MEETING_URL }),
      b: reference({ targetLink: MEETING_URL + '&x=2' })
    });

    expect(citations.map((c) => c.title)).toEqual(['Meeting 1', 'Meeting 2']);
  });

  it('tolerates an undefined references map', () => {
    expect(toCitationsFromReferences(undefined)).toEqual([]);
  });
});

describe('toCitations — fallback to references', () => {
  it('prefers attributions when non-empty, ignoring references', () => {
    const citations = toCitations(
      [attribution({ providerDisplayName: 'From attributions' })],
      { a: reference({ targetLink: MEETING_URL }) }
    );

    expect(citations.length).toBe(1);
    expect(citations[0].title).toBe('From attributions');
  });

  it('falls back to references when attributions is empty — the real-world case', () => {
    const citations = toCitations([], { a: reference({ targetLink: MEETING_URL }) });
    expect(citations.length).toBe(1);
    expect(citations[0].url).toBe(MEETING_URL);
  });

  it('falls back to references when attributions is undefined', () => {
    const citations = toCitations(undefined, { a: reference({}) });
    expect(citations.length).toBe(1);
  });

  it('returns an empty list when both are empty', () => {
    expect(toCitations([], {})).toEqual([]);
  });
});

describe('resolveCitationLink', () => {
  it('resolves a marker to its citation via the URL fragment, not the display number', () => {
    // MOCK_MEETINGS_REFERENCES is in reverse order vs. the markers, so
    // marker "1" should resolve to ordinal 9, not ordinal 1.
    const citations = toCitationsFromReferences(MOCK_MEETINGS_REFERENCES);
    const marker1 = parseInline('[1](https://x/y#a10f2c)')[0];

    expect(marker1.kind).toBe('citationLink');
    const resolved =
      marker1.kind === 'citationLink' ? resolveCitationLink(citations, marker1.url) : undefined;

    expect(resolved).toBeDefined();
    expect(resolved!.key).toBe('a10f2c');
    expect(resolved!.ordinal).not.toBe(1);
  });

  it('falls back to full-url comparison when the url carries no fragment', () => {
    const citations = toCitationsFromReferences({ a: reference({ targetLink: FILE_URL }) });
    expect(resolveCitationLink(citations, FILE_URL)!.key).toBe('a');
  });

  it('returns undefined when nothing matches, rather than guessing', () => {
    const citations = toCitationsFromReferences({ a: reference({}) });
    expect(resolveCitationLink(citations, 'https://unrelated.example/x#zzz')).toBeUndefined();
  });
});

describe('MOCK_MEETINGS_ANSWER_TEXT + MOCK_MEETINGS_REFERENCES', () => {
  it('builds a 9-row source panel from references, matching the 9 meetings in the text', () => {
    const citations = toCitations([], MOCK_MEETINGS_REFERENCES);
    expect(citations.length).toBe(9);

    const groups = groupCitations(citations);
    expect(groups.map((g) => g.kind)).toEqual(['meeting']);
    expect(groups[0].citations.length).toBe(9);
  });

  it('resolves every citationLink marker in the opening sentence to a distinct citation', () => {
    const citations = toCitations([], MOCK_MEETINGS_REFERENCES);
    const opening = parseInline(MOCK_MEETINGS_ANSWER_TEXT.split('\n')[0]);
    const markers = opening.filter((segment) => segment.kind === 'citationLink');

    expect(markers.length).toBe(9);

    const resolvedKeys = markers.map((marker) =>
      marker.kind === 'citationLink'
        ? resolveCitationLink(citations, marker.url)?.key
        : undefined
    );

    expect(resolvedKeys.every((key) => key !== undefined)).toBe(true);
    expect(new Set(resolvedKeys).size).toBe(9);
  });
});
