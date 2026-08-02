import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

const propertiesSchema = z.object({
  releaseName: z.string().optional()
    .describe('Release identifier or product name filter, for example "v2.8" or "Commerce API".'),
  owner: z.string().optional()
    .describe('Owner name filter. Use this to focus on checks assigned to a specific person.'),
  showBlockedOnly: z.string().optional()
    .describe('Pass "true" to show only checks currently blocked.'),
  useMock: z.union([z.boolean(), z.string()]).optional()
    .describe('Set to false to load real data from dataServiceUrl. Defaults to true.'),
  dataServiceUrl: z.string().url().optional()
    .describe('HTTPS endpoint returning release readiness JSON payload (array or { releases: [...] }).')
});

export type IReleaseReadinessBoardCopilotComponentProperties = z.infer<typeof propertiesSchema>;

export default zodToJsonSchema(propertiesSchema);
