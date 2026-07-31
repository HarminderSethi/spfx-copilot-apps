/**
 * Copilot passes whatever the user typed ("teams", "Outlook", "AAD"), while
 * Graph keys `healthOverviews` on canonical names such as "Microsoft Teams".
 * These aliases bridge the gap before falling back to fuzzy matching.
 */
const SERVICE_ALIASES: Readonly<Record<string, string>> = {
  teams: 'microsoft teams',
  msteams: 'microsoft teams',
  outlook: 'exchange online',
  exchange: 'exchange online',
  email: 'exchange online',
  mail: 'exchange online',
  sharepoint: 'sharepoint online',
  spo: 'sharepoint online',
  onedrive: 'onedrive for business',
  od4b: 'onedrive for business',
  entra: 'microsoft entra',
  entraid: 'microsoft entra',
  aad: 'microsoft entra',
  azuread: 'microsoft entra',
  azureactivedirectory: 'microsoft entra',
  identity: 'microsoft entra',
  office: 'microsoft 365 apps',
  office365: 'microsoft 365 apps',
  m365apps: 'microsoft 365 apps',
  officeapps: 'microsoft 365 apps',
  word: 'microsoft 365 apps',
  excel: 'microsoft 365 apps',
  powerpoint: 'microsoft 365 apps',
  copilot: 'microsoft 365 copilot',
  purview: 'microsoft purview',
  intune: 'microsoft intune',
  defender: 'microsoft defender for cloud apps',
  powerbi: 'power bi',
  powerapps: 'power apps',
  powerautomate: 'power automate',
  flow: 'power automate',
  dynamics: 'dynamics 365 apps',
  viva: 'microsoft viva',
  yammer: 'viva engage',
  planner: 'planner',
  bookings: 'microsoft bookings',
  forms: 'microsoft forms',
  stream: 'microsoft stream',
  visio: 'microsoft 365 apps',
  onenote: 'microsoft 365 apps'
};

function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function toAliasKey(value: string): string {
  return normalize(value).replace(/ /g, '');
}

interface ICandidate<TItem> {
  item: TItem;
  normalized: string;
}

/**
 * Resolves a free-text service name against the services Graph returned.
 * Returns `undefined` when nothing is a confident match, so the caller can
 * fall back to the full list instead of showing an empty view.
 */
export function resolveServiceName<TItem>(
  requestedName: string,
  items: readonly TItem[],
  getName: (item: TItem) => string
): TItem | undefined {
  const requested = normalize(requestedName);
  if (!requested) {
    return undefined;
  }

  const candidates: ICandidate<TItem>[] = items.map((item) => ({ item, normalized: normalize(getName(item)) }));

  const exact = candidates.filter((candidate) => candidate.normalized === requested);
  if (exact.length > 0) {
    return exact[0].item;
  }

  const aliased = SERVICE_ALIASES[toAliasKey(requestedName)];
  if (aliased) {
    const aliasMatch = candidates.filter((candidate) => candidate.normalized === aliased);
    if (aliasMatch.length > 0) {
      return aliasMatch[0].item;
    }
  }

  const target = aliased || requested;
  const contains = candidates.filter(
    (candidate) => candidate.normalized.indexOf(target) >= 0 || target.indexOf(candidate.normalized) >= 0
  );
  if (contains.length === 1) {
    return contains[0].item;
  }
  if (contains.length > 1) {
    // Prefer the shortest name so "Exchange Online" wins over "Exchange Online Protection".
    return contains.slice().sort((first, second) => first.normalized.length - second.normalized.length)[0].item;
  }

  const requestedTokens = target.split(' ').filter((token) => token.length > 2);
  if (requestedTokens.length === 0) {
    return undefined;
  }

  const scored = candidates
    .map((candidate) => {
      const candidateTokens = candidate.normalized.split(' ');
      const overlap = requestedTokens.filter((token) => candidateTokens.indexOf(token) >= 0).length;
      return { item: candidate.item, score: overlap / requestedTokens.length };
    })
    .filter((entry) => entry.score >= 0.5)
    .sort((first, second) => second.score - first.score);

  return scored.length > 0 ? scored[0].item : undefined;
}
