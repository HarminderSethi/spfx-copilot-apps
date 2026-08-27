import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

const propertiesSchema = z.object({
  orderId: z.string().describe("Optional order or shipment identifier.").optional()
});

export type ITrackDeviceShipmentCopilotComponentProperties = z.infer<typeof propertiesSchema>;

export default zodToJsonSchema(propertiesSchema);
