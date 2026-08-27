// Unit tests for the answer parser: documented-shape fixtures (entity tags,
// [^n^] footnotes) plus real-shape fixtures shared with the mock
// (MOCK_MEETINGS_ANSWER_TEXT).

import {
  collectEntities,
  parseAnswer,
  parseInline,
  toPlainText,
  type IAnswerSegment,
  type IEntitySegment
} from './entityParser';
import { MOCK_MEETINGS_ANSWER_TEXT } from './mockResponses';

function kinds(segments: IAnswerSegment[]): string[] {
  return segments.map((segment) => segment.kind);
}

describe('parseInline', () => {
  it('returns a single text segment when there is no markup', () => {
    expect(parseInline('Just a sentence.')).toEqual([
      { kind: 'text', text: 'Just a sentence.' }
    ]);
  });

  it('parses each entity tag into a typed chip segment', () => {
    const segments = parseInline(
      '<Person>John Doe</Person> and <Event>Standup</Event> and <File>Spec.docx</File>'
    );

    expect(segments.filter((s) => s.kind === 'entity')).toEqual([
      { kind: 'entity', entity: 'person', label: 'John Doe' },
      { kind: 'entity', entity: 'event', label: 'Standup' },
      { kind: 'entity', entity: 'file', label: 'Spec.docx' }
    ]);
  });

  it('keeps the text either side of an entity', () => {
    const segments = parseInline('Organizer: <Person>John Doe</Person> today');

    expect(segments).toEqual([
      { kind: 'text', text: 'Organizer: ' },
      { kind: 'entity', entity: 'person', label: 'John Doe' },
      { kind: 'text', text: ' today' }
    ]);
  });

  it('parses footnote markers into numbered references', () => {
    const segments = parseInline('Confirmed[^1^] and pending[^12^]');

    expect(segments.filter((s) => s.kind === 'footnote')).toEqual([
      { kind: 'footnote', index: 1 },
      { kind: 'footnote', index: 12 }
    ]);
  });

  it('does not mistake a footnote marker for a markdown link', () => {
    // Both start with '[', so ordering inside the combined pattern matters.
    expect(kinds(parseInline('See[^1^]'))).toEqual(['text', 'footnote']);
  });

  it('parses markdown links into link segments', () => {
    expect(parseInline('Open [the doc](https://contoso.sharepoint.com/a.docx)')).toEqual([
      { kind: 'text', text: 'Open ' },
      {
        kind: 'link',
        text: 'the doc',
        url: 'https://contoso.sharepoint.com/a.docx'
      }
    ]);
  });

  it('parses a numeric-text markdown link as a citationLink, not a link', () => {
    expect(
      parseInline('[1](https://teams.microsoft.com/l/meeting/details?eventId=aaa#f1)')
    ).toEqual([
      {
        kind: 'citationLink',
        displayIndex: 1,
        url: 'https://teams.microsoft.com/l/meeting/details?eventId=aaa#f1'
      }
    ]);
  });

  it('parses several adjacent citationLink markers as distinct segments, not one blob', () => {
    const segments = parseInline('[1](u1#a)[2](u2#b)[3](u3#c)');

    expect(segments).toEqual([
      { kind: 'citationLink', displayIndex: 1, url: 'u1#a' },
      { kind: 'citationLink', displayIndex: 2, url: 'u2#b' },
      { kind: 'citationLink', displayIndex: 3, url: 'u3#c' }
    ]);
  });

  it('keeps a non-numeric link as a plain link, not a citationLink', () => {
    expect(kinds(parseInline('[Open the doc](https://a.example/x)'))).toEqual(['link']);
  });

  it('parses bold runs', () => {
    expect(parseInline('Due **29 August** sharp')).toEqual([
      { kind: 'text', text: 'Due ' },
      { kind: 'bold', text: '29 August' },
      { kind: 'text', text: ' sharp' }
    ]);
  });

  it('handles an entity immediately followed by a footnote', () => {
    // The exact pattern from the reference response.
    expect(kinds(parseInline('<Person>John Doe</Person>[^1^]'))).toEqual([
      'entity',
      'footnote'
    ]);
  });

  it('merges adjacent plain text rather than emitting fragments', () => {
    const segments = parseInline('a **b** c d');
    expect(segments[segments.length - 1]).toEqual({ kind: 'text', text: ' c d' });
  });

  it('leaves an unclosed tag as literal text', () => {
    const segments = parseInline('<Person>Unclosed name');
    expect(kinds(segments)).toEqual(['text']);
  });

  it('returns nothing for an empty line', () => {
    expect(parseInline('')).toEqual([]);
  });
});

describe('parseAnswer', () => {
  it('parses headings with their level', () => {
    const blocks = parseAnswer('### Decisions');
    expect(blocks).toEqual([
      { kind: 'heading', level: 3, segments: [{ kind: 'text', text: 'Decisions' }] }
    ]);
  });

  it('parses list items and strips the bullet', () => {
    const blocks = parseAnswer('- **Meeting**: <Event>Standup</Event>');

    expect(blocks.length).toBe(1);
    expect(blocks[0].kind).toBe('listItem');
    expect(kinds(blocks[0].segments)).toEqual(['bold', 'text', 'entity']);
  });

  it('merges soft-wrapped lines into one paragraph', () => {
    const blocks = parseAnswer('first line\nsecond line');

    expect(blocks).toEqual([
      { kind: 'paragraph', segments: [{ kind: 'text', text: 'first line second line' }] }
    ]);
  });

  it('splits paragraphs on a blank line', () => {
    const blocks = parseAnswer('one\n\ntwo');
    expect(blocks.map((b) => b.kind)).toEqual(['paragraph', 'paragraph']);
  });

  it('recognises a horizontal rule as a divider', () => {
    const blocks = parseAnswer('one\n\n---\n\ntwo');
    expect(blocks.map((b) => b.kind)).toEqual(['paragraph', 'divider', 'paragraph']);
  });

  it('normalises CRLF line endings', () => {
    const blocks = parseAnswer('### A\r\n- item');
    expect(blocks.map((b) => b.kind)).toEqual(['heading', 'listItem']);
  });

  it('returns no blocks for empty input', () => {
    expect(parseAnswer('')).toEqual([]);
  });

  it('parses a full reference-shaped answer end to end', () => {
    const text =
      'You asked about your meeting scheduled for **9 AM tomorrow**.\n\n' +
      '### Tomorrow at 9 AM\n' +
      '- **Meeting**: <Event>Contoso Engineering Standup</Event>\n' +
      '- **Organizer**: <Person>John Doe</Person>[^1^]\n' +
      '- **Status**: No one has accepted the invite yet[^1^]';

    const blocks = parseAnswer(text);

    expect(blocks.map((b) => b.kind)).toEqual([
      'paragraph',
      'heading',
      'listItem',
      'listItem',
      'listItem'
    ]);

    const entities = collectEntities(blocks);
    expect(entities).toEqual([
      { kind: 'entity', entity: 'event', label: 'Contoso Engineering Standup' },
      { kind: 'entity', entity: 'person', label: 'John Doe' }
    ]);
  });
});

describe('parseAnswer — real payload (MOCK_MEETINGS_ANSWER_TEXT)', () => {
  it('parses the opening sentence into nine distinct citationLink segments, not one concatenated string', () => {
    const blocks = parseAnswer(MOCK_MEETINGS_ANSWER_TEXT);
    const opening = blocks[0];

    const citationLinks = opening.segments.filter(
      (segment) => segment.kind === 'citationLink'
    );

    expect(citationLinks.length).toBe(9);
    expect(citationLinks.map((s) => (s.kind === 'citationLink' ? s.displayIndex : undefined))).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9
    ]);

    const rawConcatenatedDigits = opening.segments.filter(
      (segment) => segment.kind === 'text' && /^\d{2,}$/.test(segment.text)
    );
    expect(rawConcatenatedDigits).toEqual([]);
  });

  it('gives each citationLink its own url, not a shared or missing one', () => {
    const blocks = parseAnswer(MOCK_MEETINGS_ANSWER_TEXT);
    const citationLinks = blocks[0].segments.filter(
      (segment): segment is Extract<IAnswerSegment, { kind: 'citationLink' }> =>
        segment.kind === 'citationLink'
    );

    const urls = citationLinks.map((s) => s.url);
    expect(new Set(urls).size).toBe(9); // all distinct
    expect(urls.every((url) => url.indexOf('#') !== -1)).toBe(true); // all carry a fragment
  });

  it('reuses the same marker number across different bullets for a recurring meeting', () => {
    const blocks = parseAnswer(MOCK_MEETINGS_ANSWER_TEXT);
    const bauBullet = blocks.filter(
      (block) =>
        block.kind === 'listItem' &&
        block.segments.some((s) => s.kind === 'bold' && s.text === 'BAU Standup')
    )[0];

    expect(bauBullet).toBeDefined();
    const bulletCitations = bauBullet.segments.filter((s) => s.kind === 'citationLink');
    expect(bulletCitations.length).toBe(6);
  });
});

describe('collectEntities', () => {
  it('de-duplicates repeated mentions but keeps first-appearance order', () => {
    const blocks = parseAnswer(
      '<Person>Mei Lin</Person> met <Person>John Doe</Person>, then <Person>Mei Lin</Person> left.'
    );

    expect(collectEntities(blocks).map((e: IEntitySegment) => e.label)).toEqual([
      'Mei Lin',
      'John Doe'
    ]);
  });

  it('treats the same label under different kinds as distinct entities', () => {
    const blocks = parseAnswer('<Person>Review</Person> and <Event>Review</Event>');
    expect(collectEntities(blocks).length).toBe(2);
  });

  it('is case-insensitive when de-duplicating', () => {
    const blocks = parseAnswer('<Person>Mei Lin</Person> and <Person>mei lin</Person>');
    expect(collectEntities(blocks).length).toBe(1);
  });
});

describe('toPlainText', () => {
  it('keeps entity labels and drops markup and footnotes', () => {
    const blocks = parseAnswer(
      '- **Organizer**: <Person>John Doe</Person>[^1^]'
    );

    expect(toPlainText(blocks)).toBe('Organizer: John Doe');
  });

  it('renders each block on its own line', () => {
    expect(toPlainText(parseAnswer('### Title\n- one\n- two'))).toBe('Title\none\ntwo');
  });
});
