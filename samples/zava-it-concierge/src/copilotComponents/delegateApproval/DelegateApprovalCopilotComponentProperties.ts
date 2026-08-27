import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

const propertiesSchema = z.object({
  requestId: z.string().describe("Optional request identifier to delegate.").optional(),
  delegateEmail: z.string().describe("Optional proposed delegate email address.").optional()
});

export type IDelegateApprovalCopilotComponentProperties = z.infer<typeof propertiesSchema>;

export default zodToJsonSchema(propertiesSchema);
