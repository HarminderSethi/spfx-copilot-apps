/**
 * Tool-argument schema for the Events Copilot Component.
 *
 * Unlike the SPFx webpart's property pane (admin-configured once, persisted),
 * these fields are extracted per-turn by Copilot's LLM from the user's message.
 *
 * Keep boolean/number defaults and numeric bounds in runtime code. The
 * declarative-agent package validator rejects those JSON-schema members, while
 * the string-enum layout default can be represented in the tool contract.
 */
import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

const propertiesSchema = z.object({
  startDateTime: z
    .string()
    .optional()
    .describe(
      'Inclusive UTC start of the event range in ISO 8601 format, such as ' +
      "'2026-08-25T00:00:00Z'. Resolve relative periods in the user's local " +
      'timezone, then convert the boundary to UTC. Set only this property for ' +
      "open-ended requests such as 'after September 1'. Omit it when the user " +
      'does not specify a time filter; when both date properties are omitted, ' +
      'the component starts at today.'
    ),
  endDateTime: z
    .string()
    .optional()
    .describe(
      'Inclusive UTC end of the event range in ISO 8601 format, such as ' +
      "'2026-08-25T23:59:59Z'. Resolve relative periods in the user's local " +
      'timezone, then convert the boundary to UTC. It must not be earlier than ' +
      "startDateTime. Set only this property for open-ended requests such as 'before " +
      "September 1'. Omit it when the user does not specify a time filter; when " +
      'both date properties are omitted, the component ends three months from today.'
    ),
  searchQuery: z
    .string()
    .optional()
    .describe(
      'Free-text keywords that describe the requested event topic or content, such ' +
      "as 'town hall'. Do not include dates, site names, layout words, counts, or " +
      "generic values such as 'all'. Omit this property for an unfiltered search."
    ),
  siteUrl: z
    .string()
    .optional()
    .describe(
      'Absolute SharePoint site URL used to restrict results to that site only. ' +
      'Use it only when an absolute HTTPS URL is available in the request or ' +
      'conversation context. If the user supplies only a site name, ask for the ' +
      'absolute URL instead of guessing. Omit it to search all accessible sites.'
    ),

  layout: z
    .enum(['feature', 'list', 'grid', 'agenda', 'compactList'])
    .default('feature')
    .describe(
      "Expanded-view layout. Omit this property unless the user explicitly requests " +
      "a layout; its default is 'feature'. Requests for 'all', 'all available', " +
      "'every', 'many', or 'upcoming' events do not request a layout. Use 'list' " +
      "only for an explicit 'list' or 'list view' request, " +
      "'agenda' only for an explicit chronological or day-grouped agenda request, " +
      "'grid' only for an explicit grid request, and 'compactList' only for an " +
      "explicit compact or dense list request."
    ),
  layoutWasExplicitlyRequested: z
    .boolean()
    .describe(
      'Set to true only when the user explicitly names or describes a layout. ' +
      "Set to false for ordinary event requests, including 'all available events', " +
      "'show events', or 'upcoming events'. A layout selected or inferred by the " +
      'assistant does not count as an explicit user request.'
    ),
  showLocation: z
    .boolean()
    .optional()
    .describe(
      'Set to false when the user asks to hide or exclude event locations. Set to ' +
      'true when they explicitly ask to show locations. Otherwise omit it; locations ' +
      'are shown by default.'
    ),
  showOrganizer: z
    .boolean()
    .optional()
    .describe(
      'Set to false when the user asks to hide or exclude event organizers. Set to ' +
      'true when they explicitly ask to show organizers. Otherwise omit it; organizers ' +
      'are shown by default.'
    ),
  showDescription: z
    .boolean()
    .optional()
    .describe(
      'Set to true when the user asks to show event descriptions. Set to false when ' +
      'they explicitly ask to hide descriptions. Otherwise omit it; descriptions are ' +
      'hidden by default.'
    ),
  maxEvents: z
    .number()
    .int()
    .optional()
    .describe(
      'Maximum number of events to return, as an integer from 1 through 50. Omit ' +
      'it when the user does not specify a count; the component defaults to 20. ' +
      "When the user asks for 'all', set it to 50 because 50 is the result limit."
    ),
});

export type IEventsCopilotComponentProperties = z.infer<typeof propertiesSchema>;

export default zodToJsonSchema(propertiesSchema);
