import {
  createCopilotTextContent,
  type ISPCopilotBridge,
} from "@microsoft/sp-copilot-component";
export const GUIDANCE_MESSAGES = {
  initial:
    'Guide the user through discovering Microsoft 365 roadmap changes. Suggesting prompts for common queries like "What\'s coming to Teams next month?" or "Show Outlook features that are rolling out." and expand their search using filters for product, status, or release date. ',

  fullscreen:
    "Guide the user through discovering Microsoft 365 roadmap changes. using the fullscreen view to explore all results and apply filters for product, status, or release date.",

  compact: "Suggest the user with new prompts",

  error:
    "I couldn't load the roadmap data. You can retry or ask me something else about Microsoft 365 updates.",
} as const;

export const useCopilotGuidance = (bridge: ISPCopilotBridge): { GUIDANCE_MESSAGES: typeof GUIDANCE_MESSAGES; sendGuidanceMessage: (message: string) => Promise<void> } => {
  // Placeholder for Copilot guidance hook logic
  // New Feature available on SPFx 1.24.beta4 
  // Guidance messages for different states
  const GUIDANCE_MESSAGES = {
    initial:
      'Guide the user through discovering Microsoft 365 roadmap changes. Suggesting prompts for common queries like "What\'s coming to Teams next month?" or "Show Outlook features that are rolling out." and expand their search using filters for product, status, or release date. ',

    fullscreen:
      "Guide the user through discovering Microsoft 365 roadmap changes. using the fullscreen view to explore all results and apply filters for product, status, or release date.",

    compact: "Suggest the user with new prompts",

    error:
      "I couldn't load the roadmap data. You can retry or ask me something else about Microsoft 365 updates.",
  } as const;

   //  check sendFollowUpMessageAsync  to see how it works
  const sendGuidanceMessage = async (message: string): Promise<void> => {
    try {
      const content = [createCopilotTextContent(message)];
      const result = await bridge.sendFollowUpMessageAsync(content);

      if (result.isError) {
        console.warn(
          "[M365ProductRoadmap] Failed to send guidance message (rejected by host)",
        );
      }
    } catch (sendError) {
      console.warn(
        "[M365ProductRoadmap] Exception sending guidance message:",
        sendError,
      );
    }
  };

  return { GUIDANCE_MESSAGES, sendGuidanceMessage };
};
