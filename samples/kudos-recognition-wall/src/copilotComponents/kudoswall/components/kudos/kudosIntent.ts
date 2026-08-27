import type { InlineCardMode } from './KudosInlineCard';
import type { KudosSurface } from './KudosApp';

/** Tool arguments the Copilot host passes to the component (see the Zod schema). */
export interface IKudoswallProperties {
  recipient?: string;
  message?: string;
}

/** inline in the conversation, fullscreen when the host expands the canvas. */
export function resolveSurface(displayMode: string | undefined): KudosSurface {
  return displayMode === 'fullscreen' ? 'fullscreen' : 'inline';
}

/** compose when the prompt named a recipient, launcher when it did not. */
export function resolveInlineMode(properties: IKudoswallProperties): InlineCardMode {
  return properties.recipient && properties.recipient.trim() ? 'compose' : 'launcher';
}
