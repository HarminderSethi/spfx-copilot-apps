import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

const schema = z.object({
  period: z.string().optional().describe('period extracted from the user request when provided.'),
  product: z.string().optional().describe('product extracted from the user request when provided.'),
  focus: z.string().optional().describe('focus extracted from the user request when provided.'),
  selectedId: z.string().optional().describe('selectedId extracted from the user request when provided.')
});
export type IExploreRecurringServiceDriversCopilotComponentProperties = z.infer<typeof schema>;
export default zodToJsonSchema(schema);
