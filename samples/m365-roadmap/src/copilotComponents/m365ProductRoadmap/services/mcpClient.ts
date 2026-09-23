import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import {
  UI_EXTENSION_CAPABILITIES
} from '@mcp-ui/client';
import type { ClientCapabilities } from '@modelcontextprotocol/sdk/types.js';

export const MCP_SERVER_URL: string = 'https://m365roadmap.spteckapps.com/mcp';
export const MCP_TOOL_NAME: string = 'get_recent_m365_roadmaps';

const MAX_CONNECTION_ATTEMPTS: number = 3;
const INITIAL_RETRY_DELAY_MS: number = 1000;

const delay = (duration: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, duration));

const createCapabilities = (): ClientCapabilities => ({
  roots: { listChanged: true },
  extensions: UI_EXTENSION_CAPABILITIES as Record<string, object>
});

const createClient = (): Client =>
  new Client(
    { name: 'm365-product-roadmap-copilot-component', version: '1.0.0' },
    { capabilities: createCapabilities() }
  );

export const createMcpClient = async (): Promise<Client> => {
  let lastError: unknown;

  for (let attempt: number = 0; attempt < MAX_CONNECTION_ATTEMPTS; attempt++) {
    const client: Client = createClient();

    try {
      await client.connect(
        new StreamableHTTPClientTransport(new URL(MCP_SERVER_URL))
      );
      return client;
    } catch (error: unknown) {
      lastError = error;
      await client.close().catch(() => undefined);

      if (attempt < MAX_CONNECTION_ATTEMPTS - 1) {
        await delay(INITIAL_RETRY_DELAY_MS * Math.pow(2, attempt));
      }
    }
  }

  throw lastError;
};
