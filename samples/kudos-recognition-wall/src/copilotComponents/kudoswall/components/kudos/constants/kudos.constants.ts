import type { KudosValueKey } from "../models/kudos.types";

/**
 * Absolute URL of the site that hosts the Kudos + Departments lists. A Copilot
 * component has no site page context, so the host web resolves to the tenant
 * root; the data services must target this site explicitly. Leave empty to fall
 * back to the host web (e.g. the SharePoint workbench).
 *
 * Replace the placeholder below with the site where you provisioned the lists
 * (see `scripts/Provision-Lists.ps1`).
 */
export const KUDOS_SITE_URL = "https://contoso.sharepoint.com/sites/sandboxed";

/** Title of the SharePoint list backing the recognition wall. */
export const KUDOS_LIST_TITLE = "Kudos";

/** Title of the controlled team vocabulary list (Title column shown as "Department"). */
export const DEPARTMENTS_LIST_TITLE = "Departments";

/** Internal field names on the Kudos list (see the provisioning script). */
export const KUDOS_FIELDS = {
  /** Kept for a readable list view; the component reads/writes `message`. */
  title: "Title",
  message: "Message",
  recipient: "Recipient",
  recipientId: "RecipientId",
  giver: "Giver",
  giverId: "GiverId",
  team: "Team",
  type: "KudosType",
  created: "Created",
} as const;

/** The Title field is a summary only — truncate long messages for readability. */
export const TITLE_SUMMARY_MAX = 120;

/** Newest-first page size for the feed. */
export const KUDOS_PAGE_SIZE = 50;

/** Sentinel used by the team dropdown to mean "no department filter". */
export const ALL_TEAMS = "All teams";

/** Number of entries shown in each leaderboard rail. */
export const LEADERBOARD_SIZE = { mostRecognised: 5, topGivers: 3 } as const;

/**
 * Maps the typed KudosValueKey to the SharePoint Choice column's display text
 * and back. This is the single place the two representations meet — components
 * only ever use KudosValueKey.
 */
export const KUDOS_VALUE_CHOICE: Record<KudosValueKey, string> = {
  teamwork: "Teamwork",
  clientImpact: "Client impact",
  innovation: "Innovation",
  extraMile: "Going the extra mile",
};

const CHOICE_TO_KEY: Record<string, KudosValueKey> = Object.entries(
  KUDOS_VALUE_CHOICE,
).reduce(
  (acc, [key, choice]) => ({ ...acc, [choice]: key as KudosValueKey }),
  {} as Record<string, KudosValueKey>,
);

/** Resolve a SharePoint Choice value back to a KudosValueKey (defaults to teamwork). */
export function choiceToKey(choice: string | undefined): KudosValueKey {
  return (choice && CHOICE_TO_KEY[choice]) || "teamwork";
}

/**
 * Server-rendered user photo. Fluent's Avatar falls back to initials when this
 * 404s, so no client-side fallback logic is needed.
 */
export function userPhotoUrl(webAbsoluteUrl: string, upn: string): string {
  return `${webAbsoluteUrl}/_layouts/15/userphoto.aspx?size=M&accountname=${encodeURIComponent(upn)}`;
}
