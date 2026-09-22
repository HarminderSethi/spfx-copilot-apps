import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

const propertiesSchema = z.object({
  searchQuery: z
    .string()
    .optional()
    .describe(
      'Title keywords or a phrase to search for. Do not include product, status, platform, release phase, cloud instance, dates, counts, or layout words.'
    ),
  roadmapId: z
    .string()
    .optional()
    .describe(
      'The numeric Microsoft 365 roadmap ID when the user requests one specific feature. Omit it for list queries.'
    ),
  products: z
    .array(z.string())
    .optional()
    .describe('Microsoft 365 product names explicitly requested by the user.'),
  statuses: z
    .array(z.enum(['In development', 'Rolling out', 'Launched']))
    .optional()
    .describe('Roadmap lifecycle statuses explicitly requested by the user.'),
  platforms: z
    .array(z.string())
    .optional()
    .describe('Platforms explicitly requested by the user, such as Web, Desktop, Mac, iOS, or Android.'),
  releaseRings: z
    .array(z.string())
    .optional()
    .describe('Release phases explicitly requested by the user, such as Preview, Targeted Release, or General Availability.'),
  cloudInstances: z
    .array(z.string())
    .optional()
    .describe('Cloud instances explicitly requested by the user, such as Worldwide, GCC, GCC High, or DoD.'),
  availabilityFrom: z
    .string()
    .optional()
    .describe('Inclusive feature availability month in YYYY-MM format.'),
  availabilityTo: z
    .string()
    .optional()
    .describe('Inclusive feature availability month in YYYY-MM format.'),
  modifiedFrom: z
    .string()
    .optional()
    .describe('Inclusive ISO 8601 timestamp only when the user asks when roadmap posts were updated or modified.'),
  modifiedTo: z
    .string()
    .optional()
    .describe('Inclusive ISO 8601 upper bound only when the user asks for a modified date range.')
});

export type IM365ProductRoadmapCopilotComponentProperties = z.infer<
  typeof propertiesSchema
>;

export default zodToJsonSchema(propertiesSchema);
