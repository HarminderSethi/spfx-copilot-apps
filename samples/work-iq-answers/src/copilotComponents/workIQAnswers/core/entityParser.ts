/**
 * Parses a Work IQ answer string into blocks and inline segments for the React
 * layer. Work IQ cites sources two different ways:
 *
 * - Entity tags plus `[^n^]` footnotes, resolved against `attributions`
 *   (documented API shape).
 * - `[N](url)` citation links resolved against a `references` map (what live
 *   tenant responses actually send, see `workIQTypes.ts`). `N` is a display
 *   index, not a stable id, so segments keep the full URL.
 *
 * Both are parsed here into typed segments (text, entity, footnote,
 * citationLink, link, bold). Pure and synchronous, see `entityParser.test.ts`.
 */

/** The three entity kinds Work IQ tags inline. */
export type EntityKind = 'person' | 'event' | 'file';

export interface ITextSegment {
  kind: 'text';
  text: string;
}

export interface IEntitySegment {
  kind: 'entity';
  entity: EntityKind;
  label: string;
}

export interface IFootnoteSegment {
  kind: 'footnote';
  /** The number as written, e.g. 1 for `[^1^]`. 1-based, as Work IQ emits it. */
  index: number;
}

export interface ILinkSegment {
  kind: 'link';
  text: string;
  url: string;
}

/** `[N](url)` citation marker. `displayIndex` is not a stable id; resolve by `url`, see `resolveCitationLink`. */
export interface ICitationLinkSegment {
  kind: 'citationLink';
  displayIndex: number;
  url: string;
}

export interface IBoldSegment {
  kind: 'bold';
  text: string;
}

export type IAnswerSegment =
  | ITextSegment
  | IEntitySegment
  | IFootnoteSegment
  | ILinkSegment
  | ICitationLinkSegment
  | IBoldSegment;

export type BlockKind = 'paragraph' | 'heading' | 'listItem' | 'divider';

export interface IAnswerBlock {
  kind: BlockKind;
  /** Heading level 1-6; only set when `kind` is `heading`. */
  level?: number;
  segments: IAnswerSegment[];
}

/**
 * One combined pattern, matched in a single pass, so the alternatives cannot
 * fight over the same characters. Order matters for the two `[`-prefixed
 * alternatives: a footnote `[^1^]` must be tried before the link pattern.
 *
 * Capture groups:
 *   1 entity tag name   2 entity label
 *   3 footnote number
 *   4 link text         5 link url
 *   6 bold text
 */
const INLINE_PATTERN =
  /<(Person|Event|File)>([\s\S]*?)<\/\1>|\[\^(\d+)\^\]|\[([^\]\n]*)\]\(([^)\s]*)\)|\*\*([\s\S]+?)\*\*/g;

const ENTITY_KINDS: { [tag: string]: EntityKind } = {
  Person: 'person',
  Event: 'event',
  File: 'file'
};

/** A markdown link whose visible text is purely digits: a citation marker, not prose. */
const NUMERIC_LINK_TEXT_PATTERN = /^\d+$/;

const HEADING_PATTERN = /^(#{1,6})\s+(.*)$/;
const LIST_ITEM_PATTERN = /^\s*[-*+]\s+(.*)$/;
const DIVIDER_PATTERN = /^\s*(?:-{3,}|\*{3,}|_{3,})\s*$/;

/**
 * Splits a single line of markdown into inline segments.
 *
 * Adjacent plain text is emitted as one `text` segment; empty runs are skipped
 * so the caller never has to filter out zero-length nodes.
 */
export function parseInline(line: string): IAnswerSegment[] {
  const segments: IAnswerSegment[] = [];
  let cursor = 0;

  // `lastIndex` is stateful on a /g regex, so reset before each use.
  INLINE_PATTERN.lastIndex = 0;

  let match = INLINE_PATTERN.exec(line);
  while (match !== null) {
    if (match.index > cursor) {
      pushText(segments, line.substring(cursor, match.index));
    }

    const [, entityTag, entityLabel, footnote, linkText, linkUrl, boldText] = match;

    if (entityTag !== undefined) {
      segments.push({
        kind: 'entity',
        entity: ENTITY_KINDS[entityTag],
        label: entityLabel.trim()
      });
    } else if (footnote !== undefined) {
      segments.push({ kind: 'footnote', index: parseInt(footnote, 10) });
    } else if (linkUrl !== undefined) {
      if (NUMERIC_LINK_TEXT_PATTERN.test(linkText)) {
        segments.push({
          kind: 'citationLink',
          displayIndex: parseInt(linkText, 10),
          url: linkUrl
        });
      } else {
        segments.push({ kind: 'link', text: linkText || linkUrl, url: linkUrl });
      }
    } else if (boldText !== undefined) {
      segments.push({ kind: 'bold', text: boldText });
    }

    cursor = match.index + match[0].length;
    match = INLINE_PATTERN.exec(line);
  }

  if (cursor < line.length) {
    pushText(segments, line.substring(cursor));
  }

  return segments;
}

/**
 * Parses a full answer into renderable blocks.
 *
 * Consecutive non-empty, non-structural lines are merged into a single
 * paragraph (standard markdown behaviour), so a soft-wrapped sentence does not
 * render as several stacked paragraphs.
 */
export function parseAnswer(text: string): IAnswerBlock[] {
  const blocks: IAnswerBlock[] = [];
  let paragraph: string[] = [];

  function flushParagraph(): void {
    if (paragraph.length > 0) {
      blocks.push({ kind: 'paragraph', segments: parseInline(paragraph.join(' ')) });
      paragraph = [];
    }
  }

  const lines = (text || '').replace(/\r\n/g, '\n').split('\n');

  for (const rawLine of lines) {
    // Not trimRight(); the SPFx rig's lib target predates it.
    const line = rawLine.replace(/\s+$/, '');

    if (line.trim().length === 0) {
      flushParagraph();
      continue;
    }

    if (DIVIDER_PATTERN.test(line)) {
      flushParagraph();
      blocks.push({ kind: 'divider', segments: [] });
      continue;
    }

    const heading = HEADING_PATTERN.exec(line);
    if (heading) {
      flushParagraph();
      blocks.push({
        kind: 'heading',
        level: heading[1].length,
        segments: parseInline(heading[2])
      });
      continue;
    }

    const listItem = LIST_ITEM_PATTERN.exec(line);
    if (listItem) {
      flushParagraph();
      blocks.push({ kind: 'listItem', segments: parseInline(listItem[1]) });
      continue;
    }

    paragraph.push(line.trim());
  }

  flushParagraph();
  return blocks;
}

/**
 * Every distinct entity mentioned in the answer, in first-appearance order.
 * Used to summarise "who and what this answer touched" above the fold.
 */
export function collectEntities(blocks: IAnswerBlock[]): IEntitySegment[] {
  const seen: { [key: string]: true } = {};
  const entities: IEntitySegment[] = [];

  for (const block of blocks) {
    for (const segment of block.segments) {
      if (segment.kind === 'entity') {
        const key = `${segment.entity}::${segment.label.toLowerCase()}`;
        if (!seen[key]) {
          seen[key] = true;
          entities.push(segment);
        }
      }
    }
  }

  return entities;
}

/**
 * Flattens blocks back to readable plain text. Entity labels kept, markup and
 * footnote markers dropped. Used for `aria-label` and copy-to-clipboard, where
 * chips and superscripts have no meaning.
 */
export function toPlainText(blocks: IAnswerBlock[]): string {
  return blocks
    .map((block) =>
      block.segments
        .map((segment) => {
          switch (segment.kind) {
            case 'text':
              return segment.text;
            case 'entity':
              return segment.label;
            case 'link':
            case 'bold':
              return segment.text;
            case 'footnote':
            case 'citationLink':
            default:
              return '';
          }
        })
        .join('')
        .trim()
    )
    .filter((line) => line.length > 0)
    .join('\n');
}

function pushText(segments: IAnswerSegment[], text: string): void {
  if (text.length === 0) {
    return;
  }

  const previous = segments[segments.length - 1];
  if (previous && previous.kind === 'text') {
    previous.text += text;
    return;
  }

  segments.push({ kind: 'text', text });
}
