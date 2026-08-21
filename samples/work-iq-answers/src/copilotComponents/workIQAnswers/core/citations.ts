/**
 * Turns a message's citation data into the grouped source list the panel
 * renders. Two source shapes: `attributions` (documented, has a display name
 * and grounding signal, empty on every live response so far) and `references`
 * (what live responses populate: id-keyed, no display name). `toCitations`
 * prefers `attributions` and falls back to `references`.
 *
 * `annotation` entries in `attributions` are excluded by `attributionType`,
 * not by "has a name". They ship an empty `providerDisplayName` rather than
 * an absent one. Grouping classifies on the deep-link shape, since neither
 * source labels a citation as a meeting, file, or person.
 */
import type { IWorkIQAttribution, IWorkIQConversationReference } from './workIQTypes';

export type CitationGroupKind = 'meeting' | 'file' | 'person' | 'other';

export interface ICitation {
  /** 1-based position in this list. Used by `resolveFootnote`; unrelated to a `references` citation's display number. */
  ordinal: number;
  title: string;
  url: string;
  group: CitationGroupKind;
  /** Undefined when the source data carries no grounding signal (the `references` path). */
  isGrounded?: boolean;
  /** File extension for `file` citations, e.g. `docx`. */
  extension?: string;
  /** `references` map key this citation was built from; how `resolveCitationLink` matches a marker back. */
  key?: string;
}

export interface ICitationGroup {
  kind: CitationGroupKind;
  citations: ICitation[];
}

/** Group render order: most concrete source type first. */
const GROUP_ORDER: CitationGroupKind[] = ['meeting', 'file', 'person', 'other'];

const FILE_EXTENSION_PATTERN = /\.([a-z0-9]{2,5})(?:$|[?#])/i;

/** Classifies a citation URL. Order matters: meeting links can have file-ish query strings. */
export function classifyCitationUrl(url: string): CitationGroupKind {
  if (!url) {
    return 'other';
  }

  const normalized = url.toLowerCase();

  if (normalized.indexOf('teams.microsoft.com/l/meeting') !== -1) {
    return 'meeting';
  }

  // The documented person deep link is an Office search for the display name.
  if (
    normalized.indexOf('office.com/search') !== -1 ||
    normalized.indexOf('/_layouts/15/me.aspx') !== -1 ||
    normalized.indexOf('delve') !== -1
  ) {
    return 'person';
  }

  if (
    normalized.indexOf('sharepoint.com') !== -1 ||
    normalized.indexOf('-my.sharepoint.com') !== -1 ||
    FILE_EXTENSION_PATTERN.test(stripQuery(normalized))
  ) {
    return 'file';
  }

  return 'other';
}

/** Filters `attributions` down to real citations and numbers them. Entries without a link are dropped. */
export function toCitationsFromAttributions(attributions: IWorkIQAttribution[]): ICitation[] {
  const citations: ICitation[] = [];

  for (const attribution of attributions || []) {
    if (attribution.attributionType !== 'citation') {
      continue;
    }

    const url = attribution.seeMoreWebUrl || '';
    if (!url) {
      continue;
    }

    const group = classifyCitationUrl(url);

    citations.push({
      ordinal: citations.length + 1,
      title: attribution.providerDisplayName || fallbackTitle(url, group, citations),
      url,
      group,
      isGrounded: attribution.attributionSource === 'grounding',
      extension: group === 'file' ? extractExtension(url) : undefined
    });
  }

  return citations;
}

/** Builds citations from a message's `references` map. Entries with `isCitedInResponse: false` are excluded. */
export function toCitationsFromReferences(
  references: { [key: string]: IWorkIQConversationReference } | undefined
): ICitation[] {
  const citations: ICitation[] = [];

  for (const key of Object.keys(references || {})) {
    const reference = (references as { [key: string]: IWorkIQConversationReference })[key];

    if (!reference.isCitedInResponse) {
      continue;
    }

    const url = reference.targetLink || '';
    if (!url) {
      continue;
    }

    const group = classifyCitationUrl(url);

    citations.push({
      ordinal: citations.length + 1,
      title: fallbackTitle(url, group, citations),
      url,
      group,
      extension: group === 'file' ? extractExtension(url) : undefined,
      key
    });
  }

  return citations;
}

/** Prefers `attributions` when non-empty, falls back to `references`. */
export function toCitations(
  attributions: IWorkIQAttribution[] | undefined,
  references?: { [key: string]: IWorkIQConversationReference }
): ICitation[] {
  const fromAttributions = toCitationsFromAttributions(attributions || []);
  if (fromAttributions.length > 0) {
    return fromAttributions;
  }

  return toCitationsFromReferences(references);
}

/** Groups citations for rendering, dropping groups with nothing in them. */
export function groupCitations(citations: ICitation[]): ICitationGroup[] {
  return GROUP_ORDER.map((kind) => ({
    kind,
    citations: citations.filter((citation) => citation.group === kind)
  })).filter((group) => group.citations.length > 0);
}

/**
 * Resolves a `[^n^]` footnote marker to a citation from the `attributions`
 * path by matching marker `n` to the nth citation. Not a documented contract;
 * footnote markers carry no URL of their own, so this is a best guess.
 */
export function resolveFootnote(
  citations: ICitation[],
  index: number
): ICitation | undefined {
  return citations.filter((citation) => citation.ordinal === index)[0];
}

/** Resolves a `[N](url)` marker to its citation record by URL fragment, falling back to a full-url match. */
export function resolveCitationLink(
  citations: ICitation[],
  url: string
): ICitation | undefined {
  const key = extractFragmentKey(url);

  if (key) {
    const byKey = citations.filter((citation) => citation.key === key)[0];
    if (byKey) {
      return byKey;
    }
  }

  return citations.filter((citation) => citation.url === url)[0];
}

function stripQuery(url: string): string {
  const queryStart = url.indexOf('?');
  return queryStart === -1 ? url : url.substring(0, queryStart);
}

function stripFragment(url: string): string {
  const fragmentStart = url.indexOf('#');
  return fragmentStart === -1 ? url : url.substring(0, fragmentStart);
}

function extractFragmentKey(url: string): string | undefined {
  const fragmentStart = url.indexOf('#');
  return fragmentStart === -1 ? undefined : url.substring(fragmentStart + 1);
}

function extractExtension(url: string): string | undefined {
  const match = FILE_EXTENSION_PATTERN.exec(stripQuery(stripFragment(url)));
  return match ? match[1].toLowerCase() : undefined;
}

/** Best-effort title when no display name is available. Meeting eventIds aren't readable, so those get a generic ordinal label. */
function fallbackTitle(url: string, group: CitationGroupKind, existing: ICitation[]): string {
  if (group === 'meeting') {
    const ordinalInGroup = existing.filter((citation) => citation.group === 'meeting').length + 1;
    return `Meeting ${ordinalInGroup}`;
  }

  const withoutQuery = stripQuery(stripFragment(url));
  const segments = withoutQuery.split('/').filter((segment) => segment.length > 0);
  const last = segments[segments.length - 1];

  if (!last) {
    return url;
  }

  try {
    return decodeURIComponent(last);
  } catch {
    return last;
  }
}
