import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

const propertiesSchema = z.object({
});

export type IGetProfileHealthCopilotComponentProperties = z.infer<typeof propertiesSchema>;

export default zodToJsonSchema(propertiesSchema);
